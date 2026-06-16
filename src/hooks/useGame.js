import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

/**
 * Hook para acceder al contexto global del juego.
 * Debe usarse dentro de <GameProvider>.
 */
export const useGame = () => {
  const contexto = useContext(GameContext);
  if (!contexto) {
    throw new Error('useGame debe usarse dentro de un GameProvider');
  }
  return contexto;
};
