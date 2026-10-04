import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';
import Home from './Home';
import BibleReader from './BibleReader';
import Profile from './Profile';
import AuthModal from './AuthModal';
import MusicPlayer from './MusicPlayer';

function App() {
  const [session, setSession] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? {
    bgGradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    surface: 'rgba(30, 30, 30, 0.6)', 
    accent: '#4dbcff', 
    text: '#ffffff',
    inputBg: 'rgba(0, 0, 0, 0.4)'
  } : {
    bgGradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    surface: 'rgba(255, 255, 255, 0.75)', 
    accent: '#007AFF', 
    text: '#1c1c1e',
    inputBg: 'rgba(255, 255, 255, 0.9)'
  };

  useEffect(() => {
    document.body.style.background = theme.bgGradient;
    document.body.style.backgroundAttachment = 'fixed'; 
  }, [theme.bgGradient]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session && !isGuest) setIsAuthModalOpen(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, [isGuest]);

  return (
    <div className="app-container" style={{ '--surface': theme.surface, '--inputBg': theme.inputBg, '--accent': theme.accent, '--text': theme.text, maxWidth: '1000px', margin: '0 auto' }}>
      
      {isAuthModalOpen && <AuthModal onClose={() => { setIsGuest(true); setIsAuthModalOpen(false); }} theme={theme} isDarkMode={isDarkMode} />}

      <nav className="nav-bar glass-card" style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '15px 25px' }}>
        <div className="nav-bar-links" style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
          <Link to="/" style={{ color: theme.text, textDecoration: 'none', fontWeight: '900' }}>Home</Link>
          <Link to="/bible" style={{ color: theme.text, textDecoration: 'none', fontWeight: '900' }}>Virtual Bible</Link>
          <Link to="/profile" style={{ color: theme.text, textDecoration: 'none', fontWeight: '900' }}>My Profile</Link>
        </div>

        <div className="nav-bar-controls" style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <MusicPlayer theme={theme} />
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="btn btn-secondary" style={{ width: '45px', height: '45px', padding: 0, borderRadius: '50%' }}>
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          {!session && isGuest && (
            <button onClick={() => setIsAuthModalOpen(true)} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '1rem' }}>
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