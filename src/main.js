import { createRoot } from 'react-dom/client';
import { html } from './react.js';
import { App } from './app.js';

createRoot(document.getElementById('root')).render(html`<${App}/>`);

// Service worker solo en la versión web (PWA); no en Capacitor ni Electron.
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.Capacitor) {
  addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
