import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

const bibleBooks = [
  { name: "Genesis", value: "Ge" }, { name: "Exodus", value: "Exo" }, { name: "Leviticus", value: "Lev" },
  { name: "Numbers", value: "Num" }, { name: "Deuteronomy", value: "Deu" }, { name: "Joshua", value: "Jos" },
  { name: "Judges", value: "Jdg" }, { name: "Ruth", value: "Rut" }, { name: "1 Samuel", value: "1Sa" },
  { name: "2 Samuel", value: "2Sa" }, { name: "1 Kings", value: "1Ki" }, { name: "2 Kings", value: "2Ki" },
  { name: "1 Chronicles", value: "1Ch" }, { name: "2 Chronicles", value: "2Ch" }, { name: "Ezra", value: "Ezr" },
  { name: "Nehemiah", value: "Neh" }, { name: "Esther", value: "Est" }, { name: "Job", value: "Job" },
  { name: "Psalms", value: "Psa" }, { name: "Proverbs", value: "Pro" }, { name: "Ecclesiastes", value: "Ecc" },
  { name: "Song of Solomon", value: "Sng" }, { name: "Isaiah", value: "Isa" }, { name: "Jeremiah", value: "Jer" },
  { name: "Lamentations", value: "Lam" }, { name: "Ezekiel", value: "Eze" }, { name: "Daniel", value: "Dan" },
  { name: "Hosea", value: "Hos" }, { name: "Joel", value: "Joe" }, { name: "Amos", value: "Amo" },
  { name: "Obadiah", value: "Oba" }, { name: "Jonah", value: "Jon" }, { name: "Micah", value: "Mic" },
  { name: "Nahum", value: "Nah" }, { name: "Habakkuk", value: "Hab" }, { name: "Zephaniah", value: "Zep" },
  { name: "Haggai", value: "Hag" }, { name: "Zechariah", value: "Zec" }, { name: "Malachi", value: "Mal" },
  { name: "Matthew", value: "Mat" }, { name: "Mark", value: "Mar" }, { name: "Luke", value: "Luk" },
  { name: "John", value: "Joh" }, { name: "Acts", value: "Act" }, { name: "Romans", value: "Rom" },
  { name: "1 Corinthians", value: "1Co" }, { name: "2 Corinthians", value: "2Co" }, { name: "Galatians", value: "Gal" },
  { name: "Ephesians", value: "Eph" }, { name: "Philippians", value: "Php" }, { name: "Colossians", value: "Col" },
  { name: "1 Thessalonians", value: "1Th" }, { name: "2 Thessalonians", value: "2Th" }, { name: "1 Timothy", value: "1Ti" },
  { name: "2 Timothy", value: "2Ti" }, { name: "Titus", value: "Tit" }, { name: "Philemon", value: "Phm" },
  { name: "Hebrews", value: "Heb" }, { name: "James", value: "Jas" }, { name: "1 Peter", value: "1Pe" },
  { name: "2 Peter", value: "2Pe" }, { name: "1 John", value: "1Jo" }, { name: "2 John", value: "2Jo" },
  { name: "3 John", value: "3Jo" }, { name: "Jude", value: "Jud" }, { name: "Revelation", value: "Rev" }
];

const BibleReader = ({ book = 'Ge', chapter = 1, session, openAuthModal }) => {
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

  const displayBookName = bibleBooks.find(b => b.value === currentBook)?.name || currentBook;

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
      user_id: session.user.id,
      book_name: displayBookName,
      chapter: currentChapter,
      verse: verse.verse,
      verse_text: verse.text
    }]);

    if (!error) alert("Saved to your collection! ⭐");
    else alert("Error saving bookmark.");
  };

  const markChapterComplete = async () => {
    if (!session) return openAuthModal();

    const { error } = await supabase.from('reading_progress').insert([{
      user_id: session.user.id,
      book_name: displayBookName,
      chapter: currentChapter
    }]);

    if (!error || error.code === '23505') alert(`Chapter Finished! Great job! 🥳`);
  };

  return (
    <div className="card" style={{ backgroundColor: '#fff', border: '5px solid #8c9eff', borderRadius: '25px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f4ff', padding: '15px 25px', borderRadius: '20px', marginBottom: '25px', border: '3px dashed #b39ddb' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>📚</span>
            <select 
              value={currentBook} 
              onChange={(e) => setCurrentBook(e.target.value)}
              style={{ padding: '10px 20px', borderRadius: '25px', border: '3px solid #ff4081', backgroundColor: '#fce4ec', color: '#c2185b', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', outline: 'none', boxShadow: '0 4px 0 #ff4081' }}
            >
              {bibleBooks.map(b => (
                <option key={b.value} value={b.value}>{b.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔢</span>
            <input 
              type="number" min="1" max="150" 
              value={currentChapter} 
              onChange={(e) => setCurrentChapter(parseInt(e.target.value) || 1)}
              style={{ padding: '10px 15px', borderRadius: '25px', border: '3px solid #ff9800', backgroundColor: '#fff3e0', color: '#e65100', fontWeight: '900', fontSize: '1.1rem', width: '80px', outline: 'none', textAlign: 'center', boxShadow: '0 4px 0 #ff9800' }}
            />
          </div>
        </div>
        <div style={{ backgroundColor: '#bbdefb', color: '#1565c0', padding: '8px 15px', borderRadius: '20px', fontWeight: '900', border: '2px solid #64b5f6' }}>
          Page {currentPage} of {totalPages || 1}
        </div>
      </div>
      
      <h2 style={{ color: '#3f51b5', margin: '0 0 20px 0', fontSize: '2rem', textAlign: 'center' }}>
        {displayBookName} (Chapter {currentChapter})
      </h2>
      
      <div style={{ marginBottom: '25px', display: 'flex', gap: '15px' }}>
        <button onClick={handleReadAloud} disabled={isSpeaking || verses.length === 0} style={{ backgroundColor: '#00e676', boxShadow: '0 6px 0 #00c853', flex: 1, borderRadius: '20px', fontSize: '1.2rem', padding: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>🔊 Read Aloud</button>
        <button onClick={handleStop} disabled={!isSpeaking} style={{ backgroundColor: '#ff5252', boxShadow: '0 6px 0 #d50000', flex: 1, borderRadius: '20px', fontSize: '1.2rem', padding: '15px', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>⏹️ Stop</button>
      </div>

      <div style={{ backgroundColor: '#fffdf0', border: '3px solid #ffe082', borderRadius: '20px', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.05)', minHeight: '300px', padding: '30px' }}>
        {verses.length > 0 ? currentVerses.map(verse => (
          <div key={verse.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px' }}>
            <button 
              onClick={() => handleBookmark(verse)}
              style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '10px', marginTop: '-2px' }}
              title="Bookmark this verse"
            >⭐</button>
            <p style={{ margin: 0, fontSize: '1.3rem', lineHeight: '1.8', color: '#424242' }}>
              <span style={{ backgroundColor: '#ffb74d', color: '#fff', borderRadius: '50%', width: '35px', height: '35px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', marginRight: '12px', fontSize: '1rem', boxShadow: '0 3px 0 #f57c00' }}>
                {verse.verse}
              </span> 
              {verse.text}
            </p>
          </div>
        )) : (
          <div style={{ textAlign: 'center', color: '#9e9e9e', paddingTop: '50px' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🤔</span>
            <h3>Loading the story...</h3>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px', gap: '15px' }}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} style={{ backgroundColor: '#29b6f6', boxShadow: '0 6px 0 #0288d1', borderRadius: '20px', padding: '12px 25px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>⬅️ Previous</button>
        <button onClick={markChapterComplete} style={{ backgroundColor: '#ffb74d', boxShadow: '0 6px 0 #f57c00', borderRadius: '20px', padding: '12px 25px', fontWeight: 'bold', border: 'none', cursor: 'pointer', flex: 1 }}>✅ Finished Chapter</button>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} style={{ backgroundColor: '#29b6f6', boxShadow: '0 6px 0 #0288d1', borderRadius: '20px', padding: '12px 25px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Next ➡️</button>
      </div>
    </div>
  );
};

export default BibleReader;