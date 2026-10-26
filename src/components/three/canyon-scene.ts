import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { MapPlace } from "@/components/explore/MapRoom";

export type CanyonHandle = {
  focus: (index: number) => void;
  zoom: (amount: number) => void;
  reset: () => void;
  top: () => void;
  destroy: () => void;
};

// The two watercourses follow the bends on Roy's jacket map. Elevation is an
// artistic reconstruction, not a claim to a surveyed height field.
const azure = [[.055,.015],[.1,.065],[.145,.075],[.19,.13],[.26,.19],[.33,.225],[.4,.24],[.5,.225],[.59,.21],[.65,.205],[.695,.22],[.72,.29],[.77,.32],[.83,.28],[.88,.30],[.93,.34],[.97,.235]];
const drowned = [[.19,.13],[.16,.22],[.11,.27],[.09,.36],[.12,.45],[.155,.555],[.2,.61]];
const toWorld = (x: number, y: number) => new THREE.Vector3((x - .5) * 26, 0, (y / .62 - .5) * 15);
const makeCurve = (points: number[][]) => new THREE.CatmullRomCurve3(points.map(([x, y]) => toWorld(x, y)));
const curves = [makeCurve(azure), makeCurve(drowned)];
const riverPoints = curves.flatMap(curve => curve.getPoints(220));

function noise(x: number, z: number) {
  const hash = (a: number, b: number) => { const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n); };
  const ix=Math.floor(x), iz=Math.floor(z), fx=x-ix, fz=z-iz;
  const u=fx*fx*(3-2*fx),v=fz*fz*(3-2*fz);
  return THREE.MathUtils.lerp(THREE.MathUtils.lerp(hash(ix,iz),hash(ix+1,iz),u),THREE.MathUtils.lerp(hash(ix,iz+1),hash(ix+1,iz+1),u),v);
}
function terrainHeight(x: number, z: number) {
  let distance = Infinity;
  for (const p of riverPoints) {
    const d = (p.x - x) ** 2 + (p.z - z) ** 2;
    if (d < distance) distance = d;
  }
  distance = Math.sqrt(distance);
  const broad=noise(x*.65,z*.65),medium=noise(x*1.8,z*1.8),fine=noise(x*5,z*5);
  const ridges=Math.abs(Math.sin(x*2.2+Math.sin(z*2.8)*.65));
  const plateau=1.7 + broad*.85 + medium*.26 + fine*.08;
  const cut=distance*(1+(medium-.5)*.38);
  const valley = 1 - Math.exp(-Math.pow(cut / .75, 1.55));
  const slope=Math.exp(-Math.pow((distance-.7)/.6,2));
  let h=.06+plateau*valley+slope*(ridges-.5)*.15;
  // Four summits and the broken ridges between them, softened into the table.
  for (const [px, py, strength] of [[.12,.145,1.6],[.375,.38,1.8],[.595,.38,1.9],[.893,.473,2.2]]) {
    const p=toWorld(px,py), d=(x-p.x)**2+(z-p.z)**2;
    h+=strength*Math.exp(-d/2.0)*valley*(.8+medium*.4);
  }
  return Math.max(.04,h);
}

export function createCanyon({ container, places, markers, onFailure, compact = false }: {
  container: HTMLElement;
  places: readonly MapPlace[];
  markers: (HTMLButtonElement | null)[];
  onFailure: () => void;
  compact?: boolean;
}): CanyonHandle {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#21151a");
  scene.fog = new THREE.FogExp2("#21151a", .012);
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 160);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  container.prepend(canvas);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = .09;
  controls.enableZoom = true;
  controls.zoomSpeed = .65;
  controls.enablePan = true;
  controls.minDistance = 5;
  controls.maxDistance = 75;
  controls.minPolarAngle = .04;
  controls.maxPolarAngle = Math.PI * .46;
  controls.touches.ONE = THREE.TOUCH.ROTATE;
  controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
  canvas.style.touchAction = "none";
  // OrbitControls supports mouse-wheel, trackpad pinch and two-finger dolly.
  if (window.matchMedia("(pointer: coarse)").matches) controls.touches.ONE = THREE.TOUCH.PAN;
  scene.add(new THREE.HemisphereLight("#f8e4b7", "#3a1525", 2.9));
  const sun = new THREE.DirectionalLight("#ffe7b1", 4.5);
  sun.position.set(-10, 20, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 15, bottom: -15 });
  sun.shadow.bias = -.001;
  scene.add(sun);
  const rim = new THREE.DirectionalLight("#b26057", 2);
  rim.position.set(10, 6, -15);
  scene.add(rim);

  const landscape = new THREE.Group();
  scene.add(landscape);
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .94, metalness: .02 });
  const detailed = container.clientWidth >= 700;
  const geo = new THREE.PlaneGeometry(26, 15, detailed ? 270 : 180, detailed ? 156 : 104);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const sand = new THREE.Color("#d4b58a"), clay = new THREE.Color("#8b4046"), shadow = new THREE.Color("#512532");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i), h = terrainHeight(x, z);
    pos.setY(i, h);
    const band = Math.sin(h * 22 + Math.sin(x * .7 + z) * .5) * .025;
    const mix = THREE.MathUtils.smoothstep(h, .3, 2.6);
    c.copy(shadow).lerp(clay, Math.min(1, h * .95)).lerp(sand, mix * .85 + band);
    const grain = Math.sin(x * 83.1 + z * 127.7) * Math.cos(x * 67.3 - z * 111.4) * .025;
    c.offsetHSL(0, 0, grain);
    c.toArray(colors, i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const inkMap = new THREE.TextureLoader().load("/images/art/book1-jacket-map.webp", () => { if (destroyed) return; material.map = inkMap; material.needsUpdate = true; request(); });
  inkMap.colorSpace = THREE.SRGBColorSpace;
  inkMap.repeat.set(1, .62);
  inkMap.offset.set(0, .38);
  inkMap.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const ground = new THREE.Mesh(geo, material);
  ground.receiveShadow = true; ground.castShadow = true;
  landscape.add(ground);

  // A continuous cut edge roots the relief in its brass surveying table.
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: "#64343a", roughness: .9 });
  for (const side of [0,1,2,3]) {
    const verts: number[] = [], indices: number[] = [];
    for (let i=0;i<=200;i++) {
      const t=i/200;
      const x=side===0?-13:side===1?13:-13+t*26;
      const z=side===2?-7.5:side===3?7.5:-7.5+t*15;
      verts.push(x,terrainHeight(x,z),z,x,-.48,z);
      if(i<200){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
    }
    const edge=new THREE.BufferGeometry();
    edge.setAttribute("position",new THREE.Float32BufferAttribute(verts,3));edge.setIndex(indices);edge.computeVertexNormals();
    const wall=new THREE.Mesh(edge,edgeMaterial);wall.material.side=THREE.DoubleSide;landscape.add(wall);
  }
  const brass = new THREE.MeshStandardMaterial({ color: "#a67d46", roughness: .45, metalness: .65 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(26.4,.18,15.4),brass);
  base.position.y=-.58;landscape.add(base);
  const under = new THREE.Mesh(new THREE.BoxGeometry(26.6,.3,15.6),new THREE.MeshStandardMaterial({color:"#322028",roughness:.55,metalness:.25}));
  under.position.y=-.82;landscape.add(under);

  // Inlaid survey marks around the table's edge.
  const ticks: number[]=[];
  for(let i=-12;i<=12;i++){ticks.push(i,-.475,7.53,i,-.475,7.65+(i%5===0?.08:0));}
  const tickGeo=new THREE.BufferGeometry();tickGeo.setAttribute("position",new THREE.Float32BufferAttribute(ticks,3));
  landscape.add(new THREE.LineSegments(tickGeo,new THREE.LineBasicMaterial({color:"#e9cf9f"})));

  const waterMat = new THREE.MeshStandardMaterial({color:"#668f8b",metalness:.4,roughness:.3,emissive:"#284345",emissiveIntensity:.18,side:THREE.DoubleSide});
  for (const curve of curves) {
    const verts:number[]=[], indices:number[]=[];
    for(let i=0;i<=400;i++) {
      const p=curve.getPoint(i/400), tangent=curve.getTangent(i/400);
      const width=.105+.025*Math.sin(i*.17);
      verts.push(p.x-tangent.z*width,.16,p.z+tangent.x*width,p.x+tangent.z*width,.16,p.z-tangent.x*width);
      if(i<400){const a=i*2;indices.push(a,a+2,a+1,a+1,a+2,a+3);}
    }
    const riverGeo=new THREE.BufferGeometry();riverGeo.setAttribute("position",new THREE.Float32BufferAttribute(verts,3));riverGeo.setIndex(indices);riverGeo.computeVertexNormals();
    landscape.add(new THREE.Mesh(riverGeo,waterMat));
  }
  // A small cluster of buildings gives Azure City a human scale.
  const city=toWorld(.67,.27);
  const cityMat=new THREE.MeshStandardMaterial({color:"#dfc9a5",roughness:.85});
  for(let i=0;i<12;i++){
    const x=city.x+(i%4)*.16-.25,z=city.z+Math.floor(i/4)*.18;
    const h=.13+(i%3)*.05;
    const building=new THREE.Mesh(new THREE.BoxGeometry(.11,h,.13),cityMat);
    building.position.set(x,terrainHeight(x,z)+h/2,z);building.castShadow=true;landscape.add(building);
  }

  const markerPoints=places.map(place=>{const p=toWorld(place.x,place.y);p.y=terrainHeight(p.x,p.z)+.24;return p;});
  for(const p of markerPoints){
    const pin=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.5,6),brass);pin.position.copy(p);pin.position.y+=.1;landscape.add(pin);
  }
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(180,180),new THREE.MeshStandardMaterial({color:"#21151a",roughness:1}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.1;floor.receiveShadow=true;scene.add(floor);

  let selected=-1;
  let destination: { position: THREE.Vector3; target: THREE.Vector3 } | null=null;
  let visible=true, destroyed=false, frame=0;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  function overview(){
    const aspect=container.clientWidth / Math.max(1,container.clientHeight);
    const distance=Math.max(29,40/aspect);
    return {position:new THREE.Vector3(9,distance*.66,distance),target:new THREE.Vector3(0,.4,0)};
  }
  const initial=overview();camera.position.copy(initial.position);controls.target.copy(initial.target);controls.update();
  const projected=new THREE.Vector3();
  const occupied: { x:number; y:number; w:number }[]=[];
  function render(){
    frame=0;if(destroyed||!visible)return;
    if(destination){
      const speed=reduced.matches?1:.075;
      camera.position.lerp(destination.position,speed);controls.target.lerp(destination.target,speed);
      if(camera.position.distanceTo(destination.position)<.015){destination=null;}
    }
    controls.update();
    renderer.render(scene,camera);
    occupied.length=0;
    markerPoints.forEach((point,i)=>{
      const button=markers[i];if(!button)return;
      projected.copy(point).project(camera);
      const x=(projected.x*.5+.5)*container.clientWidth,y=(-projected.y*.5+.5)*container.clientHeight;
      const inView=projected.z<1 && x>12 && x<container.clientWidth-12 && y>12 && y<container.clientHeight-12;
      // Label offsets spread neighbouring names without moving their pins.
      const label=button.querySelector<HTMLElement>(".canyon-pin-name");
      if(label){
        const w=Math.min(160, label.offsetWidth || 120);
        let dy=0;
        for(let attempt=0;attempt<6;attempt++){
          if(!occupied.some(p=>Math.abs(p.y-(y+dy))<23&&x<p.x+p.w&&x+w>p.x))break;
          dy+=(i%2===0?-1:1)*24;
        }
        label.style.transform=`translateY(${dy}px)`;
        button.style.setProperty("--leader-height",`${Math.abs(dy)}px`);
        button.style.setProperty("--leader-top",`${22+Math.min(0,dy)}px`);
        occupied.push({x,y:y+dy,w});
      }
      button.style.transform=`translate(${x}px,${y}px)`;
      button.style.visibility=inView?"visible":"hidden";
      button.dataset.active=String(i===selected);
    });
    if(destination&&!frame)frame=requestAnimationFrame(render);
  }
  function request(){if(!destroyed&&visible&&!frame)frame=requestAnimationFrame(render);}
  controls.addEventListener("change",request);
  controls.addEventListener("start",()=>{destination=null;});
  function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();request();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(container);resize();
  const observer=new IntersectionObserver(items=>{visible=items[0].isIntersecting;if(visible)request();});observer.observe(container);
  const lost=(e:Event)=>{e.preventDefault();onFailure();};canvas.addEventListener("webglcontextlost",lost);
  const handle: CanyonHandle={
    focus(index){
      selected=index;
      const point=markerPoints[index];if(!point)return;
      const target=point.clone();
      const offset=new THREE.Vector3(5,8,11);
      destination={position:target.clone().add(offset),target};request();
    },
    zoom(amount){const offset=camera.position.clone().sub(controls.target).multiplyScalar(amount);offset.clampLength(5,75);destination={position:controls.target.clone().add(offset),target:controls.target.clone()};request();},
    reset(){selected=-1;destination=overview();request();},
    top(){const height=Math.max(compact?36:32,43/camera.aspect);destination={position:new THREE.Vector3(0,height,.1),target:new THREE.Vector3(0,0,0)};request();},
    destroy(){destroyed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();controls.dispose();canvas.removeEventListener("webglcontextlost",lost);scene.traverse(obj=>{if(obj instanceof THREE.Mesh||obj instanceof THREE.LineSegments){obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>m.dispose());}});inkMap.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();},
  };
  // Markers are HTML controls, so every named location is available by keyboard.

  request();return handle;
}
