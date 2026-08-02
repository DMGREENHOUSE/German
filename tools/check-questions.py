#!/usr/bin/env python3
"""Sanity-check docs/js/questions.js against the generated page map.

Catches the three things that silently break the quiz:
  * a question tagged with a section title the book does not have
  * a book section with no questions at all
  * a malformed question (wrong option count, bad answer index, duplicates)

Usage:  python3 tools/check-questions.py
Exit status 1 on any error.
"""
import json
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
pagemap_js = root / "docs" / "js" / "pagemap.js"
questions_js = root / "docs" / "js" / "questions.js"
vocab_js = root / "docs" / "js" / "questions-vocab.js"

for f in (pagemap_js, questions_js):
    if not f.exists():
        sys.exit(f"not found: {f}")


def js_object(path, marker):
    text = path.read_text(encoding="utf-8")
    start = text.index(marker) + len(marker)
    end = text.rindex(";")
    return text[start:end].strip()


pagemap = json.loads(js_object(pagemap_js, "window.PAGEMAP ="))
titles = {s["title"] for p in pagemap["parts"] for s in p["sections"]}

def load(path, marker, trim=0):
    raw = js_object(path, marker)
    if trim:                       # the generated file is wrapped in .concat([ ... ])
        raw = raw[raw.index("concat(") + len("concat("):]
        raw = raw[raw.index("[") : raw.rindex("]") + 1]
    raw = re.sub(r"/\*.*?\*/", "", raw, flags=re.S)
    raw = re.sub(r"(?m)^\s*//.*$", "", raw)
    raw = re.sub(r"([{,])\s*([a-z])\s*:", r'\1"\2":', raw)
    return json.loads(raw)

questions = load(questions_js, "window.QUESTIONS =")
generated = []
if vocab_js.exists():
    generated = load(vocab_js, "window.QUESTIONS =", trim=1)
    questions += generated

VALID_TYPES = {"recall", "rule", "gap"}

errors, warnings = [], []
seen = set()
covered = {}
by_type = {}

for i, q in enumerate(questions):
    where = f"question {i + 1} ({q.get('q', '')[:40]}…)"
    if q["s"] not in titles:
        errors.append(f"{where}: section '{q['s']}' is not in the book")
    else:
        covered[q["s"]] = covered.get(q["s"], 0) + 1
    if q.get("t") not in VALID_TYPES:
        errors.append(f"{where}: type {q.get('t')!r} is not one of {sorted(VALID_TYPES)}")
    else:
        by_type[q["t"]] = by_type.get(q["t"], 0) + 1
    if len(q["a"]) != 4:
        errors.append(f"{where}: has {len(q['a'])} options, expected 4")
    if not isinstance(q["c"], int) or not 0 <= q["c"] < len(q["a"]):
        errors.append(f"{where}: answer index {q['c']} out of range")
    if len(set(q["a"])) != len(q["a"]):
        errors.append(f"{where}: duplicate options")
    key = (q["s"], q["q"])
    if key in seen:
        errors.append(f"{where}: duplicate question")
    seen.add(key)

for t in sorted(titles):
    if t not in covered:
        warnings.append(f"no questions for section '{t}'")

print(f"{len(questions)} questions across {len(covered)} of {len(titles)} sections "
      f"({len(questions) - len(generated)} written, {len(generated)} generated)")
print("  by type: " + ", ".join(f"{k} {v}" for k, v in sorted(by_type.items())))
thin = [t for t, n in covered.items() if n < 3]
if thin:
    print(f"{len(thin)} sections with fewer than 3 questions")

for w in warnings:
    print("WARN:", w)
for e in errors:
    print("ERROR:", e)

sys.exit(1 if errors else 0)
