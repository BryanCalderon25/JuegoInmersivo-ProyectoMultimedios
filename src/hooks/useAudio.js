import { useRef, useCallback, useEffect } from 'react';

/**
 * Hook para manejar múltiples pistas de audio (BGM, SFX, ambiente).
 * Retorna funciones para reproducir, pausar y controlar el volumen.
 */
export const useAudio = () => {
  // Referencias a los elementos de audio
  const bgmRef     = useRef(null);
  const ambienteRef = useRef(null);
  const sfxRefs    = useRef({});

  // Función para resolver rutas para GitHub Pages
  const resolvePath = (src) => {
    if (typeof src === 'string' && src.startsWith('/')) {
      return `${import.meta.env.BASE_URL}${src.slice(1)}`;
    }
    return src;
  };

  // Reproducir música de fondo (BGM) con crossfade
  const reproducirBGM = useCallback((src, volumen = 0.4) => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
    const audio = new Audio(resolvePath(src));
    audio.loop = true;
    audio.volume = 0;
    audio.play().catch(() => {}); // Silenciar error de autoplay

    // Fade in
    let vol = 0;
    const fadeIn = setInterval(() => {
      vol = Math.min(vol + 0.05, volumen);
      audio.volume = vol;
      if (vol >= volumen) clearInterval(fadeIn);
    }, 50);

    bgmRef.current = audio;
  }, []);

  // Detener BGM con fade out
  const detenerBGM = useCallback(() => {
    if (!bgmRef.current) return;
    const audio = bgmRef.current;
    let vol = audio.volume;
    const fadeOut = setInterval(() => {
      vol = Math.max(0, vol - 0.05);
      audio.volume = vol;
      if (vol <= 0) {
        audio.pause();
        clearInterval(fadeOut);
      }
    }, 50);
  }, []);

  // Reproducir sonido de ambiente (loop)
  const reproducirAmbiente = useCallback((src, volumen = 0.25) => {
    if (ambienteRef.current) ambienteRef.current.pause();
    const audio = new Audio(resolvePath(src));
    audio.loop = true;
    audio.volume = volumen;
    audio.play().catch(() => {});
    ambienteRef.current = audio;
  }, []);

  // Reproducir efecto de sonido (SFX) puntual
  const reproducirSFX = useCallback((src, volumen = 0.7) => {
    const audio = new Audio(resolvePath(src));
    audio.volume = volumen;
    audio.play().catch(() => {});
    return audio;
  }, []);

  // Silenciar/activar todo
  const silenciarTodo = useCallback((silenciar) => {
    if (bgmRef.current)     bgmRef.current.muted = silenciar;
    if (ambienteRef.current) ambienteRef.current.muted = silenciar;
  }, []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (bgmRef.current) bgmRef.current.pause();
      if (ambienteRef.current) ambienteRef.current.pause();
    };
  }, []);

  return {
    reproducirBGM,
    detenerBGM,
    reproducirAmbiente,
    reproducirSFX,
    silenciarTodo,
    bgmRef,
    ambienteRef,
  };
};
