import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { Boton } from '../../components/common/Boton';
import { Modal } from '../../components/common/Modal';
import { Particulas } from '../../components/effects/Particulas';
import '../../styles/game.css';
import '../../styles/effects.css';

/**
 * MUNDO 2: Geografía — Mapa SVG interactivo de las 7 provincias de Costa Rica.
 */
export const MundoGeografia = ({ onSalir }) => {
  const { data: provincias, loading } = useFetch('/json/provincias.json');
  const { ganarXP, completarMundo, desbloquearColeccionable, mostrarLogro } = useGame();
  const { reproducirBGM } = useAudio();

  const [provinciaActiva, setProvinciaActiva] = useState(null);
  const [provinciaHover, setProvinciaHover] = useState(null);
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--negro-suave)' }}>
      <div style={{ textAlign: 'center', color: 'var(--azul-cielo)' }}>
        <div style={{ fontSize: '4rem', animation: 'float 2s ease-in-out infinite' }}>🗺️</div>
        <p style={{ marginTop: '1rem' }}>Cargando mapa de Costa Rica...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #051525, #0a1e35)', position: 'relative', overflow: 'hidden', paddingTop: 70 }}>
      <HUD enMundo onSalir={onSalir} />
      <Particulas cantidad={10} tipo="estrellas" velocidad={0.3} />

      <div style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, marginBottom: '0.5rem' }}>
          <span className="text-gradient-verde">Provincias de Costa Rica</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Haz clic en una provincia para conocerla y superar su desafío
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 900 ? '3fr 2fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
          {/* MAPA SVG */}
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ position: 'relative', maxWidth: '100%' }}>
              {/* Intentar cargar el SVG externo */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <object
                  data="/mapa.svg"
                  type="image/svg+xml"
                  style={{ width: '100%', maxHeight: 450, display: 'block' }}
                  aria-label="Mapa de Costa Rica"
                  onError={() => {}}
                >
                  {/* Fallback: grid visual de provincias */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                      (Coloca mapa.svg en la carpeta /public/ para ver el mapa interactivo)
                    </p>
                    {/* Vista alternativa en cards */}
                    {provincias?.map(p => (
                      <button key={p.id}
                        onClick={() => seleccionarProvincia(p)}
                        style={{
                          background: provinciaActiva?.id === p.id ? `${p.color}40` : 'rgba(255,255,255,0.04)',
                          border: `2px solid ${provinciaActiva?.id === p.id ? p.color : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: 10, padding: '10px 16px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          cursor: 'pointer', transition: 'all 0.2s ease', color: 'white',
                          textAlign: 'left',
                        }}>
                        <span style={{ fontWeight: 700 }}>{p.emoji} {p.nombre}</span>
                        {provinciasCompletadas.includes(p.id) && <span>✅</span>}
                      </button>
                    ))}
                  </div>
                </object>
              </div>
            </div>
            {/* Leyenda */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
              {provincias?.map(p => (
                <button key={p.id}
                  onClick={() => seleccionarProvincia(p)}
                  style={{ background: provinciaActiva?.id === p.id ? `${p.color}60` : 'rgba(255,255,255,0.06)', border: `1px solid ${p.color}80`, borderRadius: 20, padding: '4px 12px', color: 'white', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-ui)' }}
                  aria-label={`Seleccionar ${p.nombre}${provinciasCompletadas.includes(p.id) ? ' (completada)' : ''}`}
                  aria-pressed={provinciaActiva?.id === p.id}
                >
                  {p.emoji} {p.nombre} {provinciasCompletadas.includes(p.id) ? '✅' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* PANEL LATERAL: Info de provincia + desafío */}
          <div>
            {!provinciaActiva ? (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Selecciona una provincia del mapa para ver su información y superar el desafío.</p>
                <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(0,119,182,0.15)', borderRadius: 12, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                  📍 {provinciasCompletadas.length}/7 provincias completadas
                </div>
              </div>
            ) : (
              <div className="anim-zoom-in" style={{ background: `linear-gradient(135deg, rgba(5,20,35,0.98), rgba(10,30,50,0.98))`, border: `2px solid ${provinciaActiva.color}60`, borderRadius: 20, padding: '1.5rem', boxShadow: `0 0 30px ${provinciaActiva.color}20` }}>
                {/* Encabezado de provincia */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '3rem', animation: 'float 3s ease-in-out infinite' }}>{provinciaActiva.emoji}</span>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>{provinciaActiva.nombre}</h2>
                    <p style={{ fontSize: '0.8rem', color: provinciaActiva.color, fontWeight: 600 }}>Capital: {provinciaActiva.capital}</p>
                  </div>
                  {provinciasCompletadas.includes(provinciaActiva.id) && (
                    <div style={{ marginLeft: 'auto', background: 'rgba(64,145,108,0.2)', border: '1px solid var(--verde-hoja)', borderRadius: 8, padding: '4px 10px', fontSize: '0.75rem', color: 'var(--verde-claro)' }}>
                      ✅ Completada
                    </div>
                  )}
                </div>

                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                  {provinciaActiva.descripcion}
                </p>

                {/* Datos rápidos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {[
                    { etiqueta: '👥 Población', valor: provinciaActiva.datos?.poblacion?.toLocaleString('es-CR') },
                    { etiqueta: '📐 Extensión', valor: provinciaActiva.datos?.extension },
                    { etiqueta: '🏛️ Fundación', valor: provinciaActiva.datos?.fundacion },
                    { etiqueta: '🏘️ Cantones', valor: provinciaActiva.cantones },
                  ].map(item => (
                    <div key={item.etiqueta} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px' }}>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{item.etiqueta}</div>
                      <div style={{ fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>{item.valor}</div>
                    </div>
                  ))}
                </div>

                {/* Parques Nacionales */}
                {provinciaActiva.parquesNacionales?.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>🌳 Parques Nacionales</p>
                    {provinciaActiva.parquesNacionales.map(p => (
                      <div key={p} style={{ background: 'rgba(64,145,108,0.15)', borderRadius: 6, padding: '4px 10px', fontSize: '0.8rem', color: 'var(--verde-claro)', marginBottom: 4 }}>
                        {p}
                      </div>
                    ))}
                  </div>
                )}

                {/* Botón de desafío */}
                {!desafioActivo ? (
                  <Boton variante="dorado" onClick={iniciarDesafio} ariaLabel={`Comenzar desafío de ${provinciaActiva.nombre}`} icono="🎯">
                    ¡Superar el Desafío!
                  </Boton>
                ) : (
                  /* DESAFÍO */
                  <div className="anim-slide-up" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '1.2rem' }}>
                    <p style={{ fontWeight: 700, color: 'var(--dorado)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                      ❓ {provinciaActiva.desafio.pregunta}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {provinciaActiva.desafio.opciones.map((op, i) => {
                        const esCorrecta = i === provinciaActiva.desafio.respuestaCorrecta;
                        const seleccionada = opcionSeleccionada === i;
                        let bg = 'rgba(255,255,255,0.05)';
                        let border = 'rgba(255,255,255,0.1)';
                        if (opcionSeleccionada !== null) {
                          if (esCorrecta) { bg = 'rgba(64,145,108,0.4)'; border = 'var(--verde-claro)'; }
                          else if (seleccionada) { bg = 'rgba(249,65,68,0.3)'; border = 'var(--color-vida)'; }
                        }
                        return (
                          <button key={i} onClick={() => responder(i)} disabled={opcionSeleccionada !== null}
                            style={{ background: bg, border: `2px solid ${border}`, borderRadius: 10, padding: '10px 14px', color: 'white', cursor: opcionSeleccionada !== null ? 'not-allowed' : 'pointer', textAlign: 'left', fontSize: '0.87rem', fontFamily: 'var(--font-ui)', transition: 'all 0.2s ease' }}
                            aria-label={op}>
                            {['A', 'B', 'C', 'D'][i]}) {op}
                          </button>
                        );
                      })}
                    </div>
                    {feedback && (
                      <div className="anim-slide-up" style={{ marginTop: '1rem', padding: '12px', background: feedback.esCorrecta ? 'rgba(64,145,108,0.2)' : 'rgba(249,65,68,0.2)', borderRadius: 10, borderLeft: `3px solid ${feedback.esCorrecta ? 'var(--verde-claro)' : 'var(--color-vida)'}` }}>
                        <p style={{ fontWeight: 700, marginBottom: 6, color: feedback.esCorrecta ? 'var(--verde-claro)' : 'var(--rojo-lapa)' }}>
                          {feedback.esCorrecta ? '🎉 ¡Correcto!' : '😅 Incorrecto'}
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{feedback.explicacion}</p>
                        <p style={{ color: 'var(--dorado)', fontWeight: 700, marginTop: 8 }}>+{feedback.xpGanada} XP</p>
                        <Boton variante="glass" tamaño="sm" onClick={() => setProvinciaActiva(null)} estiloExtra={{ marginTop: '0.75rem' }}>
                          Ver otro lugar
                        </Boton>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
