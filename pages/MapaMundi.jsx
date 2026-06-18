import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useGame } from '../hooks/useGame';
import { Particulas } from '../components/effects/Particulas';
import { Boton } from '../components/common/Boton';
import { BotonVolver } from '../components/common/BotonVolver';
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

  const mundos = historia?.mundos || [];
  
  const estadoMundo = (id) => estado.mundosCompletados[id] || { completado: false, estrellas: 0 };

  const entrarMundo = (id) => {
    navegarA('mundo', id);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ textAlign: 'center', color: 'var(--verde-claro)' }}>
        <p style={{ marginTop: '1rem', fontWeight: 600, letterSpacing: 2 }}>CARGANDO MAPA...</p>
      </div>
    </div>
  );

  const fondoActivo = mundoHover ? mundos.find(m => m.id === mundoHover)?.fondoImagen : '/images/fondos/bosque-fondo.webp';

  return (
    <div className="anim-fade-in" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', padding: '80px 2rem 2rem', display: 'flex', flexDirection: 'column' }}>
      
      {/* FONDO DINÁMICO */}
      <div style={{ position: 'absolute', inset: 0, zIndex: -2, background: '#0a0a0a' }}>
        {mundos.map(mundo => (
          <img 
            key={`bg-${mundo.id}`}
            src={mundo.fondoImagen} 
            alt="" 
            style={{ 
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: (mundoHover === mundo.id || (!mundoHover && mundo.id === 'biodiversidad')) ? 0.4 : 0,
              transition: 'opacity 0.8s ease-in-out'
            }} 
          />
        ))}
        {/* Overlay para garantizar legibilidad */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))' }} />
      </div>

      <BotonVolver destino="inicio" />
      <Particulas cantidad={10} tipo="estrellas" velocidad={0.2} />

      {/* Título */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))' }}>
          <span className="text-gradient-verde">Elige tu Destino</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 500, letterSpacing: 1 }}>
          Costa Rica espera por ti, Guardián
        </p>
      </div>

      {/* ACORDEÓN DE MUNDOS */}
      <div style={{ display: 'flex', gap: '1rem', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, minHeight: '500px' }}>
        {mundos.map(mundo => {
          const est = estadoMundo(mundo.id);
          const colores = COLORES_MUNDO[mundo.id] || COLORES_MUNDO.biodiversidad;
          const bloqueado = mundo.bloqueado && estado.xpTotal < mundo.xpRequerido;
          const activo = mundoHover === mundo.id;

          return (
            <div
              key={mundo.id}
              onMouseEnter={() => !bloqueado && setMundoHover(mundo.id)}
              onMouseLeave={() => setMundoHover(null)}
              onClick={() => { if(!bloqueado) entrarMundo(mundo.id); }}
              style={{
                flex: activo ? 4 : 1,
                minWidth: activo ? '300px' : '100px',
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: bloqueado ? 'not-allowed' : 'pointer',
                transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                background: activo ? colores.bg.replace('0.95', '0.6') : 'rgba(0,0,0,0.4)',
                border: `2px solid ${activo ? colores.border : 'rgba(255,255,255,0.1)'}`,
                boxShadow: activo ? colores.glow : 'none',
                filter: bloqueado ? 'grayscale(1) brightness(0.5)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '2rem'
              }}
            >
              {/* Fondo del panel interno */}
              <img 
                src={mundo.fondoImagen} 
                alt="" 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: activo ? 0.3 : 0.5, transition: 'opacity 0.5s ease', zIndex: 0 }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: activo ? 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)' : 'rgba(0,0,0,0.7)', zIndex: 0 }} />

              {/* Contenido (siempre visible) */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: activo ? 'column' : 'column', alignItems: activo ? 'flex-start' : 'center', height: '100%' }}>
                
                {/* Ícono gigante y Estrellas */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: activo ? '0' : 'auto', marginBottom: activo ? 'auto' : '1rem' }}>
                  <div style={{ fontSize: activo ? '5rem' : '3.5rem', transition: 'all 0.4s ease', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))', marginBottom: '1rem', animation: activo ? 'float 3s ease-in-out infinite' : 'none' }}>
                    {bloqueado ? 'BLOQUEADO' : mundo.emoji}
                  </div>
                  
                  {est.completado && !bloqueado && (
                    <div className="anim-fade-in" style={{ 
                      background: 'linear-gradient(90deg, transparent, rgba(64,145,108,0.8), transparent)',
                      padding: '4px 20px', 
                      borderRadius: 12,
                      marginTop: '-10px',
                      marginBottom: '1rem',
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      opacity: activo ? 1 : 0.8,
                      borderTop: '1px solid var(--verde-claro)',
                      borderBottom: '1px solid var(--verde-claro)'
                    }}>
                      <span style={{ color: 'var(--verde-claro)', fontWeight: 900, letterSpacing: 2, fontSize: activo ? '0.9rem' : '0.7rem' }}>
                        ✓ COMPLETADO
                      </span>
                      <div style={{ marginTop: '0.2rem' }}>
                        {[...Array(3)].map((_, i) => (
                          <span key={i} style={{ fontSize: activo ? '1.2rem' : '0.9rem', color: i < est.estrellas ? 'var(--dorado)' : 'rgba(255,255,255,0.2)' }}>★</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Título Rotado / Normal */}
                <div style={{ 
                  writingMode: activo ? 'horizontal-tb' : 'vertical-rl', 
                  textOrientation: 'mixed',
                  transform: activo ? 'none' : 'rotate(180deg)',
                  textAlign: activo ? 'left' : 'center',
                  width: '100%',
                  transition: 'all 0.4s ease'
                }}>
                  <h2 style={{ fontSize: activo ? '2.5rem' : '1.5rem', fontWeight: 900, color: 'white', whiteSpace: 'nowrap', textShadow: '0 4px 10px rgba(0,0,0,0.8)' }}>
                    {mundo.nombre}
                  </h2>
                </div>

                {/* Contenido revelado en hover */}
                <div style={{ 
                  opacity: activo ? 1 : 0, 
                  maxHeight: activo ? '300px' : '0px', 
                  overflow: 'hidden',
                  transition: 'all 0.5s ease',
                  width: '100%'
                }}>
                  <h3 style={{ color: mundo.colorSecundario, fontSize: '1.2rem', fontWeight: 700, margin: '0.5rem 0 1rem', textTransform: 'uppercase', letterSpacing: 1 }}>{mundo.subtitulo}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                    {bloqueado ? `Bloqueado. Requiere ${mundo.xpRequerido} XP para entrar.` : mundo.descripcion}
                  </p>
                  
                  {!bloqueado && (
                    <Boton variante="dorado" tamaño="lg" icono="🚀" style={{ width: '100%', justifyContent: 'center' }}>
                      ¡Comenzar Aventura!
                    </Boton>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
