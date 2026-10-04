import React, { useState, useEffect } from 'react';

const kidFriendlyVerses = [
  { text: "For God so loved the world, that he gave his only begotten Son...", ref: "John 3:16" },
  { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" },
  { text: "In the beginning God created the heaven and the earth.", ref: "Genesis 1:1" }
];

const historicalFacts = [
  "In 1506, Pope Julius II laid the foundation stone for the beautiful St. Peter's Basilica in Rome.",
  "In 1223, St. Francis of Assisi created the very first live Nativity scene to help people celebrate Christmas.",
  "In 1531, The Blessed Virgin Mary appeared to St. Juan Diego in Mexico, known today as Our Lady of Guadalupe."
];

const Home = ({ theme }) => {
  const [historyEvent, setHistoryEvent] = useState("");
  const [votd, setVotd] = useState(kidFriendlyVerses[0]);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setVotd(kidFriendlyVerses[dayOfYear % kidFriendlyVerses.length]);
    setHistoryEvent(historicalFacts[dayOfYear % historicalFacts.length]);
  }, []);

  return (
    <div className="verses-scroll-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ textAlign: 'center' }}>
        <h2 style={{ color: theme.accent, marginTop: 0, fontSize: '1.8rem', fontWeight: '800' }}>⭐ Verse of the Day</h2>
        <p style={{ color: theme.text, fontSize: '1.3rem', fontStyle: 'italic', lineHeight: '1.6', margin: '20px 0' }}>"{votd.text}"</p>
        <p style={{ color: theme.text, fontWeight: '700', fontSize: '1.1rem', opacity: 0.8 }}>- {votd.ref}</p>
      </div>

      <div className="glass-card" style={{ textAlign: 'center' }}>
        <h2 style={{ color: theme.accent, marginTop: 0, fontSize: '1.8rem', fontWeight: '800' }}>📅 Today in History</h2>
        <p style={{ color: theme.text, fontSize: '1.2rem', lineHeight: '1.7', margin: '20px 0' }}>{historyEvent}</p>
      </div>
    </div>
  );
};

export default Home;