/* Unit tests for the typed-answer logic in docs/js/typed.js.
 *
 *   node tools/test-typed.js
 *
 * No DOM needed — these are pure functions, so they are tested on their own
 * rather than through the quiz.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ctx = { window: {} };
ctx.window.window = ctx.window;
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'js', 'typed.js'), 'utf8'),
  ctx);
const T = ctx.window.TYPED;

let failures = 0;
function check(name, cond, detail) {
  if (cond) { console.log('  ok   ' + name); }
  else { failures++; console.log('  FAIL ' + name + (detail ? ' — ' + detail : '')); }
}
const yes = (name, i, w) => check(name, T.matches(i, w), `"${i}" should match "${w}"`);
const no = (name, i, w) => check(name, !T.matches(i, w), `"${i}" should NOT match "${w}"`);

console.log('\nforgiving where it should be');
yes('exact', 'der Hund', 'der Hund');
yes('case is ignored', 'DER HUND', 'der Hund');
yes('surrounding space is ignored', '  der Hund  ', 'der Hund');
yes('trailing punctuation is ignored', 'der Hund.', 'der Hund');
yes('double space inside collapses', 'der  Hund', 'der Hund');
yes('ue for ü', 'die Tuer', 'die Tür');
yes('ae for ä', 'der Kaese', 'der Käse');
yes('oe for ö', 'schoen', 'schön');
yes('ss for ß', 'die Strasse', 'die Straße');
yes('the umlaut itself still works', 'die Tür', 'die Tür');

console.log('\nEnglish glosses accept any one synonym');
yes('first synonym', 'neck', 'neck, throat');
yes('second synonym', 'throat', 'neck, throat');
yes('the whole gloss', 'neck, throat', 'neck, throat');
yes('slash-separated', 'mean', 'think/mean');
yes('infinitive without to', 'tell', 'to tell');
yes('infinitive with to', 'to tell', 'to tell');
yes('leading article dropped', 'bill', 'the bill');

console.log('\nstrict where it matters');
no('the article is part of a German noun', 'Hund', 'der Hund');
no('a German answer is never split on the space', 'die', 'die Frau');
no('wrong article', 'das Hund', 'der Hund');
no('a bare umlaut-less vowel is not the umlaut', 'die Tur', 'die Tür');
no('wrong word', 'die Katze', 'der Hund');
no('empty input', '', 'der Hund');
no('whitespace only', '   ', 'der Hund');

console.log('\nwhich questions can be typed');
const typable = (q) => T.isTypable(q);
check('gender drill', typable(
  { q: 'Which article does [[Hund]] take?', a: ['der', 'die', 'das', 'den'], c: 0 }));
check('vocabulary recall', typable(
  { q: 'How do you say **dog**?', a: ['der Hund', 'die Katze', 'das Pferd', 'der Vogel'], c: 0 }));
check('gap-fill', typable(
  { q: '[[Wir fahren mit ___ Zug.]]', a: ['dem', 'den', 'der', 'des'], c: 0 }));

check('odd-one-out needs its options', !typable(
  { q: 'Which of these nouns is **neuter** ([[das]])?',
    a: ['Fenster', 'Tuer', 'Stuhl', 'Wand'], c: 0 }));
check('principal-part lines are not a typed form', !typable(
  { q: 'Which line gives the three principal parts of [[schreiben]]?',
    a: ['schreiben – schrieb – hat geschrieben', 'b', 'c', 'd'], c: 0 }));
check('a clause-length answer is not typable', !typable(
  { q: 'How do you recognise a weak noun?',
    a: ['a masculine noun in -e naming a person or animal, or a person-word in -ent',
        'b', 'c', 'd'], c: 0 }));
check('a meta answer is not typable', !typable(
  { q: 'What belongs in the gap?', a: ['nothing', 'a comma', 'a dash', 'a colon'], c: 0 }));

console.log('\nmarkup is stripped before comparing');
check('plain strips both kinds', T.plain('[[der Hund]] and **dog**') === 'der Hund and dog',
  T.plain('[[der Hund]] and **dog**'));
yes('an answer written with markup still matches', 'der Hund', T.plain('[[der Hund]]'));

console.log('\n' + (failures === 0 ? 'all checks passed' : failures + ' CHECK(S) FAILED'));
process.exit(failures === 0 ? 0 : 1);
