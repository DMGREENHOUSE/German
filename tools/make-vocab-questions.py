#!/usr/bin/env python3
"""Generate recall questions from the vocabulary lists.

Reads book/chapters/17-vocabulary.tex and writes docs/js/questions-vocab.js.
Deriving the questions from the book rather than writing them by hand means
they cannot drift out of step with it, and the answers are correct by
construction.

Four shapes are produced, interleaved so that capping a section still leaves a
balanced mix:
    German to English   "What does [[der Hund]] mean?"      -> dog
    English to German   "How do you say **dog**?"           -> der Hund
    Gender              "Which article does [[Hund]] take?" -> der
    Gender, odd one out "Which of these is neuter?"         -> Fenster

Distractors are drawn from the same section, so the choice is never made easy
by category alone. Any word whose English gloss overlaps another word in the
same section is skipped from the two translation shapes, because that would
create two defensible answers — but it is still fair game for the gender
shapes, which do not depend on the gloss at all.

The odd-one-out shape exists because "which article does X take?" can only
offer three real options; padding it with [[den]] wastes a slot on a form that
is never the answer. Four nouns of which exactly one has the asked-for gender
gives four genuine choices, and forces the gender of all four to be recalled.

Usage:  python3 tools/make-vocab-questions.py [per-section]
"""
import random
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parent.parent
SRC = root / "book" / "chapters" / "17-vocabulary.tex"
OUT = root / "docs" / "js" / "questions-vocab.js"

PER_SECTION = int(sys.argv[1]) if len(sys.argv) > 1 else 60

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


GENDER_NAME = {"m": ("masculine", "der"), "f": ("feminine", "die"),
               "n": ("neuter", "das")}


def unambiguous(entries):
    """Entries whose English gloss is not shared with another entry here.

    Only the translation shapes need this: if two words in a section both mean
    "cousin", then "how do you say cousin?" has two right answers.
    """
    keep = []
    for i, (de, en, g) in enumerate(entries):
        words = gloss_words(en)
        clash = any(
            j != i and (gloss_words(o) & words or o.lower() == en.lower())
            for j, (_, o, _g) in enumerate(entries)
        )
        if not clash:
            keep.append((de, en, g))
    return keep


def nouns_by_gender(entries):
    """{m|f|n: [(bare noun, gloss)]}, one entry per distinct noun.

    Plural-only nouns are left out entirely: their article is [[die]], which a
    learner cannot tell apart from the feminine, so they are unfair either as
    an answer or as a distractor in a gender question.
    """
    buckets = {"m": [], "f": [], "n": []}
    seen = set()
    for de, en, g in entries:
        if g not in buckets or " " not in de:
            continue
        bare = de.split(" ", 1)[1]
        if bare in seen:
            continue
        seen.add(bare)
        buckets[g].append((bare, en))
    return buckets


def translation_shapes(usable, rng):
    """(german->english, english->german) question lists for a section."""
    de2en, en2de = [], []
    for de, en, gender in usable:
        others = [o for o in usable if o[0] != de]
        if len(others) < 3:
            continue

        picks = rng.sample(others, 3)
        a = [en] + [o[1] for o in picks]
        if len(set(a)) == 4:
            de2en.append({
                "q": f"What does [[{de}]] mean?", "a": a,
                "e": f"[[{de}]] — {en}.",
            })

        picks = rng.sample(others, 3)
        a = [de] + [o[0] for o in picks]
        if len(set(a)) == 4:
            en2de.append({
                "q": f"How do you say **{en}**?", "a": a,
                "e": (f"[[{de}]] — the article is part of the word."
                      if gender else f"[[{de}]]."),
            })
    return de2en, en2de


def article_shape(buckets, rng):
    """"Which article does X take?" — one per noun."""
    out = []
    for g, (name, art) in GENDER_NAME.items():
        for bare, en in buckets[g]:
            out.append({
                "q": f"Which article does [[{bare}]] take?",
                "a": [art] + [x for x in ("der", "die", "das", "den") if x != art][:3],
                "e": f"[[{art} {bare}]] — {en}. It is {name}.",
            })
    rng.shuffle(out)
    return out


def odd_one_out_shape(buckets, rng):
    """"Which of these is neuter?" — four nouns, exactly one of that gender."""
    out = []
    for g, (name, art) in GENDER_NAME.items():
        others = [n for og in buckets if og != g for n in buckets[og]]
        pool = buckets[g][:]
        rng.shuffle(pool)
        if len(others) < 3:
            continue
        for bare, en in pool:
            picks = rng.sample(others, 3)
            a = [bare] + [p[0] for p in picks]
            if len(set(a)) != 4:
                continue
            gloss = {b: (og, e) for og in buckets for b, e in buckets[og]}
            rest = ", ".join(
                f"[[{GENDER_NAME[gloss[p[0]][0]][1]} {p[0]}]]" for p in picks)
            out.append({
                "q": f"Which of these nouns is **{name}** ([[{art}]])?",
                "a": a,
                "e": f"[[{art} {bare}]] — {en}. The others are {rest}.",
            })
    rng.shuffle(out)
    return out


def interleave(lists, limit):
    """Round-robin the shape lists, so a cap still leaves a balanced mix."""
    out = []
    for i in range(max((len(x) for x in lists), default=0)):
        for lst in lists:
            if i < len(lst):
                out.append(lst[i])
                if len(out) >= limit:
                    return out
    return out


def build(sections, per_section, seed=20260802):
    rng = random.Random(seed)
    taken = existing_questions()
    out = []
    for section, entries in sections.items():
        usable = unambiguous(entries)
        if len(usable) < 6:
            continue
        buckets = nouns_by_gender(entries)

        de2en, en2de = translation_shapes(usable, rng)
        shapes = [de2en, en2de, article_shape(buckets, rng),
                  odd_one_out_shape(buckets, rng)]

        # ask for more than the cap, then drop anything already asked by hand
        # and trim — otherwise a section loses questions it could have had
        kept = 0
        for q in interleave(shapes, per_section * 3):
            if kept >= per_section:
                break
            if (section, q["q"]) in taken:
                continue
            taken.add((section, q["q"]))
            out.append({"s": section, "q": q["q"], "a": q["a"],
                        "t": "recall", "e": q["e"]})
            kept += 1
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
