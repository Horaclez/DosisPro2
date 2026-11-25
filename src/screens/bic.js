import { n, ok, f, uid } from '../util.js';
import { useState, html } from '../react.js';
import { M } from '../metrics.js';
import { BP, UN } from '../data.js';
import { BTN, INP, Card, Banner, Tog, Fld, Al, Au, Res, Panel } from '../ui.js';

export function BicCalc({p,kg,S,up}){
const [amt,sa]=useState(p.amt),[vol,sv]=useState(p.vol),[md,sm]=useState('d'),[val,s]=useState(p.def),[u,su]=useState(p.u);
const wb=u.includes('/kg'),pm=u.endsWith('/min'),b=u.split('/')[0],W=n(kg),conc=n(amt)/n(vol),k=(wb?W:1)*(pm?60:1);
const rate=md==='d'?n(val)*k/conc:n(val),dose=md==='d'?n(val):rate*conc/k;
const rl=p.lim?p.lim.map(x=>x*k/conc):null;
return html`<div class="space-y-3"><${Card}><div class="grid grid-cols-2 gap-2"><${Fld} l=${'Cantidad total ('+b+')'} v=${amt} set=${sa}/><${Fld} l="Volumen" v=${vol} set=${sv} u="ml"/></div>
${p.custom&&html`<select value=${u} onChange=${e=>su(e.target.value)} class=${INP+' mt-2'}>${UN.map(x=>html`<option key=${x}>${x}</option>`)}</select>`}
<div class="text-sm mt-2 tabular-nums">Concentración: <b>${f(conc,3)} ${b}/ml</b></div>
<${Tog} v=${md} set=${x=>{if(x!==md){s(String(+(md==='d'?rate:dose).toPrecision(4)));sm(x)}}} opts=${[['d','Dosis → ml/h'],['r','ml/h → Dosis']]}/>
<div class="mt-3"><${Fld} l=${md==='d'?'Dosis deseada':'Velocidad actual de la bomba'} v=${val} set=${s} u=${md==='d'?u:'ml/h'}/></div><//>
${wb&&!(W>0)&&html`<${Banner} kind='crit'>⛔ Ingrese el peso del paciente (barra superior).<//>`}
<${Panel} ms=${[M('dose',dose,p.lim,u),M('speed',rate,rl,'ml/h')]}/>
<${Res} l=${[['Bomba',rate,'ml/h'],['Dosis actual',dose,u]]}/><${Al} l=${p.al}/>
<button onClick=${()=>up({bic:[...S.bic,{id:uid(),n:p.n,rate,dose,u,t:Date.now()}]})} disabled=${!ok(rate)||!ok(dose)} class=${BTN+' w-full'}>📌 Registrar como BIC activa</button>
<${Au} l=${[`Concentración = ${f(n(amt))} ${b} ÷ ${f(n(vol))} ml = ${f(conc,3)} ${b}/ml`,`ml/h = ${f(dose,3)} ${u}${wb?' × '+f(W)+' kg':''}${pm?' × 60':''} ÷ ${f(conc,3)} = ${f(rate)}`]}/></div>`}
export function Bic({kg,S,up}){const [i,si]=useState(0);
return html`<div class="space-y-3"><select value=${i} onChange=${e=>si(+e.target.value)} class=${INP}>${BP.map((x,k)=>html`<option key=${k} value=${k}>${x.n}</option>`)}</select><${BicCalc} key=${i} p=${BP[i]} kg=${kg} S=${S} up=${up}/></div>`}
