"""
Crops details of Katherine Roy's cover art for use in the homepage story.
These are official series artwork (pending rights-holder approval — see
docs/ASSET_MANIFEST.md); crops never remove the credit shown alongside them.

Usage: python3 -I scripts/art/crop_cover_art.py
"""
from PIL import Image

src = Image.open("assets-src/covers/book-1-hc2012-front.jpg").convert("RGB")
# Below the cover lettering: the four explorers wading beneath the waterfall.
siblings = src.crop((0, 690, 1400, 1867))
siblings.save("public/images/art/book1-explorers.webp", "WEBP", quality=80, method=6)
print("book1-explorers.webp", siblings.size)
