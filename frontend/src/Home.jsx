import React, { useState, useEffect } from 'react';
import axios from 'axios';

const kidFriendlyVerses = [
  { text: "For God so loved the world, that he gave his only begotten Son...", ref: "John 3:16" },
  { text: "I can do all things through Christ which strengtheneth me.", ref: "Philippians 4:13" },
  { text: "In the beginning God created the heaven and the earth.", ref: "Genesis 1:1" },
  { text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", ref: "Proverbs 3:5" },
  { text: "Be strong and of a good courage, fear not, nor be afraid of them...", ref: "Deuteronomy 31:6" },
  { text: "We love him, because he first loved us.", ref: "1 John 4:19" },
  { text: "Thy word is a lamp unto my feet, and a light unto my path.", ref: "Psalm 119:105" }
];

const Home = ({ theme }) => {
  const [historyEvent, setHistoryEvent] = useState("Loading today's history...");
  const [votd, setVotd] = useState(kidFriendlyVerses[0]);

  useEffect(() => {
    // 1. Set Verse of the Day based on the day of the year
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    setVotd(kidFriendlyVerses[dayOfYear % kidFriendlyVerses.length]);

    // 2. Fetch "What Happened Today" API
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    axios.get(`https://byabbe.se/on-this-day/${month}/${day}/events.json`)
      .then(res => {
        if (res.data && res.data.events && res.data.events.length > 0) {
          // Pick a random historical event from today's date
          const event = res.data.events[Math.floor(Math.random() * Math.min(10, res.data.events.length))];
          setHistoryEvent(`In ${event.year}: ${event.description}`);
        }
      })
      .catch(() => setHistoryEvent("No major events recorded for today, but today is a great day to learn!"));
  }, []);

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
      <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '25px', padding: '30px', marginBottom: '25px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
        <h2 style={{ color: theme.accent, fontSize: '2rem', marginTop: 0 }}>⭐ Verse of the Day</h2>
        <p style={{ color: theme.text, fontSize: '1.2rem', fontStyle: 'italic', lineHeight: '1.6' }}>"{votd.text}"</p>
        <p style={{ color: theme.accent, textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem' }}>- {votd.ref}</p>
      </div>

      <div style={{ backgroundColor: theme.inputBg, border: `4px solid ${theme.accent}`, borderRadius: '25px', padding: '30px', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}>
        <h2 style={{ color: theme.accent, fontSize: '2rem', marginTop: 0 }}>📅 What Happened Today?</h2>
        <p style={{ color: theme.text, fontSize: '1.2rem', lineHeight: '1.6' }}>{historyEvent}</p>
      </div>
    </div>
  );
};

export default Home;