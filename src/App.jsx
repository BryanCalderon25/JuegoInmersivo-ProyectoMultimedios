import React, { Suspense, lazy } from 'react';
import { GameProvider } from './context/GameContext';
import { useGame } from './hooks/useGame';
import { PantallaCarga } from './components/screens/PantallaCarga';
import { LogroPopup } from './components/hud/LogroPopup';

// Lazy loading de páginas para mejor rendimiento
const HomeScreen      = lazy(() => import('./pages/HomeScreen').then(m => ({ default: m.HomeScreen })));
const MapaMundi       = lazy(() => import('./pages/MapaMundi').then(m => ({ default: m.MapaMundi })));
const Coleccionables  = lazy(() => import('./pages/Coleccionables').then(m => ({ default: m.Coleccionables })));
const Perfil          = lazy(() => import('./pages/Perfil').then(m => ({ default: m.Perfil })));
const Creditos        = lazy(() => import('./pages/Creditos').then(m => ({ default: m.Creditos })));

// Mundos (lazy)
const MundoBiodiversidad = lazy(() => import('./worlds/biodiversidad/MundoBiodiversidad').then(m => ({ default: m.MundoBiodiversidad })));
const MundoGeografia     = lazy(() => import('./worlds/geografia/MundoGeografia').then(m => ({ default: m.MundoGeografia })));
const MundoCultura       = lazy(() => import('./worlds/cultura/MundoCultura').then(m => ({ default: m.MundoCultura })));
const MundoIngles        = lazy(() => import('./worlds/ingles/MundoIngles').then(m => ({ default: m.MundoIngles })));

// Spinner de carga para Suspense
const SpinnerCarga = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--negro-suave)' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', animation: 'float 2s ease-in-out infinite' }}>🌿</div>
      <div className="loading-dots" style={{ marginTop: '1rem', justifyContent: 'center', display: 'flex', gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--verde-claro)', display: 'inline-block', animation: 'loading-dot-bounce 1.2s ease-in-out infinite' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--verde-claro)', display: 'inline-block', animation: 'loading-dot-bounce 1.2s ease-in-out 0.15s infinite' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--verde-claro)', display: 'inline-block', animation: 'loading-dot-bounce 1.2s ease-in-out 0.30s infinite' }} />
      </div>
    </div>
  </div>
);

/**
 * Enrutador principal del juego.
 * Gestiona las transiciones entre pantallas según el estado global.
 */
const Enrutador = () => {
  const { pantalla, mundoActual, navegarA, logroReciente } = useGame();

  const renderMundo = () => {
    const salir = () => navegarA('mapa');
    switch (mundoActual) {
      case 'biodiversidad': return <MundoBiodiversidad onSalir={salir} />;
      case 'geografia':     return <MundoGeografia onSalir={salir} />;
      case 'cultura':       return <MundoCultura onSalir={salir} />;
      case 'ingles':        return <MundoIngles onSalir={salir} />;
      default:              return <MapaMundi />;
    }
  };

  return (
    <>
      <Suspense fallback={<SpinnerCarga />}>
        {pantalla === 'carga'           && <PantallaCarga duracionMs={3000} onCompleta={() => navegarA('inicio')} />}
        {pantalla === 'inicio'          && <HomeScreen />}
        {pantalla === 'mapa'            && <MapaMundi />}
        {pantalla === 'mundo'           && renderMundo()}
        {pantalla === 'coleccionables'  && <Coleccionables />}
        {pantalla === 'perfil'          && <Perfil />}
        {pantalla === 'creditos'        && <Creditos />}
      </Suspense>

      {/* Popup de logros — siempre visible encima de todo */}
      <LogroPopup logro={logroReciente} />
    </>
  );
};

/**
 * Componente raíz — provee el contexto del juego.
 */
const App = () => {
  return (
    <GameProvider>
      <Enrutador />
    </GameProvider>
  );
};

export default App;
