import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import './styles/effects.css';
import './styles/game.css';
import './styles/hud.css';
import './styles/screens.css';

// Montar la aplicación en el elemento root del DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
