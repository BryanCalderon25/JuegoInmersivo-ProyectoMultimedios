import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useGame } from '../hooks/useGame';
import { Particulas } from '../components/effects/Particulas';
import { Boton } from '../components/common/Boton';
import '../styles/screens.css';

const COLORES_MUNDO = {
  biodiversidad: { bg: 'rgba(27,71,50,0.95)', border: 'rgba(64,145,108,0.5)', glow: '0 0 30px rgba(64,145,108,0.3)' },
  geografia:     { bg: 'rgba(0,50,90,0.95)',  border: 'rgba(0,119,182,0.5)', glow: '0 0 30px rgba(0,119,182,0.3)' },
  cultura:       { bg: 'rgba(90,60,10,0.95)', border: 'rgba(233,196,106,0.5)', glow: '0 0 30px rgba(233,196,106,0.3)' },
  ingles:        { bg: 'rgba(60,20,90,0.95)', border: 'rgba(155,93,229,0.5)', glow: '0 0 30px rgba(155,93,229,0.3)' },
};

/**
 * Hub central del juego — Mapa de Costa Rica con 4 mundos seleccionables.
 */
export const MapaMundi = () => {
  const { data: historia, loading } = useFetch('/json/historia.json');
  const { estado, navegarA } = useGame();
  const [mundoHover, setMundoHover] = useState(null);
  const [mundoSeleccionado, setMundoSeleccionado] = useState(null);

  const mundos = historia?.mundos || [];
  const mundoInfo = mundoSeleccionado ? mundos.find(m => m.id === mundoSeleccionado) : null;

  const estadoMundo = (id) => estado.mundosCompletados[id] || { completado: false, estrellas: 0 };

  const seleccionarMundo = (mundo) => {
    if (mundo.bloqueado && (estado.xpTotal < mundo.xpRequerido)) return;
    setMundoSeleccionado(mundo.id);
  };

  const entrarMundo = () => {
    if (mundoSeleccionado) navegarA('mundo', mundoSeleccionado);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--negro-suave)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', animation: 'float 2s ease-in-out infinite' }}>🗺️</div>
        <p style={{ color: 'var(--verde-claro)', marginTop: '1rem' }}>Cargando el mapa...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, var(--negro-suave), #0a1f0f 60%, #050d14)', position: 'relative', overflow: 'hidden', padding: '80px 2rem 2rem' }}>
      <Particulas cantidad={15} tipo="estrellas" velocidad={0.5} />

      {/* Título */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900 }}>
          <span className="text-gradient-verde">Elige tu Destino</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
          Explora los cuatro mundos de Costa Rica
        </p>
      </div>

      {/* Grid de mundos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto 2rem' }}>
        {mundos.map(mundo => {
          const est = estadoMundo(mundo.id);
          const colores = COLORES_MUNDO[mundo.id] || COLORES_MUNDO.biodiversidad;
          const bloqueado = mundo.bloqueado && estado.xpTotal < mundo.xpRequerido;
          const activo = mundoSeleccionado === mundo.id;

          return (
            <button
              key={mundo.id}
              onClick={() => seleccionarMundo(mundo)}
              onMouseEnter={() => setMundoHover(mundo.id)}
              onMouseLeave={() => setMundoHover(null)}
              disabled={bloqueado}
              aria-label={`${bloqueado ? 'Bloqueado: ' : ''}Mundo ${mundo.nombre}. ${mundo.descripcion}`}
              aria-pressed={activo}
              style={{
                all: 'unset',
                display: 'block',
                background: activo ? colores.bg : 'rgba(255,255,255,0.04)',
                border: `2px solid ${activo ? colores.border.replace('0.5', '0.8') : colores.border}`,
                borderRadius: '20px',
                padding: '2rem',
                cursor: bloqueado ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                transform: activo ? 'scale(1.03)' : mundoHover === mundo.id ? 'scale(1.01) translateY(-4px)' : 'scale(1)',
                boxShadow: activo ? colores.glow : mundoHover === mundo.id ? '0 8px 30px rgba(0,0,0,0.3)' : 'none',
                opacity: bloqueado ? 0.4 : 1,
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'left',
              }}
            >
              {/* Imagen de fondo del mundo */}
              {mundo.fondoImagen && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: 18, overflow: 'hidden', opacity: activo ? 0.2 : 0.08 }}>
                  <img src={mundo.fondoImagen} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} aria-hidden="true" />
                </div>
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Emoji e insignia de completado */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '3rem', animation: activo ? 'float 3s ease-in-out infinite' : 'none' }} aria-hidden="true">
                    {mundo.emoji}
                  </span>
                  {bloqueado && <span style={{ fontSize: '1.5rem' }} aria-label="Bloqueado">🔒</span>}
                  {est.completado && !bloqueado && (
                    <div style={{ display: 'flex', gap: 2 }} aria-label={`${est.estrellas} estrellas`}>
                      {[...Array(3)].map((_, i) => (
                        <span key={i} style={{ fontSize: '1rem', filter: i < est.estrellas ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
                      ))}
                    </div>
                  )}
                </div>

                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '0.25rem' }}>
                  {mundo.nombre}
                </h2>
                <p style={{ fontSize: '0.75rem', color: activo ? colores.border.replace('rgba', 'rgb').replace(',0.5)', ')') : 'rgba(255,255,255,0.4)', marginBottom: '1rem', fontWeight: 600 }}>
                  {mundo.subtitulo}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                  {mundo.descripcion}
                </p>

                {bloqueado && (
                  <div style={{ marginTop: '1rem', padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                    🔒 Requiere {mundo.xpRequerido} XP para desbloquear
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Panel de confirmación de entrada al mundo */}
      {mundoInfo && (
        <div className="anim-slide-up" style={{ maxWidth: 600, margin: '0 auto', background: COLORES_MUNDO[mundoSeleccionado]?.bg || 'rgba(10,25,15,0.95)', border: `1px solid ${COLORES_MUNDO[mundoSeleccionado]?.border || 'rgba(64,145,108,0.4)'}`, borderRadius: 20, padding: '2rem', textAlign: 'center', boxShadow: COLORES_MUNDO[mundoSeleccionado]?.glow }}>
          <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }} aria-hidden="true">{mundoInfo.emoji}</p>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{mundoInfo.nombre}</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{mundoInfo.descripcion}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Boton variante="dorado" tamaño="lg" onClick={entrarMundo} ariaLabel={`Entrar a ${mundoInfo.nombre}`} icono="🚀">
              ¡Entrar al Mundo!
            </Boton>
            <Boton variante="glass" onClick={() => setMundoSeleccionado(null)} ariaLabel="Cancelar selección">
              Cancelar
            </Boton>
          </div>
        </div>
      )}

      {/* Botón de volver */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Boton variante="glass" onClick={() => navegarA('inicio')} ariaLabel="Volver al menú principal" icono="🏠">
          Menú Principal
        </Boton>
      </div>
    </div>
  );
};
