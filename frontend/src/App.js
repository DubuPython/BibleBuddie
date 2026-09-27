import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';
import Home from './Home';
import BibleReader from './BibleReader';
import Profile from './Profile';
import AuthModal from './AuthModal';

function App() {
  const [session, setSession] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Exact 60-30-10 Palettes from your references
  const theme = isDarkMode ? {
    dominant: '#00263d',
    secondary: '#005080',
    accent: '#4dbcff',
    text: '#ffffff',
    buttonText: '#00263d',
    cardBg: '#005080'
  } : {
    dominant: '#ffffff',
    secondary: '#365263',
    accent: '#0090e6',
    text: '#365263',
    buttonText: '#ffffff',
    cardBg: '#ffffff'
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme.dominant;
    document.body.style.color = theme.text;
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session && !isGuest) setIsAuthModalOpen(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setIsAuthModalOpen(false);
    });

    return () => subscription.unsubscribe();
  }, [isGuest, theme]);

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {isAuthModalOpen && <AuthModal onClose={() => { setIsGuest(true); setIsAuthModalOpen(false); }} theme={theme} />}

      <nav style={{ display: 'flex', gap: '20px', padding: '20px 30px', backgroundColor: theme.secondary, borderRadius: '12px', marginBottom: '30px', alignItems: 'center', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#ffffff', fontSize: '1.1rem' }}>Home</Link>
        <Link to="/bible" style={{ textDecoration: 'none', fontWeight: 'bold', color: '#ffffff', fontSize: '1.1rem' }}>Virtual Bible</Link>
        <Link to="/profile" style={{ textDecoration: 'none', fontWeight: 'bold', color: theme.accent, fontSize: '1.1rem' }}>My Profile</Link>
        
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: 'none', color: theme.accent, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            {isDarkMode ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>

          {!session && isGuest && (
            <button onClick={() => setIsAuthModalOpen(true)} style={{ backgroundColor: theme.accent, color: theme.buttonText, border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              Log In
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        <Route path="/bible" element={<BibleReader session={session} openAuthModal={() => setIsAuthModalOpen(true)} theme={theme} />} />
        <Route path="/profile" element={<Profile session={session} openAuthModal={() => setIsAuthModalOpen(true)} theme={theme} />} />
      </Routes>
    </div>
  );
}

export default App;