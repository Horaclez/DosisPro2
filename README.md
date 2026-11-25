# DosisCL Pro

Cálculo clínico y ventanas de seguridad para enfermería en Chile. Funciona **100% sin Internet**.
Este repositorio genera automáticamente, con GitHub Actions:

- **APK de Android** (`DosisCL-Pro-android.apk`)
- **Instaladores de PC**: Windows (`.exe`), Linux (`.AppImage`) y macOS (`.dmg`)
- (Opcional) **Versión web instalable (PWA)** en GitHub Pages

> Herramienta de apoyo. No reemplaza la indicación médica, el protocolo institucional ni el doble chequeo independiente.
> Los rangos clínicos deben ser validados por farmacia clínica antes de uso asistencial.

## 1. Subir a GitHub (una sola vez)

1. Crea un repositorio nuevo en GitHub (puede ser privado).
2. Descomprime este ZIP y **sube todo su contenido a la raíz del repositorio** (que `package.json` y la carpeta `.github` queden en la raíz).
   Si usas la web de GitHub: *Add file → Upload files* y arrastra todos los archivos y carpetas (incluida `.github`).
3. Entra a la pestaña **Actions**: la compilación parte sola con cada subida a la rama `main`.

## 2. Descargar el APK y los instaladores

- Cuando termine el flujo "Compilar APK e instaladores" (unos 10–20 minutos), abre la ejecución y baja los **Artifacts**:
  `DosisCL-Pro-android` (APK), `DosisCL-Pro-windows-latest` (.exe), `DosisCL-Pro-ubuntu-latest` (.AppImage) y `DosisCL-Pro-macos-latest` (.dmg).
- Para tener **un enlace de descarga permanente**, crea una etiqueta de versión: en *Releases → Draft a new release* crea la etiqueta `v1.0.0`
  (o por terminal: `git tag v1.0.0 && git push origin v1.0.0`). Los archivos quedan publicados en la página de *Releases*.

### Instalación
- **Android**: copia el APK al celular y ábrelo (permite "instalar apps desconocidas"). Es un APK de depuración firmado con la clave de debug de Android:
  sirve para instalar y usar. Para publicar en Google Play necesitas un APK/AAB firmado con tu propia clave.
- **Windows**: ejecuta el `.exe`. Como no está firmado digitalmente, Windows puede mostrar "SmartScreen": *Más información → Ejecutar de todas formas*.
- **macOS**: abre el `.dmg` y arrastra la app. Al no estar firmada: clic derecho sobre la app → *Abrir*.
- **Linux**: `chmod +x DosisCL-Pro-*.AppImage` y ejecútalo.

## 3. Versión web instalable (PWA), opcional
*Settings → Pages → Source: GitHub Actions*, luego *Actions → Publicar versión web → Run workflow*.
Abre la dirección en Chrome o Edge y elige *Instalar aplicación*. Después de la primera visita funciona sin conexión.

## 4. Desarrollo local
Requisitos: Node.js 20 o superior.

```bash
npm install
npm run check    # prueba rápida: dibuja todas las pantallas y fármacos y revisa los datos
npm run build    # genera www/index.html (un solo archivo, sin Internet)
npm start        # abre la app de escritorio (Electron)
npm run dist     # genera el instalador de tu sistema en dist/
```

Android en tu PC (necesitas Android Studio): `npm run android`, luego `npx cap open android` y *Build → Build APK(s)*.

## 5. Dónde editar
- `src/data.js`: fármacos (dosis, presentaciones y rangos de seguridad), presets de BIC, pediatría, ajustes renales y compatibilidades.
- `src/metrics.js`: reglas de las barras de seguridad (mínimo / óptimo / máximo).
- `src/screens/`: cada pantalla (Piso, Inhalatoria, BIC, Sueros, Horarios, Pediatría, Renal, Seguridad, Turno).
- `src/styles.css`: diseños (temas) y estilos. Para crear un diseño nuevo copia un bloque `[data-theme=...]` y agrégalo en `THEMES` de `src/app.js`.
- Después de editar datos, ejecuta `npm run check`: avisa si algún fármaco queda con alertas con sus valores por defecto, nombres repetidos o errores.

## Datos del paciente
Peso, registros del turno, BIC y alarmas se guardan **solo en el dispositivo** (almacenamiento local). "Nuevo Paciente" los borra.
Los fármacos propios y el diseño elegido se conservan.
