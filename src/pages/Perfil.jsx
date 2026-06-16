import React from 'react';
import { useGame } from '../hooks/useGame';
import { BarraVida } from '../components/common/BarraVida';
import '../styles/game.css';
import '../styles/effects.css';

/**
 * Pantalla de perfil del jugador con stats, nivel y mundos completados.
 * Rediseñado estilo Stitch ("Perfil del Guardián")
 */
export const Perfil = () => {
  const { estado, nivelActual, progresoNivel, nivelSiguiente, navegarA } = useGame();

  const mundos = [
    { id: 'biodiversidad', nombre: 'El Bosque Vivo', emoji: '🌿' },
    { id: 'geografia',     nombre: 'Provincias del Paraíso', emoji: '🗺️' },
    { id: 'cultura',       nombre: 'El Pueblo Tico', emoji: '🎭' },
    { id: 'ingles',        nombre: 'Práctica de Inglés', emoji: '🌎' },
  ];

  const progresoGlobal = Math.round((Object.keys(estado.mundosCompletados).length / mundos.length) * 100) || 0;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, #111a26 0%, #06090d 100%)', 
      position: 'relative', 
      overflow: 'hidden', 
      paddingBottom: '100px',
      fontFamily: 'var(--font-ui), sans-serif'
    }}>

      <div style={{ padding: '0 20px', maxWidth: '800px', margin: '40px auto 0' }}>
        
        {/* Títulos Centrales */}
        <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'slideUp 0.6s ease' }}>
          <h1 style={{ color: '#eaf2eb', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px', lineHeight: 1.1 }}>
            Perfil del<br />Guardián
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            E S T A D Í S T I C A S
          </p>
        </div>

        {/* Tarjeta 1: Información del Jugador */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '40px 30px', 
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.1s both',
          textAlign: 'center'
        }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #74c69d, #2d6a4f)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', boxShadow: '0 10px 20px rgba(45,106,79,0.3)', border: '4px solid #b7e4c7' }}>
            <span style={{ filter: 'grayscale(1) brightness(0.2)' }}>🌿</span>
          </div>
          
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#eaf2eb', marginBottom: '4px' }}>{estado.nombre}</h2>
          <p style={{ color: '#74c69d', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '30px' }}>
            {nivelActual.titulo} • NV. {nivelActual.nivel}
          </p>

          {/* Barra de Progreso XP */}
          <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>PROGRESS TO NEXT LEVEL</span>
              <span style={{ color: '#e9c46a', fontSize: '0.75rem', fontWeight: 800 }}>{estado.xpTotal} / {nivelSiguiente.xpNecesaria > 0 ? nivelSiguiente.xpNecesaria : '∞'} XP</span>
            </div>
            <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(progresoNivel, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #40916c, #74c69d)', borderRadius: '50px', transition: 'width 1s ease-out' }} />
            </div>
          </div>
        </div>

        {/* Tarjeta 2: Estadísticas Rápidas */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.2s both'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'TOTAL XP', val: estado.xpTotal.toLocaleString('en-US'), icon: '🪙', color: '#e9c46a' },
              { label: 'COLLECTIONS', val: estado.coleccionables.length, icon: '🎒', color: '#457b9d' },
              { label: 'BADGES', val: estado.insignias.length, icon: '🏅', color: '#e76f51' },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '20px 10px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '1.5rem', color: item.color, fontWeight: 900, marginBottom: '4px' }}>{item.val}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta 3: Mundos Completados */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '30px 20px', 
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.3s both'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 10px' }}>
            <h3 style={{ color: '#457b9d', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em' }}>WORLD EXPLORATION</h3>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>{progresoGlobal}%</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {mundos.map(m => {
              const progreso = estado.mundosCompletados[m.id];
              const completado = progreso?.completado;
              const estrellas = progreso?.estrellas || 0;
              
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: completado ? 'rgba(69, 123, 157, 0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '20px', border: completado ? '1px solid rgba(69, 123, 157, 0.3)' : '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '2rem', filter: completado ? 'none' : 'grayscale(1) opacity(0.5)' }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: completado ? '#eaf2eb' : 'rgba(255,255,255,0.6)', fontSize: '1.05rem', marginBottom: '2px' }}>{m.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: completado ? '#457b9d' : 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                      {completado ? `COMPLETED • +${progreso.xpGanada || 0} XP` : 'LOCKED'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[...Array(3)].map((_, i) => (
                      <span key={i} style={{ fontSize: '1rem', color: i < estrellas ? '#e9c46a' : 'rgba(255,255,255,0.1)' }}>★</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Floating Bottom Navigation Bar global del juego */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(20, 15, 12, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: '50px',
        padding: '8px 16px',
        display: 'flex',
        gap: '8px',
        zIndex: 100,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        {[
          { id: 'inicio', label: 'HOME', icon: '🏠', active: false },
          { id: 'mapa', label: 'MAP', icon: '🗺️', active: false },
          { id: 'coleccionables', label: 'JOURNAL', icon: '📔', active: false },
          { id: 'perfil', label: 'PROFILE', icon: '👤', active: true }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => navegarA(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              width: item.active ? '70px' : '60px',
              height: '60px',
              borderRadius: '30px',
              border: 'none',
              background: item.active ? '#f9c74f' : 'transparent',
              color: item.active ? '#120f0d' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-ui), sans-serif'
            }}
          >
            <span style={{ fontSize: '1.2rem', filter: item.active ? 'none' : 'grayscale(1)' }}>{item.icon}</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
