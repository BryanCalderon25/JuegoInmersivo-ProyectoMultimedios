import React, { useRef, useState } from 'react';

/**
 * VideoPlayer con controles personalizados.
 * Props: src, poster, titulo, enBucle, fondoPantalla (boolean para modo fondo)
 */
export const VideoPlayer = ({ src, poster, titulo, enBucle = false, fondoPantalla = false, silenciadoInicial = false }) => {
  const videoRef = useRef(null);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [silenciado, setSilenciado] = useState(silenciadoInicial);

  const alternarPlay = () => {
    if (!videoRef.current) return;
    if (reproduciendo) {
      videoRef.current.pause();
      setReproduciendo(false);
    } else {
      videoRef.current.play().then(() => setReproduciendo(true)).catch(() => {});
    }
  };

  if (fondoPantalla) {
    return (
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={enBucle}
        muted={silenciado}
        playsInline
        onClick={alternarPlay}
        onEnded={() => setReproduciendo(false)}
        style={{ width: '100%', display: 'block', cursor: 'pointer' }}
        aria-label={titulo || 'Video educativo de Costa Rica'}
      />
      {/* Overlay de controles */}
      {!reproduciendo && (
        <button
          onClick={alternarPlay}
          aria-label="Reproducir video"
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.85)',
            border: 'none', borderRadius: '50%',
            width: 64, height: 64,
            fontSize: '1.8rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▶
        </button>
      )}
      {/* Control de mute */}
      <button
        onClick={() => { setSilenciado(p => !p); if (videoRef.current) videoRef.current.muted = !silenciado; }}
        aria-label={silenciado ? 'Activar sonido' : 'Silenciar'}
        style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: 'white', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {silenciado ? '🔇' : '🔊'}
      </button>
    </div>
  );
};
