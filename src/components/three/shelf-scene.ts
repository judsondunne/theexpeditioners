/**
 * The trilogy shelf: three paperbacks rendered in WebGL.
 *
 * The books rest in a stack, spines out. The active book slides out of the
 * stack, turns to face the reader and settles centred on the stage; the
 * others wait in the stack. Selecting a spine (or the HTML tabs)
 * changes the active book, dragging the presented book turns it over to show
 * the real back cover.
 *
 * Framework-agnostic: React mounts it, feeds it state and tears it down.
 */
import * as THREE from "three";
import { observeMotionVisibility } from "@/lib/motion";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface ShelfBook {
  id: string;
  front: string;
  back?: string;
  /** Trim size and thickness in inches; thickness comes from the page count. */
  size: { width: number; height: number; thickness: number };
  spine: {
    background: string;
    ink: string;
    accent: string;
    author: string;
    series: string;
    title: string;
    number: number;
  };
}

export interface ShelfFonts {
  display: string;
  serif: string;
  mono: string;
}

export interface ShelfOptions {
  container: HTMLElement;
  books: ShelfBook[];
  active: number;
  reducedMotion: boolean;
  fonts: ShelfFonts;
  /** One book, presented on its own (book pages). No stack, no intro flight. */
  single?: boolean;
  onActivateBook?: (index: number) => void;
  onSelect?: (index: number) => void;
  onReady?: () => void;
  onError?: (error: unknown) => void;
  signal?: AbortSignal;
}

export interface ShelfHandle {
  setActive: (index: number) => void;
  setVisible: (visible: boolean) => void;
  destroy: () => void;
}

const UNIT = 0.1; // scene units per inch
/** Cover card thickness in scene units — about 3× true so it still reads on screen. */
const COVER_T = 0.004;

type Layout = {
  stack: THREE.Vector3; // centre of the stack
  stackYaw: number;
  stackScale: number;
  stage: THREE.Vector3;
  stageScale: number;
  camera: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
};

function layoutFor(aspect: number, single = false): Layout {
  if (single) {
    return {
      stack: new THREE.Vector3(0, -2.5, -1),
      stackYaw: 0,
      stackScale: 1,
      stage: new THREE.Vector3(0, -0.02, 0.18),
      stageScale: aspect < 0.9 ? 1.05 : 1.2,
      camera: new THREE.Vector3(0, 0.36, 2.75),
      target: new THREE.Vector3(0, 0, 0),
      fov: aspect < 0.9 ? 34 : 30,
    };
  }
  if (aspect < 0.9) {
    // Portrait / phones: stack above, stage below.
    return {
      stack: new THREE.Vector3(0, 0.6, -0.05),
      stackYaw: 0,
      stackScale: 1.22,
      stage: new THREE.Vector3(0, -0.3, 0.2),
      stageScale: 0.92,
      camera: new THREE.Vector3(0, 0.42, 3.2),
      target: new THREE.Vector3(0, 0.1, 0),
      fov: 36,
    };
  }
  const wide = aspect > 1.9;
  return {
    stack: new THREE.Vector3(wide ? -0.62 : -0.5, 0.02, -0.04),
    stackYaw: -0.22,
    stackScale: 1,
    stage: new THREE.Vector3(wide ? 0.44 : 0.36, 0.0, 0.28),
    stageScale: 1.06,
    camera: new THREE.Vector3(0, 0.46, 2.75),
    target: new THREE.Vector3(0, 0, 0),
    fov: 30,
  };
}

/* ------------------------------------------------------------- textures */

function cssVarFont(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

/** Fine page edges: hundreds of hairline leaves with a little irregularity. */
function pageEdgeTexture(across: "u" | "v", leaves: number): THREE.CanvasTexture {
  const n = 512;
  const { c, ctx } = makeCanvas(across === "u" ? n : 64, across === "u" ? 64 : n);
  ctx.fillStyle = "#efe6d3";
  ctx.fillRect(0, 0, c.width, c.height);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < leaves; i++) {
    const t = (i / leaves) * n + rand() * 0.8;
    const shade = 150 + Math.floor(rand() * 60);
    ctx.fillStyle = `rgba(${shade - 30},${shade - 45},${shade - 70},${0.12 + rand() * 0.18})`;
    if (across === "u") ctx.fillRect(t, 0, 0.7, c.height);
    else ctx.fillRect(0, t, c.width, 0.7);
  }
  // slight darkening toward the covers, where fingers and light don't reach
  const g =
    across === "u" ? ctx.createLinearGradient(0, 0, c.width, 0) : ctx.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(0, "rgba(90,70,50,0.28)");
  g.addColorStop(0.08, "rgba(90,70,50,0)");
  g.addColorStop(0.92, "rgba(90,70,50,0)");
  g.addColorStop(1, "rgba(90,70,50,0.28)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Spine artwork. The background continues the edge colours of the real front
 * and back covers (as a wraparound would); the type follows the series'
 * condensed caps. Drawn landscape, then rotated so it maps straight onto the
 * spine face (book top = image top, text reads top-to-bottom).
 */
function spineTexture(
  book: ShelfBook,
  front: HTMLImageElement,
  back: HTMLImageElement | null,
  fonts: ShelfFonts,
): THREE.CanvasTexture {
  const L = 2048;
  const T = Math.max(96, Math.round((book.size.thickness / book.size.height) * L));
  const { c: a, ctx } = makeCanvas(L, T);
  const s = book.spine;

  // Wraparound colour: back cover's right edge on one side, front cover's left edge on the other.
  ctx.fillStyle = s.background;
  ctx.fillRect(0, 0, L, T);
  const sample = (img: HTMLImageElement, fromRight: boolean, y: number, h: number) => {
    const sw = Math.max(2, Math.round(img.naturalWidth * 0.035));
    const sx = fromRight ? img.naturalWidth - sw : 0;
    // rotate the vertical strip into the landscape spine
    ctx.save();
    ctx.translate(0, y + h);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(img, sx, 0, sw, img.naturalHeight, 0, 0, h, L);
    ctx.restore();
  };
  // landscape top edge = front-cover side of the spine, bottom edge = back-cover side
  ctx.globalAlpha = 0.85;
  sample(front, false, 0, back ? T / 2 : T);
  if (back) sample(back, true, T / 2, T / 2);
  ctx.globalAlpha = 1;
  // soften the sampled strip into a printed-colour field
  const blurred = makeCanvas(L / 16, Math.max(6, Math.round(T / 16)));
  blurred.ctx.drawImage(a, 0, 0, blurred.c.width, blurred.c.height);
  ctx.globalAlpha = 0.75;
  ctx.drawImage(blurred.c, 0, 0, L, T);
  ctx.globalAlpha = 1;
  ctx.fillStyle = s.background;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(0, 0, L, T);
  ctx.globalAlpha = 1;

  // paper-tooth noise
  const noise = ctx.getImageData(0, 0, L, T);
  for (let i = 0; i < noise.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    noise.data[i] += n;
    noise.data[i + 1] += n;
    noise.data[i + 2] += n;
  }
  ctx.putImageData(noise, 0, 0);

  const mid = T / 2;
  ctx.fillStyle = s.ink;
  ctx.textBaseline = "middle";

  // Author, near the top of the spine
  const authorSize = Math.round(T * 0.2);
  ctx.font = `500 ${authorSize}px ${fonts.serif}`;
  ctx.letterSpacing = `${Math.round(T * 0.04)}px`;
  const authorX = L * 0.04;
  const authorW = ctx.measureText(s.author.toUpperCase()).width;
  ctx.fillText(s.author.toUpperCase(), authorX, mid);
  ctx.letterSpacing = "0px";

  // Series number in a ring, at the foot (where a publisher's mark would sit)
  const r = T * 0.24;
  const cx = L - L * 0.05;

  // Series name + title, fitted between the author and the ring
  const left = authorX + authorW + T * 0.6;
  const right = cx - r - T * 0.6;
  const gap = T * 0.25;
  let seriesSize = T * 0.5;
  let titleSize = T * 0.24;
  const measure = () => {
    ctx.font = `400 ${Math.round(seriesSize)}px ${fonts.display}`;
    const sw = ctx.measureText(s.series.toUpperCase()).width;
    ctx.font = `italic 400 ${Math.round(titleSize)}px ${fonts.serif}`;
    const tw = ctx.measureText(s.title).width;
    return { sw, tw, total: sw + gap + tw };
  };
  let m = measure();
  if (m.total > right - left) {
    const k = (right - left) / m.total;
    seriesSize *= k;
    titleSize *= k;
    m = measure();
  }
  let x = left + (right - left - m.total) / 2;
  ctx.font = `400 ${Math.round(seriesSize)}px ${fonts.display}`;
  ctx.fillText(s.series.toUpperCase(), x, mid + T * 0.02);
  x += m.sw + gap;
  ctx.font = `italic 400 ${Math.round(titleSize)}px ${fonts.serif}`;
  ctx.fillText(s.title, x, mid + T * 0.01);

  ctx.strokeStyle = s.accent;
  ctx.lineWidth = Math.max(2, T * 0.025);
  ctx.beginPath();
  ctx.arc(cx, mid, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = s.accent;
  ctx.font = `500 ${Math.round(T * 0.24)}px ${fonts.mono}`;
  ctx.textAlign = "center";
  ctx.fillText(String(s.number), cx, mid + T * 0.01);
  ctx.textAlign = "left";

  // Hairline rules framing the title block
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = s.ink;
  ctx.fillRect(left - T * 0.3, T * 0.18, 1.5, T * 0.64);
  ctx.fillRect(right + T * 0.3, T * 0.18, 1.5, T * 0.64);
  ctx.globalAlpha = 1;

  // rotate to portrait: image top = top of book, reading downwards
  const { c: p, ctx: pctx } = makeCanvas(T, L);
  pctx.translate(T, 0);
  pctx.rotate(Math.PI / 2);
  pctx.drawImage(a, 0, 0);

  const tex = new THREE.CanvasTexture(p);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function textureFromImage(img: HTMLImageElement, maxAniso: number) {
  const t = new THREE.Texture(img);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  t.needsUpdate = true;
  return t;
}

/* ---------------------------------------------------------- geometry */

interface BookRig {
  group: THREE.Group;
  pivot: THREE.Group; // drag-to-turn rotation lives here
  materials: THREE.MeshPhysicalMaterial[];
  pageMaterials: THREE.MeshStandardMaterial[];
  height: number;
  thickness: number;
  p: number; // 0 = in the stack, 1 = presented
  v: number;
  hover: number;
  hoverV: number;
  dim: number;
  yaw: number;
  yawV: number;
  yawTarget: number;
}

function buildBook(
  book: ShelfBook,
  front: THREE.Texture,
  back: THREE.Texture | null,
  spine: THREE.Texture,
  edgeU: THREE.Texture,
  edgeV: THREE.Texture,
): BookRig {
  const W = book.size.width * UNIT;
  const H = book.size.height * UNIT;
  const D = book.size.thickness * UNIT;
  const ct = COVER_T;

  const coverMat = (map: THREE.Texture | null, color?: string) =>
    new THREE.MeshPhysicalMaterial({
      ...(map ? { map } : {}),
      color: color ?? "#ffffff",
      roughness: 0.52,
      metalness: 0,
      clearcoat: 0.32,
      clearcoatRoughness: 0.42,
    });
  const edgeColor = book.spine.background;

  const frontMat = coverMat(front);
  // remember each material's own colour so dimming can scale it rather than replace it
  const backMat = back ? coverMat(back) : coverMat(null, edgeColor);
  const spineMat = coverMat(spine);
  const boardEdge = coverMat(null, edgeColor);
  const paperEdgeU = new THREE.MeshStandardMaterial({ map: edgeU, roughness: 0.92, metalness: 0 });
  const paperEdgeV = new THREE.MeshStandardMaterial({ map: edgeV, roughness: 0.92, metalness: 0 });
  const paperFlat = new THREE.MeshStandardMaterial({ color: "#efe6d3", roughness: 0.95 });

  const group = new THREE.Group();
  const pivot = new THREE.Group();
  group.add(pivot);

  // BoxGeometry face order: +x, -x, +y, -y, +z, -z
  const frontBoard = new THREE.Mesh(new THREE.BoxGeometry(W, H, ct), [
    boardEdge,
    boardEdge,
    boardEdge,
    boardEdge,
    frontMat,
    paperFlat,
  ]);
  frontBoard.position.z = D / 2 - ct / 2;

  const backBoard = new THREE.Mesh(new THREE.BoxGeometry(W, H, ct), [
    boardEdge,
    boardEdge,
    boardEdge,
    boardEdge,
    paperFlat,
    backMat,
  ]);
  backBoard.position.z = -D / 2 + ct / 2;

  const spineBoard = new THREE.Mesh(new THREE.BoxGeometry(ct, H, D), [
    boardEdge,
    spineMat,
    boardEdge,
    boardEdge,
    boardEdge,
    boardEdge,
  ]);
  spineBoard.position.x = -W / 2 + ct / 2;

  // The text block sits a hair inside the covers.
  const inset = 0.0016;
  const pages = new THREE.Mesh(new THREE.BoxGeometry(W - ct - inset, H - inset * 2, D - ct * 2), [
    paperEdgeU,
    paperFlat,
    paperEdgeV,
    paperEdgeV,
    paperFlat,
    paperFlat,
  ]);
  pages.position.x = ct / 2 - inset / 2;

  for (const m of [frontBoard, backBoard, spineBoard, pages]) {
    m.castShadow = true;
    m.receiveShadow = true;
    pivot.add(m);
  }

  const materials = [frontMat, backMat, spineMat, boardEdge];
  for (const m of [...materials, paperEdgeU, paperEdgeV, paperFlat]) m.userData.base = m.color.clone();

  return {
    group,
    pivot,
    materials,
    pageMaterials: [paperEdgeU, paperEdgeV, paperFlat],
    height: H,
    thickness: D,
    p: 0,
    v: 0,
    hover: 0,
    hoverV: 0,
    dim: 1,
    yaw: 0,
    yawV: 0,
    yawTarget: 0,
  };
}

/* ------------------------------------------------------------- scene */

export async function createShelf(opts: ShelfOptions): Promise<ShelfHandle> {
  const { container, books } = opts;
  if (opts.signal?.aborted) throw new DOMException("Book view cancelled", "AbortError");
  // Finish asynchronous dependencies before allocating a GPU context.
  const images = await Promise.all(books.map(async book => {
    const [front, back] = await Promise.all([loadImage(book.front), book.back ? loadImage(book.back).catch(() => null) : Promise.resolve(null)]);
    return { front, back };
  }));
  try {
    await document.fonts?.ready;
    await Promise.all([
      document.fonts?.load(`400 64px ${opts.fonts.display}`),
      document.fonts?.load(`italic 400 32px ${opts.fonts.serif}`),
      document.fonts?.load(`500 32px ${opts.fonts.serif}`),
      document.fonts?.load(`500 32px ${opts.fonts.mono}`),
    ]);
  } catch { /* retain system-font fallback */ }
  if (opts.signal?.aborted) throw new DOMException("Book view cancelled", "AbortError");

  let active = opts.active;
  let visible = true;
  let destroyed = false;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.touchAction = "pan-y";
  canvas.style.outline = "none";

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  const envTex = environment.texture;
  room.dispose();
  scene.environment = envTex;
  scene.environmentIntensity = 0.5;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);

  const key = new THREE.DirectionalLight("#fff0d8", 2.4);
  key.position.set(-1.6, 2.8, 2.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -1.6;
  key.shadow.camera.right = 1.6;
  key.shadow.camera.top = 1.6;
  key.shadow.camera.bottom = -1.6;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 8;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.012;
  key.shadow.radius = 4;
  scene.add(key);

  // A cool rim from behind: the faint "signal" glow of the old machines.
  const rim = new THREE.DirectionalLight("#7fe6f2", 1.1);
  rim.position.set(2.4, 1.0, -1.8);
  scene.add(rim);
  const fill = new THREE.DirectionalLight("#ffd9b0", 0.35);
  fill.position.set(1.8, -0.6, 2.2);
  scene.add(fill);

  // --- textures
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  const disposables: { dispose: () => void }[] = [environment, pmrem];
  const rigs: BookRig[] = books.map((b, i) => {
    const front = textureFromImage(images[i].front, maxAniso);
    const back = images[i].back ? textureFromImage(images[i].back as HTMLImageElement, maxAniso) : null;
    const spine = spineTexture(b, images[i].front, images[i].back, opts.fonts);
    const leaves = Math.round(b.size.thickness * 220);
    const edgeU = pageEdgeTexture("u", leaves);
    const edgeV = pageEdgeTexture("v", leaves);
    disposables.push(front, spine, edgeU, edgeV);
    if (back) disposables.push(back);
    const rig = buildBook(b, front, back, spine, edgeU, edgeV);
    rig.group.userData.index = i;
    rig.group.traverse((o) => (o.userData.index = i));
    scene.add(rig.group);
    return rig;
  });

  // --- poses
  let needsFrame = true;
  let raf = 0;
  let layout = layoutFor(1.6);
  const qStack = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(
      new THREE.Vector3(0, 0, -1), // local +x (spine → fore-edge) points away
      new THREE.Vector3(-1, 0, 0), // local +y (top of book) points left
      new THREE.Vector3(0, 1, 0), // local +z (front cover) faces up
    ),
  );
  const qPresentBase = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.06, 0.34, 0.015, "YXZ"));
  const tmpQ = new THREE.Quaternion();
  const qYaw = new THREE.Quaternion();
  const qTilt = new THREE.Quaternion();
  const qPresentTmp = new THREE.Quaternion();
  const tiltEuler = new THREE.Euler();
  const tmpV = new THREE.Vector3();
  const yawAxis = new THREE.Vector3(0, 1, 0);

  const gap = 0.05;
  function slotPosition(i: number, out: THREE.Vector3) {
    const total = rigs.reduce((s, r) => s + r.thickness, 0) + gap * (rigs.length - 1);
    let y = total / 2;
    for (let k = 0; k < i; k++) y -= rigs[k].thickness + gap;
    y -= rigs[i].thickness / 2;
    out.set(0, y * layout.stackScale, 0);
    out.applyAxisAngle(yawAxis, layout.stackYaw);
    return out.add(layout.stack);
  }

  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    layout = layoutFor(camera.aspect, opts.single);
    camera.fov = layout.fov;
    camera.position.copy(layout.camera);
    camera.lookAt(layout.target);
    camera.updateProjectionMatrix();
    needsFrame = true;
    requestFrame();
  }

  container.appendChild(canvas);
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // --- interaction
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(9, 9);
  const pickTargets = rigs.map(rig => rig.group);
  const intersections: THREE.Intersection[] = [];
  const parallax = new THREE.Vector2(0, 0);
  const parallaxTarget = new THREE.Vector2(0, 0);
  let hovered = -1;
  let drag: null | { x: number; startYaw: number; moved: boolean; index: number } = null;

  const pick = (): number => {
    raycaster.setFromCamera(pointer, camera);
    intersections.length = 0;
    const hits = raycaster.intersectObjects(pickTargets, true, intersections);
    return hits.length ? (hits[0].object.userData.index as number) : -1;
  };

  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    parallaxTarget.set(pointer.x, pointer.y);
    if (drag) {
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      rigs[drag.index].yawTarget = drag.startYaw + dx * 0.012;
      needsFrame = true;
      requestFrame();
      return;
    }
    const idx = pick();
    hovered = idx;
    requestFrame();
    canvas.style.cursor = idx >= 0 ? (idx === active ? "grab" : "pointer") : "default";
    needsFrame = true;
  }

  function onPointerLeave() {
    hovered = -1;
    pointer.set(9, 9);
    parallaxTarget.set(0, 0);
    canvas.style.cursor = "default";
    needsFrame = true;
    requestFrame();
  }

  function onPointerDown(e: PointerEvent) {
    onPointerMove(e);
    const idx = pick();
    if (idx < 0) return;
    if (idx !== active) {
      opts.onActivateBook?.(idx);
      return;
    }
    drag = { x: e.clientX, startYaw: rigs[idx].yawTarget, moved: false, index: idx };
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  }

  function onPointerUp(e: PointerEvent) {
    if (!drag) return;
    const d = drag;
    drag = null;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    const r = rigs[d.index];
    if (!d.moved) {
      if (e.pointerType === "mouse") opts.onSelect?.(d.index);
      return;
    }
    // settle on whichever face is nearer: front or back
    const turns = Math.round(r.yawTarget / Math.PI);
    r.yawTarget = turns * Math.PI;
    needsFrame = true;
    requestFrame();
    canvas.style.cursor = "grab";
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  // --- animation
  const timer = new THREE.Timer();
  timer.connect(document);
  let introAt = performance.now() + (opts.reducedMotion ? 0 : 450);
  let introDone = opts.reducedMotion || Boolean(opts.single);
  if (opts.single) rigs.forEach((r) => (r.p = 1));

  function spring(x: number, v: number, target: number, dt: number, k: number, damping: number) {
    const a = k * (target - x) - damping * v;
    v += a * dt;
    x += v * dt;
    return [x, v] as const;
  }

  function requestFrame() {
    if (!destroyed && visible && !document.hidden && !raf) raf = requestAnimationFrame(frame);
  }
  function frame() {
    raf = 0;
    if (destroyed || !visible || document.hidden) return;
    timer.update();
    const dt = Math.min(timer.getDelta(), 1 / 30);
    const t = timer.getElapsed();
    if (!introDone && performance.now() > introAt) introDone = true;

    parallax.lerp(parallaxTarget, opts.reducedMotion ? 1 : 1 - Math.pow(0.001, dt));

    let moving = false;
    rigs.forEach((r, i) => {
      const isActive = introDone && i === active;
      const target = isActive ? 1 : 0;
      if (opts.reducedMotion) {
        r.p = target;
        r.v = 0;
      } else {
        [r.p, r.v] = spring(r.p, r.v, target, dt, 70, 15.5);
      }
      const hoverT = hovered === i && !isActive ? 1 : 0;
      [r.hover, r.hoverV] = opts.reducedMotion ? [hoverT, 0] : spring(r.hover, r.hoverV, hoverT, dt, 180, 22);
      if (!isActive && !drag) r.yawTarget = 0;
      [r.yaw, r.yawV] = opts.reducedMotion ? [r.yawTarget, 0] : spring(r.yaw, r.yawV, r.yawTarget, dt, 60, 12);
      const dimTarget = isActive ? 1 : 0.78;
      r.dim = opts.reducedMotion ? dimTarget : r.dim + (dimTarget - r.dim) * Math.min(1, dt * 6);

      const p = THREE.MathUtils.clamp(r.p, -0.05, 1.08);
      const pe = THREE.MathUtils.clamp(p, 0, 1);
      // position: slot → stage along an arc that first pulls the book out toward the reader
      const from = slotPosition(i, tmpV);
      from.z += r.hover * 0.07;
      from.x += r.hover * 0.025;
      const pos = from.lerp(layout.stage, pe);
      pos.z += Math.sin(Math.PI * pe) * 0.32;
      pos.y += Math.sin(Math.PI * pe) * 0.06;
      if (!opts.reducedMotion) {
        pos.y += Math.sin(t * 0.9 + i * 1.7) * 0.006 * (1 - pe * 0.4);
      }
      r.group.position.copy(pos);

      // rotation: stack pose → presented pose, then parallax + drag yaw
      const qSlot = tmpQ.copy(qStack).premultiply(qYaw.setFromAxisAngle(yawAxis, layout.stackYaw));
      qTilt.setFromEuler(tiltEuler.set(-parallax.y * 0.12, parallax.x * 0.22, 0, "YXZ"));
      const qPresent = qPresentTmp.copy(qPresentBase).premultiply(qTilt);
      r.group.quaternion.slerpQuaternions(qSlot, qPresent, pe);
      r.pivot.rotation.y = r.yaw;
      const sc = THREE.MathUtils.lerp(layout.stackScale, layout.stageScale, pe);
      r.group.scale.setScalar(sc * (1 + r.hover * .035));

      for (const m of r.materials) m.color.copy(m.userData.base as THREE.Color).multiplyScalar(r.dim);
      for (const m of r.pageMaterials)
        m.color.copy(m.userData.base as THREE.Color).multiplyScalar(0.55 + 0.45 * r.dim);

      if (Math.abs(r.v) > 0.0005 || Math.abs(r.p - target) > 0.001 || Math.abs(r.yawV) > 0.001) moving = true;
    });

    if (moving || needsFrame || !opts.reducedMotion) {
      renderer.render(scene, camera);
      needsFrame = false;
    }
    if (!opts.reducedMotion || moving) requestFrame();
  }

  // first frame, then announce readiness
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  opts.onReady?.();
  const stopVisibility = observeMotionVisibility(container, active => {
    visible = active;
    if (active) { timer.reset(); requestFrame(); }
    else { cancelAnimationFrame(raf); raf = 0; }
  }, "100px");
  const lost = (event: Event) => {
    event.preventDefault();
    destroy();
    opts.onError?.(new Error("Book graphics context lost"));
  };
  canvas.addEventListener("webglcontextlost", lost);
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(raf);
    stopVisibility();
    ro.disconnect();
    canvas.removeEventListener("webglcontextlost", lost);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    const resources = new Set<{ dispose: () => void }>(disposables);
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) {
        resources.add(object.geometry);
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => resources.add(material));
      }
    });
    resources.forEach(resource => resource.dispose());
    timer.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }
  requestFrame();

  return {
    setActive(index: number) {
      if (index === active || index < 0 || index >= rigs.length) return;
      rigs[active].yawTarget = 0;
      active = index;
      introDone = true;
      introAt = 0;
      needsFrame = true;
      requestFrame();
    },
    setVisible(v: boolean) {
      visible = v;
      if (v) { timer.reset(); requestFrame(); }
      else { cancelAnimationFrame(raf); raf = 0; }
    },
    destroy,
  };
}

export { cssVarFont };
