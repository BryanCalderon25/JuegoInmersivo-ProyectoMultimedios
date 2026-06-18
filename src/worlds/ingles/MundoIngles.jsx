import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { DialogoRPG } from '../../components/game/DialogoRPG';
import { Boton } from '../../components/common/Boton';
import { BarraVida } from '../../components/common/BarraVida';
import { AudioPlayer } from '../../components/media/AudioPlayer';
import '../../styles/game.css';
import '../../styles/effects.css';

/**
 * MUNDO 4: Inglés — RPG conversacional con turistas en distintas locaciones.
 */
export const MundoIngles = ({ onSalir }) => {
  const { data: inglesData, loading } = useFetch('/json/ingles.json');
  const { ganarXP, completarMundo, mostrarLogro } = useGame();
  const { reproducirBGM, reproducirSFX } = useAudio();

  const [convIndex, setConvIndex] = useState(0);
  const [estadoConv, setEstadoConv] = useState('mapa'); // mapa | conversacion | resultado
  const [puntosAciertos, setPuntosAciertos] = useState(0);
  const [totalAciertos, setTotalAciertos] = useState(0);
  const [vocabularioActual, setVocabularioActual] = useState([]);
  const [mostrarVocabulario, setMostrarVocabulario] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);

  const conversaciones = inglesData?.conversaciones || [];
  const convActual = conversaciones[convIndex];

  useEffect(() => {
    reproducirBGM('/audio/musica/rpg-ingles.mp3', 0.35);
  }, []);

  const iniciarConversacion = (index) => {
    setConvIndex(index);
    setEstadoConv('conversacion');
    setMostrarVocabulario(false);
    if (conversaciones[index]?.vocabulario) {
      setVocabularioActual(conversaciones[index].vocabulario);
    }
  };

  const manejarOpcion = (opcion, index, esCorrecta) => {
    setTotalAciertos(prev => prev + 1);
    if (esCorrecta) {
      setPuntosAciertos(prev => prev + 1);
      reproducirSFX('/audio/efectos/victoria.mp3', 0.5);
    } else {
      reproducirSFX('/audio/efectos/error.mp3', 0.5);
    }
  };

  const finConversacion = () => {
    const xp = convActual?.xpAlCompletar || 100;
    ganarXP(xp, `Inglés: ${convActual?.locacion}`);
    setEstadoConv('resultado');

    if (convIndex + 1 >= conversaciones.length) {
      setTimeout(() => {
        completarMundo('ingles', 3, 500);
        mostrarLogro({ icono: '🌎', nombre: '¡Bilingüe!', descripcion: 'Completaste el módulo de inglés.' });
      }, 1000);
    }
  };

  const siguienteConversacion = () => {
    if (convIndex + 1 < conversaciones.length) {
      setConvIndex(prev => prev + 1);
      setEstadoConv('mapa');
    } else {
      setEstadoConv('mapa');
      setConvIndex(0);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0520' }}>
      <div style={{ textAlign: 'center', color: 'var(--color-logro)' }}>
        <div style={{ fontSize: '4rem', animation: 'float 2s ease-in-out infinite' }}>🌎</div>
        <p style={{ marginTop: '1rem' }}>Loading language world...</p>
      </div>
    </div>
  );

  return (
    <div className="anim-fade-in" style={{ minHeight: '100vh', background: 'url(/images/fondos/playa-fondo.webp) center/cover no-repeat fixed', position: 'relative', paddingTop: 70 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,5,32,0.8)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* PANTALLA INTRODUCTORIA */}
      {introVisible && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10, 5, 32, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)' }}>
          <div className="anim-slide-up" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(155,93,229,0.5)', borderRadius: 24, padding: '3rem', maxWidth: 600, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🌎</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>Mundo 4: Bilingüe</h2>
            <p style={{ color: 'var(--color-logro)', fontWeight: 600, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Práctica de Inglés</p>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Costa Rica recibe turistas de todo el mundo. ¡Es hora de poner en práctica tu inglés ayudando a visitantes en diferentes locaciones turísticas!
              </p>
              <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>🗺️ Selecciona a un turista en el mapa para iniciar una conversación.</li>
                <li>💬 Lee lo que te dicen y elige la mejor respuesta en inglés.</li>
                <li>📚 Aprende nuevo vocabulario después de cada interacción.</li>
              </ul>
            </div>
            
            <Boton variante="dorado" tamaño="lg" onClick={() => setIntroVisible(false)} icono="🚀">
              ¡Hablar con Turistas!
            </Boton>
          </div>
        </div>
      )}

      <HUD enMundo onSalir={onSalir} />

      <div style={{ padding: '1.5rem', maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, marginBottom: '0.5rem' }}>
          <span style={{ background: 'linear-gradient(135deg, #9b5de5, #c77dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Mundo Bilingüe 🌎
          </span>
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Habla con turistas y practica tu inglés mientras aprendes sobre Costa Rica
        </p>

        {estadoConv === 'mapa' && (
          /* VISTA DEL MAPA DE CONVERSACIONES */
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {conversaciones.map((conv, i) => (
                <button
                  key={conv.id}
                  onClick={() => iniciarConversacion(i)}
                  aria-label={`Hablar con ${conv.npc} en ${conv.locacion}`}
                  style={{
                    all: 'unset',
                    display: 'block',
                    background: 'rgba(155,93,229,0.1)',
                    border: '2px solid rgba(155,93,229,0.3)',
                    borderRadius: 20,
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(155,93,229,0.3)'; e.currentTarget.style.borderColor = 'rgba(155,93,229,0.6)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(155,93,229,0.3)'; }}
                >
                  {/* NPC Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '3rem', animation: 'float 3s ease-in-out infinite', animationDelay: `${i * 0.3}s` }}>{conv.avatarEmoji}</span>
                    <div>
                      <div style={{ fontWeight: 800, color: 'white', fontSize: '1.05rem' }}>{conv.npc}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-logro)', fontWeight: 600 }}>Tourist</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(155,93,229,0.15)', borderRadius: 10, padding: '8px 12px', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>📍 Locación</div>
                    <div style={{ color: 'white', fontSize: '0.88rem', fontWeight: 600 }}>{conv.locacion}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: 2 }}>{conv.locacionDescripcion}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--dorado)' }}>⚡ {conv.xpAlCompletar} XP</span>
                    <span style={{ background: 'var(--color-logro)', color: 'white', padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>
                      HABLAR
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Panel de vocabulario */}
            {vocabularioActual.length > 0 && (
              <div style={{ marginTop: '2rem', background: 'rgba(155,93,229,0.08)', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(155,93,229,0.2)' }}>
                <h3 style={{ color: 'var(--color-logro)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  📚 Vocabulario de la última conversación
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                  {vocabularioActual.map((v, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 14px' }}>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{v.espanol}</div>
                      <div style={{ color: 'var(--color-logro)', fontSize: '0.85rem', margin: '2px 0' }}>{v.ingles}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontStyle: 'italic' }}>{v.pronunciacion}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {estadoConv === 'conversacion' && convActual && (
          /* DIÁLOGO CON EL TURISTA */
          <div>
            {/* Escenario de la conversación */}
            <div style={{ background: 'rgba(155,93,229,0.1)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(155,93,229,0.2)', textAlign: 'center' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{convActual.avatarEmoji}</p>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{convActual.npc}</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>📍 {convActual.locacion} · {convActual.locacionDescripcion}</p>
            </div>

            <DialogoRPG
              npc={{ nombre: convActual.npc, emoji: convActual.avatarEmoji }}
              dialogos={convActual.dialogos}
              onOpcionSeleccionada={manejarOpcion}
              onFin={finConversacion}
              audioSrc={convActual.dialogos[0]?.audio}
            />
          </div>
        )}

        {estadoConv === 'resultado' && convActual && (
          /* RESULTADO DE LA CONVERSACIÓN */
          <div className="anim-zoom-in" style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(155,93,229,0.15)', border: '2px solid rgba(155,93,229,0.4)', borderRadius: 20, padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--color-logro)' }}>
              ¡Conversación completada!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Hablaste con {convActual.npc} en {convActual.locacion}
            </p>

            <div style={{ background: 'rgba(233,196,106,0.15)', borderRadius: 12, padding: '1.2rem', marginBottom: '2rem' }}>
              <p style={{ color: 'var(--dorado)', fontWeight: 800, fontSize: '1.2rem' }}>
                ⚡ +{convActual.xpAlCompletar} XP
              </p>
            </div>

            {/* Vocabulario aprendido */}
            {convActual.vocabulario?.length > 0 && (
              <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <h3 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '0.9rem' }}>📚 Vocabulario aprendido:</h3>
                {convActual.vocabulario.map((v, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 4 }}>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{v.espanol}</span>
                    <span style={{ color: 'var(--color-logro)', fontWeight: 700 }}>{v.ingles}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Boton variante="dorado" onClick={siguienteConversacion} icono={convIndex + 1 < conversaciones.length ? '▶' : '🔁'}>
                {convIndex + 1 < conversaciones.length ? 'Siguiente conversación' : 'Reiniciar módulo'}
              </Boton>
              <Boton variante="glass" onClick={() => setEstadoConv('mapa')}>
                Ver mapa
              </Boton>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};
