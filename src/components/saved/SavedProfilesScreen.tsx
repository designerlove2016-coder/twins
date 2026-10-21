import React, { useState } from 'react';
import { MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { SpringTiltCard } from '../common/SpringTiltCard';
import { RealisticIcon } from '../common/RealisticIcon';
import { formatCity, formatInterest } from '../../utils/localization';
import {
  Bookmark,
  Layers,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Compass,
  HandMetal,
} from 'lucide-react';

interface SavedProfilesScreenProps {
  savedMatches: MatchProfile[];
  language: Language;
  onSelectMatch: (match: MatchProfile) => void;
  onCompareMatch: (match: MatchProfile) => void;
  onToggleSaveProfile: (matchId: string) => void;
  onDiscoverMore: () => void;
  onSendWave: (match: MatchProfile) => void;
  onBack?: () => void;
}

export const SavedProfilesScreen: React.FC<SavedProfilesScreenProps> = ({
  savedMatches,
  language,
  onSelectMatch,
  onCompareMatch,
  onToggleSaveProfile,
  onDiscoverMore,
  onSendWave,
  onBack,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const cities = ['all', ...Array.from(new Set(savedMatches.map((m) => m.city)))];

  const filteredMatches = savedMatches.filter((m) => {
    if (selectedCity !== 'all' && m.city !== selectedCity) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] pb-28 transition-colors">
      
      {/* 1. Header */}
      <header className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                aria-label="Back"
              >
                {language === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#202923] dark:text-white">
                  {t.savedProfilesTitle}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#B8961D] dark:text-[#F3D768] text-xs font-black font-mono">
                  {savedMatches.length}
                </span>
              </div>
              <p className="text-xs text-[#778078] dark:text-slate-400 mt-0.5">
                {t.savedProfilesSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onDiscoverMore}
            className="
              relative min-h-[38px] px-3 py-1.5 rounded-full
              bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
              dark:from-[#1E2721] dark:to-[#121814]
              border border-white/90 dark:border-white/10
              shadow-[0_3px_0_0_#D5CEBE] dark:shadow-[0_3px_0_0_#0D130F]
              active:translate-y-0.5
              flex items-center gap-1.5 text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7]
              cursor-pointer overflow-hidden
            "
          >
            <Compass size={14} />
            <span>{t.exploreMembers}</span>
          </button>
        </div>
      </header>

      {/* 2. City Filter Chips if more than 1 city */}
      {cities.length > 2 && (
        <div className="px-5 py-2">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-[#778078] uppercase shrink-0">
              {language === 'ar' ? 'المدينة:' : 'City:'}
            </span>
            {cities.map((city) => {
              const active = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-bold transition-all duration-150 transform-gpu active:translate-y-0.5 cursor-pointer
                    ${
                      active
                        ? 'bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/50 text-[#0B5D3B] dark:text-[#DDF3E7] border border-white/80 dark:border-[#0B5D3B]/30 shadow-[0_2px_0_0_#A8D5C0]'
                        : 'bg-white/80 dark:bg-white/5 text-[#778078] dark:text-slate-400 hover:text-[#202923] border border-slate-200/60 dark:border-slate-800'
                    }
                  `}
                >
                  {city === 'all' ? (language === 'ar' ? 'الكل' : 'All') : formatCity(city, language)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Empty State or Profiles List */}
      <main className="px-5 space-y-4 mt-2 flex-1">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/25 flex items-center justify-center text-[#D4AF37] mb-4 shadow-md">
              <Bookmark size={32} className="fill-[#D4AF37]" />
            </div>

            <h2 className="text-base font-bold text-[#202923] dark:text-white">
              {t.noSavedProfilesTitle}
            </h2>
            <p className="mt-1.5 text-xs text-[#778078] dark:text-slate-400 max-w-xs leading-relaxed">
              {t.noSavedProfilesSubtitle}
            </p>

            <button
              type="button"
              onClick={onDiscoverMore}
              className="
                mt-6 px-5 py-2.5 rounded-full
                bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
                text-white text-xs font-bold
                border border-[#34D399]/50
                shadow-[0_4px_0_0_#052E1C,0_8px_16px_rgba(11,93,59,0.3)]
                active:translate-y-1 active:shadow-[0_1px_0_0_#052E1C]
                flex items-center gap-2 cursor-pointer overflow-hidden
              "
            >
              <Compass size={15} />
              <span>{t.exploreMembers}</span>
            </button>
          </div>
        ) : (
          filteredMatches.map((match, idx) => (
            <OrganicFloatingCard
              key={match.id}
              className="p-4 border border-slate-200/80 dark:border-slate-800"
              floatDelay={idx % 2 === 1}
            >
              {/* Card Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => onSelectMatch(match)}
                >
                  <AvatarRenderer avatar={match.avatar} size={54} direction="center" />
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-[#202923] dark:text-white truncate">
                      @{match.username}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-[#778078] dark:text-slate-400 mt-0.5">
                      <MapPin size={12} className="text-[#0B5D3B]" />
                      <span>{formatCity(match.city, language)}</span>
                      {match.ageRange && (
                        <>
                          <span>·</span>
                          <span>{match.ageRange}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Similarity Score Pill */}
                  <div className="px-3 py-1 rounded-2xl bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/50 text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-black font-mono shadow-[0_3px_0_0_#A8D5C0] dark:shadow-[0_3px_0_0_#052A1A]">
                    {match.similarityScore}%
                  </div>

                  {/* Bookmark Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveProfile(match.id);
                    }}
                    className="
                      min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl
                      bg-gradient-to-b from-[#FFF9E6] to-[#FBE7AF] dark:from-[#2F2612] dark:to-[#221C0B]
                      border border-[#D4AF37]/50
                      text-[#D4AF37] shadow-[0_2px_0_0_#BFA032]
                      active:translate-y-0.5 active:shadow-[0_1px_0_0_#BFA032]
                      cursor-pointer transition-all
                    "
                    title={t.unsaveProfile}
                    aria-label={t.unsaveProfile}
                  >
                    <Bookmark size={16} className="fill-[#D4AF37]" />
                  </button>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="mt-2 text-xs text-[#778078] dark:text-slate-400 line-clamp-1 italic">
                "{match.bio}"
              </p>

              {/* Shared Interests Row with High Contrast */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {match.sharedInterests.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="
                      px-2.5 py-0.5 rounded-full
                      bg-[#E8F7EE] dark:bg-[#122A1E]
                      text-[#07472B] dark:text-[#34D399] text-[10px] font-black
                      border border-[#0B5D3B]/30 dark:border-[#10B981]/50
                      shadow-2xs
                    "
                  >
                    {formatInterest(tag, language)}
                  </span>
                ))}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendWave(match);
                  }}
                  className="
                    px-3 py-1.5 rounded-xl
                    bg-white/90 dark:bg-[#18221C]
                    border border-slate-200 dark:border-slate-800
                    hover:border-[#0B5D3B]/40
                    text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7]
                    flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all
                  "
                >
                  <HandMetal size={13} className="text-[#D4AF37]" />
                  <span>{t.sayHi}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMatch(match);
                    }}
                    className="text-xs font-bold text-[#778078] dark:text-slate-300 hover:text-[#0B5D3B] cursor-pointer"
                  >
                    {language === 'ar' ? 'عرض النبذة' : 'View Bio'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                          navigator.vibrate([25, 35]);
                        }
                      } catch {
                        // ignore
                      }
                      onCompareMatch(match);
                    }}
                    className="
                      relative z-20 px-3.5 py-1.5 rounded-xl
                      bg-gradient-to-b from-[#168858] via-[#0B5D3B] to-[#073D26]
                      dark:from-[#199863] dark:via-[#0E6D46] dark:to-[#073D26]
                      text-white text-xs font-black
                      border-2 border-[#29B076]/70 dark:border-[#34D399]/60
                      shadow-[0_3px_0_0_#052E1C,0_6px_12px_rgba(11,93,59,0.35)]
                      hover:brightness-105 active:translate-y-0.5 active:shadow-none
                      flex items-center gap-1.5 cursor-pointer overflow-hidden
                    "
                  >
                    <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
                    <Layers size={13} className="relative z-10" />
                    <span className="relative z-10">{t.comparePersonalities}</span>
                  </button>
                </div>
              </div>
            </OrganicFloatingCard>
          ))
        )}
      </main>
    </div>
  );
};
