import React from 'react';
import { Boton } from '../components/common/Boton';
import { useGame } from '../hooks/useGame';

const CATEGORIAS = [
  { id: 'biodiversidad', nombre: 'Biodiversidad', icon: '🐸', color: 'var(--color-primary)' },
  { id: 'geografia', nombre: 'Geografía', icon: '🌋', color: 'var(--color-secondary)' },
  { id: 'cultura', nombre: 'Cultura', icon: '🪘', color: 'var(--color-accent-dark)' },
  { id: 'ingles', nombre: 'Inglés', icon: '🗣️', color: '#6a4c93' },
];

export const CategorySelect = ({ onSelect }) => {
  const { setCurrentModule } = useGame();

  const handleSelect = (catId) => {
    setCurrentModule(catId);
    onSelect(catId);
  };

  return (
    <div className="category-select-container animate-slide-up">
      <h2 className="text-center mb-4">Elige tu Aventura</h2>
      <div className="categorias-grid">
        {CATEGORIAS.map(cat => (
          <button 
            key={cat.id}
            className="tarjeta-categoria glass-panel"
            style={{ '--hover-color': cat.color }}
            onClick={() => handleSelect(cat.id)}
            aria-label={`Seleccionar categoría ${cat.nombre}`}
          >
            <div className="categoria-icon">{cat.icon}</div>
            <h3>{cat.nombre}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};
