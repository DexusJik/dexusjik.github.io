#!/usr/bin/env python3
"""Build a 1200x630 social card for the English app.

The app page was pointing og:image and twitter:image at the main site's
og-card.jpg, so every share of /english-daily/ showed the consultancy brand and
described text that was not in the image.

Generates english-daily/og-card.jpg from the app's own palette: the deep navy
the light theme uses for the page, the green CTA, and gold for the wordmark.
Regenerate after changing the brand colours.

Run from the repo root:  python tools/gen-og-card.py
Requires Pillow:  pip install pillow
"""
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit('Pillow is required:  pip install pillow')

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, 'english-daily', 'og-card.jpg')

W, H = 1200, 630

# taken from english-daily/daily.css :root so the card cannot drift from the app
NAVY = (27, 20, 100)        # --navy
NAVY_DEEP = (17, 14, 64)    # --navy-dark
GREEN = (88, 204, 2)        # --green
GOLD = (255, 194, 0)        # --gold
WHITE = (255, 255, 255)
TEXT = (60, 60, 60)         # --text
MUTED = (89, 89, 89)        # --muted


def font(size, bold=False):
    """Try Nunito first (the site's font), then fall back to anything present."""
    names = ['Nunito', 'DejaVuSans', 'Arial']
    if bold:
        names = [n + ' Bold' for n in names] + ['Nunito-Bold', 'DejaVuSans-Bold']
    for name in names:
        for root in ('/usr/share/fonts', 'C:/Windows/Fonts'):
            for dirpath, _dirs, files in os.walk(root):
                for f in files:
                    stem = os.path.splitext(f)[0]
                    if stem.lower() == name.split()[0].lower() or \
                       stem.lower() == name.lower().replace(' ', ''):
                        return ImageFont.truetype(os.path.join(dirpath, f), size)
    return ImageFont.load_default()


def main():
    im = Image.new('RGB', (W, H), NAVY_DEEP)
    d = ImageDraw.Draw(im)

    # vertical gradient from deep navy to the brand navy
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)],
               fill=tuple(int(NAVY_DEEP[i] + (NAVY[i] - NAVY_DEEP[i]) * t) for i in range(3)))

    # green rule at the top, matching the app's progress-bar accent
    d.rectangle([0, 0, W, 14], fill=GREEN)

    f_kicker = font(34, bold=True)
    f_title = font(76, bold=True)
    f_body = font(38)

    # text is laid out in a fixed-width column so it cannot run under the cards
    TEXT_X = 80
    TEXT_W = 620

    d.text((TEXT_X, 150), '1 ORACIÓN AL DÍA', font=f_kicker, fill=GREEN)
    d.text((TEXT_X, 230), '365 oraciones', font=f_title, fill=WHITE)
    d.text((TEXT_X, 340), 'Inglés real,', font=f_body, fill=MUTED)
    d.text((TEXT_X, 390), 'una oración al día.', font=f_body, fill=MUTED)

    # a stack of "sentence cards" on the right, in the app's card colour
    x, y = 740, 170
    for i in range(3):
        card = Image.new('RGB', (380, 200), (255, 255, 255))
        cd = ImageDraw.Draw(card)
        cd.rounded_rectangle([0, 0, 379, 199], radius=20,
                             outline=(229, 229, 229), width=3)
        cd.rectangle([34, 46, 34 + (300 - i * 60), 60], fill=GREEN if i == 0 else (229, 229, 229))
        cd.rectangle([34, 92, 34 + (250 - i * 40), 106], fill=(229, 229, 229))
        cd.rectangle([34, 138, 34 + (270 - i * 30), 152], fill=GOLD if i == 0 else (229, 229, 229))
        im.paste(card, (x - i * 14, y + i * 40))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    im.save(OUT, 'JPEG', quality=86, optimize=True)

    n = os.path.getsize(OUT)
    print('english-daily/og-card.jpg  {}x{}  {:.0f} KB'.format(W, H, n / 1024))
    if n > 200 * 1024:
        print('  warning: over 200 KB, most platforms will reject it')
        sys.exit(1)
    print('ok')


if __name__ == '__main__':
    main()