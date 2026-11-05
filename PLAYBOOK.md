# Playbook: building a new grade/semester site from this template

This repo (PrimaryChinese3B) was bootstrapped from 4B-Vocabulary and is
itself meant to be the starting point for the next one (huawen3A,
yuwen3B, etc.). Everything below is the exact process, including the
mistakes made and how they were fixed, so the next build goes faster.

## 0. Decide: new repo, or reuse an existing one?

Ask the user first. If a repo for this grade/semester already exists
(even an empty scaffold), reuse it — don't create a duplicate.

## 1. Scaffold the repo

Copy the most recently-built sibling site's full file tree (this repo is
currently the most up-to-date reference — GitHub Pages deploy, the
anti-scraping lazy vocab loader, etc.). Then:

- Swap branding/title text in `index.html`, `intro-en.html`, `intro-zh.html`.
- `assets/firebase-config.js`: leave the `REPLACE_ME` placeholders in the
  production config block until Firebase is set up (step 3). The
  emulator config block (`demo-<slug>-vocab`) can be set immediately —
  just pick a unique slug so it doesn't collide with sibling sites'
  emulator projects if ever run side by side.
- `CNAME`: the subdomain this site will live at, e.g. `huawen3a.ktailearn.com`.
- `firestore.rules`: copy verbatim from this repo — the collection
  schema (users/activity/scores/vocabData/typingArticlesMeta/
  typingArticleContent/sessions/etc.) is identical across all these sites.

## 2. Get the source content from the user

Two kinds of material, usually uploaded as separate files:

**A. Reading articles** ("我爱阅读核心"/"我爱阅读深广", or whatever the
textbook's equivalent section is called) — usually one PDF per
lesson-per-track (so 2 PDFs × N lessons). Read each PDF with the Read
tool (it returns real text, not an image dump, as long as the source PDF
has a text layer — these have been scanned textbook pages with clean
text). Extract: title, paragraphs (skip the discussion question at the
end — that's not meant to be typed), 我会认/我会写 char lists (currently
unused downstream, but worth capturing in case a future feature wants
them).

**B. Vocabulary list** — one xlsx, one sheet per lesson, columns 课次/
页码/部分/词语/拼音/英文解释/例句/例句英文/挖空例句+英文/考核词语. Only
需要 词语/拼音/英文解释/例句/例句英文 — the "挖空例句" column is
redundant, the app generates the blank itself client-side by replacing
`hanzi` inside `example_cn` (see `practice.js`'s `questionLabel`/prompt
rendering — don't reinvent this).

若 `openpyxl.load_workbook` 报 `TypeError:
ColumnDimension.__init__() got an unexpected keyword argument
'phonetic'` — pass `read_only=True` (works around a format
incompatibility with WPS-exported xlsx files).

If the user uploads the wrong file (has happened — a totally unrelated
"生字词汇总" master workbook spanning many grades), just confirm and
ignore it rather than guessing.

## 3. Build the typing-test token data (pinyin per character)

This is the fiddliest part. Use `pypinyin` (`Style.TONE3,
neutral_tone_with_five=True, heteronym=False`) per paragraph, **not**
concatenated across paragraphs with raw whitespace — `pypinyin` silently
merges consecutive non-Hanzi characters (quotes, em-dashes, double
commas, "……") into a single multi-character result entry, which
desyncs any naive `zip(text, results)` approach. The fix: iterate the
result list and *consume* characters by the matched syllable's length
when it's not a valid pinyin token, instead of assuming 1 result ↔ 1
input character:

```python
PINYIN_RE = re.compile(r'^[a-zA-Zü]+[1-5]$')

def tokens_for_text(text):
    text = text.replace('\n', '，')
    results = pinyin(text, style=Style.TONE3, neutral_tone_with_five=True, heteronym=False)
    tokens, pos = [], 0
    for r in results:
        syll = r[0]
        if PINYIN_RE.match(syll):
            tokens.append({"hanzi": text[pos], "pinyin": syll})
            pos += 1
        else:
            for ch in syll:
                tokens.append({"hanzi": ch, "pinyin": None})
            pos += len(syll)
    assert pos == len(text)
    return tokens
```

Join multiple paragraphs with a single full-width space `　` token
(`pinyin: null`) as a paragraph spacer — **not** a literal `\n` or two
raw spaces fed into `pinyin()` (same merging bug).

After generating, spot-check polyphone characters (了/地/着/还/为/只/觉/得
etc.) across the whole set — group by hanzi, print the distinct pinyin
values seen, and eyeball whether the distribution looks plausible for
that many different sentences. Also do a hard assertion: reconstructed
`"".join(t["hanzi"] for t in tokens)` must exactly equal the source
paragraphs joined the same way — this catches any remaining desync.

Article id scheme: `"L{lesson}-core"` / `"L{lesson}-deep"` (strings, not
numbers) — **typing.js's article picker "Load" button does
`Number(els.articleSelect.value)` by default**, inherited from the old
numeric-id article pool. With string ids this silently produces `NaN`
and the article never loads (no console error — just "Couldn't load
this article"). Fix at `els.articleConfirmBtn`'s click handler: drop the
`Number(...)` coercion, pass the string straight through.

## 4. Firestore document-size limit, if a level/lesson is large

Firestore documents cap at ~1MB. Estimate before seeding (field name +
1, + value size, + 32 bytes overhead, per field, including nested map
fields) — don't rely on raw JSON byte count, Firestore's own encoding
overhead is substantial for documents with many small string fields (an
HSK6-sized 5000-word list came out ~1.8MB estimated vs ~1.14MB raw JSON).
If a single collection document would exceed the limit, split it across
multiple documents (e.g. `hskVocabContent/6` + `hskVocabContent/6-2`,
with a `totalParts` field) and have the client fetch+concatenate all
parts. Lessons this size are unlikely for a single semester's reading
articles/vocab list, but check anyway before seeding.

## 5. Firebase project (walk the user through this live, in Chinese)

1. console.firebase.google.com → new project. Skip "Gemini in Firebase"
   and "Google Analytics" prompts during creation — neither is used.
2. 左侧栏 **安全(Security) → 身份验证(Authentication)** → Sign-in method
   tab → enable 电子邮件地址/密码 (Email/Password).
3. 左侧栏 **数据库和存储 → NoSQL → Firestore** → Create database →
   Production mode → pick a region close to the users (can't change
   later).
4. Firestore → 规则(Rules) tab → paste this repo's `firestore.rules`
   verbatim → Publish.
5. 齿轮图标(左侧栏顶部) → 设置 → 常规(General) → scroll to "您的应用" →
   `</>` web icon → register (any nickname, **don't** check "also set up
   Firebase Hosting" — GitHub Pages is used instead) → copy the
   `firebaseConfig` object (ignore the `npm install firebase` block
   above it, that's for a different integration style) → paste into
   `assets/firebase-config.js`'s production block.
6. Authentication → Settings tab → Authorized domains → add the site's
   subdomain (e.g. `huawen3a.ktailearn.com`) once it's live (step 6).
   Do this *after* DNS/Pages are set up, or just add it now and it'll be
   a no-op validation-wise until the domain resolves.

(If the Firebase console's left-nav layout looks unfamiliar to the user,
walk them through it screenshot-by-screenshot — it reorganizes
periodically. The gear icon's dropdown IS the project-settings menu,
even though it looks like a product-specific submenu at first glance.)

## 6. Deployment: GitHub Pages, not Hostinger FTP

**Earlier sites in this family (including this repo's first scaffold)
defaulted to an FTP-to-Hostinger GitHub Actions workflow
(`DEPLOY.md`/`deploy.yml`). Don't reuse that pattern — it failed for
every push on this account (the FTP secrets were never configured, and
this Hostinger account's current plan may not expose File
Manager/FTP at all — it looked like a Website Builder/AI Builder plan,
not classic shared hosting).** GitHub Pages is simpler and is already
proven working for yuwen4b.ktailearn.com:

1. Add a `CNAME` file at the repo root containing just the subdomain,
   e.g. `huawen3a.ktailearn.com`.
2. Repo → Settings → Pages → Build and deployment → Source: **Deploy
   from a branch** → Branch: **main**, folder **/ (root)** → Save.
3. DNS: ktailearn.com's DNS is managed on **Cloudflare**, not Hostinger
   itself (confirmed via Hostinger's own support bot when FTP access
   couldn't be found). In Cloudflare → DNS → Records → Add record:
   Type CNAME, Name `<subdomain>`, Target
   `greatloveoflearning.github.io`, **Proxy status: DNS only** (grey
   cloud, not orange — GitHub can't issue a Let's Encrypt cert for the
   custom domain through Cloudflare's proxy).
4. GitHub auto-provisions an HTTPS cert for the custom domain after DNS
   resolves — takes anywhere from a few minutes to a few hours. Settings
   → Pages will show "Enforce HTTPS" greyed out with a tooltip
   ("certificate has not yet been issued") until it's ready; nothing to
   do but wait and recheck.
5. Browser shows "your connection is not private" in the interim — this
   is just the cert not being ready yet, not a misconfiguration.

## 7. Seed the content

Same pattern as every prior site in this family: a temporary
`admin-seed-content.html` + `assets/content-seed-temp.js` (the actual
data, as a `window.CONTENT_SEED_DATA = {...}` assignment), committed,
tested against the Firebase emulator with Playwright (sign in as a test
admin, click the seed button, assert the log shows ✅ for every
document), then pushed to production. **Do not delete the seed tool
based on the user saying "done"** — ask for explicit confirmation of the
✅ output (ideally a screenshot) first; a "done" can mean "I clicked the
button" without the run having actually succeeded (e.g. rules not yet
published to production). Once confirmed, delete both files and push
that as its own commit.

Emulator testing notes:
- `firebase-config.js`'s emulator block's `projectId` must match the
  `--project` flag used to start `firebase emulators:start`, or
  Firestore reads/writes silently go to a different project namespace
  within the emulator and look like permission errors or empty data.
- Creating a signed-in admin test user for Playwright: `curl` the Auth
  emulator's `accounts:signUp` endpoint, then `curl -X PATCH` the
  Firestore emulator's REST API with header `Authorization: Bearer
  owner` (bypasses rules) to set `isAdmin: true` on that user's `users/
  {uid}` doc — **the Firestore REST calls must use the same project ID**
  as above, not the auto-detected `demo-no-project`/whatever default the
  CLI picked.
- Kill any previously-running `firebase emulators:start` + its orphaned
  `java` subprocess before starting a new one for a different project —
  port conflicts otherwise silently fail the new emulator.

## 8. Anti-scraping / content-protection measures (if the user asks)

Any rendered web page can technically be scraped by a signed-in user via
browser devtools, regardless of hosting choice — no front-end
architecture fully prevents this. Two measures that are worth doing and
were added to this repo:

1. **Copyright footer notice** — cheap, and gives a basis to act if
   content does turn up copied elsewhere.
2. **Per-lesson lazy Firestore loading** instead of one `vocabData/list`
   doc with every lesson's words that gets fully fetched the instant
   anyone signs in. Splits `vocabData` into one doc per lesson
   (`vocabData/{lessonNumber}`), and the client only fetches a lesson's
   words when that lesson is actually selected (flashcards/match/
   practice dropdowns), via `window.vocabLoader.ensureLesson(n)` /
   `ensureAllLessons()`. This doesn't stop someone who deliberately picks
   "All lessons" — it just removes the automatic full-dump that
   currently happens within a second of any sign-in regardless of
   intent. See this repo's `assets/vocab-loader.js` for the
   implementation once it's done here.

The repo also has to be **public** for GitHub Pages' free tier, which
means git history (including the temporary seed-data commits before
they're deleted) is permanently browsable by anyone who digs for it.
The real fix if this matters to the user is **GitHub Pro** (~$4/mo) on
the `greatloveoflearning` account, then Settings → Danger Zone → Change
visibility → Make private — GitHub Pages still serves the site publicly
from a private repo on a paid plan, only the source/history stops being
browsable.

## 9. Known gaps to double-check when adapting a scaffold

- `assets/vocab-loader.js` existing and actually wired into
  `index.html`'s script tags *and* called from `app.js`'s init (`if
  (window.onVocabDataChange) window.onVocabDataChange(rebuildFromVocabData);`).
  This file was missing entirely in this repo's first scaffold — nobody
  noticed until flashcards/match/practice turned out to render with zero
  cards once a real vocabData collection existed in Firestore. Check for
  it explicitly, don't assume it got copied.
- Cache-busting `?v=N` query strings on every `<script src>` in
  `index.html` — bump them whenever that file changes, or the browser
  may keep serving a stale cached copy after deploy.

## 10. Typing Test toolbar: shared controls must not get their own div

If the Typing Test gains multiple submodes (article / HSK / supplement),
each with its own `.typing-toolbar` div toggled by `setMode()`, do not
put mode-agnostic controls ("Hide all Pinyin", the correct-count chip)
in a 4th standalone toolbar div after the three. A visible sibling div
is still its own block-level row, so it always renders as an unwanted
separate line below whichever mode's controls are actually showing.

Fix: keep that markup (same ids) inside the default mode's toolbar in
the HTML, then in `setMode()`, `appendChild` the two elements into
whichever toolbar div is becoming active, alongside the `hidden`
toggling — this reparents the real DOM nodes (no id duplication) so
they flow inline with that mode's other controls via normal
`flex-wrap`. This repo currently has only one typing submode, so its
toolbar is a single div and this doesn't apply — but check again if a
second submode is ever added here.
