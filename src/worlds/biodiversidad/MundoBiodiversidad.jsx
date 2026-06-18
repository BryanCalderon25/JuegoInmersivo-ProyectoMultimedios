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
import { PantallaDerrota } from '../../components/game/PantallaDerrota';
import { PantallaVictoria } from '../../components/game/PantallaVictoria';
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

  const { ganarXP, perderXP, desbloquearColeccionable, completarMundo, mostrarLogro, estado, navegarA } = useGame();
  const { arriba, abajo, izquierda, derecha, seEstaMoviendo } = useKeyboard();
  const { reproducirBGM, reproducirSFX, reproducirAmbiente } = useAudio();

  const [posJugador, setPosJugador] = useState({ x: 5 * TILE_SIZE, y: 5 * TILE_SIZE });
  const [direccion, setDireccion] = useState('abajo');
  const [animalEncontrado, setAnimalEncontrado] = useState(null);
  const [animalesVistos, setAnimalesVistos] = useState(() => {
    const guardados = localStorage.getItem('guardianes_cr_bio_animales');
    return guardados ? JSON.parse(guardados) : [];
  });
  const [mostrarEncuentro, setMostrarEncuentro] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [lluvia, setLluvia] = useState(false);
  const [inventarioAbierto, setInventarioAbierto] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState(60);
  const [derrota, setDerrota] = useState(false);
  const [mostrarVictoria, setMostrarVictoria] = useState(false);
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

  // Timer de 60 segundos
  useEffect(() => {
    if (introVisible || mostrarEncuentro || derrota || animalesVistos.length >= SPAWN_ANIMALES.length) return;
    const timer = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          perderXP(20, 'Tiempo agotado en Biodiversidad');
          setDerrota(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [introVisible, mostrarEncuentro, derrota, animalesVistos]);

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

  useEffect(() => {
    localStorage.setItem('guardianes_cr_bio_animales', JSON.stringify(animalesVistos));
  }, [animalesVistos]);

  const responderPregunta = (opcionIndex) => {
    if (!animalEncontrado || !animalEncontrado.desafio || opcionSeleccionada !== null) return;
    setOpcionSeleccionada(opcionIndex);
    
    const acierto = opcionIndex === animalEncontrado.desafio.respuestaCorrecta;

    if (acierto) {
      const xpGanada = animalEncontrado.xpAlResponder;
      ganarXP(xpGanada, `Encuentro: ${animalEncontrado.nombre}`);
      desbloquearColeccionable(animalEncontrado.id, {
        icono: animalEncontrado.emoji,
        nombre: animalEncontrado.nombre,
        descripcion: `¡Encontrado en el bosque!`,
      });
      setFeedback({ acierto, xpGanada, explicacion: animalEncontrado.descripcion.slice(0, 150) + '...' });
    } else {
      const xpPerdida = 10;
      perderXP(xpPerdida, `Fallo al identificar animal`);
      setFeedback({ acierto, xpGanada: -xpPerdida, explicacion: 'La respuesta es incorrecta, has asustado al animal.' });
    }
    reproducirSFX(acierto ? '/audio/efectos/victoria.mp3' : '/audio/efectos/error.mp3', 0.6);
  };

  const cerrarEncuentro = () => {
    if (animalEncontrado && feedback && feedback.acierto) {
      // Solo lo agregamos si respondió correctamente
      setAnimalesVistos(prev => {
        const nuevosVistos = [...prev, animalEncontrado.id];
        
        // Verificar si completó todos los animales
        if (nuevosVistos.length >= SPAWN_ANIMALES.length) {
          setTimeout(() => {
            completarMundo('biodiversidad', 3, 800);
            mostrarLogro({ icono: '🌿', nombre: '¡Guardián del Bosque!', descripcion: 'Descubriste todos los animales.' });
            setMostrarVictoria(true);
          }, 500);
        }
        
        return nuevosVistos;
      });
    } else if (animalEncontrado && feedback && !feedback.acierto) {
      // Si respondió mal, no se suma a la colección.
      // Movemos al jugador un poco para que no colisione inmediatamente de nuevo con el mismo animal
      setPosJugador(prev => ({
        x: prev.x,
        y: Math.min(prev.y + TILE_SIZE * 1.5, (MAPA_FILAS - 2) * TILE_SIZE) // Lo empuja hacia abajo
      }));
    }

    setMostrarEncuentro(false);
    setAnimalEncontrado(null);
    setFeedback(null);
    setOpcionSeleccionada(null);
  };

  // Offset de cámara centrado en el jugador (o centrando el mapa si la pantalla es más grande)
  const mapWidth = MAPA_COLS * TILE_SIZE;
  const mapHeight = MAPA_FILAS * TILE_SIZE;
  const isWidthLarger = window.innerWidth > mapWidth;
  const isHeightLarger = (window.innerHeight - 80) > mapHeight;

  const camaraX = isWidthLarger ? -(window.innerWidth - mapWidth) / 2 : Math.min(Math.max(posJugador.x - window.innerWidth / 2, 0), mapWidth - window.innerWidth);
  const camaraY = isHeightLarger ? -((window.innerHeight - 80) - mapHeight) / 2 : Math.min(Math.max(posJugador.y - (window.innerHeight - 80) / 2, 0), mapHeight - (window.innerHeight - 80));

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
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>Mundo 1: Biodiversidad</h2>
            <p style={{ color: 'var(--verde-claro)', fontWeight: 600, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>El Pulmón del Mundo</p>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Costa Rica posee casi el 6% de la biodiversidad mundial. Tu misión es explorar este bosque lluvioso y encontrar a las especies ocultas.
              </p>
              <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Usa las teclas <strong>W, A, S, D</strong> o las flechas para moverte.</li>
                <li>Acércate a los animales escondidos para interactuar con ellos.</li>
                <li>Responde correctamente sus desafíos para ganar XP.</li>
              </ul>
            </div>
            
            <Boton variante="dorado" tamaño="lg" onClick={() => setIntroVisible(false)}>
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

      {/* Temporizador HUD extra */}
      {!introVisible && (
        <div style={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: 20, zIndex: 50, border: `1px solid ${tiempoRestante < 15 ? 'red' : 'white'}`, color: tiempoRestante < 15 ? '#ff4d4d' : 'white', fontWeight: 900, fontSize: '1.2rem', backdropFilter: 'blur(5px)' }}>
          ⏱️ {tiempoRestante}s
        </div>
      )}

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
              };

              if (esBorde) {
                style.background = 'rgba(5, 15, 10, 0.7)';
                style.backdropFilter = 'blur(12px)';
                style.boxShadow = 'inset 0 0 20px rgba(0,0,0,0.8)';
              } else if (esAgua) {
                style.background = 'linear-gradient(180deg, rgba(0, 150, 255, 0.15), rgba(0, 100, 255, 0.4))';
                style.backdropFilter = 'blur(6px)';
                style.borderTop = '2px solid rgba(100, 200, 255, 0.4)';
              } else if (esCamino) {
                style.background = 'rgba(255, 255, 255, 0.05)';
                style.backdropFilter = 'blur(3px)';
                style.border = '1px solid rgba(255, 255, 255, 0.1)';
                style.borderRadius = '12px';
                style.transform = 'scale(0.95)';
              }

              return (
                <div key={`${col}-${fila}`} style={style} />
              );
            })
          )}

          {/* Arbustos / Flora Decorativa Premium */}
          {[{c:1,f:1},{c:3,f:1},{c:5,f:1},{c:9,f:1},{c:11,f:1},{c:14,f:1},{c:17,f:1},{c:1,f:3},{c:2,f:5},{c:5,f:4},{c:1,f:7},{c:3,f:8},{c:14,f:2},{c:16,f:3},{c:17,f:5},{c:15,f:7},{c:4,f:10},{c:11,f:9},{c:12,f:7},{c:9,f:8}].map((pos, i) => (
            <div key={`arbol-${i}`} className="arbol-viento" style={{ left: pos.c * TILE_SIZE + 8, top: pos.f * TILE_SIZE + 8, position: 'absolute', zIndex: 10 }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', 
                background: `radial-gradient(circle at 30% 30%, hsl(${120 + i * 5 % 30}deg, 70%, 45%), hsl(${110 + i * 5 % 30}deg, 80%, 20%))`, 
                boxShadow: '0 10px 20px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.1)'
              }} />
            </div>
          ))}

          {/* Sprites de animales en el mapa (Esferas de energía) */}
          {SPAWN_ANIMALES.map(spawn => {
            if (animalesVistos.includes(spawn.animalId)) return null;
            const animal = fauna?.find(a => a.id === spawn.animalId);
            return (
              <div
                key={spawn.animalId}
                style={{ 
                  position: 'absolute', left: spawn.col * TILE_SIZE, top: spawn.fila * TILE_SIZE, 
                  width: TILE_SIZE, height: TILE_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 20, cursor: 'pointer', animation: 'float 3s ease-in-out infinite', 
                }}
                onClick={() => {
                  setAnimalEncontrado(animal);
                  setMostrarEncuentro(true);
                }}
                aria-label={`Animal: ${animal?.nombre || spawn.animalId}`}
                role="button"
                tabIndex={0}
              >
                <div style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                  borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(255,255,255,0.3), inset 0 0 15px rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  fontSize: '2.2rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                  backdropFilter: 'blur(4px)', overflow: 'hidden'
                }}>
                  {animal?.imagen ? (
                    <img src={animal.imagen} alt={animal.nombre} style={{ width: '85%', height: '85%', objectFit: 'cover', borderRadius: '50%' }} />
                  ) : (
                    <span style={{ fontSize: '2.2rem' }}>{animal?.emoji || '🐾'}</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Jugador (Estilo Sprite RPG) */}
          <div
            style={{
              position: 'absolute',
              left: posJugador.x,
              top: posJugador.y - 12, // Subir ligeramente para que los pies estén en la base del tile
              width: TILE_SIZE, height: TILE_SIZE, display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 30, transition: 'left 0.05s linear, top 0.05s linear',
            }}
            aria-label="Tu personaje"
          >
            <div style={{
              width: 48, height: 48, position: 'relative',
              filter: 'drop-shadow(0 6px 4px rgba(0,0,0,0.6))',
              transform: seEstaMoviendo ? 'scale(1.05) translateY(-4px)' : 'scale(1) translateY(0)',
              transition: 'transform 0.1s ease-in-out',
            }}>
              <img src="/images/sprite_guardian.jpg?v=3" alt="Personaje" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='inline' }} />
              <span style={{ fontSize: '2.5rem', display: 'none' }}>🧑‍🌾</span>
            </div>
            {/* Sombra debajo del personaje */}
            <div style={{ position: 'absolute', bottom: 4, width: 24, height: 8, background: 'rgba(0,0,0,0.5)', borderRadius: '50%', filter: 'blur(2px)', zIndex: -1 }} />
          </div>
        </div>
      </div>
      </div>

      {/* Instrucciones de control */}
      <div style={{ position: 'fixed', bottom: 20, left: 20, zIndex: 100, background: 'rgba(0,0,0,0.7)', borderRadius: 12, padding: '8px 14px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
        WASD o flechas para moverte · Acércate a los animales para encontrarlos
      </div>

      {/* Contador de animales / Estado completado */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <div style={{ background: estado.mundosCompletados['biodiversidad']?.completado ? 'rgba(64,145,108,0.9)' : 'rgba(0,0,0,0.7)', borderRadius: 12, padding: '8px 14px', fontSize: '0.8rem', color: estado.mundosCompletados['biodiversidad']?.completado ? 'white' : 'var(--verde-claro)', backdropFilter: 'blur(8px)', border: estado.mundosCompletados['biodiversidad']?.completado ? '2px solid var(--verde-claro)' : 'none', fontWeight: estado.mundosCompletados['biodiversidad']?.completado ? 900 : 'normal' }}>
          {estado.mundosCompletados['biodiversidad']?.completado ? '✓ BOSQUE COMPLETADO' : `${animalesVistos.length}/${SPAWN_ANIMALES.length} animales encontrados`}
        </div>
        {estado.mundosCompletados['biodiversidad']?.completado && (
          <button 
            onClick={() => {
              if (window.confirm('¿Quieres reiniciar este bosque para volver a encontrar los animales?')) {
                setAnimalesVistos([]);
                setTiempoRestante(60);
                setPosJugador({ x: 5 * TILE_SIZE, y: 5 * TILE_SIZE });
              }
            }}
            style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid var(--dorado)', borderRadius: 8, padding: '6px 12px', color: 'var(--dorado)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,215,0,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
          >
            🔄 Volver a Jugar
          </button>
        )}
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
            
            {/* Imagen del animal gigante */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite', filter: 'drop-shadow(0 0 20px rgba(64,145,108,0.8))' }}>
              {animalEncontrado.imagen ? (
                <img src={animalEncontrado.imagen} alt={animalEncontrado.nombre} style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: '24px', border: '2px solid rgba(255,255,255,0.2)' }} />
              ) : (
                <span style={{ fontSize: '6rem' }}>{animalEncontrado.emoji}</span>
              )}
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
                  {animalEncontrado.desafio?.pregunta}
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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: 50, color: feedback.xpGanada > 0 ? 'var(--dorado)' : 'var(--rojo)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '2rem' }}>
                  {feedback.xpGanada > 0 ? '+' : ''}{feedback.xpGanada} XP
                </div>
                
                {animalEncontrado.datoCurioso && (
                  <div style={{ marginTop: '1rem', background: 'rgba(64,145,108,0.2)', borderLeft: '4px solid var(--verde-claro)', borderRadius: '0 12px 12px 0', padding: '16px 20px', textAlign: 'left', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--verde-claro)', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Dato Curioso</p>
                    <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{animalEncontrado.datoCurioso}</p>
                  </div>
                )}
                
                <div>
                  <Boton variante="dorado" tamaño="lg" onClick={cerrarEncuentro}>
                    ¡Seguir Explorando!
                  </Boton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {derrota && (
        <PantallaDerrota 
          xpPerdida={0}
          onReintentar={() => { 
            setDerrota(false); 
            setTiempoRestante(60); 
            setPosJugador({ x: 5 * TILE_SIZE, y: 5 * TILE_SIZE }); 
            setAnimalesVistos([]); 
          }}
          onSalir={onSalir}
        />
      )}

      {/* Pantalla Victoria */}
      {mostrarVictoria && (
        <PantallaVictoria 
          xpGanada={800}
          titulo="¡Bosque Completado!"
          mensaje="Has encontrado a todos los animales del bosque tropical."
          onContinuar={() => setMostrarVictoria(false)}
          onSalir={onSalir}
        />
      )}
    </div>
  );
};
