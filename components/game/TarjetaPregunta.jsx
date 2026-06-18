import React from 'react';

export const TarjetaPregunta = ({ preguntaData, onRespuesta, disabled }) => {
  if (!preguntaData) return <p>Cargando pregunta...</p>;

  return (
    <div className="tarjeta-pregunta glass-panel animate-slide-up">
      <h3 className="pregunta-texto">{preguntaData.pregunta}</h3>
      
      {preguntaData.imagen && (
        <div className="pregunta-imagen-container">
          <img 
            src={preguntaData.imagen} 
            alt="Ilustración de la pregunta" 
            className="pregunta-imagen"
          />
        </div>
      )}

      <div className="opciones-grid">
        {preguntaData.opciones.map((opcion, index) => (
          <button
            key={index}
            className="btn-opcion"
            onClick={() => onRespuesta(index)}
            disabled={disabled}
            aria-label={`Opción ${index + 1}: ${opcion}`}
          >
            {opcion}
          </button>
        ))}
      </div>
    </div>
  );
};
