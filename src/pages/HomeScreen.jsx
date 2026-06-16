
import React, { useState } from 'react';
import { Particulas } from '../components/effects/Particulas';
import { VideoPlayer } from '../components/media/VideoPlayer';
import { Boton } from '../components/common/Boton';
import { useGame } from '../hooks/useGame';
import '../styles/screens.css';
import '../styles/effects.css';

/**
 * Pantalla de inicio inspirada en la interfaz de Stitch (Google)
 */
export const HomeScreen = () => {
  const { navegarA, estado, reiniciarJuego, nivelActual } = useGame();
  const [mostrarReinicio, setMostrarReinicio] = useState(false);
  const tieneProgreso = estado.xpTotal > 0;

  return (
    <div className="home-screen stitch-theme">
      {/* Fondo: Gradiente oscuro sobre el video */}
      <div className="home-video-fondo">
        <VideoPlayer src="/video/intro.mp4" poster="/images/fondos/bosque-fondo.webp" fondoPantalla silenciadoInicial />
        <div className="stitch-video-overlay" />
      </div>

      {/* Partículas muy sutiles, color cálido */}
      <Particulas cantidad={15} tipo="luces" />

      {/* Header Superior estilo Stitch */}
      <header className="stitch-header">
        <div className="stitch-header-left">
          <div className="stitch-avatar">
            {/* Si no hay imagen, mostramos el emoji */}
            <div className="stitch-avatar-fallback">🧑‍🌾</div>
          </div>
          <div className="stitch-header-info">
            <span className="stitch-rango">EXPLORADOR RANGO: {nivelActual.titulo.toUpperCase()}</span>
            <span className="stitch-nombre">{estado.nombre}</span>
          </div>
        </div>
        <button className="stitch-menu-btn" aria-label="Menú">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </header>

      {/* Contenido Central */}
      <div className="stitch-contenido anim-fade-in">
        <p className="stitch-subtitulo">U N &nbsp; V I D E O J U E G O &nbsp; E D U C A T I V O</p>
        
        <h1 className="stitch-titulo-principal">
          Guardianes de<br />Costa Rica
        </h1>
        
        <p className="stitch-descripcion">
          Embárcate en una aventura épica por la tierra de la<br />
          Pura Vida. Descubre su biodiversidad y cultura.
        </p>

        {/* Botones */}
        <div className="stitch-botones-container">
          <button className="stitch-btn-primary btn-ripple" onClick={() => navegarA('mapa')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'white' }}>
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            {tieneProgreso ? 'Continuar Aventura' : 'Comenzar Aventura'}
          </button>

          <div className="stitch-btn-row">
            <button className="stitch-btn-secondary btn-ripple" onClick={() => navegarA('coleccionables')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e9c46a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Colección
            </button>
            <button className="stitch-btn-secondary btn-ripple" onClick={() => navegarA('perfil')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#74c69d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Perfil
            </button>
          </div>

          <button className="stitch-btn-secondary stitch-btn-ajustes btn-ripple" onClick={() => navegarA('creditos')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8ecae6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Ajustes
          </button>

          {tieneProgreso && (
            <button className="stitch-btn-text" onClick={() => setMostrarReinicio(true)}>
              REINICIAR PROGRESO
            </button>
          )}
        </div>
      </div>

      <footer className="stitch-footer">
        <p>ECO-ADVENTURE STUDIOS • 2026</p>
        <p>VERSIÓN 1.0.0-STABLE • COSTA RICA CARBON NEUTRAL</p>
      </footer>

      {/* Diálogo de confirmación de reinicio (sin cambios visuales mayores) */}
      {mostrarReinicio && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'rgba(15,20,18,0.98)', border: '1px solid rgba(249,65,68,0.4)', borderRadius: 24, padding: '2.5rem', maxWidth: 400, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</p>
            <h2 style={{ marginBottom: '1rem', color: 'var(--rojo-lapa)', fontFamily: 'var(--font-ui)' }}>¿Reiniciar progreso?</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
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
    </div>
  );
};
