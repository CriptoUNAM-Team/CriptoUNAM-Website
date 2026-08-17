import React from 'react';

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'newsletter' | 'community';
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isOpen, onClose, title, message, type }) => {
  if (!isOpen) return null;

  const icon = type === 'newsletter' ? '📧' : '🎓';
  const bgColor = type === 'newsletter' ? '#D4AF37' : '#2563EB';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Icono */}
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          {icon}
        </div>

        {/* Título */}
        <h2 style={{
          color: '#333',
          fontSize: '24px',
          fontWeight: 'bold',
          margin: '0 0 12px 0',
          fontFamily: 'Chakra Petch'
        }}>
          {title}
        </h2>

        {/* Mensaje */}
        <p style={{
          color: '#666',
          fontSize: '16px',
          lineHeight: '1.5',
          margin: '0 0 24px 0'
        }}>
          {message}
        </p>

        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          style={{
            backgroundColor: bgColor,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            minWidth: '120px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          ¡Perfecto!
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessPopup;
