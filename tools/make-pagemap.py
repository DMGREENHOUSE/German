#!/usr/bin/env python3
"""Turn the books' .toc files into docs/js/pagemap.js.

The quiz needs to know which page of which book every topic is on. Rather than
hard-coding page numbers into the question bank, questions reference a section
by its exact title and this script resolves the title to a book and a page at
build time. If a book gains a page, the map regenerates and nothing else has to
change.

There are two books — the grammar reference and the story reader — and each
carries its own PDF, its own page images and its own front-matter offset. A
section title must be unique across both, since that title is the only key a
question has.

Usage:
    python3 tools/make-pagemap.py grammar:book/main.toc story:book/story/main.toc docs/js/pagemap.js
    python3 tools/make-pagemap.py book/main.toc docs/js/pagemap.js    (grammar only)
"""
import json
import re
import sys
from pathlib import Path

# Everything the app needs to reach a book, keyed by the id used in the
# id:path arguments. `param` is the query parameter that book's pages link
# with — ?page=N for the grammar book, ?story=N for the reader.
BOOKS = {
    "grammar": {"title": "Deutsche Grammatik", "pdf": "book.pdf",
                "images": "pages/", "param": "page"},
    "story": {"title": "Deutsche Geschichten", "pdf": "story.pdf",
              "images": "story-pages/", "param": "story"},
}

args = sys.argv[1:]
out_path = Path(args.pop() if args and args[-1].endswith(".js") else "docs/js/pagemap.js")
if not args:
    args = ["book/main.toc"]

sources = []
for a in args:
    book, sep, path = a.partition(":")
    if not sep:
        book, path = "grammar", a
    if book not in BOOKS:
        sys.exit(f"unknown book {book!r}; expected one of {sorted(BOOKS)}")
    p = Path(path)
    if not p.exists():
        sys.exit(f"not found: {p} — build that book first")
    sources.append((book, p))

SECTION = re.compile(
    r"\\contentsline\s*\{section\}\{\\numberline\s*\{(\d+)\}(.*?)\}\{(\d+)\}"
)
PART = re.compile(r"\\contentsline\s*\{chapter\}\{(.*?)\}\{(\d+)\}")


def clean(text):
    """Strip the LaTeX that survives into the toc."""
    text = re.sub(r"\\IeC\s*", "", text)
    text = text.replace("\\&", "&")
    text = re.sub(r"\\[a-zA-Z]+\s*", "", text)
    text = text.replace("{", "").replace("}", "")
    text = text.replace("---", "\u2014").replace("--", "\u2013")
    return " ".join(text.split())


def parse_toc(toc_path, book):
    """-> list of parts, each with its sections, tagged with the book id."""
    parts = []
    for line in toc_path.read_text(encoding="utf-8").splitlines():
        m = SECTION.search(line)
        if m:
            if not parts:
                continue
            parts[-1]["sections"].append(
                {"n": int(m.group(1)), "title": clean(m.group(2)),
                 "page": int(m.group(3))}
            )
            continue
        m = PART.search(line)
        if m:
            label = clean(m.group(1))
            num, _, title = label.partition(".")
            parts.append({
                "id": num.strip(),
                "title": title.strip() or label,
                "book": book,
                "page": int(m.group(2)),
                "sections": [],
            })
    return [p for p in parts if p["sections"]]


def front_matter_offset(toc_path, parts):
    """Printed page numbers restart after the front matter; the PDF's do not.

    The app needs the difference to build a working  book.pdf#page=N  link.
    """
    pdf_path = toc_path.with_suffix(".pdf")
    if not pdf_path.exists():
        return 0
    import subprocess
    try:
        info = subprocess.run(
            ["pdfinfo", str(pdf_path)], capture_output=True, text=True, check=True
        ).stdout
        physical = int(re.search(r"^Pages:\s+(\d+)", info, re.M).group(1))
        last_printed = max(s["page"] for p in parts for s in p["sections"])
        return physical - last_printed
    except Exception as exc:
        print(f"  (could not read {pdf_path}: {exc}; offset left at 0)")
        return 0


all_parts = []
books = {}
for book, toc_path in sources:
    parts = parse_toc(toc_path, book)
    if not parts:
        sys.exit(f"no parts found in {toc_path}")
    offset = front_matter_offset(toc_path, parts)
    books[book] = dict(BOOKS[book], frontMatterOffset=offset)
    all_parts.extend(parts)
    n = sum(len(p["sections"]) for p in parts)
    print(f"  {book}: {len(parts)} parts, {n} sections, offset {offset}")

# A question names only a section title, so a title used by both books would be
# unresolvable. Catch it here rather than letting the app pick one at random.
seen = {}
for part in all_parts:
    for sec in part["sections"]:
        if sec["title"] in seen:
            sys.exit(f"section title {sec['title']!r} appears in both "
                     f"{seen[sec['title']]} and {part['book']}")
        seen[sec["title"]] = part["book"]

total = sum(len(p["sections"]) for p in all_parts)
payload = {
    "parts": all_parts,
    "sectionCount": total,
    "books": books,
    # kept so an older cached app.js still resolves the grammar book
    "frontMatterOffset": books.get("grammar", {}).get("frontMatterOffset", 0),
}

out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(
    "// Generated by tools/make-pagemap.py — do not edit by hand.\n"
    "window.PAGEMAP = "
    + json.dumps(payload, ensure_ascii=False, indent=2)
    + ";\n",
    encoding="utf-8",
)
print(f"{out_path}: {len(all_parts)} parts, {total} sections across {len(books)} book(s)")
