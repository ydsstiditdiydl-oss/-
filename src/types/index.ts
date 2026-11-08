export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  personalMessage?: string;
  imageUrl?: string;
}

export interface MemoryPhoto {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  caption: string;
  rotation?: number;
}

export interface OpenWhenItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  message: string;
  accentColor: string;
}

export interface StarSecret {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  title: string;
  message: string;
  constellation?: string;
}

export interface AppData {
  herName: string;
  herBirthDate: string; // "2010-11-09"
  myBirthDate: string;  // "2010-04-22"
  meetingDate: string;   // "2026-03-20"
  
  // Music
  songTitle: string;
  songArtist: string;
  songCoverUrl: string;
  customAudioUrl?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;

  // Letters
  secretLetterContent: string;
  finalSurpriseMessage: string;

  // Items
  timelineEvents: TimelineEvent[];
  memories: MemoryPhoto[];
  reasons100: string[];
  openWhenItems: OpenWhenItem[];
  wishJarItems: string[];
  starSecrets: StarSecret[];
}

export type ActiveSection = 
  | 'home' 
  | 'our-time' 
  | 'our-story' 
  | 'our-memories' 
  | 'our-song' 
  | 'secret-letter' 
  | 'our-universe' 
  | '100-reasons' 
  | 'open-when' 
  | 'make-a-wish' 
  | 'five-gifts';
