import React, { useEffect, useState } from 'react';

/**
 * Temporizador de cuenta regresiva.
 * Props: segundosIniciales, enTiempoAgotado, activo, reiniciarKey
 */
export const Temporizador = ({ segundosIniciales = 30, enTiempoAgotado, activo = true }) => {
  const [segundos, setSegundos] = useState(segundosIniciales);

  // Reiniciar cuando cambian los segundos iniciales
  useEffect(() => {
    setSegundos(segundosIniciales);
  }, [segundosIniciales]);

  useEffect(() => {
    if (!activo || segundos <= 0) return;
    const intervalo = setInterval(() => {
      setSegundos(prev => {
        if (prev <= 1) {
          clearInterval(intervalo);
          if (enTiempoAgotado) enTiempoAgotado();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [activo, enTiempoAgotado, segundosIniciales]);

  const porcentaje = (segundos / segundosIniciales) * 100;
  const esUrgente = segundos <= 8;

  // Color de la barra según el tiempo restante
  const colorBarra = esUrgente ? 'var(--color-vida)' : segundos <= 15 ? 'var(--dorado)' : 'var(--verde-hoja)';

  return (
    <div className={`temporizador-hud ${esUrgente ? 'urgente' : ''}`} aria-label={`Tiempo restante: ${segundos} segundos`}>
      <div
        className="temporizador-circulo"
        style={{
          background: `conic-gradient(${colorBarra} ${porcentaje}%, rgba(255,255,255,0.1) ${porcentaje}%)`,
          transition: 'background 1s linear',
        }}
      >
        <span className="temporizador-numero" style={{ color: esUrgente ? 'var(--color-vida)' : 'white' }}>
          {segundos}
        </span>
      </div>
    </div>
  );
};
