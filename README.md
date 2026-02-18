# 🚀 ExpertCell Sales Academy — Guía de Instalación

## Lo que necesitas
- Cuenta de GitHub (ya la tienes ✅)
- Node.js instalado en tu computadora (descarga en https://nodejs.org — baja la versión LTS)
- Una API key de Anthropic (para que la IA funcione)

---

## PASO 1: Obtener tu API Key de Anthropic

1. Ve a **https://console.anthropic.com**
2. Crea una cuenta o inicia sesión
3. Ve a **API Keys** → **Create Key**
4. Copia la key (empieza con `sk-ant-...`)
5. ⚠️ **Guárdala en un lugar seguro**, la necesitarás después

---

## PASO 2: Preparar tu computadora

Abre la **Terminal** (Mac) o **Command Prompt / PowerShell** (Windows) y verifica que tienes Node.js:

```bash
node --version
```

Si sale algo como `v18.x.x` o `v20.x.x`, estás bien. Si no, instala Node.js desde https://nodejs.org

---

## PASO 3: Crear el repositorio en GitHub

1. Ve a **https://github.com/new**
2. Nombre del repositorio: `sales-academy`
3. Ponlo como **Public**
4. NO marques ninguna casilla (ni README, ni .gitignore)
5. Click en **Create repository**

---

## PASO 4: Subir el proyecto

En tu terminal, ejecuta estos comandos **uno por uno**:

```bash
# 1. Clonar el repo vacío (cambia TU_USUARIO por tu nombre de GitHub)
git clone https://github.com/TU_USUARIO/sales-academy.git

# 2. Copiar TODOS los archivos del proyecto dentro de la carpeta sales-academy
# (los archivos que descargaste de Claude: package.json, src/, public/)

# 3. Entrar a la carpeta
cd sales-academy

# 4. Instalar dependencias
npm install

# 5. Hacer el build
npm run build

# 6. Subir al repositorio
git add .
git commit -m "Sales Academy v1"
git push origin main
```

---

## PASO 5: Activar GitHub Pages

1. Ve a tu repositorio en GitHub: `https://github.com/TU_USUARIO/sales-academy`
2. Click en **Settings** (pestaña de arriba)
3. En el menú izquierdo, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. Click en **"create your own"** o busca el workflow de **Static HTML**

O más fácil, crea este archivo en tu repo:

Crea la carpeta `.github/workflows/` y dentro un archivo `deploy.yml` con esto:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build
      - uses: actions/deploy-pages@v4
```

6. Commit y push
7. Espera 2-3 minutos
8. Tu app estará en: **https://TU_USUARIO.github.io/sales-academy**

---

## PASO 6: Configurar la app

1. Abre tu app en el navegador: `https://TU_USUARIO.github.io/sales-academy`
2. Inicia sesión como admin:
   - **Nombre:** `admin`
   - **PIN:** `7741`
3. Ve a **Config IA** → pega tu API Key de Anthropic
4. Ve a **Agentes** → agrega a tus agentes con nombre y PIN
5. Ve a **Conocimiento** → edita/agrega las respuestas que quieras
6. Ve a **Instrucciones IA** → personaliza cómo responde el asistente

---

## PASO 7: Compartir con tus agentes

Comparte el link con tus agentes:
```
https://TU_USUARIO.github.io/sales-academy
```

Ellos entran con su nombre y PIN que tú les creaste.

### Desde celular:
Pueden agregar la app a su pantalla de inicio:
- **iPhone**: Safari → Compartir → "Agregar a pantalla de inicio"
- **Android**: Chrome → Menú (3 puntos) → "Agregar a pantalla de inicio"

Se verá como una app nativa 📱

---

## ⚠️ Notas importantes

- **Los datos se guardan en el navegador** (localStorage). Cada dispositivo tiene sus propios datos.
- **La API key se guarda solo en TU navegador** (el admin). Los agentes no la ven pero la usan a través de la app.
- **Para bloquear un agente**: entra como admin → Agentes → Bloquear. No podrá entrar.
- **Costo de la IA**: Cada mensaje usa la API de Anthropic. El costo es aprox $0.003 por mensaje (muy barato). Monitorea tu uso en console.anthropic.com.
- **Cambiar PIN de admin**: busca `pin === "7741"` en el código y cámbialo.

---

## 🔧 Solución de problemas

| Problema | Solución |
|----------|----------|
| "API key inválida" | Verifica que copiaste bien la key completa |
| La IA no responde | Revisa que tengas saldo en console.anthropic.com |
| No carga la página | Espera 5 min después de hacer deploy |
| Agente no puede entrar | Verifica que esté "Activo" en el panel admin |

---

## 📁 Estructura de archivos

```
sales-academy/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js          ← Todo el código de la app
│   └── index.js        ← Punto de entrada
├── package.json
└── README.md
```

¡Listo! Tu plataforma de entrenamiento con IA está en línea 🎉
