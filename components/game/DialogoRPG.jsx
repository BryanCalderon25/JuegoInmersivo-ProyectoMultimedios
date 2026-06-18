import React, { useState, useEffect, useCallback } from 'react';
import { AudioPlayer } from '../media/AudioPlayer';
import '../../styles/game.css';

/**
 * Caja de diálogo estilo RPG con texto que aparece letra por letra.
 * Props:
 *   - npc { nombre, emoji, avatar }
 *   - dialogos [ { hablante, texto } | { hablante, opciones: [{ texto, esCorrecta, respuesta }] } ]
 *   - onOpcionSeleccionada(opcion, index, esCorrecta)
 *   - onFin()
 *   - audioSrc (opcional)
 */
export const DialogoRPG = ({ npc, dialogos = [], onOpcionSeleccionada, onFin, audioSrc }) => {
  const [indiceDialogo, setIndiceDialogo] = useState(0);
  const [textoMostrado, setTextoMostrado] = useState('');
  const [textoCompleto, setTextoCompleto] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);

  const dialogoActual = dialogos[indiceDialogo];

  // Efecto de texto letra por letra
  useEffect(() => {
    if (!dialogoActual || dialogoActual.opciones) return;
    setTextoMostrado('');
    setTextoCompleto(false);

    const texto = dialogoActual.texto;
    let i = 0;
    const intervalo = setInterval(() => {
      i++;
      setTextoMostrado(texto.slice(0, i));
      if (i >= texto.length) {
        setTextoCompleto(true);
        clearInterval(intervalo);
      }
    }, 22);

    return () => clearInterval(intervalo);
  }, [indiceDialogo, dialogoActual]);

  // Saltar animación de texto al hacer clic
  const completarTexto = useCallback(() => {
    if (!textoCompleto && dialogoActual?.texto) {
      setTextoMostrado(dialogoActual.texto);
      setTextoCompleto(true);
    } else if (textoCompleto && !dialogoActual?.opciones) {
      avanzar();
    }
  }, [textoCompleto, dialogoActual]);

  const avanzar = () => {
    const siguiente = indiceDialogo + 1;
    if (siguiente < dialogos.length) {
      setIndiceDialogo(siguiente);
      setOpcionSeleccionada(null);
      setEsperandoRespuesta(false);
    } else {
      if (onFin) onFin();
    }
  };

  const seleccionarOpcion = (opcion, index) => {
    if (opcionSeleccionada !== null) return;
    setOpcionSeleccionada(index);
    setEsperandoRespuesta(true);
    if (onOpcionSeleccionada) onOpcionSeleccionada(opcion, index, opcion.esCorrecta);
  };

  if (!dialogoActual) return null;

  const esOpcion = Boolean(dialogoActual.opciones);

  return (
    <div className="dialogo-container">
      <div className="dialogo-panel">
        {/* Avatar del NPC */}
        <div className="dialogo-avatar-placeholder" aria-hidden="true">
          {npc?.emoji || '🧑'}
        </div>

        {/* Contenido del diálogo */}
        <div className="dialogo-contenido">
          <div className="dialogo-nombre">
            {npc?.nombre || 'Desconocido'}
          </div>

          {!esOpcion ? (
            /* Texto normal con cursor parpadeante */
            <div className="dialogo-texto" onClick={completarTexto} style={{ cursor: 'pointer' }} role="article" aria-label={`${npc?.nombre || 'NPC'} dice: ${dialogoActual.texto}`}>
              {textoMostrado}
              {!textoCompleto && <span className="dialogo-cursor" aria-hidden="true" />}
            </div>
          ) : (
            /* Panel de opciones de respuesta */
            <div>
              {esperandoRespuesta && opcionSeleccionada !== null ? (
                <div className="dialogo-texto anim-fade-in">
                  {dialogoActual.opciones[opcionSeleccionada].respuesta}
                </div>
              ) : (
                <div>
                  <div className="dialogo-texto" style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                    Elige tu respuesta:
                  </div>
                  <div className="dialogo-opciones">
                    {dialogoActual.opciones.map((op, i) => (
                      <button
                        key={i}
                        className={`dialogo-opcion ${opcionSeleccionada === i ? (op.esCorrecta ? 'correcta' : 'incorrecta') : ''} ${opcionSeleccionada !== null ? 'seleccionada' : ''}`}
                        onClick={() => seleccionarOpcion(op, i)}
                        disabled={opcionSeleccionada !== null}
                        aria-label={`Opción ${i + 1}: ${op.texto}`}
                      >
                        <span style={{ color: 'var(--dorado)', marginRight: 8 }}>{['A', 'B', 'C', 'D'][i]})</span>
                        {op.texto}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audio opcional */}
          {(audioSrc || dialogoActual.audio) && (
            <div style={{ marginTop: '0.75rem' }}>
              <AudioPlayer src={audioSrc || dialogoActual.audio} titulo="Escuchar audio del entorno" compacto autoPlay />
            </div>
          )}

          {/* Avanzar */}
          {(textoCompleto || esperandoRespuesta) && (!esOpcion || esperandoRespuesta) && (
            <div className="dialogo-continuar">
              <span onClick={avanzar} role="button" aria-label="Continuar el diálogo" tabIndex={0} onKeyDown={e => e.key === 'Enter' && avanzar()}>
                {indiceDialogo + 1 < dialogos.length ? '▶ Continuar' : '✓ Finalizar'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
