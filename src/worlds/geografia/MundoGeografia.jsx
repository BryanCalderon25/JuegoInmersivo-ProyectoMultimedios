import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { Particulas } from '../../components/effects/Particulas';
import { MapaCostaRica } from '../../components/game/MapaCostaRica';
import '../../styles/game.css';
import '../../styles/effects.css';

/**
 * MUNDO 2: Geografía — Rediseñado estilo Stitch ("Provincias del Paraíso")
 */
export const MundoGeografia = ({ onSalir }) => {
  const { data: provincias, loading } = useFetch('/json/provincias.json');
  const { ganarXP, completarMundo, desbloquearColeccionable, mostrarLogro, estado, navegarA } = useGame();
  const { reproducirBGM } = useAudio();

  const [provinciaActiva, setProvinciaActiva] = useState(null);
  const [desafioActivo, setDesafioActivo] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [provinciasCompletadas, setProvinciasCompletadas] = useState([]);

  useEffect(() => {
    reproducirBGM('/audio/musica/aventura.mp3', 0.35);
  }, []);

  const seleccionarProvincia = (provincia) => {
    setProvinciaActiva(provincia);
    setDesafioActivo(false);
    setOpcionSeleccionada(null);
    setFeedback(null);
  };

  const iniciarDesafio = () => {
    if (!provinciaActiva?.desafio) return;
    setDesafioActivo(true);
    setOpcionSeleccionada(null);
    setFeedback(null);
  };

  const responder = (index) => {
    if (opcionSeleccionada !== null) return;
    setOpcionSeleccionada(index);
    const esCorrecta = index === provinciaActiva.desafio.respuestaCorrecta;
    const xpGanada = esCorrecta ? 100 : 30;
    setFeedback({ esCorrecta, xpGanada, explicacion: provinciaActiva.desafio.explicacion });
    ganarXP(xpGanada, `Geografía: ${provinciaActiva.nombre}`);

    if (esCorrecta && !provinciasCompletadas.includes(provinciaActiva.id)) {
      setProvinciasCompletadas(prev => {
        const nuevas = [...prev, provinciaActiva.id];
        desbloquearColeccionable(`provincia-${provinciaActiva.id}`, {
          icono: provinciaActiva.emoji,
          nombre: `Provincia: ${provinciaActiva.nombre}`,
          descripcion: '¡Conoces bien esta provincia!',
        });
        if (nuevas.length >= 7) {
          setTimeout(() => {
            completarMundo('geografia', 3, 700);
            mostrarLogro({ icono: '🗺️', nombre: '¡Explorador Nacional!', descripcion: 'Conoces las 7 provincias.' });
          }, 800);
        }
        return nuevas;
      });
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#120f0d' }}>
      <p style={{ color: '#eaf2eb' }}>Cargando Costa Rica...</p>
    </div>
  );

  const progresoPorcentaje = Math.round((provinciasCompletadas.length / 7) * 100);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, #1a1512 0%, #0d0a08 100%)', 
      position: 'relative', 
      overflow: 'hidden', 
      paddingBottom: '100px',
      fontFamily: 'var(--font-ui), sans-serif'
    }}>
      <HUD enMundo onSalir={onSalir} />
      <Particulas cantidad={10} tipo="luces" />

      <div style={{ padding: '0 20px', maxWidth: '800px', margin: '40px auto 0' }}>
        
        {/* Títulos Centrales */}
        <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'slideUp 0.6s ease' }}>
          <h1 style={{ color: '#f5e4c3', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px', lineHeight: 1.1 }}>
            Provincias del<br />Paraíso
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
            Explora las siete joyas de Costa Rica. Haz clic en una provincia para descubrir sus secretos y superar los desafíos geográficos.
          </p>
        </div>

        {/* Tarjeta 1: Mapa interactivo */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '30px 20px', 
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.1s both'
        }}>
          {/* Contenedor del Mapa SVG decorativo centralizado */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '220px', marginBottom: '30px', position: 'relative' }}>
             <MapaCostaRica 
               provinciaActivaId={provinciaActiva?.id}
               provinciasCompletadas={provinciasCompletadas}
               onProvinciaClick={(id) => {
                 const prov = provincias?.find(p => p.id === id);
                 if (prov) seleccionarProvincia(prov);
               }}
             />
          </div>

          {/* Botones de Provincias tipo Pill de Stitch */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {provincias?.map(p => {
              const activa = provinciaActiva?.id === p.id;
              const completada = provinciasCompletadas.includes(p.id);
              return (
                <button 
                  key={p.id}
                  onClick={() => seleccionarProvincia(p)}
                  style={{ 
                    background: activa ? '#3d2b1f' : 'rgba(255,255,255,0.05)', 
                    border: activa ? '1px solid #c9a765' : '1px solid transparent', 
                    borderRadius: '20px', 
                    padding: '8px 16px', 
                    color: activa ? '#eaf2eb' : 'rgba(255,255,255,0.7)', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-ui), sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {p.nombre.toUpperCase()} {completada && <span style={{color: '#74c69d'}}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tarjeta 2: Panel de Información Dinámico */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '40px 30px',
          marginBottom: '20px',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.2s both'
        }}>
          {!provinciaActiva ? (
            <>
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e9c46a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                  <line x1="9" y1="3" x2="9" y2="18"></line>
                  <line x1="15" y1="6" x2="15" y2="21"></line>
                </svg>
              </div>
              <h3 style={{ color: '#f5e4c3', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Selecciona una Provincia</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '300px' }}>
                Toca el mapa para ver su información detallada, nivel de dificultad y recompensas disponibles.
              </p>
            </>
          ) : (
            <div style={{ width: '100%', textAlign: 'left', animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#eaf2eb', marginBottom: '4px' }}>{provinciaActiva.nombre}</h2>
                  <p style={{ fontSize: '0.8rem', color: '#c9a765', fontWeight: 600, letterSpacing: '0.05em' }}>CAPITAL: {provinciaActiva.capital.toUpperCase()}</p>
                </div>
                <span style={{ fontSize: '2.5rem' }}>{provinciaActiva.emoji}</span>
              </div>
              
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {provinciaActiva.descripcion}
              </p>

              {/* Stats en cuadritos Stitch */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                {[
                  { label: 'POBLACIÓN', val: provinciaActiva.datos?.poblacion?.toLocaleString('es-CR') },
                  { label: 'EXTENSIÓN', val: provinciaActiva.datos?.extension },
                  { label: 'FUNDACIÓN', val: provinciaActiva.datos?.fundacion },
                  { label: 'CANTONES', val: provinciaActiva.cantones },
                ].map(item => (
                  <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.9rem', color: '#eaf2eb', fontWeight: 700 }}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Botón de Desafío */}
              {!desafioActivo ? (
                <button 
                  onClick={iniciarDesafio}
                  style={{ width: '100%', background: '#3d2b1f', color: '#f5e4c3', border: '1px solid #c9a765', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#4a3525'}
                  onMouseLeave={e => e.currentTarget.style.background = '#3d2b1f'}
                >
                  ▶ INICIAR DESAFÍO GEOGRÁFICO
                </button>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontWeight: 700, color: '#f5e4c3', marginBottom: '16px', fontSize: '0.95rem' }}>
                    {provinciaActiva.desafio.pregunta}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {provinciaActiva.desafio.opciones.map((op, i) => {
                      const esCorrecta = i === provinciaActiva.desafio.respuestaCorrecta;
                      const seleccionada = opcionSeleccionada === i;
                      let bg = 'rgba(255,255,255,0.05)';
                      let border = '1px solid transparent';
                      if (opcionSeleccionada !== null) {
                        if (esCorrecta) { bg = 'rgba(116, 198, 157, 0.2)'; border = '1px solid #74c69d'; }
                        else if (seleccionada) { bg = 'rgba(231, 111, 81, 0.2)'; border = '1px solid #e76f51'; }
                      }
                      return (
                        <button key={i} onClick={() => responder(i)} disabled={opcionSeleccionada !== null}
                          style={{ background: bg, border, borderRadius: '12px', padding: '12px 16px', color: '#eaf2eb', cursor: opcionSeleccionada !== null ? 'default' : 'pointer', textAlign: 'left', fontSize: '0.85rem', transition: 'all 0.2s ease' }}
                        >
                          {op}
                        </button>
                      );
                    })}
                  </div>
                  {feedback && (
                    <div style={{ marginTop: '16px', padding: '16px', background: feedback.esCorrecta ? 'rgba(116, 198, 157, 0.1)' : 'rgba(231, 111, 81, 0.1)', borderRadius: '12px' }}>
                      <p style={{ fontWeight: 800, marginBottom: '8px', color: feedback.esCorrecta ? '#74c69d' : '#e76f51' }}>
                        {feedback.esCorrecta ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{feedback.explicacion}</p>
                      <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <button onClick={() => setProvinciaActiva(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50px', padding: '8px 20px', color: 'white', fontSize: '0.8rem', cursor: 'pointer' }}>
                          Continuar Explorando
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#2d6a4f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginBottom: '2px' }}>COMPLETADO</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#eaf2eb' }}>{provinciasCompletadas.length} / 7 Provincias</h3>
            </div>
          </div>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1a1512', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #2a1f1a' }}>
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
