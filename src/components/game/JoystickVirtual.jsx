import React, { useState, useRef } from 'react';

/**
 * Joystick virtual para dispositivos móviles.
 * Captura eventos táctiles y calcula la dirección del movimiento,
 * enviando el resultado a través de la prop `onMove`.
 */
export const JoystickVirtual = ({ onMove }) => {
  const baseRef = useRef(null);
  const [thumbPos, setThumbPos] = useState({ x: 0, y: 0 });

  const handleTouch = (e) => {
    if (!baseRef.current) return;
    // Evita el comportamiento por defecto (scroll) al usar el joystick
    e.preventDefault();
    
    const touch = e.touches[0];
    if (!touch) {
      handleEnd();
      return;
    }

    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    
    const maxDist = rect.width / 2 - 25; // 25 es el radio del thumb
    const dist = Math.sqrt(dx*dx + dy*dy);
    
    // Limitar el thumb dentro del círculo
    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
    }
    
    setThumbPos({ x: dx, y: dy });
    
    // Determinar direcciones (umbral para evitar movimientos accidentales pequeños)
    const umbral = 10;
    onMove({
      arriba: dy < -umbral,
      abajo: dy > umbral,
      izquierda: dx < -umbral,
      derecha: dx > umbral
    });
  };

  const handleEnd = () => {
    setThumbPos({ x: 0, y: 0 });
    onMove({ arriba: false, abajo: false, izquierda: false, derecha: false });
  };

  return (
    <div 
      ref={baseRef}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      style={{
        width: 140, 
        height: 140, 
        borderRadius: '50%', 
        background: 'rgba(255,255,255,0.1)',
        border: '2px solid rgba(255,255,255,0.3)', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.1)',
        backdropFilter: 'blur(4px)',
        touchAction: 'none' // Evita zoom o scroll nativo
      }}
    >
      <div style={{
        width: 60, 
        height: 60, 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(200,200,200,0.6))',
        boxShadow: '0 2px 5px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.8)',
        transform: `translate(${thumbPos.x}px, ${thumbPos.y}px)`, 
        transition: thumbPos.x === 0 && thumbPos.y === 0 ? 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
        pointerEvents: 'none'
      }} />
    </div>
  );
};
