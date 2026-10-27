/*jslint node: true */
'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssCalc = require('postcss-calc');
const autoprefixer = require('autoprefixer');
const esbuild = require('esbuild');
const pkg = require('./package.json');

const date = new Date();
const banner = `/*! ${pkg.name} | ${pkg.version} | ${pkg.license} | ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} */\n`;

// Pre-initialize PostCSS processor once in memory
const processor = postcss([
  postcssImport(),
  postcssCustomProperties({ preserve: true }),
  postcssCalc({ precision: 10 }),
  autoprefixer()
]);

async function build(input = 'src/skeleton.css', output = 'dist/skeleton.css', min = 'dist/skeleton.min.css') {
  const start = performance.now();
  const inputPath = path.resolve(__dirname, input);
  const outputPath = path.resolve(__dirname, output);
  const minPath = path.resolve(__dirname, min);

  const src = fs.readFileSync(inputPath, 'utf8');

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(minPath), { recursive: true });

  const result = await processor.process(src, {
    from: inputPath,
    to: outputPath
  });

  fs.writeFileSync(outputPath, banner + result.css);

  // Fast native minification via esbuild (sub-millisecond)
  const minified = esbuild.transformSync(result.css, {
    loader: 'css',
    minify: true
  }).code;

  fs.writeFileSync(minPath, banner + minified);

  const duration = (performance.now() - start).toFixed(1);
  console.log(`[build] Completed in ${duration}ms (${output}, ${min})`);
}

function startWatch() {
  console.log('[watch] Persistent in-memory watcher active on src/ (press Ctrl+C to stop)');
  let timeout = null;
  fs.watch(path.resolve(__dirname, 'src'), { recursive: true }, (event, filename) => {
    if (!filename || !filename.endsWith('.css')) return;
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        await build();
      } catch (err) {
        console.error('[build error]', err.message);
      }
    }, 25);
  });
}

if (require.main === module) {
  const isWatch = process.argv.includes('--watch');
  build()
    .then(() => {
      if (isWatch) startWatch();
    })
    .catch(err => {
      console.error('Build failed:', err);
      process.exit(1);
    });
}

module.exports = build;
