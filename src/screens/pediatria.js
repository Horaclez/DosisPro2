import { n, f } from '../util.js';
import { useState, html } from '../react.js';
import { M } from '../metrics.js';
import { PD } from '../data.js';
import { Card, Banner, SEL, Fld, Au, Res, Panel } from '../ui.js';

export function PedCalc({p,kg}){
const [mk,smk]=useState(+((p.lo+p.hi)/2).toFixed(3)),[tm,stm]=useState(3),W=n(kg),tot=n(mk)*W,per=p.day?tot/n(tm):tot;
const hs=W<=10?100*W:W<=20?1000+50*(W-10):1500+20*(W-20);
return html`<div class='space-y-3'><${Card}><div class='text-xs opacity-70 mb-2'>${p.fr}</div><div class='grid grid-cols-2 gap-2'><${Fld} l=${p.day?'Dosis diaria':'Dosis'} v=${mk} set=${smk} u=${'mg/kg'+(p.day?'/día':'')}/>${p.day&&html`<${Fld} l='Tomas por día' v=${tm} set=${stm}/>`}</div><//>
${!(W>0)&&html`<${Banner} kind='crit'>⛔ Ingrese el peso del paciente (barra superior).<//>`}
<${Panel} ms=${[M('dose',tot,[Math.max(p.lo*W,p.mn||0),Math.min(p.hi*W,p.mx)],'mg')]}/>
<${Res} l=${[[p.day?'Total diario':'Dosis',tot,'mg'],p.day?['Por toma',per,'mg']:null,p.c?['Volumen',per/p.c,'ml']:null].filter(Boolean)}/>
<${Au} l=${[`Dosis = ${f(n(mk),3)} mg/kg × ${f(W)} kg = ${f(tot)} mg`,p.c?`ml = ${f(per)} mg ÷ ${p.c} mg/ml = ${f(per/p.c)}`:'Ver presentación disponible',`Tope: ${f(p.mx)} mg${p.day?'/día':' por dosis'}`]}/>
<${Card}><h3 class='title'>Sueroterapia pediátrica (Holliday-Segar)</h3><${Res} l=${[['Mantención',hs,'ml/día'],['Bomba',hs/24,'ml/h'],['Bolo 20 ml/kg',20*W,'ml']]}/><div class='text-xs mt-2 tabular-nums'>100 ml/kg (primeros 10 kg) + 50 ml/kg (10–20 kg) + 20 ml/kg (>20 kg). Tope habitual 100–120 ml/h.</div><//></div>`}
export function Ped({kg}){const [i,si]=useState(0);return html`<div class='space-y-3'>${SEL(PD[i].n,v=>si(PD.findIndex(x=>x.n===v)),PD.map(x=>x.n))}<${PedCalc} key=${i} p=${PD[i]} kg=${kg}/></div>`}
