import React, { useEffect, useRef } from 'react';
import { Boton } from './Boton';

/**
 * Modal glassmorphism con animación zoom-in y trampa de foco.
 * Props: isOpen, onClose, titulo, children, sinBotones, ancho
 */
export const Modal = ({ isOpen, onClose, titulo, children, sinBotones = false, ancho = '500px' }) => {
  const modalRef = useRef(null);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Trampa de foco
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay anim-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-titulo"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
    >
      <div
        ref={modalRef}
        className="glass anim-zoom-in"
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
        style={{
          width: '100%',
          maxWidth: ancho,
          borderRadius: '20px',
          padding: '2rem',
          position: 'relative',
          outline: 'none',
          background: 'rgba(10,25,15,0.95)',
          border: '1px solid rgba(64,145,108,0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {titulo && (
            <h3 id="modal-titulo" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--verde-claro)' }}>
              {titulo}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, marginLeft: 'auto' }}
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div>{children}</div>

        {/* Pie opcional */}
        {!sinBotones && (
          <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
            <Boton variante="glass" onClick={onClose}>Cerrar</Boton>
          </div>
        )}
      </div>
    </div>
  );
};
