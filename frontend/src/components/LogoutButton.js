import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        fontSize: '16px',
        background: '#8b1a1a',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        cursor: 'pointer'
      }}
    >
      Log out
    </button>
  );
}

export default LogoutButton;