import { createContext, useState, useEffect, useCallback } from 'react';

// Contexto global del videojuego
export const GameContext = createContext(null);

// Niveles y XP necesaria para subir
const NIVELES = [
  { nivel: 1, xpNecesaria: 0,    titulo: "Explorador Novato" },
  { nivel: 2, xpNecesaria: 200,  titulo: "Guardián Aprendiz" },
  { nivel: 3, xpNecesaria: 500,  titulo: "Guardián del Bosque" },
  { nivel: 4, xpNecesaria: 1000, titulo: "Guardián de Provincias" },
  { nivel: 5, xpNecesaria: 2000, titulo: "Maestro Guardián" },
];

// Calcula el nivel según la XP total
const calcularNivel = (xpTotal) => {
  let nivelActual = NIVELES[0];
  for (let i = NIVELES.length - 1; i >= 0; i--) {
    if (xpTotal >= NIVELES[i].xpNecesaria) {
      nivelActual = NIVELES[i];
      break;
    }
  }
  return nivelActual;
};

// Carga el estado guardado de localStorage
const cargarEstadoGuardado = () => {
  try {
    const guardado = localStorage.getItem('guardianes_cr_estado');
    if (guardado) return JSON.parse(guardado);
  } catch (e) {
    console.warn('No se pudo cargar el estado guardado:', e);
  }
  return null;
};

// Estado inicial del jugador
const ESTADO_INICIAL = {
  nombre: "Guardián",
  xpTotal: 0,
  coleccionables: [],        // IDs de items desbloqueados
  insignias: [],             // IDs de insignias ganadas
  mundosCompletados: {},     // { biodiversidad: { completado, estrellas, xp }, ... }
  tiempoJugado: 0,           // segundos
};

export const GameProvider = ({ children }) => {
  const [estado, setEstado] = useState(() => {
    const guardado = cargarEstadoGuardado();
    return guardado || { ...ESTADO_INICIAL };
  });

  const [pantalla, setPantalla] = useState('carga');         // carga | inicio | mapa | mundo | coleccionables | perfil | creditos
  const [mundoActual, setMundoActual] = useState(null);      // ID del mundo activo
  const [logroReciente, setLogroReciente] = useState(null);  // Popup de logro
  const [transicionActiva, setTransicionActiva] = useState(false);

  // Persistir estado en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem('guardianes_cr_estado', JSON.stringify(estado));
    } catch (e) {
      console.warn('No se pudo guardar el estado:', e);
    }
  }, [estado]);

  // Calcular nivel actual basado en XP
  const nivelActual = calcularNivel(estado.xpTotal);
  const nivelSiguiente = NIVELES.find(n => n.xpNecesaria > estado.xpTotal) || NIVELES[NIVELES.length - 1];
  const progresoNivel = nivelSiguiente.xpNecesaria > 0
    ? Math.min(((estado.xpTotal - nivelActual.xpNecesaria) / (nivelSiguiente.xpNecesaria - nivelActual.xpNecesaria)) * 100, 100)
    : 100;

  // Ganar XP
  const ganarXP = useCallback((cantidad, razon = '') => {
    setEstado(prev => {
      const xpAnterior = prev.xpTotal;
      const xpNueva = xpAnterior + cantidad;
      const nivelAnterior = calcularNivel(xpAnterior);
      const nivelNuevo = calcularNivel(xpNueva);

      // Detectar subida de nivel
      if (nivelNuevo.nivel > nivelAnterior.nivel) {
        setTimeout(() => {
          mostrarLogro({
            icono: '⭐',
            nombre: `¡Nivel ${nivelNuevo.nivel}!`,
            descripcion: nivelNuevo.titulo
          });
        }, 500);
      }

      return { ...prev, xpTotal: xpNueva };
    });
  }, []);

  // Perder XP (Penalización)
  const perderXP = useCallback((cantidad, razon = '') => {
    setEstado(prev => {
      const xpAnterior = prev.xpTotal;
      const xpNueva = Math.max(0, xpAnterior - cantidad); // Nunca baja de 0
      
      // Opcional: mostrar notificación de pérdida si se requiere
      
      return { ...prev, xpTotal: xpNueva };
    });
  }, []);

  // Desbloquear coleccionable
  const desbloquearColeccionable = useCallback((id, datosLogro = null) => {
    setEstado(prev => {
      if (prev.coleccionables.includes(id)) return prev;
      if (datosLogro) {
        setTimeout(() => mostrarLogro(datosLogro), 300);
      }
      return { ...prev, coleccionables: [...prev.coleccionables, id] };
    });
  }, []);

  // Ganar insignia
  const ganarInsignia = useCallback((id, datos) => {
    setEstado(prev => {
      if (prev.insignias.includes(id)) return prev;
      setTimeout(() => mostrarLogro({ icono: '🏅', ...datos }), 300);
      return { ...prev, insignias: [...prev.insignias, id] };
    });
  }, []);

  // Registrar mundo completado
  const completarMundo = useCallback((mundoId, estrellas, xpGanada) => {
    setEstado(prev => {
      const mundoActualData = prev.mundosCompletados[mundoId] || {};
      const mejorEstrellas = Math.max(mundoActualData.estrellas || 0, estrellas);
      return {
        ...prev,
        mundosCompletados: {
          ...prev.mundosCompletados,
          [mundoId]: { completado: true, estrellas: mejorEstrellas, xpGanada }
        }
      };
    });
  }, []);

  // Mostrar popup de logro
  const mostrarLogro = useCallback((datos) => {
    setLogroReciente(datos);
    setTimeout(() => setLogroReciente(null), 4000);
  }, []);

  // Navegación entre pantallas con transición
  const navegarA = useCallback((nuevaPantalla, mundoId = null) => {
    setTransicionActiva(true);
    setTimeout(() => {
      setPantalla(nuevaPantalla);
      if (mundoId) setMundoActual(mundoId);
      setTransicionActiva(false);
    }, 600);
  }, []);

  // Resetear progreso
  const reiniciarJuego = useCallback(() => {
    // Eliminar todas las llaves de localStorage asociadas al juego
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('guardianes_cr_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    // Forzar recarga de la página para destruir el estado en memoria
    window.location.reload();
  }, []);

  const valor = {
    // Estado del jugador
    estado,
    nivelActual,
    nivelSiguiente,
    progresoNivel,

    // Navegación
    pantalla,
    mundoActual,
    transicionActiva,
    navegarA,

    // Acciones del juego
    ganarXP,
    perderXP,
    desbloquearColeccionable,
    ganarInsignia,
    completarMundo,
    mostrarLogro,
    reiniciarJuego,

    // UI
    logroReciente,
  };

  return (
    <GameContext.Provider value={valor}>
      {children}
    </GameContext.Provider>
  );
};
