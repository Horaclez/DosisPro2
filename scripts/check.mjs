// Prueba rápida (sin navegador): dibuja todas las pantallas y fármacos con React y verifica datos y valores por defecto.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = path.join(root, '.check');
fs.mkdirSync(tmp, { recursive: true });
await esbuild.build({ entryPoints: [path.join(root, 'src/test-api.js')], bundle: true, format: 'cjs', platform: 'node', outfile: path.join(tmp, 'api.cjs'), external: ['react', 'react-dom'], logLevel: 'error' });

globalThis.localStorage = { getItem: () => null, setItem() {} };
globalThis.window = { matchMedia: () => ({ matches: false }) };
globalThis.document = { documentElement: { classList: { toggle() {} }, dataset: {} } };
const req = createRequire(import.meta.url);
const React = req('react');
const { renderToStaticMarkup } = req('react-dom/server');
const A = req(path.join(tmp, 'api.cjs'));

const S = { log: [], bic: [], sched: [] }, up = () => {};
const problems = [];
let rendered = 0;
const render = (label, type, props) => {
  try {
    const s = renderToStaticMarkup(React.createElement(type, props));
    rendered++;
    if (/\[object Object\]|undefined|NaN|Infinity/.test(s)) problems.push(`${label}: texto anómalo (${s.match(/\[object Object\]|undefined|NaN|Infinity/)[0]})`);
    return s;
  } catch (e) { problems.push(`${label}: EXCEPCIÓN ${e.message}`); return ''; }
};

// Datos
const dup = (arr, key) => arr.map(x => x[key]).filter((v, i, a) => a.indexOf(v) !== i);
if (dup(A.D, 'n').length) problems.push('Fármacos duplicados: ' + dup(A.D, 'n'));
if (dup(A.BP, 'n').length) problems.push('Presets BIC duplicados: ' + dup(A.BP, 'n'));
Object.keys(A.MD).forEach(k => { if (!A.D.some(d => d.n === k)) problems.push('MD sin fármaco: ' + k); });
A.D.forEach(d => ['n', 'fam', 'p', 'u', 'lim', 'd', 'al'].forEach(k => { if (d[k] == null) problems.push(`${d.n}: falta ${k}`); }));
A.D.forEach(d => { if (!A.FAMS.includes(d.fam)) problems.push(`${d.n}: familia desconocida ${d.fam}`); });

// Cada fármaco, vía y valores por defecto: no debe haber alertas con los valores precargados
A.D.forEach(d => ['VVP', 'CVC', 'IM', 'SC'].forEach(r => {
  const s = render(`Calc ${d.n} [${r}]`, A.Calc, { d, r, kg: '70', S, up });
  if (r === 'VVP' && !/class="banner ok"/.test(s)) problems.push(`${d.n}: alerta con valores por defecto`);
}));
A.BP.forEach(p => { const s = render(`BIC ${p.n}`, A.BicCalc, { p, kg: '70', S, up }); if (!/class="banner ok"/.test(s)) problems.push(`BIC ${p.n}: alerta con valores por defecto`); });
A.PD.forEach(p => { const s = render(`Pediatría ${p.n}`, A.PedCalc, { p, kg: '20' }); if (!/class="banner ok"/.test(s)) problems.push(`Pediatría ${p.n}: alerta con valores por defecto`); });
A.TABS.forEach(([name, , C]) => render(`Pestaña ${name}`, C, { kg: '70', S, up }));
render('App', A.App, {});
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`Pantallas dibujadas: ${rendered} | fármacos: ${A.D.length} | presets BIC: ${A.BP.length} | pediatría: ${A.PD.length}`);
if (problems.length) { console.error('PROBLEMAS (' + problems.length + '):\n' + problems.join('\n')); process.exit(1); }
console.log('OK: sin problemas');
