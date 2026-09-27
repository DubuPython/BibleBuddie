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

  const handleGuestClose = () => {
    setIsGuest(true);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      
      {isAuthModalOpen && <AuthModal onClose={handleGuestClose} />}

      <nav style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#e8eaf6', justifyContent: 'center', borderRadius: '15px', marginBottom: '30px', border: '3px solid #c5cae9', position: 'relative' }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: '900', color: '#3f51b5', fontSize: '1.2rem' }}>🏠 Home</Link>
        <Link to="/bible" style={{ textDecoration: 'none', fontWeight: '900', color: '#3f51b5', fontSize: '1.2rem' }}>📖 Virtual Bible</Link>
        <Link to="/profile" style={{ textDecoration: 'none', fontWeight: '900', color: '#e91e63', fontSize: '1.2rem' }}>👤 My Profile</Link>
        
        {!session && isGuest && (
          <button 
            onClick={() => setIsAuthModalOpen(true)} 
            style={{ position: 'absolute', right: '20px', backgroundColor: '#3f51b5', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 0 #283593' }}
          >
            Log In
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bible" element={<BibleReader session={session} openAuthModal={() => setIsAuthModalOpen(true)} />} />
        <Route path="/profile" element={<Profile session={session} openAuthModal={() => setIsAuthModalOpen(true)} />} />
      </Routes>
      
    </div>
  );
}

export default App;