import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { DialogoRPG } from '../../components/game/DialogoRPG';
import { Particulas } from '../../components/effects/Particulas';
import { Lluvia } from '../../components/effects/Lluvia';
import { Boton } from '../../components/common/Boton';
import { Modal } from '../../components/common/Modal';
import { AudioPlayer } from '../../components/media/AudioPlayer';
import '../../styles/game.css';
import '../../styles/effects.css';

// Configuración del mapa del bosque (columnas x filas de tiles)
const MAPA_COLS = 18;
const MAPA_FILAS = 12;
const TILE_SIZE = 64;
const VELOCIDAD_JUGADOR = 3;

// Posiciones de animales en el mapa (col, fila)
const SPAWN_ANIMALES = [
  { animalId: 'rana-ojos-rojos', col: 4,  fila: 3 },
  { animalId: 'perezoso',        col: 10, fila: 2 },
  { animalId: 'lapa-roja',       col: 15, fila: 4 },
  { animalId: 'mono-congo',      col: 7,  fila: 7 },
  { animalId: 'quetzal',         col: 13, fila: 9 },
  { animalId: 'jaguar',          col: 2,  fila: 9 },
  { animalId: 'tortuga-baula',   col: 16, fila: 10},
  { animalId: 'manati',          col: 6,  fila: 10},
];

/**
 * MUNDO 1: Biodiversidad — Exploración tipo Pokémon en bosque tropical.
 */
export const MundoBiodiversidad = ({ onSalir }) => {
  const { data: fauna, loading } = useFetch('/json/fauna.json');
  const { ganarXP, desbloquearColeccionable, completarMundo, mostrarLogro, estado, navegarA } = useGame();
  const { arriba, abajo, izquierda, derecha, seEstaMoviendo } = useKeyboard();
  const { reproducirBGM, reproducirSFX, reproducirAmbiente } = useAudio();

  const [posJugador, setPosJugador] = useState({ x: 5 * TILE_SIZE, y: 5 * TILE_SIZE });
  const [direccion, setDireccion] = useState('abajo');
  const [animalEncontrado, setAnimalEncontrado] = useState(null);
  const [animalesVistos, setAnimalesVistos] = useState([]);
  const [mostrarEncuentro, setMostrarEncuentro] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lluvia, setLluvia] = useState(false);
  const [inventarioAbierto, setInventarioAbierto] = useState(false);
  const animacionRef = useRef(null);

  // Iniciar música y ambience
  useEffect(() => {
    reproducirBGM('/audio/musica/bosque.mp3', 0.35);
    reproducirAmbiente('/audio/ambiente/aves.mp3', 0.2);
    // Lluvia ocasional
    const timerLluvia = setTimeout(() => setLluvia(true), 15000);
    const timerParar = setTimeout(() => setLluvia(false), 25000);
    return () => { clearTimeout(timerLluvia); clearTimeout(timerParar); };
  }, []);

  // Loop de movimiento
  useEffect(() => {
    if (mostrarEncuentro) return;

    const mover = () => {
      setPosJugador(prev => {
        let { x, y } = prev;
        let nuevaDireccion = direccion;

        if (arriba)    { y -= VELOCIDAD_JUGADOR; nuevaDireccion = 'arriba'; }
        if (abajo)     { y += VELOCIDAD_JUGADOR; nuevaDireccion = 'abajo'; }
        if (izquierda) { x -= VELOCIDAD_JUGADOR; nuevaDireccion = 'izquierda'; }
        if (derecha)   { x += VELOCIDAD_JUGADOR; nuevaDireccion = 'derecha'; }

        if (nuevaDireccion !== direccion) setDireccion(nuevaDireccion);

        // Límites del mapa
        x = Math.max(0, Math.min(x, (MAPA_COLS - 1) * TILE_SIZE));
        y = Math.max(0, Math.min(y, (MAPA_FILAS - 1) * TILE_SIZE));
        return { x, y };
      });
    };

    animacionRef.current = setInterval(mover, 16);
    return () => clearInterval(animacionRef.current);
  }, [arriba, abajo, izquierda, derecha, mostrarEncuentro, direccion]);

  // Detectar colisión con animales
  useEffect(() => {
    if (!fauna || mostrarEncuentro) return;
    const colision = 50;

    for (const spawn of SPAWN_ANIMALES) {
      if (animalesVistos.includes(spawn.animalId)) continue;
      const animalX = spawn.col * TILE_SIZE;
      const animalY = spawn.fila * TILE_SIZE;
      const distX = Math.abs(posJugador.x - animalX);
      const distY = Math.abs(posJugador.y - animalY);
      if (distX < colision && distY < colision) {
        const animal = fauna.find(a => a.id === spawn.animalId);
        if (animal) {
          reproducirSFX('/audio/efectos/encuentro.mp3', 0.6);
          setAnimalEncontrado(animal);
          setMostrarEncuentro(true);
          setOpcionSeleccionada(null);
          setFeedback(null);
          break;
        }
      }
    }
  }, [posJugador, fauna, animalesVistos, mostrarEncuentro]);

  // Teclado para tocar animales en móvil / interacción
  const interactuar = useCallback(() => {
    if (mostrarEncuentro || !fauna) return;
    // Encontrar el animal más cercano
    let mejorAnimal = null, mejorDist = Infinity;
    for (const spawn of SPAWN_ANIMALES) {
      if (animalesVistos.includes(spawn.animalId)) continue;
      const dist = Math.hypot(posJugador.x - spawn.col * TILE_SIZE, posJugador.y - spawn.fila * TILE_SIZE);
      if (dist < 100 && dist < mejorDist) {
        mejorDist = dist;
        mejorAnimal = fauna.find(a => a.id === spawn.animalId);
      }
    }
    if (mejorAnimal) {
      setAnimalEncontrado(mejorAnimal);
      setMostrarEncuentro(true);
    }
  }, [fauna, posJugador, animalesVistos, mostrarEncuentro]);

  const responderPregunta = (opcionIndex) => {
    if (!animalEncontrado || opcionSeleccionada !== null) return;
    setOpcionSeleccionada(opcionIndex);
    const esCorrecta = opcionIndex === 1; // La opción correcta en fauna es siempre el hábitat real
    // Verificar con el dato real del JSON
    const opciones = generarOpciones(animalEncontrado);
    const correcta = opciones.findIndex(o => o.correcta);
    const acierto = opcionIndex === correcta;

    const xpGanada = acierto ? animalEncontrado.xpAlResponder : Math.floor(animalEncontrado.xpAlEncontrar / 2);
    ganarXP(xpGanada, `Encuentro: ${animalEncontrado.nombre}`);
    desbloquearColeccionable(animalEncontrado.id, {
      icono: animalEncontrado.emoji,
      nombre: animalEncontrado.nombre,
      descripcion: `¡Encontrado en el bosque!`,
    });
    setFeedback({ acierto, xpGanada, explicacion: animalEncontrado.descripcion.slice(0, 150) + '...' });
    reproducirSFX(acierto ? '/audio/efectos/victoria.mp3' : '/audio/efectos/error.mp3', 0.6);
  };

  const cerrarEncuentro = () => {
    if (animalEncontrado) {
      setAnimalesVistos(prev => [...prev, animalEncontrado.id]);
    }
    setMostrarEncuentro(false);
    setAnimalEncontrado(null);
    setFeedback(null);
    setOpcionSeleccionada(null);

    // Verificar si completó todos los animales
    if (animalesVistos.length + 1 >= SPAWN_ANIMALES.length) {
      setTimeout(() => {
        completarMundo('biodiversidad', 3, 800);
        mostrarLogro({ icono: '🌿', nombre: '¡Guardián del Bosque!', descripcion: 'Encontraste todos los animales.' });
      }, 500);
    }
  };

  // Generar opciones para el reto del animal
  const generarOpciones = (animal) => {
    const correcta = animal.habitats[0];
    const distractores = ['Desierto árido', 'Tundra ártica', 'Pradera seca', 'Zona urbana', 'Manglar costero'].filter(d => d !== correcta);
    const opciones = [
      { texto: distractores[0], correcta: false },
      { texto: correcta, correcta: true },
      { texto: distractores[1], correcta: false },
      { texto: distractores[2], correcta: false },
    ].sort(() => Math.random() - 0.5);
    return opciones;
  };

  // Offset de cámara centrado en el jugador
  const camaraX = Math.min(Math.max(posJugador.x - window.innerWidth / 2, 0), MAPA_COLS * TILE_SIZE - window.innerWidth);
  const camaraY = Math.min(Math.max(posJugador.y - (window.innerHeight - 80) / 2, 0), MAPA_FILAS * TILE_SIZE - (window.innerHeight - 80));

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--verde-selva)' }}><div className="loading-dots"><span /><span /><span /></div></div>;

  const opciones = animalEncontrado ? generarOpciones(animalEncontrado) : [];

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#1a3a1a', userSelect: 'none' }}>
      {/* HUD */}
      <HUD enMundo onToggleInventario={() => setInventarioAbierto(p => !p)} onSalir={onSalir} />

      {/* Efectos atmosféricos */}
      <Particulas cantidad={15} tipo="hojas" velocidad={0.7} />
      {lluvia && <Lluvia intensidad={1} />}

      {/* Mundo - Vista de cámara */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: MAPA_COLS * TILE_SIZE,
            height: MAPA_FILAS * TILE_SIZE,
            transform: `translate(${-camaraX}px, ${-camaraY}px)`,
            transition: 'transform 0.05s linear',
          }}
        >
          {/* Tiles del mapa */}
          {Array.from({ length: MAPA_FILAS }, (_, fila) =>
            Array.from({ length: MAPA_COLS }, (_, col) => {
              const esBorde = col === 0 || col === MAPA_COLS - 1 || fila === 0 || fila === MAPA_FILAS - 1;
              const esAgua = fila === 10 || fila === 11;
              const esCamino = (col === 8 && fila >= 3 && fila <= 9) || (fila === 6 && col >= 3 && col <= 13);
              let color = esBorde ? '#1a3a1a' : esAgua ? '#1565c0' : esCamino ? '#6d4c41' : `hsl(${120 + (col * fila % 10)}deg, ${55 + (col % 10)}%, ${22 + (fila % 5)}%)`;
              return (
                <div key={`${col}-${fila}`} style={{ position: 'absolute', left: col * TILE_SIZE, top: fila * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, background: color, border: '1px solid rgba(0,0,0,0.1)' }} />
              );
            })
          )}

          {/* Árboles decorativos */}
          {[{c:1,f:1},{c:3,f:1},{c:5,f:1},{c:9,f:1},{c:11,f:1},{c:14,f:1},{c:17,f:1},{c:1,f:3},{c:2,f:5},{c:5,f:4},{c:1,f:7},{c:3,f:8},{c:14,f:2},{c:16,f:3},{c:17,f:5},{c:15,f:7},{c:4,f:10},{c:11,f:9},{c:12,f:7},{c:9,f:8}].map((pos, i) => (
            <div key={`arbol-${i}`} className="arbol arbol-viento" style={{ left: pos.c * TILE_SIZE + 8, top: pos.f * TILE_SIZE - 30, position: 'absolute', zIndex: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50% 50% 40% 40%', background: `hsl(${115 + i * 7 % 20}deg, 60%, ${25 + i % 10}%)`, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
              <div style={{ width: 12, height: 20, background: '#5d4037', margin: '0 auto', borderRadius: 2 }} />
            </div>
          ))}

          {/* Sprites de animales en el mapa */}
          {SPAWN_ANIMALES.map(spawn => {
            if (animalesVistos.includes(spawn.animalId)) return null;
            const animal = fauna?.find(a => a.id === spawn.animalId);
            return (
              <div
                key={spawn.animalId}
                style={{ position: 'absolute', left: spawn.col * TILE_SIZE, top: spawn.fila * TILE_SIZE, zIndex: 20, cursor: 'pointer', animation: 'float 2.5s ease-in-out infinite', fontSize: '2.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
                onClick={() => {
                  setAnimalEncontrado(animal);
                  setMostrarEncuentro(true);
                }}
                aria-label={`Animal: ${animal?.nombre || spawn.animalId}`}
                role="button"
                tabIndex={0}
              >
                {animal?.emoji || '🐾'}
              </div>
            );
          })}

          {/* Jugador */}
          <div
            style={{
              position: 'absolute',
              left: posJugador.x,
              top: posJugador.y,
              zIndex: 30,
              fontSize: '2rem',
              transition: 'left 0.05s linear, top 0.05s linear',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
              animation: seEstaMoviendo ? 'none' : 'jugador-idle 2s ease-in-out infinite',
            }}
            aria-label="Tu personaje"
          >
            🧑‍🌾
            {/* Indicador de dirección */}
            {seEstaMoviendo && (
              <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, background: 'var(--dorado)', borderRadius: '50%', animation: 'pulse 0.3s ease-in-out infinite' }} />
            )}
          </div>
        </div>
      </div>

      {/* Instrucciones de control */}
      <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 100, background: 'rgba(0,0,0,0.7)', borderRadius: 12, padding: '8px 14px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
        🕹️ WASD o flechas para moverte · Acércate a los animales para encontrarlos
      </div>

      {/* Contador de animales */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100, background: 'rgba(0,0,0,0.7)', borderRadius: 12, padding: '8px 14px', fontSize: '0.8rem', color: 'var(--verde-claro)', backdropFilter: 'blur(8px)' }}>
        🦎 {animalesVistos.length}/{SPAWN_ANIMALES.length} animales encontrados
      </div>

      {/* Joystick Virtual (móvil) */}
      <div style={{ position: 'fixed', bottom: 80, left: 30, zIndex: 200 }} className="joystick-container">
        <div className="joystick-base">
          <div className="joystick-thumb" />
        </div>
      </div>

      {/* OVERLAY DE ENCUENTRO CON ANIMAL */}
      {mostrarEncuentro && animalEncontrado && (
        <div className="encuentro-overlay" role="dialog" aria-modal="true" aria-label={`Encuentro con ${animalEncontrado.nombre}`}>
          <div className="encuentro-panel" style={{ maxWidth: 700, width: '90%' }}>
            {/* Imagen/emoji del animal */}
            <div className="encuentro-animal-placeholder" style={{ fontSize: '7rem' }}>
              {animalEncontrado.emoji}
            </div>

            <div className="encuentro-nombre">{animalEncontrado.nombre}</div>
            <div className="encuentro-nombre-cientifico">{animalEncontrado.nombreCientifico}</div>
            <div className="encuentro-descripcion" style={{ maxHeight: 80, overflow: 'hidden' }}>
              {animalEncontrado.descripcion.slice(0, 180)}...
            </div>

            {!feedback ? (
              /* Pregunta del reto */
              <div>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dorado)', marginBottom: '1rem', textAlign: 'center' }}>
                  🌿 ¿En qué hábitat vive el {animalEncontrado.nombre}?
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {opciones.map((op, i) => (
                    <button
                      key={i}
                      onClick={() => responderPregunta(i)}
                      disabled={opcionSeleccionada !== null}
                      aria-label={`Opción: ${op.texto}`}
                      style={{
                        background: opcionSeleccionada === i ? (op.correcta ? 'rgba(64,145,108,0.4)' : 'rgba(249,65,68,0.3)') : 'rgba(255,255,255,0.08)',
                        border: `2px solid ${opcionSeleccionada === i ? (op.correcta ? 'var(--verde-claro)' : 'var(--color-vida)') : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 12,
                        padding: '12px 16px',
                        color: 'white',
                        cursor: opcionSeleccionada !== null ? 'not-allowed' : 'pointer',
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        transform: opcionSeleccionada === null ? 'none' : 'scale(0.98)',
                      }}
                    >
                      {op.texto}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Feedback de la respuesta */
              <div className="anim-slide-up" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{feedback.acierto ? '🎉' : '😅'}</p>
                <h3 style={{ color: feedback.acierto ? 'var(--verde-claro)' : 'var(--rojo-lapa)', marginBottom: '0.5rem' }}>
                  {feedback.acierto ? '¡Correcto!' : 'No exactamente...'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {feedback.explicacion}
                </p>
                <div style={{ background: 'rgba(233,196,106,0.2)', borderRadius: 10, padding: '8px 16px', display: 'inline-block', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--dorado)', fontWeight: 700 }}>+{feedback.xpGanada} XP</span>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <p style={{ color: 'var(--dorado)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>En inglés:</p>
                  <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    🇬🇧 {animalEncontrado.descripcionIngles}
                  </p>
                </div>
                {animalEncontrado.datoCurioso && (
                  <div style={{ marginTop: '1rem', background: 'rgba(64,145,108,0.15)', borderLeft: '3px solid var(--verde-claro)', borderRadius: '0 8px 8px 0', padding: '10px 14px', textAlign: 'left' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--verde-claro)', fontWeight: 700, marginBottom: 4 }}>💡 Dato Curioso:</p>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{animalEncontrado.datoCurioso}</p>
                  </div>
                )}
                <div style={{ marginTop: '1.5rem' }}>
                  <Boton variante="dorado" onClick={cerrarEncuentro} ariaLabel="Continuar explorando">
                    ¡Seguir explorando! 🌿
                  </Boton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
