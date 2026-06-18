import React from 'react';
import { useGame } from '../hooks/useGame';
import { Boton } from '../components/common/Boton';
import { BotonVolver } from '../components/common/BotonVolver';

/**
 * Pantalla de créditos con scroll animado estilo cine.
 */
export const Creditos = () => {
  const { navegarA } = useGame();

  return (
    <div className="anim-fade-in" style={{ minHeight: '100vh', background: 'var(--negro-suave)', paddingTop: '80px', padding: '80px 2rem 2rem', position: 'relative' }}>
      <BotonVolver destino="inicio" />
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: '2.5rem', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', height: '65vh' }}>
          <div style={{ animation: 'scroll-creditos 25s linear forwards', padding: '0 2rem' }}>
            <style>{`@keyframes scroll-creditos { from { transform: translateY(65vh); } to { transform: translateY(-100%); } }`}</style>
            
            {/* Contenido animado (CR, Titulo, Grid, etc.) */}
            <div style={{ width: 80, height: 80, margin: '0 auto 1rem', background: 'linear-gradient(135deg, var(--verde-hoja), var(--verde-bosque))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,0.2)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', letterSpacing: 2 }}>CR</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--dorado)', marginBottom: '2rem', textAlign: 'center' }}>
              Guardianes de Costa Rica
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: 16, marginBottom: '2rem' }}>
              {[
                { rol: 'Desarrollador', nombre: 'Bryan Josué Calderón Espinoza' },
                { rol: 'Curso', nombre: 'Multimedios — I Ciclo 2026' },
                { rol: 'Universidad', nombre: 'Universidad de Costa Rica, Sede Guanacaste' },
                { rol: 'Framework', nombre: 'React 19 + Vite + JavaScript' },
                { rol: 'Gestor de Paquetes', nombre: 'pnpm' },
              ].map(c => (
                <div key={c.rol}>
                  <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--verde-claro)', marginBottom: '0.5rem' }}>{c.rol}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>{c.nombre}</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem', marginTop: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                Todos los datos sobre fauna, geografía y cultura están basados en fuentes verificadas de Costa Rica.
                Los recursos multimedia utilizados provienen de fuentes con licencia libre.
              </p>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', paddingBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', color: 'var(--verde-claro)', fontWeight: 900 }}>¡Pura Vida!</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          <Boton variante="glass" onClick={() => navegarA('inicio')}>Volver al Inicio</Boton>
        </div>
      </div>
    </div>
  );
};
