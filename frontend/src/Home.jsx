import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [verseOfTheDay, setVerseOfTheDay] = useState(null);
  const [todayEvents, setTodayEvents] = useState([]);

  useEffect(() => {
    // Safely grab the live URL or fallback to localhost for local development
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    axios.get(`${apiUrl}/api/bible/John/3`)
      .then(response => {
        const targetVerse = response.data.find(v => v.verse === 16);
        setVerseOfTheDay(targetVerse);
      })
      .catch(error => console.error("Error fetching verse:", error));

    axios.get(`${apiUrl}/api/events/today`)
      .then(response => setTodayEvents(response.data))
      .catch(error => console.error("Error fetching events:", error));
  }, []);

  return (
    <div>
      <div className="card" style={{ backgroundColor: '#fff3e0', borderColor: '#ffe0b2' }}>
        <h2 className="card-title">⭐ Verse of the Day</h2>
        {verseOfTheDay ? (
          <div>
            <p className="verse-text">"{verseOfTheDay.text}"</p>
            <p style={{ fontWeight: 800, color: '#ff6d00', textAlign: 'right' }}>
              - {verseOfTheDay.book} {verseOfTheDay.chapter}:{verseOfTheDay.verse}
            </p>
          </div>
        ) : (
          <p>Loading today's special verse...</p>
        )}
      </div>

      <div className="card" style={{ backgroundColor: '#e8f5e9', borderColor: '#c8e6c9', boxShadow: '0 6px 0 #a5d6a7' }}>
        <h2 className="card-title" style={{ color: '#2e7d32' }}>📅 What Happened Today?</h2>
        {todayEvents.length > 0 ? (
          <ul style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
            {todayEvents.map(event => (
              <li key={event.id}><strong>{event.event_date}:</strong> {event.description}</li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: '1.2rem' }}>No major events recorded for today, but today is a great day to learn!</p>
        )}
      </div>
    </div>
  );
};

export default Home;