// Web Audio Synthesizer & HTMLAudio unified manager

class RomanticSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private currentChordIndex = 0;

  // Romantic chord progression in C major / A minor (Cmaj7 - Am9 - Fmaj7 - Gsus4/E7)
  private chords = [
    [261.63, 329.63, 392.0, 493.88], // C, E, G, B (Cmaj7)
    [220.0, 261.63, 329.63, 392.0],  // A, C, E, G (Am7)
    [174.61, 220.0, 261.63, 349.23], // F, A, C, F (Fmaj)
    [196.0, 246.94, 293.66, 392.0]   // G, B, D, G (Gmaj)
  ];

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start() {
    this.init();
    if (this.isPlaying || !this.ctx) return;
    this.isPlaying = true;
    this.playNextArpeggio();
    this.timer = window.setInterval(() => {
      if (this.isPlaying) {
        this.playNextArpeggio();
      }
    }, 2800);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private playNextArpeggio() {
    if (!this.ctx || !this.isPlaying) return;
    const chord = this.chords[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    chord.forEach((freq, i) => {
      const noteDelay = i * 0.45;
      this.playNote(freq, this.ctx!.currentTime + noteDelay);
    });
  }

  private playNote(freq: number, startTime: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Warm triangle/sine blend for soft music-box / harp feel
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 3.3);
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const synthPlayer = new RomanticSynth();
