import React from 'react';

export const Puntaje = ({ score, total, xpGanada }) => {
  const percentage = (score / total) * 100;
  
  let mensaje = "¡Sigue practicando!";
  let estrellas = 0;
  
  if (percentage === 100) {
    mensaje = "¡Excelente! Eres un experto.";
    estrellas = 3;
  } else if (percentage >= 70) {
    mensaje = "¡Muy bien hecho!";
    estrellas = 2;
  } else if (percentage >= 40) {
    mensaje = "Buen intento.";
    estrellas = 1;
  }

  return (
    <div className="puntaje-container glass-panel animate-zoom-in">
      <h2>Resultados</h2>
      <div className="estrellas-container">
        {[...Array(3)].map((_, i) => (
          <span key={i} className={`estrella ${i < estrellas ? 'activa' : 'inactiva'}`}>
            ⭐
          </span>
        ))}
      </div>
      
      <p className="mensaje-resultado">{mensaje}</p>
      
      <div className="estadisticas">
        <p>Aciertos: <strong>{score} / {total}</strong></p>
        <p>Precisión: <strong>{percentage.toFixed(0)}%</strong></p>
        <p>XP Obtenida: <strong className="text-success">+{xpGanada} XP</strong></p>
      </div>
    </div>
  );
};
