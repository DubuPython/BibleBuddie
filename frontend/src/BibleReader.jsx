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

const BibleReader = ({ book = 'Genesis', chapter = 1, session, openAuthModal, theme, isDarkMode }) => {
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
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
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
    if (!error) alert("Saved to your collection!");
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

  // Reusable bubbly input styling
  const inputStyle = {
    padding: '12px 20px', borderRadius: '20px', border: `3px solid ${theme.accent}`,
    backgroundColor: theme.inputBg, color: isDarkMode ? '#ffffff' : '#365263', 
    fontSize: '1.2rem', fontWeight: '900', outline: 'none', boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '35px', padding: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
      
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.inputBg, padding: '20px', borderRadius: '25px', marginBottom: '30px', border: `3px dashed ${theme.accent}` }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={currentBook} onChange={(e) => { setCurrentBook(e.target.value); setCurrentChapter(1); }} style={inputStyle}>
            {bibleBooks.map(b => ( <option key={b.value} value={b.value}>{b.name}</option> ))}
          </select>
          <input type="number" min="1" max={currentBookObj?.chapters || 150} value={currentChapter} onChange={(e) => { let ch = parseInt(e.target.value) || 1; setCurrentChapter(ch > currentBookObj.chapters ? currentBookObj.chapters : ch); }} style={{ ...inputStyle, width: '90px', textAlign: 'center' }} />
        </div>
        <div style={{ backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', padding: '10px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '1.2rem' }}>
          Page {currentPage} of {totalPages}
        </div>
      </div>
      
      <h2 style={{ color: theme.text, margin: '0 0 25px 0', fontSize: '2.5rem', textAlign: 'center', fontWeight: '900' }}>{displayBookName} {currentChapter}</h2>
      
      <div style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
        <button onClick={handleReadAloud} disabled={isSpeaking || verses.length === 0} style={{ flex: 1, backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', borderRadius: '25px', fontSize: '1.3rem', padding: '15px', fontWeight: '900', border: 'none', cursor: 'pointer', boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
          <svg style={{ verticalAlign: 'middle', marginRight: '8px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Read Aloud
        </button>
        <button onClick={handleStop} disabled={!isSpeaking} style={{ flex: 1, backgroundColor: theme.inputBg, color: isDarkMode ? '#ffffff' : '#365263', borderRadius: '25px', border: `4px solid ${theme.accent}`, fontSize: '1.3rem', padding: '15px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 6px 0 rgba(0,0,0,0.1)' }}>
          <svg style={{ verticalAlign: 'middle', marginRight: '8px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> Stop
        </button>
      </div>

      <div style={{ backgroundColor: theme.inputBg, border: `4px solid ${theme.accent}`, borderRadius: '25px', minHeight: '300px', padding: '35px', marginBottom: '30px' }}>
        {verses.length > 0 ? currentVerses.map(verse => (
          <div key={verse.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '30px' }}>
            <button onClick={() => handleBookmark(verse)} style={{ background: 'none', border: 'none', color: theme.accent, cursor: 'pointer', marginRight: '15px', marginTop: '2px', padding: 0 }} title="Bookmark this verse">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </button>
            <p style={{ margin: 0, fontSize: '1.3rem', lineHeight: '1.8', color: isDarkMode ? '#ffffff' : '#365263', fontWeight: '600' }}>
              <span style={{ backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', borderRadius: '50%', width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginRight: '15px', fontSize: '1.1rem' }}>
                {verse.verse}
              </span> 
              {verse.text}
            </p>
          </div>
        )) : (
          <p style={{ textAlign: 'center', color: isDarkMode ? '#ffffff' : '#365263', paddingTop: '50px', fontSize: '1.5rem', fontWeight: 'bold' }}>Loading text...</p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <button onClick={() => { handleStop(); setCurrentPage(currentPage - 1); }} disabled={currentPage === 1} style={{ backgroundColor: theme.inputBg, color: isDarkMode ? '#ffffff' : '#365263', border: `4px solid ${theme.accent}`, borderRadius: '25px', padding: '15px 30px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 rgba(0,0,0,0.1)' }}>
          ⬅️ Previous Page
        </button>
        <button onClick={nextPage} style={{ flex: 1, backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', border: 'none', borderRadius: '25px', padding: '15px 30px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
          {currentPage === totalPages ? (parseInt(currentChapter) < currentBookObj?.chapters ? "Next Chapter ➡️" : "Next Book ➡️") : "Next Page ➡️"}
        </button>
      </div>
    </div>
  );
};

export default BibleReader;