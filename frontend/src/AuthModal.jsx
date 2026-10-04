import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const AuthModal = ({ onClose, theme, isDarkMode }) => {
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

  const inputStyle = { padding: '15px', borderRadius: '20px', border: `3px solid ${theme.accent}`, backgroundColor: theme.inputBg, color: isDarkMode ? '#ffffff' : '#365263', fontSize: '1.1rem', outline: 'none', fontWeight: 'bold', boxSizing: 'border-box', width: '100%' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
      <div className="card" style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '35px', padding: '40px', width: '100%', maxWidth: '450px', boxShadow: '0 15px 30px rgba(0,0,0,0.3)', boxSizing: 'border-box' }}>
        
        <h2 style={{ color: theme.text, textAlign: 'center', margin: '0 0 25px 0' }}>{isLogin ? 'Welcome Back' : 'Join BibleBuddie'}</h2>
        
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && ( <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} required /> )}
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" style={{ backgroundColor: theme.accent, padding: '15px', borderRadius: '20px', border: 'none', fontSize: '1.3rem', fontWeight: '900', cursor: 'pointer', color: isDarkMode ? '#00263d' : '#ffffff', boxShadow: '0 6px 0 rgba(0,0,0,0.15)', marginTop: '10px', width: '100%' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {message && <p style={{ textAlign: 'center', marginTop: '15px', color: theme.accent, fontWeight: 'bold', fontSize: '1.1rem' }}>{message}</p>}
        <p style={{ textAlign: 'center', marginTop: '20px', color: theme.text, cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Log In"}
        </p>
        <hr style={{ border: `2px dashed ${theme.accent}`, margin: '25px 0' }} />
        <button onClick={onClose} style={{ backgroundColor: theme.inputBg, padding: '15px', borderRadius: '20px', border: `3px solid ${theme.accent}`, fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', width: '100%', color: isDarkMode ? '#ffffff' : '#365263' }}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default AuthModal;