import React from 'react';
import { useGame } from '../../hooks/useGame';

export const BotonVolver = ({ destino = 'inicio', texto = 'Volver' }) => {
  const { navegarA } = useGame();

  return (
    <button 
      onClick={() => navegarA(destino)} 
      aria-label={`Volver a ${destino}`}
      style={{ 
        position: 'fixed', 
        top: '2rem', 
        left: '2rem', 
        zIndex: 100,
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid rgba(255,255,255,0.15)', 
        borderRadius: 20, 
        padding: '8px 16px', 
        color: 'white', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        fontWeight: 600, 
        fontSize: '0.9rem', 
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
        e.currentTarget.style.transform = 'translateX(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '1.2rem' }}>⬅</span> {texto}
    </button>
  );
};
