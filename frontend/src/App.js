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
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 60-30-10 Theme Palette for App Level
  const theme = {
    bg: isDarkMode ? '#121212' : '#F0F4FF',      // 60% Dominant Background
    surface: isDarkMode ? '#1E1E1E' : '#FFFFFF', // 30% Secondary Surface
    accent: isDarkMode ? '#FFB74D' : '#FF9800',  // 10% Accent
    text: isDarkMode ? '#E0E0E0' : '#333333',
    border: isDarkMode ? '#333333' : '#C5CAE9'
  };

  useEffect(() => {
    // Apply the 60% dominant color to the entire HTML body
    document.body.style.backgroundColor = theme.bg;
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
  }, [isGuest, theme.bg, theme.text]);

  const handleGuestClose = () => {
    setIsGuest(true);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      
      {isAuthModalOpen && <AuthModal onClose={handleGuestClose} isDarkMode={isDarkMode} />}

      <nav style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: theme.surface, justifyContent: 'center', borderRadius: '15px', marginBottom: '30px', border: `3px solid ${theme.border}`, position: 'relative', alignItems: 'center', transition: 'all 0.3s' }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: '900', color: theme.text, fontSize: '1.2rem' }}>🏠 Home</Link>
        <Link to="/bible" style={{ textDecoration: 'none', fontWeight: '900', color: theme.text, fontSize: '1.2rem' }}>📖 Virtual Bible</Link>
        <Link to="/profile" style={{ textDecoration: 'none', fontWeight: '900', color: theme.accent, fontSize: '1.2rem' }}>👤 My Profile</Link>
        
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          style={{ position: 'absolute', right: (!session && isGuest) ? '120px' : '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {!session && isGuest && (
          <button 
            onClick={() => setIsAuthModalOpen(true)} 
            style={{ position: 'absolute', right: '20px', backgroundColor: theme.accent, color: isDarkMode ? '#121212' : '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Log In
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
        <Route path="/bible" element={<BibleReader session={session} openAuthModal={() => setIsAuthModalOpen(true)} isDarkMode={isDarkMode} />} />
        <Route path="/profile" element={<Profile session={session} openAuthModal={() => setIsAuthModalOpen(true)} isDarkMode={isDarkMode} />} />
      </Routes>
      
    </div>
  );
}

export default App;