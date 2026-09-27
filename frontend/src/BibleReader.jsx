import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Full list of KJV Bible Books for the dropdown
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
  
  // Restored setter functions to allow UI updates
  const [currentBook, setCurrentBook] = useState(book);
  const [currentChapter, setCurrentChapter] = useState(chapter);
  
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 4;

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    axios.get(`${apiUrl}/api/bible/${currentBook}/${currentChapter}`)
      .then(response => {
        setVerses(response.data);
        setCurrentPage(1); // Reset to page 1 when changing chapter
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
    <div className="card" style={{ backgroundColor: '#fff', border: '4px solid #8c9eff' }}>
      
      {/* Navigation Controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#e8eaf6', 
        padding: '10px 15px', 
        borderRadius: '10px',
        marginBottom: '20px' 
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', color: '#3f51b5' }}>Book:</label>
          <select 
            value={currentBook} 
            onChange={(e) => setCurrentBook(e.target.value)}
            style={{ padding: '5px 10px', borderRadius: '5px', border: '2px solid #8c9eff', fontSize: '1rem' }}
          >
            {bibleBooks.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <label style={{ fontWeight: 'bold', color: '#3f51b5', marginLeft: '10px' }}>Chapter:</label>
          <input 
            type="number" 
            min="1" 
            max="150" 
            value={currentChapter} 
            onChange={(e) => setCurrentChapter(e.target.value)}
            style={{ padding: '5px 10px', borderRadius: '5px', border: '2px solid #8c9eff', fontSize: '1rem', width: '70px' }}
          />
        </div>
        
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#757575' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 className="card-title" style={{ color: '#3f51b5', margin: 0 }}>
          📖 {currentBook} (Chapter {currentChapter})
        </h2>
      </div>
      
      <div style={{ marginBottom: '25px', display: 'flex', gap: '10px' }}>
        <button 
          className="bouncy-button" 
          onClick={handleReadAloud} 
          disabled={isSpeaking || verses.length === 0}
          style={{ backgroundColor: '#00e676', boxShadow: '0 5px 0 #00c853', flex: 1 }}
        >
          🔊 Read Page Aloud
        </button>
        <button 
          className="bouncy-button" 
          onClick={handleStop} 
          disabled={!isSpeaking}
          style={{ flex: 1 }}
        >
          ⏹️ Stop
        </button>
      </div>

      <div className="storybook-text" style={{ 
        backgroundColor: '#fffdf0', 
        border: '2px solid #e0d4b5',
        borderRadius: '5px 25px 25px 5px', 
        boxShadow: 'inset 8px 0 10px rgba(0,0,0,0.03), 2px 2px 5px rgba(0,0,0,0.1)',
        minHeight: '300px',
        padding: '20px'
      }}>
        {verses.length > 0 ? currentVerses.map(verse => (
          <p key={verse.id} style={{ marginBottom: '20px', fontSize: '1.2rem', lineHeight: '1.8' }}>
            <span style={{ 
              backgroundColor: '#ffe082', 
              color: '#d84315', 
              borderRadius: '50%', 
              padding: '2px 8px', 
              fontWeight: 'bold', 
              marginRight: '10px',
              fontSize: '0.9rem'
            }}>
              {verse.verse}
            </span> 
            {verse.text}
          </p>
        )) : <p style={{ textAlign: 'center', color: '#9e9e9e', fontStyle: 'italic' }}>
          Loading the story... (Make sure this chapter exists!)
          </p>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          className="bouncy-button" 
          onClick={prevPage} 
          disabled={currentPage === 1}
          style={{ backgroundColor: '#29b6f6', boxShadow: '0 5px 0 #0288d1' }}
        >
          ⬅️ Previous Page
        </button>
        <button 
          className="bouncy-button" 
          onClick={nextPage} 
          disabled={currentPage === totalPages}
          style={{ backgroundColor: '#29b6f6', boxShadow: '0 5px 0 #0288d1', marginRight: 0 }}
        >
          Next Page ➡️
        </button>
      </div>
    </div>
  );
};

export default BibleReader;