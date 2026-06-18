import React, { useRef, useRef as useRefAlt, useEffect } from 'react';

/**
 * AudioPlayer reutilizable con controles de play/pause, volumen y mute.
 * Props: src, titulo, autoPlay, volumenInicial, compacto
 */
export const AudioPlayer = ({ src, titulo = 'Audio', autoPlay = false, volumenInicial = 0.7, compacto = false }) => {
  const audioRef = useRef(null);
  const [reproduciendo, setReproduciendo] = React.useState(false);
  const [volumen, setVolumen] = React.useState(volumenInicial);
  const [silenciado, setSilenciado] = React.useState(false);
  const [progreso, setProgreso] = React.useState(0);
  const [duracion, setDuracion] = React.useState(0);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = silenciado ? 0 : volumen;
  }, [volumen, silenciado]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().then(() => setReproduciendo(true)).catch(() => {});
    }
  }, [src, autoPlay]);

  const alternarPlay = () => {
    if (!audioRef.current) return;
    if (reproduciendo) {
      audioRef.current.pause();
      setReproduciendo(false);
    } else {
      audioRef.current.play().then(() => setReproduciendo(true)).catch(() => {});
    }
  };

  const formatearTiempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = Math.floor(seg % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (compacto) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '50px', padding: '8px 16px' }}>
        <audio ref={audioRef} src={src} onTimeUpdate={() => setProgreso(audioRef.current?.currentTime || 0)} onLoadedMetadata={() => setDuracion(audioRef.current?.duration || 0)} onEnded={() => setReproduciendo(false)} />
        <button onClick={alternarPlay} aria-label={reproduciendo ? 'Pausar' : 'Reproducir'} style={{ background: 'none', border: 'none', color: 'var(--verde-claro)', fontSize: '1.2rem', cursor: 'pointer' }}>
          {reproduciendo ? '⏸' : '▶'}
        </button>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
          🔊 {titulo}
        </span>
        <button onClick={() => setSilenciado(p => !p)} aria-label={silenciado ? 'Activar sonido' : 'Silenciar'} style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer' }}>
          {silenciado ? '🔇' : '🔉'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={() => setProgreso(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuracion(audioRef.current?.duration || 0)}
        onEnded={() => setReproduciendo(false)}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <button onClick={alternarPlay} aria-label={reproduciendo ? 'Pausar audio' : 'Reproducir audio'}
          style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--verde-bosque)', border: 'none', color: 'white', fontSize: '1.3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {reproduciendo ? '⏸' : '▶'}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>🔊 {titulo}</div>
          <input type="range" min={0} max={duracion || 100} value={progreso} step={0.1}
            onChange={e => { if (audioRef.current) { audioRef.current.currentTime = parseFloat(e.target.value); setProgreso(parseFloat(e.target.value)); } }}
            style={{ width: '100%', accentColor: 'var(--verde-hoja)' }} aria-label="Progreso del audio" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
            <span>{formatearTiempo(progreso)}</span>
            <span>{formatearTiempo(duracion)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <button onClick={() => setSilenciado(p => !p)} aria-label={silenciado ? 'Activar sonido' : 'Silenciar'} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
            {silenciado ? '🔇' : '🔉'}
          </button>
          <input type="range" min={0} max={1} step={0.05} value={volumen}
            onChange={e => setVolumen(parseFloat(e.target.value))}
            style={{ width: '48px', accentColor: 'var(--verde-hoja)', writingMode: 'vertical-lr', direction: 'rtl', height: '48px' }}
            aria-label="Volumen" />
        </div>
      </div>
    </div>
  );
};
