import React, { useState, useEffect } from 'react';
import axios from 'axios';

const bibleBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", 
  "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", 
  "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", 
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const BibleReader = ({ book = 'Genesis', chapter = 1 }) => {
  const [verses, setVerses] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [currentBook, setCurrentBook] = useState(book);
  const [currentChapter, setCurrentChapter] = useState(chapter);
  
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 4;

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    axios.get(`${apiUrl}/api/bible/${currentBook}/${currentChapter}`)
      .then(response => {
        setVerses(response.data);
        setCurrentPage(1); 
      })
      .catch(error => console.error("Error fetching Bible data", error));
  }, [currentBook, currentChapter]);

  const totalPages = Math.ceil(verses.length / versesPerPage);
  const indexOfLastVerse = currentPage * versesPerPage;
  const indexOfFirstVerse = indexOfLastVerse - versesPerPage;
  const currentVerses = verses.slice(indexOfFirstVerse, indexOfLastVerse);

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const pageText = currentVerses.map(v => v.text).join(' ');
      const utterance = new SpeechSynthesisUtterance(pageText);
      utterance.rate = 0.85; 
      utterance.pitch = 1.1; 
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert("Oops! Your browser doesn't support reading aloud.");
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      handleStop(); 
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handleStop();
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="card" style={{ backgroundColor: '#fff', border: '5px solid #8c9eff', borderRadius: '25px', padding: '20px' }}>
      
      {/* Child-Friendly Navigation Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#f0f4ff', 
        padding: '15px 25px', 
        borderRadius: '20px',
        marginBottom: '25px',
        border: '3px dashed #b39ddb'
      }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span>
            <select 
              value={currentBook} 
              onChange={(e) => setCurrentBook(e.target.value)}
              style={{ 
                padding: '10px 20px', 
                borderRadius: '25px', 
                border: '3px solid #ff4081', 
                backgroundColor: '#fce4ec',
                color: '#c2185b',
                fontWeight: '900', 
                fontSize: '1.1rem',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 4px 0 #ff4081'
              }}
            >
              {bibleBooks.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔢</span>
            <input 
              type="number" 
              min="1" 
              max="150" 
              value={currentChapter} 
              // Enforce integer parsing to prevent backend crashes
              onChange={(e) => setCurrentChapter(parseInt(e.target.value) || 1)}
              style={{ 
                padding: '10px 15px', 
                borderRadius: '25px', 
                border: '3px solid #ff9800', 
                backgroundColor: '#fff3e0',
                color: '#e65100',
                fontWeight: '900', 
                fontSize: '1.1rem', 
                width: '80px',
                outline: 'none',
                textAlign: 'center',
                boxShadow: '0 4px 0 #ff9800'
              }}
            />
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#bbdefb', 
          color: '#1565c0', 
          padding: '8px 15px', 
          borderRadius: '20px', 
          fontWeight: '900',
          border: '2px solid #64b5f6'
        }}>
          Page {currentPage} of {totalPages || 1}
        </div>
      </div>
      
      <h2 className="card-title" style={{ color: '#3f51b5', margin: '0 0 20px 0', fontSize: '2rem', textAlign: 'center' }}>
        {currentBook} (Chapter {currentChapter})
      </h2>
      
      <div style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
        <button 
          className="bouncy-button" 
          onClick={handleReadAloud} 
          disabled={isSpeaking || verses.length === 0}
          style={{ backgroundColor: '#00e676', boxShadow: '0 6px 0 #00c853', flex: 1, borderRadius: '20px', fontSize: '1.2rem', padding: '15px' }}
        >
          🔊 Read Aloud
        </button>
        <button 
          className="bouncy-button" 
          onClick={handleStop} 
          disabled={!isSpeaking}
          style={{ backgroundColor: '#ff5252', boxShadow: '0 6px 0 #d50000', flex: 1, borderRadius: '20px', fontSize: '1.2rem', padding: '15px', color: 'white' }}
        >
          ⏹️ Stop
        </button>
      </div>

      <div className="storybook-text" style={{ 
        backgroundColor: '#fffdf0', 
        border: '3px solid #ffe082',
        borderRadius: '20px', 
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.05)',
        minHeight: '300px',
        padding: '30px'
      }}>
        {verses.length > 0 ? currentVerses.map(verse => (
          <p key={verse.id} style={{ marginBottom: '25px', fontSize: '1.3rem', lineHeight: '1.8', color: '#424242' }}>
            <span style={{ 
              backgroundColor: '#ffb74d', 
              color: '#fff', 
              borderRadius: '50%', 
              width: '35px',
              height: '35px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900', 
              marginRight: '12px',
              fontSize: '1rem',
              boxShadow: '0 3px 0 #f57c00'
            }}>
              {verse.verse}
            </span> 
            {verse.text}
          </p>
        )) : (
          <div style={{ textAlign: 'center', color: '#9e9e9e', paddingTop: '50px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🤔</span>
            <h3>Loading the story...</h3>
            <p>If it doesn't load, make sure the chapter exists!</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
        <button 
          className="bouncy-button" 
          onClick={prevPage} 
          disabled={currentPage === 1}
          style={{ backgroundColor: '#29b6f6', boxShadow: '0 6px 0 #0288d1', borderRadius: '20px', padding: '12px 25px' }}
        >
          ⬅️ Previous
        </button>
        <button 
          className="bouncy-button" 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          style={{ backgroundColor: '#29b6f6', boxShadow: '0 6px 0 #0288d1', marginRight: 0, borderRadius: '20px', padding: '12px 25px' }}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default BibleReader;