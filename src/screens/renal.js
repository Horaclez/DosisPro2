import { n, ok, f } from '../util.js';
import { useState, html } from '../react.js';
import { M } from '../metrics.js';
import { RD } from '../data.js';
import { Card, Banner, Tog, Fld, Al, Au, Panel } from '../ui.js';

export function Ren({kg}){
const [ed,sed]=useState(''),[sx,ssx]=useState('M'),[cr,scr]=useState('');
const W=n(kg),cl=(140-n(ed))*W/(72*n(cr))*(sx==='F'?0.85:1),g=!ok(cl)?'':cl>=90?'Normal':cl>=60?'Leve':cl>=30?'Moderada':cl>=15?'Severa':'Falla renal';
return html`<div class='space-y-3'><${Card}><div class='grid grid-cols-2 gap-2'><${Fld} l='Edad' v=${ed} set=${sed} u='años'/><${Fld} l='Creatinina' v=${cr} set=${scr} u='mg/dl'/></div><${Tog} v=${sx} set=${ssx} opts=${[['M','Hombre'],['F','Mujer']]}/><div class='text-xs opacity-70 mt-2'>Usa el peso de la barra superior (peso real).</div><//>
${ok(cl)&&html`<${Panel} ms=${[M('cl',cl,[30,null],'ml/min')]}/><${Banner} kind='info'>Insuficiencia renal: ${g}<//><${Card}><h3 class='title'>Ajustes sugeridos</h3><ul class='space-y-2 text-sm'>${RD.map(([a,fn])=>html`<li key=${a}><b>${a}:</b> ${fn(cl)}</li>`)}</ul><//><${Au} l=${[`ClCr = (140 − ${f(n(ed),0)}) × ${f(W)} ÷ (72 × ${f(n(cr))})${sx==='F'?' × 0,85':''} = ${f(cl,0)} ml/min`]}/>`}
<${Al} l=${['Referencial: confirmar con protocolo local y farmacia clínica.','Cockcroft-Gault es poco fiable en obesidad, embarazo o creatinina inestable.']}/></div>`}
