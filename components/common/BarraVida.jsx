import React from 'react';

/**
 * Barra de progreso animada reutilizable.
 * Props: valor (0-100), color, etiqueta, altura, mostrarPorcentaje
 */
export const BarraVida = ({
  valor = 0,
  color = 'var(--verde-hoja)',
  colorSecundario = null,
  etiqueta = '',
  etiquetaDerecha = '',
  altura = 8,
  mostrarPorcentaje = false,
  estiloExtra = {},
}) => {
  const porcentaje = Math.min(100, Math.max(0, valor));
  const esUrgente = porcentaje < 25;

  return (
    <div className="barra-vida-container" style={estiloExtra}>
      {(etiqueta || etiquetaDerecha || mostrarPorcentaje) && (
        <div className="barra-vida-label">
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 600 }}>
            {etiqueta}
          </span>
          <span style={{ color: esUrgente ? 'var(--color-vida)' : 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
            {etiquetaDerecha || (mostrarPorcentaje ? `${Math.round(porcentaje)}%` : '')}
          </span>
        </div>
      )}
      <div
        className="barra-base"
        role="progressbar"
        aria-valuenow={Math.round(porcentaje)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={etiqueta}
        style={{ height: `${altura}px` }}
      >
        <div
          className={`barra-fill ${esUrgente ? 'urgente' : ''}`}
          style={{
            width: `${porcentaje}%`,
            background: colorSecundario
              ? `linear-gradient(90deg, ${color}, ${colorSecundario})`
              : color,
          }}
        />
      </div>
    </div>
  );
};
