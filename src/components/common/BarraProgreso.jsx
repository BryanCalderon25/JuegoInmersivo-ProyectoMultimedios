import React from 'react';

export const BarraProgreso = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="progress-container" aria-label={`Progreso: ${current} de ${total}`}>
      <div className="progress-text">
        Pregunta {current} de {total}
      </div>
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
