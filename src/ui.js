import { html, useState } from './react.js';
import { f, ok } from './util.js';
import { judge } from './metrics.js';

export const BTN = 'btn';
export const INP = 'inp';

const ICONS = {
  cross: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  pill: '<path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 7-7l7 7a4.95 4.95 0 0 1-7 7Z"/><path d="m8.5 8.5 7 7"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  flask: '<path d="M10 2v7.5L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/>',
  palette: '<circle cx="13.5" cy="6.5" r=".6"/><circle cx="17.5" cy="10.5" r=".6"/><circle cx="8.5" cy="7.5" r=".6"/><circle cx="6.5" cy="12.5" r=".6"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.6-.7 1.6-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1a1.6 1.6 0 0 1 1.7-1.7H16c3 0 5.5-2.5 5.5-5.5C22 6 17.5 2 12 2z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
};

export const Icon = ({ name, size = 20 }) =>
  html`<svg class='ico' width=${size} height=${size} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth=${2} strokeLinecap='round' strokeLinejoin='round' dangerouslySetInnerHTML=${{ __html: ICONS[name] || '' }}></svg>`;

export const Card = ({ c, children }) => html`<div class=${'card ' + (c || '')}>${children}</div>`;
export const Banner = ({ kind, children }) => html`<div class=${'banner ' + kind}>${children}</div>`;

/** Grupo de botones de selección única. opts: valores o pares [valor, etiqueta]. */
export const Tog = ({ v, set, opts }) => html`<div class='tog' style=${{ gridTemplateColumns: `repeat(${opts.length}, 1fr)` }}>${opts.map(o => {
  const [val, label] = Array.isArray(o) ? o : [o, o];
  return html`<button key=${val} onClick=${() => set(val)} class=${'tog-b' + (v === val ? ' on' : '')}>${label}</button>`;
})}</div>`;

export const SEL = (v, set, o) => html`<select value=${v} onChange=${e => set(e.target.value)} class=${INP}>${o.map(x => html`<option key=${x}>${x}</option>`)}</select>`;

export const Fld = ({ l, v, set, u }) => html`<label class='fld'><span class='lbl'>${l}</span><div class=${'fld-row' + (u ? ' has-u' : '')}><input type='number' inputmode='decimal' step='any' value=${v} onChange=${e => set(e.target.value)} class='inp num'/>${u && html`<span class='unit'>${u}</span>`}</div></label>`;

export const Al = ({ l }) => (l && l.length ? html`<ul class='notes'>${l.map((x, i) => html`<li key=${i}>⚠ ${x}</li>`)}</ul>` : null);

export const Au = ({ l }) => html`<details open class='card audit'><summary>Auditoría matemática</summary><ol>${l.map((x, i) => html`<li key=${i}>${x}</li>`)}</ol></details>`;

export const Res = ({ l }) => html`<div class='tiles'>${l.map(([t, v, u], i) => html`<div key=${i} class='tile'><div class='t-l'>${t}</div><div class='t-v'>${f(v)}</div><div class='t-u'>${u}</div></div>`)}</div>`;

const C10 = ['Paciente correcto', 'Medicamento correcto', 'Dosis correcta', 'Vía correcta', 'Hora correcta', 'Documentación correcta', 'Motivo (indicación) correcto', 'Alergias verificadas', 'Dilución / forma correcta', 'Respuesta y educación al paciente'];
export function Chk() {
  const [c, sc] = useState([]);
  const toggle = i => sc(c.includes(i) ? c.filter(y => y !== i) : [...c, i]);
  return html`<details class='card audit'><summary>Checklist de los 10 correctos (${c.length}/10)</summary><div class='checks'>${C10.map((x, i) => html`<label key=${i}><input type='checkbox' checked=${c.includes(i)} onChange=${() => toggle(i)}/>${x}</label>`)}</div>${c.length === 10 && html`<div class='all-ok'>✔ Listo para administrar</div>`}</details>`;
}

const Gauge = ({ m, j: [s, d] }) => {
  const mx = ok(m.hi) ? m.hi * 1.5 : m.lo * 3;
  const p = x => Math.min(100, Math.max(0, (x / mx) * 100));
  const a = ok(m.lo) ? p(m.lo) : 0;
  const b = ok(m.hi) ? p(m.hi) : 100;
  return html`<div class=${'card gauge ' + s}>
<div class='g-head'><b>${m.t}</b><b class=${'g-val ' + s}>${f(m.v)} ${m.u}</b></div>
<div class='bar'><i class=${'seg ' + (m.lc === 'crit' ? 'crit' : 'low')} style=${{ width: a + '%' }}></i><i class='seg ok' style=${{ width: b - a + '%' }}></i><i class=${'seg ' + (m.hc === 'warn' ? 'warn' : 'crit')} style=${{ width: 100 - b + '%' }}></i><span class='pin' style=${{ left: p(m.v) + '%' }}></span></div>
<div class='g-lim'><span>mín ${ok(m.lo) ? f(m.lo) : '—'}</span><span>máx ${ok(m.hi) ? f(m.hi) : '—'}</span></div>
${s !== 'ok' && html`<div class=${'g-msg ' + s}>${d === 'low' ? m.lm : m.hm}</div>`}</div>`;
};

const VERDICT = {
  crit: '⛔ ALERTA CRÍTICA: fuera de la ventana segura. No administrar sin verificar.',
  warn: '⚠ Fuera de ventana óptima: revisar parámetros.',
  ok: '✔ Parámetros dentro de la ventana segura',
};
export const Panel = ({ ms }) => {
  const L = ms.filter(m => m && ok(m.v) && (ok(m.lo) || ok(m.hi)));
  const J = L.map(judge);
  const top = J.some(j => j[0] === 'crit') ? 'crit' : J.some(j => j[0] === 'warn') ? 'warn' : 'ok';
  return html`<div class='stack'><${Banner} kind=${top === 'crit' ? 'crit pulse' : top}>${VERDICT[top]}<//>${L.map((m, i) => html`<${Gauge} key=${i} m=${m} j=${J[i]}/>`)}</div>`;
};
