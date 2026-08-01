# Deutsche Grammatik — A Visual Reference

An A5 LaTeX reference book of German grammar. Every topic gets exactly one page,
so the book opens flat on a single table you can drill.

## Build

Needs a TeX distribution with `latexmk` (TeX Live, MacTeX, MiKTeX) and pdfLaTeX.

```bash
make          # build main.pdf
make watch    # rebuild on every save
make clean    # remove aux files, keep the PDF
```

Or directly:

```bash
latexmk -pdf main.tex
```

It also compiles unchanged on Overleaf — set the compiler to **pdfLaTeX** and
the main document to `main.tex`.

All packages used ship with a standard TeX Live install. There is deliberately
no `babel` German option, no custom fonts and no shell-escape, so the book
builds on a minimal setup.

## Layout of the repo

```
main.tex                  loads everything, in reading order
preamble/
  packages.tex            package list and A5 page geometry
  colours.tex             the gender/case colour scheme
  macros.tex              \gpart, \gsec and the five table environments
frontmatter/
  titlepage.tex
  howtouse.tex            colour key and the symbols used in the tables
chapters/
  01-pronouns.tex         personal, reflexive, relative
  02-articles.tex         the four cases, articles and possessives
  03-adjectives.tex       weak / mixed / strong endings
  04-prepositions.tex     by case, plus the two-way group
  05-verbs.tex            present tense, stem changes, modals, prefixes
  06-tenses.tex           perfect, Präteritum, pluperfect, future
  07-moods.tex            imperative, Konjunktiv II, passive
  08-wordorder.tex        verb-second, TeKaMoLo, conjunctions
  09-questions.tex        W-words and question structure
  10-comparison.tex       comparative and superlative
  11-nouns.tex            gender, plurals, weak nouns, compounds
  12-reference.tex        dative verbs, verb + preposition, numbers, dates
  13-strongverbs.tex      ~70 strong and irregular verbs over four pages
```

## Writing a new page

The page discipline is enforced by two macros in `preamble/macros.tex`:

```latex
\gpart{V}{Verbs}      % dark banner, starts a fresh page
\gsec{Modal verbs}    % one topic; forces a page break unless it
                      % directly follows a \gpart banner
```

Inside a page, use `\tcap{...}` for a table caption and one of the five table
environments:

| Environment  | Use for                                                    |
|--------------|------------------------------------------------------------|
| `gendertbl`  | label column + masculine / feminine / neuter / plural       |
| `casetbl`    | the seven-column personal-pronoun grid                      |
| `gtbl`       | general workhorse: dark header row, zebra body              |
| `flattbl`    | reference block, no header, bold first column               |
| `extbl`      | example sentences, German left / English right, no bolding  |
| `gnote`      | violet note box (one paragraph — `\\` would start a row)    |

Inline helpers: `\en{-en}` highlights an ending, `\eng{gloss}` sets a grey
italic gloss, `\xx` marks a form that does not exist.

## Colour code

| Colour | Gender  | Article |
|--------|---------|---------|
| blue   | maskulin | der    |
| red    | feminin  | die    |
| green  | neutrum  | das    |
| amber  | Plural   | die    |

Colour sits in the header cells with a light tint down each column, so the book
still reads correctly printed in black and white.

## Printing

The geometry is set for A5 with a wider inner margin for binding. To print two
pages per A4 sheet:

```bash
pdfjam --nup 2x1 --landscape --outfile booklet.pdf main.pdf
```
