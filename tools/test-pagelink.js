/* Tests the "Diese Seite testen" deep link from the book.
 *
 *   npm install jsdom          (once)
 *   node tools/test-pagelink.js
 *
 * Each topic page of the PDF carries a link to the site with ?page=N, where N
 * is the printed page number. Arriving with that parameter should start a quiz
 * on that page's section alone. Loading with no parameter must behave exactly
 * as before, and an unknown page must fail softly rather than trapping the
 * reader on an empty quiz.
 *
 * A fresh JSDOM instance is built per scenario, since the parameter is read
 * once at load time.
 */
const fs=require('fs'),path=require('path');const {JSDOM,VirtualConsole}=require('jsdom');
const docs=path.join(__dirname,'..','docs');
function load(url){
  const vc=new VirtualConsole();let errs=[];
  vc.on('jsdomError',e=>errs.push(e.message));vc.on('error',m=>errs.push(m));
  const dom=new JSDOM(fs.readFileSync(path.join(docs,'index.html'),'utf8'),
    {runScripts:'dangerously',url,virtualConsole:vc});
  const {window}=dom,doc=window.document;
  window.scrollTo=()=>{};window.Element.prototype.scrollIntoView=function(){};
  for(const f of ['js/typed.js','js/pagemap.js','js/questions.js','js/questions-vocab.js', 'js/questions-story.js','js/app.js']){
    const el=doc.createElement('script');el.textContent=fs.readFileSync(path.join(docs,f),'utf8');doc.body.appendChild(el);}
  doc.dispatchEvent(new window.Event('DOMContentLoaded'));
  return {window,doc,errs,$:id=>doc.getElementById(id)};
}
let bad=0;
const ok=(n,c,d)=>{console.log((c?'  ok   ':'  FAIL ')+n+(c?'':' — '+d));if(!c)bad++;};

console.log('\nno parameter — unchanged behaviour');
let a=load('https://x.test/');
ok('setup shown',!a.$('setup').hidden);
ok('quiz not auto-started',a.$('quiz').hidden);
ok('page note hidden',a.$('pageNote').hidden);
ok('no console errors',a.errs.length===0,a.errs.join('|'));

console.log('\n?page=12 — a real topic page');
let b=load('https://x.test/?page=12');
const sec12=b.window.PAGEMAP.parts.flatMap(p=>p.sections).find(s=>s.page===12);
const n12=b.window.QUESTIONS.filter(q=>q.s===sec12.title).length;
ok('quiz started automatically',!b.$('quiz').hidden);
ok('setup hidden',b.$('setup').hidden);
ok('note names the section',b.$('pageNoteText').textContent.includes(sec12.title),b.$('pageNoteText').textContent);
ok('counter covers the whole page',b.$('counter').textContent==='Question 1 of '+n12,
   b.$('counter').textContent+' vs expected '+n12);
ok('topic is that section',b.$('topic').textContent===sec12.title,b.$('topic').textContent);
ok('no console errors',b.errs.length===0,b.errs.join('|'));

console.log('\nevery question asked really is from page 12');
let allRight=true;
for(let i=0;i<n12;i++){
  if(b.$('topic').textContent!==sec12.title) allRight=false;
  const q=b.window.QUESTIONS.find(x=>x.s===b.$('topic').textContent&&
    x.q.replace(/\[\[(.+?)\]\]/g,'$1').replace(/\*\*(.+?)\*\*/g,'$1')===b.$('question').textContent);
  const opts=Array.from(b.doc.querySelectorAll('#options .opt'));
  if(opts.length){
    const want=q.a[q.c].replace(/\[\[(.+?)\]\]/g,'$1').replace(/\*\*(.+?)\*\*/g,'$1');
    opts[opts.findIndex(x=>x.textContent.slice(1).trim()===want)].click();
  }
  b.$('nextBtn').click();
}
ok('stayed on one topic throughout',allRight);
ok('reached the results',!b.$('results').hidden);

console.log('\nclearing the filter returns the full bank');
b.$('homeBtn').click();
ok('back on setup',!b.$('setup').hidden);
ok('note dismissed',b.$('pageNote').hidden);
const whole=(b.$('poolInfo').textContent.match(/of (\d+) matching/)||[])[1];
ok('pool is the whole bank again',Number(whole)===b.window.QUESTIONS.length,
   b.$('poolInfo').textContent+' vs bank of '+b.window.QUESTIONS.length);

console.log('\n?story=1 — the reader links with its own parameter');
let s=load('https://x.test/?story=1');
const sec1=s.window.PAGEMAP.parts.filter(p=>p.book==='story').flatMap(p=>p.sections).find(x=>x.page===1);
ok('story quiz started',!s.$('quiz').hidden);
ok('landed on the story page, not grammar page 1',s.$('topic').textContent===sec1.title,
   s.$('topic').textContent+' vs '+sec1.title);
ok('note names the story book',/Geschichten/.test(s.$('pageNoteText').textContent),
   s.$('pageNoteText').textContent);
// answer one wrongly and check the reader opens the STORY page image
{
  const q=s.window.QUESTIONS.find(x=>x.s===sec1.title&&
    x.q.replace(/\[\[(.+?)\]\]/g,'$1').replace(/\*\*(.+?)\*\*/g,'$1')===s.$('question').textContent);
  const opts=Array.from(s.doc.querySelectorAll('#options .opt'));
  const want=q.a[q.c].replace(/\[\[(.+?)\]\]/g,'$1').replace(/\*\*(.+?)\*\*/g,'$1');
  const wrong=opts.findIndex(x=>x.textContent.slice(1).trim()!==want);
  if(opts.length&&wrong>=0){
    opts[wrong].click();
    ok('reader shows a story page image',
       /^story-pages\/page-01\.png$/.test(s.$('readerImg').getAttribute('src')),
       s.$('readerImg').getAttribute('src'));
    ok('pdf link points at the story book',
       s.$('readerPdf').getAttribute('href')==='story.pdf#page=7',
       s.$('readerPdf').getAttribute('href'));
    ok('reader names the book',/Geschichten/.test(s.$('readerTitle').textContent),
       s.$('readerTitle').textContent);
  }
}
ok('no console errors',s.errs.length===0,s.errs.join('|'));

console.log('\n?page=999 — a page that does not exist');
let c=load('https://x.test/?page=999');
ok('does not auto-start',c.$('quiz').hidden);
ok('setup still usable',!c.$('setup').hidden);
ok('explains itself',/no questions yet/.test(c.$('pageNoteText').textContent),c.$('pageNoteText').textContent);
ok('no console errors',c.errs.length===0,c.errs.join('|'));

console.log('\n'+(bad?bad+' FAILED':'all checks passed'));
process.exit(bad?1:0);
