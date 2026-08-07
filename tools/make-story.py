#!/usr/bin/env python3
"""Build the story book and its question bank from book/story/pieces.json.

The JSON is the source of truth for both, exactly as 17-vocabulary.tex is for
the vocabulary questions. Editing a piece and re-running this keeps the book,
the glossary and the questions in step; there is no second place to update.

Writes:
    book/story/pieces.tex        the body of the story book
    docs/js/questions-story.js   the comprehension question bank

Usage:  python3 tools/make-story.py
"""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
SRC = root / "book" / "story" / "pieces.json"
TEX = root / "book" / "story" / "pieces.tex"
QJS = root / "docs" / "js" / "questions-story.js"

PARTS = [("XVIII", "Komisches"), ("XIX", "Geschichte"),
         ("XX", "Philosophie"), ("XXI", "Wissenschaft")]

# Characters that mean something to TeX. The pieces are plain German prose, so
# this is short — but & and % do turn up in dates and percentages.
TEX_ESCAPES = {"&": r"\&", "%": r"\%", "$": r"\$", "#": r"\#",
               "_": r"\_", "{": r"\{", "}": r"\}"}


def tex(s):
    out = "".join(TEX_ESCAPES.get(c, c) for c in s)
    # German quotation marks the pieces use, and the ellipsis
    return out.replace("„", "\\glqq{}").replace("“", "\\grqq{}").replace("…", "\\dots{}")


def esc_js(t):
    return t.replace("\\", "\\\\").replace('"', '\\"')


def build_tex(pieces):
    lines = [
        "% Story book body — GENERATED, do not edit by hand.",
        "%",
        "% Regenerate with:  python3 tools/make-story.py",
        "% Source of truth:  book/story/pieces.json",
        "",
    ]
    for pid, part in PARTS:
        here = [p for p in pieces if p["part"] == part]
        if not here:
            continue
        lines += [f"\\gpart{{{pid}}}{{{tex(part)}}}", ""]
        for p in here:
            lines += [f"\\gsec{{{tex(p['title'])}}}",
                      f"\\levelbadge{{{p['level']}}}", ""]
            for para in p["paragraphs"]:
                lines += [tex(para), ""]
            lines += ["\\vfill", "\\begin{glosstbl}"]
            rows = p["glossary"]
            # two glossary pairs per printed row, laid out across the page
            for i in range(0, len(rows), 2):
                left = rows[i]
                right = rows[i + 1] if i + 1 < len(rows) else ("", "")
                lines.append(
                    f"  \\textbf{{{tex(left[0])}}} & {tex(left[1])} & "
                    f"{'\\textbf{' + tex(right[0]) + '}' if right[0] else ''} & "
                    f"{tex(right[1])} \\\\")
            lines += ["\\end{glosstbl}", ""]
    return "\n".join(lines) + "\n"


def build_questions(pieces):
    out = []
    for p in pieces:
        for q in p["questions"]:
            if len(q["a"]) != 4 or len(set(q["a"])) != 4:
                sys.exit(f"bad option set in {p['id']}: {q['q'][:50]}")
            if q["t"] not in {"recall", "rule", "gap"}:
                sys.exit(f"bad type {q['t']!r} in {p['id']}")
            opts = ",".join(f'"{esc_js(o)}"' for o in q["a"])
            out.append(
                f'{{s:"{esc_js(p["title"])}", q:"{esc_js(q["q"])}", a:[{opts}], '
                f't:"{q["t"]}", c:0, e:"{esc_js(q["e"])}"}},')
    body = [
        "/* Story-book comprehension questions — GENERATED, do not edit by hand.",
        " *",
        " * Regenerate with:  python3 tools/make-story.py",
        " * Source of truth:  book/story/pieces.json",
        " */",
        "window.QUESTIONS = (window.QUESTIONS || []).concat([",
    ] + out
    body[-1] = body[-1].rstrip(",")
    body.append("]);")
    return "\n".join(body) + "\n"


def main():
    pieces = json.loads(SRC.read_text(encoding="utf-8"))

    seen = set()
    for p in pieces:
        if p["title"] in seen:
            sys.exit(f"duplicate title: {p['title']}")
        seen.add(p["title"])
        words = sum(len(x.split()) for x in p["paragraphs"])
        if words > 200:
            sys.exit(f"{p['title']}: {words} German words will not fit on a page")

    TEX.write_text(build_tex(pieces), encoding="utf-8")
    QJS.write_text(build_questions(pieces), encoding="utf-8")

    nq = sum(len(p["questions"]) for p in pieces)
    print(f"{TEX.relative_to(root)}: {len(pieces)} pieces")
    print(f"{QJS.relative_to(root)}: {nq} questions")
    by = {}
    for p in pieces:
        by[p["level"]] = by.get(p["level"], 0) + 1
    print("  levels: " + ", ".join(f"{k} {v}" for k, v in sorted(by.items())))


if __name__ == "__main__":
    main()
