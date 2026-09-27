import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BibleReader = ({ book = 'Genesis', chapter = 1 }) => {
  const [verses, setVerses] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [currentBook, setCurrentBook] = useState(book);
  const [currentChapter, setCurrentChapter] = useState(chapter);
  
  // New state for pages
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 4; // Adjust this to show more or fewer verses per page

  useEffect(() => {
    axios.get(`http://localhost:5000/api/bible/${currentBook}/${currentChapter}`)
      .then(response => {
        setVerses(response.data);
        setCurrentPage(1); // Reset to page 1 when loading a new chapter
      })
      .catch(error => console.error("Error fetching Bible data", error));
  }, [currentBook, currentChapter]);

  // Calculate pages
  const totalPages = Math.ceil(verses.length / versesPerPage);
  const indexOfLastVerse = currentPage * versesPerPage;
  const indexOfFirstVerse = indexOfLastVerse - versesPerPage;
  const currentVerses = verses.slice(indexOfFirstVerse, indexOfLastVerse);

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Only read the text on the current page
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
      handleStop(); // Stop reading when flipping the page
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title" style={{ color: '#3f51b5', margin: 0 }}>
          📖 {currentBook} (Chapter {currentChapter})
        </h2>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#757575' }}>
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>
      
      <div style={{ marginBottom: '25px', marginTop: '20px', display: 'flex', gap: '10px' }}>
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

      {/* The "Paper" Page UI */}
      <div className="storybook-text" style={{ 
        backgroundColor: '#fffdf0', 
        border: '2px solid #e0d4b5',
        borderRadius: '5px 25px 25px 5px', /* Makes it look like the right side of an open book */
        boxShadow: 'inset 8px 0 10px rgba(0,0,0,0.03), 2px 2px 5px rgba(0,0,0,0.1)',
        minHeight: '300px'
      }}>
        {verses.length > 0 ? currentVerses.map(verse => (
          <p key={verse.id} style={{ marginBottom: '20px' }}>
            <strong style={{ 
              backgroundColor: '#ffc107', 
              padding: '4px 10px', 
              borderRadius: '50%', 
              marginRight: '12px',
              color: '#fff',
              display: 'inline-block'
            }}>
              {verse.verse}
            </strong> 
            {verse.text}
          </p>
        )) : <p>Loading the story...</p>}
      </div>

      {/* Page Flipping Controls */}
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