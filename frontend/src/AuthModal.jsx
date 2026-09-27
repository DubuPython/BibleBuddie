import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const AuthModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('Processing...');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else onClose(); 
    } else {
      // Pass the username into the Supabase user metadata
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { data: { username } }
      });
      if (error) setMessage(error.message);
      else {
        setMessage('Account created successfully! Logging you in...');
        setTimeout(() => onClose(), 1500); // Auto-close after signing up
      }
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
      <div className="card" style={{ backgroundColor: '#fff', border: '5px solid #8c9eff', borderRadius: '25px', padding: '30px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        
        <h2 style={{ color: '#3f51b5', textAlign: 'center', margin: '0 0 20px 0', fontSize: '1.8rem' }}>
          {isLogin ? '👋 Welcome Back!' : '✨ Join BibleBuddie'}
        </h2>
        
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && (
            <input 
              type="text" placeholder="Choose a Username" 
              value={username} onChange={(e) => setUsername(e.target.value)} 
              style={{ padding: '12px', borderRadius: '15px', border: '2px solid #b39ddb', fontSize: '1rem', outline: 'none' }} required 
            />
          )}
          <input 
            type="email" placeholder="Email Address" 
            value={email} onChange={(e) => setEmail(e.target.value)} 
            style={{ padding: '12px', borderRadius: '15px', border: '2px solid #b39ddb', fontSize: '1rem', outline: 'none' }} required 
          />
          <input 
            type="password" placeholder="Password" 
            value={password} onChange={(e) => setPassword(e.target.value)} 
            style={{ padding: '12px', borderRadius: '15px', border: '2px solid #b39ddb', fontSize: '1rem', outline: 'none' }} required 
          />
          <button type="submit" style={{ backgroundColor: '#00e676', padding: '12px', borderRadius: '15px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 0 #00c853', color: '#000' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {message && <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: '#d84315' }}>{message}</p>}

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#757575', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign Up!" : "Already have an account? Log In!"}
        </p>

        <hr style={{ border: '1px dashed #c5cae9', margin: '20px 0' }} />
        <button onClick={onClose} style={{ backgroundColor: '#eeeeee', padding: '12px', borderRadius: '15px', border: '2px solid #bdbdbd', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', color: '#616161' }}>
          🕵️‍♂️ Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default AuthModal;