import { n, f } from '../util.js';
import { useState, html } from '../react.js';
import { D, CP, GR, SAL, UU } from '../data.js';
import { Card, Banner, SEL, Fld } from '../ui.js';

export function Seg({kg}){
const L=[...D.map(x=>x.n),'Ringer Lactato','Suero fisiológico 0,9%','Suero glucosado 5%'];
const [a,sa]=useState('Ceftriaxona'),[b,sb]=useState('Ringer Lactato'),[v,sv]=useState(1),[fu,sfu]=useState('g'),[tu,stu]=useState('mg'),[mv,smv]=useState(1000),[sl,ssl]=useState('KCl'),[mk,smk]=useState(5),[cc,scc]=useState(10);
const has=(x,k)=>x.toLowerCase().includes(k.toLowerCase()),R=[];
CP.forEach(([p,q,s,m])=>{if((has(a,p)&&has(b,q))||(has(a,q)&&has(b,p)))R.push([s,m])});
GR.forEach(([g,s,m])=>{if(a!==b&&g.some(k=>has(a,k))&&g.some(k=>has(b,k)))R.push([s,m])});
const [mw,vl]=SAL[sl];
return html`<div class='space-y-3'><${Card}><h3 class='title'>Compatibilidad e interacciones</h3><div class='space-y-2'>${SEL(a,sa,L)}${SEL(b,sb,L)}</div><//>
${R.length?R.map(([s,m],i)=>html`<div key=${i} class=${'banner '+(s==='crit'?'crit':'warn')}>${s==='crit'?'⛔ ':'⚠ '}${m}</div>`):html`<${Banner} kind='ok'>✔ Sin incompatibilidad conocida en esta base (no es exhaustiva). Confirme con farmacia clínica.<//>`}
<${Card}><h3 class='title'>Conversor de unidades</h3><div class='grid grid-cols-3 gap-2'><${Fld} l='Valor' v=${v} set=${sv}/><div>${SEL(fu,sfu,Object.keys(UU))}</div><div>${SEL(tu,stu,Object.keys(UU))}</div></div><div class='text-xl font-bold tabular-nums mt-2'>${f(n(v)*UU[fu]/UU[tu],6)} ${tu}</div><//>
<${Card}><h3 class='title'>mg ↔ mEq</h3>${SEL(sl,ssl,Object.keys(SAL))}<div class='mt-2'><${Fld} l='Cantidad (mg)' v=${mv} set=${smv} u='mg'/></div><div class='text-xl font-bold tabular-nums mt-2'>${f(n(mv)*vl/mw)} mEq</div><div class='text-xs tabular-nums'>mEq = mg × ${vl} ÷ ${mw} · inversa: ${f(1*mw/vl)} mg = 1 mEq</div><//>
<${Card}><h3 class='title'>mg/kg → ml</h3><div class='grid grid-cols-2 gap-2'><${Fld} l='Dosis' v=${mk} set=${smk} u='mg/kg'/><${Fld} l='Concentración' v=${cc} set=${scc} u='mg/ml'/></div><div class='text-xl font-bold tabular-nums mt-2'>${f(n(mk)*n(kg)/n(cc))} ml <span class='text-sm font-normal'>(${f(n(mk)*n(kg))} mg)</span></div><//></div>`}
