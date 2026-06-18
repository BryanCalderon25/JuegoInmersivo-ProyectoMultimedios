import React, { useState } from 'react';
import { Particulas } from '../components/effects/Particulas';
import { VideoPlayer } from '../components/media/VideoPlayer';
import { Boton } from '../components/common/Boton';
import { useGame } from '../hooks/useGame';
import '../styles/screens.css';
import '../styles/effects.css';

/**
 * Pantalla de inicio cinematográfica con video de fondo, partículas y parallax.
 */
export const HomeScreen = () => {
  const { navegarA, estado, reiniciarJuego } = useGame();
  const [mostrarReinicio, setMostrarReinicio] = useState(false);
  const tieneProgreso = estado.xpTotal > 0 || estado.coleccionables.length > 0 || estado.insignias.length > 0 || Object.keys(estado.mundosCompletados).length > 0;

  return (
    <div className="home-screen">
      {/* Video de fondo */}
      <div className="home-video-fondo">
        <VideoPlayer src={`${import.meta.env.BASE_URL}video/intro.mp4`} poster={`${import.meta.env.BASE_URL}images/fondos/bosque-fondo.webp`} fondoPantalla silenciadoInicial />
        <div className="home-video-overlay" />
      </div>

      {/* Partículas flotantes */}
      <Particulas cantidad={25} tipo="luces" />
      <Particulas cantidad={12} tipo="hojas" velocidad={0.6} />

      {/* Contenido principal */}
      <div className="home-contenido anim-fade-in">
        {/* Emblema */}
        <div className="home-emblema" aria-hidden="true" style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--verde-claro)', filter: 'none', border: '3px solid var(--verde-claro)', borderRadius: '50%', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', letterSpacing: 2 }}>CR</div>

        <p className="home-titulo-sub">
          Un videojuego educativo · UCR IF7102 Multimedios
        </p>

        <h1 className="home-titulo-principal">
          Guardianes de<br />Costa Rica
        </h1>

        <p className="home-descripcion">
          Embárcate en una aventura épica por la tierra de la Pura Vida. Descubre su biodiversidad, geografía, cultura e idioma en cuatro mundos únicos.
        </p>

        <div className="home-separador" aria-hidden="true" />

        {/* Botones del menú */}
        <nav className="home-menu" aria-label="Menú principal">
          <button
            className="home-btn-principal btn-ripple"
            onClick={() => navegarA('mapa')}
            aria-label="Comenzar la aventura"
          >
            {tieneProgreso ? '▶ Continuar Aventura' : '🌿 Comenzar Aventura'}
          </button>

          <div className="home-menu-secundario">
            <Boton
              variante="glass"
              onClick={() => navegarA('coleccionables')}
              ariaLabel="Ver colección de animales y objetos"
            >
              Colección
            </Boton>
            <Boton
              variante="glass"
              onClick={() => navegarA('perfil')}
              ariaLabel="Ver perfil del jugador"
            >
              Perfil
            </Boton>
            <Boton
              variante="glass"
              onClick={() => navegarA('creditos')}
              ariaLabel="Ver créditos del juego"
            >
              Créditos
            </Boton>
          </div>

          {tieneProgreso && (
            <button
              onClick={() => setMostrarReinicio(true)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.5rem' }}
              aria-label="Reiniciar progreso"
            >
              Reiniciar progreso
            </button>
          )}
        </nav>
      </div>

      {/* Diálogo de confirmación de reinicio */}
      {mostrarReinicio && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'rgba(10,25,15,0.97)', border: '1px solid rgba(249,65,68,0.4)', borderRadius: 20, padding: '2rem', maxWidth: 380, textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</p>
            <h2 style={{ marginBottom: '1rem', color: 'var(--rojo-lapa)' }}>¿Reiniciar progreso?</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Perderás toda tu XP, coleccionables e insignias. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Boton variante="peligro" onClick={() => { reiniciarJuego(); setMostrarReinicio(false); }}>
                Sí, reiniciar
              </Boton>
              <Boton variante="glass" onClick={() => setMostrarReinicio(false)}>
                Cancelar
              </Boton>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="home-footer" aria-label="Información del proyecto">
        IF7102 Multimedios · I Ciclo 2026 · Universidad de Costa Rica · Sede Regional Guanacaste
      </footer>
    </div>
  );
};
