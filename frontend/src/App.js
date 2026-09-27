import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import BibleReader from './BibleReader';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <h1>🕊️ BibleBuddie</h1>
        <div className="nav-links">
          <Link to="/">🏠 Home</Link>
          <Link to="/bible">📖 Virtual Bible</Link>
          <Link to="/saints">😇 Saints</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bible" element={<BibleReader book="Genesis" chapter={1} />} />
        <Route path="/saints" element={<div className="card"><h2 className="card-title">😇 Friends of God</h2><p>List of Saints coming soon...</p></div>} />
      </Routes>
    </div>
  );
}

export default App;