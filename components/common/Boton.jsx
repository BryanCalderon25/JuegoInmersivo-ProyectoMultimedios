import React from 'react';

/**
 * Componente Boton reutilizable con variantes, ripple y accesibilidad.
 * Props: children, onClick, variante, tamaño, ariaLabel, disabled, icono, className
 */
export const Boton = ({
  children,
  onClick,
  variante = 'primary',
  tamaño = '',
  ariaLabel,
  disabled = false,
  icono = null,
  className = '',
}) => {
  const clases = [
    'btn',
    'btn-ripple',
    `btn-${variante}`,
    tamaño ? `btn-${tamaño}` : '',
    className,
    disabled ? 'btn-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={clases}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'botón')}
      disabled={disabled}
      type="button"
    >
      {icono && <span className="btn-icono" aria-hidden="true">{icono}</span>}
      {children}
    </button>
  );
};
