# 🇨🇷 Guardianes de Costa Rica

> **Videojuego educativo interactivo** sobre la biodiversidad, geografía, cultura e idioma de Costa Rica.
>
> Proyecto Final — IF7102 Multimedios · I Ciclo 2026 · Universidad de Costa Rica, Sede Guanacaste

---

##  Descripción del Proyecto

**Guardianes de Costa Rica** es un videojuego educativo de exploración 2D desarrollado con React 19 y Vite. El jugador asume el rol de un Guardián que recorre Costa Rica, descubriendo su fauna, provincias, tradiciones culturales y practicando inglés.

El juego incluye:
- **4 mundos únicos** con mecánicas de juego distintas
- **Sistema RPG** con experiencia, niveles e insignias
- **Coleccionables** desbloqueables
- **Sonido ambiental**, música por mundo y efectos de sonido
- **Video de fondo** en la pantalla principal
- **Efectos visuales**: partículas, lluvia, niebla, glassmorphism
- Persistencia del progreso con `localStorage`

---

##  Los 4 Mundos

| Mundo | Temática | Mecánica |
|-------|----------|----------|
|  **El Bosque Vivo** | Biodiversidad | Exploración top-down. Encuentra animales, aprende sus hábitats. |
|  **Provincias del Paraíso** | Geografía | Mapa SVG interactivo de las 7 provincias. |
|  **El Pueblo Tico** | Cultura | Recolección de símbolos y tradiciones en un pueblo. |
|  **Mundo Bilingüe** | Inglés | Conversaciones RPG con turistas de todo el mundo. |

---

##  Tecnologías Utilizadas

- **React 19** — Framework JavaScript principal
- **Vite 5** — Bundler y servidor de desarrollo
- **JavaScript (ES2022+)** — Sin TypeScript
- **pnpm** — Gestor de paquetes
- **CSS Vanilla** — Sin Bootstrap ni Tailwind. Sistema de diseño propio.
- **Context API** — Estado global del juego (XP, niveles, coleccionables)
- **Hooks personalizados** — `useGame`, `useFetch`, `useKeyboard`, `useAudio`, `useGameLoop`

---

##  Arquitectura del Proyecto

```text
src/
├── components/
│   ├── common/     # Boton, Modal, BarraVida, Temporizador
│   ├── effects/    # Particulas, Lluvia
│   ├── game/       # DialogoRPG
│   ├── hud/        # HUD, LogroPopup
│   ├── media/      # AudioPlayer, VideoPlayer
│   └── screens/    # PantallaCarga
├── context/
│   └── GameContext.jsx  # Estado global RPG
├── hooks/
│   ├── useGame.js
│   ├── useFetch.js      # fetch() de JSONs
│   ├── useKeyboard.js   # WASD + flechas
│   └── useAudio.js      # BGM + SFX
├── pages/
│   ├── HomeScreen.jsx
│   ├── MapaMundi.jsx
│   ├── Coleccionables.jsx
│   ├── Perfil.jsx
│   └── Creditos.jsx
├── worlds/
│   ├── biodiversidad/
│   ├── geografia/
│   ├── cultura/
│   └── ingles/
└── styles/
    ├── index.css     # Variables, reset, tipografía
    ├── effects.css   # Partículas, lluvia, transiciones
    ├── game.css      # Motor de juego 2D
    ├── hud.css       # HUD, inventario, logros
    └── screens.css   # Pantallas cinemáticas

public/
├── json/             # Datos cargados mediante fetch()
│   ├── fauna.json
│   ├── provincias.json
│   ├── cultura.json
│   ├── ingles.json
│   └── historia.json
├── audio/
│   ├── musica/
│   ├── efectos/
│   └── ambiente/
├── video/
└── images/
```

---

##  Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/BryanCalderon25/JuegoInmersivo-ProyectoMultimedios.git
cd JuegoInmersivo-ProyectoMultimedios

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Construir para producción
pnpm build

# Previsualizar la build
pnpm preview
```

El proyecto estará disponible en `http://localhost:5173`

---

##  Recursos Multimedia

### Imágenes necesarias (descargar y colocar en `/public/images/`)

| Carpeta | Archivos |
|---------|----------|
| `fondos/` | `bosque-fondo.webp`, `playa-fondo.webp`, `montaña-fondo.webp`, `pueblo-fondo.webp` |
| `fauna/` | `quetzal.webp`, `tortuga-baula.webp`, `jaguar.webp`, `perezoso.webp`, `lapa-roja.webp`, `rana-ojos-rojos.webp`, `mono-congo.webp`, `manati.webp` |
| `provincias/` | `san-jose.webp`, `alajuela.webp`, `cartago.webp`, `heredia.webp`, `guanacaste.webp`, `puntarenas.webp`, `limon.webp` |
| `cultura/` | `carreta-sarchi.webp`, `marimba.webp`, `yiguirro.webp`, `gallopinto.webp`, `bandera-cr.png`, `escudo-cr.png` |

### Audios necesarios (colocar en `/public/audio/`)

| Carpeta | Archivos |
|---------|----------|
| `musica/` | `menu-principal.mp3`, `bosque.mp3`, `aventura.mp3`, `pueblo.mp3`, `rpg-ingles.mp3` |
| `efectos/` | `clic.mp3`, `victoria.mp3`, `error.mp3`, `coleccionable.mp3`, `encuentro.mp3` |
| `ambiente/` | `aves.mp3`, `rio.mp3`, `olas.mp3`, `viento.mp3` |

### Videos necesarios (`/public/video/`)
- `intro.mp4` — Video de naturaleza de Costa Rica (15-30 segundos, para el fondo del menú)

**Fuentes gratuitas recomendadas:**
-  Imágenes: [Unsplash](https://unsplash.com) · [Pexels](https://pexels.com)
-  Música: [Pixabay Music](https://pixabay.com/music)
-  SFX: [Freesound.org](https://freesound.org) · [Pixabay SFX](https://pixabay.com/sound-effects)
-  Videos: [Pexels Videos](https://pexels.com/videos)

### Mapa SVG
Colocar el archivo `mapa.svg` en `/public/mapa.svg` con las provincias de Costa Rica como paths interactivos.

---

##  Dependencias

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.2.0"
  }
}
```

---

## ✅ Cumplimiento del Enunciado IF7102

| Requisito | Estado |
|-----------|--------|
| React + Vite | ✅ React 19 + Vite 5 |
| pnpm | ✅ Todos los comandos con pnpm |
| JavaScript (sin TypeScript) | ✅ Solo .jsx y .js |
| Mínimo 4 componentes reutilizables | ✅ 15+ componentes |
| JSON cargados con fetch() | ✅ useFetch hook en 5 archivos JSON |
| Responsive | ✅ CSS responsive, joystick táctil |
| Multimedia (audio, video, imágenes) | ✅ AudioPlayer, VideoPlayer, efectos |
| README | ✅ Este archivo |
| REFERENCIAS.md | ✅ Ver REFERENCIAS.md |
| Código limpio | ✅ Componentes pequeños, hooks, utils |
| Arquitectura profesional | ✅ Separación por capas y dominio |

---

## 👤 Autor

**Bryan Josué Calderón Espinoza**
IF7102 — Multimedios
I Ciclo 2026 — Universidad de Costa Rica, Sede Regional Guanacaste
