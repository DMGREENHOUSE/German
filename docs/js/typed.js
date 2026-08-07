/* Typed-answer support for the Deutsche Grammatik quiz.
 *
 * Multiple choice tests recognition: four options, a 25% floor, and you can
 * work backwards by elimination. Typing the answer tests production, which is
 * the thing you actually need when speaking. Unticking "Multiple choice" on
 * the setup screen turns this on.
 *
 * Not every question can be typed. "Which of these nouns is neuter?" is
 * meaningless without its four nouns, and a rule question whose answer is a
 * clause has no short form to type. Those keep their options; the toggle asks
 * for typing wherever typing makes sense, not everywhere.
 *
 * window.TYPED.isTypable(q)          -> can this question be typed?
 * window.TYPED.matches(input, want)  -> is what they typed the right answer?
 * window.TYPED.plain(text)           -> question markup stripped
 */
(function () {
  'use strict';

  var ARTICLES = ['der', 'die', 'das'];

  // Answers that only make sense as one of a printed list of choices.
  var META = ['nothing', 'a comma', 'a semicolon', 'a colon', 'a dash',
              'both', 'neither', 'all of them', 'none of them'];

  // Question stems that point at the option list itself.
  var REFERS_TO_OPTIONS =
    /which of these|which line|which pair|which sentence|which is correct|which one|which of the/i;

  function plain(text) {
    return String(text)
      .replace(/\[\[(.+?)\]\]/g, '$1')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .trim();
  }

  /* Case, umlaut spelling and trailing punctuation should never be the reason
     an answer is marked wrong. ae/oe/ue/ss are how Germans type umlauts on a
     keyboard that lacks them, so they have to be accepted. */
  function fold(s) {
    return String(s)
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[.,!?;:]+$/, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function startsWithArticle(s) {
    var first = fold(s).split(' ')[0];
    return ARTICLES.indexOf(first) !== -1;
  }

  /* An English gloss often lists synonyms — "neck, throat", "to think, mean".
     Any one of them is a correct answer, as is the whole string. A German
     answer is never split this way: its article is part of the answer. */
  function acceptable(want) {
    var out = [fold(want)];
    if (startsWithArticle(want)) return out;

    fold(want).split(/\s*[,/]\s*/).forEach(function (part) {
      if (!part) return;
      out.push(part);
      // "to tell" typed as "tell", "the bill" as "bill"
      out.push(part.replace(/^(to|the|a|an) /, ''));
    });
    return out;
  }

  function matches(input, want) {
    var typed = fold(input);
    if (!typed) return false;
    var ok = acceptable(want);
    for (var i = 0; i < ok.length; i++) {
      if (ok[i] && ok[i] === typed) return true;
    }
    return false;
  }

  /* A question can be typed when its answer is a form rather than a sentence,
     and when the question does not depend on the options being visible. */
  function isTypable(q) {
    var want = plain(q.a[q.c]);
    if (!want) return false;
    if (REFERS_TO_OPTIONS.test(plain(q.q))) return false;
    if (META.indexOf(want.toLowerCase()) !== -1) return false;
    if (want.length > 28) return false;
    if (want.split(/\s+/).length > 3) return false;
    if (want.indexOf('–') !== -1 || want.indexOf(' - ') !== -1) return false;
    return true;
  }

  window.TYPED = {
    plain: plain,
    fold: fold,
    matches: matches,
    isTypable: isTypable
  };
})();
