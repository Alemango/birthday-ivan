# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static website (vanilla HTML/CSS/JS, no frameworks, no build tools) meant to
be the content behind an NFC tag embedded in a birthday gift figure. Opening
it on a phone shows a full-bleed, reels-style vertical experience that
displays a random memory (photo, video, or carousel) on each load or on tap
of a "next memory" button. The full product spec (design decisions, required
behavior) lives in `prompts/birth_page.md` — treat it as the source of truth
for *why* things are built the way they are.

The site has zero dependencies and zero backend. It's meant to be opened
directly via `index.html` or hosted on any static host (GitHub Pages,
Netlify, Vercel) with no build step.

## Commands

There is no build, lint, or test tooling. To run it locally:

```sh
python3 -m http.server 8000
```

then open `http://localhost:8000` (use a phone on the same Wi-Fi, or a
browser's mobile/responsive emulation with touch simulation, since the core
interactions — swipe, scratch-card drag — are touch-first).

To sanity-check JS syntax without a full test suite:

```sh
node --check js/app.js && node --check js/data.js && node --check js/config.js
```

There is no automated test suite in the repo. When verifying behavior,
drive it in an actual browser (real or headless via Playwright/chromium-cli)
rather than just reading the code — the scratch-card reveal, carousel swipe,
and randomization logic are only meaningfully verified by interacting with
the DOM.

## Architecture

Three JS files, split by editability:

- **`js/config.js`** and **`js/data.js`** — the *only* files meant to be
  edited to customize content. No build step re-reads them; they're plain
  `<script>` tags that set globals (`window.MEMORIES`, `window.FIRST_VISIT`,
  `window.SOCIAL_LINKS`, `window.GENERIC_CAPTIONS`, `window.WRAPPER`,
  `window.SITE_TEXT`). Loaded before `app.js` in `index.html`. No ES modules
  are used anywhere, deliberately — the site must work over `file://` and on
  any static host without a bundler.
- **`js/app.js`** — all logic, wrapped in an IIFE. Should not need to change
  when someone is just adding content; changes here are for behavior, not
  data.

### Content model (`js/data.js`)

Every memory is one "unit" of one of three types: `photo`, `video`, or
`carousel` (a fixed list of 2+ photo/video items that always appear and
shuffle together — they never get split up in the random pool). Two separate
collections exist:

- `window.MEMORIES` — the general random pool.
- `window.FIRST_VISIT` — shown once, under the scratch-card overlay, on a
  browser's first visit. Not part of the random pool. If it has more than
  one entry, `app.js` wraps it into a synthetic `carousel` unit at render
  time so it reuses the same swipeable carousel UI.

`fillContainer()` in `app.js` is the shared renderer for a single photo/video
item — used both for a top-level slide and for each item inside a carousel.
Rule to preserve: **videos never get a meme caption overlay**; only photos
do (from `fixedCaptions` on the entry, falling back to the shared
`GENERIC_CAPTIONS` pool in `config.js`).

### State and persistence

All state is `localStorage`, scoped per-browser/device (not global) —
important because every phone that taps the NFC tag has independent state:

- `biv_visited_v1` — whether this browser has completed (or started) the
  first-visit scratch-card flow. Set immediately when the first-visit flow
  *begins*, not when it finishes, so a mid-scratch reload doesn't force the
  user to redo it.
- `biv_lastIndex_v1` — index of the last shown `MEMORIES` unit, used to
  avoid picking the same one twice in a row (`pickRandomIndex()`).
- `biv_count_v1` — persistent counter for the "RECUERDO N.º 00X" plate,
  incremented on every unit shown (first-visit content, initial random load,
  and every reshuffle-button tap).

### First-visit scratch card (`initWrapper()` in `app.js`)

Canvas-based scratch-off effect using `globalCompositeOperation =
'destination-out'` driven by Pointer Events (covers touch, mouse, and pen
uniformly — used consistently for both the scratch card and the carousel
swipe instead of mixing in separate touch/mouse listeners). Canvas internal
resolution is capped (`maxDim` in `sizeCanvas()`) independent of device
pixel ratio, because erased-area percentage is computed by periodically
sampling `getImageData()` — an uncapped high-DPI canvas would make that scan
expensive. Once the sampled erased fraction crosses `WRAPPER.revealThreshold`
(from `config.js`), the rest fades out automatically. Under
`prefers-reduced-motion`, the auto-fade is skipped and an explicit "Revelar
recuerdo" button (`#wrapper-tap-btn`, shown via a `.reduced-motion` class
added to `#app`) does an instant reveal instead.

### Carousel and native drag

The carousel (`buildCarousel()`) implements its own swipe via Pointer Events
rather than relying on scroll-snap, so it can track drag delta and animate a
`translateX` on `.carousel-track`. `<img>` elements are draggable by default
in browsers, which silently swallows subsequent `pointermove`/`pointerup`
events once a native image drag starts — every `<img>` created in
`fillContainer()` must keep `draggable = false`, and the CSS
`-webkit-user-drag: none` / `user-select: none` / `-webkit-touch-callout:
none` rules on `.slide img/video` and `.carousel-item img/video` must stay in
place. Breaking either of these silently breaks swipe with no console error.

### Media and placeholders

`/media/placeholders/` holds SVG/mp4/m4a placeholders (the mp4/jpg/m4a were
generated with `ffmpeg`) referenced by the default `data.js`/`config.js`, so
the site works out of the box before anyone drops in real content. Real
content is meant to go in sibling folders (`media/photos`, `media/videos`,
`media/audio`, `media/carousel`) per the layout documented in `README.md`;
nothing in `app.js` assumes a particular folder name beyond what `src` paths
in `data.js` point to.

### Landscape-photo handling (`app.js` + `styles.css` together)

On each `<img>`'s `load` event, `fillContainer()` measures `naturalWidth >
naturalHeight * 1.1` and, if landscape, adds an `.is-landscape` class to the
container plus two children: a `.media-bg` blurred backdrop (a `div` with
the same image as a CSS `background-image`, for fill behind the letterboxed
photo) and a `.rotate-hint` prompt telling the user to rotate their phone.
`styles.css` then keys off `@media (orientation: landscape)` to swap that
container's `object-fit` from `cover` to `contain`. So the class is applied
by JS on image load, but the actual fit swap only happens once the device is
physically rotated, and is pure CSS. Changing one side without the other
breaks the effect silently (no console error — the class is present and
correct, the visual just never changes).

### Shared single `<audio>` element

There is exactly one `<audio id="memory-audio">` in `index.html`, reused by
every photo that declares an `audio` field — not one `<audio>` per photo.
`buildAudioButton()` swaps its `src` only when the element's `data-src`
attribute differs from the requested one, and a module-level
`currentAudioBtn` variable enforces that at most one play button is ever in
the "playing" state at a time; `renderUnit()` pauses the element and clears
that variable on every unit change (reshuffle, carousel navigation doesn't
trigger this — only a full unit swap does). Playback is always
gesture-initiated (a tap on the play button); never wire up autoplay here.

### Gotchas

- `SITE_TEXT.plateLabel` (in `config.js`) is currently **not read anywhere**
  — `app.js` only consumes `SITE_TEXT.plateNumberPad`. The visible plate
  text ("RECUERDO N.º") is hardcoded in `index.html`. This is the one place
  the "just edit `config.js`" content model silently doesn't hold; changing
  the plate label requires editing `index.html` directly.
- `SOCIAL_LINKS[].icon` values must match a key in the `ICONS` map in
  `app.js` (`instagram`, `spotify`, `whatsapp`, `tiktok`, `youtube`, `x`).
  An unrecognized icon name doesn't error — it silently falls back to a
  generic link glyph.

## Content ingestion via CSV

`plantilla-contenido.csv` (repo root) is an alternative to hand-editing
`js/data.js`: the user fills one row per media file, and `README.md`
documents this as a workflow where **Claude Code is the executor** — the
user fills the CSV, tells Claude it's ready, and Claude converts the rows
into `js/data.js` entries. Columns:

| Column | Meaning |
|---|---|
| `pool` | `MEMORIES` or `FIRST_VISIT` |
| `type` | `photo` or `video` |
| `carousel_group` | Rows sharing a non-empty value collapse into one `carousel` unit, in CSV row order; empty = standalone entry |
| `file` | Path under `media/` |
| `alt` | Photos only |
| `captions` | Pipe-separated (`FRASE UNO\|FRASE DOS`) → maps to `fixedCaptions`; photos only |
| `audio` | Photos only |
| `poster` | Videos only |

`fillContainer()` ignores columns that don't apply to a row's `type` (e.g.
`captions` on a video row), consistent with "videos never get a caption."
Before generating entries: verify every `file` path actually exists under
`media/`, and flag filenames with spaces/parens for renaming first
(precedent: `media/videos/recuerdo1.mp4` was renamed from a name with
spaces). The CSV ships with example rows meant to be overwritten, not
appended to.

## Editing content vs. editing behavior

If a task is "add/change a photo, video, caption, social link, or the
wrapper image" — only touch `js/data.js` and/or `js/config.js`, per
`README.md`'s documented content model. If a task changes *how* things
render or behave, that's `js/app.js` and/or `css/styles.css`. Keep this
separation; it's the whole point of the two-file content model.

All UI copy, `alt` text, `aria-label`s, and code comments in this repo are
in Spanish (`<html lang="es">`). Match that for any new strings or comments.
