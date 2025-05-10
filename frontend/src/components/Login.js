import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      localStorage.setItem('username', username);
      setMessage(data.mesaj);
      navigate('/snippetler');
    } else {
      setMessage(data.hata);
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <BackButton />
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Username:</label><br />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '10px', borderRadius: '20px', backgroundColor: '#00cd00', color: 'white' }}>Login</button>
        </form>
        {message && (
          <p style={{
            marginTop: '15px',
            color: message.toLowerCase().includes('success') ? 'green' : 'red',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;