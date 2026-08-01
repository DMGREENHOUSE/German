#!/usr/bin/env bash
# Render every numbered page of the book to a PNG for the web app.
#
# The quiz shows the relevant page when an answer is wrong. Serving images
# rather than the PDF keeps it working identically on iOS Safari, Android
# and desktop, none of which agree on how to honour a #page=N fragment.
#
# Images are named by the book's PRINTED page number, so page-07.png is the
# page with "7" in its footer. The front matter is skipped.
#
# Usage: tools/make-page-images.sh [book/main.pdf] [docs/pages]
set -euo pipefail

PDF="${1:-book/main.pdf}"
OUT="${2:-docs/pages}"
DPI="${DPI:-150}"

[ -f "$PDF" ] || { echo "not found: $PDF — build the book first" >&2; exit 1; }
command -v pdftoppm >/dev/null || { echo "pdftoppm not found (install poppler-utils)" >&2; exit 1; }

TOC="${PDF%.pdf}.toc"
[ -f "$TOC" ] || { echo "not found: $TOC" >&2; exit 1; }

total=$(pdfinfo "$PDF" | awk '/^Pages:/ {print $2}')
# highest printed page number recorded in the toc
last=$(grep -o '}{[0-9]\+}{section' "$TOC" | grep -o '[0-9]\+' | sort -n | tail -1)
offset=$(( total - last ))

echo "$total physical pages, $last numbered pages, front matter offset $offset"

mkdir -p "$OUT"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

pdftoppm -png -r "$DPI" -f $(( offset + 1 )) -l "$total" "$PDF" "$tmp/p"

i=0
for f in "$tmp"/p-*.png; do
  i=$(( i + 1 ))
  printf -v name "page-%02d.png" "$i"
  # 8-bit palette keeps these under ~60 kB each without visible loss on text
  if command -v convert >/dev/null; then
    convert "$f" -colors 256 -depth 8 PNG8:"$OUT/$name"
  else
    cp "$f" "$OUT/$name"
  fi
done

echo "wrote $i images to $OUT ($(du -sh "$OUT" | cut -f1) total)"
