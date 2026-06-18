import React, { useEffect, useRef, useMemo } from 'react';
import '../../styles/effects.css';

/**
 * Partículas flotantes animadas. Tipo: 'hojas' | 'luces' | 'estrellas' | 'burbujas'
 * Props: cantidad, tipo, velocidad
 */
export const Particulas = ({ cantidad = 20, tipo = 'luces', velocidad = 1 }) => {
  const particulasRef = useRef([]);

  const particulas = useMemo(() => {
    return Array.from({ length: cantidad }, (_, i) => ({
      id: i,
      tamaño:    Math.random() * 6 + 3,
      izquierda: Math.random() * 100,
      duracion:  (Math.random() * 8 + 5) / velocidad,
      delay:     Math.random() * -10,
      opacity:   Math.random() * 0.5 + 0.3,
    }));
  }, [cantidad, velocidad]);

  const obtenerClase = () => {
    switch (tipo) {
      case 'hojas':    return 'particula particula-hoja';
      case 'luces':    return 'particula particula-luz';
      case 'estrellas': return 'particula particula-estrella';
      case 'burbujas': return 'particula particula-burbuja';
      default:         return 'particula particula-luz';
    }
  };

  return (
    <div className="particulas-container" aria-hidden="true">
      {particulas.map(p => (
        <div
          key={p.id}
          className={obtenerClase()}
          style={{
            left:              `${p.izquierda}%`,
            top:               tipo === 'hojas' ? '-20px' : `${Math.random() * 100}%`,
            width:             `${p.tamaño}px`,
            height:            tipo === 'hojas' ? `${p.tamaño}px` : `${p.tamaño}px`,
            animationDuration: `${p.duracion}s`,
            animationDelay:    `${p.delay}s`,
            opacity:           p.opacity,
          }}
        />
      ))}
    </div>
  );
};
