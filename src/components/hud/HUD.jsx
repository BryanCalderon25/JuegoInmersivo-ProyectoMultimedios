import React from 'react';
import { useGame } from '../../hooks/useGame';
import '../../styles/hud.css';

/**
 * HUD principal del juego: Cabecera estilo Stitch (Google).
 */
export const HUD = ({ enMundo = false, onToggleInventario, onSalir }) => {
  const { estado, nivelActual, navegarA } = useGame();

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0,
      padding: '20px 30px',
      zIndex: 100
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(20, 25, 22, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '12px 24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        {/* Izquierda: Avatar y Rango */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#b7e4c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '2px solid #74c69d' }}>
            <span style={{ filter: 'grayscale(1) brightness(0.2)' }}>🌿</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#eaf2eb', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.02em', lineHeight: 1 }}>
              {estado.nombre}
            </span>
            <span style={{ color: '#74c69d', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.1em', marginTop: '4px' }}>
              {nivelActual.titulo.toUpperCase()} • NV. {nivelActual.nivel}
            </span>
          </div>
        </div>
        
        {/* Derecha: XP y Ajustes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '6px 16px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ color: '#e9c46a', fontWeight: 700 }}>{estado.xpTotal.toLocaleString('en-US')}</span>
            <span style={{ fontSize: '1.1rem' }}>🪙</span>
          </div>

          <button 
            onClick={() => navegarA('creditos')} 
            style={{ background: 'transparent', border: 'none', color: '#74c69d', fontSize: '1.2rem', cursor: 'pointer', padding: 0 }}
            aria-label="Ajustes"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
};
