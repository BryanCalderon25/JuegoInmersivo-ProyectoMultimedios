import React, { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { BarraVida } from '../common/BarraVida';
import '../../styles/hud.css';

/**
 * HUD principal del juego: XP, nivel, mundo actual, botones de inventario y configuración.
 */
export const HUD = ({ enMundo = false, onToggleInventario, onSalir }) => {
  const { estado, nivelActual, progresoNivel, nivelSiguiente, mundoActual } = useGame();

  return (
    <div className="hud-container">
      <div className="hud-panel">
        {/* Sección izquierda: Avatar y nivel */}
        <div className="hud-jugador">
          <div className="hud-avatar" aria-hidden="true">🌿</div>
          <div>
            <div className="hud-nombre">{estado.nombre}</div>
            <div className="hud-nivel">{nivelActual.titulo}</div>
          </div>
        </div>

        {/* Centro: XP y mundo */}
        <div className="hud-centro">
          <BarraVida
            valor={progresoNivel}
            color="var(--verde-hoja)"
            colorSecundario="var(--verde-claro)"
            etiqueta={`Nv. ${nivelActual.nivel}`}
            etiquetaDerecha={`${estado.xpTotal} XP`}
            altura={6}
          />
          {mundoActual && (
            <div className="hud-mundo-actual" aria-live="polite">
              📍 {mundoActual}
            </div>
          )}
        </div>

        {/* Derecha: Stats rápidos */}
        <div className="hud-stats">
          <div className="hud-stat-item" aria-label={`Coleccionables: ${estado.coleccionables.length}`}>
            <span className="hud-stat-icon">🎒</span>
            <span className="hud-stat-valor">{estado.coleccionables.length}</span>
          </div>
          <div className="hud-stat-item" aria-label={`Insignias: ${estado.insignias.length}`}>
            <span className="hud-stat-icon">🏅</span>
            <span className="hud-stat-valor">{estado.insignias.length}</span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="hud-botones">
          {onToggleInventario && (
            <button className="hud-btn" onClick={onToggleInventario} aria-label="Abrir inventario" title="Inventario">
              🎒
            </button>
          )}
          {enMundo && onSalir && (
            <button className="hud-btn" onClick={onSalir} aria-label="Salir al mapa" title="Salir al mapa" style={{ color: 'var(--rojo-lapa)' }}>
              🗺️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
