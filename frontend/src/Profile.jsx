import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Profile = ({ session, openAuthModal, theme, isDarkMode }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Prayer Board State
  const [prayers, setPrayers] = useState(() => {
    const saved = localStorage.getItem('prayer_board');
    return saved ? JSON.parse(saved) : [{ id: 1, text: "In loving memory of Sarino 🐾", date: new Date().toLocaleDateString() }];
  });
  const [newPrayer, setNewPrayer] = useState("");

  const totalChapters = 1189;
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const { data: bData } = await supabase.from('bookmarks').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (bData) setBookmarks(bData);
    
        const { count } = await supabase.from('reading_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId);
        if (count !== null) setReadCount(count);

        const { data: sData } = await supabase.from('user_stats').select('streak_count').eq('user_id', userId).single();
        if (sData) setStreak(sData.streak_count);
      };
      fetchData();
    }
  }, [userId]);

  const deleteBookmark = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id);
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const addPrayer = () => {
    if (!newPrayer.trim()) return;
    const updatedPrayers = [{ id: Date.now(), text: newPrayer, date: new Date().toLocaleDateString() }, ...prayers];
    setPrayers(updatedPrayers);
    localStorage.setItem('prayer_board', JSON.stringify(updatedPrayers));
    setNewPrayer("");
  };

  const deletePrayer = (id) => {
    const updated = prayers.filter(p => p.id !== id);
    setPrayers(updated);
    localStorage.setItem('prayer_board', JSON.stringify(updated));
  };

  if (!session) {
    return (
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '35px', padding: '50px', textAlign: 'center' }}>
          <h2 style={{ color: theme.text, marginBottom: '20px', fontSize: '2.5rem', fontWeight: '900' }}>Guest Mode</h2>
          <p style={{ fontSize: '1.3rem', color: theme.text, marginBottom: '30px', fontWeight: '600' }}>Create an account to track your reading progress and save your favorite verses.</p>
          <button onClick={openAuthModal} style={{ backgroundColor: theme.accent, padding: '15px 35px', fontSize: '1.3rem', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '900', color: isDarkMode ? '#00263d' : '#ffffff', boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((readCount / totalChapters) * 100));
  const displayName = session.user.user_metadata?.username || "Reader";

  return (
    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <h1 style={{ color: theme.pageText, margin: 0, fontSize: '2.5rem', fontWeight: '900' }}>Hello, {displayName}!</h1>
        <div style={{ backgroundColor: theme.surface, border: `3px solid ${theme.accent}`, padding: '10px 20px', borderRadius: '20px', color: theme.text, fontWeight: '900', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          🔥 {streak} Day Streak
        </div>
      </div>
      
      {/* PRAYER & MEMORIAL BOARD */}
      <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '35px', padding: '35px', marginBottom: '35px' }}>
        <h2 style={{ color: theme.text, margin: '0 0 25px 0', fontSize: '2rem', fontWeight: '900' }}>🕯️ Virtual Prayer & Memorial Board</h2>
        
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <input 
            type="text" 
            placeholder="Write a prayer intention or memorial..." 
            value={newPrayer} 
            onChange={(e) => setNewPrayer(e.target.value)} 
            style={{ flex: 1, padding: '15px', borderRadius: '20px', border: `3px solid ${theme.accent}`, backgroundColor: theme.inputBg, color: theme.pageText, fontSize: '1.1rem', fontWeight: 'bold', outline: 'none' }}
          />
          <button onClick={addPrayer} style={{ backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', border: 'none', padding: '0 25px', borderRadius: '20px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 0 rgba(0,0,0,0.15)' }}>
            Light Candle
          </button>
        </div>

        <div style={{ display: 'grid', gap: '15px' }}>
          {prayers.map(prayer => (
            <div key={prayer.id} style={{ backgroundColor: theme.inputBg, padding: '20px', borderRadius: '20px', border: `2px dashed ${theme.accent}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', color: theme.pageText, fontSize: '1.2rem', fontWeight: 'bold' }}>🕯️ {prayer.text}</p>
                <small style={{ color: theme.accent, fontWeight: 'bold' }}>{prayer.date}</small>
              </div>
              <button onClick={() => deletePrayer(prayer.id)} style={{ background: 'none', border: 'none', color: isDarkMode ? '#ffffff' : '#365263', cursor: 'pointer', fontSize: '1.5rem' }}>✖</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '35px', padding: '35px', marginBottom: '35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: theme.text, margin: 0, fontSize: '2rem', fontWeight: '900' }}>Reading Journey</h2>
          <button onClick={() => supabase.auth.signOut()} style={{ backgroundColor: theme.inputBg, color: theme.pageText, border: `3px solid ${theme.accent}`, padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '900', fontSize: '1.1rem' }}>Log Out</button>
        </div>
        <p style={{ fontSize: '1.3rem', color: theme.text, marginBottom: '20px', fontWeight: 'bold' }}>Chapters Completed: {readCount} / {totalChapters}</p>
        <div style={{ width: '100%', backgroundColor: theme.inputBg, borderRadius: '20px', height: '35px', overflow: 'hidden', border: `3px solid ${theme.accent}` }}>
          <div style={{ width: `${progressPercentage}%`, backgroundColor: theme.accent, height: '100%', transition: 'width 0.5s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDarkMode ? '#00263d' : '#ffffff', fontWeight: '900', fontSize: '1.1rem' }}>
            {progressPercentage > 4 ? `${progressPercentage}%` : ''}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '35px', padding: '35px' }}>
        <h2 style={{ color: theme.text, margin: '0 0 25px 0', fontSize: '2rem', fontWeight: '900' }}>Bookmark Collection</h2>
        {bookmarks.length > 0 ? (
          <div style={{ display: 'grid', gap: '20px' }}>
            {bookmarks.map(b => (
              <div key={b.id} style={{ backgroundColor: theme.inputBg, padding: '25px', borderRadius: '25px', border: `3px solid ${theme.accent}`, position: 'relative' }}>
                <button onClick={() => deleteBookmark(b.id)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: theme.pageText, cursor: 'pointer' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h4 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '1.3rem', fontWeight: '900' }}>{b.book_name} {b.chapter}:{b.verse}</h4>
                <p style={{ margin: 0, color: theme.pageText, fontSize: '1.1rem', lineHeight: '1.6', fontWeight: '600' }}>"{b.verse_text}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: theme.text, fontSize: '1.2rem', fontWeight: 'bold' }}>No verses bookmarked yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;