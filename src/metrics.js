import { ok } from './util.js';

export const K={
dose:{t:'Dosis',lm:'Dosis subterapéutica',hm:'SOBREDOSIS por toma'},
conc:{t:'Concentración',lm:'Dilución inestable / ineficaz',hm:'Flebitis química / irritación de vía'},
speed:{t:'Velocidad',lm:'Flujo muy lento: riesgo de oclusión de la vía',hm:'Toxicidad aguda (arritmia, hipotensión, ototoxicidad, síndrome de infusión)'},
time:{t:'Tiempo de infusión',lc:'crit',hc:'warn',lm:'Infusión demasiado RÁPIDA: riesgo de bolo / toxicidad',hm:'Excede tiempo de estabilidad tras reconstitución'},
cum:{t:'Acumulado del turno + esta dosis',lm:'',hm:'Supera techo acumulado'},
flow:{t:'Flujo de gas',lm:'Flujo insuficiente: partículas no respirables',hm:'Flujo excesivo: pérdida de fármaco'},
nbt:{t:'Tiempo de nebulización',hc:'warn',lm:'Tiempo corto: dosis incompleta',hm:'Tiempo excesivo: fatiga / taquicardia'},
pct:{t:'Concentración final NaCl',lm:'Menos concentrada que SF 0,9%',hm:'Hipertónico >3%: solo CVC / control UCI'},
itv:{t:'Intervalo desde última dosis',lc:'crit',hc:'warn',lm:'Dosis ANTICIPADA: riesgo de acumulación / sobredosis',hm:'Dosis ATRASADA: riesgo de subdosis / ineficacia'},
tot:{t:'Dosis total en 24 h',lm:'',hm:'Supera el máximo diario'}};
K.cl={t:'Clearance de creatinina (C-G)',lc:'crit',lm:'ClCr <30 ml/min: ajuste de dosis obligatorio',hm:''};
export const M=(k,v,a,u)=>({lc:'warn',hc:'crit',...K[k],v,lo:a&&ok(a[0])?a[0]:null,hi:a&&ok(a[1])?a[1]:null,u});
export const judge=m=>ok(m.lo)&&m.v<m.lo-1e-9?[m.lc,'low']:ok(m.hi)&&m.v>m.hi+1e-9?[m.hc,'high']:['ok','ok'];
