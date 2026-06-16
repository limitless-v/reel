import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Flame } from 'lucide-react';
import { InstagramEmbed } from 'react-social-media-embed';

// Global helper to load the YouTube IFrame API script
let ytApiPromise = null;
const loadYoutubeSdk = () => {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // Check periodically for YT object availability if onYouTubeIframeAPIReady doesn't fire fast enough
    const checkInterval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkInterval);
        resolve(window.YT);
      }
    }, 100);

    window.onYouTubeIframeAPIReady = () => {
      clearInterval(checkInterval);
      resolve(window.YT);
    };
  });
  return ytApiPromise;
};

// Sample video data using high-quality vertical aesthetics videos
const SAMPLE_VIDEOS = [
  {
    id: 'reels-1',
    platform: 'instagram',
    instagramId: 'DZYHe_DJ-ES', // User's requested Instagram reel link shortcode
    title: 'The Requested Instagram Reel',
    description: 'Playing your requested Instagram Reel inline. All profile headers, username text, and redirect links have been cropped and masked.',
    url: '',
  },
  {
    id: 'shorts-1',
    platform: 'youtube',
    youtubeId: 'LiEhInMCwQw', // User's requested YT Shorts video
    title: 'The Perfect YT Short',
    description: 'Playing your requested YouTube Shorts link inline without redirects or profile icons!',
    url: '',
  },
  {
    id: 'meta-1',
    platform: 'facebook',
    title: 'Neon Skate Session',
    description: 'Skater pulling off fresh tricks in a futuristic neon skatepark #meta',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-skater-doing-tricks-in-a-neon-skatepark-40019-large.mp4',
  },
  {
    id: 'reels-2',
    platform: 'instagram',
    title: 'Urban Explorer Walk',
    description: 'Walking through cyberpunk alleyways and rain puddles #cyberpunk #cityscape',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-holding-a-glowing-light-bulb-in-a-dark-room-41908-large.mp4',
  },
  {
    id: 'shorts-2',
    platform: 'youtube',
    youtubeId: 'dQw4w9WgXcQ', // Rickroll backup short/video ID
    title: 'Retro Anthems Short',
    description: 'A legendary short snippet playing cleanly #shorts #nevergonnagiveyouup',
    url: '',
  },
  {
    id: 'meta-2',
    platform: 'facebook',
    title: 'Mountain Sunset Peak',
    description: 'Stunning aerial view flying above cloud levels during sunset #nature #wanderlust',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-sunset-view-from-above-41712-large.mp4',
  }
];

function App() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  // Filter videos
  const filteredVideos = activeFilter === 'all' 
    ? SAMPLE_VIDEOS 
    : SAMPLE_VIDEOS.filter(v => v.platform === activeFilter);

  // Global control to pause other videos when playing a new one
  const handlePlayState = (videoId) => {
    setPlayingVideoId(prev => prev === videoId ? null : videoId);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-section">
          <Flame size={18} />
          <span className="logo-text">StreamReel Studio</span>
        </div>
        <h1>Social Video Feed</h1>
        <p>A premium visual player for Instagram Reels, Facebook Meta, and YouTube Shorts. Zero redirects, zero tracking, purely the content.</p>
      </header>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Platforms
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'instagram' ? 'active' : ''}`}
          onClick={() => setActiveFilter('instagram')}
        >
          <InstagramLogo size={16} />
          Instagram Reels
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'facebook' ? 'active' : ''}`}
          onClick={() => setActiveFilter('facebook')}
        >
          <MetaLogo size={16} />
          Meta Videos
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'youtube' ? 'active' : ''}`}
          onClick={() => setActiveFilter('youtube')}
        >
          <YoutubeShortsLogo size={16} />
          YouTube Shorts
        </button>
      </div>

      {/* Global Mute Toggle for experience */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <button 
          className="filter-btn" 
          onClick={() => setIsMuted(!isMuted)}
          style={{ gap: '0.75rem', borderColor: 'rgba(255, 255, 255, 0.15)' }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          {isMuted ? "Unmute All Clips" : "Mute All Clips"}
        </button>
      </div>

      {/* Video Grid Feed */}
      <div className="feed-grid">
        {filteredVideos.map((video) => (
          <VideoCard 
            key={video.id}
            video={video}
            isPlaying={playingVideoId === video.id}
            isMuted={isMuted}
            onTogglePlay={() => handlePlayState(video.id)}
          />
        ))}
      </div>

      <footer>
        <p>© 2026 StreamReel Studio. All rights reserved.</p>
        <p>Designed for absolute visual privacy and seamless click-to-play performance.</p>
      </footer>
    </div>
  );
}

// Single Video Card component
function VideoCard({ video, isPlaying, isMuted, onTogglePlay }) {
  const videoRef = useRef(null);

  // Standard video controls
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.log("Playback interrupted or blocked by browser autoplays:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Determine if overlay should capture click events or pass them down
  const isIframeBase = video.platform === 'instagram' && !video.url;

  return (
    <div className="video-card">
      {/* Platform Badge overlaying the top */}
      <div className={`platform-badge ${video.platform}`}>
        {video.platform === 'instagram' && <InstagramLogo size={14} />}
        {video.platform === 'facebook' && <MetaLogo size={14} />}
        {video.platform === 'youtube' && <YoutubeShortsLogo size={14} />}
        {video.platform === 'instagram' && "Reels"}
        {video.platform === 'facebook' && "Meta"}
        {video.platform === 'youtube' && "Shorts"}
      </div>

      {/* Video Container (Strictly Click-to-Play, No Redirect) */}
      <div 
        className="video-container" 
        onClick={!isIframeBase ? onTogglePlay : undefined}
      >
        {video.platform === 'youtube' && !video.url ? (
          <YouTubePlayer 
            videoId={video.youtubeId} 
            isPlaying={isPlaying} 
            isMuted={isMuted} 
          />
        ) : video.platform === 'instagram' && video.instagramId && !video.url ? (
          <InstagramPlayer 
            instagramId={video.instagramId} 
          />
        ) : (
          <video 
            ref={videoRef}
            className="video-player"
            src={video.url}
            loop
            muted={isMuted}
            playsInline
          />
        )}

        {/* Hover / Play State Overlay (For native iframe, let clicks pass through center) */}
        <div 
          className={`play-overlay-trigger ${!isPlaying ? 'paused' : ''}`}
          style={isIframeBase ? { pointerEvents: 'none', opacity: isPlaying ? 0 : 1 } : {}}
        >
          <div className="play-icon-wrapper">
            {isPlaying ? <Pause size={30} /> : <Play size={30} />}
          </div>
        </div>

        {/* Text Details overlaying bottom (NO Profile Pictures) */}
        <div className="video-overlay" style={isIframeBase ? { pointerEvents: 'none' } : {}}>
          <div></div>
          <div className="video-info">
            <h3 className="video-title">{video.title}</h3>
            <p className="video-description">{video.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Instagram Embed Component using react-social-media-embed
function InstagramPlayer({ instagramId }) {
  const embedUrl = `https://www.instagram.com/reel/${instagramId}/`;
  return (
    <div className="instagram-iframe-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <InstagramEmbed
        url={embedUrl}
        width="100%"
        captioned
      />
    </div>
  );
}

// Special custom YouTube Shorts Embed Component using the YouTube Player API
function YouTubePlayer({ videoId, isPlaying, isMuted }) {
  const containerId = `yt-player-${videoId}`;
  const playerRef = useRef(null);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    loadYoutubeSdk().then(() => {
      setApiReady(true);
    });
  }, []);

  useEffect(() => {
    if (!apiReady) return;

    // Create YT Player
    playerRef.current = new window.YT.Player(containerId, {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        loop: 1,
        playlist: videoId,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          if (isMuted) {
            event.target.mute();
          } else {
            event.target.unmute();
          }
          if (isPlaying) {
            event.target.playVideo();
          }
        }
      }
    });

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [apiReady, videoId]);

  // Synchronize playing states
  useEffect(() => {
    if (playerRef.current && playerRef.current.getPlayerState) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (e) {
        console.warn("YouTube play/pause exception:", e);
      }
    }
  }, [isPlaying]);

  // Synchronize muting states
  useEffect(() => {
    if (playerRef.current && playerRef.current.mute) {
      try {
        if (isMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unmute();
        }
      } catch (e) {
        console.warn("YouTube mute exception:", e);
      }
    }
  }, [isMuted]);

  return (
    <div className="youtube-iframe-wrapper">
      <div id={containerId} className="youtube-iframe" />
    </div>
  );
}

// Inline platform SVG logos
function InstagramLogo({ size = 16 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function MetaLogo({ size = 16 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M16.92 7.02c-.89 0-1.87.5-2.8 1.48L12.5 10.3c-.63.66-1.57.66-2.2 0l-1.62-1.8c-.93-.98-1.91-1.48-2.8-1.48C3.82 7.02 2 8.78 2 11.4c0 2.22 1.34 3.73 3.32 3.73.9 0 1.88-.5 2.81-1.48l1.62-1.8c.63-.66 1.57-.66 2.2 0l1.62 1.8c.93.98 1.91 1.48 2.8 1.48 1.99 0 3.33-1.5 3.33-3.73 0-2.62-1.82-4.38-4.88-4.38zm-11.6 6.55c-1.07 0-1.74-.82-1.74-2.17 0-1.46.96-2.58 2.2-2.58.46 0 .97.28 1.48.82l1.62 1.8c-.5.53-1.02.82-1.48.82-.46 0-.85-.35-.85-.35s.26-.26.54-.53l.26-.27c.1-.11.1-.3 0-.41a.3.3 0 0 0-.42 0c-.57.57-1.12 1.13-1.61 1.62-.26.27-.61.42-.98.42h-.1-.18zm11.6 0c-.37 0-.72-.15-.98-.42-.5-.49-1.04-1.05-1.62-1.62a.3.3 0 0 0-.42 0c-.1.11-.1.3 0 .41l.26.27s.54.53.54.53-.39.35-.85.35c-.46 0-.98-.29-1.48-.82l1.62-1.8c.51-.54 1.02-.82 1.48-.82 1.24 0 2.2 1.12 2.2 2.58 0 1.35-.67 2.17-1.74 2.17z"/>
    </svg>
  );
}

function YoutubeShortsLogo({ size = 16 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M17.771 8.875C17.472 7.747 16.5 7.159 15.69 7.022c-2.392-.403-4.79-.404-7.18-.01-.796.13-1.785.706-2.072 1.83-.541 2.109-.54 4.316-.01 6.425.29 1.124 1.282 1.701 2.078 1.83 2.39.4 4.787.397 7.178.01.79-.13 1.78-.707 2.067-1.83.541-2.11.54-4.317.02-6.402zm-7.64 5.922V9.203l4.78 2.802-4.78 2.792z"/>
    </svg>
  );
}

export default App;
