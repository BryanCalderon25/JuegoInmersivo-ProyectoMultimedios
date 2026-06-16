import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { Boton } from '../../components/common/Boton';
import { Modal } from '../../components/common/Modal';
import { AudioPlayer } from '../../components/media/AudioPlayer';
import '../../styles/game.css';
import '../../styles/effects.css';

/**
 * MUNDO 3: Cultura — Exploración de pueblo costarricense. 
 * El jugador encuentra objetos culturales dispersos por el pueblo.
 */
export const MundoCultura = ({ onSalir }) => {
  const { data: culturaData, loading } = useFetch('/json/cultura.json');
  const { ganarXP, desbloquearColeccionable, completarMundo, mostrarLogro } = useGame();
  const { reproducirBGM, reproducirSFX } = useAudio();

  const [objetoActivo, setObjetoActivo] = useState(null);
  const [objetosRecogidos, setObjetosRecogidos] = useState([]);
  const [vistaActual, setVistaActual] = useState('pueblo'); // pueblo | info

  useEffect(() => {
    reproducirBGM('/audio/musica/pueblo.mp3', 0.35);
  }, []);

  const todos = culturaData ? [
    ...culturaData.simbolos,
    ...culturaData.historia,
    ...(culturaData.comidas || []).slice(0, 3),
    ...(culturaData.expresiones || []).slice(0, 2),
  ] : [];

  const recogerObjeto = (objeto) => {
    setObjetoActivo(objeto);
    setVistaActual('info');
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
      <div style={{ textAlign: 'center', color: 'var(--dorado)' }}>
        <div style={{ fontSize: '4rem', animation: 'float 2s ease-in-out infinite' }}>🎭</div>
        <p style={{ marginTop: '1rem' }}>Preparando el pueblo...</p>
      </div>
    </div>
  );

  // Posiciones "ilustrativas" de los objetos en el pueblo
  const posicionesObjetos = [
    { top: '15%', left: '8%' }, { top: '20%', left: '40%' }, { top: '25%', left: '72%' },
    { top: '55%', left: '15%' }, { top: '50%', left: '50%' }, { top: '60%', left: '80%' },
    { top: '75%', left: '30%' }, { top: '78%', left: '65%' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1a0e00, #3d1c00, #1a0e00)', position: 'relative', paddingTop: 70 }}>
      <HUD enMundo onSalir={onSalir} />

      {vistaActual === 'pueblo' ? (
        /* VISTA DEL PUEBLO */
        <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, marginBottom: '0.5rem' }}>
            <span className="text-gradient-dorado">El Pueblo Tico</span>
          </h1>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Explora y descubre los tesoros de la cultura costarricense
          </p>

          {/* "Escena" del pueblo con objetos */}
          <div style={{ position: 'relative', width: '100%', minHeight: 500, background: 'linear-gradient(180deg, #87ceeb 0%, #87ceeb 40%, #4a7c3f 40%, #3d6b35 100%)', borderRadius: 20, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
            {/* Fondo del cielo */}
            <div style={{ position: 'absolute', top: '5%', left: '10%', width: 80, height: 30, borderRadius: 15, background: 'rgba(255,255,255,0.7)', filter: 'blur(4px)', animation: 'niebla-mover 20s linear infinite' }} />
            <div style={{ position: 'absolute', top: '8%', left: '60%', width: 120, height: 40, borderRadius: 20, background: 'rgba(255,255,255,0.6)', filter: 'blur(5px)', animation: 'niebla-mover 25s linear infinite reverse' }} />

            {/* Casas del pueblo */}
            {[{x:'5%',c:'#e74c3c'},{x:'35%',c:'#f39c12'},{x:'65%',c:'#27ae60'},{x:'78%',c:'#8e44ad'}].map((casa,i) => (
              <div key={i} style={{ position: 'absolute', bottom: '30%', left: casa.x }}>
                <div style={{ width: 70, height: 60, background: 'white', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                  <div style={{ position: 'absolute', bottom: '100%', left: -10, width: 0, height: 0, borderLeft: '45px solid transparent', borderRight: '45px solid transparent', borderBottom: `35px solid ${casa.c}` }} />
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 30, background: '#6d4c41', borderRadius: '4px 4px 0 0' }} />
                </div>
              </div>
            ))}

            {/* Objetos culturales dispersos */}
            {todos.slice(0, posicionesObjetos.length).map((obj, i) => {
              const pos = posicionesObjetos[i];
              const recogido = objetosRecogidos.includes(obj.id);
              return (
                <button
                  key={obj.id}
                  onClick={() => recogerObjeto(obj)}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    background: recogido ? 'rgba(64,145,108,0.3)' : 'rgba(255,255,255,0.15)',
                    border: recogido ? '2px solid var(--verde-hoja)' : '2px solid rgba(255,255,255,0.4)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: '1.8rem',
                    backdropFilter: 'blur(8px)',
                    animation: recogido ? 'none' : 'bounce 2s infinite',
                    transition: 'all 0.3s ease',
                    transform: recogido ? 'scale(0.9)' : 'scale(1)',
                    filter: recogido ? 'grayscale(0.5) opacity(0.6)' : 'none',
                    boxShadow: recogido ? 'none' : '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                  aria-label={`${recogido ? 'Ya encontrado: ' : 'Explorar: '}${obj.nombre || obj.expresion || 'Objeto cultural'}`}
                >
                  {obj.emoji || '🏛️'}
                  {!recogido && (
                    <div style={{ position: 'absolute', top: -8, right: -8, width: 16, height: 16, background: 'var(--dorado)', borderRadius: '50%', fontSize: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1s ease-in-out infinite' }}>
                      ✨
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Contador de progreso */}
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ color: 'var(--dorado)', fontWeight: 700 }}>
              🎭 {objetosRecogidos.length}/{Math.min(todos.length, posicionesObjetos.length)} objetos culturales encontrados
            </span>
          </div>
        </div>
      ) : (
        /* VISTA DE INFORMACIÓN DEL OBJETO */
        objetoActivo && (
          <div className="anim-zoom-in" style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(50,25,0,0.98), rgba(30,15,0,0.98))', border: '2px solid rgba(233,196,106,0.4)', borderRadius: 20, padding: '2.5rem', boxShadow: '0 0 40px rgba(233,196,106,0.15)' }}>
              {/* Encabezado */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '5rem', marginBottom: '0.5rem', animation: 'float 3s ease-in-out infinite' }}>
                  {objetoActivo.emoji || '🏛️'}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--dorado)' }}>
                  {objetoActivo.nombre || objetoActivo.expresion || objetoActivo.titulo}
                </h2>
                {objetoActivo.fecha && (
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: 4 }}>📅 {objetoActivo.fecha}</p>
                )}
                {objetoActivo.significado && (
                  <div style={{ background: 'rgba(233,196,106,0.1)', border: '1px solid rgba(233,196,106,0.3)', borderRadius: 10, padding: '8px 16px', marginTop: '0.75rem' }}>
                    <p style={{ color: 'var(--dorado)', fontSize: '0.85rem', fontStyle: 'italic' }}>{objetoActivo.significado}</p>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {objetoActivo.descripcion}
              </p>

              {/* Audio si existe */}
              {objetoActivo.audio && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <AudioPlayer src={objetoActivo.audio} titulo={`Audio: ${objetoActivo.nombre || objetoActivo.expresion}`} compacto />
                </div>
              )}

              {/* XP ganada */}
              <div style={{ background: 'rgba(233,196,106,0.15)', borderRadius: 10, padding: '10px 16px', textAlign: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--dorado)', fontWeight: 700, fontSize: '1.1rem' }}>
                  ⚡ +{objetoActivo.xpAlRecoger || 50} XP ganada
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Boton variante="dorado" onClick={() => setVistaActual('pueblo')} icono="🔙">
                  Volver al Pueblo
                </Boton>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
