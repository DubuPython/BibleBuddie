import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Profile = ({ session, openAuthModal, isDarkMode }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const totalChapters = 1189;

  const theme = {
    surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#E0E0E0' : '#333333',
    border: isDarkMode ? '#333333' : '#C5CAE9',
    accent: isDarkMode ? '#FFB74D' : '#FF9800',
    cardBg: isDarkMode ? '#2C2C2C' : '#F0F4FF'
  };

  useEffect(() => {
    if (session) fetchData(session.user.id);
  }, [session]);

  const fetchData = async (userId) => {
    const { data: bData } = await supabase.from('bookmarks').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (bData) setBookmarks(bData);

    const { count } = await supabase.from('reading_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    if (count !== null) setReadCount(count);
  };

  const deleteBookmark = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id);
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  if (!session) {
    return (
      <div className="card" style={{ backgroundColor: theme.surface, border: `3px solid ${theme.border}`, borderRadius: '25px', padding: '40px', textAlign: 'center', marginTop: '20px' }}>
        <span style={{ fontSize: '4rem', display: 'block', marginBottom: '10px' }}>🕵️‍♂️</span>
        <h2 style={{ color: theme.text, marginBottom: '15px' }}>You are browsing as a Guest!</h2>
        <p style={{ fontSize: '1.2rem', color: theme.text, marginBottom: '25px' }}>Create an account to track your reading progress and save your favorite verses.</p>
        <button onClick={openAuthModal} style={{ backgroundColor: theme.accent, padding: '15px 30px', fontSize: '1.2rem', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', color: isDarkMode ? '#121212' : '#fff' }}>✨ Log In / Sign Up</button>
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((readCount / totalChapters) * 100));
  const displayName = session.user.user_metadata?.username || "Reader";

  return (
    <div>
      <h1 style={{ color: theme.text, textAlign: 'center', marginBottom: '30px' }}>Hello, {displayName}! 👋</h1>
      <div className="card" style={{ backgroundColor: theme.surface, border: `3px solid ${theme.border}`, borderRadius: '25px', padding: '30px', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: theme.accent, margin: 0 }}>🏆 My Reading Journey</h2>
          <button onClick={() => supabase.auth.signOut()} style={{ backgroundColor: isDarkMode ? '#E57373' : '#FF5252', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>Log Out</button>
        </div>
        <p style={{ fontSize: '1.2rem', color: theme.text, fontWeight: 'bold' }}>Chapters Completed: {readCount} / {totalChapters}</p>
        <div style={{ width: '100%', backgroundColor: theme.cardBg, borderRadius: '20px', height: '35px', overflow: 'hidden', border: `2px solid ${theme.border}` }}>
          <div style={{ width: `${progressPercentage}%`, backgroundColor: theme.accent, height: '100%', transition: 'width 0.5s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDarkMode ? '#121212' : '#fff', fontWeight: '900', fontSize: '1.1rem' }}>
            {progressPercentage > 4 ? `${progressPercentage}%` : ''}
          </div>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: theme.surface, border: `3px solid ${theme.border}`, borderRadius: '25px', padding: '30px' }}>
        <h2 style={{ color: theme.text, margin: '0 0 20px 0' }}>⭐ My Bookmark Collection</h2>
        {bookmarks.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {bookmarks.map(b => (
              <div key={b.id} style={{ backgroundColor: theme.cardBg, padding: '20px', borderRadius: '15px', border: `2px dashed ${theme.border}`, position: 'relative' }}>
                <button onClick={() => deleteBookmark(b.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: isDarkMode ? '#E57373' : '#FF5252', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
                <h4 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '1.2rem' }}>{b.book_name} {b.chapter}:{b.verse}</h4>
                <p style={{ margin: 0, fontStyle: 'italic', color: theme.text, fontSize: '1.1rem', lineHeight: '1.5' }}>"{b.verse_text}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: theme.text, fontSize: '1.2rem' }}>You haven't bookmarked any verses yet!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;