import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const AuthModal = ({ onClose, theme }) => {
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
      if (error) setMessage(error.message); else onClose(); 
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
      if (error) setMessage(error.message);
      else { setMessage('Account created! Logging in...'); setTimeout(() => onClose(), 1500); }
    }
  };

  const inputStyle = { padding: '12px', borderRadius: '8px', border: `1px solid ${theme.secondary}`, backgroundColor: theme.dominant, color: theme.text, fontSize: '1rem', outline: 'none' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
      <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.secondary}`, borderRadius: '12px', padding: '30px', width: '100%', maxWidth: '400px' }}>
        
        <h2 style={{ color: theme.text, textAlign: 'center', margin: '0 0 25px 0', fontSize: '1.5rem' }}>{isLogin ? 'Welcome Back' : 'Join BibleBuddie'}</h2>
        
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && ( <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required /> )}
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" style={{ backgroundColor: theme.accent, padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', color: theme.buttonText }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {message && <p style={{ textAlign: 'center', marginTop: '15px', color: theme.accent, fontWeight: 'bold' }}>{message}</p>}
        <p style={{ textAlign: 'center', marginTop: '20px', color: theme.text, cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </p>
        <hr style={{ border: `1px solid ${theme.secondary}`, margin: '20px 0' }} />
        <button onClick={onClose} style={{ backgroundColor: theme.secondary, padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', color: '#ffffff' }}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default AuthModal;