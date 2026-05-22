# ⚔️ DADAC — Una aventura aritmética

> Un RPG matemático protagonizado por **Dahiana**, **David** y **Cristian**, los últimos campeones capaces de restaurar el equilibrio numérico del universo.

![Stack](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![Pages](https://img.shields.io/badge/GitHub-Pages-181717)

---

## 🎮 Características

- **3 campeones jugables** con poderes únicos
  - 🏹 **Dahiana** — *Visión Aritmética*: elimina una respuesta incorrecta
  - ⚔️ **David** — *Drenaje Arcano*: salta la pregunta actual sin recibir daño
  - 🧙‍♂️ **Cristian** — *Revelación del Sabio*: revela una pista útil
- **5 mundos** con narrativa progresiva (con tiempo y sin tiempo)
- **8 villanos** únicos con frases personalizadas
- **Desafío de la Trinidad** ⚡ — preguntas especiales de regla de tres con los 3 poderes activos automáticamente
- **15+ adivinanzas** matemáticas
- **8 preguntas** de regla de tres
- **Sistema de combos** con bonus de daño
- **Sonidos sintéticos** con Web Audio API (sin archivos externos)
- **100% responsive** — funciona en celular, tablet y desktop
- Easter egg: **¡QUÉ CRACK!** 🔥

---

## 🛠️ Instalación local

```bash
# 1. Instalar dependencias
npm install

# 2. Modo desarrollo (hot reload)
npm run dev

# 3. Build de producción
npm run build

# 4. Previsualizar el build
npm run preview
```

Abrir http://localhost:5173 en el navegador.

---

## 🚀 Subir a GitHub Pages

### Paso 1: Crear el repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un nuevo repositorio llamado **`dadac`** (importante: el nombre debe coincidir)
3. **No** marques "Add README" (ya tenemos uno)

### Paso 2: Si quieres usar otro nombre de repo

Si vas a llamar al repo distinto (ejemplo: `mi-juego`), edita `vite.config.js`:

```js
base: '/mi-juego/',  // <-- cambia aquí
```

### Paso 3: Subir el código

Dentro de la carpeta del proyecto:

```bash
git init
git add .
git commit -m "DADAC: primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/dadac.git
git push -u origin main
```

### Paso 4: Activar GitHub Pages

1. En GitHub, entra a tu repo
2. Ve a **Settings** → **Pages**
3. En "Build and deployment" → "Source", selecciona **GitHub Actions**
4. ¡Listo! El workflow `.github/workflows/deploy.yml` desplegará automáticamente

### Paso 5: ¡Jugar!

Después de 1–2 minutos, tu juego estará en:

```
https://TU_USUARIO.github.io/dadac/
```

Cada vez que hagas `git push` a `main`, se desplegará automáticamente la nueva versión.

---

## 📱 Compatibilidad

- ✅ Desktop (Chrome, Firefox, Safari, Edge)
- ✅ Tablet (iPad, Android)
- ✅ Celular (vertical y horizontal)
- ✅ Adaptable hasta 320px de ancho

---

## 📂 Estructura del proyecto

```
dadac/
├── .github/workflows/deploy.yml   # CI/CD automático
├── index.html                      # HTML root
├── package.json                    # Dependencias
├── vite.config.js                  # Configuración Vite + base path
└── src/
    ├── main.jsx                    # Entry point React
    ├── App.jsx                     # Componente principal del juego
    ├── gameData.js                 # Datos: villanos, mundos, adivinanzas
    ├── gameLogic.js                # Generadores de preguntas y pistas
    ├── sounds.js                   # Web Audio API (sonidos sintéticos)
    └── index.css                   # Estilos globales + responsive
```

---

## 🎯 Cómo jugar

1. Responde correctamente para atacar al enemigo
2. Cada 2 respuestas correctas, los poderes se cargan
3. Toca a un héroe cuando su barra brille para usar su poder
4. ¡Aparece el **Desafío de la Trinidad** cada 4 preguntas! Los 3 poderes se activan automáticamente
5. Derrota al **Rey Caos** para restaurar el equilibrio del universo

---

Hecho con ❤️ para Dahiana, David y Cristian.
