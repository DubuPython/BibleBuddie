import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import BibleReader from './BibleReader';
import Profile from './Profile';

function App() {
  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Navigation Bar */}
      <nav style={{ display: 'flex', gap: '15px', padding: '20px', backgroundColor: '#e8eaf6', justifyContent: 'center', borderRadius: '15px', marginBottom: '30px', border: '3px solid #c5cae9' }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: '900', color: '#3f51b5', fontSize: '1.2rem' }}>🏠 Home</Link>
        <Link to="/bible" style={{ textDecoration: 'none', fontWeight: '900', color: '#3f51b5', fontSize: '1.2rem' }}>📖 Virtual Bible</Link>
        <Link to="/profile" style={{ textDecoration: 'none', fontWeight: '900', color: '#e91e63', fontSize: '1.2rem' }}>👤 My Profile</Link>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bible" element={<BibleReader />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      
    </div>
  );
}

export default App;