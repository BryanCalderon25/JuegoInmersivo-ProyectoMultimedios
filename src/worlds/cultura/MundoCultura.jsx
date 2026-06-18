import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useGame } from '../../hooks/useGame';
import { useAudio } from '../../hooks/useAudio';
import { HUD } from '../../components/hud/HUD';
import { Boton } from '../../components/common/Boton';
import { BotonVolver } from '../../components/common/BotonVolver';
import '../../styles/game.css';
import '../../styles/effects.css';

// Minijuegos
import { MinijuegoMuseo } from './MinijuegoMuseo';
import { MinijuegoSoda } from './MinijuegoSoda';
import { MinijuegoParque } from './MinijuegoParque';

export const MundoCultura = ({ onSalir }) => {
  const { data: culturaData, loading } = useFetch('/json/cultura.json');
  const { ganarXP, desbloquearColeccionable, completarMundo, mostrarLogro } = useGame();
  const { reproducirBGM, reproducirSFX } = useAudio();

  const [vistaActual, setVistaActual] = useState('pueblo'); // pueblo | museo | soda | parque
  const [objetosRecogidos, setObjetosRecogidos] = useState([]);
  const [introVisible, setIntroVisible] = useState(true);

  // Música del pueblo (solo cuando está en 'pueblo')
  useEffect(() => {
    if (vistaActual === 'pueblo') {
      reproducirBGM('/audio/musica/pueblo.mp3', 0.35);
    }
  }, [vistaActual]);

  const recogerObjeto = (objeto) => {
    if (!objetosRecogidos.includes(objeto.id)) {
      ganarXP(objeto.xpAlRecoger || 50, `Cultura: ${objeto.nombre || objeto.expresion || objeto.titulo}`);
      desbloquearColeccionable(objeto.id, {
        icono: objeto.emoji || '🏛️',
        nombre: objeto.nombre || objeto.expresion || objeto.titulo,
        descripcion: '¡Descubriste un tesoro cultural!',
      });
      setObjetosRecogidos(prev => {
        const nuevos = [...prev, objeto.id];
        // Asumimos ~10 items requeridos para completar el mundo de cultura (o más)
        if (nuevos.length >= 10) {
          setTimeout(() => {
            completarMundo('cultura', 3, 600);
            mostrarLogro({ icono: '🎭', nombre: '¡Guardián de la Cultura!', descripcion: 'Conoces las tradiciones ticas.' });
          }, 800);
        }
        return nuevos;
      });
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a0e00' }}>
      <div style={{ textAlign: 'center', color: 'var(--dorado)' }}>
        <div style={{ fontSize: '4rem', animation: 'float 2s ease-in-out infinite' }}>🎭</div>
        <p style={{ marginTop: '1rem' }}>Preparando el pueblo...</p>
      </div>
    </div>
  );

  return (
    <div className="anim-fade-in" style={{ minHeight: '100vh', background: 'url(/images/fondos/pueblo-fondo.webp) center/cover no-repeat fixed', position: 'relative', paddingTop: 70, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,15,0,0.7)', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* PANTALLA INTRODUCTORIA */}
      {introVisible && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(20, 10, 0, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', backdropFilter: 'blur(10px)' }}>
          <div className="anim-slide-up" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,196,106,0.5)', borderRadius: 24, padding: '3rem', maxWidth: 600, textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 3s ease-in-out infinite' }}>🎭</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>Mundo 3: Cultura</h2>
            <p style={{ color: 'var(--dorado)', fontWeight: 600, marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>El Pueblo Tico</p>
            
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Nuestra cultura es rica en tradiciones, símbolos, comidas y frases únicas. Tu misión es visitar los lugares del pueblo para jugar y aprender.
              </p>
              <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Museo:</strong> Juega memoria con símbolos patrios.</li>
                <li><strong>Soda:</strong> Ayuda a preparar los platillos típicos.</li>
                <li><strong>Parque:</strong> Demuestra que entiendes nuestras expresiones.</li>
              </ul>
            </div>
            
            <Boton variante="dorado" tamaño="lg" onClick={() => setIntroVisible(false)} icono="🚀">
              ¡Visitar el Pueblo!
            </Boton>
          </div>
        </div>
      )}

      {/* Ruteador Interno */}
      {vistaActual === 'pueblo' && (
        <>
          <HUD enMundo onSalir={onSalir} />
          
          {/* Nubes Flotantes sobre el fondo */}
          <div style={{ position: 'absolute', top: '20%', left: '15%', fontSize: '4rem', opacity: 0.6, animation: 'niebla-mover 40s linear infinite', zIndex: 1 }}>☁️</div>
          <div style={{ position: 'absolute', top: '15%', left: '70%', fontSize: '5rem', opacity: 0.5, animation: 'niebla-mover 30s linear infinite reverse', zIndex: 1 }}>☁️</div>
          <div style={{ position: 'absolute', top: '30%', left: '40%', fontSize: '3rem', opacity: 0.4, animation: 'niebla-mover 50s linear infinite', zIndex: 1 }}>☁️</div>

          <div className="anim-zoom-in" style={{ padding: '2rem', width: '100%', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', zIndex: 2, position: 'relative' }}>
            <h1 style={{ textAlign: 'center', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.5rem', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))' }}>
              <span className="text-gradient-dorado">El Pueblo Tico</span>
            </h1>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.9)', marginBottom: 'auto', fontSize: '1.1rem', fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              Haz clic en un edificio para entrar y participar en los minijuegos.
            </p>

            {/* EDIFICIOS INTERACTIVOS */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 'clamp(2rem, 8vw, 6rem)', alignItems: 'flex-end', padding: '0 1rem', marginBottom: '2rem' }}>
              
              {/* 1. MUSEO */}
              <button 
                onClick={() => setVistaActual('museo')}
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) translateY(-15px)'; reproducirSFX('/audio/efectos/coleccionable.mp3', 0.2); }}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                aria-label="Entrar al Museo Histórico"
              >
                <div style={{ background: 'rgba(0,0,0,0.7)', padding: '6px 16px', borderRadius: 12, color: 'white', fontWeight: 900, fontSize: '1rem', marginBottom: '1rem', backdropFilter: 'blur(5px)', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                  Museo
                </div>
                <img src="/images/cultura/bandera-cr.png" alt="Museo" style={{ height: 'clamp(80px, 15vw, 150px)', filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.6))', objectFit: 'contain' }} />
              </button>

              {/* 2. SODA */}
              <button 
                onClick={() => setVistaActual('soda')}
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) translateY(-15px)'; reproducirSFX('/audio/efectos/coleccionable.mp3', 0.2); }}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                aria-label="Entrar a la Soda Tica"
              >
                <div style={{ background: 'rgba(0,0,0,0.7)', padding: '6px 16px', borderRadius: 12, color: 'white', fontWeight: 900, fontSize: '1rem', marginBottom: '1rem', backdropFilter: 'blur(5px)', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                  Soda
                </div>
                <img src="/images/cultura/casado.webp" alt="Soda" style={{ height: 'clamp(80px, 15vw, 150px)', filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.6))', objectFit: 'contain' }} />
              </button>

              {/* 3. PARQUE */}
              <button 
                onClick={() => setVistaActual('parque')}
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) translateY(-15px)'; reproducirSFX('/audio/efectos/coleccionable.mp3', 0.2); }}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
                aria-label="Entrar al Parque Central"
              >
                <div style={{ background: 'rgba(0,0,0,0.7)', padding: '6px 16px', borderRadius: 12, color: 'white', fontWeight: 900, fontSize: '1rem', marginBottom: '1rem', backdropFilter: 'blur(5px)', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                  Parque
                </div>
                <img src="/images/cultura/arbol-guanacaste.webp" alt="Parque" style={{ height: 'clamp(80px, 15vw, 150px)', filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.6))', objectFit: 'contain' }} />
              </button>

            </div>

            {/* Progreso */}
            <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: '1rem 2rem', border: '1px solid rgba(255,255,255,0.2)', width: 'fit-content', margin: '0 auto', backdropFilter: 'blur(10px)' }}>
              <span style={{ color: 'var(--dorado)', fontWeight: 800, fontSize: '1.2rem' }}>
                {objetosRecogidos.length} Tesoros Culturales Obtenidos
              </span>
            </div>
          </div>
        </>
      )}

      {/* RENDERIZADO DE MINIJUEGOS */}
      {vistaActual === 'museo' && (
        <MinijuegoMuseo 
          data={culturaData} 
          onVolver={() => setVistaActual('pueblo')} 
          onGanarItem={recogerObjeto}
          reproducirSFX={reproducirSFX}
          yaCompletados={objetosRecogidos}
        />
      )}

      {vistaActual === 'soda' && (
        <MinijuegoSoda 
          data={culturaData} 
          onVolver={() => setVistaActual('pueblo')} 
          onGanarItem={recogerObjeto}
          reproducirSFX={reproducirSFX}
          yaCompletados={objetosRecogidos}
        />
      )}

      {vistaActual === 'parque' && (
        <MinijuegoParque 
          data={culturaData} 
          onVolver={() => setVistaActual('pueblo')} 
          onGanarItem={recogerObjeto}
          reproducirSFX={reproducirSFX}
          yaCompletados={objetosRecogidos}
        />
      )}
      </div>
    </div>
  );
};
