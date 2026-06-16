import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { DialogoRPG } from '../../components/game/DialogoRPG';
import '../../styles/game.css';
import '../../styles/effects.css';

/**
 * MUNDO 4: Inglés — Rediseñado estilo Stitch ("Práctica de Inglés")
 */
export const MundoIngles = ({ onSalir }) => {
  const { data: inglesData, loading } = useFetch('/json/ingles.json');
  const { ganarXP, completarMundo, mostrarLogro, navegarA } = useGame();
  const { reproducirBGM, reproducirSFX } = useAudio();

  const [convIndex, setConvIndex] = useState(0);
  const [estadoConv, setEstadoConv] = useState('mapa'); // mapa | conversacion | resultado
  const [conversacionesCompletadas, setConversacionesCompletadas] = useState([]);
  const [vocabularioActual, setVocabularioActual] = useState([]);

  const conversaciones = inglesData?.conversaciones || [];
  const convActual = conversaciones[convIndex];
  
  const progresoPorcentaje = Math.round((conversacionesCompletadas.length / (conversaciones.length || 1)) * 100) || 0;

  useEffect(() => {
    reproducirBGM('/audio/musica/rpg-ingles.mp3', 0.35);
  }, []);

  const iniciarConversacion = (index) => {
    setConvIndex(index);
    setEstadoConv('conversacion');
    if (conversaciones[index]?.vocabulario) {
      setVocabularioActual(conversaciones[index].vocabulario);
    }
  };

  const manejarOpcion = (opcion, index, esCorrecta) => {
    if (esCorrecta) {
      reproducirSFX('/audio/efectos/victoria.mp3', 0.5);
    } else {
      reproducirSFX('/audio/efectos/error.mp3', 0.5);
    }
  };

  const finConversacion = () => {
    const xp = convActual?.xpAlCompletar || 100;
    ganarXP(xp, `Inglés: ${convActual?.locacion}`);
    
    if (!conversacionesCompletadas.includes(convIndex)) {
      setConversacionesCompletadas(prev => {
        const nuevas = [...prev, convIndex];
        if (nuevas.length >= conversaciones.length) {
          setTimeout(() => {
            completarMundo('ingles', 3, 500);
            mostrarLogro({ icono: '🌎', nombre: '¡Bilingüe!', descripcion: 'Completaste el módulo de inglés.' });
          }, 1000);
        }
        return nuevas;
      });
    }
    
    setEstadoConv('resultado');
  };

  const siguienteConversacion = () => {
    setEstadoConv('mapa');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0520' }}>
      <p style={{ color: '#c77dff' }}>Loading language world...</p>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, #180d2b 0%, #070314 100%)', 
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
            Práctica de<br />Inglés
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
            Habla con turistas internacionales, guíalos por Costa Rica y mejora tu vocabulario en situaciones reales.
          </p>
        </div>

        {/* Tarjeta 1: Lista de Turistas/Mapa */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '30px 20px', 
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.1s both'
        }}>
          <h3 style={{ color: '#c77dff', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '20px', paddingLeft: '10px' }}>SELECCIONA UN TURISTA</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {conversaciones.map((conv, i) => {
              const completado = conversacionesCompletadas.includes(i);
              const activo = estadoConv === 'conversacion' && convIndex === i;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => iniciarConversacion(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: activo ? '#2d1b4e' : 'rgba(255,255,255,0.03)',
                    border: activo ? '1px solid #9b5de5' : '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '20px',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '2.5rem' }}>{conv.avatarEmoji}</span>
                    <div>
                      <div style={{ color: '#eaf2eb', fontWeight: 800, fontSize: '1.1rem', marginBottom: '2px' }}>{conv.npc}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>📍 {conv.locacion.toUpperCase()}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    {completado ? (
                      <span style={{ background: 'rgba(116, 198, 157, 0.2)', color: '#74c69d', padding: '4px 12px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700 }}>COMPLETED ✓</span>
                    ) : (
                      <span style={{ background: '#9b5de5', color: 'white', padding: '6px 16px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800 }}>TALK ▶</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarjeta 2: Panel Interactivo de Conversación / Resultado */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '40px 30px',
          marginBottom: '20px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.2s both'
        }}>
          {estadoConv === 'mapa' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(155, 93, 229, 0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c77dff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 style={{ color: '#f5e4c3', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Start a Conversation</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto' }}>
                Select a tourist from the list above to start practicing your english.
              </p>
              
              {/* Vocabulario previo si hay */}
              {vocabularioActual.length > 0 && (
                <div style={{ marginTop: '30px', textAlign: 'left', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                  <h4 style={{ color: '#c77dff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '16px' }}>📚 RECENT VOCABULARY</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {vocabularioActual.map((v, i) => (
                      <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ color: '#eaf2eb', fontWeight: 700, fontSize: '0.85rem' }}>{v.ingles}</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '2px' }}>{v.espanol}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : estadoConv === 'conversacion' && convActual ? (
            <div style={{ width: '100%', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '3rem' }}>{convActual.avatarEmoji}</span>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#eaf2eb' }}>{convActual.npc}</h2>
                  <p style={{ fontSize: '0.8rem', color: '#c77dff' }}>Talking at {convActual.locacion}</p>
                </div>
              </div>
              
              <DialogoRPG
                npc={{ nombre: convActual.npc, emoji: convActual.avatarEmoji }}
                dialogos={convActual.dialogos}
                onOpcionSeleccionada={manejarOpcion}
                onFin={finConversacion}
                audioSrc={convActual.dialogos[0]?.audio}
              />
            </div>
          ) : (
            <div style={{ textAlign: 'center', width: '100%', animation: 'zoomIn 0.4s ease' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#eaf2eb', marginBottom: '8px' }}>Well Done!</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '24px' }}>You successfully helped {convActual.npc}.</p>
              
              <div style={{ background: 'rgba(155, 93, 229, 0.1)', border: '1px solid rgba(155, 93, 229, 0.3)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                <span style={{ color: '#c77dff', fontWeight: 800, fontSize: '1.1rem' }}>
                  ⚡ +{convActual.xpAlCompletar} XP EARNED
                </span>
              </div>
              
              <button 
                onClick={siguienteConversacion}
                style={{ background: '#9b5de5', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '50px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                BACK TO LIST
              </button>
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
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#5a189a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginBottom: '2px' }}>PROGRESS</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#eaf2eb' }}>{conversacionesCompletadas.length} / {conversaciones.length} Tourists</h3>
            </div>
          </div>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#0a0520', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #1a0a35' }}>
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
