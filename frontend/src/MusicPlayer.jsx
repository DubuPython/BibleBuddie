import React, { useState, useRef, useEffect } from 'react';

const tracks = [
  { title: "Stream", src: "https://actions.google.com/sounds/v1/water/babbling_brook.ogg" },
  { title: "Wind", src: "https://actions.google.com/sounds/v1/weather/winter_wind.ogg" },
  { title: "Rain", src: "https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg" }
];

const MusicPlayer = ({ theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) audioRef.current.play().catch(e => console.log("Audio play blocked"));
    else audioRef.current.pause();
  }, [isPlaying, currentTrackIndex]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--inputBg)', borderRadius: '30px', padding: '8px 16px', gap: '12px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)' }}>
      <audio ref={audioRef} src={tracks[currentTrackIndex].src} loop />
      <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', padding: 0 }}>
        {isPlaying ? <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>}
      </button>
      <span style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
        {tracks[currentTrackIndex].title}
      </span>
      <button onClick={() => { setCurrentTrackIndex((prev) => (prev + 1) % tracks.length); setIsPlaying(true); }} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', padding: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="3"></line></svg>
      </button>
    </div>
  );
};

export default MusicPlayer;