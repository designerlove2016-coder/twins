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
    /* 
      CRITICAL REQUIREMENT:
      "وفي تغير اللغة خلي الجهة علي اليسار ثابتة خليه"
      Enforce dir="ltr" permanently on this top bar container so the Language toggle button
      remains strictly pinned to the physical LEFT corner regardless of whether Arabic or English is selected.
    */
    <div
      dir="ltr"
      style={{ direction: 'ltr' }}
      className="flex items-center justify-between px-4 py-2.5 text-xs bg-[#F8F7F2] dark:bg-[#080D0A] border-b border-slate-200/50 dark:border-slate-800/80 text-[#778078] max-w-md mx-auto w-full transition-colors select-none"
    >
      
      {/* 
        1. STRICTLY FIXED LEFT SIDE:
        Dynamic 3D Tactile Skeuomorphic Language Switcher (Permanently on the Left)
      */}
      <button
        onClick={onToggleLanguage}
        className="
          relative min-h-[38px] flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
          dark:from-[#1D2B22] dark:via-[#141E18] dark:to-[#0D1510]
          border border-white/95 dark:border-[#10B981]/40
          shadow-[0_3px_0_0_#CFC6B4,0_6px_10px_rgba(0,0,0,0.06)]
          dark:shadow-[0_3px_0_0_#062316,0_0_8px_rgba(16,185,129,0.15)]
          active:translate-y-0.5 active:shadow-[0_1px_0_0_#CFC6B4]
          dark:active:shadow-[0_1px_0_0_#062316]
          hover:brightness-105 transition-all cursor-pointer overflow-hidden shrink-0
        "
        aria-label="Toggle language"
        title={language === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
      >
        {/* Top specular glossy highlight sheen */}
        <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/90 via-white/25 to-transparent pointer-events-none" />
        
        <Globe size={15} className="text-[#0B5D3B] dark:text-[#10B981] relative z-10 shrink-0" />
        <span className="font-black text-[#1A251E] dark:text-[#E8F7EE] relative z-10 text-[11px] tracking-wide">
          {language === 'en' ? 'العربية' : 'English'}
        </span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#0B5D3B]/10 dark:bg-[#10B981]/20 text-[#0B5D3B] dark:text-[#10B981] relative z-10">
          {language === 'en' ? 'EN' : 'AR'}
        </span>
      </button>

      {/* 
        2. STRICTLY FIXED RIGHT SIDE:
        Simulator, Saved Bookmarks Quick Link & Mysterious Dark Mode Toggle
      */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Saved Profiles Quick Link (Luxury 3D Tactile) */}
        {onOpenSaved && (
          <button
            type="button"
            onClick={onOpenSaved}
            className="
              relative min-h-[38px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border transition-all cursor-pointer overflow-hidden
              bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
              dark:from-[#1D2B22] dark:via-[#141E18] dark:to-[#0D1510]
              border-white/95 dark:border-[#10B981]/30
              shadow-[0_3px_0_0_#CFC6B4,0_6px_10px_rgba(0,0,0,0.06)]
              dark:shadow-[0_3px_0_0_#062316]
              active:translate-y-0.5 active:shadow-[0_1px_0_0_#CFC6B4]
            "
            title={language === 'ar' ? 'الملفات المحفوظة' : 'Saved Profiles'}
            aria-label={language === 'ar' ? 'الملفات المحفوظة' : 'Saved Profiles'}
          >
            <div className="absolute inset-x-1.5 top-0.5 h-[38%] rounded-full bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
            <Bookmark size={14} className={`${savedCount > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#778078]'} relative z-10`} />
            <span className="text-[11px] font-black font-mono text-[#1A251E] dark:text-[#E8F7EE] relative z-10">
              {savedCount}
            </span>
          </button>
        )}

        {/* Empty state simulation toggle (Tactile Pill) */}
        <button
          type="button"
          onClick={onToggleSimulateNoMatch}
          title="Toggle Empty Match State for Testing"
          className={`
            relative min-h-[38px] px-3 py-1.5 rounded-full text-[10px] font-black border transition-all cursor-pointer overflow-hidden
            ${
              simulateNoMatch
                ? 'bg-gradient-to-b from-[#137A4F] to-[#0B5D3B] text-white border-[#0B5D3B] shadow-[0_3px_0_0_#062A1A]'
                : 'bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC] dark:from-[#1D2B22] dark:to-[#0D1510] border-white/90 dark:border-white/10 text-[#4A554E] dark:text-slate-300 shadow-[0_3px_0_0_#CFC6B4] dark:shadow-[0_3px_0_0_#062316]'
            }
            active:translate-y-0.5
          `}
        >
          <div className="absolute inset-x-1.5 top-0.5 h-[38%] rounded-full bg-gradient-to-b from-white/80 via-white/15 to-transparent pointer-events-none" />
          <span className="relative z-10">
            {language === 'ar'
              ? (simulateNoMatch ? 'وضع: فارغ' : 'وضع: تطابق')
              : (simulateNoMatch ? 'Empty ON' : 'Matches ON')}
          </span>
        </button>

        {/* Mysterious Dark Mode Toggle Button (3D tactile embossed with emerald & gold glow) */}
        <button
          type="button"
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          className="
            relative min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full
            bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
            dark:from-[#1E2E24] dark:via-[#142018] dark:to-[#0A130E]
            border border-white/90 dark:border-[#10B981]/50
            shadow-[0_3px_0_0_#CFC6B4,0_6px_10px_rgba(0,0,0,0.06)]
            dark:shadow-[0_3px_0_0_#062316,0_0_12px_rgba(16,185,129,0.3)]
            active:translate-y-0.5 active:shadow-[0_1px_0_0_#CFC6B4]
            dark:active:shadow-[0_1px_0_0_#062316]
            hover:brightness-105 transition-all cursor-pointer overflow-hidden
          "
          aria-label="Toggle mysterious dark mode"
          title={theme === 'dark' ? (language === 'ar' ? 'التحويل للوضع النهاري ☀️' : 'Switch to Light Mode ☀️') : (language === 'ar' ? 'التحويل للوضع الغامض الفاخر 🌙' : 'Switch to Mysterious Dark Mode 🌙')}
        >
          <div className="absolute inset-x-1.5 top-0.5 h-[38%] rounded-full bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
          {theme === 'dark' ? (
            <Sun size={17} className="text-[#D4AF37] relative z-10 drop-shadow-[0_0_4px_rgba(212,175,55,0.8)]" />
          ) : (
            <Moon size={16} className="text-[#0B5D3B] hover:text-[#08422A] relative z-10" />
          )}
        </button>
      </div>

    </div>
  );
};
