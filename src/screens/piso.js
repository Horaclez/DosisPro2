import { n, load, save } from '../util.js';
import { useState, html } from '../react.js';
import { D, FAMS, toDrug } from '../data.js';
import { BTN, INP, Card, Tog } from '../ui.js';
import { Calc } from './calc.js';
import { Libre } from './custom.js';

export function Piso({kg,S,up}){
const [q,sq]=useState(''),[fam,sf]=useState('Todos'),[r,sr]=useState('VVP'),[sel,ss]=useState(D[0].n),[cus,scu]=useState(false),[meds,sm]=useState(()=>load('dosiscl-meds',[])),[cf,scf]=useState(false);
const ALL=[...meds.map(toDrug),...D];
const list=ALL.filter(x=>(fam==='Todos'||x.fam===fam)&&x.n.toLowerCase().includes(q.toLowerCase()));
const d=list.find(x=>x.n===sel)||list[0];
const store=a=>{sm(a);save('dosiscl-meds',a)};
const taken=m=>ALL.some(x=>x.n.toLowerCase()===m.n.toLowerCase()&&x.id!==m.id)?'Ya existe un fármaco con ese nombre.':'';
const onSave=m=>{store(meds.some(x=>x.id===m.id)?meds.map(x=>x.id===m.id?m:x):[...meds,m]);ss(m.n);scu(false);sf('Todos')};
const del=()=>{store(meds.filter(x=>x.id!==d.id));scf(false);ss(D[0].n)};
return html`<div class="space-y-3"><input placeholder="Buscar fármaco…" value=${q} onChange=${e=>sq(e.target.value)} class=${INP}/>
<div class='chips'>${FAMS.map(x=>html`<button key=${x} onClick=${()=>sf(x)} class=${'chip'+(fam===x?' on':'')}>${x}</button>`)}</div>
<${Tog} v=${r} set=${sr} opts=${['VVP','CVC','IM','SC']}/>
<button onClick=${()=>scu(cus?false:'new')} class=${BTN+' w-full'}>${cus?'← Volver a la lista de fármacos':'✏ Crear / escribir otro fármaco (no está en la lista)'}</button>
${!cus&&html`<select value=${d?d.n:''} onChange=${e=>{ss(e.target.value);scf(false)}} class=${INP}>${list.map(x=>html`<option key=${x.n}>${x.n}</option>`)}</select>`}
${cus?html`<${Libre} key=${cus+(d&&d.id||'')} r=${r} kg=${kg} S=${S} up=${up} init=${cus==='edit'?meds.find(x=>x.id===d.id):null} taken=${taken} onSave=${onSave} onCancel=${()=>scu(false)}/>`:d?html`<div class='space-y-3'>${d.mine&&html`<div class='grid grid-cols-2 gap-2'><button class=${BTN} onClick=${()=>scu('edit')}>✏ Editar</button><button class=${BTN+' btn-danger'} onClick=${()=>cf?del():scf(true)}>${cf?'¿Confirmar borrar?':'🗑 Borrar'}</button></div>`}<${Calc} key=${d.n} d=${d} r=${r} kg=${kg} S=${S} up=${up}/></div>`:html`<${Card}>Sin resultados<//>`}</div>`}
