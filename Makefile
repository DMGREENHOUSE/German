# Deutsche Grammatik — book + web app
#
#   make            build the book, then refresh everything in docs/
#   make book       build book/main.pdf only
#   make site       refresh docs/ from an already-built PDF
#   make check      verify the one-page rule and the question bank
#   make serve      preview docs/ at http://localhost:8000
#   make clean      remove LaTeX aux files
#
# Requires: a TeX distribution with latexmk, plus poppler-utils (pdftoppm,
# pdfinfo) and ImageMagick for the page images.

BOOK    := book
DOCS    := docs
TOOLS   := tools
PDF     := $(BOOK)/main.pdf

.PHONY: all book site check serve clean distclean watch

all: book site check

book:
	cd $(BOOK) && latexmk -pdf -interaction=nonstopmode main.tex

site: $(DOCS)/book.pdf $(DOCS)/js/pagemap.js $(DOCS)/pages/page-01.png

$(DOCS)/book.pdf: $(PDF)
	cp $(PDF) $@

$(DOCS)/js/pagemap.js: $(BOOK)/main.toc $(PDF)
	python3 $(TOOLS)/make-pagemap.py $(BOOK)/main.toc $@

$(DOCS)/pages/page-01.png: $(PDF)
	bash $(TOOLS)/make-page-images.sh $(PDF) $(DOCS)/pages

check:
	python3 $(TOOLS)/check-one-page.py $(BOOK)/main.toc
	python3 $(TOOLS)/check-questions.py

# rebuild the book automatically on every save
watch:
	cd $(BOOK) && latexmk -pdf -pvc -interaction=nonstopmode main.tex

serve:
	@echo "http://localhost:8000"
	cd $(DOCS) && python3 -m http.server 8000

clean:
	cd $(BOOK) && latexmk -c

distclean:
	cd $(BOOK) && latexmk -C
