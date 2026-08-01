#!/usr/bin/env python3
"""Verify the one-topic-per-page rule.

Parses book/main.toc and reports any section that does not start on the page
immediately after the previous one, which means a topic has spilled over.

Usage:  python3 tools/check-one-page.py [path/to/main.toc]
Exit status 1 if any section overflows.
"""
import re
import sys
from pathlib import Path

toc_path = Path(sys.argv[1] if len(sys.argv) > 1 else "book/main.toc")
if not toc_path.exists():
    sys.exit(f"not found: {toc_path} — build the book first")

# \contentsline {section}{\numberline {3}Relative pronouns}{3}{...}
pattern = re.compile(
    r"\\contentsline\s*\{section\}\{\\numberline\s*\{(\d+)\}(.*?)\}\{(\d+)\}"
)

sections = []
for line in toc_path.read_text(encoding="utf-8").splitlines():
    m = pattern.search(line)
    if m:
        num, title, page = m.group(1), m.group(2), int(m.group(3))
        title = re.sub(r"\\[a-zA-Z]+\s*", "", title).strip()
        sections.append((int(num), title, page))

if not sections:
    sys.exit("no sections found in the toc")

problems = []
for (n1, t1, p1), (n2, t2, p2) in zip(sections, sections[1:]):
    if p2 - p1 != 1:
        problems.append(
            f"  section {n1} '{t1}' starts on page {p1} but section {n2} "
            f"'{t2}' starts on page {p2} — {p2 - p1} pages used"
        )

print(f"{len(sections)} sections, pages {sections[0][2]}-{sections[-1][2]}")
if problems:
    print("\nSections that do not occupy exactly one page:")
    print("\n".join(problems))
    sys.exit(1)

print("OK — every section occupies exactly one page.")
