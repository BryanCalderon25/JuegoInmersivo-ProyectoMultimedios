import React, { useState, useEffect } from 'react';
import { Boton } from '../../components/common/Boton';
import { DialogoRPG } from '../../components/game/DialogoRPG';

export const MinijuegoParque = ({ data, onVolver, onGanarItem, reproducirSFX, yaCompletados = [] }) => {
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [completado, setCompletado] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const expresiones = data?.expresiones || [];

  useEffect(() => {
    cargarSiguientePregunta();
  }, [expresiones]);

  const cargarSiguientePregunta = () => {
    setFeedback(null);
    if (expresiones.length === 0) return;
    const noAdivinadas = expresiones.filter(e => !yaCompletados.includes(e.id));
    
    if (noAdivinadas.length === 0) {
      setCompletado(true);
      return;
    }

    const expresion = noAdivinadas[Math.floor(Math.random() * noAdivinadas.length)];
    setPreguntaActual(expresion);

    // Generar opciones falsas a partir de otras expresiones
    let otrasDescripciones = expresiones.filter(e => e.id !== expresion.id).map(e => e.significado);
    otrasDescripciones = otrasDescripciones.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    // Si no hay suficientes, añadir algunas genericas
    if (otrasDescripciones.length < 2) {
      otrasDescripciones.push('Un saludo informal para personas mayores.', 'Una bebida tradicional a base de maíz.');
    }

    const opcionesMezcladas = [
      { texto: expresion.significado, correcta: true },
      { texto: otrasDescripciones[0], correcta: false },
      { texto: otrasDescripciones[1], correcta: false }
    ].sort(() => 0.5 - Math.random());

    setOpciones(opcionesMezcladas);
  };

  const manejarRespuesta = (opcion) => {
    if (opcion.correcta) {
      reproducirSFX('/audio/efectos/victoria.mp3', 0.6);
      setFeedback({ acierto: true, mensaje: '¡Correcto! Mae, qué tuanis.' });
      onGanarItem(preguntaActual);
      
      setTimeout(() => {
        cargarSiguientePregunta();
      }, 500);
    } else {
      reproducirSFX('/audio/efectos/error.mp3', 0.5);
      setFeedback({ acierto: false, mensaje: '¡Uy no! Ese no es el significado.' });
      setTimeout(() => {
        setFeedback(null);
      }, 500);
    }
  };

  return (
    <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #27ae60, #145a32)', zIndex: 1000, overflowY: 'auto', padding: '80px 2rem 2rem' }}>
      <button 
        onClick={onVolver} 
        style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 20, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
      >
        ⬅ Volver al Pueblo
      </button>

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>🌳 Parque Central</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Responde las preguntas de los turistas sobre nuestras expresiones.</p>

        {completado ? (
          <div className="anim-zoom-in" style={{ background: 'rgba(255,255,255,0.1)', padding: '3rem', borderRadius: 20, border: '2px solid white' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎓</div>
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>¡Conoces todas las expresiones!</h2>
            <p style={{ color: 'white', marginBottom: '2rem' }}>¡Pura Vida!</p>
            <Boton variante="glass" onClick={onVolver}>Salir del Parque</Boton>
          </div>
        ) : preguntaActual ? (
          <div className="anim-slide-up">
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: 20, border: '2px solid rgba(255,255,255,0.2)', marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', fontSize: '4rem' }}>
                📸
              </div>
              <h3 style={{ color: '#f1c40f', fontSize: '1.1rem', marginTop: '1rem', textTransform: 'uppercase' }}>Turista pregunta:</h3>
              <p style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, margin: '1rem 0' }}>
                "Disculpe, ¿qué significa <span style={{ color: '#2ecc71', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 8 }}>{preguntaActual.expresion}</span>?"
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {opciones.map((opcion, i) => (
                <button
                  key={i}
                  onClick={() => manejarRespuesta(opcion)}
                  disabled={feedback !== null}
                  style={{
                    background: feedback ? (opcion.correcta ? 'rgba(46, 204, 113, 0.8)' : 'rgba(231, 76, 60, 0.8)') : 'rgba(255,255,255,0.1)',
                    border: feedback && opcion.correcta ? '2px solid white' : '2px solid rgba(255,255,255,0.2)',
                    borderRadius: 12,
                    padding: '1.2rem',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: feedback ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(5px)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => { if (!feedback) e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                  onMouseLeave={e => { if (!feedback) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                >
                  {opcion.texto}
                </button>
              ))}
            </div>

            {feedback && (
              <div className="anim-zoom-in" style={{ marginTop: '1.5rem', background: feedback.acierto ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)', padding: '1rem', borderRadius: 12, color: 'white', fontWeight: 800 }}>
                {feedback.mensaje}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
