# German Grammar — A5 booklet
# Requires: a TeX distribution with latexmk (TeX Live, MiKTeX, MacTeX)

MAIN = main

.PHONY: all watch clean distclean

all:
	latexmk -pdf -interaction=nonstopmode $(MAIN).tex

# rebuild automatically whenever a source file changes
watch:
	latexmk -pdf -pvc -interaction=nonstopmode $(MAIN).tex

# remove build artefacts, keep the PDF
clean:
	latexmk -c

# remove everything including the PDF
distclean:
	latexmk -C
