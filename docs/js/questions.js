/* Question bank for the Deutsche Grammatik quiz.
 *
 *   s  section title — must match a section in the book exactly, because
 *      that is how a wrong answer finds the right page to show
 *   q  the question. [[double brackets]] render italic, **stars** bold.
 *   a  four options
 *   c  index of the correct option (options are shuffled at run time)
 *   e  one-line explanation shown after a correct answer
 *
 * Run  python3 tools/check-questions.py  to confirm every s matches the book.
 */
window.QUESTIONS = [

/* ---------- I. Pronouns ---------- */
{s:"Personal pronouns", q:"Which pronoun completes it? [[Kannst du ___ helfen?]] (help me)", a:["mir","mich","meiner","ich"], c:0, e:"[[helfen]] takes the dative, so 1st person singular is [[mir]]."},
{s:"Personal pronouns", q:"What is the accusative of [[er]]?", a:["ihn","ihm","seiner","er"], c:0, e:"[[er]] → [[ihn]] in the accusative, [[ihm]] in the dative."},
{s:"Personal pronouns", q:"[[Ich gebe ___ das Buch]] — I give it to them.", a:["ihnen","sie","ihr","ihren"], c:0, e:"Third person plural dative is [[ihnen]]. Capitalised [[Ihnen]] would be formal you."},
{s:"Personal pronouns", q:"Formal [[Sie]] takes which verb endings?", a:["always plural","always singular","singular for one person","the same as [[du]]"], c:0, e:"[[Sie sind]] whether you address one person or many."},

{s:"Reflexive pronouns", q:"[[Ich wasche ___ die Hände.]]", a:["mir","mich","meiner","sich"], c:0, e:"A direct object ([[die Hände]]) is already present, so the reflexive goes dative."},
{s:"Reflexive pronouns", q:"[[Wir freuen ___ auf den Sommer.]]", a:["uns","sich","unser","euch"], c:0, e:"1st person plural is [[uns]] in both accusative and dative."},
{s:"Reflexive pronouns", q:"Which persons have different accusative and dative reflexives?", a:["1st and 2nd singular only","all six persons","only the third person","only the plural"], c:0, e:"[[mich/mir]] and [[dich/dir]]. Everything else uses one form."},

{s:"Relative pronouns", q:"[[Die Leute, mit ___ ich rede, sind nett.]]", a:["denen","die","der","deren"], c:0, e:"[[mit]] takes the dative, and the dative plural relative pronoun is [[denen]]."},
{s:"Relative pronouns", q:"[[Die Frau, ___ Auto neu ist, wohnt hier.]]", a:["deren","dessen","der","die"], c:0, e:"Possession, feminine → genitive [[deren]]."},
{s:"Relative pronouns", q:"In a relative clause the verb goes…", a:["at the end","second","first","directly after the pronoun"], c:0, e:"Relative clauses are subordinate, so the verb is final and commas fence the clause off."},

{s:"Indefinite pronouns", q:"What is the accusative of [[man]]?", a:["einen","man","manen","einem"], c:0, e:"[[man]] exists only in the nominative and borrows [[einen]] / [[einem]] elsewhere."},
{s:"Indefinite pronouns", q:"[[Ich habe etwas ___ gehört.]] (something new)", a:["Neues","neues","Neue","neuen"], c:0, e:"After [[etwas]] the adjective is capitalised, neuter and strong: [[Neues]]."},
{s:"Indefinite pronouns", q:"Which is the usual German alternative to an English passive?", a:["[[man]] + active verb","[[es gibt]]","[[sich]] + verb","[[jemand]] + verb"], c:0, e:"[[Man spricht hier Deutsch]] for \"German is spoken here\"."},

/* ---------- II. Articles & Case ---------- */
{s:"The four cases at a glance", q:"Which question word asks for the dative?", a:["wem?","wen?","wer?","wessen?"], c:0, e:"[[wer – wen – wem – wessen]] run nominative, accusative, dative, genitive."},
{s:"The four cases at a glance", q:"[[Den Mann beißt der Hund.]] Who does the biting?", a:["the dog","the man","it is ambiguous","neither"], c:0, e:"[[der Hund]] is nominative, so it is the subject regardless of word order."},
{s:"The four cases at a glance", q:"After [[sein]], [[werden]] and [[bleiben]] the following noun is…", a:["nominative","accusative","dative","genitive"], c:0, e:"These verbs link two nominatives: [[Er ist ein guter Lehrer.]]"},

{s:"Nominative", q:"Which is the feminine nominative of [[kein]]?", a:["keine","kein","keinen","keiner"], c:0, e:"Feminine takes [[-e]]: [[keine Frau]]."},
{s:"Nominative", q:"[[___ Schwester heißt Anna.]] (my sister)", a:["Meine","Mein","Meinen","Meiner"], c:0, e:"[[Schwester]] is feminine nominative, so [[meine]]."},
{s:"Nominative", q:"Which possessive is the odd one out in spelling once an ending is added?", a:["euer → eure","unser → unsere","ihr → ihre","dein → deine"], c:0, e:"[[euer]] drops its second [[e]]: [[eure]], never [[euere]]."},

{s:"Accusative", q:"[[Ich sehe ___ Hund.]] (the dog)", a:["den","der","dem","des"], c:0, e:"Masculine accusative is [[den]] — the only column that changes from the nominative."},
{s:"Accusative", q:"Which column differs between nominative and accusative?", a:["masculine only","feminine only","neuter and plural","all four"], c:0, e:"Feminine, neuter and plural are identical in the two cases."},
{s:"Accusative", q:"[[Er kommt ___ Tag.]] (every day)", a:["jeden","jedem","jeder","jedes"], c:0, e:"Definite time without a preposition takes the accusative."},

{s:"Dative", q:"[[Wir fahren mit ___ Zug.]]", a:["dem","den","der","des"], c:0, e:"[[mit]] takes the dative; masculine dative is [[dem]]."},
{s:"Dative", q:"What happens to a plural noun in the dative?", a:["it adds -n unless it already ends in -n or -s","nothing","it adds -s","it adds -e"], c:0, e:"[[die Kinder]] → [[mit den Kindern]], but [[den Autos]] is unchanged."},
{s:"Dative", q:"The dative endings run…", a:["-m, -r, -m, -n","-n, -e, -s, -e","-s, -r, -s, -r","-r, -e, -s, -e"], c:0, e:"Masculine and neuter are identical throughout the dative."},

{s:"Genitive", q:"[[das Auto ___ Mannes]]", a:["des","der","dem","den"], c:0, e:"Masculine genitive [[des]], and the noun itself adds [[-es]]."},
{s:"Genitive", q:"Which ending does a one-syllable masculine or neuter noun take in the genitive?", a:["-es","-s","-en","none"], c:0, e:"[[des Mannes]], [[des Kindes]]; longer nouns take plain [[-s]]."},
{s:"Genitive", q:"What replaces the genitive in everyday speech?", a:["von + Dativ","für + Akkusativ","zu + Dativ","an + Akkusativ"], c:0, e:"[[das Auto vom Mann]] rather than [[des Mannes]]."},

{s:"der-words and ein-words", q:"Which is NOT a der-word?", a:["kein","dieser","jeder","welcher"], c:0, e:"[[kein]] follows [[ein]], so it is an ein-word."},
{s:"der-words and ein-words", q:"In how many cells do the two families differ?", a:["three","one","eight","sixteen"], c:0, e:"Masculine nominative, and neuter nominative and accusative."},
{s:"der-words and ein-words", q:"[[___ Mann ist mein Bruder.]] (this man)", a:["Dieser","Diese","Diesen","Dies"], c:0, e:"A der-word shows [[-er]] in the masculine nominative, where [[ein]] shows nothing."},

/* ---------- III. Adjectives ---------- */
{s:"Which ending pattern?", q:"[[Der Wagen ist rot.]] Why has [[rot]] no ending?", a:["it is predicative, not in front of a noun","[[rot]] never takes endings","the noun is masculine","[[sein]] blocks endings"], c:0, e:"Only attributive adjectives — those in front of a noun — take endings."},
{s:"Which ending pattern?", q:"Which pattern follows [[jeder]]?", a:["weak","mixed","strong","none"], c:0, e:"[[jeder]] is a der-word, so the adjective is weak."},
{s:"Which ending pattern?", q:"[[ein ___ Wagen]] (a red car)", a:["roter","rote","roten","rotes"], c:0, e:"Mixed pattern: masculine nominative takes [[-er]] because [[ein]] shows nothing."},

{s:"Weak endings — after a der-word", q:"[[dem ___ Mann]] (the good man)", a:["guten","gute","guter","gutem"], c:0, e:"Every weak dative is [[-en]]."},
{s:"Weak endings — after a der-word", q:"How many different endings does the weak pattern use?", a:["two","three","four","five"], c:0, e:"Only [[-e]] and [[-en]]."},
{s:"Weak endings — after a der-word", q:"[[die ___ Leute]] (the good people)", a:["guten","gute","guter","gutes"], c:0, e:"Weak plural nominative is [[-en]]."},

{s:"Mixed endings — after an ein-word", q:"[[ein ___ Kind]] (a good child)", a:["gutes","guter","gute","guten"], c:0, e:"Neuter nominative takes [[-es]], one of the three cells where mixed differs from weak."},
{s:"Mixed endings — after an ein-word", q:"[[einen ___ Mann]]", a:["guten","guter","gutes","gutem"], c:0, e:"Masculine accusative is [[-en]], the same as the weak pattern."},
{s:"Mixed endings — after an ein-word", q:"The mixed pattern differs from the weak one in how many cells?", a:["three","one","six","none"], c:0, e:"Masculine nominative, neuter nominative and neuter accusative."},

{s:"Strong endings — no determiner", q:"[[___ Wein]] (good wine, nominative)", a:["Guter","Gutes","Gute","Guten"], c:0, e:"With no determiner the adjective borrows the der-word ending [[-er]]."},
{s:"Strong endings — no determiner", q:"[[mit ___ Milch]] (with good milk)", a:["guter","gutem","gute","guten"], c:0, e:"Feminine dative strong is [[-er]], mirroring [[der]]."},
{s:"Strong endings — no determiner", q:"Which strong ending does NOT mirror the definite article?", a:["masculine genitive -en","masculine dative -em","feminine dative -er","neuter nominative -es"], c:0, e:"Masculine and neuter genitive take [[-en]], because the noun already carries the [[-s]]."},

{s:"Adjectival nouns and participles", q:"[[Er ist ein ___.]] (a German man)", a:["Deutscher","Deutsche","Deutschen","Deutsch"], c:0, e:"Adjectival nouns keep adjective endings; after [[ein]] the mixed masculine ending is [[-er]]."},
{s:"Adjectival nouns and participles", q:"[[das ___ Kind]] (the laughing child)", a:["lachende","gelachte","lachend","lacht"], c:0, e:"Present participle is infinitive + [[d]], then normal adjective endings."},
{s:"Adjectival nouns and participles", q:"Which ordinal is irregular?", a:["dritte","zweite","vierte","fünfte"], c:0, e:"[[erste]], [[dritte]], [[siebte]] and [[achte]] are the irregular ones."},

/* ---------- IV. Prepositions ---------- */
{s:"Prepositions by case", q:"Which preposition always takes the accusative?", a:["durch","mit","seit","bei"], c:0, e:"DOGFUB: durch, ohne, gegen, für, um, bis."},
{s:"Prepositions by case", q:"[[bei + dem]] contracts to…", a:["beim","beidem","bem","bei'm"], c:0, e:"The contractions are standard in speech unless you are pointing at something specific."},
{s:"Prepositions by case", q:"Which preposition takes the genitive?", a:["während","gegenüber","ohne","seit"], c:0, e:"[[während des Films]]."},

{s:"Accusative prepositions", q:"[[Ich habe es ___ meinen Bruder gekauft.]]", a:["für","mit","von","bei"], c:0, e:"[[für]] is accusative."},
{s:"Accusative prepositions", q:"Which accusative preposition follows its noun?", a:["entlang","durch","gegen","um"], c:0, e:"[[die Straße entlang]]."},
{s:"Accusative prepositions", q:"[[Er kam ___ acht.]] (around eight)", a:["gegen","um","bis","für"], c:0, e:"[[um]] is exactly eight; [[gegen]] is approximately."},

{s:"Dative prepositions", q:"Which is correct for going to Berlin?", a:["nach Berlin","zu Berlin","in Berlin","an Berlin"], c:0, e:"[[nach]] for places that take no article; [[zu]] for people and businesses."},
{s:"Dative prepositions", q:"[[Ich wohne ___ drei Jahren hier.]]", a:["seit","für","ab","von"], c:0, e:"[[seit]] + present tense where English uses the perfect."},
{s:"Dative prepositions", q:"Which means \"at home\"?", a:["zu Hause","nach Hause","in Hause","bei Hause"], c:0, e:"[[nach Hause]] is homewards; [[zu Hause]] is at home."},

{s:"Two-way prepositions", q:"[[Ich hänge das Bild an ___ Wand.]] (I hang it on the wall)", a:["die","der","dem","den"], c:0, e:"Movement into a new place → accusative [[die Wand]]."},
{s:"Two-way prepositions", q:"[[Das Bild hängt an ___ Wand.]]", a:["der","die","dem","den"], c:0, e:"Position, not movement → dative [[der Wand]]."},
{s:"Two-way prepositions", q:"Which verb signals the accusative in a two-way pair?", a:["stellen","stehen","liegen","sitzen"], c:0, e:"[[stellen, legen, setzen]] put something somewhere; their partners describe where it is."},

{s:"Genitive prepositions", q:"[[___ des schlechten Wetters]] (because of)", a:["wegen","gegen","durch","seit"], c:0, e:"[[wegen]] takes the genitive in standard written German."},
{s:"Genitive prepositions", q:"[[___ einer Woche]] (within a week)", a:["innerhalb","außerhalb","während","trotz"], c:0, e:"[[innerhalb]] is within, [[außerhalb]] outside."},
{s:"Genitive prepositions", q:"As a one-word reply, [[Meinetwegen!]] means…", a:["fine by me","because of me","instead of me","without me"], c:0, e:"[[wegen]] fuses with pronouns into fixed forms; as a reply it signals indifferent agreement."},

/* ---------- V. Verbs ---------- */
{s:"Present tense — regular endings", q:"[[du arbeit___]]", a:["est","st","et","t"], c:0, e:"Stems ending in [[-d]] or [[-t]] insert an [[e]] before the ending."},
{s:"Present tense — regular endings", q:"[[du heiß___]]", a:["t","st","est","et"], c:0, e:"Stems in [[-s, -ß, -z, -x]] take only [[-t]] in the du form."},
{s:"Present tense — regular endings", q:"[[ich spiele]] can mean…", a:["all three of I play / am playing / do play","only I play","only I am playing","only I do play"], c:0, e:"German has a single present tense; add [[gerade]] to stress the moment."},

{s:"Stem-changing verbs", q:"[[er ___]] from [[nehmen]]", a:["nimmt","nehmt","nehmet","nahm"], c:0, e:"[[nehmen]] is irregular: [[du nimmst, er nimmt]]."},
{s:"Stem-changing verbs", q:"Which forms show the stem change?", a:["du and er/sie/es","all six","only er/sie/es","the plural"], c:0, e:"The plural is always regular: [[wir fahren, ihr fahrt]]."},
{s:"Stem-changing verbs", q:"[[er ___]] from [[sehen]]", a:["sieht","seht","siehen","sah"], c:0, e:"e → ie in the du and er forms."},

{s:"haben, sein, werden", q:"[[ihr ___]] from [[sein]]", a:["seid","sind","seit","bist"], c:0, e:"[[seid]] with a d — [[seit]] with a t is the preposition."},
{s:"haben, sein, werden", q:"What is the Präteritum [[ihr]] form of [[sein]]?", a:["wart","seid","waren","wurdet"], c:0, e:"[[ich war, du warst, er war, wir waren, ihr wart, sie waren]]."},
{s:"haben, sein, werden", q:"Which auxiliary does [[werden]] take in the perfect?", a:["sein","haben","werden","either"], c:0, e:"[[Er ist Arzt geworden]]."},

{s:"Modal verbs", q:"[[ich ___]] from [[müssen]]", a:["muss","musse","müss","musst"], c:0, e:"The ich and er forms of a modal are identical and take no ending."},
{s:"Modal verbs", q:"What does [[Ich muss nicht gehen]] mean?", a:["I don't have to go","I must not go","I can't go","I shouldn't go"], c:0, e:"For \"must not\" use [[nicht dürfen]]."},
{s:"Modal verbs", q:"Where does the second verb go?", a:["to the end, as a bare infinitive","directly after the modal","first","it takes zu"], c:0, e:"[[Ich muss morgen früh aufstehen.]]"},

{s:"Separable and inseparable verbs", q:"[[Ich ___ um sechs ___.]] ([[aufstehen]], main clause)", a:["stehe … auf","aufstehe … —","stehe auf … —","auf … stehe"], c:0, e:"The stressed prefix detaches and moves to the end of the clause."},
{s:"Separable and inseparable verbs", q:"What is the Partizip II of [[verstehen]]?", a:["verstanden","geverstanden","verstehgt","gestanden"], c:0, e:"Inseparable verbs form the participle without [[ge-]]."},
{s:"Separable and inseparable verbs", q:"Which prefix is always inseparable?", a:["ver-","auf-","mit-","zurück-"], c:0, e:"be-, emp-, ent-, er-, ge-, miss-, ver-, zer- never detach."},

/* ---------- VI. Tenses ---------- */
{s:"The tenses at a glance", q:"Which past tense dominates spoken German?", a:["Perfekt","Präteritum","Plusquamperfekt","Futur II"], c:0, e:"The Präteritum belongs to writing, apart from [[sein]], [[haben]] and the modals."},
{s:"The tenses at a glance", q:"How is the future usually expressed in conversation?", a:["present tense plus a time word","werden + Infinitiv","Futur II","Konjunktiv II"], c:0, e:"[[Ich gehe morgen ins Kino]]. [[werden]] is for predictions and promises."},
{s:"The tenses at a glance", q:"[[Ich werde gespielt haben]] is which tense?", a:["Futur II","Futur I","Plusquamperfekt","Perfekt"], c:0, e:"werden + Partizip II + haben/sein."},

{s:"Perfekt", q:"[[Ich ___ nach Berlin gefahren.]]", a:["bin","habe","werde","war"], c:0, e:"Verbs of motion take [[sein]]."},
{s:"Perfekt", q:"What is the Partizip II of [[studieren]]?", a:["studiert","gestudiert","gestudieren","studierte"], c:0, e:"Verbs in [[-ieren]] take no [[ge-]]."},
{s:"Perfekt", q:"[[Ich habe das Auto gefahren]] — why [[haben]]?", a:["there is a direct object","[[fahren]] is weak","it is a mistake","[[Auto]] is neuter"], c:0, e:"With an accusative object the auxiliary is [[haben]], even for a motion verb."},

{s:"Präteritum", q:"[[er ___]] — Präteritum of [[gehen]]", a:["ging","gingte","gehte","gegangen"], c:0, e:"Strong verbs change the stem and take no ending in the 1st and 3rd singular."},
{s:"Präteritum", q:"[[ich ___]] — Präteritum of [[bringen]]", a:["brachte","bringte","brang","gebracht"], c:0, e:"Mixed verbs change the vowel and take the weak endings."},
{s:"Präteritum", q:"Which weak Präteritum ending goes with [[du]]?", a:["-test","-te","-ten","-tet"], c:0, e:"[[du spieltest]]."},

{s:"Plusquamperfekt and Futur", q:"Which conjunction usually triggers the Plusquamperfekt?", a:["nachdem","weil","wenn","obwohl"], c:0, e:"[[Nachdem ich gegessen hatte, ging ich ins Bett.]]"},
{s:"Plusquamperfekt and Futur", q:"[[Sie wird wohl krank sein]] most likely means…", a:["she is probably ill","she will be ill","she wants to be ill","she was ill"], c:0, e:"[[werden]] plus [[wohl]] or [[schon]] expresses an assumption."},
{s:"Plusquamperfekt and Futur", q:"How is the Plusquamperfekt formed?", a:["hatte / war + Partizip II","werden + Infinitiv","hatte + Infinitiv","war + Infinitiv"], c:0, e:"It is the perfect with the auxiliary in the Präteritum."},

/* ---------- VII. Mood & Voice ---------- */
{s:"Imperative", q:"Imperative of [[geben]] addressing [[du]]", a:["Gib!","Geb!","Gibst!","Gebe!"], c:0, e:"e → i verbs keep the change in the du imperative."},
{s:"Imperative", q:"Imperative of [[fahren]] addressing [[du]]", a:["Fahr!","Fähr!","Fahre du!","Fahrst!"], c:0, e:"a → ä verbs lose the umlaut in the imperative."},
{s:"Imperative", q:"Which imperative keeps its pronoun?", a:["the Sie form","the du form","the ihr form","none of them"], c:0, e:"The [[du]] and [[ihr]] forms drop the pronoun; [[Kommen Sie!]] and [[Gehen wir!]] keep it."},

{s:"Konjunktiv II", q:"[[Wenn ich Zeit ___, würde ich kommen.]]", a:["hätte","habe","hatte","hätt"], c:0, e:"[[haben]] has a real Konjunktiv II form, so [[würde haben]] is avoided."},
{s:"Konjunktiv II", q:"How is the past Konjunktiv II formed?", a:["hätte / wäre + Partizip II","würde + Partizip II","würde + Infinitiv","hatte + Infinitiv"], c:0, e:"[[Wenn ich Zeit gehabt hätte…]] — [[würde]] is never used for the past."},
{s:"Konjunktiv II", q:"Which is the polite way to ask for a coffee?", a:["Ich hätte gern einen Kaffee.","Ich habe gern einen Kaffee.","Ich will einen Kaffee.","Ich hatte einen Kaffee."], c:0, e:"Konjunktiv II softens a request."},

{s:"Passive", q:"[[Das Haus ist gebaut ___.]] (perfect passive)", a:["worden","geworden","werden","wurde"], c:0, e:"In the passive perfect the participle of [[werden]] loses its [[ge-]]."},
{s:"Passive", q:"[[Das Fenster ist geöffnet]] describes…", a:["the resulting state","the action in progress","a future action","a habit"], c:0, e:"[[sein]] + participle is the state; [[werden]] + participle is the action."},
{s:"Passive", q:"Which preposition names a person as the agent?", a:["von","durch","mit","bei"], c:0, e:"[[von]] for an agent, [[durch]] for a means or cause."},

{s:"Konjunktiv I — reported speech", q:"In formal writing, which form marks [[Er sagt, er ___ krank]] as a reported claim?", a:["sei","ist","war","gewesen ist"], c:0, e:"Konjunktiv I reports a claim without endorsing it. The indicative [[ist]] is grammatical too, but it quietly endorses the claim."},
{s:"Konjunktiv I — reported speech", q:"Why is [[sie hätten]] used rather than [[sie haben]] in reported speech?", a:["Konjunktiv I would look identical to the present","[[haben]] has no Konjunktiv I","it is more polite","the plural always uses Konjunktiv II"], c:0, e:"When Konjunktiv I is indistinguishable from the indicative, Konjunktiv II takes over."},
{s:"Konjunktiv I — reported speech", q:"Where is Konjunktiv I mainly found?", a:["journalism and formal writing","casual speech","questions","commands"], c:0, e:"In speech the indicative is normal."},

/* ---------- VIII. Word Order ---------- */
{s:"The verb-second rule", q:"[[Morgen ___ ich nach Berlin.]]", a:["fahre","ich fahre","fahren","zu fahren"], c:0, e:"The conjugated verb holds second position and the subject follows it."},
{s:"The verb-second rule", q:"A whole subordinate clause in first position counts as…", a:["one element","two elements","no element","the verb"], c:0, e:"[[Weil es billig ist, fahre ich mit dem Bus.]]"},
{s:"The verb-second rule", q:"In [[Ich habe ein Buch gekauft]], where is the participle?", a:["at the end of the clause","second","first","before the object"], c:0, e:"Everything verbal except the conjugated verb goes to the end."},

{s:"Order in the middle field", q:"What does TeKaMoLo stand for?", a:["temporal, kausal, modal, lokal","tense, case, mood, location","time, kind, motion, location","topic, case, modal, logic"], c:0, e:"When, why, how, where — in that order."},
{s:"Order in the middle field", q:"[[Den Ball? Ich gebe ___.]] (I give it to him — two pronouns)", a:["ihn ihm","ihm ihn","ihm den","den ihm"], c:0, e:"With two pronouns the accusative comes first."},
{s:"Order in the middle field", q:"With two full nouns the order is…", a:["dative before accusative","accusative before dative","either","alphabetical"], c:0, e:"[[Ich gebe dem Kind den Ball.]]"},

{s:"Conjunctions", q:"Which conjunction sends the verb to the end?", a:["weil","denn","aber","und"], c:0, e:"[[weil]] is subordinating; [[denn]] leaves the order untouched."},
{s:"Conjunctions", q:"[[Deshalb ___ ich zu Hause.]]", a:["bleibe","ich bleibe","bleiben","zu bleiben"], c:0, e:"[[deshalb]] occupies position 1, so the verb comes second."},
{s:"Conjunctions", q:"Which pair means the same but behaves differently?", a:["denn and weil","und and oder","aber and sondern","dass and ob"], c:0, e:"[[Ich bleibe, denn ich bin müde]] beside [[…, weil ich müde bin]]."},

{s:"Infinitive clauses with zu", q:"[[Ich versuche, früh ___.]] ([[aufstehen]])", a:["aufzustehen","zu aufstehen","aufstehen zu","zu aufzustehen"], c:0, e:"With a separable verb the [[zu]] sits between prefix and stem."},
{s:"Infinitive clauses with zu", q:"Which verb takes NO [[zu]]?", a:["müssen","versuchen","hoffen","beginnen"], c:0, e:"Modals, [[werden]], [[lassen]], [[sehen]] and [[hören]] take a bare infinitive."},
{s:"Infinitive clauses with zu", q:"When can [[um … zu]] not be used?", a:["when the two halves have different subjects","in the past","with separable verbs","in questions"], c:0, e:"Use [[damit]] instead: [[Ich erkläre es, damit du es verstehst.]]"},

{s:"Commas", q:"Where is a comma required?", a:["before a subordinate clause","before [[und]] in a list","after a fronted element","before [[wie]] in a comparison"], c:0, e:"[[Ich bleibe, weil es regnet.]]"},
{s:"Commas", q:"[[Äpfel, Birnen ___ Bananen]]", a:["und",", und","; und",", und auch"], c:0, e:"German does not use a serial comma before [[und]]."},
{s:"Commas", q:"When may the comma before a [[zu]] infinitive be left out?", a:["only before a bare, unextended infinitive","always","never","only after [[um]]"], c:0, e:"[[Iris versprach mitzumachen.]] Once anything depends on the infinitive — and always after [[um]], [[ohne]], [[statt]] — the comma is compulsory."},

/* ---------- IX. Questions ---------- */
{s:"W-question words", q:"Which asks about possession?", a:["wessen","wem","wen","wer"], c:0, e:"[[wer – wen – wem – wessen]] decline like [[der]]."},
{s:"W-question words", q:"[[___ gehst du?]] (where to)", a:["Wohin","Wo","Woher","Wann"], c:0, e:"[[wo]] is position, [[wohin]] destination, [[woher]] origin."},
{s:"W-question words", q:"[[___ Buch möchtest du?]] (which)", a:["Welches","Welcher","Was","Wie"], c:0, e:"[[welcher]] declines like a der-word and agrees with the noun."},

{s:"Question structure", q:"How does a yes/no question begin?", a:["with the verb","with the subject","with a question word","with [[ob]]"], c:0, e:"[[Kommst du morgen?]]"},
{s:"Question structure", q:"[[Ich frage, ___ du mitkommst.]]", a:["ob","wenn","wann","dass"], c:0, e:"An indirect yes/no question uses [[ob]], never [[wenn]]."},
{s:"Question structure", q:"In an indirect question the verb goes…", a:["at the end","second","first","after the subject"], c:0, e:"[[Ich weiß nicht, wo er wohnt.]]"},

{s:"wo(r)- and da(r)- compounds", q:"[[___ wartest du?]] (what are you waiting for)", a:["Worauf","Wofür","Auf wen","Warum"], c:0, e:"[[warten auf]] + a thing → [[worauf]]."},
{s:"wo(r)- and da(r)- compounds", q:"When is the [[r]] inserted?", a:["before a vowel","before a consonant","always","never in questions"], c:0, e:"[[worauf]], [[woran]], but [[womit]], [[wofür]]."},
{s:"wo(r)- and da(r)- compounds", q:"[[Auf wen wartest du?]] asks about…", a:["a person","a thing","a place","a time"], c:0, e:"People keep the preposition plus a pronoun; things use the compound."},

/* ---------- X. Comparison ---------- */
{s:"Comparative and superlative", q:"Comparative of [[interessant]]", a:["interessanter","mehr interessant","interessantest","am interessanten"], c:0, e:"German adds endings however long the adjective is."},
{s:"Comparative and superlative", q:"Superlative of [[kalt]] standing alone", a:["am kältesten","am kaltsten","der kälteste","am kälter"], c:0, e:"An extra [[e]] goes in after [[-d, -t, -s, -ß, -z]]."},
{s:"Comparative and superlative", q:"[[Er ist der ___ Läufer.]] (fastest)", a:["schnellste","am schnellsten","schnellsten","schneller"], c:0, e:"Before a noun the superlative takes adjective endings."},

{s:"Irregular comparisons", q:"Comparative of [[gut]]", a:["besser","guter","gutter","mehr gut"], c:0, e:"[[gut – besser – am besten]]."},
{s:"Irregular comparisons", q:"[[gern]] → ?", a:["lieber","gerner","mehr gern","gernst"], c:0, e:"[[gern – lieber – am liebsten]] expresses preference."},
{s:"Irregular comparisons", q:"Superlative of [[viel]]", a:["am meisten","am vielsten","am mehr","am vielen"], c:0, e:"[[viel – mehr – am meisten]]."},

{s:"Comparison patterns", q:"[[Er ist größer ___ ich.]]", a:["als","wie","dann","so"], c:0, e:"[[als]] marks a difference, [[wie]] marks equality."},
{s:"Comparison patterns", q:"[[Je mehr ich lerne, ___ weniger weiß ich.]]", a:["desto","als","wie","umso mehr"], c:0, e:"[[je]] sends the verb to the end, [[desto]] keeps it second."},
{s:"Comparison patterns", q:"[[Es wird ___ kälter.]] (colder and colder)", a:["immer","mehr","sehr","noch"], c:0, e:"[[immer]] + comparative expresses gradual change."},

/* ---------- XI. Nouns ---------- */
{s:"Guessing the gender", q:"What gender is a noun ending in [[-ung]]?", a:["feminine","masculine","neuter","varies"], c:0, e:"[[die Zeitung]], [[die Meinung]]."},
{s:"Guessing the gender", q:"[[das Mädchen]] is neuter because…", a:["[[-chen]] always makes a noun neuter","girls are grammatically neuter","it is a loanword","it is a plural"], c:0, e:"[[-chen]] and [[-lein]] override the base noun's gender."},
{s:"Guessing the gender", q:"In a compound the gender comes from…", a:["the last element","the first element","the longest element","the article of the whole"], c:0, e:"[[die Tür]] + [[der Griff]] = [[der Türgriff]]."},

{s:"Forming the plural", q:"Plural of [[das Auto]]", a:["die Autos","die Auten","die Autoe","die Autö"], c:0, e:"Loanwords usually take [[-s]]."},
{s:"Forming the plural", q:"Plural of [[die Lehrerin]]", a:["die Lehrerinnen","die Lehrerins","die Lehrerine","die Lehrerin"], c:0, e:"Feminine [[-in]] doubles the n and adds [[-nen]]."},
{s:"Forming the plural", q:"Which plural article is used?", a:["die, for every gender","der","das","it keeps the singular article"], c:0, e:"All plurals take [[die]] in the nominative."},

{s:"Weak nouns (n-declension)", q:"[[Ich sehe den ___.]] ([[der Student]])", a:["Studenten","Student","Studentes","Studentn"], c:0, e:"Weak nouns add [[-en]] in every case but the nominative singular."},
{s:"Weak nouns (n-declension)", q:"Genitive of [[der Name]]", a:["des Namens","des Namen","des Names","der Name"], c:0, e:"[[Name]] is a mixed weak noun and adds [[-s]] in the genitive."},
{s:"Weak nouns (n-declension)", q:"Accusative of [[der Herr]]", a:["den Herrn","den Herren","den Herr","dem Herrn"], c:0, e:"[[Herr]] takes [[-n]] in the singular and [[-en]] in the plural."},

{s:"Compound nouns", q:"[[die Bahnhofstraße]] is feminine because…", a:["[[Straße]] is feminine","[[Bahnhof]] is masculine","of the linking -s","compounds are always feminine"], c:0, e:"The last element carries the gender."},
{s:"Compound nouns", q:"How should a long compound be read?", a:["right to left","left to right","by syllables","by the article"], c:0, e:"The final noun is the head; everything before it modifies it."},
{s:"Compound nouns", q:"The [[-s]] in [[Arbeitsplatz]] is…", a:["a linking sound with no rule worth learning","a genitive","a plural","a typo"], c:0, e:"Linking [[-s]] and [[-n]] follow historical patterns."},

{s:"Countries and nationalities", q:"[[Ich fahre ___ Schweiz.]]", a:["in die","nach","zu der","auf die"], c:0, e:"Countries with an article take [[in]] + accusative for movement."},
{s:"Countries and nationalities", q:"[[Ich fahre ___ Berlin.]]", a:["nach","in die","zu","an"], c:0, e:"[[nach]] for places that take no article."},
{s:"Countries and nationalities", q:"Which is correct?", a:["Ich spreche Deutsch.","Ich spreche Deutsche.","Ich spreche der Deutsch.","Ich spreche Deutscher."], c:0, e:"A language name is a capitalised noun. Only the adjective is lower case: [[ein deutsches Auto]]."},

/* ---------- XII. Usage ---------- */
{s:"Impersonal es", q:"[[Es gibt ___ Grund.]]", a:["einen","ein","einem","eines"], c:0, e:"[[es gibt]] always takes the accusative."},
{s:"Impersonal es", q:"[[___ geht mir gut.]] / [[Mir geht ___ gut.]]", a:["Es … es","Es … —","Das … es","Ich … es"], c:0, e:"[[es]] moves out of first position but stays in the clause."},
{s:"Impersonal es", q:"[[Es ist mir kalt]] uses which case for [[mir]]?", a:["dative","accusative","nominative","genitive"], c:0, e:"Expressions of how someone feels take the dative."},

{s:"Modal particles", q:"[[Komm doch mit!]] — what does [[doch]] add?", a:["gentle encouragement","a negative","a question","past time"], c:0, e:"Particles colour a sentence without adding information."},
{s:"Modal particles", q:"[[Du kommst nicht mit?]] How do you contradict this?", a:["Doch!","Ja!","Nein!","Schon!"], c:0, e:"[[doch]] contradicts a negative question; [[ja]] would agree with it."},
{s:"Modal particles", q:"Where do modal particles sit?", a:["in the middle field","first","last","after the subject only"], c:0, e:"They are never in first position and never stressed."},

{s:"False friends", q:"[[Ich bekomme ein Bier.]] means…", a:["I am getting a beer","I am becoming a beer","I like beer","I am buying a beer"], c:0, e:"[[bekommen]] is to receive; to become is [[werden]]."},
{s:"False friends", q:"[[aktuell]] means…", a:["current","actually","accurate","actual size"], c:0, e:"\"Actually\" is [[eigentlich]]."},
{s:"False friends", q:"[[das Gift]] means…", a:["poison","present","talent","gift shop"], c:0, e:"A present is [[das Geschenk]]."},

/* ---------- XIII. Reference ---------- */
{s:"Verbs that take the dative", q:"[[Ich danke ___.]]", a:["dir","dich","deiner","du"], c:0, e:"[[danken]] takes a dative object."},
{s:"Verbs that take the dative", q:"Which verb does NOT take the dative?", a:["sehen","helfen","folgen","gefallen"], c:0, e:"[[sehen]] takes an accusative object."},
{s:"Verbs that take the dative", q:"Why can dative verbs not form a normal passive?", a:["they have no accusative object to promote","they are irregular","they are always reflexive","they take [[sein]]"], c:0, e:"The passive promotes an accusative object to subject."},

{s:"Verbs with fixed prepositions", q:"[[Ich warte ___ den Bus.]]", a:["auf","für","an","nach"], c:0, e:"[[warten auf]] + accusative."},
{s:"Verbs with fixed prepositions", q:"[[Ich interessiere mich ___ Musik.]]", a:["für","an","auf","über"], c:0, e:"[[sich interessieren für]] + accusative."},
{s:"Verbs with fixed prepositions", q:"[[Das hängt ___ dir ab.]]", a:["von","auf","an","für"], c:0, e:"[[abhängen von]] + dative."},

{s:"Numbers", q:"How is 47 written?", a:["siebenundvierzig","vierzigsieben","vierundsiebzig","siebzigvier"], c:0, e:"Units come before tens, joined by [[und]], all as one word."},
{s:"Numbers", q:"What does [[1.000,50]] mean in German?", a:["one thousand point five","one point zero zero zero five","one and a half","ten thousand and five"], c:0, e:"The separators are the reverse of English."},
{s:"Numbers", q:"Which is spelled irregularly?", a:["dreißig","fünfzig","vierzig","achtzig"], c:0, e:"[[dreißig]] uses [[ß]]; [[sechzig]] and [[siebzig]] are shortened."},

{s:"Time and date", q:"[[halb neun]] is…", a:["8:30","9:30","9:00","8:00"], c:0, e:"It means half way to nine, not half past nine."},
{s:"Time and date", q:"[[___ Mai]] (in May)", a:["im","in","am","um"], c:0, e:"[[in dem]] contracts to [[im]] for months and seasons."},
{s:"Time and date", q:"How do you say \"in 2026\"?", a:["2026 or im Jahr 2026","in 2026","am 2026","um 2026"], c:0, e:"German does not use a preposition with a bare year."},

/* ---------- XIV. Strong Verbs ---------- */
{s:"Strong and irregular verbs: beginnen – fliegen", q:"Partizip II of [[bleiben]]", a:["ist geblieben","hat geblieben","ist gebleibt","hat gebliebt"], c:0, e:"[[bleiben]] is one of the three special verbs that take [[sein]]."},
{s:"Strong and irregular verbs: beginnen – fliegen", q:"Präteritum of [[bringen]]", a:["brachte","brang","bringte","gebracht"], c:0, e:"A mixed verb: new vowel, weak endings."},
{s:"Strong and irregular verbs: beginnen – fliegen", q:"Which vowel pattern does [[finden]] follow?", a:["i–a–u","ei–ie–ie","ie–o–o","a–u–a"], c:0, e:"[[finden, fand, gefunden]], like [[singen]] and [[trinken]]."},

{s:"Strong and irregular verbs: geben – lügen", q:"Partizip II of [[gehen]]", a:["ist gegangen","hat gegangen","ist gegehen","hat gegeht"], c:0, e:"Motion verb → [[sein]]."},
{s:"Strong and irregular verbs: geben – lügen", q:"Präteritum of [[helfen]]", a:["half","halfte","hilfte","geholfen"], c:0, e:"[[helfen, half, geholfen]]."},
{s:"Strong and irregular verbs: geben – lügen", q:"[[kennen]] or [[wissen]] for a fact you can state?", a:["wissen","kennen","either","neither"], c:0, e:"[[kennen]] is for people and places, [[wissen]] for facts and clauses."},

{s:"Strong and irregular verbs: messen – sprechen", q:"[[er ___]] from [[nehmen]] (present)", a:["nimmt","nehmt","nahm","nimmst"], c:0, e:"[[nehmen, nimmt, nahm, genommen]]."},
{s:"Strong and irregular verbs: messen – sprechen", q:"[[Er ___ über den See geschwommen.]]", a:["ist","hat","war","wird"], c:0, e:"Movement from A to B takes [[sein]]. With a duration ([[eine Stunde geschwommen]]) [[haben]] is also used."},
{s:"Strong and irregular verbs: messen – sprechen", q:"In the perfect, [[Ich habe gehen ___]]", a:["müssen","gemusst","zu müssen","muss"], c:0, e:"A modal with a second verb uses the double infinitive."},

{s:"Strong and irregular verbs: springen – ziehen", q:"Partizip II of [[werden]]", a:["ist geworden","hat geworden","ist worden","hat gewordet"], c:0, e:"[[worden]] without [[ge-]] is the passive form only."},
{s:"Strong and irregular verbs: springen – ziehen", q:"Präteritum of [[wissen]]", a:["wusste","wisste","weißte","gewusst"], c:0, e:"Mixed verb: [[wissen, weiß, wusste, gewusst]]."},
{s:"Strong and irregular verbs: springen – ziehen", q:"[[Ich habe den Koffer getragen]] — why [[haben]]?", a:["[[tragen]] has a direct object","[[tragen]] is weak","[[Koffer]] is masculine","it is a mistake"], c:0, e:"A verb with an accusative object takes [[haben]], even when it feels like motion."},

/* ---------- I. Sounds & Spelling ---------- */
{s:"The alphabet and stress", q:"How is the letter [[W]] named in German?", a:["weh","doppel-u","weh-weh","vau"], c:0, e:"[[W]] is named [[weh]] and sounds like an English v."},
{s:"The alphabet and stress", q:"Where does the stress fall in [[aufstehen]]?", a:["on the prefix: **auf**stehen","on the stem: auf**ste**hen","on the last syllable","it varies"], c:0, e:"A separable prefix is stressed, which is exactly why it can detach."},
{s:"The alphabet and stress", q:"Where does the stress fall in [[verstehen]]?", a:["on the stem: ver**ste**hen","on the prefix: **ver**stehen","on the last syllable","evenly"], c:0, e:"Inseparable prefixes are unstressed and never detach."},
{s:"The alphabet and stress", q:"Which is true of [[ß]]?", a:["it never begins a word","it is pronounced like z","it only appears in names","it is always doubled"], c:0, e:"[[ß]] is a sharp s and is written [[ss]] in Switzerland."},

{s:"Vowels", q:"How does [[ie]] sound, as in [[Liebe]]?", a:["like **ee** in see","like **eye**","like **oy** in boy","like **ay** in say"], c:0, e:"Each of [[ei]] and [[ie]] says the name of its second letter."},
{s:"Vowels", q:"How does [[ei]] sound, as in [[mein]]?", a:["like **eye**","like **ee** in see","like **ay** in say","like **ow** in how"], c:0, e:"[[ei]] sounds like the English letter I."},
{s:"Vowels", q:"How does [[eu]] sound, as in [[neu]]?", a:["like **oy** in boy","like **you**","like **ee**","like **eye**"], c:0, e:"[[eu]] and [[äu]] both sound like **oy**."},
{s:"Vowels", q:"In [[kommen]] the [[o]] is short. Why?", a:["a double consonant follows","it is unstressed","it is at the start","it is followed by n"], c:0, e:"A vowel is short before a double consonant and long before h or when doubled."},

{s:"Consonants", q:"How is the [[ch]] in [[Buch]] pronounced?", a:["throaty, as in Scottish **loch**","soft, as in **huge**","like **k**","like **sh**"], c:0, e:"After a, o, u and au the [[ch]] is the rasping sound."},
{s:"Consonants", q:"How is the [[ch]] in [[ich]] pronounced?", a:["soft, as in **huge**","throaty, as in **loch**","like **k**","like **ch** in church"], c:0, e:"After any other vowel, including the umlauts, [[ch]] is soft."},
{s:"Consonants", q:"How does [[v]] sound in [[Vater]]?", a:["like English **f**","like English **v**","like **w**","it is silent"], c:0, e:"Native words have [[v]] as **f**; loanwords such as [[Vase]] keep the **v** sound."},
{s:"Consonants", q:"Why does [[Hund]] sound like **hunt**?", a:["final b, d and g harden","the u is short","the n is silent","it is a regional variant"], c:0, e:"The soft sound returns when an ending follows: [[Hunde]]."},

/* ---------- IV. Adjectives — adverbs ---------- */
{s:"Adverbs", q:"[[Sie singt schön.]] What does this mean?", a:["she sings beautifully","she is beautiful","she sings a beautiful song","she likes singing"], c:0, e:"A bare adjective after a verb is adverbial. German does not add anything for **-ly**."},
{s:"Adverbs", q:"Which points **towards** the speaker?", a:["her","hin","dort","weg"], c:0, e:"[[Komm her!]] come here; [[Geh hin!]] go there."},
{s:"Adverbs", q:"What does [[übermorgen]] mean?", a:["the day after tomorrow","the day before yesterday","this evening","in a moment"], c:0, e:"Formed from [[über]] plus [[morgen]]."},

{s:"Adverbs of degree and attitude", q:"[[Leider ___ ich nicht kommen.]]", a:["kann","ich kann","können","zu kommen"], c:0, e:"An attitude adverb in first position still leaves the verb second."},
{s:"Adverbs of degree and attitude", q:"What does [[eigentlich]] mean?", a:["actually","eventually","exactly","especially"], c:0, e:"**Eventually** is [[schließlich]]."},
{s:"Adverbs of degree and attitude", q:"Which means **hardly**?", a:["kaum","fast","ganz","sehr"], c:0, e:"[[fast]] means almost, [[kaum]] means hardly."},

/* ---------- XIV. Reference — full conjugations ---------- */
{s:"A weak verb in full: machen", q:"What is the [[ihr]] form of [[machen]] in the Präteritum?", a:["machtet","machtest","machten","machte"], c:0, e:"Weak Präteritum endings: -te, -test, -te, -ten, -tet, -ten."},
{s:"A weak verb in full: machen", q:"[[Ich ___ gemacht]] — Plusquamperfekt", a:["hatte","habe","werde","wäre"], c:0, e:"The pluperfect is the perfect with the auxiliary in the Präteritum."},
{s:"A weak verb in full: machen", q:"Which form is used **instead of** the Konjunktiv II of [[machen]]?", a:["würde machen","hätte gemacht","mache","machen würde haben"], c:0, e:"A weak verb's Konjunktiv II ([[machte]]) is identical to its Präteritum, so [[würde]] + infinitive is used instead."},

{s:"A strong verb in full: sprechen", q:"What is the [[du]] form of [[sprechen]] in the present?", a:["sprichst","sprechst","sprachst","sprichest"], c:0, e:"e becomes i in the du and er forms."},
{s:"A strong verb in full: sprechen", q:"What is the [[du]] imperative of [[sprechen]]?", a:["Sprich!","Sprech!","Spreche!","Sprichst!"], c:0, e:"e to i verbs keep the vowel change in the imperative."},
{s:"A strong verb in full: sprechen", q:"What is the Partizip II of [[sprechen]]?", a:["gesprochen","gesprecht","gesprachen","sprochen"], c:0, e:"Strong participles end in -en and often change the vowel."},

/* ---------- XVI. Everyday German ---------- */
{s:"Greetings and politeness", q:"Which greeting is the safe default with a stranger?", a:["Guten Tag","Hallo","Servus","Tschüss"], c:0, e:"[[Hallo]] is informal and [[Tschüss]] is a farewell."},
{s:"Greetings and politeness", q:"What does [[Gute Besserung]] mean?", a:["get well soon","good luck","enjoy your meal","congratulations"], c:0, e:"Said to someone who is ill."},
{s:"Greetings and politeness", q:"What does [[Wie bitte?]] mean?", a:["pardon?","how much?","please?","how are you?"], c:0, e:"[[bitte]] covers please, you're welcome, here you are and pardon."},
{s:"Greetings and politeness", q:"Which is said before eating?", a:["Guten Appetit","Prost","Gern geschehen","Viel Glück"], c:0, e:"[[Prost]] is for drinking."},

{s:"Getting by", q:"Which is the polite way to order?", a:["Ich hätte gern einen Kaffee","Ich will einen Kaffee","Ich habe einen Kaffee","Gib mir einen Kaffee"], c:0, e:"[[Ich will]] sounds blunt to the point of rudeness."},
{s:"Getting by", q:"[[Mir ist schlecht]] means…", a:["I feel sick","I am bad at this","it is bad for me","I am in a bad mood"], c:0, e:"Feelings take the dative: [[mir]], not [[ich]]."},
{s:"Getting by", q:"How do you ask someone to slow down?", a:["Langsamer, bitte","Schneller, bitte","Leiser, bitte","Später, bitte"], c:0, e:"[[langsam]] slow, comparative [[langsamer]]."},

/* ---------- XVII. Vocabulary ---------- */
{s:"People and family", q:"Which article does [[Mädchen]] take?", a:["das","die","der","den"], c:0, e:"Every noun ending in -chen is neuter, whatever it refers to."},
{s:"People and family", q:"What does [[die Geschwister]] mean?", a:["siblings","grandparents","in-laws","twins"], c:0, e:"Normally used in the plural."},
{s:"People and family", q:"How do you say **aunt**?", a:["die Tante","der Onkel","die Nichte","die Cousine"], c:0, e:"[[der Onkel]] is uncle, [[die Nichte]] niece."},

{s:"The body", q:"Which article does [[Auge]] take?", a:["das","die","der","den"], c:0, e:"[[das Auge]], plural [[die Augen]]."},
{s:"The body", q:"What does [[der Rücken]] mean?", a:["back","stomach","shoulder","knee"], c:0, e:"[[der Bauch]] is the stomach."},
{s:"The body", q:"How do you say **hand**?", a:["die Hand","der Arm","der Finger","die Schulter"], c:0, e:"[[die Hand]], plural [[die Hände]]."},

{s:"Food and drink", q:"Which article does [[Brot]] take?", a:["das","die","der","den"], c:0, e:"[[das Brot]]; a roll is [[das Brötchen]]."},
{s:"Food and drink", q:"What is [[der Käse]]?", a:["cheese","cake","meat","cabbage"], c:0, e:"Cake is [[der Kuchen]]."},
{s:"Food and drink", q:"How do you say **apple**?", a:["der Apfel","die Birne","die Kartoffel","der Saft"], c:0, e:"[[der Apfel]], plural [[die Äpfel]]."},

{s:"Animals", q:"Which article does [[Pferd]] take?", a:["das","der","die","den"], c:0, e:"[[das Pferd]], plural [[die Pferde]]."},
{s:"Animals", q:"What is [[der Vogel]]?", a:["bird","fox","fish","frog"], c:0, e:"[[der Fuchs]] is fox, [[der Frosch]] frog."},
{s:"Animals", q:"How do you say **cat**?", a:["die Katze","der Hund","die Maus","das Schaf"], c:0, e:"[[die Katze]] is feminine, [[der Hund]] masculine."},

{s:"The house", q:"Which article does [[Küche]] take?", a:["die","das","der","den"], c:0, e:"Nouns ending in -e are usually feminine."},
{s:"The house", q:"What is [[das Fenster]]?", a:["window","door","floor","wall"], c:0, e:"[[die Tür]] is door."},
{s:"The house", q:"How do you say **cupboard**?", a:["der Schrank","das Regal","der Tisch","das Bett"], c:0, e:"[[das Regal]] is a shelf."},

{s:"Clothing", q:"Which article does [[Hose]] take?", a:["die","das","der","den"], c:0, e:"[[die Hose]] is singular in German although trousers is plural in English."},
{s:"Clothing", q:"What is [[der Rock]]?", a:["skirt","coat","jacket","rock"], c:0, e:"A false friend: the mineral is [[der Stein]]."},
{s:"Clothing", q:"How do you say **shoe**?", a:["der Schuh","der Stiefel","die Socke","der Gürtel"], c:0, e:"[[der Stiefel]] is a boot."},

{s:"Jobs and work", q:"Which article does [[Firma]] take?", a:["die","das","der","den"], c:0, e:"[[die Firma]], plural [[die Firmen]]."},
{s:"Jobs and work", q:"What is [[der Anwalt]]?", a:["lawyer","doctor","judge","engineer"], c:0, e:"[[der Richter]] is a judge."},
{s:"Jobs and work", q:"How is the feminine of [[Lehrer]] formed?", a:["Lehrerin","Lehrerine","Lehrera","Lehrere"], c:0, e:"Most job names add -in, plural -innen."},

{s:"Places in town", q:"Which article does [[Bahnhof]] take?", a:["der","die","das","den"], c:0, e:"[[der Bahnhof]], from [[die Bahn]] plus [[der Hof]] — the last element decides."},
{s:"Places in town", q:"What is [[die Apotheke]]?", a:["pharmacy","department store","library","post office"], c:0, e:"[[die Bibliothek]] is a library."},
{s:"Places in town", q:"How do you say **church**?", a:["die Kirche","das Schloss","der Dom","das Rathaus"], c:0, e:"[[der Dom]] is specifically a cathedral."},

{s:"Travel and transport", q:"Which article does [[Flugzeug]] take?", a:["das","der","die","den"], c:0, e:"[[das Flugzeug]], plural [[die Flugzeuge]]."},
{s:"Travel and transport", q:"What is [[die Fahrkarte]]?", a:["ticket","timetable","platform","journey"], c:0, e:"[[der Fahrplan]] is the timetable."},
{s:"Travel and transport", q:"Which verb covers travelling by car or train?", a:["fahren","gehen","fliegen","laufen"], c:0, e:"[[gehen]] is only on foot."},

{s:"Nature and weather", q:"Which article does [[Sonne]] take?", a:["die","der","das","den"], c:0, e:"[[die Sonne]] but [[der Mond]] — the opposite of the French genders."},
{s:"Nature and weather", q:"What is [[der Baum]]?", a:["tree","branch","bush","forest"], c:0, e:"[[der Wald]] is a forest."},
{s:"Nature and weather", q:"How do you say **it is raining**?", a:["es regnet","es ist Regen","der Regen ist","es regnen"], c:0, e:"Weather uses impersonal [[es]]."},

{s:"Time and the calendar", q:"Which article do the days of the week take?", a:["der","die","das","they vary"], c:0, e:"Days, months and seasons are all masculine."},
{s:"Time and the calendar", q:"What is [[das Wochenende]]?", a:["weekend","weekday","fortnight","week"], c:0, e:"[[die Woche]] plus [[das Ende]]."},
{s:"Time and the calendar", q:"How do you say **in May**?", a:["im Mai","am Mai","in Mai","um Mai"], c:0, e:"[[in dem]] contracts to [[im]] for months and seasons."},

{s:"School and study", q:"Which article does [[Prüfung]] take?", a:["die","das","der","den"], c:0, e:"Every noun ending in -ung is feminine."},
{s:"School and study", q:"What are [[die Ferien]]?", a:["school holidays","lessons","exams","terms"], c:0, e:"Plural only. Time off work is [[der Urlaub]]."},
{s:"School and study", q:"How do you say **exercise book**?", a:["das Heft","das Buch","die Tafel","der Stift"], c:0, e:"[[das Buch]] is a book."},

{s:"Technology and media", q:"Which article does [[Handy]] take?", a:["das","die","der","den"], c:0, e:"[[das Handy]] means a mobile phone, not something convenient."},
{s:"Technology and media", q:"What are [[die Nachrichten]]?", a:["the news","the messages app","the settings","the headlines of a paper"], c:0, e:"Singular [[die Nachricht]] is a single message."},
{s:"Technology and media", q:"How do you say **screen**?", a:["der Bildschirm","die Tastatur","der Drucker","das Kabel"], c:0, e:"[[die Tastatur]] is the keyboard."},

{s:"Money and shopping", q:"Which article does [[Geld]] take?", a:["das","die","der","den"], c:0, e:"[[das Geld]], and it is uncountable."},
{s:"Money and shopping", q:"What is [[die Rechnung]]?", a:["bill","receipt","discount","change"], c:0, e:"[[die Quittung]] is the receipt."},
{s:"Money and shopping", q:"Which noun exists only in the plural?", a:["die Kosten","das Konto","der Preis","die Münze"], c:0, e:"[[die Kosten]] and [[die Schulden]] have no singular."},

{s:"Health and illness", q:"Which article does [[Krankenhaus]] take?", a:["das","die","der","den"], c:0, e:"The last element [[das Haus]] decides the gender."},
{s:"Health and illness", q:"What is [[das Rezept]]?", a:["prescription","receipt","treatment","tablet"], c:0, e:"It also means a cooking recipe."},
{s:"Health and illness", q:"How do you say **I have a headache**?", a:["Ich habe Kopfschmerzen","Ich habe Kopfschmerz","Mein Kopf hat Schmerz","Ich bin Kopfschmerz"], c:0, e:"Aches are plural. Alternatively [[Mir tut der Kopf weh]]."},

{s:"Countries and languages", q:"Which country takes an article?", a:["die Schweiz","Deutschland","Frankreich","Italien"], c:0, e:"Also [[die Türkei]], [[die Niederlande]], [[die USA]]."},
{s:"Countries and languages", q:"How do you say **to Switzerland**?", a:["in die Schweiz","nach Schweiz","nach der Schweiz","zu Schweiz"], c:0, e:"Countries with an article take [[in]] plus the accusative for movement."},
{s:"Countries and languages", q:"What is the language of [[Österreich]]?", a:["Deutsch","Österreichisch","Ungarisch","Schweizerisch"], c:0, e:"Austria and much of Switzerland are German-speaking."},

{s:"Colours, shapes and materials", q:"Which colour never takes an adjective ending?", a:["rosa","rot","grün","blau"], c:0, e:"[[rosa]], [[lila]], [[orange]] and [[beige]] are invariable: [[ein rosa Kleid]]."},
{s:"Colours, shapes and materials", q:"What colour is [[gelb]]?", a:["yellow","green","grey","gold"], c:0, e:"[[grün]] is green, [[grau]] grey."},
{s:"Colours, shapes and materials", q:"Which article does [[Holz]] take?", a:["das","die","der","den"], c:0, e:"[[das Holz]] — wood."},

{s:"Common adjectives", q:"What is the opposite of [[teuer]]?", a:["billig","reich","schwer","voll"], c:0, e:"[[teuer]] expensive, [[billig]] cheap."},
{s:"Common adjectives", q:"[[schwer]] can mean…", a:["both heavy and difficult","only heavy","only difficult","only serious"], c:0, e:"Its opposite [[leicht]] likewise means both light and easy."},
{s:"Common adjectives", q:"What is the opposite of [[laut]]?", a:["leise","langsam","dunkel","leer"], c:0, e:"[[laut]] loud, [[leise]] quiet."},

{s:"Everyday verbs", q:"Which of these is irregular?", a:["nehmen","machen","spielen","kaufen"], c:0, e:"[[nehmen, nimmt, nahm, genommen]]. The others are weak."},
{s:"Everyday verbs", q:"Which verb do you use for knowing a fact?", a:["wissen","kennen","können","verstehen"], c:0, e:"[[kennen]] is for people and places you are acquainted with."},
{s:"Everyday verbs", q:"What is the difference between [[wohnen]] and [[leben]]?", a:["wohnen is to reside, leben is to be alive","they are identical","wohnen is temporary only","leben is only for animals"], c:0, e:"[[Ich wohne in Berlin]] but [[Er lebt noch]]."},

{s:"Verbs of movement, speech and thought", q:"Which is the regular partner of [[liegen]]?", a:["legen","lügen","leihen","lassen"], c:0, e:"[[legen]] to lay something down, [[liegen]] to be lying."},
{s:"Verbs of movement, speech and thought", q:"Which of these is irregular?", a:["schließen","öffnen","üben","prüfen"], c:0, e:"[[schließen, schloss, geschlossen]]."},
{s:"Verbs of movement, speech and thought", q:"What does [[empfehlen]] mean?", a:["to recommend","to receive","to feel","to complain"], c:0, e:"[[empfehlen, empfiehlt, empfahl, empfohlen]] — irregular."}

];
