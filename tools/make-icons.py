# Regenerates every favicon/logo file in public/ from src/assets/logo.png. Needs Pillow. Run: python3 tools/make-icons.py
from PIL import Image, ImageDraw
src = Image.open('src/assets/logo.png').convert('RGBA')
def tile(n, pad=0.12, radius=0.2, bg=(255, 255, 255, 255)):
    im = Image.new('RGBA', (n, n), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rounded_rectangle([0, 0, n - 1, n - 1], radius=int(n * radius), fill=bg)
    box = int(n * (1 - 2 * pad)); s = min(box / src.width, box / src.height)
    lg = src.resize((max(1, int(src.width * s)), max(1, int(src.height * s))), Image.LANCZOS)
    im.alpha_composite(lg, ((n - lg.width) // 2, (n - lg.height) // 2)); return im
for n in (48, 96, 144, 192, 512): tile(n).save(f'public/favicon-{n}.png', optimize=True)
tile(180, 0.1, 0).save('public/apple-touch-icon.png', optimize=True)   # iOS applies its own rounding
tile(512).save('public/logo-512.png', optimize=True)
tile(48).save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
