import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { AudioPlayer } from '../../components/media/AudioPlayer';
import '../../styles/game.css';
import '../../styles/effects.css';

/**
 * MUNDO 3: Cultura — Rediseñado estilo Stitch ("El Pueblo Tico")
 */
export const MundoCultura = ({ onSalir }) => {
  const { data: culturaData, loading } = useFetch('/json/cultura.json');
  const { ganarXP, desbloquearColeccionable, completarMundo, mostrarLogro, estado, navegarA } = useGame();
  const { reproducirBGM, reproducirSFX } = useAudio();

  const [objetoActivo, setObjetoActivo] = useState(null);
  const [objetosRecogidos, setObjetosRecogidos] = useState([]);

  useEffect(() => {
    reproducirBGM('/audio/musica/pueblo.mp3', 0.35);
  }, []);

  const todos = culturaData ? [
    ...culturaData.simbolos,
    ...culturaData.historia,
    ...(culturaData.comidas || []).slice(0, 3),
    ...(culturaData.expresiones || []).slice(0, 2),
  ] : [];

  const posicionesObjetos = [
    { top: '15%', left: '8%' }, { top: '20%', left: '40%' }, { top: '25%', left: '72%' },
    { top: '55%', left: '15%' }, { top: '50%', left: '50%' }, { top: '60%', left: '80%' },
    { top: '75%', left: '30%' }, { top: '78%', left: '65%' },
  ];

  const totalObjetos = Math.min(todos.length, posicionesObjetos.length);
  const progresoPorcentaje = Math.round((objetosRecogidos.length / totalObjetos) * 100) || 0;

  const recogerObjeto = (objeto) => {
    setObjetoActivo(objeto);
    if (!objetosRecogidos.includes(objeto.id)) {
      reproducirSFX('/audio/efectos/coleccionable.mp3', 0.7);
      ganarXP(objeto.xpAlRecoger || 50, `Cultura: ${objeto.nombre || objeto.expresion}`);
      desbloquearColeccionable(objeto.id, {
        icono: objeto.emoji || '🏛️',
        nombre: objeto.nombre || objeto.expresion,
        descripcion: '¡Descubriste un tesoro cultural!',
      });
      setObjetosRecogidos(prev => {
        const nuevos = [...prev, objeto.id];
        if (nuevos.length >= 5) {
          setTimeout(() => {
            completarMundo('cultura', 3, 600);
            mostrarLogro({ icono: '🎭', nombre: '¡Guardián de la Cultura!', descripcion: 'Conoces las tradiciones ticas.' });
          }, 800);
        }
        return nuevos;
      });
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0e00' }}>
      <p style={{ color: '#f4a261' }}>Preparando el pueblo...</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, #24160c 0%, #0a0603 100%)', 
      position: 'relative', 
      overflow: 'hidden', 
      paddingBottom: '100px',
      fontFamily: 'var(--font-ui), sans-serif'
    }}>
      <HUD enMundo onSalir={onSalir} />

      <div style={{ padding: '0 20px', maxWidth: '800px', margin: '40px auto 0' }}>
        
        {/* Títulos Centrales */}
        <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'slideUp 0.6s ease' }}>
          <h1 style={{ color: '#f5e4c3', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px', lineHeight: 1.1 }}>
            El Pueblo<br />Tico
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
            Explora las calles y descubre los tesoros que guardan nuestra historia, símbolos y expresiones únicas.
          </p>
        </div>

        {/* Tarjeta 1: Pueblo Interactivo */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '20px', 
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.1s both'
        }}>
          {/* Escena del pueblo */}
          <div style={{ position: 'relative', width: '100%', minHeight: '400px', background: 'linear-gradient(180deg, #1b3a4b 0%, #0f4c5c 40%, #2f4f2f 40%, #1a331a 100%)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            
            {/* Fondo decorativo (Niebla/Nubes oscuras) */}
            <div style={{ position: 'absolute', top: '5%', left: '10%', width: 80, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.2)', filter: 'blur(4px)', animation: 'niebla-mover 20s linear infinite' }} />
            <div style={{ position: 'absolute', top: '8%', left: '60%', width: 120, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.1)', filter: 'blur(5px)', animation: 'niebla-mover 25s linear infinite reverse' }} />

            {/* Casas abstractas */}
            {[{x:'5%',c:'#b33939'},{x:'35%',c:'#cc8e35'},{x:'65%',c:'#218c53'},{x:'78%',c:'#6c3483'}].map((casa,i) => (
              <div key={i} style={{ position: 'absolute', bottom: '30%', left: casa.x }}>
                <div style={{ width: 70, height: 60, background: 'rgba(255,255,255,0.8)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: '100%', left: -10, width: 0, height: 0, borderLeft: '45px solid transparent', borderRight: '45px solid transparent', borderBottom: `35px solid ${casa.c}` }} />
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 30, background: '#3e2723', borderRadius: '4px 4px 0 0' }} />
                </div>
              </div>
            ))}

            {/* Objetos culturales */}
            {todos.slice(0, posicionesObjetos.length).map((obj, i) => {
              const pos = posicionesObjetos[i];
              const recogido = objetosRecogidos.includes(obj.id);
              const activo = objetoActivo?.id === obj.id;
              
              return (
                <button
                  key={obj.id}
                  onClick={() => recogerObjeto(obj)}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    background: activo ? '#3d2b1f' : recogido ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.1)',
                    border: activo ? '2px solid #f4a261' : recogido ? '2px solid #555' : '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '16px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '1.6rem',
                    backdropFilter: 'blur(8px)',
                    animation: recogido ? 'none' : 'float 3s ease-in-out infinite',
                    transition: 'all 0.2s ease',
                    filter: recogido && !activo ? 'grayscale(0.8)' : 'none',
                    boxShadow: recogido ? 'none' : '0 10px 20px rgba(0,0,0,0.3)',
                  }}
                  aria-label={`Objeto ${obj.nombre}`}
                >
                  {obj.emoji || '🏛️'}
                  {!recogido && (
                    <div style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, background: '#f4a261', borderRadius: '50%', fontSize: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ✨
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarjeta 2: Panel de Información */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '40px 30px',
          marginBottom: '20px',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.2s both'
        }}>
          {!objetoActivo ? (
            <>
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f4a261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <h3 style={{ color: '#f5e4c3', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Selecciona un Objeto</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '300px' }}>
                Toca los objetos brillantes en el pueblo interactivo para descubrir su significado y ganar recompensas.
              </p>
            </>
          ) : (
            <div style={{ width: '100%', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#eaf2eb', marginBottom: '4px' }}>
                    {objetoActivo.nombre || objetoActivo.expresion || objetoActivo.titulo}
                  </h2>
                  {objetoActivo.fecha && (
                    <p style={{ fontSize: '0.8rem', color: '#f4a261', fontWeight: 600, letterSpacing: '0.05em' }}>ORIGEN: {objetoActivo.fecha}</p>
                  )}
                </div>
                <span style={{ fontSize: '2.5rem' }}>{objetoActivo.emoji}</span>
              </div>
              
              {objetoActivo.significado && (
                <div style={{ background: 'rgba(244, 162, 97, 0.1)', border: '1px solid rgba(244, 162, 97, 0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px' }}>
                  <p style={{ color: '#f5e4c3', fontSize: '0.85rem', fontStyle: 'italic' }}>"{objetoActivo.significado}"</p>
                </div>
              )}

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {objetoActivo.descripcion}
              </p>

              {objetoActivo.audio && (
                <div style={{ marginBottom: '20px' }}>
                  <AudioPlayer src={objetoActivo.audio} titulo={`Sonido: ${objetoActivo.nombre || objetoActivo.expresion}`} compacto />
                </div>
              )}

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#f4a261', fontWeight: 800, fontSize: '0.95rem' }}>
                  ⚡ RECOMPENSA OBTENIDA: +{objetoActivo.xpAlRecoger || 50} XP
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tarjeta 3: Progreso General */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '20px', 
          padding: '24px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.3s both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#b06a33', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginBottom: '2px' }}>COMPLETADO</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#eaf2eb' }}>{objetosRecogidos.length} / {totalObjetos} Objetos</h3>
            </div>
          </div>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1a0e00', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #3d1c00' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#eaf2eb' }}>{progresoPorcentaje}%</span>
          </div>
        </div>

      </div>

      {/* Floating Bottom Navigation Bar global del juego */}
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
