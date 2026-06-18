import React, { useState, useEffect } from 'react';
import { Boton } from '../../components/common/Boton';
import { PantallaDerrota } from '../../components/game/PantallaDerrota';
import { PantallaVictoria } from '../../components/game/PantallaVictoria';
import { useGame } from '../../hooks/useGame';

export const MinijuegoMuseo = ({ data, onVolver, onGanarItem, reproducirSFX }) => {
  const { perderXP } = useGame();
  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [emparejadas, setEmparejadas] = useState([]);
  const [infoMostrar, setInfoMostrar] = useState(null);
  const [intentos, setIntentos] = useState(15);
  const [derrota, setDerrota] = useState(false);
  const [mostrarVictoria, setMostrarVictoria] = useState(false);

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
          const nuevosIntentos = intentos - 1;
          setIntentos(nuevosIntentos);
          perderXP(10, 'Fallo en Museo');
          if (nuevosIntentos <= 0) {
            setDerrota(true);
          }
        }, 500);
      }
    }
  };

  const reiniciarMinijuego = () => {
    setDerrota(false);
    setIntentos(15);
    setVolteadas([]);
    setEmparejadas([]);
    setInfoMostrar(null);
    setCartas(prev => [...prev].sort(() => Math.random() - 0.5));
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
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>Encuentra las parejas para aprender sobre nuestros símbolos patrios e historia.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 20, fontWeight: 800, color: intentos > 2 ? 'var(--dorado)' : 'var(--rojo)' }}>
            Intentos restantes: {intentos}
          </div>
        </div>

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

      {/* Pantalla de Información del Objeto */}
      {infoMostrar && (
        <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
          <div className="anim-slide-up" style={{ background: 'linear-gradient(145deg, #2a1610, #3e2015)', border: '2px solid var(--dorado)', borderRadius: 24, padding: '2.5rem', maxWidth: 500, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))' }}>
              {infoMostrar.emoji}
            </div>
            <h2 style={{ color: 'var(--dorado)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: 2 }}>
              {infoMostrar.nombre}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {infoMostrar.descripcion}
            </p>
            <Boton variante="dorado" onClick={() => {
              setInfoMostrar(null);
              if (completado) setMostrarVictoria(true);
            }}>
              Continuar Jugando
            </Boton>
          </div>
        </div>
      )}

      {/* Estado del Mundo */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
        <div style={{ background: completado ? 'rgba(64,145,108,0.9)' : 'rgba(0,0,0,0.7)', borderRadius: 12, padding: '8px 14px', fontSize: '0.8rem', color: completado ? 'white' : 'var(--dorado)', backdropFilter: 'blur(8px)', border: completado ? '2px solid var(--verde-claro)' : 'none', fontWeight: completado ? 900 : 'normal' }}>
          {completado ? '✓ MUSEO COMPLETADO' : `Parejas: ${emparejadas.length / 2}/${cartas.length / 2}`}
        </div>
        {completado && (
          <button 
            onClick={() => {
              if (window.confirm('¿Quieres reiniciar este museo para volver a jugar?')) {
                reiniciarMinijuego();
              }
            }}
            style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid var(--dorado)', borderRadius: 8, padding: '6px 12px', color: 'var(--dorado)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold', backdropFilter: 'blur(4px)', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,215,0,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
          >
            🔄 Volver a Jugar
          </button>
        )}
      </div>

      {/* Pantalla Derrota */}
      {derrota && (
        <PantallaDerrota 
          xpPerdida={50} // 10 por cada intento perdido
          onReintentar={reiniciarMinijuego}
          onSalir={onVolver}
        />
      )}

      {/* Pantalla Victoria */}
      {mostrarVictoria && (
        <PantallaVictoria 
          xpGanada={100}
          titulo="¡Museo Completado!"
          mensaje="Has emparejado todas las reliquias y aprendido sobre la cultura tica."
          onContinuar={() => setMostrarVictoria(false)}
          onSalir={onVolver}
        />
      )}
    </div>
  );
};
