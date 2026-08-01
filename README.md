# Deutsche Grammatik

An A5 German grammar reference, plus a quiz web app that sends you back to the
relevant page of the book whenever you get something wrong.

- **The book** — `book/`, LaTeX, one topic per page, 60 topics over 70 pages.
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
  chapters/01-14         one file per part

docs/                    the GitHub Pages site (everything is committed)
  index.html
  css/style.css
  js/app.js              quiz logic
  js/questions.js        the question bank — hand written
  js/pagemap.js          section -> page number — GENERATED
  book.pdf               copy of book/main.pdf — GENERATED
  pages/page-NN.png      one image per book page — GENERATED

tools/
  make-pagemap.py        main.toc  -> docs/js/pagemap.js
  make-page-images.sh    main.pdf  -> docs/pages/
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
| `gnote`      | violet note box — one paragraph only, `\\` would start a row |

Inline: `\en{-en}` highlights an ending, `\eng{gloss}` sets a grey italic gloss,
`\xx` marks a form that does not exist.

After any edit, `make check` confirms nothing has spilled onto a second page.

## Working on the quiz

Questions live in `docs/js/questions.js`:

```js
{s:"Dative", q:"[[Wir fahren mit ___ Zug.]]", a:["dem","den","der","des"], c:0,
 e:"[[mit]] takes the dative; masculine dative is [[dem]]."}
```

`s` must match a section title in the book exactly — that is how a wrong answer
finds the page to show. `[[double brackets]]` render italic, `**stars**` bold.
Options are shuffled at run time, so `c` is the index in the array as written.

`make check` will tell you about a title that does not match, a section with no
questions, duplicate options, or a bad answer index. For a full run-through:

```bash
npm install jsdom
node tools/test-app.js
```

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
