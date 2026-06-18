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
│   ├── common/     # Boton, BotonVolver, Modal, BarraVida
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

##  Recursos Multimedia Integrados

Todos los recursos multimedia (imágenes, audio, video y SVGs) ya están integrados en el repositorio dentro de la carpeta `/public`. Han sido cuidadosamente seleccionados bajo licencias de uso libre y están listos para utilizarse sin configuraciones extra:

- **Imágenes (`/public/images/`)**: Fotografías en formato `.webp` de alta calidad sobre la fauna (quetzal, perezoso, etc.), mapas, fondos inmersivos y elementos culturales de Costa Rica.
- **Audio (`/public/audio/`)**: Música ambiental temática para cada mundo, efectos de sonido interactivos (botones, victorias, recolecciones) y sonidos naturales de fondo (aves, viento, olas).
- **Video (`/public/video/`)**: Video cinemático en MP4 utilizado como fondo inmersivo en la pantalla principal.
- **Gráficos Vectoriales**: Archivo `mapa.svg` interactivo con los *paths* precisos de todas las provincias costarricenses.

Para conocer las licencias detalladas, créditos a los autores y las URLs de las fuentes originales de cada recurso (Unsplash, Pixabay, Freesound, etc.), por favor consulta el documento [REFERENCIAS.md](./REFERENCIAS.md) incluido en este repositorio.

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

## 👤 Autor

**Bryan Josué Calderón Espinoza**
IF7102 — Multimedios
I Ciclo 2026 — Universidad de Costa Rica, Sede Regional Guanacaste
