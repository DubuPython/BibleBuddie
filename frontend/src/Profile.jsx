import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const Profile = () => {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  
  const [bookmarks, setBookmarks] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const totalChapters = 1189;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (userId) => {
    const { data: bData } = await supabase.from('bookmarks').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (bData) setBookmarks(bData);

    const { count } = await supabase.from('reading_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    if (count !== null) setReadCount(count);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("Check your email to confirm your account!");
    }
  };

  const deleteBookmark = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id);
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  if (!session) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto', backgroundColor: '#fff', border: '5px solid #8c9eff', borderRadius: '25px', padding: '30px' }}>
        <h2 style={{ color: '#3f51b5', textAlign: 'center', marginBottom: '20px' }}>{isLogin ? '👋 Welcome Back!' : '✨ Join BibleBuddie'}</h2>
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '15px', border: '2px solid #b39ddb', fontSize: '1rem', outline: 'none' }} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '15px', border: '2px solid #b39ddb', fontSize: '1rem', outline: 'none' }} required />
          <button type="submit" style={{ backgroundColor: '#00e676', padding: '12px', borderRadius: '15px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 0 #00c853' }}>{isLogin ? 'Log In' : 'Sign Up'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#757575', fontWeight: 'bold' }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign Up!" : "Already have an account? Log In!"}
        </p>
      </div>
    );
  }

  const progressPercentage = Math.min(100, Math.round((readCount / totalChapters) * 100));

  return (
    <div>
      <div className="card" style={{ backgroundColor: '#fff', border: '5px solid #ffb74d', borderRadius: '25px', padding: '30px', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#ef6c00', margin: 0 }}>🏆 My Reading Journey</h2>
          <button onClick={() => supabase.auth.signOut()} style={{ backgroundColor: '#ff5252', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 0 #d50000' }}>Log Out</button>
        </div>
        
        <p style={{ fontSize: '1.2rem', color: '#424242', fontWeight: 'bold' }}>Chapters Completed: {readCount} / {totalChapters}</p>
        
        <div style={{ width: '100%', backgroundColor: '#ffe0b2', borderRadius: '20px', height: '35px', overflow: 'hidden', border: '3px solid #ffb74d' }}>
          <div style={{ width: `${progressPercentage}%`, backgroundColor: '#ff9800', height: '100%', transition: 'width 0.5s ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '1.1rem' }}>
            {progressPercentage > 4 ? `${progressPercentage}%` : ''}
          </div>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: '#fff', border: '5px solid #8c9eff', borderRadius: '25px', padding: '30px' }}>
        <h2 style={{ color: '#3f51b5', margin: '0 0 20px 0' }}>⭐ My Bookmark Collection</h2>
        {bookmarks.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {bookmarks.map(b => (
              <div key={b.id} style={{ backgroundColor: '#f0f4ff', padding: '20px', borderRadius: '15px', border: '3px dashed #b39ddb', position: 'relative' }}>
                <button onClick={() => deleteBookmark(b.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#ff5252', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
                <h4 style={{ margin: '0 0 10px 0', color: '#1565c0', fontSize: '1.2rem' }}>{b.book_name} {b.chapter}:{b.verse}</h4>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#424242', fontSize: '1.1rem', lineHeight: '1.5' }}>"{b.verse_text}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#9e9e9e', fontSize: '1.2rem' }}>You haven't bookmarked any verses yet!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;