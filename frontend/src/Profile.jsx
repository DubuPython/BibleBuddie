import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Profile = ({ session, openAuthModal, theme }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const totalChapters = 1189;

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
      <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.secondary}`, borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: theme.text, marginBottom: '15px' }}>Guest Mode</h2>
        <p style={{ fontSize: '1.1rem', color: theme.text, marginBottom: '25px' }}>Create an account to track your reading progress and save your favorite verses.</p>
        <button onClick={openAuthModal} style={{ backgroundColor: theme.accent, padding: '12px 25px', fontSize: '1.1rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: theme.buttonText }}>
          Log In / Sign Up
        </button>
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((readCount / totalChapters) * 100));
  const displayName = session.user.user_metadata?.username || "Reader";

  return (
    <div>
      <h1 style={{ color: theme.text, marginBottom: '30px' }}>Hello, {displayName}!</h1>
      
      <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.secondary}`, borderRadius: '12px', padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: theme.text, margin: 0 }}>Reading Journey</h2>
          <button onClick={() => supabase.auth.signOut()} style={{ backgroundColor: theme.secondary, color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Log Out</button>
        </div>
        
        <p style={{ fontSize: '1.1rem', color: theme.text, marginBottom: '15px' }}>Chapters Completed: {readCount} / {totalChapters}</p>
        
        <div style={{ width: '100%', backgroundColor: theme.dominant, borderRadius: '8px', height: '30px', overflow: 'hidden', border: `1px solid ${theme.secondary}` }}>
          <div style={{ width: `${progressPercentage}%`, backgroundColor: theme.accent, height: '100%', transition: 'width 0.5s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.buttonText, fontWeight: 'bold', fontSize: '0.9rem' }}>
            {progressPercentage > 4 ? `${progressPercentage}%` : ''}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.secondary}`, borderRadius: '12px', padding: '30px' }}>
        <h2 style={{ color: theme.text, margin: '0 0 20px 0' }}>Bookmark Collection</h2>
        {bookmarks.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {bookmarks.map(b => (
              <div key={b.id} style={{ backgroundColor: theme.dominant, padding: '20px', borderRadius: '8px', border: `1px solid ${theme.secondary}`, position: 'relative' }}>
                <button onClick={() => deleteBookmark(b.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: theme.secondary, cursor: 'pointer' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <h4 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '1.1rem' }}>{b.book_name} {b.chapter}:{b.verse}</h4>
                <p style={{ margin: 0, color: theme.text, fontSize: '1rem', lineHeight: '1.5' }}>"{b.verse_text}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: theme.text, fontSize: '1rem' }}>No verses bookmarked yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;