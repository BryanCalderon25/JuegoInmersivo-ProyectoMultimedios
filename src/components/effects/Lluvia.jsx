import React, { useMemo } from 'react';
import '../../styles/effects.css';

/**
 * Efecto de lluvia tropical con gotas CSS animadas.
 * Props: intensidad (1-3), activa
 */
export const Lluvia = ({ intensidad = 2, activa = true }) => {
  const cantidadGotas = intensidad * 30;

  const gotas = useMemo(() => {
    return Array.from({ length: cantidadGotas }, (_, i) => ({
      id: i,
      izquierda: Math.random() * 100,
      altura:    Math.random() * 50 + 30,
      duracion:  Math.random() * 0.5 + 0.5,
      delay:     Math.random() * -2,
      opacidad:  Math.random() * 0.4 + 0.3,
    }));
  }, [cantidadGotas]);

  if (!activa) return null;

  return (
    <div className="lluvia-container" aria-hidden="true">
      {gotas.map(g => (
        <div
          key={g.id}
          className="gota-lluvia"
          style={{
            left:              `${g.izquierda}%`,
            height:            `${g.altura}px`,
            animationDuration: `${g.duracion}s`,
            animationDelay:    `${g.delay}s`,
            opacity:           g.opacidad,
          }}
        />
      ))}
    </div>
  );
};
