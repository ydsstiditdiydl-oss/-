import React, { useState, useEffect, useRef } from 'react';
import { SecretCalculator } from './components/SecretCalculator';
import { CinematicIntro } from './components/CinematicIntro';
import { BackgroundStars } from './components/BackgroundStars';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/sections/HomeSection';
import { OurTimeSection } from './components/sections/OurTimeSection';
import { OurStorySection } from './components/sections/OurStorySection';
import { OurMemoriesSection } from './components/sections/OurMemoriesSection';
import { OurSongSection } from './components/sections/OurSongSection';
import { SecretLetterSection } from './components/sections/SecretLetterSection';
import { OurUniverseSection } from './components/sections/OurUniverseSection';
import { ReasonsSection } from './components/sections/ReasonsSection';
import { OpenWhenSection } from './components/sections/OpenWhenSection';
import { MakeAWishSection } from './components/sections/MakeAWishSection';
import { FiveGiftsSection } from './components/sections/FiveGiftsSection';
import { FinalSurpriseModal } from './components/FinalSurpriseModal';
import { SettingsModal } from './components/SettingsModal';
import { INITIAL_APP_DATA } from './data/defaultData';
import { synthPlayer } from './utils/audioService';
import { youtubeAudioService } from './utils/youtubeAudioService';
import { AppData, ActiveSection, TimelineEvent, MemoryPhoto } from './types';

export default function App() {
  // App Lifecycle Stages: 'calculator' -> 'intro' -> 'main'
  // Requires password on every fresh open as requested
  const [stage, setStage] = useState<'calculator' | 'intro' | 'main'>('calculator');
  const [activeSection, setActiveSection] = useState<ActiveSection>('home');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFinalSurprise, setShowFinalSurprise] = useState<boolean>(false);

  // App Data with localStorage persistence for user customizations
  const [data, setData] = useState<AppData>(() => {
    try {
      const saved = localStorage.getItem('her_universe_app_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.meetingDate === '2026-03-20' || parsed.meetingDate === '2026-07-19') {
          parsed.meetingDate = '2026-09-26';
        }
        if (parsed.timelineEvents && parsed.timelineEvents[0]?.id === 'event-1') {
          parsed.timelineEvents[0].date = '2026-09-26';
        }
        if (parsed.memories && parsed.memories[0]?.id === 'mem-1') {
          parsed.memories[0].date = '2026-09-26';
        }
        // Migrate to Amr Diab - Waadtak with YouTube audio
        if (parsed.songTitle === 'لحن عالمنا الخاص' || !parsed.youtubeVideoId) {
          parsed.songTitle = 'وعدتك';
          parsed.songArtist = 'عمرو دياب';
          parsed.songCoverUrl = 'https://i.ytimg.com/vi/h1zpQUCaVnA/hqdefault.jpg';
          parsed.youtubeVideoId = 'h1zpQUCaVnA';
          parsed.youtubeUrl = 'https://youtu.be/h1zpQUCaVnA?si=hKvqqYViF4Fqqo0P';
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_APP_DATA;
  });

  const saveAppData = (newData: AppData) => {
    setData(newData);
    try {
      localStorage.setItem('her_universe_app_data', JSON.stringify(newData));
      sessionStorage.setItem('her_universe_app_data', JSON.stringify(newData));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    // Sync to disk in the background for permanent persistence across sessions
    try {
      fetch('/api/sync-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      }).catch(() => {});
    } catch {
      // Ignore network errors in offline mode
    }
  };

  // Sync state on load or change
  useEffect(() => {
    try {
      fetch('/api/sync-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
    } catch {}
  }, [data]);

  // Music Player Management with YouTube & Custom Audio
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(240); // Standard ~4 mins for Amr Diab - Waadtak
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync YouTube player with current videoId
  useEffect(() => {
    youtubeAudioService.setVideoId(data.youtubeVideoId || 'h1zpQUCaVnA');
  }, [data.youtubeVideoId]);

  // Subscribe to YouTube audio state and time updates
  useEffect(() => {
    const unsubState = youtubeAudioService.subscribe((playing) => {
      if (!data.customAudioUrl) {
        setIsPlayingMusic(playing);
      }
    });

    const unsubTime = youtubeAudioService.subscribeTime((curr, dur) => {
      if (!data.customAudioUrl) {
        setCurrentTime(curr);
        if (dur > 0) setDuration(dur);
      }
    });

    return () => {
      unsubState();
      unsubTime();
    };
  }, [data.customAudioUrl]);

  // Setup HTML Audio element for custom uploaded music
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (data.customAudioUrl) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && data.customAudioUrl) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [data.customAudioUrl]);

  // Update audio source when customAudioUrl changes
  useEffect(() => {
    if (audioRef.current && data.customAudioUrl) {
      youtubeAudioService.pause();
      audioRef.current.src = data.customAudioUrl;
      if (isPlayingMusic) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [data.customAudioUrl, isPlayingMusic]);

  const toggleMusic = () => {
    if (data.customAudioUrl && audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
        setIsPlayingMusic(false);
      } else {
        youtubeAudioService.pause();
        audioRef.current.play().catch(() => {});
        setIsPlayingMusic(true);
      }
    } else {
      youtubeAudioService.toggle();
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
    if (data.customAudioUrl && audioRef.current) {
      audioRef.current.currentTime = seconds;
    } else {
      youtubeAudioService.seekTo(seconds);
    }
  };

  const handleUploadSong = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        const audioUrl = e.target.result;
        saveAppData({
          ...data,
          customAudioUrl: audioUrl,
          songTitle: file.name.replace(/\.[^/.]+$/, ''),
          songArtist: 'أغنيتكِ الخاصة'
        });
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          if (isPlayingMusic) {
            synthPlayer.stop();
            audioRef.current.play().catch(() => {});
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateCover = (url: string) => {
    saveAppData({ ...data, songCoverUrl: url });
  };

  // Handlers for adding and editing events, memories, and letters
  const handleAddTimelineEvent = (event: TimelineEvent) => {
    saveAppData({
      ...data,
      timelineEvents: [...data.timelineEvents, event]
    });
  };

  const handleAddMemory = (memory: MemoryPhoto) => {
    saveAppData({
      ...data,
      memories: [memory, ...data.memories]
    });
  };

  const handleUpdateSecretLetter = (content: string) => {
    saveAppData({
      ...data,
      secretLetterContent: content
    });
  };

  const handleUpdateOpenWhen = (id: string, newMessage: string) => {
    saveAppData({
      ...data,
      openWhenItems: data.openWhenItems.map(item =>
        item.id === id ? { ...item, message: newMessage } : item
      )
    });
  };

  const handleUnlock = () => {
    // 1. Immediately play Amr Diab - Waadtak upon correct password input
    youtubeAudioService.play();
    setIsPlayingMusic(true);
    // 2. Transition smoothly to cinematic intro
    setStage('intro');
  };

  return (
    <>
      {/* Hidden YouTube IFrame Audio Host that stays mounted and plays across all stages */}
      <div
        id="yt-player-host"
        className="fixed -top-[9999px] -left-[9999px] w-[1px] h-[1px] opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Stage 1: Secret Calculator */}
      {stage === 'calculator' && <SecretCalculator onUnlock={handleUnlock} />}

      {/* Stage 2: Cinematic Intro */}
      {stage === 'intro' && (
        <CinematicIntro
          onFinish={() => {
            setStage('main');
          }}
        />
      )}

      {/* Stage 3: Main Experience */}
      {stage === 'main' && (
        <div className="min-h-screen bg-[#030005] text-rose-50 flex flex-col relative selection:bg-rose-500/30 selection:text-rose-200">
          {/* Animated Starry Space Canvas */}
          <BackgroundStars />

          {/* Persistent Navigation Bar & Audio Indicator */}
          <Navbar
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            isPlayingMusic={isPlayingMusic}
            onToggleMusic={toggleMusic}
            onOpenSettings={() => setShowSettings(true)}
          />

          {/* Main Content Viewport */}
          <main className="flex-1 relative z-10 pb-24 lg:pb-12">
            {activeSection === 'home' && (
              <HomeSection data={data} onNavigate={setActiveSection} />
            )}

            {activeSection === 'our-time' && (
              <OurTimeSection data={data} />
            )}

            {activeSection === 'our-story' && (
              <OurStorySection data={data} onAddEvent={handleAddTimelineEvent} />
            )}

            {activeSection === 'our-memories' && (
              <OurMemoriesSection data={data} onAddMemory={handleAddMemory} />
            )}

            {activeSection === 'our-song' && (
              <OurSongSection
                data={data}
                isPlaying={isPlayingMusic}
                onTogglePlay={toggleMusic}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                onUploadSong={handleUploadSong}
                onUpdateCover={handleUpdateCover}
              />
            )}

            {activeSection === 'secret-letter' && (
              <SecretLetterSection
                data={data}
                onUpdateLetter={handleUpdateSecretLetter}
              />
            )}

            {activeSection === 'our-universe' && (
              <OurUniverseSection data={data} />
            )}

            {activeSection === '100-reasons' && (
              <ReasonsSection data={data} />
            )}

            {activeSection === 'open-when' && (
              <OpenWhenSection
                data={data}
                onUpdateOpenWhen={handleUpdateOpenWhen}
              />
            )}

            {activeSection === 'make-a-wish' && (
              <MakeAWishSection data={data} />
            )}

            {activeSection === 'five-gifts' && (
              <FiveGiftsSection
                data={data}
                onOpenFinalSurprise={() => setShowFinalSurprise(true)}
              />
            )}
          </main>

          {/* Final Surprise Grand Modal */}
          {showFinalSurprise && (
            <FinalSurpriseModal
              data={data}
              onClose={() => setShowFinalSurprise(false)}
            />
          )}

          {/* Customization Settings Drawer/Modal */}
          {showSettings && (
            <SettingsModal
              data={data}
              onSaveData={saveAppData}
              onClose={() => setShowSettings(false)}
            />
          )}
        </div>
      )}
    </>
  );
}
