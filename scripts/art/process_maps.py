"""
Prepares the public-domain antique maps used as atmosphere on the site.

Each map is reduced to its ink (the pastel hand-colouring is dropped), printed
in a sepia tone on a transparent background, and — for the hero — partly
"dissolved" into blank paper. The dissolved patches are the visual idea of the
series premise: a world whose maps can no longer be trusted.

Usage:
    python3 -I scripts/art/process_maps.py <src_dir> <out_dir>
"""

import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

SEPIA = (74, 55, 38)


def fractal(shape, rng, octaves=5, base=3.0):
    h, w = shape
    out = np.zeros(shape, np.float32)
    amp = 1.0
    for o in range(octaves):
        cells = base * 2**o
        gh, gw = int(cells * h / max(h, w)) + 3, int(cells * w / max(h, w)) + 3
        g = rng.standard_normal((gh, gw)).astype(np.float32)
        z = ndimage.zoom(g, (h / gh, w / gw), order=3)[:h, :w]
        z = np.pad(z, ((0, h - z.shape[0]), (0, w - z.shape[1])), mode="edge")
        out += amp * z
        amp *= 0.5
    return out / (np.abs(out).max() + 1e-6)


def ink_alpha(img, lo=0.16, hi=0.62):
    lum = np.asarray(img.convert("L"), np.float32) / 255.0
    return np.clip(((1 - lum) - lo) / (hi - lo), 0, 1)


def save_rgba(alpha, out, width, colour=SEPIA, quality=72):
    a = Image.fromarray((np.clip(alpha, 0, 1) * 255).astype(np.uint8), "L")
    h = int(a.height * width / a.width)
    a = a.resize((width, h), Image.LANCZOS)
    img = Image.new("RGBA", a.size, colour + (0,))
    img.putalpha(a)
    img.save(out, "WEBP", quality=quality, alpha_quality=quality, method=6)
    print(out, img.size, os.path.getsize(out) // 1024, "KB")


def world(src, out_dir, rng):
    img = Image.open(os.path.join(src, "1865_Johnson_Map_of_the_World_on_Mercator_Projection_-_Geographicus_-_WorldMerc-johnson-1865.jpg"))
    w, h = img.size
    # trim the printed border
    img = img.crop((int(w * 0.035), int(h * 0.05), int(w * 0.965), int(h * 0.955)))
    a = ink_alpha(img, lo=0.20, hi=0.64)
    H, W = a.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = xx / W, yy / H
    # remove the publisher's title cartouche so it never competes with the site title
    cart = np.clip(1 - np.maximum(np.abs(u - 0.367) / 0.10, np.abs(v - 0.11) / 0.085), 0, 1)
    a *= 1 - np.clip(cart * 6, 0, 1)
    # the intact chart, used where the story shows the world "before"
    save_rgba(a, os.path.join(out_dir, "world-1865-full.webp"), 2200, quality=66)
    # dissolve: soft patches of the map fade to blank paper, thinning toward the centre
    n = fractal((H, W), rng, octaves=5, base=2.6)
    centre = np.exp(-(((u - 0.5) ** 2) / 0.07 + ((v - 0.48) ** 2) / 0.10))
    keep = np.clip((n + 0.24) / 0.26, 0, 1) * (1 - 0.7 * centre)
    keep = ndimage.gaussian_filter(keep, 5)
    # a faint tide-line where the ink gives out, like old water damage
    rim = np.exp(-((n + 0.12) / 0.03) ** 2) * (1 - 0.7 * centre)
    alpha = np.clip(a * keep + rim * 0.08, 0, 1)
    save_rgba(alpha, os.path.join(out_dir, "world-1865.webp"), 2200, quality=70)


def arizona(src, out_dir):
    img = Image.open(os.path.join(src, "Arizona_Territory_Map,_1889.jpg"))
    w, h = img.size
    img = img.crop((int(w * 0.04), int(h * 0.035), int(w * 0.96), int(h * 0.965)))
    a = ink_alpha(img, lo=0.24, hi=0.68)
    save_rgba(a, os.path.join(out_dir, "arizona-1889.webp"), 1300)


def chart(src, out_dir):
    img = Image.open(os.path.join(src, "1751_Anson_Map_of_Baja_California_and_the_Pacific,_Trade_Routes_from_Acapulco_to_Manila_-_Geographicus_-_MerduSud-anson-1751.jpg"))
    w, h = img.size
    img = img.crop((int(w * 0.20), int(h * 0.06), int(w * 0.72), int(h * 0.94)))
    a = ink_alpha(img, lo=0.20, hi=0.58)
    save_rgba(a, os.path.join(out_dir, "rhumb-chart-1751.webp"), 1800)


def main():
    src, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    rng = np.random.default_rng(1865)
    world(src, out_dir, rng)
    arizona(src, out_dir)
    chart(src, out_dir)


if __name__ == "__main__":
    main()
