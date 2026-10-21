import React from 'react';
import { Language, ThemeMode } from '../../types';
import { Globe, Moon, Sun, Bookmark } from 'lucide-react';

interface TopBarControlsProps {
  language: Language;
  onToggleLanguage: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  simulateNoMatch: boolean;
  onToggleSimulateNoMatch: () => void;
  savedCount?: number;
  onOpenSaved?: () => void;
}

export const TopBarControls: React.FC<TopBarControlsProps> = ({
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
  simulateNoMatch,
  onToggleSimulateNoMatch,
  savedCount = 0,
  onOpenSaved,
}) => {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 text-xs bg-[#F8F7F2] dark:bg-[#080D0A] border-b border-slate-200/40 dark:border-slate-800/80 text-[#778078] max-w-md mx-auto w-full transition-colors">
      
      {/* Dynamic 3D Tactile Language Switcher */}
      <button
        onClick={onToggleLanguage}
        className="
          relative min-h-[38px] flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
          dark:from-[#1E2721] dark:to-[#121814]
          border border-white/90 dark:border-white/10
          shadow-[0_3px_0_0_#D5CEBE,0_6px_10px_rgba(0,0,0,0.06)]
          dark:shadow-[0_3px_0_0_#0D130F]
          active:translate-y-0.5 active:shadow-[0_1px_0_0_#D5CEBE]
          hover:text-[#0B5D3B] transition-all cursor-pointer overflow-hidden
        "
        aria-label="Toggle language"
        title={language === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
      >
        <div className="absolute inset-x-2 top-0.5 h-[35%] rounded-full bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none" />
        <Globe size={15} className="text-[#0B5D3B] dark:text-[#10b981] relative z-10" />
        <span className="font-extrabold text-[#202923] dark:text-white relative z-10 text-[11px]">
          {language === 'en' ? 'العربية' : 'English'}
        </span>
      </button>

      {/* Simulator, Saved Bookmarks Quick Link & Dark Mode */}
      <div className="flex items-center gap-2">
        {/* Saved Profiles Quick Link */}
        {onOpenSaved && (
          <button
            type="button"
            onClick={onOpenSaved}
            className={`
              relative min-h-[38px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border transition-all cursor-pointer
              bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
              dark:from-[#1E2721] dark:to-[#121814]
              border-white/90 dark:border-white/10
              shadow-[0_3px_0_0_#D5CEBE] dark:shadow-[0_3px_0_0_#0D130F]
              active:translate-y-0.5
            `}
            title={language === 'ar' ? 'الملفات المحفوظة' : 'Saved Profiles'}
            aria-label={language === 'ar' ? 'الملفات المحفوظة' : 'Saved Profiles'}
          >
            <Bookmark size={14} className={`${savedCount > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#778078]'}`} />
            <span className="text-[10px] font-extrabold font-mono text-[#202923] dark:text-white">
              {savedCount}
            </span>
          </button>
        )}

        {/* Empty state simulation toggle */}
        <button
          onClick={onToggleSimulateNoMatch}
          title="Toggle Empty Match State for Testing"
          className={`
            relative px-2.5 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer
            ${
              simulateNoMatch
                ? 'bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-[0_2px_0_0_#052E1C]'
                : 'bg-white dark:bg-[#1E2721] border-slate-200 dark:border-slate-800 text-[#778078]'
            }
          `}
        >
          {language === 'ar'
            ? (simulateNoMatch ? 'وضع: فارغ' : 'وضع: تطابق')
            : (simulateNoMatch ? 'Empty ON' : 'Matches ON')}
        </button>

        {/* Mysterious Dark Mode Toggle Button (3D tactile embossed with emerald glow) */}
        <button
          type="button"
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          className="
            relative min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full
            bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
            dark:from-[#1E2E24] dark:to-[#101A14]
            border border-white/90 dark:border-[#10B981]/40
            shadow-[0_3px_0_0_#D5CEBE,0_6px_10px_rgba(0,0,0,0.06)]
            dark:shadow-[0_3px_0_0_#062316,0_0_12px_rgba(16,185,129,0.2)]
            active:translate-y-1 active:shadow-none
            text-slate-700 dark:text-[#D4AF37] hover:text-[#0B5D3B] dark:hover:text-[#10B981] transition-all cursor-pointer overflow-hidden
          "
          aria-label="Toggle mysterious dark mode"
          title={theme === 'dark' ? (language === 'ar' ? 'التحويل للوضع النهاري ☀️' : 'Switch to Light Mode ☀️') : (language === 'ar' ? 'التحويل للوضع الغامض الفاخر 🌙' : 'Switch to Mysterious Dark Mode 🌙')}
        >
          <div className="absolute inset-x-1.5 top-0.5 h-[35%] rounded-full bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none" />
          {theme === 'dark' ? (
            <Sun size={17} className="text-[#D4AF37] relative z-10 animate-spin-slow drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]" />
          ) : (
            <Moon size={16} className="text-slate-700 hover:text-[#0B5D3B] relative z-10" />
          )}
        </button>
      </div>
    </div>
  );
};
