# AGENTS.md — Skeleton Framework

## Project Overview

**Skeleton Framework** (`skeleton-framework`) is a lightweight, responsive CSS framework for mobile-friendly web development. It modernizes the classic Skeleton CSS boilerplate with:
- Modular CSS source files under `src/core/`
- Dynamic theming via `:root` CSS Custom Properties (`src/core/_root.css`) with compiled static fallbacks
- A fast Node.js build pipeline (`index.js`) powered by **PostCSS 8** and **esbuild** (~100ms full build, ~15ms incremental watch rebuilds)
- Zero-vulnerability dependencies and strict security/accessibility defaults

---

## Commands & Workflow

Package managers supported: `pnpm` (preferred, `pnpm-lock.yaml` present) or `npm`.

| Task | Command | Description |
| :--- | :--- | :--- |
| **Build CSS** | `npm run build` (or `node index.js`) | Compiles `src/skeleton.css` into `dist/skeleton.css` and `dist/skeleton.min.css` |
| **Watch CSS** | `npm run watch` (or `node index.js --watch`) | Runs persistent in-memory watcher on `src/` for instant rebuilds |
| **Dev Server** | `npm run serve` | Serves the project locally with Vite (`vite --open`) |
| **Start Dev** | `npm start` | Runs `watch` and `serve` concurrently |
| **Security Audit** | `npm run security:audit` | Audits dependencies at `--audit-level=high` |

---

## Repository Structure & Architecture

```text
.
├── index.js                # PostCSS 8 + esbuild build & watch script (exports build())
├── index.html              # Starter HTML boilerplate (CSP-hardened)
├── src/
│   ├── skeleton.css        # Main CSS entry point (@import order matters)
│   └── core/
│       ├── _root.css       # All :root CSS Custom Properties (design tokens)
│       ├── _base.css       # border-box reset, html & body defaults
│       ├── _grid.css       # 12-column responsive grid (.container, .row, columns, offsets)
│       ├── _typography.css # h1-h6 scale, links, .text-{primary,success,danger}
│       ├── _buttons.css    # .button variants (primary, success, danger) & :focus-visible
│       ├── _forms.css      # Inputs, selects, textareas, .has-{error,success}
│       ├── _lists.css      # ul, ol, nested lists, .list-inline
│       ├── _cards.css      # .card and interactive a.card styles
│       ├── _code.css       # Inline code and pre > code blocks
│       ├── _alerts.css     # .alert and .alert-{primary,success,danger}
│       ├── _tables.css     # Base tables and .table-responsive wrapper
│       ├── _spacing.css    # Vertical rhythm margins for block/interactive elements
│       ├── _utils.css      # Utility classes (.u-full-width, .u-pull-*, .u-text-*, .u-hide, etc.)
│       ├── _misc.css       # hr and clearfix rules
│       └── _queries.css    # Reference breakpoint media query blocks
└── dist/
    ├── skeleton.css        # Compiled stylesheet with banner & fallback properties
    ├── skeleton.min.css    # Minified production stylesheet (via esbuild)
    └── index.html          # Interactive component showcase & demo page
```

### Build Pipeline (`index.js`)
The PostCSS processor is pre-initialized in memory with four plugins in strict order:
1. `postcss-import` — Inlines `@import "core/_*.css"` from `src/skeleton.css`
2. `postcss-custom-properties({ preserve: true })` — Generates static fallback declarations alongside `var(--*)` custom properties
3. `postcss-calc({ precision: 10 })` — Pre-evaluates static `calc()` expressions where possible
4. `autoprefixer` — Adds vendor prefixes

Minification uses `esbuild.transformSync(result.css, { loader: 'css', minify: true })`.

### Responsive Breakpoints
- **Extra Small (`xs-*`)**: `< 560px` (mobile-first base)
- **Small / Phablet (default column names & `sm-*`)**: `>= 560px` (grid activates for standard `.one`..`.twelve` columns)
- **Medium / Tablet (`md-*`)**: `>= 720px`
- **Large / Desktop (`lg-*`)**: `>= 960px`
- **Desktop HD**: `>= 1200px` (`--max-width: 1200px`)

---

## Coding Conventions & Guardrails

1. **Source of Truth**:
   - **Never** edit `dist/skeleton.css` or `dist/skeleton.min.css` by hand.
   - Always make style changes in `src/core/_*.css` (or `src/skeleton.css` when adding a new module) and run `npm run build` to verify compilation.
2. **Design Tokens (`_root.css`)**:
   - Place all new themeable colors, borders, spacing, or sizing tokens in `src/core/_root.css` under `:root`.
   - Reference tokens with `var(--token-name)` inside module files so `postcss-custom-properties` can compute fallback values automatically.
3. **Accessibility (`:focus-visible`)**:
   - **Never** add unconstrained `outline: 0` or `outline: none` to buttons, links, or form controls.
   - Interactive elements must retain WCAG-compliant `:focus-visible` outlines (`outline: 2px solid var(--primary-color, #1EAEDB)`).
4. **Security & HTML Templates (`index.html`, `dist/index.html`)**:
   - Preserve the `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy` meta tags.
   - Always use explicit `https://` URLs for external resources (never protocol-relative `//` or `http://`).
   - Always include `rel="noopener noreferrer"` on external `<a target="_blank">` or external documentation links.
5. **Verification Before Finishing**:
   - Run `npm run build` and ensure it exits cleanly with updated output in `dist/skeleton.css` and `dist/skeleton.min.css`.
   - When adding or updating dependencies, run `npm run security:audit` to ensure zero high/critical advisories.

<!-- trail:start -->
## Trail — repo context graph

This repo is indexed in `.trail/cache/`: small linked markdown nodes that explain each
system and carry exact file:line spans, kept in sync with the code through git.

For ANY task here — understanding how something works, finding where code lives,
or scoping a change — get context from the graph before grepping or opening
source files. Re-ask freely (it's cheap) and reuse literal identifiers you
already have (symbol, error string, file name) as the query. New to this repo?
Run `trail map` first — a token-budgeted orientation (dir clusters, hubs,
hotspots), no LLM, no key.

- Run `trail ask "<your question>" --source` → ranked nodes with the relevant
  code spans inlined (each hit's ≤8-line crux by default; `--full` for whole
  definitions when the crux isn't enough). Match the tool to the task shape:
  for understanding or editing, the top node IS the answer — cite its
  `covers:` file:line spans and edit straight from `--source`. For
  exhaustive tasks ("every occurrence / every caller of this pattern"), ranked
  results are top-N, not complete — run `trail grep "<literal>"` instead
  (exhaustive over indexed files, grouped by enclosing symbol), falling back
  to raw `grep -rn` only for unindexed files.
- `trail skeleton <file>` → every definition's signature + span, ~10× cheaper
  than reading the file; use it to skim an API surface.
- `trail callers <symbol>` gives precomputed, exact edges — who calls this.
  Add `--direction out` for what it calls, or `--depth N` to walk
  transitively for the full blast radius. For structural questions, skip
  ranking and use this directly.
- Or browse: `.trail/cache/INDEX.md` lists every node; follow the links.
- Monorepos and folders of multiple repos rank fairly across sub-projects —
  hits carry `[scope/]` labels naming which one they're from. Narrow with
  `trail ask "<task>" --in <scope>/` once you know where you're working.

If a returned span is truncated ("+N more lines"), open the file at that exact
range before finalizing. Only open source files when a node genuinely lacks a
needed detail, and then at the exact file:line the node points to — never
re-read whole files.

After big code changes, refresh the graph with `trail build` (deterministic,
no API key, $0).
<!-- trail:end -->
