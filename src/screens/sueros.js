import { n, f } from '../util.js';
import { useState, html } from '../react.js';
import { M } from '../metrics.js';
import { Card, Fld, Al, Au, Res, Panel } from '../ui.js';

export function Sue(){
const [v,sv]=useState(1000),[h,sh]=useState(8),[v2,sv2]=useState(500),[r2,sr2]=useState(125),[vb,svb]=useState(500),[t,st]=useState(3);
const rate=n(v)/n(h),x=n(vb)*(n(t)-0.9)/(10-n(t)),x2=n(vb)*(n(t)-0.9)/9.1,fin=n(vb)+x,mEq=fin*n(t)*10/58.5;
return html`<div class="space-y-3"><${Card}><h3 class='title'>Goteo</h3><div class="grid grid-cols-2 gap-2"><${Fld} l="Volumen" v=${v} set=${sv} u="ml"/><${Fld} l="Duración" v=${h} set=${sh} u="h"/></div><//>
<${Res} l=${[['Bomba',rate,'ml/h'],['Macrogoteo (20 gt/ml)',rate/3,'gotas/min'],['Microgoteo (60 mgt/ml)',rate,'microgotas/min']]}/>
<${Au} l=${[`ml/h = ${f(n(v))} ÷ ${f(n(h))} = ${f(rate)}`,`macro = ${f(rate)} × 20 ÷ 60 = ${f(rate/3)} gt/min`,`micro = ml/h = ${f(rate)}`]}/>
<${Card}><h3 class='title'>Duración de matraz</h3><div class="grid grid-cols-2 gap-2"><${Fld} l="Volumen" v=${v2} set=${sv2} u="ml"/><${Fld} l="Velocidad" v=${r2} set=${sr2} u="ml/h"/></div><div class="mt-2 text-lg font-bold tabular-nums">Dura ${f(n(v2)/n(r2))} h (${f(n(v2)/n(r2)*60,0)} min)</div><//>
<${Card}><h3 class='title'>Preparador NaCl hipertónico (desde SF 0,9% + NaCl 10%)</h3><div class="grid grid-cols-2 gap-2"><${Fld} l="Matraz SF 0,9%" v=${vb} set=${svb} u="ml"/><${Fld} l="NaCl final" v=${t} set=${st} u="%"/></div><//>
<${Panel} ms=${[M('pct',n(t),[0.9,3],'%')]}/>
<${Res} l=${[['Agregar NaCl 10%',x,'ml'],['= ampollas 10 ml',x/10,'amp'],['Volumen final',fin,'ml'],['Na⁺ total',mEq,'mEq']]}/>
<${Al} l=${['Alternativa: retirar '+f(x2)+' ml de SF y agregar '+f(x2)+' ml de NaCl 10% (volumen se mantiene).','NaCl >3% requiere CVC y control estricto de natremia.']}/>
<${Au} l=${[`x = ${f(n(vb))} × (${f(n(t))} − 0,9) ÷ (10 − ${f(n(t))}) = ${f(x)} ml`,`Final = ${f(n(vb))} + ${f(x)} = ${f(fin)} ml`,`Na⁺ = ${f(fin)} × ${f(n(t))}% × 10 ÷ 58,5 = ${f(mEq,0)} mEq`]}/></div>`}
