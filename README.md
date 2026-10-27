# Skeleton Framework

A lightweight, responsive CSS framework for mobile-friendly web development. Skeleton Framework takes its roots from [dhg/Skeleton](https://github.com/dhg/Skeleton) and builds upon its core principles with modern CSS variables, responsive grids, and an ultra-fast build pipeline.

---

## Features

- **Lightweight & Modular**: Structured CSS modules for grid, typography, buttons, forms, lists, tables, and utility classes.
- **Modern CSS Custom Properties**: Dynamic theming with CSS variables while maintaining backwards-compatible fallbacks.
- **Blazing Fast Pipeline**: Modern PostCSS 8 + native esbuild engine compiling in ~100ms with ~15ms incremental watch rebuilds.
- **Zero Vulnerabilities**: Clean, audited toolchain with zero security advisories.

---

## Getting Started

### Installation

Install the package into your project:

```bash
npm install --save-dev skeleton-framework
```

Or clone the development repository:

```bash
git clone https://github.com/skeleton-framework/skeleton-framework.git
cd skeleton-framework
npm install
```

### Pre-built Files

Pre-compiled production bundles are available directly in the `dist/` directory:

- `dist/skeleton.css` — Full stylesheet with comments and source formatting
- `dist/skeleton.min.css` — Minified production stylesheet
- `dist/index.html` — Interactive component showcase and demo page

---

## Development

Run development commands using npm:

| Command | Description |
| :--- | :--- |
| `npm start` | Launches the in-memory file watcher and Vite dev server concurrently |
| `npm run build` | Compiles `src/skeleton.css` to `dist/skeleton.css` and `dist/skeleton.min.css` |
| `npm run watch` | Runs the persistent in-memory watcher for instant (~15ms) rebuilds on edit |
| `npm run serve` | Serves `dist/` locally with Vite at `http://localhost:3000` with live reloading |

---

## Demo

Open [dist/index.html](dist/index.html) in your browser or run `npm run serve` to preview all grid columns, typography styles, buttons, and form elements.

---

## Contributing & Support

- **Bug Reports & Requests**: Submit issues on the [GitHub Issue Tracker](https://github.com/skeleton-framework/skeleton-framework/issues).
- **License**: MIT
