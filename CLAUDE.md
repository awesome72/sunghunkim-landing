# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal profile site for Sung Hun Kim, Ph.D. (Lead Scientist, SABIC Asia-Pacific) in Korean, English and
Simplified Chinese. Plain static HTML/CSS/JS served by GitHub Pages — no framework, package manager or tests.

- Repo: `awesome72/sunghunkim-landing`, Pages legacy build from branch `main`, path `/`
- Live: https://awesome72.github.io/sunghunkim-landing/ (`/ko/`, `/en/`, `/zh/`)

## Commands

- Build: `python build.py` — Python 3.11+, standard library only (`tomllib`). Regenerates `ko/index.html`,
  `en/index.html`, `zh/index.html` and the root `index.html`.
- Preview: `python -m http.server 8000`, then open http://localhost:8000/. Serve over HTTP, not `file://` —
  the root router redirects to relative folders that `file://` can't resolve to `index.html`.
- Deploy: commit, then `git push origin main`. Pages rebuilds in under a minute; check with
  `gh api repos/awesome72/sunghunkim-landing/pages/builds/latest --jq .status` (wait for `built`).
- Phone-width checks: headless Chrome won't size a window below ~500px, so `--window-size=390,...` silently
  renders a wider layout. Load the page inside a 390px-wide `<iframe>` instead.

## Architecture

- **All HTML is generated — don't edit it by hand.** Change `content/*.toml` or the template in `build.py`, re-run
  the build, and commit source and output together. There is no CI build; Pages serves the committed files.
- `content/<lang>.toml` holds every string for one language; `content/shared.toml` holds data that is the same in
  all languages (contact details, patents, publications, `site_url`). The three language files must keep the same
  keys and the same number and order of items.
- The pages must stay structurally identical: switching language preserves the reader's place by carrying the
  current section id (`#profile`, `#expertise`, `#career`, `#education`, `#research`, `#contact`) to the other
  language's URL.
- Text markup in TOML strings, implemented by `fmt()` in `build.py`: `*emphasis*`, `T_{g}` for subscript,
  `{ko:김성헌}` for a phrase in another language (becomes `<span lang="ko">`). Everything else is HTML-escaped,
  so write a plain `&`, never `&amp;`.
- Root `index.html` is a language router: it uses the visitor's saved choice (localStorage key
  `sunghunkim-landing:lang`, written when they use the language menu), otherwise the browser language, otherwise
  English, and redirects keeping the URL hash. The storage key is defined in both `build.py` and
  `assets/site.js`; keep them identical.
- `assets/site.css` and `assets/site.js` are hand-written and shared by all languages. `site.js` handles the
  section highlight in the nav, rewrites language-menu links to include the current section, closes the
  `<details>` language menu, and runs the copy-email button (its labels come from per-language `data-*`
  attributes).
- Adding a language: add its code to `LANG_ORDER` in `build.py` (the router picks it up automatically), create
  `content/<code>.toml` modeled on an existing file, and add typography rules in `site.css` if the script needs
  them (see `html:lang(zh)`).

## Design constraints

- Dark-only navy theme; tokens at the top of `site.css` (`--bg #0B1420`, accent `#4C8DFF`). Pretendard loads from
  jsDelivr. The Chinese page adds Noto Sans SC and needs `word-break: normal`, because the body uses `keep-all`
  for Korean line breaking, which would stop Chinese text from wrapping.
- Below 960px the header becomes two rows (`--nav-h: 104px`) with a swipeable section bar; the hero shows the
  portrait first. `--nav-h` also drives `scroll-padding-top`, so anchors clear the sticky header.
- Tone is formal and professional in every language (Korean in 합니다체).
- `assets/portrait.jpg` is a cropped, cool-toned black-and-white version of the local `x.png`.

## Content and privacy rules

- `Resume_Sung Hun Kim-updated(20230216).doc` and `x.png` are gitignored on purpose. The resume lists referees'
  personal phone numbers and emails; never commit it or copy referee details into the site. Read it with
  `antiword` if needed.
- Every profile fact comes from that resume, dated February 2023. The owner has not re-confirmed current role and
  tenure ("2016 – present", "13+ years").
- Patents are 5 granted + 1 PCT application; never describe all six as granted.
- The owner's Chinese-character name is 金成憲 (confirmed by the owner). It is the primary name on the Chinese
  page and appears beside 김성헌 on the Korean page, always in exactly that form — keep 憲 even though Simplified
  Chinese would normally write 宪.
- Patent and publication titles stay in their official English form in every language.
