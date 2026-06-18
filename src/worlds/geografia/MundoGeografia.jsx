import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { Boton } from '../../components/common/Boton';
import { Modal } from '../../components/common/Modal';
import { Particulas } from '../../components/effects/Particulas';
import { MapaCostaRica } from '../../components/game/MapaCostaRica';
import '../../styles/game.css';
import '../../styles/effects.css';

/**
 * MUNDO 2: Geografía — Mapa SVG interactivo de las 7 provincias de Costa Rica.
 * Incorpora el mapa en React para interacciones directas con las provincias.
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
    if (!provincia) return;
    setProvinciaActiva(provincia);
    setDesafioActivo(false);
    setOpcionSeleccionada(null);
    setFeedback(null);
  };

  const handleProvinciaMapSelect = (id) => {
    const prov = provincias?.find(p => p.id === id);
    if (prov) seleccionarProvincia(prov);
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
        <p style={{ marginTop: '1rem' }}>Cargando mapa de Costa Rica...</p>
      </div>
    </div>
  );

  return (
    <div className="anim-fade-in" style={{ minHeight: '100vh', background: 'url(/images/fondos/montaña-fondo.webp) center/cover no-repeat fixed', position: 'relative', overflowX: 'hidden', overflowY: 'auto', paddingTop: 70, paddingBottom: '2rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,21,37,0.75)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HUD enMundo onSalir={onSalir} />
      <Particulas cantidad={10} tipo="estrellas" velocidad={0.3} />

      <div style={{ padding: '1rem', maxWidth: 1300, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, marginBottom: '0.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>
          <span className="text-gradient-verde">Provincias de Costa Rica</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: '1rem', fontSize: '0.9rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Haz clic en una provincia para conocerla y superar su desafío
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 900 ? '3fr 2fr' : '1fr', gap: '2rem', alignItems: 'start' }}>
          {/* MAPA SVG INTERACTIVO */}
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ position: 'relative', width: '100%', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapaCostaRica
                provinciaActiva={provinciaActiva?.id}
                provinciasCompletadas={provinciasCompletadas}
                onProvinciaSelect={handleProvinciaMapSelect}
              />
            </div>
            {/* Leyenda Visual */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
              {provincias?.map(p => (
                <button key={p.id}
                  onClick={() => seleccionarProvincia(p)}
                  style={{ 
                    background: provinciaActiva?.id === p.id ? 'var(--dorado)' : 'rgba(255,255,255,0.05)', 
                    border: `1px solid ${provinciaActiva?.id === p.id ? '#ffffff' : 'rgba(255,255,255,0.1)'}`, 
                    borderRadius: 20, padding: '6px 14px', 
                    color: provinciaActiva?.id === p.id ? '#000' : 'white', 
                    fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.3s ease', fontWeight: provinciaActiva?.id === p.id ? 800 : 500,
                    boxShadow: provinciaActiva?.id === p.id ? '0 0 15px rgba(249, 199, 79, 0.4)' : 'none'
                  }}
                  aria-label={`Seleccionar ${p.nombre}`}
                  aria-pressed={provinciaActiva?.id === p.id}
                >
                  {p.nombre} {provinciasCompletadas.includes(p.id) ? ' ✓' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* PANEL LATERAL: Info de provincia + desafío */}
          <div>
            {!provinciaActiva ? (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>Selecciona una provincia del mapa para ver su información y superar el desafío.</p>
                <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(0,119,182,0.15)', borderRadius: 12, fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                  {provinciasCompletadas.length}/7 provincias completadas
                </div>
              </div>
            ) : (
              <div className="anim-zoom-in" style={{ background: `linear-gradient(135deg, rgba(5,20,35,0.98), rgba(10,30,50,0.98))`, border: `2px solid ${provinciaActiva.color}60`, borderRadius: 20, padding: '1.5rem', boxShadow: `0 0 30px ${provinciaActiva.color}20` }}>
                {/* Encabezado de provincia */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white' }}>{provinciaActiva.nombre}</h2>
                    <p style={{ fontSize: '0.8rem', color: provinciaActiva.color, fontWeight: 600 }}>Capital: {provinciaActiva.capital}</p>
                  </div>
                  {provinciasCompletadas.includes(provinciaActiva.id) && (
                    <div style={{ marginLeft: 'auto', background: 'rgba(64,145,108,0.2)', border: '1px solid var(--verde-hoja)', borderRadius: 8, padding: '4px 10px', fontSize: '0.75rem', color: 'var(--verde-claro)' }}>
                      ✓ Completada
                    </div>
                  )}
                </div>

                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                  {provinciaActiva.descripcion}
                </p>

                {/* Datos rápidos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {[
                    { etiqueta: 'Población', valor: provinciaActiva.datos?.poblacion?.toLocaleString('es-CR') },
                    { etiqueta: 'Extensión', valor: provinciaActiva.datos?.extension },
                    { etiqueta: 'Fundación', valor: provinciaActiva.datos?.fundacion },
                    { etiqueta: 'Cantones', valor: provinciaActiva.cantones },
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
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Parques Nacionales</p>
                    {provinciaActiva.parquesNacionales.map(p => (
                      <div key={p} style={{ background: 'rgba(64,145,108,0.15)', borderRadius: 6, padding: '4px 10px', fontSize: '0.8rem', color: 'var(--verde-claro)', marginBottom: 4 }}>
                        {p}
                      </div>
                    ))}
                  </div>
                )}

                {/* Botón de desafío */}
                {!desafioActivo ? (
                  <Boton variante="dorado" onClick={iniciarDesafio} ariaLabel={`Comenzar desafío de ${provinciaActiva.nombre}`} estiloExtra={{ width: '100%', justifyContent: 'center' }}>
                    ¡Superar el Desafío!
                  </Boton>
                ) : (
                  <Boton variante="glass" onClick={() => setDesafioActivo(false)} estiloExtra={{ width: '100%', justifyContent: 'center' }}>
                    Ocultar Desafío
                  </Boton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OVERLAY ESPECTACULAR DEL DESAFÍO */}
      {desafioActivo && provinciaActiva && (
        <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: 'rgba(5, 15, 25, 0.9)', backdropFilter: 'blur(15px)', padding: '2rem 1rem' }}>
          <div className="anim-zoom-in" style={{ margin: 'auto', background: 'linear-gradient(145deg, rgba(20,40,60,0.95), rgba(10,20,30,0.95))', border: `2px solid ${provinciaActiva.color}`, borderRadius: 30, padding: '3rem', maxWidth: 800, width: '100%', textAlign: 'center', boxShadow: `0 20px 60px ${provinciaActiva.color}40`, position: 'relative' }}>
            
            {/* Botón cerrar */}
            <button onClick={() => setDesafioActivo(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 40, height: 40, color: 'white', fontSize: '1.2rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>
              ✕
            </button>

            <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite', filter: `drop-shadow(0 0 20px ${provinciaActiva.color})` }}>
              {provinciaActiva.emoji}
            </div>
            
            <h2 style={{ color: provinciaActiva.color, fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, marginBottom: '0.5rem' }}>
              Desafío de {provinciaActiva.nombre}
            </h2>
            
            <p style={{ color: 'white', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, lineHeight: 1.4, marginBottom: '3rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
              {provinciaActiva.desafio.pregunta}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {provinciaActiva.desafio.opciones.map((op, i) => {
                const esCorrecta = i === provinciaActiva.desafio.respuestaCorrecta;
                const seleccionada = opcionSeleccionada === i;
                let bg = 'rgba(255,255,255,0.05)';
                let border = 'rgba(255,255,255,0.1)';
                let transform = 'scale(1)';
                let boxShadow = 'none';

                if (opcionSeleccionada !== null) {
                  if (esCorrecta) { 
                    bg = 'rgba(64,145,108,0.8)'; 
                    border = 'var(--verde-claro)'; 
                    boxShadow = '0 0 20px rgba(64,145,108,0.6)';
                    transform = 'scale(1.02)';
                  }
                  else if (seleccionada) { 
                    bg = 'rgba(249,65,68,0.6)'; 
                    border = 'var(--color-vida)'; 
                  }
                }

                return (
                  <button key={i} onClick={() => responder(i)} disabled={opcionSeleccionada !== null}
                    style={{ background: bg, border: `2px solid ${border}`, borderRadius: 16, padding: '1.2rem', color: 'white', cursor: opcionSeleccionada !== null ? 'default' : 'pointer', fontSize: '1.1rem', fontWeight: 600, transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform, boxShadow, display: 'flex', alignItems: 'center', gap: '1rem' }}
                    onMouseEnter={e => { if (opcionSeleccionada === null) { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; } }}
                    onMouseLeave={e => { if (opcionSeleccionada === null) { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                  >
                    <div style={{ background: 'rgba(0,0,0,0.3)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                      {['A', 'B', 'C', 'D'][i]}
                    </div>
                    <div style={{ textAlign: 'left', flex: 1 }}>{op}</div>
                    {opcionSeleccionada !== null && esCorrecta && <span style={{ fontSize: '1.5rem' }}>✅</span>}
                    {opcionSeleccionada !== null && seleccionada && !esCorrecta && <span style={{ fontSize: '1.5rem' }}>❌</span>}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div className="anim-slide-up" style={{ marginTop: '2rem', padding: '1.5rem', background: feedback.esCorrecta ? 'rgba(64,145,108,0.15)' : 'rgba(249,65,68,0.15)', borderRadius: 20, border: `2px solid ${feedback.esCorrecta ? 'var(--verde-claro)' : 'var(--color-vida)'}` }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: feedback.esCorrecta ? 'var(--verde-claro)' : 'var(--rojo-lapa)' }}>
                  {feedback.esCorrecta ? '¡Respuesta Correcta! 🎉' : 'Respuesta Incorrecta 😅'}
                </h3>
                <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {feedback.explicacion}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', padding: '8px 16px', borderRadius: 50, color: 'var(--dorado)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                  <span>🌟</span> +{feedback.xpGanada} XP
                </div>
                <div>
                  <Boton variante={feedback.esCorrecta ? "dorado" : "glass"} tamaño="lg" onClick={() => setDesafioActivo(false)} icono="🗺️">
                    Volver al Mapa
                  </Boton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
