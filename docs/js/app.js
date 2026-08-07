/* Deutsche Grammatik — quiz app
 *
 * Data comes from two generated/authored files:
 *   window.PAGEMAP   parts -> sections -> printed page number  (generated)
 *   window.QUESTIONS each tagged with the section title it tests (authored)
 *
 * Questions are matched to pages by section title at load time, so adding a
 * page to the book only requires regenerating pagemap.js.
 */
(function () {
  'use strict';

  var PAGEMAP = window.PAGEMAP || { parts: [] };
  var QUESTIONS = window.QUESTIONS || [];
  var TYPED = window.TYPED;

  // The second axis: what a question asks you to do, independent of the topic.
  var TYPES = [
    { id: 'recall', name: 'Recall',
      desc: 'Retrieve a form, a word or a gender' },
    { id: 'rule', name: 'Rules',
      desc: 'Explain or apply a principle' },
    { id: 'gap', name: 'Gap-fill',
      desc: 'Complete a sentence' }
  ];
  var TYPE_NAME = {};
  TYPES.forEach(function (t) { TYPE_NAME[t.id] = t.name; });

  // ---------- index the books ------------------------------------------
  // Two books now: the grammar reference and the story reader. Each has its
  // own PDF, its own page images and its own front-matter offset, so a page
  // number means nothing without knowing which book it belongs to.
  var BOOKS = PAGEMAP.books || {
    grammar: { title: 'Deutsche Grammatik', pdf: 'book.pdf', images: 'pages/',
               param: 'page', frontMatterOffset: PAGEMAP.frontMatterOffset || 0 }
  };

  var sectionIndex = {};   // section title -> {page, book, partId, partTitle}
  PAGEMAP.parts.forEach(function (part) {
    var book = part.book || 'grammar';
    part.sections.forEach(function (sec) {
      sectionIndex[sec.title] = {
        page: sec.page,
        book: book,
        partId: part.id,
        partTitle: part.title,
        title: sec.title
      };
    });
  });

  function bookOf(id) { return BOOKS[id] || BOOKS.grammar; }

  // attach book position to each question; drop any that cannot be placed
  var orphans = [];
  var pool = QUESTIONS.filter(function (q) {
    var hit = sectionIndex[q.s];
    if (!hit) { orphans.push(q.s); return false; }
    q._page = hit.page;
    q._book = hit.book;
    q._part = hit.partId;
    q._section = hit.title;
    q._type = TYPE_NAME[q.t] ? q.t : 'recall';
    return true;
  });
  if (orphans.length) {
    console.warn('Questions with no matching book section:',
      orphans.filter(function (v, i, a) { return a.indexOf(v) === i; }));
  }

  function countsByPart() {
    var counts = {};
    pool.forEach(function (q) {
      if (state.types[q._type] === false) return;
      counts[q._part] = (counts[q._part] || 0) + 1;
    });
    return counts;
  }

  // ---------- tiny helpers --------------------------------------------
  var $ = function (id) { return document.getElementById(id); };

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Question text may contain <em> for German words. Everything else is escaped.
  function markup(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML
      .replace(/\[\[(.+?)\]\]/g, '<em>$1</em>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { /* private browsing — selections just won't persist */ }
    return null;
  }

  function pageImage(page, book) {
    return bookOf(book).images + 'page-' + String(page).padStart(2, '0') + '.png';
  }

  function pdfLink(page, book) {
    var b = bookOf(book);
    return b.pdf + '#page=' + (page + (b.frontMatterOffset || 0));
  }

  // ---------- state ----------------------------------------------------
  //
  // A quiz runs in rounds. Round 0 is the questions you asked for; every round
  // after it re-asks whatever you got wrong in the round before, and the quiz
  // is not over until a round comes back clean. Only round 0 scores, so the
  // result is still "how much did you know walking in".
  var state = {
    selected: {},        // partId -> bool
    types: {},           // typeId -> bool
    count: 20,
    typed: false,        // true = type the answer wherever the question allows
    pageFilter: null,    // set by ?page=N from a "Diese Seite testen" link
    queue: [],
    index: 0,
    round: 0,            // 0 = the first pass, 1+ = review rounds
    firstTry: 0,
    missed: [],          // section titles answered wrongly at least once
    roundMissed: [],     // questions answered wrongly in the current round
    byType: {},          // typeId -> {asked, right}
    answeredThis: false
  };

  // ---------- setup view ----------------------------------------------
  function renderChapters() {
    var counts = countsByPart();
    var list = $('chapterList');
    list.innerHTML = '';
    var lastBook = null;
    PAGEMAP.parts.forEach(function (part) {
      // The two books share one list, so each needs naming where it starts —
      // otherwise the reader's four chapters look like four more grammar ones.
      var book = part.book || 'grammar';
      if (book !== lastBook) {
        lastBook = book;
        var head = document.createElement('li');
        head.className = 'bookhead';
        var bname = document.createElement('span');
        bname.className = 'bk-name';
        bname.textContent = bookOf(book).title;
        var blink = document.createElement('a');
        blink.className = 'linkbtn';
        blink.href = bookOf(book).pdf;
        blink.target = '_blank';
        blink.rel = 'noopener';
        blink.textContent = 'Open the PDF';
        head.appendChild(bname);
        head.appendChild(blink);
        list.appendChild(head);
      }

      var n = counts[part.id] || 0;
      var li = document.createElement('li');
      var label = document.createElement('label');

      var box = document.createElement('input');
      box.type = 'checkbox';
      box.value = part.id;
      box.checked = state.selected[part.id] !== false;
      label.classList.toggle('empty', n === 0);
      box.addEventListener('change', function () {
        state.selected[part.id] = box.checked;
        saveSelection();
        renderTypes();
        updatePool();
      });

      var name = document.createElement('span');
      name.className = 'ch-name';
      name.textContent = part.id + '. ' + part.title;

      var meta = document.createElement('span');
      meta.className = 'ch-meta';
      meta.textContent = n === 0 ? 'none of this type' : n + ' questions';

      label.appendChild(box);
      label.appendChild(name);
      label.appendChild(meta);
      li.appendChild(label);
      list.appendChild(li);
    });
  }

  function renderTypes() {
    var counts = typeCounts();
    var list = $('typeList');
    list.innerHTML = '';
    TYPES.forEach(function (t) {
      var n = counts[t.id];
      var li = document.createElement('li');
      var label = document.createElement('label');

      var box = document.createElement('input');
      box.type = 'checkbox';
      box.value = t.id;
      box.checked = state.types[t.id] !== false;
      box.addEventListener('change', function () {
        state.types[t.id] = box.checked;
        // never let the user select nothing at all
        if (TYPES.every(function (o) { return state.types[o.id] === false; })) {
          state.types[t.id] = true;
          box.checked = true;
        }
        saveSelection();
        renderTypes();
        renderChapters();
        updatePool();
      });

      var text = document.createElement('span');
      var name = document.createElement('span');
      name.className = 'ty-name';
      name.textContent = t.name;
      var desc = document.createElement('span');
      desc.className = 'ty-desc';
      desc.textContent = t.desc;
      var count = document.createElement('span');
      count.className = 'ty-count';
      count.textContent = n + ' available';

      text.appendChild(name);
      text.appendChild(desc);
      text.appendChild(count);
      label.appendChild(box);
      label.appendChild(text);
      li.appendChild(label);
      list.appendChild(li);
    });
  }

  function saveSelection() {
    var off = PAGEMAP.parts
      .filter(function (p) { return state.selected[p.id] === false; })
      .map(function (p) { return p.id; });
    store('dg.deselected', JSON.stringify(off));
    var offTypes = TYPES.filter(function (t) { return state.types[t.id] === false; })
                        .map(function (t) { return t.id; });
    store('dg.deselectedTypes', JSON.stringify(offTypes));
  }

  function loadSelection() {
    var raw = store('dg.deselected');
    if (!raw) return;
    try {
      JSON.parse(raw).forEach(function (id) { state.selected[id] = false; });
    } catch (e) { /* ignore malformed value */ }
  }

  function loadTypeSelection() {
    var raw = store('dg.deselectedTypes');
    if (!raw) return;
    try {
      var off = JSON.parse(raw);
      if (off.length < TYPES.length) {
        off.forEach(function (id) { state.types[id] = false; });
      }
    } catch (e) { /* ignore malformed value */ }
  }

  function chapterPool() {
    return pool.filter(function (q) { return state.selected[q._part] !== false; });
  }

  // A page filter comes from a "Diese Seite testen" link in the book and
  // deliberately overrides both other axes: you asked for that page, not for
  // that page minus whatever happens to be unticked from last time.
  function selectedPool() {
    if (state.pageFilter) {
      return pool.filter(function (q) {
        return q._page === state.pageFilter.page &&
               q._book === state.pageFilter.book;
      });
    }
    return chapterPool().filter(function (q) { return state.types[q._type] !== false; });
  }

  // ---------- deep link from the book ----------------------------------
  function queryParam(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search || '');
    return m ? decodeURIComponent(m[1]) : null;
  }

  function sectionOnPage(page, book) {
    for (var title in sectionIndex) {
      var s = sectionIndex[title];
      if (s.page === page && s.book === book) return s;
    }
    return null;
  }

  function applyPageFilter(page, book) {
    var hits = pool.filter(function (q) {
      return q._page === page && q._book === book;
    });
    var note = $('pageNote');
    var text = $('pageNoteText');
    var info = sectionOnPage(page, book);
    var where = bookOf(book).title + ', page ' + page;

    if (!hits.length) {
      text.textContent = info
        ? where + ' — ' + info.title + ' — has no questions yet.'
        : where + ' has no questions yet.';
      $('clearPageBtn').hidden = true;
      note.hidden = false;
      return false;
    }

    state.pageFilter = { page: page, book: book };
    text.textContent = where + (info ? ' — ' + info.title : '') +
      ': ' + hits.length + ' question' + (hits.length === 1 ? '' : 's') + '.';
    $('clearPageBtn').hidden = false;
    note.hidden = false;
    return true;
  }

  function clearPageFilter() {
    state.pageFilter = null;
    $('pageNote').hidden = true;
    updatePool();
  }

  // how many questions of each type the current chapter selection offers
  function typeCounts() {
    var counts = {};
    TYPES.forEach(function (t) { counts[t.id] = 0; });
    chapterPool().forEach(function (q) { counts[q._type]++; });
    return counts;
  }

  function updatePool() {
    var n = selectedPool().length;
    var asked = state.count === 0 ? n : Math.min(state.count, n);
    $('poolInfo').textContent = n === 0
      ? 'Nothing matches — widen the chapters or the question types.'
      : state.pageFilter
        ? 'all ' + n + ' questions on that page'
        : asked + ' of ' + n + ' matching questions';
    $('startBtn').disabled = n === 0;
    updateTypedCount(n);
  }

  // Say up front how much of the current selection can actually be typed, so
  // that unticking the box is not a leap in the dark.
  function updateTypedCount(n) {
    var label = $('typedCount');
    if (!label || !TYPED) return;
    if (state.typed === false) {
      label.textContent = 'every question has four options';
      return;
    }
    var typable = selectedPool().filter(TYPED.isTypable).length;
    label.textContent = n === 0 ? '' :
      typable + ' of ' + n + ' can be typed; the rest keep their options';
  }

  // ---------- views -----------------------------------------------------
  function show(id) {
    ['setup', 'quiz', 'results'].forEach(function (v) { $(v).hidden = v !== id; });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  // ---------- quiz ------------------------------------------------------
  function startQuiz() {
    var available = shuffle(selectedPool());
    var whole = state.count === 0 || state.pageFilter;
    var n = whole ? available.length : Math.min(state.count, available.length);
    pool.forEach(function (q) { delete q._missedThisRound; });
    state.queue = available.slice(0, n);
    state.index = 0;
    state.round = 0;
    state.reviewRounds = 0;
    state.firstTry = 0;
    state.missed = [];
    state.roundMissed = [];
    state.byType = {};
    TYPES.forEach(function (t) { state.byType[t.id] = { asked: 0, right: 0 }; });
    state.queue.forEach(function (q) { state.byType[q._type].asked++; });
    state.asked = state.queue.length;
    show('quiz');
    renderQuestion();
  }

  // Re-ask everything missed in the round just finished. Returns false when
  // the round was clean, which is the only way a quiz ends.
  function startReviewRound() {
    if (!state.roundMissed.length) return false;
    state.round++;
    state.reviewRounds = state.round;
    state.queue = shuffle(state.roundMissed);
    state.roundMissed = [];
    state.index = 0;
    state.queue.forEach(function (q) { delete q._missedThisRound; });
    renderQuestion();
    return true;
  }

  function renderQuestion() {
    var q = state.queue[state.index];
    state.answeredThis = false;

    $('progressBar').style.width =
      (state.index / state.queue.length * 100).toFixed(1) + '%';
    $('counter').textContent = 'Question ' + (state.index + 1) + ' of ' + state.queue.length;
    $('score').textContent = state.round === 0
      ? state.firstTry + ' right first time'
      : 'Review round ' + state.round;

    var banner = $('roundBanner');
    banner.hidden = state.round === 0;
    if (state.round > 0) {
      banner.textContent = state.queue.length === 1
        ? 'Review — the one you got wrong. Answer it right to finish.'
        : 'Review — the ' + state.queue.length +
          ' you got wrong. Clear them all to finish.';
    }

    $('topic').textContent = q._section;
    $('typeBadge').textContent = TYPE_NAME[q._type];
    $('typeBadge').setAttribute('data-type', q._type);
    $('question').innerHTML = markup(q.q);

    $('feedback').hidden = true;
    $('reader').hidden = true;
    $('nextBtn').hidden = true;

    if (askByTyping(q)) return renderTypedInput();
    renderOptions(q);
  }

  // Typing is asked for only when the learner wants it AND the question has a
  // form short enough to type. "Which of these nouns is neuter?" keeps its
  // options whatever the setting, because without them there is no question.
  function askByTyping(q) {
    return state.typed && !!TYPED && TYPED.isTypable(q);
  }

  function renderOptions(q) {
    $('typedWrap').hidden = true;
    $('typedInput').value = '';   // never leave the last typed answer lying about
    var box = $('options');
    box.hidden = false;
    box.innerHTML = '';

    // shuffle the options, remembering which one is correct
    var order = shuffle(q.a.map(function (text, i) { return { text: text, ok: i === q.c }; }));
    order.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'opt';
      var key = document.createElement('span');
      key.className = 'key';
      key.textContent = 'ABCD'[i];
      var txt = document.createElement('span');
      txt.innerHTML = markup(opt.text);
      btn.appendChild(key);
      btn.appendChild(txt);
      btn.addEventListener('click', function () { answer(btn, opt.ok, q); });
      box.appendChild(btn);
    });
  }

  function renderTypedInput() {
    $('options').hidden = true;
    $('options').innerHTML = '';
    $('typedWrap').hidden = false;

    var input = $('typedInput');
    input.value = '';
    input.disabled = false;
    input.className = 'typedinput';
    $('checkBtn').disabled = false;
    input.focus({ preventScroll: true });
  }

  function answer(btn, ok, q) {
    if (state.answeredThis) return;
    state.answeredThis = true;

    var buttons = $('options').querySelectorAll('.opt');
    Array.prototype.forEach.call(buttons, function (b) { b.disabled = true; });
    btn.classList.add(ok ? 'correct' : 'wrong');
    settle(ok, q);
  }

  // Check what was typed. A blank box is not an answer — it is not worth
  // burning a question on, so it is ignored rather than marked wrong.
  function answerTyped(q) {
    if (state.answeredThis) return;
    var input = $('typedInput');
    if (!input.value.trim()) return;
    state.answeredThis = true;

    var ok = TYPED.matches(input.value, TYPED.plain(q.a[q.c]));
    input.disabled = true;
    $('checkBtn').disabled = true;
    input.classList.add(ok ? 'correct' : 'wrong');
    settle(ok, q);
  }

  // Everything after an answer is judged, whichever way it was given.
  function settle(ok, q) {
    var fb = $('feedback');
    var fbText = $('feedbackText');

    if (ok) {
      if (!q._missedThisRound && state.round === 0) {
        state.firstTry++;
        state.byType[q._type].right++;
      }
      fb.className = 'feedback good';
      fbText.innerHTML = q.e ? markup(q.e) : 'Correct.';
      fb.hidden = false;
      $('nextBtn').hidden = false;
      $('nextBtn').textContent = nextLabel();
      $('nextBtn').focus({ preventScroll: true });
      return;
    }

    // Wrong. The right answer is deliberately NOT revealed — the book page
    // opens instead and the same question is asked again.
    if (!q._missedThisRound) {
      q._missedThisRound = true;
      state.roundMissed.push(q);
      if (state.missed.indexOf(q._section) === -1) state.missed.push(q._section);
    }

    fb.className = 'feedback bad';
    fbText.innerHTML = 'Not quite. Have a read, then come back and try again.';
    fb.hidden = false;

    $('readerTitle').textContent = q._section + ' — ' + bookOf(q._book).title +
      ', page ' + q._page;
    $('readerPdf').href = pdfLink(q._page, q._book);
    var img = $('readerImg');
    img.src = pageImage(q._page, q._book);
    img.alt = 'Book page ' + q._page + ': ' + q._section;
    $('reader').hidden = false;
    $('reader').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // What the button after a correct answer should say. Naming the review round
  // before it starts is the only warning the learner gets that the quiz is not
  // over yet, so it has to be explicit.
  function nextLabel() {
    if (state.index + 1 < state.queue.length) return 'Next question';
    if (!state.roundMissed.length) return 'See results';
    return state.roundMissed.length === 1
      ? 'Review the one you got wrong'
      : 'Review the ' + state.roundMissed.length + ' you got wrong';
  }

  function retry() {
    var q = state.queue[state.index];
    renderQuestion();
    q._missedThisRound = true;   // renderQuestion resets the view, not the flag
    $('question').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function next() {
    state.index++;
    if (state.index < state.queue.length) return renderQuestion();
    if (startReviewRound()) return;
    finish();
  }

  function finish() {
    var total = state.asked || state.queue.length;
    $('progressBar').style.width = '100%';
    $('roundBanner').hidden = true;
    $('resultLine').textContent =
      state.firstTry + ' of ' + total + ' answered correctly first time.';

    var rounds = $('roundLine');
    if (state.reviewRounds) {
      rounds.textContent = state.reviewRounds === 1
        ? 'One review round to clear the rest.'
        : state.reviewRounds + ' review rounds to clear the rest.';
      rounds.hidden = false;
    } else {
      rounds.hidden = true;
    }

    var bd = $('typeBreakdown');
    bd.innerHTML = '';
    TYPES.forEach(function (t) {
      var tally = state.byType[t.id];
      if (!tally || !tally.asked) return;
      var li = document.createElement('li');
      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.setAttribute('data-type', t.id);
      badge.textContent = t.name;
      var desc = document.createElement('span');
      desc.textContent = t.desc;
      var score = document.createElement('span');
      score.className = 'bd-score';
      score.textContent = tally.right + ' / ' + tally.asked;
      li.appendChild(badge);
      li.appendChild(desc);
      li.appendChild(score);
      bd.appendChild(li);
    });

    var wrap = $('reviewWrap');
    var list = $('reviewList');
    list.innerHTML = '';
    if (state.missed.length) {
      state.missed.forEach(function (title) {
        var info = sectionIndex[title];
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = pageImage(info.page, info.book);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = title;
        var pg = document.createElement('span');
        pg.className = 'pg';
        pg.textContent = 'page ' + info.page;
        li.appendChild(a);
        li.appendChild(pg);
        list.appendChild(li);
      });
      wrap.hidden = false;
    } else {
      wrap.hidden = true;
    }

    // clear the per-round flags so a repeat run scores fresh
    pool.forEach(function (q) { delete q._missedThisRound; });
    show('results');
  }

  // ---------- wiring ----------------------------------------------------
  function init() {
    if (!pool.length) {
      $('poolInfo').textContent = 'No questions loaded.';
      $('startBtn').disabled = true;
      return;
    }

    loadSelection();
    loadTypeSelection();
    state.typed = store('dg.typed') === '1';
    var mcBox = $('mcBox');
    mcBox.checked = !state.typed;
    mcBox.addEventListener('change', function () {
      state.typed = !mcBox.checked;
      store('dg.typed', state.typed ? '1' : '0');
      updatePool();
    });

    renderChapters();
    renderTypes();

    var saved = store('dg.count');
    if (saved !== null) state.count = parseInt(saved, 10) || 20;
    Array.prototype.forEach.call(
      document.querySelectorAll('.segmented button'),
      function (b) {
        var on = parseInt(b.dataset.count, 10) === state.count;
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
        b.addEventListener('click', function () {
          state.count = parseInt(b.dataset.count, 10);
          store('dg.count', String(state.count));
          Array.prototype.forEach.call(
            document.querySelectorAll('.segmented button'),
            function (o) {
              var sel = o === b;
              o.classList.toggle('on', sel);
              o.setAttribute('aria-checked', sel ? 'true' : 'false');
            });
          updatePool();
        });
      });

    $('selectAll').addEventListener('click', function () {
      PAGEMAP.parts.forEach(function (p) { state.selected[p.id] = true; });
      saveSelection(); renderChapters(); renderTypes(); updatePool();
    });
    $('selectNone').addEventListener('click', function () {
      PAGEMAP.parts.forEach(function (p) { state.selected[p.id] = false; });
      saveSelection(); renderChapters(); renderTypes(); updatePool();
    });

    $('startBtn').addEventListener('click', startQuiz);
    $('retryBtn').addEventListener('click', retry);
    $('nextBtn').addEventListener('click', next);
    $('quitBtn').addEventListener('click', finish);
    $('againBtn').addEventListener('click', startQuiz);
    $('homeBtn').addEventListener('click', function () {
      clearPageFilter();
      show('setup');
    });
    $('clearPageBtn').addEventListener('click', function () {
      clearPageFilter();
      show('setup');
    });

    $('checkBtn').addEventListener('click', function () {
      answerTyped(state.queue[state.index]);
    });

    // keyboard: 1-4 pick an answer, Enter moves on
    document.addEventListener('keydown', function (ev) {
      if ($('quiz').hidden) return;
      var typing = !$('typedWrap').hidden;

      // 1-4 are digits someone may legitimately be typing into the box
      if (!typing && ev.key >= '1' && ev.key <= '4') {
        var btns = $('options').querySelectorAll('.opt');
        var b = btns[parseInt(ev.key, 10) - 1];
        if (b && !b.disabled) b.click();
      } else if (ev.key === 'Enter') {
        if (!$('nextBtn').hidden) $('nextBtn').click();
        else if (!$('reader').hidden) $('retryBtn').click();
        else if (typing) answerTyped(state.queue[state.index]);
      }
    });

    updatePool();

    // A link in the book asks for one page. Go straight into it rather than
    // making someone who has already chosen a topic choose it again.
    // Each book links with its own parameter: ?page=N from the grammar book,
    // ?story=N from the reader. One parameter plus a book name would have
    // needed an & in the URL, which LaTeX makes needlessly awkward.
    for (var id in BOOKS) {
      var deep = parseInt(queryParam(BOOKS[id].param), 10);
      if (deep && applyPageFilter(deep, id)) {
        updatePool();
        startQuiz();
        break;
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
