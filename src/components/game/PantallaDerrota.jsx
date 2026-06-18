import React from 'react';
import { Boton } from '../common/Boton';
import '../../styles/effects.css';

export const PantallaDerrota = ({ xpPerdida, onReintentar, onSalir }) => {
  return (
    <div className="anim-fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 9999, 
      background: 'rgba(20, 5, 5, 0.95)', 
      backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center'
    }}>
      <div className="anim-slide-up" style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(249,65,68,0.5)',
        borderRadius: 24, padding: '3rem', maxWidth: 500,
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(249,65,68,0.2)'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>💔</div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--rojo)', marginBottom: '1rem' }}>
          ¡Misión Fallida!
        </h2>
        
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Has cometido demasiados errores o te quedaste sin tiempo. 
        </p>

        <div style={{ 
          background: 'rgba(249,65,68,0.1)', border: '1px solid var(--rojo)', borderRadius: 12, 
          padding: '1rem', marginBottom: '2.5rem', display: 'inline-block' 
        }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>Penalización: </span>
          <span style={{ color: 'var(--rojo)', fontWeight: 900, fontSize: '1.5rem' }}>-{xpPerdida} XP</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Boton variante="dorado" onClick={onReintentar} estiloExtra={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #f94144, #e5383b)' }}>
            Intentarlo de Nuevo
          </Boton>
          <Boton variante="glass" onClick={onSalir} estiloExtra={{ width: '100%', justifyContent: 'center' }}>
            Volver al Mapa
          </Boton>
        </div>
      </div>
    </div>
  );
};
