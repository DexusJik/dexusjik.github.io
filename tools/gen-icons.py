#!/usr/bin/env python3
"""Generate the small icon and avatar derivatives.

Why this exists: `assets/images/image4.webp` is a 3136x4224 portrait photograph
weighing 372 KB. It was being served as the favicon, as the `apple-touch-icon`
and as a 40-44 px avatar on every page, and it was half the service worker
precache. `image5.webp` is already an 812x812 square crop of the same photo, so
this derives the small sizes from it.

iOS silently ignores WebP for `apple-touch-icon`, so that file must be PNG.

Run from the repo root:
    python tools/gen-icons.py
    python tools/gen-icons.py --check     # verify without writing

Requires Pillow:  pip install pillow
"""
import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit('Pillow is required:  pip install pillow')

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (source, output dir, output name, pixel size, format, webp quality)
DERIVATIVES = [
    ('assets/images/image5.webp', 'assets/images', 'avatar-96.webp', 96, 'WEBP', 82),
    ('assets/images/image5.webp', 'assets/images', 'favicon-32.png', 32, 'PNG', None),
    ('assets/images/image5.webp', 'assets/images', 'favicon-16.png', 16, 'PNG', None),
    ('assets/images/image5.webp', 'assets/images', 'apple-touch-icon.png', 180, 'PNG', None),
    ('pangal-esports/p_sports.webp', 'pangal-esports', 'avatar-96.webp', 96, 'WEBP', 82),
    ('pangal-esports/p_sports.webp', 'pangal-esports', 'favicon-32.png', 32, 'PNG', None),
    ('pangal-esports/p_sports.webp', 'pangal-esports', 'apple-touch-icon.png', 180, 'PNG', None),
]

# a page should never ship more than this for a single icon
BUDGET = 60 * 1024


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--check', action='store_true',
                    help='report missing or oversized files, write nothing')
    args = ap.parse_args()

    print('{:<42} {:>9} {:>10}'.format('file', 'px', 'bytes'))
    print('-' * 64)

    problems = []

    for src, outdir, name, size, fmt, quality in DERIVATIVES:
        src_path = os.path.join(REPO, src)
        out_path = os.path.join(REPO, outdir, name)

        if not os.path.exists(src_path):
            problems.append('missing source: ' + src)
            continue

        if not args.check:
            im = Image.open(src_path).convert('RGB')
            if im.width < size or im.height < size:
                problems.append('{:<42} source {} is smaller than {}px'.format(name, im.size, size))
                continue
            os.makedirs(os.path.dirname(out_path), exist_ok=True)
            small = im.resize((size, size), Image.LANCZOS)
            if fmt == 'WEBP':
                small.save(out_path, 'WEBP', quality=quality, method=6)
            else:
                small.save(out_path, 'PNG', optimize=True)

        if os.path.exists(out_path):
            n = os.path.getsize(out_path)
            print('{:<42} {:>9} {:>10}'.format(outdir + '/' + name, str(size) + 'x' + str(size), n))
            if n > BUDGET:
                problems.append('{}/{} is {} KB, over the {} KB icon budget'.format(
                    outdir, name, round(n / 1024), round(BUDGET / 1024)))
        else:
            problems.append('missing output: ' + outdir + '/' + name)

    print('')
    if problems:
        for p in problems:
            print('  PROBLEM  ' + p)
        sys.exit(1)

    print('all {} derivatives present and within budget'.format(len(DERIVATIVES)))


if __name__ == '__main__':
    main()