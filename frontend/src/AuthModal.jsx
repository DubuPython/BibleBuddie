import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const AuthModal = ({ onClose, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const theme = {
    surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#E0E0E0' : '#333333',
    border: isDarkMode ? '#333333' : '#C5CAE9',
    accent: isDarkMode ? '#FFB74D' : '#FF9800',
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('Processing...');
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message); else onClose(); 
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
      if (error) setMessage(error.message);
      else { setMessage('Account created successfully! Logging you in...'); setTimeout(() => onClose(), 1500); }
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
      <div className="card" style={{ backgroundColor: theme.surface, border: `3px solid ${theme.border}`, borderRadius: '25px', padding: '30px', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: theme.text, textAlign: 'center', margin: '0 0 20px 0', fontSize: '1.8rem' }}>{isLogin ? '👋 Welcome Back!' : '✨ Join BibleBuddie'}</h2>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {!isLogin && ( <input type="text" placeholder="Choose a Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '12px', borderRadius: '15px', border: `2px solid ${theme.border}`, backgroundColor: isDarkMode ? '#121212' : '#fff', color: theme.text, fontSize: '1rem', outline: 'none' }} required /> )}
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '15px', border: `2px solid ${theme.border}`, backgroundColor: isDarkMode ? '#121212' : '#fff', color: theme.text, fontSize: '1rem', outline: 'none' }} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '15px', border: `2px solid ${theme.border}`, backgroundColor: isDarkMode ? '#121212' : '#fff', color: theme.text, fontSize: '1rem', outline: 'none' }} required />
          <button type="submit" style={{ backgroundColor: theme.accent, padding: '12px', borderRadius: '15px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', color: isDarkMode ? '#121212' : '#fff' }}>{isLogin ? 'Log In' : 'Sign Up'}</button>
        </form>
        {message && <p style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: theme.accent }}>{message}</p>}
        <p style={{ textAlign: 'center', marginTop: '20px', color: theme.text, cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Need an account? Sign Up!" : "Already have an account? Log In!"}</p>
        <hr style={{ border: `1px dashed ${theme.border}`, margin: '20px 0' }} />
        <button onClick={onClose} style={{ backgroundColor: isDarkMode ? '#121212' : '#eeeeee', padding: '12px', borderRadius: '15px', border: `2px solid ${theme.border}`, fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', width: '100%', color: theme.text }}>🕵️‍♂️ Continue as Guest</button>
      </div>
    </div>
  );
};

export default AuthModal;