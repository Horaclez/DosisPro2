import { n, f, fmt, hhmm } from '../util.js';
import { html } from '../react.js';
import { MD } from '../data.js';
import { BTN, INP, Card } from '../ui.js';

export function Turno({kg,S,up}){
const tm=hhmm,ac={};
S.log.forEach(e=>{ac[e.n]=(ac[e.n]||0)+e.mg});
const tx=['ENTREGA DE TURNO · DosisCL Pro · '+new Date().toLocaleString('es-CL'),'Peso: '+(kg||'—')+' kg','','BIC ACTIVAS:',...(S.bic.length?S.bic.map(b=>'- '+b.n+': '+f(b.rate)+' ml/h ('+f(b.dose,3)+' '+b.u+') desde '+tm(b.t)):['- ninguna']),'','ADMINISTRACIONES DEL TURNO:',...(S.log.length?S.log.map(e=>'- '+tm(e.t)+' '+e.n+' '+f(e.mg)+' '+e.u):['- ninguna']),'','ACUMULADO:',...Object.entries(ac).map(([k,x])=>'- '+k+': '+f(x)+(MD[k]?' / máx '+f(MD[k]):'')),'','PRÓXIMAS DOSIS:',...(S.sched.length?S.sched.map(s=>'- '+s.n+' c/'+f(s.h)+' h → '+fmt(new Date(s.at))):['- ninguna'])].join('\n');
const rm=(k,id)=>up({[k]:S[k].filter(x=>x.id!==id)});
const Row=({k,x,t})=>html`<div class='flex justify-between text-sm py-1'><span>${t}</span><button onClick=${()=>rm(k,x.id)}>✕</button></div>`;
return html`<div class='space-y-3'><${Card}><div class='font-bold'>BIC activas</div>${S.bic.length?S.bic.map(b=>html`<${Row} key=${b.id} k='bic' x=${b} t=${b.n+' · '+f(b.rate)+' ml/h'}/>`):html`<div class='text-sm opacity-70'>Ninguna registrada (módulo BIC).</div>`}<//>
<${Card}><div class='font-bold'>Administraciones del turno</div>${S.log.length?S.log.map(e=>html`<${Row} key=${e.id} k='log' x=${e} t=${tm(e.t)+' '+e.n+' '+f(e.mg)+' '+e.u}/>`):html`<div class='text-sm opacity-70'>Sin registros (use Registrar administración en Piso).</div>`}<//>
<${Card}><h3 class='title'>Resumen para la ficha</h3><textarea readOnly rows='12' value=${tx} class=${INP+' font-mono text-xs'}></textarea><div class='grid grid-cols-2 gap-2 mt-2'><button class=${BTN} onClick=${()=>{try{navigator.clipboard.writeText(tx)}catch(e){}}}>📋 Copiar</button><button class=${BTN} onClick=${()=>window.print()}>🖨 Imprimir / PDF</button></div><div class='text-xs opacity-70 mt-2'>Los datos se guardan en este dispositivo. 'Nuevo Paciente' los borra.</div><//></div>`}
