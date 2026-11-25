export const n = x => parseFloat(x);
export const ok = x => x != null && isFinite(x);
export const f = (x, d = 2) => (ok(x) ? x.toLocaleString('es-CL', { maximumFractionDigits: d }) : '—');
export const loc = d => new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
export const fmt = d => d.toLocaleString('es-CL', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
export const hhmm = t => new Date(t).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
export const uid = () => Date.now() + Math.random();
export const load = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch (e) { return def; } };
export const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento disponible */ } };
