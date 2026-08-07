# Deutsche Grammatik

An A5 German grammar reference, plus a quiz web app that sends you back to the
relevant page of the book whenever you get something wrong.

- **The book** — `book/`, LaTeX, one topic per page, 89 topics over 99 pages.
- **The app** — `docs/`, a static site served by GitHub Pages.

## Repository layout

```
book/                    the LaTeX source
  main.tex               loads everything, in reading order
  preamble/
    packages.tex         package list and A5 page geometry
    colours.tex          the gender/case colour scheme
    macros.tex           \gpart, \gsec and the seven table environments
  frontmatter/
    titlepage.tex
    howtouse.tex         colour key, symbols, and a glossary of the terms used
  chapters/00-17         one file per part

docs/                    the GitHub Pages site (everything is committed)
  index.html
  css/style.css
  js/app.js              quiz logic
  js/questions.js        the question bank — hand written
  js/questions-vocab.js  vocabulary recall questions — GENERATED
  js/pagemap.js          section -> page number — GENERATED
  book.pdf               copy of book/main.pdf — GENERATED
  pages/page-NN.png      one image per book page — GENERATED

tools/
  make-pagemap.py        main.toc  -> docs/js/pagemap.js
  make-vocab-questions.py  word lists -> docs/js/questions-vocab.js
  sort-vocabulary.py     alphabetises the word lists (--check to verify)
  make-page-images.sh    main.pdf  -> docs/pages/
  check-tables.py        asserts every dtbl column spec is well formed
  check-one-page.py      asserts every topic still fits on one page
  check-questions.py     asserts every question points at a real section
  test-app.js            headless run-through of the whole quiz (needs jsdom)

Makefile                 build the book, refresh docs/, run the checks
```

## Building

Requires a TeX distribution with `latexmk`, plus `poppler-utils` and
ImageMagick for the page images.

```bash
make          # build the book, refresh docs/, run the checks
make sort     # re-alphabetise the vocabulary lists
make questions # regenerate the vocabulary question bank
make book     # book/main.pdf only
make site     # regenerate docs/ from an existing PDF
make check    # one-page rule + question bank
make serve    # preview the site at http://localhost:8000
```

The book also compiles unchanged on Overleaf: set the compiler to **pdfLaTeX**
and the main document to `book/main.tex`. Every package used ships with a
standard TeX Live install — there is no `babel` German option, no custom fonts
and no shell-escape.

## Publishing the site

Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder
`/docs`. Everything the site needs is committed, so there is no build step and
no Action to configure.

## Working on the book

Two macros enforce the one-topic-per-page rule:

```latex
\gpart{V}{Verbs}      % dark banner, starts a fresh page
\gsec{Modal verbs}    % one topic; forces a page break unless it
                      % directly follows a \gpart banner
\gintro{One or two sentences of context under the heading.}
```

Inside a page use `\tcap{...}` for a table caption and one of these
environments:

| Environment  | Use for                                                     |
|--------------|-------------------------------------------------------------|
| `gendertbl`  | label column + masculine / feminine / neuter / plural        |
| `posstbl`    | the four case pages: articles, then singular, then plural    |
| `casetbl`    | the seven-column personal-pronoun grid                       |
| `gtbl`       | general workhorse: dark header row, zebra body               |
| `flattbl`    | reference block, no header, bold first column                |
| `extbl`      | example sentences, German left / English right, no bolding   |
| `dtbl`       | long word lists — cheap to typeset, use it for anything big   |
| `gnote`      | violet note box                                               |

Inline: `\en{-en}` highlights an ending, `\eng{gloss}` sets a grey italic gloss,
`\xx` marks a form that does not exist.

Vocabulary macros put the article on the noun and colour it by gender:
`\dm{Hund}` gives *der Hund* in blue, `\df{}` *die* in red, `\dn{}` *das* in
green, `\dpl{}` a plural-only noun in amber. Verbs use `\vr{}` for regular and
`\vi{}` for irregular, which prints bold in the accent colour. None of this
colour reaches the quiz, which renders plain text.

### A note on compile time

`gendertbl`, `posstbl` and `casetbl` are built on tabularray, which is elegant
but costs roughly 0.17s per table. With hundreds of tables that dominated the
build, so the long lists use `dtbl` (tabularx) instead and the note boxes are
plain colour boxes. Keep new bulk content on `dtbl`. `dtbl` column weights must
sum to the number of columns — `make check` enforces this, because tabularx
silently squashes the table rather than complaining.

After any edit, `make check` confirms nothing has spilled onto a second page.

## Working on the quiz

Questions live in `docs/js/questions.js`:

```js
{s:"Dative", q:"[[Wir fahren mit ___ Zug.]]", a:["dem","den","der","des"],
 t:"gap", c:0, e:"[[mit]] takes the dative; masculine dative is [[dem]]."}
```

`s` must match a section title in the book exactly — that is how a wrong answer
finds the page to show. `[[double brackets]]` render italic, `**stars**` bold.
Options are shuffled at run time, so `c` is the index in the array as written.

`t` is the question type, the second axis the quiz filters on alongside
chapters:

| `t`      | Shown as | Asks you to                                    |
|----------|----------|------------------------------------------------|
| `recall` | Recall   | retrieve a form, a word or a gender            |
| `rule`   | Rules    | explain or apply a principle — *why* haben?    |
| `gap`    | Gap-fill | complete a sentence                            |

Every chapter carries all three types, so any combination of the two axes
yields a usable quiz. `make check` reports the split and rejects an unknown
type; `tools/test-app.js` asserts that filtering by type really does restrict
the questions asked.

There are around 2,000 questions, no section with fewer than ten.

## Review rounds

A quiz does not end when the questions run out. Getting an answer wrong opens
the book page and re-asks the same question straight away, and at the end of
the round every question missed along the way is asked again — as many rounds
as it takes for one to come back clean.

Only the first round scores. `state.round` is 0 for that round and 1, 2, 3 …
for the review rounds, and both `state.firstTry` and the per-type tallies are
guarded on it, so the result on the way out is still *what did you know walking
in*. `state.roundMissed` collects the questions to re-ask and is emptied at the
start of each round; `state.missed` accumulates section titles across the whole
quiz and drives the "Worth another look" list.

The one thing to be careful of when editing this: `startReviewRound()` returning
false is the **only** way a quiz reaches the results screen, other than the
"End quiz" button. If you add an early return to `next()`, make sure it still
runs through it.

`make check` will tell you about a title that does not match, a section with no
questions, duplicate options, or a bad answer index. For a full run-through:

```bash
npm install jsdom
node tools/test-app.js
```

## How the vocabulary is ordered

Every word list is alphabetical by German word, ignoring the article. Sorting
follows German dictionary practice: ä, ö and ü collate as a, o and u, and ß as
ss. Entries are laid out **column-major**, so the alphabet runs down the
left-hand pair of columns and continues down the right-hand pair.

Three tables are deliberately not in that order:

- **Common adjectives** and **Countries and languages** are sorted by row,
  because each row is a meaningful pair — an opposite, or a country with its
  language.
- **Days and months** stay in calendar order, which is what you actually want
  to look at.

`tools/sort-vocabulary.py` does the sorting and `--check` verifies it, so a
hand-added word that lands in the wrong place is caught by `make check`.

## Generated questions

`tools/make-vocab-questions.py` reads the word lists and writes 1,200 recall
questions in four shapes — German to English, English to German, *which article
does this noun take*, and *which of these four nouns is neuter*. Distractors
come from the same section, so the answer is never obvious from the category
alone. The shapes are interleaved before the per-section cap is applied, so
capping a section still leaves a balanced mix rather than 60 translations and
no gender drills.

The fourth shape exists because "which article does X take?" only has three
real options and has to pad the fourth with `den`, which is never the answer.
Offering four nouns of which exactly one is neuter gives four genuine choices
and makes you recall the gender of all four.

Three safeguards matter:

- a word whose English gloss overlaps another word in the same section is
  skipped from the two translation shapes, since that would give two defensible
  answers — but it is still used for the gender shapes, which do not depend on
  the gloss
- plural-only nouns never appear in a gender question, because their `die` is
  indistinguishable from the feminine
- questions already written by hand are not duplicated

The per-section cap is the script's one argument; `make questions` passes 60.

Because the questions are derived from the book, they cannot drift out of step
with it. Edit the word list, run `make questions`, and the bank follows.

## Colour code

| Colour | Gender   | Article |
|--------|----------|---------|
| blue   | maskulin | der     |
| red    | feminin  | die     |
| green  | neutrum  | das     |
| amber  | Plural   | die     |

Colour sits in the header cells with a light tint down each column, so the book
still reads correctly printed in black and white.

## Printing

The geometry is set for A5 with a wider inner margin for binding. Two pages to
an A4 sheet:

```bash
pdfjam --nup 2x1 --landscape --outfile booklet.pdf book/main.pdf
```
