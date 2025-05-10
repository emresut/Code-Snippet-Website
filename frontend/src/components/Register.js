import React, { useState } from 'react';
import BackButton from './BackButton';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateInput = (text) => /^[a-zA-Z0-9]{1,20}$/.test(text);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirm_password) {
      setError("Passwords do not match.");
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    if (!validateInput(username) || !validateInput(password)) {
      setError("Username and password must be max 20 characters and contain only letters and numbers.");
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirm_password }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage(data.mesaj);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.hata || 'Registration failed.');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Server error.');
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
        <h2 style={{ textAlign: 'center' }}>Register</h2>
        <form onSubmit={handleRegister} style={{ textAlign: 'center' }}>
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
          <div style={{ marginBottom: '10px' }}>
            <label>Confirm Password:</label><br />
            <input
              type="password"
              value={confirm_password}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '10px', borderRadius: '20px', backgroundColor: '#00cd00', color: 'white' }}>Register</button>
        </form>
        
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#fffafa',
          border: '1px solid #ccc',
          fontSize: '14px',
          lineHeight: '1.5',
          minWidth: '550px',
          boxSizing: 'border-box',
          overflowX: 'auto',
          textAlign: 'left'
        }}>
          <strong>Requirements:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '8px', marginBottom: '0' }}>
            <li style={{ whiteSpace: 'nowrap' }}>Username and password must be max 20 characters.</li>
            <li style={{ whiteSpace: 'nowrap' }}>Only letters (English alphabet) and numbers are allowed. (No special characters.)</li>
            <li style={{ whiteSpace: 'nowrap' }}>Password confirmation must match.</li>
          </ul>
        </div>

        {message && <p style={{ color: 'green', marginTop: '15px', textAlign: 'center' }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Register;