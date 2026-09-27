import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Profile = ({ session, openAuthModal, theme, isDarkMode }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const totalChapters = 1189;

  // Extract the ID to prevent infinite re-fetching
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const { data: bData } = await supabase.from('bookmarks').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (bData) setBookmarks(bData);
    
        const { count } = await supabase.from('reading_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId);
        if (count !== null) setReadCount(count);
      };
      fetchData();
    }
  }, [userId]);

  const deleteBookmark = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id);
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  if (!session) {
    return (
      <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '35px', padding: '50px', textAlign: 'center' }}>
        <h2 style={{ color: theme.text, marginBottom: '20px', fontSize: '2.5rem', fontWeight: '900' }}>Guest Mode</h2>
        <p style={{ fontSize: '1.3rem', color: theme.text, marginBottom: '30px', fontWeight: '600' }}>Create an account to track your reading progress and save your favorite verses.</p>
        <button onClick={openAuthModal} style={{ backgroundColor: theme.accent, padding: '15px 35px', fontSize: '1.3rem', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: '900', color: isDarkMode ? '#00263d' : '#ffffff', boxShadow: '0 6px 0 rgba(0,0,0,0.15)' }}>
          Log In / Sign Up
        </button>
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((readCount / totalChapters) * 100));
  const displayName = session.user.user_metadata?.username || "Reader";

  return (
    <div>
      <h1 style={{ color: theme.pageText, marginBottom: '30px', fontSize: '2.5rem', fontWeight: '900', textAlign: 'center' }}>Hello, {displayName}!</h1>
      
      <div style={{ backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '35px', padding: '35px', marginBottom: '35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ color: theme.text, margin: 0, fontSize: '2rem', fontWeight: '900' }}>Reading Journey</h2>
          <button onClick={() => supabase.auth.signOut()} style={{ backgroundColor: theme.inputBg, color: isDarkMode ? '#ffffff' : '#365263', border: `3px solid ${theme.accent}`, padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: '900', fontSize: '1.1rem' }}>Log Out</button>
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
                <button onClick={() => deleteBookmark(b.id)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: isDarkMode ? '#ffffff' : '#365263', cursor: 'pointer' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h4 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '1.3rem', fontWeight: '900' }}>{b.book_name} {b.chapter}:{b.verse}</h4>
                <p style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#365263', fontSize: '1.1rem', lineHeight: '1.6', fontWeight: '600' }}>"{b.verse_text}"</p>
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