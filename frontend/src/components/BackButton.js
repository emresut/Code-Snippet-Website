import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        fontSize: '60px',
        background: 'none',
        border: 'none',
        color: '#8b1a1a',
        cursor: 'pointer'
      }}
    >
      ←
    </button>
  );
}

export default BackButton;