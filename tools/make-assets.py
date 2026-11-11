"""Generates v3.4.0 visual assets: hero images (AVIF/WebP/JPEG at 3 widths), blurred placeholder, og-image, self-hosted Inter subset (WOFF).
All artwork is original and procedural (no stock photos, no third-party artwork). Run: python3 tools/make-assets.py"""
import math, random, base64, io, os
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops
random.seed(7)
W, H = 1920, 1080
BRAND = (59, 76, 202); CYAN = (14, 190, 207)

def hero():
    img = Image.new('RGB', (W, H), (6, 10, 28))
    px = img.load()
    for y in range(H):
        for x in range(0, W):
            t = y / H; d = math.hypot((x - W * 0.72) / W, (y - H * 0.35) / H)
            g = max(0.0, 1 - d * 1.9)
            px[x, y] = (int(6 + 26 * t + 42 * g), int(10 + 14 * t + 38 * g), int(28 + 40 * t + 120 * g))
    glow = Image.new('RGB', (W, H), (0, 0, 0)); gd = ImageDraw.Draw(glow)
    line = Image.new('RGB', (W, H), (0, 0, 0)); ld = ImageDraw.Draw(line)
    # perspective floor grid (data-centre aisle feel)
    hz = int(H * 0.62); vx = W * 0.62
    for i in range(-28, 29):
        x2 = vx + i * 210
        ld.line([(vx + i * 14, hz), (x2, H)], fill=(34, 52, 120), width=2)
    for k in range(1, 16):
        y = hz + (H - hz) * (k / 15) ** 2.1
        ld.line([(0, y), (W, y)], fill=(30, 46, 104), width=2)
    # server racks: columns with LED rows, receding
    racks = Image.new('RGB', (W, H), (0, 0, 0)); rd = ImageDraw.Draw(racks)
    for r in range(9):
        s = 0.35 + r * 0.09; rw = int(150 * s); rh = int(520 * s); x = int(vx - 960 + r * 215 * 0.92); y = int(hz - rh * 0.88)
        rd.rectangle([x, y, x + rw, y + rh], fill=(12, 18, 44), outline=(40, 58, 130))
        for j in range(int(rh / (14 * s))):
            yy = y + 8 + j * 14 * s
            if yy + 5 > y + rh: break
            c = CYAN if random.random() < .22 else BRAND if random.random() < .5 else (38, 52, 104)
            rd.rectangle([x + 8 * s, yy, x + rw - 8 * s, yy + 4 * s], fill=tuple(int(v * .5) for v in c))
            if c != (38, 52, 104):
                gd.rectangle([x + 8 * s, yy, x + rw * (0.3 + random.random() * .6), yy + 4 * s], fill=c)
    # network constellation (right side)
    pts = [(W * (0.5 + random.random() * 0.48), H * (0.06 + random.random() * 0.5)) for _ in range(46)]
    for i, p in enumerate(pts):
        near = sorted(pts, key=lambda q: (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2)[1:3]
        for q in near:
            gd.line([p, q], fill=(40, 90, 200), width=2)
    for p in pts:
        r = random.choice([3, 4, 5, 7]); c = CYAN if random.random() < .35 else (120, 140, 255)
        gd.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=c)
    g1 = glow.filter(ImageFilter.GaussianBlur(10)); g2 = glow.filter(ImageFilter.GaussianBlur(2))
    out = ImageChops.add(img, line); out = ImageChops.add(out, racks); out = ImageChops.add(out, g1); out = ImageChops.add(out, g2)
    # vignette
    vg = Image.new('L', (W, H), 0); vd = ImageDraw.Draw(vg); vd.ellipse([-W * .2, -H * .3, W * 1.2, H * 1.3], fill=255)
    vg = vg.filter(ImageFilter.GaussianBlur(160))
    out = Image.composite(out, Image.new('RGB', (W, H), (3, 5, 16)), vg)
    return out

def save_set(im):
    for w in (640, 1280, 1920):
        r = im.resize((w, round(w * H / W)), Image.LANCZOS)
        r.save(f'public/img/hero-{w}.webp', 'WEBP', quality=72, method=6)
        r.save(f'public/img/hero-{w}.avif', 'AVIF', quality=48)
        r.save(f'public/img/hero-{w}.jpg', 'JPEG', quality=70, optimize=True, progressive=True)
    ph = im.resize((32, 18), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1)); b = io.BytesIO(); ph.save(b, 'WEBP', quality=40)
    open('src/config/heroph.mjs', 'w').write("export const heroPlaceholder = 'data:image/webp;base64,%s';\n" % base64.b64encode(b.getvalue()).decode())

def og(im):
    o = im.resize((1200, 675), Image.LANCZOS).crop((0, 22, 1200, 652)).convert('RGB')
    d = ImageDraw.Draw(o, 'RGBA'); d.rectangle([0, 0, 1200, 630], fill=(4, 8, 24, 120))
    F = '/usr/share/fonts/opentype/inter/'
    big = ImageFont.truetype(F + 'Inter-Bold.otf', 118); mid = ImageFont.truetype(F + 'Inter-Regular.otf', 40); sm = ImageFont.truetype(F + 'Inter-SemiBold.otf', 30)
    x, y = 84, 210
    for ch, col in zip('InfoXteK', [(255,)*3, (255,)*3, (255,)*3, (255,)*3, (43, 134, 209), (255,)*3, (255,)*3, (43, 134, 209)]):
        d.text((x, y), ch, font=big, fill=col); x += d.textlength(ch, font=big)
    d.text((88, 366), 'Dependable IT, planned around your business.', font=mid, fill=(220, 228, 250))
    d.rectangle([88, 450, 168, 456], fill=(59, 76, 202))
    d.text((88, 480), 'Cloud  |  Cyber Security  |  Managed IT  |  Software', font=sm, fill=(160, 178, 235))
    d.text((88, 560), 'infoXtek.com', font=sm, fill=(255, 255, 255))
    o.save('public/og-image.png', optimize=True)

def fonts():
    from fontTools import subset
    uni = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2713]
    for name, out in (('Regular', 'inter-400'), ('SemiBold', 'inter-600'), ('Bold', 'inter-700')):
        o = subset.Options(); o.flavor = 'woff'; o.layout_features = ['kern', 'liga', 'calt', 'tnum', 'case']; o.notdef_outline = True
        f = subset.load_font('/usr/share/fonts/opentype/inter/Inter-%s.otf' % name, o)
        s = subset.Subsetter(o); s.populate(unicodes=uni); s.subset(f); subset.save_font(f, f'public/fonts/{out}.woff', o)

if __name__ == '__main__':
    im = hero(); save_set(im); og(im); fonts()
    for f in sorted(os.listdir('public/img')) + ['../og-image.png'] + ['../fonts/' + x for x in sorted(os.listdir('public/fonts'))]:
        p = os.path.join('public/img', f); print(f, os.path.getsize(p))
