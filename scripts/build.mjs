// Genera www/index.html: un único archivo con CSS (Tailwind compilado) y JS (React incluido). Funciona 100% sin Internet.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';
import * as esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const req = createRequire(path.join(root, 'package.json'));
const pkgDir = name => { let p = path.dirname(req.resolve(name)); while (!fs.existsSync(path.join(p, 'package.json'))) p = path.dirname(p); return p; };
const twDir = pkgDir('tailwindcss');

const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const sources = walk(path.join(root, 'src')).filter(f => /\.(js|html)$/.test(f)).map(f => fs.readFileSync(f, 'utf8')).join('\n');
const candidates = [...new Set(sources.split(/[\s"'`<>=${}(),;\\|&!?+*]+/).filter(Boolean))];

const compiler = await compile(fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8'), {
  base: root,
  loadStylesheet: async (id, base) => {
    const p = id === 'tailwindcss' ? path.join(twDir, 'index.css') : path.resolve(base, id);
    return { path: p, base: path.dirname(p), content: fs.readFileSync(p, 'utf8') };
  },
});
const css = compiler.build(candidates);

const js = (await esbuild.build({
  entryPoints: [path.join(root, 'src/main.js')], bundle: true, minify: true, format: 'iife', write: false,
  legalComments: 'none', target: 'es2020', define: { 'process.env.NODE_ENV': '"production"' },
})).outputFiles[0].text;

const out = path.join(root, 'www');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(path.join(root, 'public'))) fs.copyFileSync(path.join(root, 'public', f), path.join(out, f));
const html = fs.readFileSync(path.join(root, 'src/index.html'), 'utf8')
  .replace('<!--CSS-->', () => '<style>' + css.replace(/<\/style/gi, '<\\/style') + '</style>')
  .replace('<!--JS-->', () => '<script>' + js.replace(/<\/script/gi, '<\\/script') + '</script>');
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`www/index.html listo: ${(html.length / 1024).toFixed(0)} KB (CSS ${(css.length / 1024).toFixed(0)} KB, JS ${(js.length / 1024).toFixed(0)} KB)`);
