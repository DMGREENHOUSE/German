/* Guards the rule that makes `hidden` actually hide.
 *
 *   node tools/test-hiding.js        (no jsdom needed)
 *
 * The app hides panels by setting `.hidden` in JavaScript, which relies on the
 * browser's `[hidden] { display: none }`. That is a UA-stylesheet attribute
 * rule, so it loses to ANY author rule that sets `display` on the same
 * element. `.options { display: grid }` and `.typed { display: flex }` both
 * did, and the four answer buttons and the typed-answer box ended up on screen
 * together with a stale answer still in the box.
 *
 * This is deliberately a static check on the stylesheet rather than a runtime
 * one. jsdom resolves `hidden` to `display: none` whatever the author rules
 * say, so it does not reproduce a real browser's cascade here — a jsdom test
 * of this would pass with or without the fix and catch nothing.
 *
 * The invariant: if any element the app hides carries a class that sets
 * `display`, the stylesheet must also carry a `[hidden]` override strong
 * enough to win.
 */
const fs = require('fs');
const path = require('path');

const docs = path.join(__dirname, '..', 'docs');
const css = fs.readFileSync(path.join(docs, 'css', 'style.css'), 'utf8');
const html = fs.readFileSync(path.join(docs, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(docs, 'js', 'app.js'), 'utf8');

let failures = 0;
const check = (name, cond, detail) => {
  if (cond) console.log('  ok   ' + name);
  else { failures++; console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); }
};

const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

// every element id the app hides or shows by toggling .hidden
const hidden = new Set();
let m;
const toggles = /\$\('([A-Za-z0-9_]+)'\)\.hidden\s*=/g;
while ((m = toggles.exec(app))) hidden.add(m[1]);
// ...plus the ones hidden in the markup to begin with
const markup = /id="([A-Za-z0-9_]+)"[^>]*\shidden\b/g;
while ((m = markup.exec(html))) hidden.add(m[1]);

console.log('\nfound the panels the app hides');
check('several ids toggle .hidden', hidden.size >= 5, [...hidden].join(', '));

// the class each of those ids carries
const classOf = {};
for (const id of hidden) {
  const tag = new RegExp('<[^>]*id="' + id + '"[^>]*>').exec(html);
  const cls = tag && /class="([^"]+)"/.exec(tag[0]);
  if (cls) classOf[id] = cls[1].split(/\s+/);
}

// Which of those classes set display ON THEMSELVES. Only the last compound of
// a selector counts: `.reader img { display: block }` styles the image, not
// the reader, so it puts nothing at risk. Taking every class in the selector
// over-reports, which is how .reader was wrongly flagged first time round.
const settersOfDisplay = new Set();
for (const rule of strip(css).split('}')) {
  const [sel, body] = rule.split('{');
  if (!sel || !body || !/(^|[;\s])display\s*:/.test(body)) continue;
  for (const part of sel.split(',')) {
    const last = part.trim().split(/[\s>+~]+/).pop() || '';
    for (const cls of last.matchAll(/\.([A-Za-z0-9_-]+)/g)) settersOfDisplay.add(cls[1]);
  }
}

const atRisk = [];
for (const id of hidden) {
  for (const cls of classOf[id] || []) {
    if (settersOfDisplay.has(cls)) atRisk.push(id + ' (.' + cls + ')');
  }
}

console.log('\npanels whose own class sets display, so [hidden] alone would lose');
check('the at-risk list is known', true, atRisk.length ? atRisk.join(', ') : 'none');

// the override has to exist, set display:none, and be !important to outrank
// a class selector
const override = /\[hidden\]\s*{[^}]*display\s*:\s*none\s*!important/.test(strip(css));

console.log('\nthe stylesheet carries an override strong enough to win');
if (atRisk.length) {
  check('[hidden] { display: none !important } is present', override,
    'without it, ' + atRisk.join(' and ') + ' stay on screen when hidden');
} else {
  check('no panel needs the override, but keep it anyway', override,
    'nothing is at risk today, but the next display rule would reintroduce the bug');
}

console.log('\n' + (failures === 0 ? 'all checks passed' : failures + ' CHECK(S) FAILED'));
process.exit(failures === 0 ? 0 : 1);
