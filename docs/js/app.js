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

  // ---------- index the book ------------------------------------------
  var sectionIndex = {};   // section title -> {page, partId, partTitle}
  PAGEMAP.parts.forEach(function (part) {
    part.sections.forEach(function (sec) {
      sectionIndex[sec.title] = {
        page: sec.page,
        partId: part.id,
        partTitle: part.title,
        title: sec.title
      };
    });
  });

  // attach book position to each question; drop any that cannot be placed
  var orphans = [];
  var pool = QUESTIONS.filter(function (q) {
    var hit = sectionIndex[q.s];
    if (!hit) { orphans.push(q.s); return false; }
    q._page = hit.page;
    q._part = hit.partId;
    q._section = hit.title;
    return true;
  });
  if (orphans.length) {
    console.warn('Questions with no matching book section:',
      orphans.filter(function (v, i, a) { return a.indexOf(v) === i; }));
  }

  var countByPart = {};
  pool.forEach(function (q) { countByPart[q._part] = (countByPart[q._part] || 0) + 1; });

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

  function pageImage(page) {
    return 'pages/page-' + String(page).padStart(2, '0') + '.png';
  }

  // ---------- state ----------------------------------------------------
  var state = {
    selected: {},        // partId -> bool
    count: 20,
    queue: [],
    index: 0,
    firstTry: 0,
    missed: [],          // section titles answered wrongly at least once
    answeredThis: false
  };

  // ---------- setup view ----------------------------------------------
  function renderChapters() {
    var list = $('chapterList');
    list.innerHTML = '';
    PAGEMAP.parts.forEach(function (part) {
      var n = countByPart[part.id] || 0;
      var li = document.createElement('li');
      var label = document.createElement('label');

      var box = document.createElement('input');
      box.type = 'checkbox';
      box.value = part.id;
      box.checked = state.selected[part.id] !== false && n > 0;
      box.disabled = n === 0;
      box.addEventListener('change', function () {
        state.selected[part.id] = box.checked;
        saveSelection();
        updatePool();
      });

      var name = document.createElement('span');
      name.className = 'ch-name';
      name.textContent = part.id + '. ' + part.title;

      var meta = document.createElement('span');
      meta.className = 'ch-meta';
      meta.textContent = n === 0 ? 'no questions' : n + ' questions';

      label.appendChild(box);
      label.appendChild(name);
      label.appendChild(meta);
      li.appendChild(label);
      list.appendChild(li);
    });
  }

  function saveSelection() {
    var off = PAGEMAP.parts
      .filter(function (p) { return state.selected[p.id] === false; })
      .map(function (p) { return p.id; });
    store('dg.deselected', JSON.stringify(off));
  }

  function loadSelection() {
    var raw = store('dg.deselected');
    if (!raw) return;
    try {
      JSON.parse(raw).forEach(function (id) { state.selected[id] = false; });
    } catch (e) { /* ignore malformed value */ }
  }

  function selectedPool() {
    return pool.filter(function (q) { return state.selected[q._part] !== false; });
  }

  function updatePool() {
    var n = selectedPool().length;
    var asked = state.count === 0 ? n : Math.min(state.count, n);
    $('poolInfo').textContent = n === 0
      ? 'Select at least one chapter.'
      : asked + ' of ' + n + ' available questions';
    $('startBtn').disabled = n === 0;
  }

  // ---------- views -----------------------------------------------------
  function show(id) {
    ['setup', 'quiz', 'results'].forEach(function (v) { $(v).hidden = v !== id; });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  // ---------- quiz ------------------------------------------------------
  function startQuiz() {
    var available = shuffle(selectedPool());
    var n = state.count === 0 ? available.length : Math.min(state.count, available.length);
    state.queue = available.slice(0, n);
    state.index = 0;
    state.firstTry = 0;
    state.missed = [];
    show('quiz');
    renderQuestion();
  }

  function renderQuestion() {
    var q = state.queue[state.index];
    state.answeredThis = false;

    $('progressBar').style.width =
      (state.index / state.queue.length * 100).toFixed(1) + '%';
    $('counter').textContent = 'Question ' + (state.index + 1) + ' of ' + state.queue.length;
    $('score').textContent = state.firstTry + ' right first time';
    $('topic').textContent = q._section;
    $('question').innerHTML = markup(q.q);

    $('feedback').hidden = true;
    $('reader').hidden = true;
    $('nextBtn').hidden = true;

    // shuffle the options, remembering which one is correct
    var order = shuffle(q.a.map(function (text, i) { return { text: text, ok: i === q.c }; }));
    var box = $('options');
    box.innerHTML = '';
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

  function answer(btn, ok, q) {
    if (state.answeredThis) return;
    state.answeredThis = true;

    var buttons = $('options').querySelectorAll('.opt');
    Array.prototype.forEach.call(buttons, function (b) { b.disabled = true; });

    var fb = $('feedback');
    var fbText = $('feedbackText');

    if (ok) {
      btn.classList.add('correct');
      if (!q._missedThisRound) state.firstTry++;
      fb.className = 'feedback good';
      fbText.innerHTML = q.e ? markup(q.e) : 'Correct.';
      fb.hidden = false;
      $('nextBtn').hidden = false;
      $('nextBtn').textContent =
        state.index + 1 >= state.queue.length ? 'See results' : 'Next question';
      $('nextBtn').focus({ preventScroll: true });
      return;
    }

    // Wrong. The correct option is deliberately NOT revealed — the book page
    // opens instead and the same question is asked again.
    btn.classList.add('wrong');
    if (!q._missedThisRound) {
      q._missedThisRound = true;
      if (state.missed.indexOf(q._section) === -1) state.missed.push(q._section);
    }

    fb.className = 'feedback bad';
    fbText.innerHTML = 'Not quite. Have a read, then come back and try again.';
    fb.hidden = false;

    $('readerTitle').textContent = q._section + ' — page ' + q._page;
    $('readerPdf').href = 'book.pdf#page=' + (q._page + (PAGEMAP.frontMatterOffset || 0));
    var img = $('readerImg');
    img.src = pageImage(q._page);
    img.alt = 'Book page ' + q._page + ': ' + q._section;
    $('reader').hidden = false;
    $('reader').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function retry() {
    var q = state.queue[state.index];
    renderQuestion();
    q._missedThisRound = true;   // renderQuestion resets the view, not the flag
    $('question').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function next() {
    state.index++;
    if (state.index >= state.queue.length) return finish();
    renderQuestion();
  }

  function finish() {
    var total = state.queue.length;
    $('progressBar').style.width = '100%';
    $('resultLine').textContent =
      state.firstTry + ' of ' + total + ' answered correctly first time.';

    var wrap = $('reviewWrap');
    var list = $('reviewList');
    list.innerHTML = '';
    if (state.missed.length) {
      state.missed.forEach(function (title) {
        var info = sectionIndex[title];
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = pageImage(info.page);
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
    renderChapters();

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
      saveSelection(); renderChapters(); updatePool();
    });
    $('selectNone').addEventListener('click', function () {
      PAGEMAP.parts.forEach(function (p) { state.selected[p.id] = false; });
      saveSelection(); renderChapters(); updatePool();
    });

    $('startBtn').addEventListener('click', startQuiz);
    $('retryBtn').addEventListener('click', retry);
    $('nextBtn').addEventListener('click', next);
    $('quitBtn').addEventListener('click', finish);
    $('againBtn').addEventListener('click', startQuiz);
    $('homeBtn').addEventListener('click', function () { show('setup'); });

    // keyboard: 1-4 pick an answer, Enter moves on
    document.addEventListener('keydown', function (ev) {
      if ($('quiz').hidden) return;
      if (ev.key >= '1' && ev.key <= '4') {
        var btns = $('options').querySelectorAll('.opt');
        var b = btns[parseInt(ev.key, 10) - 1];
        if (b && !b.disabled) b.click();
      } else if (ev.key === 'Enter') {
        if (!$('nextBtn').hidden) $('nextBtn').click();
        else if (!$('reader').hidden) $('retryBtn').click();
      }
    });

    updatePool();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
