import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Profile = ({ session, openAuthModal, theme }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const [streak, setStreak] = useState(0);
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
    await supabase.from('bookmarks').delete().eq('id', id); setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const addPrayer = () => {
    if (!newPrayer.trim()) return;
    const updated = [{ id: Date.now(), text: newPrayer, date: new Date().toLocaleDateString() }, ...prayers];
    setPrayers(updated); localStorage.setItem('prayer_board', JSON.stringify(updated)); setNewPrayer("");
  };

  const deletePrayer = (id) => {
    const updated = prayers.filter(p => p.id !== id);
    setPrayers(updated); localStorage.setItem('prayer_board', JSON.stringify(updated));
  };

  if (!session) {
    return (
      <div className="verses-scroll-area">
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 style={{ color: theme.text, fontSize: '2rem', fontWeight: '800' }}>Guest Mode</h2>
          <p style={{ fontSize: '1.2rem', color: theme.text, margin: '20px 0 40px 0', opacity: 0.9, lineHeight: '1.6' }}>Create an account to track your progress and save your favorite verses.</p>
          <button onClick={openAuthModal} className="btn btn-primary" style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>Log In / Sign Up</button>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((readCount / totalChapters) * 100));

  return (
    <div className="verses-scroll-area" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ color: theme.text, margin: 0, fontSize: '1.8rem' }}>Hello, {session.user.user_metadata?.username || "Reader"}!</h1>
        <div style={{ background: 'var(--inputBg)', color: theme.text, padding: '10px 20px', borderRadius: '20px', fontWeight: '800', fontSize: '1.1rem' }}>
          🔥 {streak} Day Streak
        </div>
      </div>
      
      <div className="glass-card">
        <h2 style={{ color: theme.text, margin: '0 0 20px 0', fontSize: '1.5rem' }}>🕯️ Prayer Board</h2>
        <div className="prayer-input-group" style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <input type="text" placeholder="Write a prayer intention..." value={newPrayer} onChange={(e) => setNewPrayer(e.target.value)} className="modern-input" />
          <button onClick={addPrayer} className="btn btn-primary" style={{ flexShrink: 0 }}>Light Candle</button>
        </div>
        <div style={{ display: 'grid', gap: '15px' }}>
          {prayers.map(prayer => (
            <div key={prayer.id} style={{ backgroundColor: 'var(--inputBg)', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: theme.text, fontSize: '1.1rem', fontWeight: '600' }}>🕯️ {prayer.text}</p>
                <small style={{ color: theme.text, opacity: 0.6, fontWeight: 'bold' }}>{prayer.date}</small>
              </div>
              <button onClick={() => deletePrayer(prayer.id)} style={{ background: 'none', border: 'none', color: theme.text, opacity: 0.5, cursor: 'pointer', fontSize: '1.5rem' }}>✖</button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ color: theme.text, margin: 0, fontSize: '1.5rem' }}>Reading Journey</h2>
          <button onClick={() => supabase.auth.signOut()} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '1rem' }}>Log Out</button>
        </div>
        <p style={{ color: theme.text, marginBottom: '15px', fontWeight: '600', opacity: 0.8 }}>Chapters Completed: {readCount} / {totalChapters}</p>
        <div style={{ width: '100%', backgroundColor: 'var(--inputBg)', borderRadius: '20px', height: '25px', overflow: 'hidden', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)' }}>
          <div style={{ width: `${progressPercentage}%`, backgroundColor: theme.accent, height: '100%', transition: 'width 1s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '0.9rem' }}>
            {progressPercentage > 4 ? `${progressPercentage}%` : ''}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ color: theme.text, margin: '0 0 20px 0', fontSize: '1.5rem' }}>Bookmarks</h2>
        {bookmarks.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {bookmarks.map(b => (
              <div key={b.id} style={{ backgroundColor: 'var(--inputBg)', padding: '20px', borderRadius: '16px', position: 'relative' }}>
                <button onClick={() => deleteBookmark(b.id)} style={{ position: 'absolute', top: '20px', right: '15px', background: 'none', border: 'none', color: theme.text, opacity: 0.5, cursor: 'pointer' }}>✖</button>
                <h4 style={{ margin: '0 0 10px 0', color: theme.accent, fontSize: '1.1rem', fontWeight: '800' }}>{b.book_name} {b.chapter}:{b.verse}</h4>
                <p style={{ margin: 0, color: theme.text, fontSize: '1.05rem', lineHeight: '1.6' }}>"{b.verse_text}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: theme.text, opacity: 0.7, fontStyle: 'italic' }}>No verses bookmarked yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;