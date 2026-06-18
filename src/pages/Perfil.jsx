import React from 'react';
import { useGame } from '../hooks/useGame';
import { Boton } from '../components/common/Boton';
import { BotonVolver } from '../components/common/BotonVolver';
import { BarraVida } from '../components/common/BarraVida';

/**
 * Pantalla de perfil del jugador con stats, nivel y mundos completados.
 */
export const Perfil = () => {
  const { estado, nivelActual, progresoNivel, nivelSiguiente, navegarA } = useGame();

  const mundos = [
    { id: 'biodiversidad', nombre: 'El Bosque Vivo', emoji: '🌿' },
    { id: 'geografia',     nombre: 'Provincias del Paraíso', emoji: '🗺️' },
    { id: 'cultura',       nombre: 'El Pueblo Tico', emoji: '🎭' },
    { id: 'ingles',        nombre: 'Mundo Bilingüe', emoji: '🌎' },
  ];

  return (
    <div className="anim-fade-in" style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1f0d2b, #0d0614)', paddingTop: '80px', padding: '80px 2rem 2rem', position: 'relative' }}>
      <BotonVolver destino="inicio" />
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '2rem' }}>
          <span className="text-gradient-verde">Tu Perfil</span>
        </h1>

        {/* Tarjeta principal del jugador */}
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🧑‍🌾</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{estado.nombre}</h2>
          <p style={{ color: 'var(--verde-claro)', fontWeight: 600, marginBottom: '1.5rem' }}>{nivelActual.titulo}</p>

          {/* Nivel y XP */}
          <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <BarraVida
              valor={progresoNivel}
              color="var(--verde-hoja)"
              colorSecundario="var(--verde-claro)"
              etiqueta={`Nivel ${nivelActual.nivel}`}
              etiquetaDerecha={`${estado.xpTotal} / ${nivelSiguiente.xpNecesaria > 0 ? nivelSiguiente.xpNecesaria : '∞'} XP`}
              altura={10}
            />
          </div>
        </div>

        {/* Stats rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { etiqueta: '⚡ XP Total', valor: estado.xpTotal.toLocaleString('es-CR') },
            { etiqueta: '🎒 Coleccionables', valor: estado.coleccionables.length },
            { etiqueta: '🏅 Insignias', valor: estado.insignias.length },
          ].map(s => (
            <div key={s.etiqueta} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.25rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--dorado)' }}>{s.valor}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.etiqueta}</div>
            </div>
          ))}
        </div>

        {/* Mundos completados */}
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--verde-claro)', fontWeight: 800 }}>🌍 Progreso por Mundo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mundos.map(m => {
              const progreso = estado.mundosCompletados[m.id];
              const completado = progreso?.completado;
              const estrellas = progreso?.estrellas || 0;
              return (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: completado ? 'rgba(64,145,108,0.12)' : 'rgba(255,255,255,0.03)', borderRadius: 14, border: `1px solid ${completado ? 'rgba(64,145,108,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                  <span style={{ fontSize: '1.8rem' }}>{m.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>{m.nombre}</div>
                    <div style={{ fontSize: '0.75rem', color: completado ? 'var(--verde-claro)' : 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      {completado ? `Completado · ${progreso.xpGanada || 0} XP ganada` : 'Pendiente'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }} aria-label={`${estrellas} de 3 estrellas`}>
                    {[...Array(3)].map((_, i) => (
                      <span key={i} style={{ fontSize: '1.1rem', filter: i < estrellas ? 'none' : 'grayscale(1) opacity(0.25)' }}>⭐</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Boton variante="glass" onClick={() => navegarA('inicio')} icono="🏠">Menú Principal</Boton>
        </div>
      </div>
    </div>
  );
};
