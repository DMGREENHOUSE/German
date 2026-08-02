#!/usr/bin/env python3
"""Generate recall questions from the vocabulary lists.

Reads book/chapters/17-vocabulary.tex and writes docs/js/questions-vocab.js.
Deriving the questions from the book rather than writing them by hand means
they cannot drift out of step with it, and the answers are correct by
construction.

Three shapes are produced, in rotation:
    German to English   "What does [[der Hund]] mean?"    -> dog
    English to German   "How do you say **dog**?"         -> der Hund
    Gender              "Which article does [[Hund]] take?" -> der

Distractors are drawn from the same section, so the choice is never made easy
by category alone. Any word whose English gloss overlaps another word in the
same section is skipped, because that would create two defensible answers.

Usage:  python3 tools/make-vocab-questions.py [per-section]
"""
import random
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
SRC = root / "book" / "chapters" / "17-vocabulary.tex"
OUT = root / "docs" / "js" / "questions-vocab.js"

PER_SECTION = int(sys.argv[1]) if len(sys.argv) > 1 else 8

ARTICLE = {"m": "der", "f": "die", "n": "das", "pl": "die"}
ENTRY = re.compile(r"\\d(m|f|n|pl)\{(.+?)\}")
VERB = re.compile(r"\\v(r|i)\{(.+?)\}")

# rows in these tables are pairs, not two independent entries
ROW_TABLES = {"Common adjectives", "Countries and languages", "Days and months"}
# glosses too vague to be a fair question
SKIP_GLOSS = {"", "-"}


def clean_gloss(cell):
    cell = re.sub(r"\\eng\{.*?\}", "", cell)
    cell = re.sub(r"\\[a-zA-Z]+\{(.*?)\}", r"\1", cell)
    cell = re.sub(r"\\[a-zA-Z]+", "", cell)
    return cell.replace("\\", "").strip()


def parse():
    """-> {section: [(german_with_article, english), ...]}"""
    sections = {}
    section = caption = None
    in_table = False
    for line in SRC.read_text(encoding="utf-8").split("\n"):
        m = re.match(r"\\gsec\{(.*)\}\s*$", line)
        if m:
            section = m.group(1)
            sections.setdefault(section, [])
            caption = None
            continue
        m = re.match(r"\\tcap\{(.*)\}\s*$", line)
        if m:
            caption = clean_gloss(m.group(1))
            continue
        if line.startswith("\\begin{dtbl}"):
            in_table = True
            continue
        if line.startswith("\\end{dtbl}"):
            in_table = False
            continue
        if not in_table or not section or "&" not in line:
            continue
        if "\\rowcolor" in line or "\\hd{" in line:
            continue
        if caption in ROW_TABLES:
            continue

        cells = [c.strip() for c in line.rstrip().rstrip("\\").split("&")]
        pairs = [(cells[i], cells[i + 1]) for i in range(0, len(cells) - 1, 2)]
        for de, en in pairs:
            en = clean_gloss(en)
            if en in SKIP_GLOSS:
                continue
            gender = None
            m = ENTRY.search(de)
            if m:
                german = f"{ARTICLE[m.group(1)]} {m.group(2)}"
                gender = m.group(1)
            else:
                m = VERB.search(de)
                german = m.group(2) if m else clean_gloss(de)
            if not german:
                continue
            sections[section].append((german, en, gender))
    return {k: v for k, v in sections.items() if v}


def gloss_words(g):
    return {w for w in re.split(r"[,/ ]+", g.lower()) if len(w) > 2}


def existing_questions():
    """(section, question) pairs already written by hand, so we do not repeat them."""
    hand = root / "docs" / "js" / "questions.js"
    if not hand.exists():
        return set()
    text = hand.read_text(encoding="utf-8")
    return set(re.findall(r'\{s:"((?:[^"\\]|\\.)*)", q:"((?:[^"\\]|\\.)*)"', text))


def build(sections, per_section, seed=20260802):
    rng = random.Random(seed)
    taken = existing_questions()
    out = []
    for section, entries in sections.items():
        # drop anything whose gloss overlaps another entry in the section
        usable = []
        for i, (de, en, g) in enumerate(entries):
            words = gloss_words(en)
            clash = any(
                j != i and (gloss_words(o) & words or o.lower() == en.lower())
                for j, (_, o, _g) in enumerate(entries)
            )
            if not clash:
                usable.append((de, en, g))
        if len(usable) < 6:
            continue

        order = usable[:]
        rng.shuffle(order)
        k = 0
        for (de, en, gender) in order:
            if k >= per_section:
                break
            others = [e for e in usable if e[0] != de]
            picks = rng.sample(others, 3)
            shape = k % 3
            if shape == 2 and gender in ("m", "f", "n"):
                # gender drill: the plural-only nouns are skipped, since their
                # article "die" is indistinguishable from the feminine
                bare = de.split(" ", 1)[1]
                art = de.split(" ", 1)[0]
                q = f"Which article does [[{bare}]] take?"
                a = [art] + [x for x in ("der", "die", "das", "den") if x != art][:3]
                e = f"[[{de}]] — {en}."
            elif shape == 1:
                q = f"How do you say **{en}**?"
                a = [de] + [o[0] for o in picks]
                e = (f"[[{de}]] — the article is part of the word."
                     if gender else f"[[{de}]].")
            else:
                q = f"What does [[{de}]] mean?"
                a = [en] + [o[1] for o in picks]
                e = f"[[{de}]] — {en}."
            if (section, q) in taken or len(set(a)) != 4:
                continue           # already asked by hand, or a distractor collided
            taken.add((section, q))
            out.append({"s": section, "q": q, "a": a, "t": "recall", "e": e})
            k += 1
    return out


def esc(t):
    return t.replace("\\", "\\\\").replace('"', '\\"')


def main():
    sections = parse()
    qs = build(sections, PER_SECTION)
    lines = [
        "/* Vocabulary recall questions — GENERATED, do not edit by hand.",
        " *",
        " * Regenerate with:  python3 tools/make-vocab-questions.py",
        " * Source of truth:  book/chapters/17-vocabulary.tex",
        " */",
        "window.QUESTIONS = (window.QUESTIONS || []).concat([",
    ]
    for q in qs:
        opts = ",".join(f'"{esc(o)}"' for o in q["a"])
        lines.append(
            f'{{s:"{esc(q["s"])}", q:"{esc(q["q"])}", a:[{opts}], '
            f't:"recall", c:0, e:"{esc(q["e"])}"}},'
        )
    lines[-1] = lines[-1].rstrip(",")
    lines.append("]);")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"{OUT.relative_to(root)}: {len(qs)} questions "
          f"across {len(set(q['s'] for q in qs))} sections")
    thin = [s for s, e in sections.items() if len(e) < 6]
    if thin:
        print("  skipped (too few unambiguous words): " + ", ".join(thin))


if __name__ == "__main__":
    main()
