import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#aab2aa'
    }}>
      <p style={{
        fontSize: '16px',
        marginBottom: '40px',
        textAlign: 'center',
        maxWidth: '550px',
        position: 'relative',
        top: '-80px' 
      }}>
        This is a code snippet website. Here, you can create and store your code snippets by specifying a title and a programming language.<br /><br />
        The code templates you save will be ready for use with the "Copy" button. You can also make any changes you like using the "Edit" button.<br /><br /><br /><br /><br />
        Bu bir code snippet sitesidir. Burada, bir başlık ve bir programlama dili belirterek kod parçacıklarınızı oluşturabilir ve saklayabilirsiniz.<br /><br />
        Kaydettiğiniz kod şablonları "Kopyala" düğmesiyle kullanıma hazır olacaktır. Ayrıca "Düzenle" düğmesini kullanarak istediğiniz değişiklikleri yapabilirsiniz.
      </p>

      <div style={{
        display: 'flex',
        gap: '50px'
      }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            cursor: 'pointer',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          Register
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            cursor: 'pointer',
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px'
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;