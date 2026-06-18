import React, { useState } from 'react';
import { useGame } from '../hooks/useGame';
import { useFetch } from '../hooks/useFetch';
import { Boton } from '../components/common/Boton';
import { BotonVolver } from '../components/common/BotonVolver';
import { Modal } from '../components/common/Modal';
import { AudioPlayer } from '../components/media/AudioPlayer';

/**
 * Galería de coleccionables desbloqueados y aún por descubrir.
 */
export const Coleccionables = () => {
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

  const todos = [...faunaItems, ...culturaItems];
  const filtrados = filtro === 'todos' ? todos : todos.filter(i => i.tipo === filtro);

  const FILTROS = ['todos', 'fauna', 'cultura'];

  return (
    <div className="anim-fade-in" style={{ minHeight: '100vh', background: 'linear-gradient(160deg, var(--negro-suave), #0d1f1a)', paddingTop: '80px', padding: '80px 2rem 2rem', position: 'relative' }}>
      <BotonVolver destino="inicio" />
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '0.5rem' }}>
          <span className="text-gradient-verde">Tu Colección</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>
          {estado.coleccionables.length} / {todos.length} objetos desbloqueados
        </p>

        {/* Barra de progreso de colección */}
        <div style={{ maxWidth: 400, margin: '0 auto 2rem', background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 20, height: 10, overflow: 'hidden' }}>
            <div style={{ width: `${todos.length > 0 ? (estado.coleccionables.length / todos.length) * 100 : 0}%`, height: '100%', background: 'linear-gradient(90deg, var(--verde-hoja), var(--verde-claro))', borderRadius: 20, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {FILTROS.map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              aria-pressed={filtro === f}
              style={{ background: filtro === f ? 'var(--verde-bosque)' : 'rgba(255,255,255,0.06)', border: `1px solid ${filtro === f ? 'var(--verde-hoja)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: '8px 20px', color: 'white', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s ease' }}>
              {{ todos: '🌍 Todos', fauna: '🦜 Fauna', cultura: '🎭 Cultura' }[f]}
            </button>
          ))}
        </div>

        {/* Grid de coleccionables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
          {filtrados.map(item => {
            const desbloqueado = estado.coleccionables.includes(item.id);
            return (
              <button key={item.id}
                onClick={() => desbloqueado && setItemActivo(item)}
                aria-label={desbloqueado ? `Ver ${item.nombre}` : 'Objeto bloqueado'}
                style={{
                  all: 'unset', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  background: desbloqueado ? 'rgba(64,145,108,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${desbloqueado ? 'rgba(64,145,108,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 16, padding: '1.25rem 0.75rem', cursor: desbloqueado ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  filter: desbloqueado ? 'none' : 'grayscale(1)',
                  opacity: desbloqueado ? 1 : 0.35,
                  gap: '0.5rem',
                }}
                onMouseEnter={e => { if (desbloqueado) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(64,145,108,0.3)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {item.imagen ? (
                  <img 
                    src={item.imagen} 
                    alt="" 
                    style={{ 
                      width: 64, height: 64, objectFit: 'cover', borderRadius: 12, 
                      marginBottom: '0.5rem',
                      border: `2px solid ${desbloqueado ? 'rgba(64,145,108,0.5)' : 'rgba(255,255,255,0.1)'}` 
                    }} 
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                  />
                ) : null}
                <span style={{ fontSize: '2.5rem', display: item.imagen ? 'none' : 'block' }} aria-hidden="true">{item.emoji}</span>
                <span style={{ fontSize: '0.72rem', textAlign: 'center', color: desbloqueado ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: 600, lineHeight: 1.3 }}>
                  {desbloqueado ? item.nombre : '???'}
                </span>
                {!desbloqueado && <span style={{ fontSize: '0.9rem' }} aria-label="Bloqueado">🔒</span>}
              </button>
            );
          })}
        </div>

        {/* Botón volver */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Boton variante="glass" onClick={() => navegarA('inicio')} icono="🏠">Menú Principal</Boton>
        </div>
      </div>

      {/* Modal de detalle del coleccionable */}
      <Modal isOpen={!!itemActivo} onClose={() => setItemActivo(null)} titulo={itemActivo?.nombre} sinBotones>
        {itemActivo && (
          <div style={{ textAlign: 'center' }}>
            {itemActivo.imagen ? (
              <img 
                src={itemActivo.imagen} 
                alt={itemActivo.nombre} 
                style={{ 
                  width: '100%', maxWidth: 320, height: 220, objectFit: 'cover', 
                  borderRadius: 16, marginBottom: '1.25rem', boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  border: '2px solid rgba(64,145,108,0.4)'
                }} 
              />
            ) : (
              <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>{itemActivo.emoji}</div>
            )}
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              {itemActivo.descripcion}
            </p>
            {itemActivo.audio && (
              <AudioPlayer src={itemActivo.audio} titulo={`Sonido: ${itemActivo.nombre}`} compacto />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
