import React, { useState, useEffect } from 'react';
import { Boton } from '../../components/common/Boton';
import { BotonVolver } from '../../components/common/BotonVolver';

export const MinijuegoMuseo = ({ data, onVolver, onGanarItem, reproducirSFX }) => {
  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [emparejadas, setEmparejadas] = useState([]);
  const [infoMostrar, setInfoMostrar] = useState(null);

  // Inicializar juego de memoria
  useEffect(() => {
    if (!data) return;
    const items = [...(data.simbolos || []), ...(data.historia || [])].slice(0, 8);
    // Duplicar para hacer parejas
    let pares = [...items, ...items].map((item, index) => ({
      ...item,
      uid: `${item.id}-${index}` // unique ID para la carta
    }));
    // Barajar
    pares.sort(() => Math.random() - 0.5);
    setCartas(pares);
  }, [data]);

  const manejarClickCarta = (cartaIndex) => {
    if (volteadas.length >= 2 || volteadas.includes(cartaIndex) || emparejadas.includes(cartaIndex)) return;

    reproducirSFX('/audio/efectos/encuentro.mp3', 0.5);
    const nuevasVolteadas = [...volteadas, cartaIndex];
    setVolteadas(nuevasVolteadas);

    if (nuevasVolteadas.length === 2) {
      const idx1 = nuevasVolteadas[0];
      const idx2 = nuevasVolteadas[1];
      const carta1 = cartas[idx1];
      const carta2 = cartas[idx2];

      if (carta1.id === carta2.id) {
        // MATCH!
        setTimeout(() => {
          reproducirSFX('/audio/efectos/victoria.mp3', 0.5);
          setEmparejadas(prev => [...prev, idx1, idx2]);
          setVolteadas([]);
          setInfoMostrar(carta1); // Mostrar info del objeto
          onGanarItem(carta1);
        }, 300);
      } else {
        // NO MATCH
        setTimeout(() => {
          reproducirSFX('/audio/efectos/error.mp3', 0.5);
          setVolteadas([]);
        }, 500);
      }
    }
  };

  const progreso = cartas.length > 0 ? (emparejadas.length / cartas.length) * 100 : 0;
  const completado = progreso === 100;

  return (
    <div className="anim-zoom-in" style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #1f0d05, #4a2511)', zIndex: 1000, overflowY: 'auto', padding: '80px 2rem 2rem' }}>
      <button 
        onClick={onVolver} 
        style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, backdropFilter: 'blur(10px)' }}
      >
        ⬅ Volver al Pueblo
      </button>

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--dorado)', marginBottom: '0.5rem' }}>Museo Histórico</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem' }}>Encuentra las parejas para aprender sobre nuestros símbolos patrios e historia.</p>
        
        {/* Barra de progreso */}
        <div style={{ width: '100%', height: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 5, marginBottom: '2rem', overflow: 'hidden' }}>
          <div style={{ width: `${progreso}%`, height: '100%', background: 'var(--dorado)', transition: 'width 0.5s ease' }} />
        </div>

        {/* Tablero de Memoria */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', perspective: '1000px' }}>
          {cartas.map((carta, index) => {
            const estaVolteada = volteadas.includes(index) || emparejadas.includes(index);
            return (
              <div 
                key={carta.uid} 
                onClick={() => manejarClickCarta(index)}
                style={{
                  height: 150,
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transform: estaVolteada ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                  cursor: estaVolteada ? 'default' : 'pointer'
                }}
              >
                {/* Parte Trasera (Carta oculta) */}
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #8e44ad, #9b5de5)', border: '2px solid rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                  🇨🇷
                </div>
                
                {/* Parte Delantera (Carta revelada) */}
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', background: 'white', border: '2px solid var(--dorado)', borderRadius: 12, transform: 'rotateY(180deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', boxShadow: '0 4px 15px rgba(233,196,106,0.4)', overflow: 'hidden' }}>
                  {carta.imagen ? (
                    <img src={carta.imagen} alt={carta.nombre || carta.titulo} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '3rem' }}>{carta.emoji}</span>
                  )}
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#333', textAlign: 'center', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{carta.nombre || carta.titulo}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Modal al emparejar */}
      {infoMostrar && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="anim-slide-up" style={{ background: '#2c1e16', border: '2px solid var(--dorado)', borderRadius: 20, padding: '2rem', maxWidth: 500, textAlign: 'center', color: 'white' }}>
            {infoMostrar.imagen ? (
              <img src={infoMostrar.imagen} alt={infoMostrar.nombre || infoMostrar.titulo} style={{ width: 120, height: 120, objectFit: 'contain', margin: '0 auto 1rem', animation: 'bounce 2s infinite' }} />
            ) : (
              <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>{infoMostrar.emoji}</div>
            )}
            <h2 style={{ color: 'var(--dorado)', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>{infoMostrar.nombre || infoMostrar.titulo}</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {infoMostrar.descripcion}
            </p>
            <Boton variante="dorado" onClick={() => {
              setInfoMostrar(null);
              if (completado) onVolver();
            }}>
              {completado ? '¡Volver al Pueblo!' : 'Continuar Jugando'}
            </Boton>
          </div>
        </div>
      )}
    </div>
  );
};
