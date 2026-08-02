/* Headless smoke test for the quiz app.
 *
 *   npm install jsdom          (once)
 *   node tools/test-app.js
 *
 * Loads docs/index.html with the real scripts and drives a full quiz:
 * answers one question wrongly to check the book page opens, retries it,
 * answers the rest correctly, and inspects the results screen.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const docs = path.join(__dirname, '..', 'docs');
let failures = 0;

function check(name, cond, detail) {
  if (cond) {
    console.log('  ok   ' + name);
  } else {
    failures++;
    console.log('  FAIL ' + name + (detail ? ' — ' + detail : ''));
  }
}

const vc = new VirtualConsole();
vc.on('jsdomError', (e) => { failures++; console.log('  FAIL page error — ' + e.message); });
vc.on('error', (m) => { failures++; console.log('  FAIL console.error — ' + m); });

const dom = new JSDOM(fs.readFileSync(path.join(docs, 'index.html'), 'utf8'), {
  runScripts: 'dangerously',
  resources: undefined,
  url: 'https://example.test/',
  virtualConsole: vc
});
const { window } = dom;
const doc = window.document;

// jsdom implements no layout, so scrolling is a no-op here
window.scrollTo = () => {};
window.Element.prototype.scrollIntoView = function () {};

// jsdom does not fetch <script src>, so inject the three files by hand
for (const f of ['js/pagemap.js', 'js/questions.js', 'js/questions-vocab.js', 'js/app.js']) {
  const el = doc.createElement('script');
  el.textContent = fs.readFileSync(path.join(docs, f), 'utf8');
  doc.body.appendChild(el);
}
doc.dispatchEvent(new window.Event('DOMContentLoaded'));

const $ = (id) => doc.getElementById(id);
const visible = (id) => !$(id).hidden;

console.log('\nsetup screen');
check('setup visible', visible('setup'));
const boxes = doc.querySelectorAll('#chapterList input');
check('one checkbox per part', boxes.length === window.PAGEMAP.parts.length,
  boxes.length + ' vs ' + window.PAGEMAP.parts.length);
check('all chapters selected by default',
  Array.from(boxes).every((b) => b.checked));
check('pool info populated', /matching questions/.test($('poolInfo').textContent),
  $('poolInfo').textContent);
check('start enabled', !$('startBtn').disabled);

console.log('\nevery question maps to a page image that exists');
const missing = new Set();
window.QUESTIONS.forEach((q) => {
  const sec = window.PAGEMAP.parts
    .flatMap((p) => p.sections).find((s) => s.title === q.s);
  if (!sec) { missing.add('section:' + q.s); return; }
  const img = path.join(docs, 'pages', 'page-' + String(sec.page).padStart(2, '0') + '.png');
  if (!fs.existsSync(img)) missing.add('image:' + img);
});
check('no missing sections or images', missing.size === 0, [...missing].join(', '));

function optionButtons() { return Array.from(doc.querySelectorAll('#options .opt')); }
function correctIndexOnScreen() {
  // the app shuffles; find the option whose text matches the question's answer
  const qObj = currentQuestion();
  const want = qObj.a[qObj.c];
  return optionButtons().findIndex((b) => b.textContent.slice(1).trim() === strip(want));
}
function strip(s) { return s.replace(/\[\[(.+?)\]\]/g, '$1').replace(/\*\*(.+?)\*\*/g, '$1'); }
let askedTitles = [];
function currentQuestion() {
  const title = $('topic').textContent;
  const qtext = strip($('question').textContent);
  return window.QUESTIONS.find((q) => q.s === title && strip(q.q) === qtext);
}

console.log('\nquestion-type axis');
const typeBoxes = doc.querySelectorAll('#typeList input');
check('three type checkboxes', typeBoxes.length === 3);
check('all types on by default', Array.from(typeBoxes).every((b) => b.checked));

// counts shown against each type must match the bank
const bankByType = {};
window.QUESTIONS.forEach((q) => { bankByType[q.t] = (bankByType[q.t] || 0) + 1; });
const shown = {};
doc.querySelectorAll('#typeList li').forEach((li) => {
  const id = li.querySelector('input').value;
  shown[id] = parseInt(li.querySelector('.ty-count').textContent, 10);
});
check('type counts match the bank',
  ['recall', 'rule', 'gap'].every((t) => shown[t] === bankByType[t]),
  JSON.stringify(shown) + ' vs ' + JSON.stringify(bankByType));

// select gap-fill only and confirm the pool narrows.
// renderTypes() rebuilds the list, so the checkbox must be re-queried each time.
function typeBox(id) {
  return Array.from(doc.querySelectorAll('#typeList input'))
              .find((b) => b.value === id);
}
typeBox('recall').click();
typeBox('rule').click();
const gapOnly = parseInt($('poolInfo').textContent.match(/of (\d+)/)[1], 10);
check('gap-only pool equals the gap count', gapOnly === bankByType.gap,
  gapOnly + ' vs ' + bankByType.gap);
// with only gap-fill selected, each chapter's count must drop to its gap total
// and no chapter should be left empty — every part carries all three types
const gapPerPart = {};
window.QUESTIONS.filter((q) => q.t === 'gap').forEach((q) => {
  const part = window.PAGEMAP.parts.find((p) =>
    p.sections.some((sec) => sec.title === q.s));
  gapPerPart[part.id] = (gapPerPart[part.id] || 0) + 1;
});
const metaCounts = Array.from(doc.querySelectorAll('#chapterList .ch-meta'))
  .map((m) => parseInt(m.textContent, 10) || 0);
check('chapter counts follow the type filter',
  metaCounts.every((n, i) => n === (gapPerPart[window.PAGEMAP.parts[i].id] || 0)),
  metaCounts.join(','));
check('every chapter offers gap-fill questions', metaCounts.every((n) => n > 0));

// the last remaining type cannot be switched off
typeBox('gap').click();
check('cannot deselect every type', typeBox('gap').checked);

// a gap-only quiz must contain only gap questions
doc.querySelector('.segmented button[data-count="10"]').click();
$('startBtn').click();
check('badge shows the type', $('typeBadge').textContent === 'Gap-fill',
  $('typeBadge').textContent);
let allGap = true;
for (let i = 0; i < 10; i++) {
  if (currentQuestion().t !== 'gap') allGap = false;
  optionButtons()[correctIndexOnScreen()].click();
  if (i < 9) $('nextBtn').click();
}
check('every question was a gap-fill', allGap);
$('nextBtn').click();
check('breakdown lists only the gap row', $('typeBreakdown').children.length === 1,
  $('typeBreakdown').textContent);
check('breakdown score is 10/10', /10 \/ 10/.test($('typeBreakdown').textContent),
  $('typeBreakdown').textContent);

// back to all types for the main flow test
$('homeBtn').click();
typeBox('recall').click();
typeBox('rule').click();
check('back to all three types',
  Array.from(doc.querySelectorAll('#typeList input')).every((b) => b.checked));

console.log('\nquiz flow');
// pick 10 questions
doc.querySelector('.segmented button[data-count="10"]').click();
$('startBtn').click();
check('quiz visible', visible('quiz'));
check('setup hidden', !visible('setup'));
check('four options rendered', doc.querySelectorAll('#options .opt').length === 4);
check('topic shown', $('topic').textContent.length > 0);

// answer question 1 wrongly

const q1 = currentQuestion();
check('current question identified', !!q1);
const wrongIdx = optionButtons().findIndex((_, i) => i !== correctIndexOnScreen());
optionButtons()[wrongIdx].click();

check('feedback shown after wrong answer', visible('feedback'));
check('reader opens on a wrong answer', visible('reader'));
check('reader image points at the right page',
  $('readerImg').getAttribute('src') ===
    'pages/page-' + String(pageOf(q1.s)).padStart(2, '0') + '.png',
  $('readerImg').getAttribute('src'));
check('pdf link includes the front-matter offset',
  $('readerPdf').getAttribute('href') ===
    'book.pdf#page=' + (pageOf(q1.s) + window.PAGEMAP.frontMatterOffset),
  $('readerPdf').getAttribute('href'));
check('next is not offered until it is right', !visible('nextBtn'));
check('correct answer is not revealed',
  optionButtons().filter((b) => b.className.includes('correct')).length === 0);

function pageOf(title) {
  return window.PAGEMAP.parts.flatMap((p) => p.sections)
    .find((s) => s.title === title).page;
}

// retry the same question, this time correctly
$('retryBtn').click();
check('same question re-asked', $('topic').textContent === q1.s);
check('reader closed on retry', !visible('reader'));
optionButtons()[correctIndexOnScreen()].click();
check('marked correct', optionButtons().some((b) => b.className.includes('correct')));
check('next offered', visible('nextBtn'));
check('a retried question does not score', $('score').textContent.startsWith('0 '),
  $('score').textContent);

// answer the remaining nine correctly
for (let i = 1; i < 10; i++) {
  $('nextBtn').click();
  askedTitles.push($('topic').textContent);
  optionButtons()[correctIndexOnScreen()].click();
}
check('progress reaches the end', $('counter').textContent === 'Question 10 of 10',
  $('counter').textContent);
$('nextBtn').click();

console.log('\nresults screen');
check('results visible', visible('results'));
check('score line correct', /9 of 10 answered correctly first time/.test($('resultLine').textContent),
  $('resultLine').textContent);
check('missed topic listed', $('reviewList').children.length === 1);
check('review links to the page image',
  $('reviewList').querySelector('a').getAttribute('href') ===
    'pages/page-' + String(pageOf(q1.s)).padStart(2, '0') + '.png');

// a second run should score fresh
$('againBtn').click();
check('second run resets the score', $('score').textContent === '0 right first time');

console.log('\n' + (failures === 0 ? 'all checks passed' : failures + ' CHECK(S) FAILED'));
process.exit(failures === 0 ? 0 : 1);
