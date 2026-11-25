import { n, f, uid } from '../util.js';
import { useState, html } from '../react.js';
import { M } from '../metrics.js';
import { MD, HAM } from '../data.js';
import { BTN, Card, Banner, Fld, Al, Au, Res, Chk, Panel } from '../ui.js';

export function Calc({d,r,kg,S,up}){
const [dose,sd]=useState(d.d.dose),[vol,sv]=useState(d.d.vol),[tm,st]=useState(d.d.time),[alt,sa]=useState(false),[pv,sp]=useState(0);
const X=n(dose),V=n(vol),T=n(tm),im=r==='IM'||r==='SC';
const lim=d.lim({r,alt,kg:n(kg),dose:X});
const conc=X/V*(d.cm||1),sp_=X/T*(d.per==='hr'?60:1),rate=V/T*60,gtt=rate/3;
const cu=d.cu||d.u+'/ml',su=d.u+'/'+(d.per||'min'),inf=!im&&!d.noInf;
const ms=[M('dose',X,lim.dose,d.u)];
if(inf){ms.push(M('conc',conc,lim.conc,cu),M('speed',sp_,lim.speed,su),M('time',T,lim.time,'min'));}
if(d.cum)ms.push(M('cum',X+(n(pv)||0),[null,d.cum],d.u));
const acc=S.log.filter(e=>e.n===d.n).reduce((a,e)=>a+e.mg,0);if(MD[d.n])ms.push(M('cum',acc+X,[null,MD[d.n]],d.u));
const au=[];
if(d.a)au.push(`Dosis: ${f(X)} ${d.u} ÷ ${f(d.a)} ${d.u}/ml = ${f(X/d.a)} ml de ampolla`);
if(inf)au.push(`Dilución: ${f(X)} ${d.u} en ${f(V)} ml → ${f(conc)} ${cu}`,`ml/h = ${f(V)} ml ÷ ${f(T)} min × 60 = ${f(rate)}`,`gotas/min = ${f(rate)} × 20 ÷ 60 = ${f(gtt)}`,`Velocidad = ${f(X)} ${d.u} ÷ ${f(T)} min${d.per==='hr'?' × 60':''} = ${f(sp_)} ${su}`);
const res=[];if(d.a)res.push(['Extraer de ampolla',X/d.a,'ml']);
if(inf)res.push(['Bomba',rate,'ml/h'],['Macrogoteo',gtt,'gotas/min'],['Microgoteo',rate,'microgotas/min']);
return html`<div class="space-y-3">
<${Card}><div class="text-xs opacity-70 mb-2">Presentación: ${d.p}</div><div class="grid grid-cols-2 gap-2">
<${Fld} l=${'Dosis ('+d.u+')'} v=${dose} set=${sd} u=${d.u}/>${!d.noInf&&im===false&&html`<${Fld} l="Volumen final" v=${vol} set=${sv} u="ml"/><${Fld} l="Tiempo" v=${tm} set=${st} u="min"/>`}${d.cum&&html`<${Fld} l="Acumulado previo" v=${pv} set=${sp} u=${d.u}/>`}</div>
${d.alt&&html`<label class="flex gap-2 mt-3 text-sm font-semibold"><input type="checkbox" checked=${alt} onChange=${e=>sa(e.target.checked)}/>${d.alt}</label>`}<//>
${r==='SC'&&!d.sc&&html`<${Banner} kind='warn'>⚠ Vía SC no precargada para este fármaco: verifique indicación.<//>`}${(r==='IM'||r==='SC')&&d.noIM&&html`<${Banner} kind='crit'>⛔ Vía IM/SC no indicada para este fármaco.<//>`}
${alt&&/\/kg/.test(d.alt)&&!(n(kg)>0)&&html`<${Banner} kind='crit'>⛔ Ingrese el peso del paciente (barra superior) para aplicar el cálculo por peso.<//>`}<${Panel} ms=${ms}/><${Res} l=${res}/>${HAM.test(d.n)&&html`<${Banner} kind='hr'>🔺 MEDICAMENTO DE ALTO RIESGO: doble chequeo independiente<//>`}<button onClick=${()=>up({log:[...S.log,{id:uid(),n:d.n,mg:X,u:d.u,t:Date.now()}]})} disabled=${!(X>0)} class=${BTN+' w-full'}>✔ Registrar administración (${f(X)} ${d.u})${acc>0?' · acumulado previo '+f(acc):''}</button><${Al} l=${d.al}/><${Chk}/><${Au} l=${au}/></div>`}
