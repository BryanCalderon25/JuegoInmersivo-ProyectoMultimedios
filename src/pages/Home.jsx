import React from 'react';
import { Boton } from '../components/common/Boton';
import { VideoPlayer } from '../components/media/VideoPlayer';

export const Home = ({ onStart }) => {
  return (
    <div className="home-container animate-fade-in">
      <div className="hero-section glass-panel">
        <h1 className="title-gradient">Descubre Costa Rica</h1>
        <p className="subtitle">
          Aprende sobre nuestra biodiversidad, geografía, cultura e idioma en esta aventura interactiva.
        </p>
        
        <div className="home-video-wrapper">
          <VideoPlayer 
            src="/video/intro.mp4" 
            poster="/images/poster-intro.jpg"
            title="Video introductorio de Costa Rica"
          />
        </div>

        <div className="action-buttons">
          <Boton variant="primary" onClick={onStart} className="btn-large">
            ¡Jugar Ahora! 🚀
          </Boton>
        </div>
      </div>
    </div>
  );
};
