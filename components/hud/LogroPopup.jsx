import React, { useEffect, useState } from 'react';
import '../../styles/hud.css';

/**
 * Popup animado que aparece cuando se desbloquea un logro o coleccionable.
 * Props: logro { icono, nombre, descripcion } | null
 */
export const LogroPopup = ({ logro }) => {
  const [saliendo, setSaliendo] = useState(false);

  useEffect(() => {
    if (!logro) return;
    setSaliendo(false);
    const timer = setTimeout(() => setSaliendo(true), 3500);
    return () => clearTimeout(timer);
  }, [logro]);

  if (!logro) return null;

  return (
    <div
      className={`logro-popup ${saliendo ? 'saliendo' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="logro-icono">{logro.icono || '🏅'}</div>
      <div className="logro-info">
        <div className="logro-etiqueta">¡Desbloqueado!</div>
        <div className="logro-nombre">{logro.nombre}</div>
        {logro.descripcion && (
          <div className="logro-descripcion">{logro.descripcion}</div>
        )}
      </div>
    </div>
  );
};
