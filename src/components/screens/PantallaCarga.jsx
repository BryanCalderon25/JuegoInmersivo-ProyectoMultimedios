import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { BarraVida } from '../common/BarraVida';
import '../../styles/screens.css';

/**
 * Pantalla de carga con barra de progreso y tips del juego.
 * Se auto-completa en el tiempo especificado.
 * Props: duracionMs, onCompleta
 */
export const PantallaCarga = ({ duracionMs = 2500, onCompleta }) => {
  const [progreso, setProgreso] = useState(0);
  const [saliendo, setSaliendo] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const { data: historia } = useFetch('/json/historia.json');

  const tips = historia?.tips || [
    'Cargando el mundo de Guardianes...',
    'Costa Rica tiene el 6% de la biodiversidad mundial.',
    'Preparando los bosques tropicales...',
  ];

  useEffect(() => {
    const incremento = 100 / (duracionMs / 50);
    const intervalo = setInterval(() => {
      setProgreso(prev => {
        const nuevo = Math.min(prev + incremento, 100);
        if (nuevo >= 100) clearInterval(intervalo);
        return nuevo;
      });
    }, 50);

    const timerTip = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 1500);

    const timerFin = setTimeout(() => {
      setSaliendo(true);
      setTimeout(() => { if (onCompleta) onCompleta(); }, 600);
    }, duracionMs);

    return () => {
      clearInterval(intervalo);
      clearInterval(timerTip);
      clearTimeout(timerFin);
    };
  }, [duracionMs, onCompleta, tips.length]);

  return (
    <div className={`pantalla-carga ${saliendo ? 'carga-saliendo' : ''}`}>
      <div className="carga-logo" aria-hidden="true">🇨🇷</div>

      <h1 className="carga-titulo" style={{ fontFamily: 'var(--font-ui)' }}>
        Guardianes de <span className="text-gradient-verde">Costa Rica</span>
      </h1>

      <div className="carga-barra-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Cargando...</span>
          <span className="carga-porcentaje">{Math.round(progreso)}%</span>
        </div>
        <div className="carga-barra-bg">
          <div className="carga-barra-fill" style={{ width: `${progreso}%` }} role="progressbar" aria-valuenow={Math.round(progreso)} aria-label="Progreso de carga" />
        </div>
        <div className="carga-tip" aria-live="polite" style={{ marginTop: 12 }}>
          💡 {tips[tipIndex]}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 24, opacity: 0.4, fontSize: '0.7rem' }}>
        IF7102 · Multimedios · UCR
      </div>
    </div>
  );
};
