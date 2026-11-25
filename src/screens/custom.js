import { n, save } from '../util.js';
import { useState, html } from '../react.js';
import { limit, UL } from '../data.js';
import { BTN, INP, Card, Banner, SEL, Fld } from '../ui.js';
import { Calc } from './calc.js';

export function Libre({r,kg,S,up,init,onSave,onCancel,taken}){
const I=init||{};const [nm,snm]=useState(I.n||''),[u,su]=useState(I.u||'mg'),[am,sam]=useState(I.a||''),[per,sper]=useState(I.per||'min'),[dl,sdl]=useState(I.dl||''),[dh,sdh]=useState(I.dh||''),[ch,sch]=useState(I.ch||''),[sh,ssh]=useState(I.sh||''),[tl,stl]=useState(I.tl||''),[pr,spr]=useState(I.p||''),[dd,sdd]=useState(I.dd||''),[dv,sdv]=useState(I.dv||100),[dt,sdt]=useState(I.dt||30),[nt,snt]=useState(I.al||''),[er,ser]=useState('');
const L=limit;
const any=[dl,dh,ch,sh,tl].some(x=>L(x)!=null);
const d={n:nm.trim()||'Fármaco personalizado',fam:'Otros',p:pr||'Ingresado manualmente',a:L(am)>0?L(am):undefined,u,per:per==='hr'?'hr':undefined,lim:()=>({dose:[L(dl),L(dh)],conc:[null,L(ch)],speed:[null,L(sh)],time:[L(tl),null]}),d:{dose:dd,vol:dv,time:dt},al:['⚠ Fármaco escrito a mano: la app NO tiene sus límites verificados. Use los de la ficha del fabricante o su protocolo.'].concat(any?[]:['Sin límites ingresados: no habrá barras de seguridad. Complete los límites en el desplegable.']).concat(nt?[nt]:[])};
const save=()=>{const mm={id:I.id||Date.now(),n:nm.trim(),u,per,a:am,p:pr,dl,dh,ch,sh,tl,dd,dv,dt,al:nt};const e=taken(mm);if(e){ser(e);return}onSave(mm)};
return html`<div class='space-y-3'><${Card}><h3 class='title'>✏ Fármaco personalizado</h3>
<input placeholder='Nombre del fármaco' value=${nm} onChange=${e=>snm(e.target.value)} class=${INP}/>
<div class='grid grid-cols-2 gap-2 mt-2'><label class='block'><span class='text-xs font-semibold opacity-70'>Unidad de dosis</span>${SEL(u,su,UL)}</label><label class='block'><span class='text-xs font-semibold opacity-70'>Velocidad por</span>${SEL(per,sper,['min','hr'])}</label></div>
<div class='mt-2'><${Fld} l='Concentración de la ampolla (opcional)' v=${am} set=${sam} u=${u+'/ml'}/></div>
<details class='mt-3'><summary class='text-sm font-semibold cursor-pointer'>Límites de seguridad (de su ficha o protocolo)</summary><div class='grid grid-cols-2 gap-2 mt-2'><${Fld} l='Dosis mín' v=${dl} set=${sdl} u=${u}/><${Fld} l='Dosis máx' v=${dh} set=${sdh} u=${u}/><${Fld} l='Concentración máx' v=${ch} set=${sch} u=${u+'/ml'}/><${Fld} l='Velocidad máx' v=${sh} set=${ssh} u=${u+'/'+per}/><${Fld} l='Tiempo mín' v=${tl} set=${stl} u='min'/></div></details><details class='mt-3'><summary class='text-sm font-semibold cursor-pointer'>Presentación, valores por defecto y notas</summary><div class='mt-2 space-y-2'><input placeholder='Presentación (ej. 500 mg/10 ml)' value=${pr} onChange=${e=>spr(e.target.value)} class=${INP}/><div class='grid grid-cols-3 gap-2'><${Fld} l='Dosis inicial' v=${dd} set=${sdd}/><${Fld} l='Volumen' v=${dv} set=${sdv} u='ml'/><${Fld} l='Tiempo' v=${dt} set=${sdt} u='min'/></div><input placeholder='Notas / alertas propias' value=${nt} onChange=${e=>snt(e.target.value)} class=${INP}/></div></details><//>
<div class='grid grid-cols-2 gap-2'><button disabled=${!nm.trim()} onClick=${save} class='btn btn-ok'>💾 ${init?'Guardar cambios':'Guardar fármaco'}</button>${onCancel&&html`<button class=${BTN} onClick=${onCancel}>Cancelar</button>`}</div>${er&&html`<${Banner} kind='crit'>⛔ ${er}<//>`}<div class='text-xs opacity-70'>Los fármacos guardados quedan en este dispositivo y se conservan al usar Nuevo Paciente.</div>
<${Calc} key='libre' d=${d} r=${r} kg=${kg} S=${S} up=${up}/></div>`}
