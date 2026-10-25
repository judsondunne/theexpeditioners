/**
 * Public-domain drawings used as decorative spot illustrations and plates.
 * Sources: Pearson Scott Foresman line art donated to the public domain via
 * Wikimedia Commons; Thomas Moran prints (Cooper Hewitt, public domain);
 * the anonymous "Flammarion" wood engraving (1888); Scientific American (1890);
 * Popular Science Monthly (1896). Full provenance: docs/ASSET_MANIFEST.md.
 *
 * None of these are illustrations from the books. They are never captioned or
 * presented as series artwork.
 */

export const spots = {
  "compass-rose": { w: 604, h: 599, label: "Compass card" },
  compass: { w: 314, h: 313, label: "Compass" },
  condor: { w: 532, h: 720, label: "Condor" },
  airship: { w: 720, h: 171, label: "Dirigible" },
  zeppelin: { w: 720, h: 393, label: "Airship over a mooring mast" },
  diver: { w: 456, h: 720, label: "Diver in a standard diving dress" },
  "field-glasses": { w: 720, h: 623, label: "Field glasses" },
  globe: { w: 605, h: 719, label: "Terrestrial globe" },
  "grappling-hook": { w: 720, h: 240, label: "Grappling hook" },
  heliograph: { w: 548, h: 720, label: "Heliograph" },
  hourglass: { w: 485, h: 720, label: "Hourglass" },
  hiker: { w: 495, h: 720, label: "Traveller with a knapsack" },
  lantern: { w: 242, h: 720, label: "Lantern" },
  octopus: { w: 687, h: 720, label: "Octopus" },
  pocketwatch: { w: 474, h: 720, label: "Pocket watch" },
  writer: { w: 720, h: 610, label: "Writer with a quill" },
  slug: { w: 720, h: 349, label: "Slug" },
  gear: { w: 720, h: 492, label: "Spur gears" },
  canoe: { w: 544, h: 232, label: "Canoe" },
  paddler: { w: 720, h: 483, label: "Paddler" },
  ship: { w: 720, h: 484, label: "Barque under sail" },
  surveyor: { w: 512, h: 720, label: "Surveyor at a transit" },
  "surveyor-2": { w: 503, h: 720, label: "Surveyor at a transit" },
  theodolite: { w: 405, h: 720, label: "Theodolite" },
  "penny-farthing": { w: 650, h: 720, label: "High-wheel bicycle" },
  typewriter: { w: 720, h: 684, label: "Typewriter" },
} as const;

export type SpotName = keyof typeof spots;

export const plates = {
  "moran-grand-canon": {
    w: 960,
    h: 1409,
    title: "The Grand Cañon of the Colorado",
    credit: "Thomas Moran, 1875. Cooper Hewitt, Smithsonian Design Museum. Public domain.",
  },
  "moran-canon-walls": {
    w: 960,
    h: 1340,
    title: "Walls of the Grand Cañon, Colorado River",
    credit: "Thomas Moran, c. 1875. Cooper Hewitt, Smithsonian Design Museum. Public domain.",
  },
  flammarion: {
    w: 960,
    h: 872,
    title: "A traveller reaches the edge of the world",
    credit: "Wood engraving, from Camille Flammarion, L'atmosphère, 1888. Public domain.",
  },
  "unknown-polar-map": {
    w: 960,
    h: 984,
    title: "Map of the unknown polar regions",
    credit: "Popular Science Monthly, vol. 49, 1896. Public domain.",
  },
  "tabulating-machine-1890": {
    w: 622,
    h: 480,
    title: "Electrical counting machines, 1890",
    credit: "Scientific American, 30 August 1890. Public domain.",
  },
} as const;

export type PlateName = keyof typeof plates;

export const maps = {
  "world-1865": {
    src: "/images/maps/world-1865.webp",
    w: 2200,
    h: 1505,
    credit: "After A. J. Johnson, Johnson's World on Mercator's Projection, 1865. Public domain.",
  },
  "arizona-1889": {
    src: "/images/maps/arizona-1889.webp",
    w: 1300,
    h: 1927,
    credit: "After Rand McNally & Co., Arizona, 1889. Public domain.",
  },
  "rhumb-chart-1751": {
    src: "/images/maps/rhumb-chart-1751.webp",
    w: 1800,
    h: 1075,
    credit: "After a 1751 chart of the Pacific from Anson's voyage. Public domain.",
  },
} as const;
