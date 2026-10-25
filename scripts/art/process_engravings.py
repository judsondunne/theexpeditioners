"""
Turns public-domain line drawings and engravings into web assets.

Spot illustrations (small inked objects scattered through the site) become
trimmed, transparent WebP files whose alpha channel is the ink. The site uses
them as CSS masks, so the same drawing can be printed in ink on paper or in
cream on a dark field.

Plates (larger engravings shown framed, with captions) are converted to
neutral greyscale WebP so they can be multiplied onto the paper colour.

Usage:
    python3 -I scripts/art/process_engravings.py <src_dir> <out_dir>

Provenance for every file lives in src/content/assets.ts and docs/ASSET_MANIFEST.md.
"""

import os
import sys

import numpy as np
from PIL import Image, ImageOps

# id -> (source filename, kind)
SPOTS = {
    "compass-rose": "Compass_Card_(PSF).png",
    "compass": "Compass_(PSF).png",
    "condor": "Condor_(PSF).png",
    "airship": "Dirigible_(PSF).png",
    "zeppelin": "Zeppelin_(PSF).png",
    "diver": "Diving_Suit_(PSF).png",
    "field-glasses": "Field_Glasses_(PSF).png",
    "globe": "Globe_(PSF).png",
    "grappling-hook": "Grappling_hook_(PSF).png",
    "heliograph": "Heliographs_(PSF).png",
    "hourglass": "Hourglass_(PSF).png",
    "hiker": "Knapsack_(PSF).png",
    "lantern": "Lantern_(PSF).png",
    "octopus": "Octopus_(PSF).png",
    "pocketwatch": "Pocketwatch_(PSF).png",
    "writer": "Quill_(PSF).png",
    "slug": "Slug_(PSF).png",
    "gear": "Spur_gear_(PSF).png",
    "canoe": "Canoe_(PSF).png",
    "paddler": "Paddle_(PSF).png",
    "ship": "Bark_-_Ship_(PSF).png",
    "surveyor": "Transit_-_Male_(PSF).png",
    "surveyor-2": "Transit_-_Female_(PSF).png",
    "theodolite": "Theodolite_(PSF).png",
    "penny-farthing": "Ordinary_(PSF).png",
    "typewriter": "Typewriter_(PSF).png",
}

PLATES = {
    "moran-grand-canon": "Print,_The_Grand_Cañon_of_the_Colorado,_March_1875_(CH_18601449).jpg",
    "moran-canon-walls": "Print,_Walls_of_the_Grand_Cañon,_Colorado_River,_ca._1875_(CH_18601455).jpg",
    "flammarion": "FlammarionWoodcut.jpg",
    "unknown-polar-map": "PSM_V49_D338_Map_of_the_unknown_polar_regions.jpg",
    "tabulating-machine-1890": "1890_Census_Hollerith_Electrical_Counting_Machines_Sci_Amer.jpg",
}


def ink_mask(img, lo=0.10, hi=0.72):
    """Alpha = how much ink there is at each pixel (white paper -> 0, black line -> 1)."""
    rgba = img.convert("RGBA")
    bg = Image.new("RGBA", rgba.size, "white")
    bg.alpha_composite(rgba)
    lum = np.asarray(bg.convert("L"), dtype=np.float32) / 255.0
    a = np.clip(((1.0 - lum) - lo) / (hi - lo), 0, 1)
    return a


def trim(a, margin=0.03):
    ys, xs = np.where(a > 0.06)
    if len(xs) == 0:
        return a
    m = int(max(a.shape) * margin)
    y0, y1 = max(0, ys.min() - m), min(a.shape[0], ys.max() + m)
    x0, x1 = max(0, xs.min() - m), min(a.shape[1], xs.max() + m)
    return a[y0:y1, x0:x1]


def save_spot(a, out, max_side=720):
    h, w = a.shape
    s = min(1.0, max_side / max(h, w))
    alpha = Image.fromarray((a * 255).astype(np.uint8), "L")
    if s < 1:
        alpha = alpha.resize((int(w * s), int(h * s)), Image.LANCZOS)
    ink = Image.new("RGBA", alpha.size, (24, 20, 21, 0))
    ink.putalpha(alpha)
    ink.save(out, "WEBP", quality=88, method=6)
    return ink.size


def save_plate(img, out, max_side=1800):
    g = ImageOps.grayscale(img.convert("RGB"))
    g = ImageOps.autocontrast(g, cutoff=(1, 0.5))
    w, h = g.size
    s = min(1.0, max_side / max(w, h))
    if s < 1:
        g = g.resize((int(w * s), int(h * s)), Image.LANCZOS)
    g.save(out, "WEBP", quality=84, method=6)
    return g.size


def main():
    src, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    for key, name in SPOTS.items():
        a = trim(ink_mask(Image.open(os.path.join(src, name))))
        size = save_spot(a, os.path.join(out, f"{key}.webp"))
        print(f'  "{key}": {{ w: {size[0]}, h: {size[1]} }},')
    for key, name in PLATES.items():
        size = save_plate(Image.open(os.path.join(src, name)), os.path.join(out, f"{key}.webp"))
        print(f'  "{key}": {{ w: {size[0]}, h: {size[1]} }}, // plate')


if __name__ == "__main__":
    main()
