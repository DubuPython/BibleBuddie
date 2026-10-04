import React, { useState, useRef, useEffect } from 'react';

const tracks = [
  { title: "Peaceful Ambient Stream", src: "https://actions.google.com/sounds/v1/water/babbling_brook.ogg" },
  { title: "Quiet Winter Wind", src: "https://actions.google.com/sounds/v1/weather/winter_wind.ogg" },
  { title: "Soft Rain", src: "https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg" }
];

const MusicPlayer = ({ theme, isDarkMode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser"));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  return (
    <div className="music-player" style={{ position: 'fixed', bottom: '15px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '800px', backgroundColor: theme.surface, border: `4px solid ${theme.accent}`, borderRadius: '25px', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', zIndex: 1000, gap: '15px', boxSizing: 'border-box' }}>
      <audio ref={audioRef} src={tracks[currentTrackIndex].src} loop />
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <span style={{ color: theme.accent, fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Now Playing</span>
        <span style={{ color: theme.text, fontSize: '1rem', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {tracks[currentTrackIndex].title}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => setIsPlaying(!isPlaying)} style={{ backgroundColor: theme.accent, color: isDarkMode ? '#00263d' : '#ffffff', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 0 rgba(0,0,0,0.2)', flexShrink: 0 }}>
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          )}
        </button>
        <button onClick={nextTrack} style={{ backgroundColor: theme.inputBg, color: theme.pageText, border: `2px solid ${theme.accent}`, borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;