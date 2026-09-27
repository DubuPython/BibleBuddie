import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

const bibleBooks = [
  { name: "Genesis", value: "Genesis", chapters: 50 }, { name: "Exodus", value: "Exo", chapters: 40 }, 
  { name: "Leviticus", value: "Lev", chapters: 27 }, { name: "Numbers", value: "Num", chapters: 36 }, 
  { name: "Deuteronomy", value: "Deu", chapters: 34 }, { name: "Joshua", value: "Jos", chapters: 24 },
  { name: "Judges", value: "Jdg", chapters: 21 }, { name: "Ruth", value: "Rut", chapters: 4 }, 
  { name: "1 Samuel", value: "1Sa", chapters: 31 }, { name: "2 Samuel", value: "2Sa", chapters: 24 }, 
  { name: "1 Kings", value: "1Ki", chapters: 22 }, { name: "2 Kings", value: "2Ki", chapters: 25 },
  { name: "1 Chronicles", value: "1Ch", chapters: 29 }, { name: "2 Chronicles", value: "2Ch", chapters: 36 }, 
  { name: "Ezra", value: "Ezr", chapters: 10 }, { name: "Nehemiah", value: "Neh", chapters: 13 }, 
  { name: "Esther", value: "Est", chapters: 10 }, { name: "Job", value: "Job", chapters: 42 },
  { name: "Psalms", value: "Psa", chapters: 150 }, { name: "Proverbs", value: "Pro", chapters: 31 }, 
  { name: "Ecclesiastes", value: "Ecc", chapters: 12 }, { name: "Song of Solomon", value: "Sng", chapters: 8 }, 
  { name: "Isaiah", value: "Isa", chapters: 66 }, { name: "Jeremiah", value: "Jer", chapters: 52 },
  { name: "Lamentations", value: "Lam", chapters: 5 }, { name: "Ezekiel", value: "Eze", chapters: 48 }, 
  { name: "Daniel", value: "Dan", chapters: 12 }, { name: "Hosea", value: "Hos", chapters: 14 }, 
  { name: "Joel", value: "Joe", chapters: 3 }, { name: "Amos", value: "Amo", chapters: 9 },
  { name: "Obadiah", value: "Oba", chapters: 1 }, { name: "Jonah", value: "Jon", chapters: 4 }, 
  { name: "Micah", value: "Mic", chapters: 7 }, { name: "Nahum", value: "Nah", chapters: 3 }, 
  { name: "Habakkuk", value: "Hab", chapters: 3 }, { name: "Zephaniah", value: "Zep", chapters: 3 },
  { name: "Haggai", value: "Hag", chapters: 2 }, { name: "Zechariah", value: "Zec", chapters: 14 }, 
  { name: "Malachi", value: "Mal", chapters: 4 }, { name: "Matthew", value: "Mat", chapters: 28 }, 
  { name: "Mark", value: "Mar", chapters: 16 }, { name: "Luke", value: "Luk", chapters: 24 },
  { name: "John", value: "Joh", chapters: 21 }, { name: "Acts", value: "Act", chapters: 28 }, 
  { name: "Romans", value: "Rom", chapters: 16 }, { name: "1 Corinthians", value: "1Co", chapters: 16 }, 
  { name: "2 Corinthians", value: "2Co", chapters: 13 }, { name: "Galatians", value: "Gal", chapters: 6 },
  { name: "Ephesians", value: "Eph", chapters: 6 }, { name: "Philippians", value: "Php", chapters: 4 }, 
  { name: "Colossians", value: "Col", chapters: 4 }, { name: "1 Thessalonians", value: "1Th", chapters: 5 }, 
  { name: "2 Thessalonians", value: "2Th", chapters: 3 }, { name: "1 Timothy", value: "1Ti", chapters: 6 },
  { name: "2 Timothy", value: "2Ti", chapters: 4 }, { name: "Titus", value: "Tit", chapters: 3 }, 
  { name: "Philemon", value: "Phm", chapters: 1 }, { name: "Hebrews", value: "Heb", chapters: 13 }, 
  { name: "James", value: "Jas", chapters: 5 }, { name: "1 Peter", value: "1Pe", chapters: 5 },
  { name: "2 Peter", value: "2Pe", chapters: 3 }, { name: "1 John", value: "1Jo", chapters: 5 }, 
  { name: "2 John", value: "2Jo", chapters: 1 }, { name: "3 John", value: "3Jo", chapters: 1 }, 
  { name: "Jude", value: "Jud", chapters: 1 }, { name: "Revelation", value: "Rev", chapters: 22 }
];

// CRITICAL FIX: The default prop must be 'Genesis' to match the array value, preventing initial load crashes.
const BibleReader = ({ book = 'Genesis', chapter = 1, session, openAuthModal, isDarkMode }) => {
  const [verses, setVerses] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentBook, setCurrentBook] = useState(book);
  const [currentChapter, setCurrentChapter] = useState(chapter);
  const [currentPage, setCurrentPage] = useState(1);
  const versesPerPage = 4;

  // 60-30-10 Theme Palette for Reader
  const theme = {
    surface: isDarkMode ? '#1E1E1E' : '#FFFFFF', // 30% Secondary
    accent: isDarkMode ? '#FFB74D' : '#FF9800',  // 10% Primary Accent
    readBg: isDarkMode ? '#4DB6AC' : '#00E676',  // 10% Read Button
    stopBg: isDarkMode ? '#E57373' : '#FF5252',  // 10% Stop Button
    text: isDarkMode ? '#E0E0E0' : '#333333',
    border: isDarkMode ? '#333333' : '#C5CAE9',
    storyBg: isDarkMode ? '#2C2C2C' : '#FDFBF7'
  };

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    axios.get(`${apiUrl}/api/bible/${currentBook}/${currentChapter}`)
      .then(response => {
        setVerses(response.data);
        setCurrentPage(1); 
      })
      .catch(error => console.error("Error fetching Bible data", error));
  }, [currentBook, currentChapter]);

  const totalPages = Math.ceil(verses.length / versesPerPage) || 1;
  const indexOfLastVerse = currentPage * versesPerPage;
  const indexOfFirstVerse = indexOfLastVerse - versesPerPage;
  const currentVerses = verses.slice(indexOfFirstVerse, indexOfLastVerse);

  const currentBookObj = bibleBooks.find(b => b.value === currentBook);
  const displayBookName = currentBookObj?.name || currentBook;

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

  const handleBookmark = async (verse) => {
    if (!session) return openAuthModal();
    const { error } = await supabase.from('bookmarks').insert([{
      user_id: session.user.id, book_name: displayBookName, chapter: parseInt(currentChapter),
      verse: parseInt(verse.verse), verse_text: verse.text
    }]);
    if (!error) alert("Saved to your collection! ⭐");
    else alert(`Error saving bookmark: ${error.message}`);
  };

  const handleContinuousReading = async () => {
    handleStop();
    if (session) {
      await supabase.from('reading_progress').insert([{ user_id: session.user.id, book_name: displayBookName, chapter: parseInt(currentChapter) }]);
    }
    const currentBookIndex = bibleBooks.findIndex(b => b.value === currentBook);
    if (parseInt(currentChapter) < currentBookObj.chapters) {
      setCurrentChapter(parseInt(currentChapter) + 1);
    } else if (currentBookIndex < bibleBooks.length - 1) {
      setCurrentBook(bibleBooks[currentBookIndex + 1].value);
      setCurrentChapter(1);
    } else {
      alert("🎉 You have finished the entire Bible! 🎉");
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      handleStop();
      setCurrentPage(currentPage + 1);
    } else {
      handleContinuousReading();
    }
  };

  let nextButtonText = "Next Page ➡️";
  if (currentPage === totalPages) {
    nextButtonText = parseInt(currentChapter) < currentBookObj?.chapters ? "Next Chapter ➡️" : "Next Book ➡️";
  }

  return (
    <div className="card" style={{ backgroundColor: theme.surface, border: `3px solid ${theme.border}`, borderRadius: '25px', padding: '20px', transition: 'all 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.storyBg, padding: '15px 25px', borderRadius: '20px', marginBottom: '25px', border: `2px dashed ${theme.border}` }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span>
            <select value={currentBook} onChange={(e) => { setCurrentBook(e.target.value); setCurrentChapter(1); }} style={{ padding: '10px 20px', borderRadius: '25px', border: `2px solid ${theme.accent}`, backgroundColor: theme.surface, color: theme.text, fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', outline: 'none' }}>
              {bibleBooks.map(b => ( <option key={b.value} value={b.value}>{b.name}</option> ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔢</span>
            <input type="number" min="1" max={currentBookObj?.chapters || 150} value={currentChapter} onChange={(e) => { let ch = parseInt(e.target.value) || 1; if (ch > currentBookObj.chapters) ch = currentBookObj.chapters; setCurrentChapter(ch); }} style={{ padding: '10px 15px', borderRadius: '25px', border: `2px solid ${theme.accent}`, backgroundColor: theme.surface, color: theme.text, fontWeight: '900', fontSize: '1.1rem', width: '80px', outline: 'none', textAlign: 'center' }} />
          </div>
        </div>
        <div style={{ backgroundColor: theme.accent, color: isDarkMode ? '#121212' : '#fff', padding: '8px 15px', borderRadius: '20px', fontWeight: '900' }}>
          Page {currentPage} of {totalPages}
        </div>
      </div>
      
      <h2 style={{ color: theme.text, margin: '0 0 20px 0', fontSize: '2rem', textAlign: 'center' }}>
        {displayBookName} (Chapter {currentChapter})
      </h2>
      
      <div style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
        <button onClick={handleReadAloud} disabled={isSpeaking || verses.length === 0} style={{ backgroundColor: theme.readBg, color: isDarkMode ? '#000' : '#fff', flex: 1, borderRadius: '20px', fontSize: '1.2rem', padding: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>🔊 Read Aloud</button>
        <button onClick={handleStop} disabled={!isSpeaking} style={{ backgroundColor: theme.stopBg, color: '#fff', flex: 1, borderRadius: '20px', fontSize: '1.2rem', padding: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>⏹️ Stop</button>
      </div>

      <div style={{ backgroundColor: theme.storyBg, border: `2px solid ${theme.border}`, borderRadius: '20px', minHeight: '300px', padding: '30px' }}>
        {verses.length > 0 ? currentVerses.map(verse => (
          <div key={verse.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px' }}>
            <button onClick={() => handleBookmark(verse)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '10px', marginTop: '-2px' }} title="Bookmark this verse">⭐</button>
            <p style={{ margin: 0, fontSize: '1.3rem', lineHeight: '1.8', color: theme.text }}>
              <span style={{ backgroundColor: theme.accent, color: isDarkMode ? '#121212' : '#fff', borderRadius: '50%', width: '35px', height: '35px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginRight: '12px', fontSize: '1rem' }}>
                {verse.verse}
              </span> 
              {verse.text}
            </p>
          </div>
        )) : (
          <div style={{ textAlign: 'center', color: theme.text, paddingTop: '50px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🤔</span>
            <h3>Loading the story...</h3>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', gap: '15px' }}>
        <button onClick={() => { handleStop(); setCurrentPage(currentPage - 1); }} disabled={currentPage === 1} style={{ backgroundColor: theme.surface, color: theme.text, border: `2px solid ${theme.border}`, borderRadius: '20px', padding: '12px 25px', fontWeight: 'bold', cursor: 'pointer' }}>
          ⬅️ Previous Page
        </button>
        <button onClick={nextPage} style={{ backgroundColor: theme.accent, color: isDarkMode ? '#121212' : '#fff', border: 'none', borderRadius: '20px', padding: '12px 25px', fontWeight: 'bold', cursor: 'pointer', flex: 1 }}>
          {nextButtonText}
        </button>
      </div>
    </div>
  );
};

export default BibleReader;