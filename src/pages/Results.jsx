import React, { useEffect } from 'react';
import { Puntaje } from '../components/game/Puntaje';
import { Boton } from '../components/common/Boton';
import { useGame } from '../hooks/useGame';

export const Results = ({ score, total, onRestart, onHome }) => {
  const { addXp, addStars } = useGame();
  
  // Calcular XP basada en aciertos (ej. 10 XP por acierto)
  const xpGanada = score * 10;
  
  // Calcular estrellas
  const percentage = (score / total) * 100;
  const estrellasGanadas = percentage === 100 ? 3 : percentage >= 70 ? 2 : percentage >= 40 ? 1 : 0;

  useEffect(() => {
    // Al montar la pantalla de resultados, sumar XP y estrellas
    addXp(xpGanada);
    addStars(estrellasGanadas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="results-page-container">
      <Puntaje score={score} total={total} xpGanada={xpGanada} />
      
      <div className="action-buttons mt-4 flex-row-center">
        <Boton variant="primary" onClick={onRestart}>
          Jugar de Nuevo 🔄
        </Boton>
        <Boton variant="secondary" onClick={onHome}>
          Volver al Menú 🏠
        </Boton>
      </div>
    </div>
  );
};
