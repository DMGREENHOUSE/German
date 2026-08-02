#!/usr/bin/env python3
"""Validate the column specs of every dtbl in the book.

dtbl uses the tabularx weighted-column trick, where each column is declared
W{w} or C{w} and w scales that column's share of the width. The weights must
sum to the NUMBER OF COLUMNS; if they do not, tabularx silently produces a
squashed table rather than an error, which is easy to miss.

This also checks that every row of a dtbl has the right number of cells.

Usage:  python3 tools/check-tables.py
Exit status 1 on any problem.
"""
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
book = root / "book"

SPEC = re.compile(r"\\begin\{dtbl\}(?:\[[^\]]*\])?\{((?:[WC]\{[0-9.]+\})+)\}")
COL = re.compile(r"([WC])\{([0-9.]+)\}")

problems = []
checked = 0

for path in sorted(book.rglob("*.tex")):
    text = path.read_text(encoding="utf-8")
    for m in SPEC.finditer(text):
        spec = m.group(1)
        cols = COL.findall(spec)
        if not cols:
            continue
        checked += 1
        n = len(cols)
        total = sum(float(w) for _, w in cols)
        line = text[: m.start()].count("\n") + 1
        if abs(total - n) > 0.005:
            problems.append(
                f"{path.relative_to(root)}:{line}: {n} columns but the weights "
                f"sum to {total:g} — they must sum to {n}"
            )

        # count cells in each row of this table
        body_start = text.index("\n", m.end())
        body_end = text.index("\\end{dtbl}", body_start)
        body = text[body_start:body_end]
        body = re.sub(r"\\rowcolor\{[^}]*\}", "", body)
        for raw in body.split("\\\\"):
            row = raw.strip()
            if not row or row.startswith("%") or row.startswith("\\hdrule"):
                continue
            row = row.replace("\\hdrule", "").strip()
            if not row:
                continue
            cells = len(re.findall(r"(?<!\\)&", row)) + 1
            if cells != n:
                rl = line + body[: body.index(raw)].count("\n")
                problems.append(
                    f"{path.relative_to(root)}:~{rl}: row has {cells} cells, "
                    f"table has {n} columns — {row[:60]}"
                )

print(f"checked {checked} dtbl tables")
for p in problems:
    print("ERROR:", p)
sys.exit(1 if problems else 0)
