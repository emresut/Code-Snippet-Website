import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';

function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newCode, setNewCode] = useState('');

  const username = localStorage.getItem('username');

  useEffect(() => {
    fetch('http://localhost:5000/snippetler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username })
    })
      .then((response) => response.json())
      .then((data) => {
        const snippetsWithEditing = (data.snippets || []).map(snippet => ({
          ...snippet,
          editing: false,
          tempTitle: snippet.title,
          tempLanguage: snippet.language,
          tempCode: snippet.code
        }));
        setSnippets(snippetsWithEditing);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load snippets.');
      });
  }, []);

  const handleAddSnippet = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/snippet-ekle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                title: newTitle,
                language: newLanguage,
                code: newCode
            })
        });

        const data = await response.json();


        if (response.status === 201) {
            alert('Snippet added successfully!');
            setSnippets([...snippets, {
                _id: data.snippet._id,      
                title: data.snippet.title,
                language: data.snippet.language,
                code: data.snippet.code,
                editing: false,
                tempTitle: data.snippet.title,
                tempLanguage: data.snippet.language,
                tempCode: data.snippet.code
            }]);
            setNewTitle('');
            setNewLanguage('');
            setNewCode('');
            setShowForm(false);
        } else {
            alert(data.hata || 'Failed to add snippet.');
        }
    } catch (err) {
        console.error(err);
        alert('Server error.');
    }
};


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const toggleEdit = (index) => {
    const updated = [...snippets];
    updated[index].editing = !updated[index].editing;
    setSnippets(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...snippets];
    updated[index][field] = value;
    setSnippets(updated);
  };

  const handleSave = async (index) => {
    const snippet = snippets[index];

    if (
        !snippet.tempTitle.trim() ||
        !snippet.tempLanguage.trim() ||
        !snippet.tempCode.trim()
    ) {
        alert('Please fill in all fields before saving.');
        return;
    }


    try {
        const response = await fetch('http://localhost:5000/snippet-guncelle', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                _id: snippet._id,
                new_title: snippet.tempTitle,
                new_language: snippet.tempLanguage,
                new_code: snippet.tempCode
            })
        });

        const data = await response.json();

        if (response.status === 200) {
            alert('Snippet updated successfully!');
            const updated = [...snippets];
            updated[index].title = updated[index].tempTitle;
            updated[index].language = updated[index].tempLanguage;
            updated[index].code = updated[index].tempCode;
            updated[index].editing = false;
            setSnippets(updated);
        } else {
            alert(data.hata || 'Failed to update snippet.');
        }
    } catch (err) {
        console.error(err);
        alert('Server error.');
    }
};


  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      fetch('http://localhost:5000/snippet-sil', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id })
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.mesaj || 'Snippet deleted.');
          setSnippets(prev => prev.filter(snippet => snippet._id !== id));
        })
        .catch((err) => {
          console.error(err);
          alert('Delete failed.');
        });
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => alert('Code copied to clipboard!'))
      .catch(() => alert('Copy failed.'));
  };

  const filteredSnippets = snippets.filter(snippet =>
    snippet.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#aab2aa', minHeight: '100vh', paddingTop: '20px', position: 'relative' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '1400px',
        margin: '0 auto 20px'
      }}>
        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{username}</span>
        <LogoutButton buttonText="Log out" />
      </div>

      <div style={{
        display: 'flex',
        maxWidth: '1400px',
        margin: '0 auto 50px',
        borderRadius: '20px',
        padding: '20px',
        backgroundColor: '#c0c8cc',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ width: '400px', marginRight: '40px' }}>
          <button
            onClick={handleAddSnippet}
            style={{ marginTop: '20px', padding: '12px', width: '100%', fontSize: '16px' }}
          >
            {showForm ? 'Close Form' : 'Add New Snippet'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label>Title:</label><br />
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Language:</label><br />
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Code:</label><br />
                <textarea
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  rows="8"
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>
              <button type="submit" style={{ marginTop: '10px', padding: '12px', width: '100%', fontSize: '16px' }}>
                Submit
              </button>
            </form>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ marginLeft: '20px' }}>My Snippets</h2>
          <input
            type="text"
            placeholder="Filter by Language..."
            value={search}
            onChange={handleSearchChange}
            style={{ marginBottom: '20px', padding: '8px', width: '60%', marginLeft: '20px' }}
          />
          {error && <p style={{ color: 'red', marginLeft: '20px' }}>{error}</p>}
          {filteredSnippets.length === 0 ? (
            <p style={{ marginLeft: '20px' }}>No snippets found.</p>
          ) : (
            <ul style={{ marginLeft: '20px' }}>
              {filteredSnippets.map((snippet, index) => (
                <li key={index} style={{ marginBottom: '20px' }}>
                  {snippet.editing ? (
                    <>
                      <input
                        type="text"
                        value={snippet.tempTitle}
                        onChange={(e) => handleChange(index, 'tempTitle', e.target.value)}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <input
                        type="text"
                        value={snippet.tempLanguage}
                        onChange={(e) => handleChange(index, 'tempLanguage', e.target.value)}
                        style={{ width: '100%', marginBottom: '8px' }}
                      />
                      <textarea
                        rows="15"
                        value={snippet.tempCode}
                        onChange={(e) => handleChange(index, 'tempCode', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </>
                  ) : (
                    <>
                      <h3>{snippet.title}</h3>
                      <p><strong>Language:</strong> {snippet.language}</p>
                      <pre style={{ backgroundColor: '#f0f0f0', padding: '10px' }}>
                        {snippet.code}
                      </pre>
                    </>
                  )}
                  <div style={{ marginTop: '10px' }}>
                    {snippet.editing ? (
                      <button onClick={() => handleSave(index)} style={{ backgroundColor: 'green', color: 'white', marginRight: '10px', borderRadius: '20px' }}>
                        Save
                      </button>
                    ) : (
                      <button onClick={() => toggleEdit(index)} style={{ marginRight: '10px', borderRadius: '20px', backgroundColor: '#00008b', color: 'white'}}>
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDelete(snippet._id)} style={{ marginRight: '10px', borderRadius: '20px', backgroundColor: '#8b1a1a', color: "white" }}>Delete</button>
                    <button onClick={() => handleCopy(snippet.code)}>Copy</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default SnippetsPage;