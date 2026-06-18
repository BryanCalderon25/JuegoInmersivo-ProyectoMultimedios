import React, { useState, useEffect } from 'react';
import { Boton } from '../../components/common/Boton';

const RECETAS = {
  'gallo-pinto': { ingredientes: ['Arroz', 'Frijoles Negros', 'Salsa Lizano'] },
  'casado': { ingredientes: ['Arroz', 'Frijoles', 'Plátano Maduro', 'Carne'] },
  'chifrijo': { ingredientes: ['Chicharrón', 'Frijoles Tiernos', 'Pico de Gallo', 'Tortillas'] },
  'olla-carne': { ingredientes: ['Carne de Res', 'Yuca', 'Papa', 'Zanahoria', 'Plátano Verde'] },
  'tamal': { ingredientes: ['Masa de Maíz', 'Cerdo', 'Arroz', 'Hojas de Plátano'] },
  'picadillo': { ingredientes: ['Papa', 'Carne Molida', 'Culantro', 'Cebolla'] }
};

const INGREDIENTES_FALSOS = ['Lechuga', 'Pan', 'Queso Cheddar', 'Fideos', 'Mayonesa', 'Atún', 'Manzana'];

export const MinijuegoSoda = ({ data, onVolver, onGanarItem, reproducirSFX, yaCompletados = [] }) => {
  const [platilloActual, setPlatilloActual] = useState(null);
  const [ingredientesOpciones, setIngredientesOpciones] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [completado, setCompletado] = useState(false);

  const comidas = data?.comidas || [];

  useEffect(() => {
    cargarPlatilloAleatorio();
  }, [comidas]);

  const cargarPlatilloAleatorio = () => {
    if (comidas.length === 0) return;
    const noHechos = comidas.filter(c => !yaCompletados.includes(c.id) && RECETAS[c.id]);
    
    if (noHechos.length === 0) {
      setCompletado(true);
      return;
    }

    const platillo = noHechos[Math.floor(Math.random() * noHechos.length)];
    setPlatilloActual(platillo);
    setSeleccionados([]);

    const receta = RECETAS[platillo.id].ingredientes;
    const falsosAleatorios = [...INGREDIENTES_FALSOS].sort(() => 0.5 - Math.random()).slice(0, 4);
    
    const opciones = [...receta, ...falsosAleatorios].map(nombre => ({
      nombre,
      esCorrecto: receta.includes(nombre)
    })).sort(() => 0.5 - Math.random());

    setIngredientesOpciones(opciones);
  };

  const manejarSeleccion = (ingrediente) => {
    if (seleccionados.includes(ingrediente.nombre)) return;

    if (ingrediente.esCorrecto) {
      reproducirSFX('/audio/efectos/coleccionable.mp3', 0.5);
      const nuevos = [...seleccionados, ingrediente.nombre];
      setSeleccionados(nuevos);

      const receta = RECETAS[platilloActual.id].ingredientes;
      if (nuevos.length === receta.length) {
        // Cocinó el platillo
        setTimeout(() => {
          reproducirSFX('/audio/efectos/victoria.mp3', 0.7);
          onGanarItem(platilloActual);
          cargarPlatilloAleatorio();
        }, 300);
      }
    } else {
      reproducirSFX('/audio/efectos/error.mp3', 0.5);
      // Animación de error visual (simulada restando puntos o solo sonido)
    }
  };

  return (
    <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, background: 'linear-gradient(160deg, #d35400, #c0392b)', zIndex: 1000, overflowY: 'auto', padding: '80px 2rem 2rem' }}>
      <button 
        onClick={onVolver} 
        style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 20, padding: '8px 16px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
      >
        ⬅ Volver al Pueblo
      </button>

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>🍽️ La Soda Tica</h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>Selecciona los ingredientes correctos para preparar el platillo tradicional.</p>

        {completado ? (
          <div className="anim-zoom-in" style={{ background: 'rgba(255,255,255,0.1)', padding: '3rem', borderRadius: 20, border: '2px solid white' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>👨‍🍳</div>
            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>¡Has cocinado todos los platillos!</h2>
            <Boton variante="glass" onClick={onVolver}>Salir de la Soda</Boton>
          </div>
        ) : platilloActual ? (
          <div className="anim-slide-up">
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: 20, border: '2px solid rgba(255,255,255,0.3)', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>{platilloActual.emoji}</div>
              <h2 style={{ color: '#f1c40f', fontSize: '1.8rem', fontWeight: 900 }}>Orden: {platilloActual.nombre}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Elige los {RECETAS[platilloActual.id].ingredientes.length} ingredientes correctos.</p>
              
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1rem 0' }}>
                {RECETAS[platilloActual.id].ingredientes.map((ing, i) => (
                  <div key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: seleccionados.includes(ing) ? '#2ecc71' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                    {seleccionados.includes(ing) ? '✓' : '?'}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {ingredientesOpciones.map((ingrediente, i) => {
                const yaSeleccionado = seleccionados.includes(ingrediente.nombre);
                return (
                  <button
                    key={i}
                    onClick={() => manejarSeleccion(ingrediente)}
                    disabled={yaSeleccionado}
                    style={{
                      background: yaSeleccionado ? '#2ecc71' : 'white',
                      border: 'none',
                      borderRadius: 12,
                      padding: '1.5rem',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: yaSeleccionado ? 'white' : '#333',
                      cursor: yaSeleccionado ? 'default' : 'pointer',
                      transform: yaSeleccionado ? 'scale(0.95)' : 'scale(1)',
                      boxShadow: yaSeleccionado ? 'none' : '0 6px 0 #bdc3c7',
                      transition: 'all 0.1s ease'
                    }}
                    onMouseDown={e => { if (!yaSeleccionado) e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = 'none'; }}
                    onMouseUp={e => { if (!yaSeleccionado) e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 0 #bdc3c7'; }}
                  >
                    {ingrediente.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
