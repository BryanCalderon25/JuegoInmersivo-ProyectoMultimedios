import React from 'react';
import { useGame } from '../hooks/useGame';
import { Boton } from '../components/common/Boton';

/**
 * Pantalla de créditos con scroll animado estilo cine.
 */
export const Creditos = () => {
  const { navegarA } = useGame();

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #000, var(--verde-selva) 80%, #000)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 2rem 2rem' }}>
      <div style={{ maxWidth: 700, width: '100%', textAlign: 'center' }}>
        <div style={{ animation: 'scroll-creditos 25s linear forwards', padding: '2rem' }}>
          <style>{`@keyframes scroll-creditos { from { transform: translateY(60vh); } to { transform: translateY(-200%); } }`}</style>

          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🇨🇷</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--dorado)', marginBottom: '2rem' }}>
            Guardianes de Costa Rica
          </h1>

          {[
            { rol: 'Desarrollador', nombre: 'Bryan Calderón — IF7102 UCR' },
            { rol: 'Curso', nombre: 'Multimedios — I Ciclo 2026' },
            { rol: 'Universidad', nombre: 'Universidad de Costa Rica, Sede Guanacaste' },
            { rol: 'Framework', nombre: 'React 19 + Vite + JavaScript' },
            { rol: 'Gestor de Paquetes', nombre: 'pnpm' },
          ].map(c => (
            <div key={c.rol} style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--verde-claro)', marginBottom: '0.5rem' }}>{c.rol}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{c.nombre}</div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem', marginTop: '2rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Todos los datos sobre fauna, geografía y cultura están basados en fuentes verificadas de Costa Rica.
              Los recursos multimedia utilizados provienen de fuentes con licencia libre.
            </p>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <div style={{ fontSize: '2rem', color: 'var(--verde-claro)', fontWeight: 900 }}>¡Pura Vida! 🌿</div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', position: 'relative', zIndex: 10 }}>
          <Boton variante="glass" onClick={() => navegarA('inicio')} icono="🏠">Volver al Inicio</Boton>
        </div>
      </div>
    </div>
  );
};
