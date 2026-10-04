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

  // Updated with beautiful, vibrant background gradients
  const theme = isDarkMode ? {
    bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', // Deep Starry Night
    surface: '#005080',
    accent: '#4dbcff', 
    text: '#ffffff',
    inputBg: '#00263d',
    pageText: '#ffffff'
  } : {
    bgGradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', // Bright Playful Sky
    surface: '#365263',
    accent: '#0090e6', 
    text: '#ffffff',
    inputBg: '#ffffff',
    pageText: '#365263'
  };

  useEffect(() => {
    document.body.style.background = theme.bgGradient;
    document.body.style.backgroundAttachment = 'fixed'; 
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.transition = 'background 0.4s ease';
  }, [theme.bgGradient]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session && !isGuest) setIsAuthModalOpen(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setIsAuthModalOpen(false);
    });
    return () => subscription.unsubscribe();
  }, [isGuest]);

  return (
    <div className="app-container" style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {isAuthModalOpen && <AuthModal onClose={() => { setIsGuest(true); setIsAuthModalOpen(false); }} theme={theme} isDarkMode={isDarkMode} />}

      <nav className="nav-bar card" style={{ display: 'flex', padding: '20px 30px', backgroundColor: theme.surface, borderRadius: '25px', marginBottom: '20px', alignItems: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.15)', border: `4px solid ${theme.accent}`, flexShrink: 0 }}>
        
        <div className="nav-bar-links" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: '900', color: '#ffffff', fontSize: '1.2rem' }}>Home</Link>
          <Link to="/bible" style={{ textDecoration: 'none', fontWeight: '900', color: '#ffffff', fontSize: '1.2rem' }}>Virtual Bible</Link>
          <Link to="/profile" style={{ textDecoration: 'none', fontWeight: '900', color: '#ffffff', fontSize: '1.2rem' }}>My Profile</Link>
        </div>

        <div className="nav-bar-controls" style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          <MusicPlayer theme={theme} isDarkMode={isDarkMode} />

          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: theme.accent, border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 0 rgba(0,0,0,0.2)', flexShrink: 0 }}>
            {isDarkMode ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00263d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
          {!session && isGuest && (
            <button onClick={() => setIsAuthModalOpen(true)} style={{ backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 0 rgba(0,0,0,0.2)' }}>
              Log In
            </button>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home theme={theme} />} />
        <Route path="/bible" element={<BibleReader session={session} openAuthModal={() => setIsAuthModalOpen(true)} theme={theme} isDarkMode={isDarkMode} />} />
        <Route path="/profile" element={<Profile session={session} openAuthModal={() => setIsAuthModalOpen(true)} theme={theme} isDarkMode={isDarkMode} />} />
      </Routes>
    </div>
  );
}

export default App;