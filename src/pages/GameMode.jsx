import React, { useState, useEffect } from 'react';
import { TarjetaPregunta } from '../components/game/TarjetaPregunta';
import { Temporizador } from '../components/common/Temporizador';
import { BarraProgreso } from '../components/common/BarraProgreso';
import { AudioPlayer } from '../components/media/AudioPlayer';
import { useGame } from '../hooks/useGame';

export const GameMode = ({ category, onFinish }) => {
  const [preguntas, setPreguntas] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Cargar JSON de la categoría
    fetch(`/json/${category}.json`)
      .then(res => res.json())
      .then(data => {
        // Barajar aleatoriamente
        const shuffled = data.sort(() => 0.5 - Math.random());
        setPreguntas(shuffled.slice(0, 5)); // Tomar 5 preguntas por ronda
        setLoading(false);
      })
      .catch(err => console.error("Error al cargar JSON", err));
  }, [category]);

  const handleRespuesta = (opcionIndex) => {
    const correcta = preguntas[currentIndex].respuestaCorrecta;
    const esCorrecta = opcionIndex === correcta;

    if (esCorrecta) {
      setScore(prev => prev + 1);
    }

    setFeedback({
      esCorrecta,
      explicacion: preguntas[currentIndex].explicacion
    });
  };

  const handleSiguiente = () => {
    setFeedback(null);
    if (currentIndex + 1 < preguntas.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish(score, preguntas.length);
    }
  };

  const handleTimeUp = () => {
    if (!feedback) {
      setFeedback({
        esCorrecta: false,
        explicacion: `Se acabó el tiempo. ${preguntas[currentIndex].explicacion}`
      });
    }
  };

  if (loading) return <div className="loading-spinner">Cargando desafío...</div>;
  if (preguntas.length === 0) return <div>No hay preguntas disponibles.</div>;

  const preguntaActual = preguntas[currentIndex];

  return (
    <div className="game-mode-container animate-fade-in">
      <div className="game-header">
        <BarraProgreso current={currentIndex + 1} total={preguntas.length} />
        <Temporizador 
          key={currentIndex} 
          initialSeconds={20} 
          onTimeUp={handleTimeUp} 
          isRunning={!feedback} 
        />
      </div>

      {preguntaActual.audio && (
        <div className="pregunta-audio mb-4">
          <AudioPlayer src={preguntaActual.audio} title="Escucha con atención" autoPlay />
        </div>
      )}

      <TarjetaPregunta 
        preguntaData={preguntaActual} 
        onRespuesta={handleRespuesta} 
        disabled={feedback !== null}
      />

      {feedback && (
        <div className={`feedback-panel animate-slide-up ${feedback.esCorrecta ? 'correcto' : 'incorrecto'}`}>
          <h3>{feedback.esCorrecta ? '¡Correcto! 🎉' : 'Incorrecto 😅'}</h3>
          <p>{feedback.explicacion}</p>
          <button className="btn btn-primary mt-3" onClick={handleSiguiente}>
            {currentIndex + 1 < preguntas.length ? 'Siguiente Pregunta' : 'Ver Resultados'}
          </button>
        </div>
      )}
    </div>
  );
};
