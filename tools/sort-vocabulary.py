#!/usr/bin/env python3
"""Alphabetise the word lists in book/chapters/17-vocabulary.tex.

Most vocabulary tables are four columns wide and hold two independent entries
per row (German, English, German, English). Those are flattened, sorted by the
German word and re-laid out COLUMN-MAJOR, so the alphabet runs down the left
pair and continues down the right pair — the way a dictionary is set.

Two tables are different and are sorted by row instead, because the pairing
across the row carries meaning:
  * Common adjectives      — each row is an opposite pair
  * Countries and languages — each row is a country with its language

Sorting ignores the article and follows German dictionary practice: ä, ö, ü
collate as a, o, u and ß as ss.

Usage:  python3 tools/sort-vocabulary.py [--check]
        --check reports what is out of order and changes nothing.
"""
import re
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "book" / "chapters" / "17-vocabulary.tex"

# tables whose rows must stay intact, sorted on the first column only
ROW_SORTED = {"Common adjectives", "Countries and languages"}
# tables left exactly as written
UNSORTED = {"Days and months"}

ARTICLE = re.compile(r"\\d(m|f|n|pl)\{(.+?)\}")


def sort_key(cell):
    """Dictionary order: ignore the article, fold umlauts, ignore case."""
    m = ARTICLE.search(cell)
    word = m.group(2) if m else cell
    word = re.sub(r"\\eng\{.*?\}", "", word)
    word = re.sub(r"\\v[ri]\{(.+?)\}", r"\1", word)
    word = re.sub(r"\\[a-zA-Z]+", "", word).strip()
    folded = (word.lower()
              .replace("ä", "a").replace("ö", "o").replace("ü", "u")
              .replace("ß", "ss"))
    return (folded, word)


def split_row(row):
    """A body row -> list of cells, with the trailing \\\\ removed."""
    return [c.strip() for c in row.rstrip().rstrip("\\").split("&")]


def process(text, check_only=False):
    out = []
    problems = []
    section = ""
    caption = ""
    i = 0
    lines = text.split("\n")
    while i < len(lines):
        line = lines[i]
        m = re.match(r"\\gsec\{(.*)\}\s*$", line)
        if m:
            section = m.group(1)
        m = re.match(r"\\tcap\{(.*)\}\s*$", line)
        if m:
            caption = re.sub(r"\\eng\{.*?\}", "", m.group(1)).strip()

        if not line.startswith("\\begin{dtbl}"):
            out.append(line)
            i += 1
            continue

        # collect the table
        start = i
        header = lines[i + 1]
        body = []
        j = i + 2
        while not lines[j].startswith("\\end{dtbl}"):
            body.append(lines[j])
            j += 1

        label = caption if caption in ROW_SORTED or caption in UNSORTED else section
        ncols = len(split_row(header))

        if label in UNSORTED:
            new_body = body
        elif label in ROW_SORTED or ncols != 4:
            new_body = sorted(body, key=lambda r: sort_key(split_row(r)[0]))
        else:
            # flatten to single entries, sort, then re-lay out column-major
            entries = []
            for row in body:
                cells = split_row(row)
                entries.append((cells[0], cells[1]))
                if len(cells) >= 4 and cells[2].strip():
                    entries.append((cells[2], cells[3]))
            entries.sort(key=lambda e: sort_key(e[0]))
            half = (len(entries) + 1) // 2
            left, right = entries[:half], entries[half:]
            new_body = []
            for k in range(half):
                a = left[k]
                b = right[k] if k < len(right) else ("", "")
                gw = max(len(a[0]), 14)
                ew = max(len(a[1]), 11)
                new_body.append(
                    f"{a[0]:<{gw}} & {a[1]:<{ew}} & {b[0]:<{gw}} & {b[1]} \\\\".rstrip()
                )
                if not new_body[-1].endswith("\\\\"):
                    new_body[-1] += " \\\\"

        if check_only and new_body != body:
            problems.append(f"{section} / {caption or '-'}: out of order")

        out.append(line)
        out.append(header)
        out.extend(new_body)
        out.append(lines[j])
        i = j + 1
        caption = ""

    return "\n".join(out), problems


def main():
    check_only = "--check" in sys.argv
    text = SRC.read_text(encoding="utf-8")
    new, problems = process(text, check_only)
    if check_only:
        for p in problems:
            print("OUT OF ORDER:", p)
        print(f"{len(problems)} table(s) not alphabetical")
        sys.exit(1 if problems else 0)
    SRC.write_text(new, encoding="utf-8")
    print(f"sorted {SRC.name}")


if __name__ == "__main__":
    main()
