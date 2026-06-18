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
  const [introVisible, setIntroVisible] = useState(true);
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
    if (mostrarEncuentro || introVisible) return;

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
          reproducirSFX(animal.sonido || '/audio/efectos/victoria.mp3', 0.6);
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
    if (!animalEncontrado || !animalEncontrado.desafio || opcionSeleccionada !== null) return;
    setOpcionSeleccionada(opcionIndex);
    
    const acierto = opcionIndex === animalEncontrado.desafio.respuestaCorrecta;

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

  // Offset de cámara centrado en el jugador
  const camaraX = Math.min(Math.max(posJugador.x - window.innerWidth / 2, 0), MAPA_COLS * TILE_SIZE - window.innerWidth);
  const camaraY = Math.min(Math.max(posJugador.y - (window.innerHeight - 80) / 2, 0), MAPA_FILAS * TILE_SIZE - (window.innerHeight - 80));

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--verde-selva)' }}><div className="loading-dots"><span /><span /><span /></div></div>;

  const opciones = animalEncontrado?.desafio?.opciones || [];

  return (
    <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: 'url(/images/fondos/bosque-fondo.webp) center/cover no-repeat fixed', userSelect: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 20, 10, 0.4)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
      
      {/* PANTALLA INTRODUCTORIA */}
      {introVisible && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5, 20, 10, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)' }}>
          <div className="anim-slide-up" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(64,145,108,0.5)', borderRadius: 24, padding: '3rem', maxWidth: 600, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🌿</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>Mundo 1: Biodiversidad</h2>
            <p style={{ color: 'var(--verde-claro)', fontWeight: 600, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>El Pulmón del Mundo</p>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Costa Rica posee casi el 6% de la biodiversidad mundial. Tu misión es explorar este bosque lluvioso y encontrar a las especies ocultas.
              </p>
              <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>🕹️ Usa las teclas <strong>W, A, S, D</strong> o las flechas para moverte.</li>
                <li>🐾 Acércate a los animales escondidos para interactuar con ellos.</li>
                <li>🧠 Responde correctamente sus desafíos para ganar XP.</li>
              </ul>
            </div>
            
            <Boton variante="dorado" tamaño="lg" onClick={() => setIntroVisible(false)} icono="🚀">
              ¡Comenzar Expedición!
            </Boton>
          </div>
        </div>
      )}

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
              
              let style = {
                position: 'absolute', left: col * TILE_SIZE, top: fila * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE,
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.02)'
              };

              if (esBorde) {
                style.background = 'rgba(10, 30, 15, 0.85)';
                style.backdropFilter = 'blur(10px)';
              } else if (esAgua) {
                style.background = 'rgba(21, 101, 192, 0.4)';
                style.backdropFilter = 'blur(4px)';
              } else if (esCamino) {
                style.background = 'rgba(109, 76, 65, 0.5)';
                style.backdropFilter = 'blur(2px)';
              }

              return (
                <div key={`${col}-${fila}`} style={style} />
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

      {/* OVERLAY ESPECTACULAR DE ENCUENTRO CON ANIMAL */}
      {mostrarEncuentro && animalEncontrado && (
        <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'rgba(5, 20, 10, 0.9)', backdropFilter: 'blur(15px)', padding: '2rem 1rem' }}>
          <div className="anim-zoom-in" style={{ margin: 'auto', background: 'linear-gradient(145deg, rgba(20,50,30,0.95), rgba(10,30,15,0.95))', border: `2px solid var(--verde-hoja)`, borderRadius: 30, padding: '3rem', maxWidth: 800, width: '100%', textAlign: 'center', boxShadow: `0 20px 60px rgba(64,145,108,0.4)`, position: 'relative' }}>
            
            {/* Imagen/emoji del animal gigante */}
            <div style={{ fontSize: '6rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite', filter: 'drop-shadow(0 0 20px rgba(64,145,108,0.8))' }}>
              {animalEncontrado.emoji}
            </div>

            <h2 style={{ color: 'var(--verde-claro)', fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.2rem' }}>
              {animalEncontrado.nombre}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: '1.5rem', fontSize: '1rem' }}>
              {animalEncontrado.nombreCientifico}
            </p>
            
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
              {animalEncontrado.descripcion.slice(0, 180)}...
            </p>

            {!feedback ? (
              /* Pregunta del reto */
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dorado)', marginBottom: '2rem', textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                  ❓ {animalEncontrado.desafio?.pregunta}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  {opciones.map((opTexto, i) => {
                    const esCorrecta = i === animalEncontrado.desafio?.respuestaCorrecta;
                    return (
                    <button
                      key={i}
                      onClick={() => responderPregunta(i)}
                      disabled={opcionSeleccionada !== null}
                      style={{
                        background: opcionSeleccionada === i ? (esCorrecta ? 'rgba(64,145,108,0.8)' : 'rgba(249,65,68,0.6)') : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${opcionSeleccionada === i ? (esCorrecta ? 'var(--verde-claro)' : 'var(--color-vida)') : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: 16, padding: '1.2rem', color: 'white', cursor: opcionSeleccionada !== null ? 'not-allowed' : 'pointer', fontSize: '1.1rem', fontWeight: 600, transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => { if (opcionSeleccionada === null) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; } }}
                      onMouseLeave={e => { if (opcionSeleccionada === null) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                    >
                      {opTexto}
                    </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Feedback Espectacular */
              <div className="anim-slide-up" style={{ marginTop: '2rem', padding: '2rem', background: feedback.acierto ? 'rgba(64,145,108,0.15)' : 'rgba(249,65,68,0.15)', borderRadius: 20, border: `2px solid ${feedback.acierto ? 'var(--verde-claro)' : 'var(--color-vida)'}` }}>
                <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{feedback.acierto ? '🎉' : '😅'}</p>
                <h3 style={{ color: feedback.acierto ? 'var(--verde-claro)' : 'var(--rojo-lapa)', marginBottom: '1rem', fontSize: '1.8rem', fontWeight: 900 }}>
                  {feedback.acierto ? '¡Excelente Trabajo!' : 'Casi...'}
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {feedback.explicacion}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: 50, color: 'var(--dorado)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '2rem' }}>
                  <span>🌟</span> +{feedback.xpGanada} XP
                </div>
                
                {animalEncontrado.datoCurioso && (
                  <div style={{ marginTop: '1rem', background: 'rgba(64,145,108,0.2)', borderLeft: '4px solid var(--verde-claro)', borderRadius: '0 12px 12px 0', padding: '16px 20px', textAlign: 'left', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--verde-claro)', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>💡 Dato Curioso</p>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{animalEncontrado.datoCurioso}</p>
                  </div>
                )}
                
                <div>
                  <Boton variante="dorado" tamaño="lg" onClick={cerrarEncuentro} icono="🌿">
                    ¡Seguir Explorando!
                  </Boton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
