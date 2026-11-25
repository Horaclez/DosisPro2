import { n, ok, f, loc, fmt, uid } from '../util.js';
import { useState, html } from '../react.js';
import { M } from '../metrics.js';
import { BTN, INP, Card, Tog, Fld, Au, Panel } from '../ui.js';

export function Hor({S,up}){
const [nm,snm]=useState(''),[ts,sts]=useState(false),[live,slv]=useState(true);
const [last,sl]=useState(loc(new Date())),[now,sn]=useState(loc(new Date())),[fq,sq]=useState(8),[tc,stc]=useState(false),[dose,sd]=useState(''),[mx,smx]=useState(''),[dy,sdy]=useState('');
const L=new Date(last),N=live?new Date():new Date(now),h=n(fq)>0?n(fq):8,tol=tc?30:60,nx=new Date(L.getTime()+h*36e5),df=Math.round((nx-N)/6e4),el=(N-L)/36e5;
const dt=m=>Math.floor(Math.abs(m)/60)+' h '+(Math.abs(m)%60)+' min';
const s=!ts?['neutral','Ingrese la hora de la última dosis administrada']:df>tol?['info','⏳ Aún no: faltan '+dt(df)]:df>=-tol?['ok','✔ En ventana de administración']:['crit','⛔ ATRASADA por '+dt(df)];
const cnt=Math.max(4,Math.ceil(24/h)+1),tot=Math.ceil(n(dy)*24/h);
const inp=(v,set)=>html`<input type="datetime-local" value=${v} onChange=${e=>set(e.target.value)} class=${INP+' tabular-nums'}/>`;
return html`<div class="space-y-3"><${Card}><div class="space-y-3"><label class="block text-xs font-semibold opacity-70">Última dosis administrada${inp(last,v=>{sl(v);sts(true)})}</label><label class="block text-xs font-semibold opacity-70">Hora actual / de administración${inp(live?loc(new Date()):now,v=>{sn(v);slv(false)})}</label>${!live&&html`<button class=${BTN} onClick=${()=>slv(true)}>Usar hora actual</button>`}
<div><div class="text-xs font-semibold opacity-70 mb-1">Frecuencia (cada X horas)</div><${Tog} v=${h} set=${sq} opts=${[4,6,8,12,24].map(x=>[x,'c/'+x])}/></div>
<${Fld} l="Otra frecuencia" v=${fq} set=${sq} u="h"/>
<label class="flex gap-2 text-sm font-semibold"><input type="checkbox" checked=${tc} onChange=${e=>stc(e.target.checked)}/>Fármaco crítico en tiempo (±30 min): ATB, anticonvulsivantes, insulina, anticoagulantes</label></div><//>
<div class=${'banner '+s[0]}><div class="font-bold">${s[1]}</div><div class="text-sm">Próxima dosis: <b class="tabular-nums">${ts?fmt(nx):'—'}</b> · ventana ±${tol} min</div></div>
<${Panel} ms=${[ts&&N>=L?M('itv',el,[h-tol/60,h+tol/60],'h'):null,ok(n(dose))&&ok(n(mx))?M('tot',n(dose)*24/h,[null,n(mx)],'/24 h'):null]}/>
<${Card}><h3 class='title'>Horarios siguientes</h3><ul class="space-y-1 tabular-nums text-sm">${Array.from({length:ts?cnt:0},(_,k)=>{const t=new Date(nx.getTime()+k*h*36e5),hr=t.getHours();return html`<li key=${k} class="flex justify-between"><span>${k+1}ª: ${fmt(t)}</span><span>${hr>=20||hr<8?'🌙 turno noche':'☀ día'}</span></li>`})}</ul><//>
<${Card}><div class="grid grid-cols-2 gap-2"><${Fld} l="Dosis por toma (opcional)" v=${dose} set=${sd}/><${Fld} l="Máx diario" v=${mx} set=${smx}/></div><div class="mt-2"><${Fld} l="Duración del tratamiento (1ª dosis = última registrada)" v=${dy} set=${sdy} u="días"/></div>
${tot>0&&html`<div class="mt-2 text-sm tabular-nums">Total <b>${tot}</b> dosis · última: <b>${fmt(new Date(L.getTime()+(tot-1)*h*36e5))}</b></div>`}<//>
<${Card}><h3 class='title'>⏰ Alarma de próxima dosis</h3><input placeholder='Fármaco (ej. Cefazolina 1 g)' value=${nm} onChange=${e=>snm(e.target.value)} class=${INP}/><button onClick=${()=>{up({sched:[...S.sched,{id:uid(),n:nm||'Dosis',h,at:nx.getTime(),mg:n(dose)||0}]});snm('')}} disabled=${!ts} class=${BTN+' mt-2 w-full'}>Programar alarma: ${ts?fmt(nx):'(ingrese la última dosis)'}</button><div class='text-xs opacity-70 mt-1'>Suena y vibra mientras la app esté abierta.</div>${S.sched.map(s=>html`<div key=${s.id} class='flex justify-between text-sm mt-2'><span>${s.n} · ${fmt(new Date(s.at))}</span><button onClick=${()=>up({sched:S.sched.filter(x=>x.id!==s.id)})}>✕</button></div>`)}<//>
<${Au} l=${['Próxima = '+fmt(L)+' + '+f(h)+' h = '+fmt(nx),'Intervalo real = '+f(el)+' h (ventana '+f(h-tol/60)+'–'+f(h+tol/60)+' h)','Dosis/24 h = 24 ÷ '+f(h)+' = '+f(24/h)+' tomas']}/></div>`}
