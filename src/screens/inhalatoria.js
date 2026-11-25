import { n, f } from '../util.js';
import { useState, useEffect, html } from '../react.js';
import { M } from '../metrics.js';
import { IDM, NB } from '../data.js';
import { BTN, INP, Card, Banner, Tog, Fld, Al, Au, Res, Panel } from '../ui.js';

function Timer(){const [s,setS]=useState(0),[lb,setLb]=useState('');
useEffect(()=>{if(s<=0)return;const t=setTimeout(()=>{setS(s-1);if(s===1&&navigator.vibrate)navigator.vibrate([200,100,200])},1000);return()=>clearTimeout(t)},[s]);
return html`<${Card}><div class="text-center"><div class="text-xs font-semibold opacity-70">${lb||'Cronómetro entre puffs'}</div><div class=${'big-timer'+(s>0?' on':'')}>${s>0?s+' s':'Listo'}</div></div><div class="grid grid-cols-3 gap-2 mt-2">${[['Apnea 10 s',10],['Espera 30 s',30],['Espera 60 s',60]].map(([l,v])=>html`<button key=${l} onClick=${()=>{setS(v);setLb(l)}} class=${BTN}>${l}</button>`)}</div><//>`}
export function Inhal({kg}){
const [m,sm]=useState('idm'),[i,si]=useState(0),[pf,spf]=useState(4),[j,sj]=useState(0),[dose,sd]=useState(NB[0].d),[fl,sfl]=useState(8),[t,st]=useState(10),[epoc,se]=useState(false);
const I=IDM[i],N=NB[j],ml=n(dose)/N.c,sf_=4-ml;
const pick=k=>{sj(k);sd(NB[k].d)};
return html`<div class="space-y-3"><${Tog} v=${m} set=${sm} opts=${[['idm','IDM + aerocámara'],['nbz','Nebulización']]}/>
${m==='idm'?html`<select value=${i} onChange=${e=>si(+e.target.value)} class=${INP}>${IDM.map((x,k)=>html`<option key=${k} value=${k}>${x.n} (${x.mcg} mcg/puff)</option>`)}</select>
<${Card}><${Fld} l="Puffs por ciclo" v=${pf} set=${spf} u="puffs"/><//>
<${Panel} ms=${[M('dose',n(pf),I.lim,'puffs')]}/>
<${Res} l=${[['Dosis por ciclo',n(pf)*I.mcg,'mcg'],['Crisis ×3 ciclos',n(pf)*I.mcg*3,'mcg']]}/>
<${Timer}/><${Al} l=${['Agitar, aerocámara, 1 puff por vez y 5–6 respiraciones; apnea 10 s.','Crisis obstructiva: adultos 4–10 puffs, niños 2–8 puffs c/20 min × 3 dosis y reevaluar.']}/>
<${Au} l=${[`Dosis = ${pf} puffs × ${I.mcg} mcg = ${f(n(pf)*I.mcg)} mcg`,`3 ciclos = ${f(n(pf)*I.mcg*3)} mcg`]}/>`
:html`<select value=${j} onChange=${e=>pick(+e.target.value)} class=${INP}>${NB.map((x,k)=>html`<option key=${k} value=${k}>${x.n}</option>`)}</select>
<${Card}><div class="grid grid-cols-3 gap-2"><${Fld} l=${'Dosis ('+N.u+')'} v=${dose} set=${sd}/><${Fld} l="Flujo" v=${fl} set=${sfl} u="L/min"/><${Fld} l="Tiempo" v=${t} set=${st} u="min"/></div>
<label class="flex gap-2 mt-3 text-sm font-semibold"><input type="checkbox" checked=${epoc} onChange=${e=>se(e.target.checked)}/>Paciente retenedor de CO₂ (EPOC)</label><//>
<${Panel} ms=${[M('dose',n(dose),N.lim,N.u),M('flow',n(fl),[6,8],'L/min'),M('nbt',n(t),[8,15],'min')]}/>
<${Res} l=${[['Fármaco',ml,'ml'],['SF 0,9%',Math.max(sf_,0),'ml'],['Total',Math.max(ml,4),'ml']]}/>
${sf_<0&&html`<${Banner} kind='crit'>⛔ El fármaco excede los 4 ml de volumen óptimo: revisar dosis.<//>`}
${epoc&&html`<${Banner} kind='crit'>⛔ EPOC: nebulizar con AIRE comprimido y O₂ por naricera de bajo flujo en paralelo.<//>`}
<${Al} l=${N.note?[N.note,n(kg)>0&&N.u==='mg'&&N.c===1?`Peso ${kg} kg → 0,5 mg/kg = ${f(Math.min(0.5*n(kg),5))} mg`:null].filter(Boolean):[]}/>
<${Au} l=${[`Fármaco = ${f(n(dose))} ${N.u} ÷ ${f(N.c)} ${N.u}/ml = ${f(ml)} ml`,`SF = 4 ml − ${f(ml)} ml = ${f(sf_)} ml`]}/>`}</div>`}
