import React from 'react';
import { 
  Home, 
  Clock, 
  BookHeart, 
  Mail, 
  Sparkles, 
  Heart, 
  Gift, 
  Cake, 
  Play,
  Pause,
  Compass
} from 'lucide-react';
import { ActiveSection } from '../types';

interface NavbarProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenSettings?: () => void;
}

export const NAV_SECTIONS: { id: ActiveSection; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'الرئيسية', icon: Home },
  { id: 'our-time', label: 'وقتنا', icon: Clock },
  { id: 'our-story', label: 'حكايتنا', icon: BookHeart },
  { id: 'secret-letter', label: 'الرسالة السرية', icon: Mail },
  { id: 'our-universe', label: 'عالمنا', icon: Compass },
  { id: '100-reasons', label: '100 سبب', icon: Heart },
  { id: 'open-when', label: 'افتحي عندما', icon: Sparkles },
  { id: 'make-a-wish', label: 'تمني أمنية', icon: Cake },
  { id: 'five-gifts', label: 'الهدايا', icon: Gift },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  isPlayingMusic,
  onToggleMusic,
  onOpenSettings,
}) => {
  return (
    <>
      {/* Top Bar (Unified for Desktop and Mobile) */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-950/40 px-4 md:px-8 py-3 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Wordmark (Single text element as required) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectSection('home')}
              className="text-right group focus:outline-none"
            >
              <span className="font-display italic text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-rose-200 via-rose-300 to-pink-400 bg-clip-text text-transparent group-hover:opacity-90">
                Her Universe
              </span>
              <span className="text-rose-500 mr-1 inline-block animate-pulse">❤️</span>
            </button>
          </div>

          {/* Desktop Navigation Links (Clean text links without capsule clutter) */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
            {NAV_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => onSelectSection(sec.id)}
                  className={`flex items-center gap-1.5 py-1 transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'text-rose-300 font-bold'
                      : 'text-neutral-400 hover:text-rose-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-neutral-400'}`} />
                  <span>{sec.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Music Pill & Settings Button */}
          <div className="flex items-center gap-2.5">
            {/* Music Player Mini Controller */}
            <button
              onClick={onToggleMusic}
              title={isPlayingMusic ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 ${
                isPlayingMusic
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-200 shadow-sm shadow-rose-900/40'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-rose-200'
              }`}
            >
              {isPlayingMusic ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">يعمل الآن</span>
                  {/* Visualizer micro-bars */}
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 h-2.5 bg-rose-400 animate-pulse" />
                    <span className="w-0.5 h-3.5 bg-rose-300 animate-bounce" />
                    <span className="w-0.5 h-1.5 bg-rose-400 animate-pulse" />
                  </div>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-rose-300 ml-0.5" />
                  <span>موسيقى</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Scrollable Quick Nav Bar (Below header or ergonomic bottom bar) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-xl border-t border-rose-950/40 px-2 py-2">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {NAV_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onSelectSection(sec.id)}
                className={`flex flex-col items-center justify-center min-w-[58px] py-1 px-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-rose-300 bg-rose-950/40 font-bold scale-105'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-rose-400' : 'text-neutral-400'}`} />
                <span className="text-[10px] whitespace-nowrap leading-tight">{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
