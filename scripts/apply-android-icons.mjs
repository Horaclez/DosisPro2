// Copia los iconos personalizados de DosisCL Pro al proyecto Android generado por Capacitor.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'build', 'android-res');
const dst = path.join(root, 'android', 'app', 'src', 'main', 'res');

if (!fs.existsSync(dst)) {
  console.error('No existe android/app/src/main/res. Ejecuta primero: npx cap add android');
  process.exit(1);
}

fs.cpSync(src, dst, { recursive: true, force: true });
console.log('Iconos de Android aplicados correctamente en android/app/src/main/res');
