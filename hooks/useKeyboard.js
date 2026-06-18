import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para capturar el teclado (WASD + flechas).
 * Retorna la dirección actual del movimiento.
 */
export const useKeyboard = () => {
  const [teclasPulsadas, setTeclasPulsadas] = useState(new Set());

  const handleKeyDown = useCallback((e) => {
    // Prevenir scroll de página con flechas
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    setTeclasPulsadas(prev => new Set([...prev, e.key]));
  }, []);

  const handleKeyUp = useCallback((e) => {
    setTeclasPulsadas(prev => {
      const nuevo = new Set(prev);
      nuevo.delete(e.key);
      return nuevo;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Derivar dirección desde las teclas pulsadas
  const arriba    = teclasPulsadas.has('ArrowUp')    || teclasPulsadas.has('w') || teclasPulsadas.has('W');
  const abajo     = teclasPulsadas.has('ArrowDown')  || teclasPulsadas.has('s') || teclasPulsadas.has('S');
  const izquierda = teclasPulsadas.has('ArrowLeft')  || teclasPulsadas.has('a') || teclasPulsadas.has('A');
  const derecha   = teclasPulsadas.has('ArrowRight') || teclasPulsadas.has('d') || teclasPulsadas.has('D');
  const interactuar = teclasPulsadas.has('Enter') || teclasPulsadas.has(' ') || teclasPulsadas.has('e') || teclasPulsadas.has('E');

  const seEstaMoviendo = arriba || abajo || izquierda || derecha;

  let direccion = 'abajo'; // dirección por defecto
  if (arriba)    direccion = 'arriba';
  if (abajo)     direccion = 'abajo';
  if (izquierda) direccion = 'izquierda';
  if (derecha)   direccion = 'derecha';

  return { arriba, abajo, izquierda, derecha, interactuar, seEstaMoviendo, direccion };
};
