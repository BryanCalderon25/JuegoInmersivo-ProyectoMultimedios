import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useGame } from '../hooks/useGame';
import { Boton } from '../components/common/Boton';
import '../styles/screens.css';

/**
 * MapaMundi rediseñado al estilo "Stitch" (Google) basado en la imagen de referencia.
 */
export const MapaMundi = () => {
  const { data: historia, loading } = useFetch('/json/historia.json');
  const { estado, navegarA } = useGame();
  const [mundoHover, setMundoHover] = useState(null);

  const mundos = historia?.mundos || [];

  const estadoMundo = (id) => estado.mundosCompletados[id] || { completado: false, estrellas: 0 };

  const entrarMundo = (mundo) => {
    if (mundo.bloqueado && (estado.xpTotal < mundo.xpRequerido)) return;
    navegarA('mundo', mundo.id);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0908' }}>
      <p style={{ color: '#eaf2eb' }}>Cargando destinos...</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at 50% -20%, #2a1f1a 0%, #0b0908 70%)', 
      position: 'relative', 
      overflow: 'hidden', 
      paddingBottom: '100px',
      fontFamily: 'var(--font-ui), sans-serif'
    }}>
      
      {/* Top Header Bar */}
      <div style={{ padding: '20px 30px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '12px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2c3e35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              🧑‍🌾
            </div>
            <span style={{ color: '#eaf2eb', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.02em' }}>
              Guardianes de CR
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: '#eaf2eb', fontWeight: 700 }}>{estado.xpTotal.toLocaleString('en-US')}</span>
            <span style={{ fontSize: '1.1rem' }}>🪙</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Títulos Centrales */}
        <div style={{ textAlign: 'center', margin: '30px 0 50px', animation: 'slideUp 0.6s ease' }}>
          <h1 style={{ color: '#f5e4c3', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Elige tu Destino
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Explora los cuatro mundos de Costa Rica. Cada territorio esconde secretos, desafíos y la magia de nuestra biodiversidad.
          </p>
        </div>

        {/* Grid de Mundos (Tarjetas estilo imagen) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '20px',
          animation: 'slideUp 0.8s ease 0.2s both'
        }}>
          {mundos.map((mundo, idx) => {
            const est = estadoMundo(mundo.id);
            const bloqueado = mundo.bloqueado && estado.xpTotal < mundo.xpRequerido;
            const isHover = mundoHover === mundo.id;
            
            // Colores por mundo para imitar la imagen
            const theme = {
              biodiversidad: { accent: '#74c69d', btnBg: '#f9c74f', btnText: '#1f1a0e', label: 'BOSQUE NUBOSO', icon: '🌲', bg: 'linear-gradient(to bottom, #1d2a22, #141a17)' },
              geografia:     { accent: '#48cae4', btnBg: '#3d2b1f', btnText: '#eaf2eb', label: 'GEOGRAFÍA & MAPAS', icon: '🗺️', bg: 'linear-gradient(to bottom, #1e1915, #14100e)' },
              cultura:       { accent: '#f4a261', btnBg: '#3d2b1f', btnText: '#eaf2eb', label: 'CULTURA & TRADICIONES', icon: '🎭', bg: 'linear-gradient(to bottom, #1e1915, #14100e)' },
              ingles:        { accent: '#90be6d', btnBg: '#2a1d15', btnText: '#8c7d73', label: 'INGLÉS & AVENTURA', icon: '🌍', bg: 'linear-gradient(to bottom, #1e1915, #14100e)' }
            }[mundo.id] || { accent: '#eaf2eb', btnBg: '#3d2b1f', btnText: '#eaf2eb', label: 'ZONA DESCONOCIDA', icon: '❓', bg: '#14100e' };

            const cardBorder = mundo.id === 'biodiversidad' ? '1px solid rgba(116, 198, 157, 0.4)' : '1px solid rgba(255,255,255,0.05)';
            const cardShadow = mundo.id === 'biodiversidad' ? '0 0 40px rgba(116, 198, 157, 0.1)' : 'none';

            return (
              <div 
                key={mundo.id}
                onMouseEnter={() => setMundoHover(mundo.id)}
                onMouseLeave={() => setMundoHover(null)}
                style={{
                  background: theme.bg,
                  border: cardBorder,
                  borderRadius: '24px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: cardShadow,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: isHover && !bloqueado ? 'translateY(-5px)' : 'translateY(0)',
                  opacity: bloqueado ? 0.6 : 1,
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: '380px'
                }}
              >
                {/* Imagen/Gradiente decorativo de fondo de la tarjeta */}
                {mundo.id === 'biodiversidad' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(116, 198, 157, 0.15), transparent 60%)', pointerEvents: 'none' }} />
                )}

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Icono y Estrellas */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.05)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                      {theme.icon}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[...Array(3)].map((_, i) => (
                        <span key={i} style={{ fontSize: '0.8rem', color: i < est.estrellas ? '#f9c74f' : 'rgba(255,255,255,0.2)' }}>★</span>
                      ))}
                    </div>
                  </div>

                  {/* Textos */}
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#eaf2eb', marginBottom: '4px', lineHeight: 1.2 }}>
                    {mundo.nombre}
                  </h2>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: theme.accent, letterSpacing: '0.05em', marginBottom: '16px' }}>
                    {theme.label}
                  </p>
                  
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                    {mundo.descripcion}
                  </p>
                </div>

                {/* Progress bar fake & Bottom Button */}
                <div style={{ position: 'relative', zIndex: 1, marginTop: '24px' }}>
                  {!bloqueado && (
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: '20px', overflow: 'hidden' }}>
                      <div style={{ width: est.completado ? '100%' : '30%', height: '100%', background: theme.accent, borderRadius: 2 }} />
                    </div>
                  )}

                  <button 
                    onClick={() => entrarMundo(mundo)}
                    disabled={bloqueado}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: bloqueado ? '#2a1d15' : theme.btnBg,
                      color: bloqueado ? '#8c7d73' : theme.btnText,
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      letterSpacing: '0.02em',
                      cursor: bloqueado ? 'not-allowed' : 'pointer',
                      transition: 'filter 0.2s ease',
                      fontFamily: 'var(--font-ui), sans-serif'
                    }}
                    onMouseEnter={e => !bloqueado && (e.currentTarget.style.filter = 'brightness(1.1)')}
                    onMouseLeave={e => !bloqueado && (e.currentTarget.style.filter = 'brightness(1)')}
                  >
                    {bloqueado ? 'BLOQUEADO' : mundo.id === 'biodiversidad' ? '▶ ¡Entrar al Mundo!' : 'CONTINUAR RUTA'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón Menú Principal */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => navegarA('inicio')}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              padding: '10px 24px',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-ui), sans-serif',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            🏠 Menú Principal
          </button>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(20, 15, 12, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '50px',
        padding: '8px 16px',
        display: 'flex',
        gap: '8px',
        zIndex: 100,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        {[
          { id: 'inicio', label: 'HOME', icon: '🏠', active: false },
          { id: 'mapa', label: 'MAP', icon: '🗺️', active: true },
          { id: 'coleccionables', label: 'JOURNAL', icon: '📔', active: false },
          { id: 'perfil', label: 'PROFILE', icon: '👤', active: false }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => navegarA(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              width: item.active ? '70px' : '60px',
              height: '60px',
              borderRadius: '30px',
              border: 'none',
              background: item.active ? '#f9c74f' : 'transparent',
              color: item.active ? '#120f0d' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-ui), sans-serif'
            }}
          >
            <span style={{ fontSize: '1.2rem', filter: item.active ? 'none' : 'grayscale(1)' }}>{item.icon}</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
