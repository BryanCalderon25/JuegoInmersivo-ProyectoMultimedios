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
        {/* Sección izquierda: Botón Volver (si aplica) y Avatar */}
        <div className="hud-jugador" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {enMundo && onSalir && (
            <button 
              onClick={onSalir} 
              aria-label="Volver a la pantalla anterior" 
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '6px 12px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>⬅</span> Volver
            </button>
          )}
          <div className="hud-avatar" aria-hidden="true" style={{ overflow: 'hidden', padding: 0 }}>
            <img src={`${import.meta.env.BASE_URL}images/avatar_guardian.png`} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='inline' }} />
            <span style={{ fontSize: '2rem', display: 'none' }}>🌿</span>
          </div>
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
        </div>
      </div>
    </div>
  );
};
