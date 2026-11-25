import { html, useState, useEffect } from './react.js';
import { load, save, uid } from './util.js';
import { Card, Fld, Icon, Tog } from './ui.js';
import { Piso } from './screens/piso.js';
import { Inhal } from './screens/inhalatoria.js';
import { Bic } from './screens/bic.js';
import { Sue } from './screens/sueros.js';
import { Hor } from './screens/horarios.js';
import { Ped } from './screens/pediatria.js';
import { Ren } from './screens/renal.js';
import { Seg } from './screens/seguridad.js';
import { Turno } from './screens/turno.js';

export const TABS = [
  ['Piso', 'pill', Piso], ['Inhalatoria', 'wind', Inhal], ['BIC', 'drop', Bic], ['Sueros', 'flask', Sue], ['Horarios', 'clock', Hor],
  ['Pediatría', 'smile', Ped], ['Renal', 'activity', Ren], ['Seguridad', 'shield', Seg], ['Turno', 'clipboard', Turno],
];
export const THEMES = [
  ['clinico', 'Clínico', '#0284c7'], ['indigo', 'Índigo', '#4f46e5'], ['turquesa', 'Turquesa', '#0d9488'],
  ['violeta', 'Violeta', '#7c3aed'], ['grafito', 'Grafito', '#334155'], ['contraste', 'Alto contraste', '#000000'],
];
const DATA_KEY = 'dosiscl';
const UI_KEY = 'dosiscl-ui';
const EMPTY = { log: [], bic: [], sched: [] };

function alarm() {
  try {
    if (navigator.vibrate) navigator.vibrate([300, 150, 300]);
    const a = new (window.AudioContext || window.webkitAudioContext)();
    const o = a.createOscillator();
    o.connect(a.destination);
    o.frequency.value = 880;
    o.start();
    setTimeout(() => { o.stop(); a.close(); }, 400);
  } catch (e) { /* el navegador puede bloquear el sonido */ }
}

function DesignSheet({ ui, setUi, onClose }) {
  return html`<div class='sheet-bg' onClick=${onClose}><div class='card sheet' onClick=${e => e.stopPropagation()}>
<h3 class='title'>Diseño de la app</h3>
<div class='themes'>${THEMES.map(([id, name, color]) => html`<button key=${id} class=${'theme-b' + (ui.theme === id ? ' on' : '')} onClick=${() => setUi({ ...ui, theme: id })}><i style=${{ background: color }}></i><span>${name}</span></button>`)}</div>
<div class='lbl'>Modo</div>
<${Tog} v=${ui.mode} set=${mode => setUi({ ...ui, mode })} opts=${[['auto', 'Automático'], ['light', 'Día'], ['dark', 'Noche']]}/>
<button class='btn btn-pri w-full' onClick=${onClose}>Listo</button></div></div>`;
}

export function App() {
  const [tab, setTab] = useState(0);
  const [kg, setKg] = useState(() => load(DATA_KEY, {}).kg || '');
  const [S, setS] = useState(() => { const l = load(DATA_KEY, {}); return { log: l.log || [], bic: l.bic || [], sched: l.sched || [] }; });
  const [ui, setUi] = useState(() => ({ theme: 'clinico', mode: 'auto', ...load(UI_KEY, {}) }));
  const [sheet, setSheet] = useState(false);
  const [key, setKey] = useState(0);
  const [, tick] = useState(0);

  const dark = ui.mode === 'dark' || (ui.mode === 'auto' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const up = p => setS(s => ({ ...s, ...p }));
  const due = S.sched.filter(x => x.at <= Date.now());

  useEffect(() => { const r = document.documentElement; r.classList.toggle('dark', dark); r.dataset.theme = ui.theme; }, [dark, ui.theme]);
  useEffect(() => save(UI_KEY, ui), [ui]);
  useEffect(() => save(DATA_KEY, { kg, log: S.log, bic: S.bic, sched: S.sched }), [kg, S]);
  useEffect(() => { const t = setInterval(() => tick(x => x + 1), 20000); return () => clearInterval(t); }, []);
  useEffect(() => { if (due.length && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) alarm(); }, [due.length]);

  const newPatient = () => { setKg(''); setS(EMPTY); setKey(key + 1); };
  const give = x => up({
    log: x.mg ? [...S.log, { id: uid(), n: x.n, mg: x.mg, u: 'mg', t: Date.now() }] : S.log,
    sched: S.sched.map(y => (y.id === x.id ? { ...y, at: Date.now() + y.h * 36e5 } : y)),
  });
  const Mod = TABS[tab][2];

  return html`<div class='app'>
<header class='top'><div class='brand'><span class='logo'><${Icon} name='cross' size=${22}/></span><div><div class='bname'>DosisCL <b>Pro</b></div><div class='bsub'>Cálculo clínico y ventanas de seguridad</div></div></div>
<div class='top-btns'><button class='icon-btn' aria-label='Diseño de la app' onClick=${() => setSheet(true)}><${Icon} name='palette'/></button><button class='icon-btn' aria-label=${dark ? 'Cambiar a modo día' : 'Cambiar a modo noche'} onClick=${() => setUi({ ...ui, mode: dark ? 'light' : 'dark' })}><${Icon} name=${dark ? 'sun' : 'moon'}/></button></div></header>
<div class='layout'>
<nav class='nav'>${TABS.map(([l, ic], i) => html`<button key=${l} onClick=${() => setTab(i)} class=${'nav-b' + (tab === i ? ' on' : '')}><${Icon} name=${ic} size=${22}/><span>${l}</span></button>`)}</nav>
<main class='main'>
<${Card}><div class='row-end'><div class='grow'><${Fld} l='Peso del paciente' v=${kg} set=${setKg} u='kg'/></div><button class='btn btn-pri' onClick=${newPatient}>Nuevo Paciente</button></div><//>
${due.length > 0 && html`<div class='banner crit pulse'><b>⏰ Dosis pendientes</b>${due.map(x => html`<div key=${x.id} class='due-row'><span>${x.n}</span><button class='btn btn-light' onClick=${() => give(x)}>Administrada</button></div>`)}</div>`}
<div class='screen' key=${tab + '-' + key}><${Mod} kg=${kg} S=${S} up=${up}/></div>
<p class='legal'>Herramienta de apoyo, no reemplaza la indicación médica, el protocolo institucional ni el doble chequeo independiente. Verifique presentación, concentración y límites con su vademécum local. Los rangos no han sido validados por farmacia clínica: valídelos antes de uso asistencial.</p>
</main></div>
${sheet && html`<${DesignSheet} ui=${ui} setUi=${setUi} onClose=${() => setSheet(false)}/>`}
</div>`;
}
