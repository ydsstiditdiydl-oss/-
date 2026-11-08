// YouTube Background Audio Service with seamless auto-loop and global state sync

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

class YouTubeAudioService {
  private player: any = null;
  private videoId = 'h1zpQUCaVnA'; // Amr Diab - Waadtak
  private ready = false;
  private pendingPlay = false;
  private listeners: Set<(isPlaying: boolean) => void> = new Set();
  private timeListeners: Set<(current: number, duration: number) => void> = new Set();
  private timer: number | null = null;
  private isPlayingState = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupApi();
    }
  }

  public setVideoId(id: string) {
    if (!id || id === this.videoId) return;
    this.videoId = id;
    if (this.ready && this.player && typeof this.player.loadVideoById === 'function') {
      this.player.loadVideoById({
        videoId: id,
        startSeconds: 0,
      });
    }
  }

  public setupApi() {
    if (typeof window === 'undefined') return;

    const createPlayer = () => {
      if (this.player) return;
      const host = document.getElementById('yt-player-host');
      if (!host) {
        // Retry shortly when DOM mounts host container
        setTimeout(() => this.setupApi(), 100);
        return;
      }

      let targetDiv = document.getElementById('yt-embedded-audio-frame');
      if (!targetDiv) {
        targetDiv = document.createElement('div');
        targetDiv.id = 'yt-embedded-audio-frame';
        host.appendChild(targetDiv);
      }

      try {
        this.player = new window.YT.Player('yt-embedded-audio-frame', {
          height: '200',
          width: '200',
          videoId: this.videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: this.videoId, // Required by YouTube iframe API for loop to work
            playsinline: 1,
            enablejsapi: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event: any) => {
              this.ready = true;
              // If user already clicked unlock or play
              if (this.pendingPlay) {
                this.pendingPlay = false;
                try {
                  event.target.playVideo();
                } catch (e) {
                  console.warn('Autoplay error:', e);
                }
              }
            },
            onStateChange: (event: any) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED, 3 = BUFFERING
              if (event.data === 1) {
                this.isPlayingState = true;
                this.startTimeTracking();
                this.notifyState(true);
              } else if (event.data === 2) {
                this.isPlayingState = false;
                this.stopTimeTracking();
                this.notifyState(false);
              } else if (event.data === 0) {
                // Loop explicitly as requested: "وعند الانتهاء الاغنيه تعاد بشكل تلقائي"
                try {
                  event.target.seekTo(0);
                  event.target.playVideo();
                } catch {
                  // Fallback loop
                }
                this.isPlayingState = true;
                this.notifyState(true);
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Player notice:', err);
              // Error 150 / 101: owner restricts embedding on this video ID.
              // Fallback to the embed-compatible version of the exact same song (Amr Diab - Waadtak).
              if ((err?.data === 150 || err?.data === 101) && this.videoId !== '4UfmODx00vY') {
                this.videoId = '4UfmODx00vY';
                try {
                  if (this.player && typeof this.player.loadVideoById === 'function') {
                    this.player.loadVideoById('4UfmODx00vY');
                    this.player.playVideo();
                  }
                } catch (e) {
                  console.warn('Fallback error:', e);
                }
              }
            },
          },
        });
      } catch (err) {
        console.warn('Failed to initialize YouTube Player instance:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevReady === 'function') prevReady();
        createPlayer();
      };
    }
  }

  public play() {
    this.pendingPlay = true;
    if (this.ready && this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo();
        this.pendingPlay = false;
      } catch {
        // Browser might require direct user gesture
      }
    } else {
      this.setupApi();
    }
  }

  public pause() {
    this.pendingPlay = false;
    if (this.ready && this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
      } catch {}
    }
  }

  public toggle() {
    if (this.isPlayingState) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seekTo(seconds: number) {
    if (this.ready && this.player && typeof this.player.seekTo === 'function') {
      try {
        this.player.seekTo(seconds, true);
      } catch {}
    }
  }

  public getCurrentTime(): number {
    if (this.ready && this.player && typeof this.player.getCurrentTime === 'function') {
      try {
        return this.player.getCurrentTime() || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  }

  public getDuration(): number {
    if (this.ready && this.player && typeof this.player.getDuration === 'function') {
      try {
        const d = this.player.getDuration();
        if (d && d > 0) return d;
      } catch {}
    }
    return 240; // Standard duration for Amr Diab - Waadtak
  }

  public isPlaying(): boolean {
    return this.isPlayingState;
  }

  public subscribe(cb: (isPlaying: boolean) => void) {
    this.listeners.add(cb);
    cb(this.isPlayingState);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public subscribeTime(cb: (current: number, duration: number) => void) {
    this.timeListeners.add(cb);
    return () => {
      this.timeListeners.delete(cb);
    };
  }

  private notifyState(playing: boolean) {
    this.listeners.forEach((cb) => cb(playing));
  }

  private startTimeTracking() {
    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(() => {
      const cur = this.getCurrentTime();
      const dur = this.getDuration();
      this.timeListeners.forEach((cb) => cb(cur, dur));
    }, 500);
  }

  private stopTimeTracking() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const youtubeAudioService = new YouTubeAudioService();
