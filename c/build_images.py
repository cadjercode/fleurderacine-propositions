"""Genere img/ pour la direction c : polaroids WebP + trames halftone pre-rendues (Pillow)."""
import glob, math, os
from PIL import Image, ImageDraw, ImageOps
A = "g:/Mon Drive/Gestion Sites/clients/sonia/assets/"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "img")
os.makedirs(OUT, exist_ok=True)
def src(p): return Image.open(glob.glob(A + "instagram/" + p + "*.jpg")[0]).convert("RGB")
def crop(im, ratio, cy=0.5):
    w, h = im.size
    if w / h > ratio:
        nw = int(h * ratio); x = (w - nw) // 2; return im.crop((x, 0, x + nw, h))
    nh = int(w / ratio); y = int((h - nh) * cy); return im.crop((0, y, w, y + nh))
def save(im, name, w, q=80):
    h = round(w * im.size[1] / im.size[0]); im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(OUT, name), "WEBP", quality=q, method=6); print(name, im.size)
# hero polaroids (4:5)
for n, p, cy in [("pol1","630163039",.5),("pol2","703978277",.4),("pol3","715353875",.4),("pol4","709154642",.5),
                 ("pol5","736188300",.35),("pol6","870141293",.55),("pol7","901356557",.5)]:
    save(crop(src(p), 4/5, cy), n + ".webp", 480 if n!="pol7" else 520)
# logo tampon
save(crop(src("684258682"), 1), "logo.webp", 400)
# Noel
cards = [("noel1","901356557",3/4,.5),("noel2","760124607",4/5,.45),("noel3","719918813",4/5,.45)]
BR, PAPER = (77,44,20), (237,228,207)
def halftone(im, cell=9):
    g = ImageOps.autocontrast(im.convert("L"), cutoff=2); w, h = g.size
    S = 3; big = Image.new("RGB", (w*S, h*S), PAPER); d = ImageDraw.Draw(big)
    small = g.resize((w//cell+1, h//cell+1), Image.LANCZOS)
    for j in range(small.size[1]):
        for i in range(small.size[0]):
            v = 1 - small.getpixel((i, j)) / 255
            r = (cell * S / 2) * math.sqrt(v) * 1.05
            if r < 0.6: continue
            cx, cy = (i + .5) * cell * S, (j + .5) * cell * S
            if (j % 2): cx += cell * S / 2
            d.ellipse((cx-r, cy-r, cx+r, cy+r), fill=(138,82,20) if v < .55 else BR)
    return big.resize((w, h), Image.LANCZOS)
for n, p, r, cy in cards:
    im = crop(src(p), r, cy); w = 640
    h = round(w * im.size[1] / im.size[0]); im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(OUT, n + ".webp"), "WEBP", quality=80, method=6)
    halftone(im).save(os.path.join(OUT, n + "-halftone.webp"), "WEBP", quality=70, method=6); print(n, im.size)
# portrait
pt = Image.open(A + "logo-portrait/portrait-sonia-instagram-1080.jpg").convert("RGB")
save(crop(pt, 4/5, .3), "sonia.webp", 560)
# og
og = Image.new("RGB",(1200,630),PAPER); l=Image.open(os.path.join(OUT,"logo.webp")).resize((500,500)); og.paste(l,(60,65))
p1=Image.open(os.path.join(OUT,"pol1.webp")).resize((480,600)); og.paste(p1,(640,15)); og.save(os.path.join(OUT,"og.jpg"),quality=82)
