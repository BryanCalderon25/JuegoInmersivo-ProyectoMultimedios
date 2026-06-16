import React, { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { useFetch } from '../hooks/useFetch';
import { HUD } from '../components/hud/HUD';
import { Modal } from '../components/common/Modal';
import { AudioPlayer } from '../components/media/AudioPlayer';
import { Particulas } from '../components/effects/Particulas';

/**
 * Galería de coleccionables (Journal) — Rediseñado estilo Stitch
 */
export const Coleccionables = ({ onSalir }) => {
  const { estado, navegarA } = useGame();
  const { data: fauna } = useFetch('/json/fauna.json');
  const { data: cultura } = useFetch('/json/cultura.json');
  const [itemActivo, setItemActivo] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const faunaItems = (fauna || []).map(a => ({
    id: a.id, nombre: a.nombre, emoji: a.emoji, descripcion: a.descripcion,
    audio: a.sonido, tipo: 'fauna', imagen: a.imagen
  }));

  const culturaItems = [
    ...((cultura?.simbolos || []).map(s => ({ id: s.id, nombre: s.nombre, emoji: s.emoji, descripcion: s.descripcion, audio: s.audio, tipo: 'cultura', imagen: s.imagen }))),
    ...((cultura?.comidas || []).map(c => ({ id: c.id, nombre: c.nombre, emoji: c.emoji, descripcion: c.descripcion, tipo: 'cultura', imagen: c.imagen }))),
  ];

  // Agregamos también los coleccionables por completar provincias u otras metas si están en el estado
  // Para simplificar y evitar items sin data, usaremos los extraídos de estado.coleccionablesData si existen (no guardados en este mockup)
  // Pero aquí procesaremos fauna y cultura
  const todos = [...faunaItems, ...culturaItems];
  const filtrados = filtro === 'todos' ? todos : todos.filter(i => i.tipo === filtro);

  const FILTROS = ['todos', 'fauna', 'cultura'];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top, #1a1512 0%, #0d0a08 100%)', 
      position: 'relative', 
      overflow: 'hidden', 
      paddingBottom: '100px',
      fontFamily: 'var(--font-ui), sans-serif'
    }}>
      <HUD enMundo onSalir={() => navegarA('inicio')} />
      <Particulas cantidad={10} tipo="luces" />

      <div style={{ padding: '0 20px', maxWidth: '900px', margin: '40px auto 0' }}>
        
        {/* Títulos Centrales */}
        <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'slideUp 0.6s ease' }}>
          <h1 style={{ color: '#f5e4c3', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '16px', lineHeight: 1.1 }}>
            Diario del<br />Explorador
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.5 }}>
            Registra tus descubrimientos de fauna, cultura y lugares emblemáticos de Costa Rica.
          </p>
        </div>

        {/* Tarjeta Superior: Progreso y Filtros */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '30px', 
          padding: '30px 20px', 
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.8s ease 0.1s both'
        }}>
          {/* Barra de progreso de colección */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 10px' }}>
             <p style={{ fontSize: '0.8rem', color: '#c9a765', fontWeight: 600, letterSpacing: '0.05em' }}>PROGRESO DEL DIARIO</p>
             <p style={{ fontSize: '0.8rem', color: '#eaf2eb', fontWeight: 800 }}>{estado.coleccionables.length} / {todos.length}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', height: '12px', overflow: 'hidden', marginBottom: '30px' }}>
            <div style={{ 
              width: `${todos.length > 0 ? (estado.coleccionables.length / todos.length) * 100 : 0}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #c9a765, #f9c74f)', 
              borderRadius: '20px', 
              transition: 'width 0.5s ease' 
            }} />
          </div>

          {/* Filtros tipo Stitch */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {FILTROS.map(f => {
              const active = filtro === f;
              return (
                <button 
                  key={f} 
                  onClick={() => setFiltro(f)}
                  style={{ 
                    background: active ? '#3d2b1f' : 'rgba(255,255,255,0.05)', 
                    border: active ? '1px solid #c9a765' : '1px solid transparent', 
                    borderRadius: '20px', 
                    padding: '8px 16px', 
                    color: active ? '#eaf2eb' : 'rgba(255,255,255,0.7)', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    fontFamily: 'var(--font-ui), sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {{ todos: 'TODOS', fauna: 'FAUNA', cultura: 'CULTURA' }[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de coleccionables - Estilo Tarjetas de Cristal */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '16px',
          animation: 'slideUp 0.8s ease 0.2s both'
        }}>
          {filtrados.map(item => {
            const desbloqueado = estado.coleccionables.includes(item.id);
            return (
              <button 
                key={item.id}
                onClick={() => desbloqueado && setItemActivo(item)}
                style={{
                  all: 'unset', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  background: desbloqueado ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${desbloqueado ? 'rgba(201, 167, 101, 0.4)' : 'rgba(255,255,255,0.05)'}`,
                  borderRadius: '24px', 
                  padding: '24px 16px', 
                  cursor: desbloqueado ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  filter: desbloqueado ? 'none' : 'grayscale(1) brightness(0.5)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  gap: '12px',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={e => { 
                  if (desbloqueado) { 
                    e.currentTarget.style.transform = 'translateY(-5px)'; 
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  } 
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.transform = 'translateY(0)'; 
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                  e.currentTarget.style.background = desbloqueado ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.01)';
                }}
              >
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  background: desbloqueado ? '#2a1f1a' : 'transparent',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {item.emoji}
                </div>
                <span style={{ fontSize: '0.75rem', textAlign: 'center', color: desbloqueado ? '#eaf2eb' : 'rgba(255,255,255,0.3)', fontWeight: 700, lineHeight: 1.3 }}>
                  {desbloqueado ? item.nombre : 'Desconocido'}
                </span>
                {!desbloqueado && <span style={{ fontSize: '0.8rem', color: '#c9a765' }}>🔒</span>}
              </button>
            );
          })}
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
          { id: 'coleccionables', label: 'JOURNAL', icon: '📔', active: true },
          { id: 'perfil', label: 'PROFILE', icon: '👤', active: false }
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

      {/* Modal de detalle del coleccionable */}
      {itemActivo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#1a1512',
            border: '1px solid #c9a765',
            borderRadius: '30px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            animation: 'slideUp 0.3s ease'
          }}>
            <button 
              onClick={() => setItemActivo(null)}
              style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', color: '#c9a765', fontSize: '1.5rem', cursor: 'pointer' }}
            >
              ×
            </button>
            <div style={{ fontSize: '5rem', marginBottom: '10px', filter: 'drop-shadow(0 0 20px rgba(249, 199, 79, 0.4))' }}>
              {itemActivo.emoji}
            </div>
            <h2 style={{ color: '#eaf2eb', fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
              {itemActivo.nombre}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {itemActivo.descripcion}
            </p>
            {itemActivo.audio && (
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px' }}>
                <p style={{ color: '#c9a765', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>AUDIO DISPONIBLE</p>
                <AudioPlayer src={itemActivo.audio} compacto />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

