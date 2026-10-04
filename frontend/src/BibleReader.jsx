import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { supabase } from './supabaseClient';

import idleFace from './idle-face.png';
import talkingFace from './talking-face.mp4';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  
  const [currentBook, setCurrentBook] = useState(() => localStorage.getItem('last_book') || book);
  const [currentChapter, setCurrentChapter] = useState(() => parseInt(localStorage.getItem('last_chapter')) || chapter);
  
  const [bookmarkedVerses, setBookmarkedVerses] = useState([]);
  const [hasCompletedChapter, setHasCompletedChapter] = useState(false);
  const [customModal, setCustomModal] = useState({ show: false, title: '', message: '' });

  const [showCanvas, setShowCanvas] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF5252');

  const scrollRef = useRef(null);
  const currentBookObj = bibleBooks.find(b => b.value === currentBook);
  const displayBookName = currentBookObj?.name || currentBook;

  useEffect(() => {
    localStorage.setItem('last_book', currentBook);
    localStorage.setItem('last_chapter', currentChapter.toString());

    const fetchChapterData = async () => {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      try {
        const response = await axios.get(`${apiUrl}/api/bible/${currentBook}/${currentChapter}`);
        setVerses(response.data);
      } catch (err) { console.error(err); }

      if (session) {
        const { data } = await supabase.from('bookmarks').select('verse').eq('user_id', session.user.id).eq('book_name', displayBookName).eq('chapter', currentChapter);
        if (data) setBookmarkedVerses(data.map(b => b.verse));
      }
      
      setHasCompletedChapter(false);
      setShowCanvas(false);
      setSearchQuery('');
      setMediaError(false); 
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    };
    
    fetchChapterData();
  }, [currentBook, currentChapter, session, displayBookName]);

  const displayedVerses = verses.filter(v => v.text.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleScroll = async (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
    if (bottom && !hasCompletedChapter && session) {
      setHasCompletedChapter(true);
      await supabase.from('reading_progress').insert([{ user_id: session.user.id, book_name: displayBookName, chapter: parseInt(currentChapter) }]);
      
      const today = new Date().toLocaleDateString('en-CA');
      const { data: stats } = await supabase.from('user_stats').select('*').eq('user_id', session.user.id).single();
      let currentStreak = 1;
      
      if (!stats) {
        await supabase.from('user_stats').insert([{ user_id: session.user.id, streak_count: 1, last_read: today }]);
      } else if (stats.last_read !== today) {
        const diffDays = Math.ceil(Math.abs(new Date(today) - new Date(stats.last_read)) / (1000 * 60 * 60 * 24));
        currentStreak = (diffDays === 1) ? stats.streak_count + 1 : 1;
        await supabase.from('user_stats').update({ streak_count: currentStreak, last_read: today }).eq('user_id', session.user.id);
      } else {
        currentStreak = stats.streak_count;
      }

      setCustomModal({ show: true, title: '🎉 Chapter Finished!', message: `Great job! You are on a ${currentStreak} day reading streak! 🔥` });
    }
  };

  const handleBookmark = async (verse) => {
    if (!session) return openAuthModal();
    if (bookmarkedVerses.includes(verse.verse)) {
      setCustomModal({ show: true, title: 'Already Saved!', message: 'This verse is already in your bookmark collection.' });
      return;
    }
    const { error } = await supabase.from('bookmarks').insert([{ user_id: session.user.id, book_name: displayBookName, chapter: parseInt(currentChapter), verse: parseInt(verse.verse), verse_text: verse.text }]);
    if (!error) {
      setBookmarkedVerses([...bookmarkedVerses, verse.verse]);
      setCustomModal({ show: true, title: '⭐ Saved!', message: 'Verse successfully added to your collection.' });
    }
  };

  const nextChapter = () => {
    handleStop();
    const currentBookIndex = bibleBooks.findIndex(b => b.value === currentBook);
    if (parseInt(currentChapter) < currentBookObj.chapters) {
      setCurrentChapter(parseInt(currentChapter) + 1);
    } else if (currentBookIndex < bibleBooks.length - 1) {
      setCurrentBook(bibleBooks[currentBookIndex + 1].value);
      setCurrentChapter(1);
    }
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const pageText = displayedVerses.map(v => v.text).join(' ');
      const utterance = new SpeechSynthesisUtterance(pageText);
      utterance.rate = 0.95; 
      utterance.pitch = 1.6; 
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };
  const stopDrawing = () => {
    setIsDrawing(false);
    canvasRef.current.getContext('2d').beginPath();
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const inputStyle = { padding: '12px', borderRadius: '15px', border: `3px solid ${theme.accent}`, backgroundColor: theme.inputBg, color: theme.pageText, fontSize: '1rem', fontWeight: 'bold', outline: 'none' };

  return (
    <div className="reader-wrapper" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '25px', padding: '20px' }}>
      
      {customModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '25px', padding: '30px', textAlign: 'center', maxWidth: '350px' }}>
            <h2 style={{ color: theme.text, marginTop: 0 }}>{customModal.title}</h2>
            <p style={{ color: theme.text, fontSize: '1.2rem', marginBottom: '25px' }}>{customModal.message}</p>
            <button onClick={() => setCustomModal({ show: false, title: '', message: '' })} style={{ backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', border: 'none', padding: '12px 25px', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', width: '100%' }}>Awesome!</button>
          </div>
        </div>
      )}

      <div className="reader-controls" style={{ display: 'flex', gap: '15px', backgroundColor: theme.inputBg, padding: '15px', borderRadius: '20px', marginBottom: '15px', border: `3px dashed ${theme.accent}`, flexShrink: 0 }}>
        <select value={currentBook} onChange={(e) => { setCurrentBook(e.target.value); setCurrentChapter(1); }} style={inputStyle}>
          {bibleBooks.map(b => ( <option key={b.value} value={b.value}>{b.name}</option> ))}
        </select>
        <input type="number" min="1" max={currentBookObj?.chapters || 150} value={currentChapter} onChange={(e) => { let ch = parseInt(e.target.value) || 1; setCurrentChapter(ch > currentBookObj.chapters ? currentBookObj.chapters : ch); }} style={{ ...inputStyle, width: '70px', textAlign: 'center' }} />
        <input type="text" placeholder="🔍 Search this chapter..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexShrink: 0 }}>
        <button onClick={handleReadAloud} disabled={isSpeaking || verses.length === 0} style={{ flex: 1, backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', borderRadius: '15px', padding: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>🔊 Read Aloud</button>
        <button onClick={handleStop} disabled={!isSpeaking} style={{ flex: 1, backgroundColor: theme.inputBg, color: theme.pageText, borderRadius: '15px', border: `3px solid ${theme.accent}`, padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}>⏹️ Stop</button>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="verses-scroll-area" style={{ flex: 1, overflowY: 'auto', backgroundColor: theme.inputBg, border: `4px solid ${theme.accent}`, borderRadius: '20px', padding: '25px', minHeight: 0 }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: `4px solid ${theme.accent}`, backgroundColor: theme.surface, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {mediaError ? (
              <span style={{ fontSize: '3rem' }}>👦</span>
            ) : isSpeaking ? (
              <video 
                src={talkingFace}
                autoPlay 
                loop 
                muted 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={() => setMediaError(true)}
              />
            ) : (
              <img 
                src={idleFace}
                alt="Narrator" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                onError={() => setMediaError(true)}
              />
            )}

          </div>
        </div>

        <h2 style={{ color: theme.pageText, margin: '0 0 25px 0', fontSize: '2rem', textAlign: 'center' }}>{displayBookName} {currentChapter}</h2>

        {displayedVerses.length > 0 ? displayedVerses.map(verse => {
          const isBookmarked = bookmarkedVerses.includes(verse.verse);
          return (
            <div key={verse.id} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '25px' }}>
              <button onClick={() => handleBookmark(verse)} style={{ background: 'none', border: 'none', color: theme.accent, cursor: 'pointer', marginRight: '15px', padding: 0 }} title="Bookmark this verse">
                <svg width="28" height="28" viewBox="0 0 24 24" fill={isBookmarked ? theme.accent : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </button>
              <p style={{ margin: 0, fontSize: '1.2rem', lineHeight: '1.8', color: theme.pageText }}>
                <span style={{ backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', borderRadius: '50%', width: '35px', height: '35px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginRight: '12px' }}>
                  {verse.verse}
                </span> 
                {verse.text}
              </p>
            </div>
          );
        }) : (
          <p style={{ textAlign: 'center', color: theme.pageText, fontSize: '1.2rem' }}>No verses found.</p>
        )}
        
        {verses.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
            <button onClick={() => setShowCanvas(!showCanvas)} style={{ backgroundColor: theme.inputBg, color: theme.pageText, border: `3px dashed ${theme.accent}`, borderRadius: '25px', padding: '15px 30px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', marginBottom: '20px', width: '100%' }}>
              🎨 {showCanvas ? 'Close Canvas' : 'Color a Picture!'}
            </button>

            {showCanvas && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: `4px solid ${theme.accent}`, padding: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
                  {['#FF5252', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#000000'].map(c => (
                    <button key={c} onClick={() => setColor(c)} style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: c, border: color === c ? '3px solid #000' : 'none', cursor: 'pointer' }} />
                  ))}
                  <button onClick={clearCanvas} style={{ marginLeft: '10px', padding: '5px 15px', borderRadius: '10px', border: 'none', backgroundColor: '#e0e0e0', fontWeight: 'bold', cursor: 'pointer' }}>Clear</button>
                </div>
                <canvas 
                  ref={canvasRef}
                  width={500} 
                  height={300} 
                  style={{ border: '2px dashed #ccc', borderRadius: '10px', backgroundColor: '#fff', cursor: 'crosshair', maxWidth: '100%' }}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onMouseMove={draw}
                />
              </div>
            )}

            <button onClick={nextChapter} style={{ backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', border: 'none', borderRadius: '25px', padding: '15px 30px', fontWeight: '900', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.2)', width: '100%' }}>
              Continue to Next Chapter ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleReader;