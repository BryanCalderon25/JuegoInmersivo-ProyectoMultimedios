import React from 'react';
import { useGame } from '../../hooks/useGame';

export const Header = () => {
  const { xp, stars } = useGame();

  return (
    <header className="glass-panel app-header animate-slide-down">
      <div className="header-brand">
        <span className="logo-emoji">🇨🇷</span>
        <h2>CR Explora</h2>
      </div>
      <div className="header-stats">
        <div className="stat-pill" aria-label={`Puntos de experiencia: ${xp}`}>
          <span>⚡</span>
          <strong>{xp} XP</strong>
        </div>
        <div className="stat-pill" aria-label={`Estrellas obtenidas: ${stars}`}>
          <span>⭐</span>
          <strong>{stars}</strong>
        </div>
      </div>
    </header>
  );
};
