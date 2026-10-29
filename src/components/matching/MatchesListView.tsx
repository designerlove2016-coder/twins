import React from 'react';
import { MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { SpringTiltCard } from '../common/SpringTiltCard';
import { formatInterest, formatCity } from '../../utils/localization';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  HandMetal,
} from 'lucide-react';

interface MatchesListViewProps {
  matches: MatchProfile[];
  language: Language;
  onSelectMatch: (match: MatchProfile) => void;
  onCompareMatch: (match: MatchProfile) => void;
  onFindTwinCTA: () => void;
  savedProfileIds?: string[];
  onToggleSaveProfile?: (matchId: string) => void;
  onSendWave?: (match: MatchProfile) => void;
  onFilterByInterest?: (interest: string) => void;
}

export const MatchesListView: React.FC<MatchesListViewProps> = ({
  matches,
  language,
  onSelectMatch,
  onCompareMatch,
  onFindTwinCTA,
  savedProfileIds = [],
  onToggleSaveProfile,
  onSendWave,
  onFilterByInterest,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#080D0A] text-[#202923] dark:text-[#F8F7F2] pb-28 transition-colors">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#202923] dark:text-white">
              {t.topMatchesTitle}
            </h1>
            <p className="text-xs text-[#778078] dark:text-slate-400 mt-1">
              {t.topMatchesSubtitle}
            </p>
          </div>

          {/* 3D Tactile Find Twin CTA Pill Button */}
          <button
            type="button"
            onClick={onFindTwinCTA}
            className="
              relative px-4 py-2 rounded-full
              bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
              text-white text-xs font-bold
              border border-[#34D399]/50
              shadow-[0_4px_0_0_#052E1C,0_8px_16px_rgba(11,93,59,0.35)]
              active:translate-y-1 active:shadow-[0_1px_0_0_#052E1C]
              flex items-center gap-1.5 shrink-0 cursor-pointer overflow-hidden
            "
          >
            <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
            <Sparkles size={14} className="text-[#D4AF37] relative z-10 animate-pulse" />
            <span className="relative z-10">{t.findTwinCTA}</span>
          </button>
        </div>
      </div>

      {/* Matches Stack with Organic Floating Cards & 3D Parallax Tilt */}
      <main className="px-5 space-y-4 mt-2">
        {matches.map((match, index) => {
          const isTopOne = index === 0;
          const isSaved = savedProfileIds.includes(match.id);

          return (
            <OrganicFloatingCard
              key={match.id}
              className={`p-4 transition-all duration-200 ${
                isTopOne
                  ? 'border-2 border-[#0B5D3B] dark:border-[#10b981] ring-4 ring-[#0B5D3B]/10'
                  : 'border border-slate-200/80 dark:border-slate-800'
              }`}
              glowColor={isTopOne ? 'rgba(212, 175, 55, 0.2)' : 'rgba(11, 93, 59, 0.12)'}
              floatDelay={index % 2 === 1}
            >
              {/* Card Upper Body: Hero Avatar (sized exactly to user's red rectangle: 124px) + Details & Interest Tags */}
              <div className="flex items-center gap-3.5">
                {/* Grand Cutout Character standing on card (matching user Image 2 exactly) */}
                <div
                  className="relative shrink-0 cursor-pointer group"
                  onClick={() => onSelectMatch(match)}
                >
                  <AvatarRenderer
                    avatar={match.avatar}
                    size={108}
                    variant={match.avatar.cutoutUrl ? 'cutout' : (match.avatar.stickerUrl ? 'cutout' : 'circle')}
                    direction="center"
                  />
                  {isTopOne && (
                    <span className="
                      absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full
                      bg-gradient-to-r from-[#F59E0B] via-[#D4AF37] to-[#F59E0B]
                      text-white text-[9px] font-black uppercase tracking-wider
                      flex items-center gap-0.5 shadow-md border-2 border-white dark:border-[#131D16]
                      ring-2 ring-amber-300/40 animate-pulse z-20
                    ">
                      <span>★</span>
                      <span>{language === 'ar' ? 'شبيهك #1' : '#1'}</span>
                    </span>
                  )}
                  {/* Subtle active status indicator */}
                  <span className="absolute bottom-1 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131D16] shadow-sm z-20" />
                </div>

                {/* Info Column: Username, Score, City/Age, and Shared Interest Pills */}
                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                  {/* Header Row: Username + Score Pill & Bookmark */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 cursor-pointer" onClick={() => onSelectMatch(match)}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="text-base font-black text-[#1A251E] dark:text-white truncate">
                          @{match.username}
                        </h2>
                        {isTopOne && (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[8.5px] font-black text-[#9A7410] dark:text-[#F3D768] uppercase tracking-wider">
                            {language === 'ar' ? 'أعلى تطابق' : 'TOP MATCH'}
                          </span>
                        )}
                      </div>
                      {/* Localized metadata */}
                      <div className="flex items-center gap-1.5 text-xs text-[#69726A] dark:text-slate-300 mt-1 font-medium">
                        <span>{formatCity(match.city, language)}</span>
                        {match.ageRange && (
                          <>
                            <span aria-hidden="true" className="text-slate-400">·</span>
                            <span>{match.ageRange}</span>
                          </>
                        )}
                      </div>

                      {/* Distinct Twin Badge to catch the eye */}
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F7EE] dark:bg-[#0B5D3B]/35 border border-[#0B5D3B]/20 text-[10px] font-black text-[#0B5D3B] dark:text-[#34D399]">
                        <Sparkles size={11} className="text-[#D4AF37] shrink-0" />
                        <span>{language === 'ar' ? 'شخصية متوافقة' : 'Compatible Twin'}</span>
                      </div>
                    </div>

                    {/* Similarity Score 3D Capsule Pillar & Bookmark Button */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="px-2.5 py-1 rounded-2xl bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/50 border border-white/80 dark:border-[#0B5D3B]/30 shadow-[0_2px_0_0_#A8D5C0] dark:shadow-[0_2px_0_0_#052A1A] flex flex-col items-center">
                        <span className="text-lg font-black text-[#0B5D3B] dark:text-[#10b981] font-mono tabular-nums leading-none">
                          {match.similarityScore}%
                        </span>
                        <span className="text-[8.5px] font-bold uppercase tracking-wider text-[#0B5D3B] dark:text-[#DDF3E7] mt-0.5">
                          {language === 'ar' ? 'تطابق' : 'Overlap'}
                        </span>
                      </div>

                      {/* Bookmark Button */}
                      {onToggleSaveProfile && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveProfile(match.id);
                          }}
                          className={`
                            min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl
                            border transition-all duration-150 transform-gpu active:translate-y-0.5 cursor-pointer
                            ${
                              isSaved
                                ? 'bg-gradient-to-b from-[#FFF9E6] to-[#FBE7AF] dark:from-[#2F2612] dark:to-[#221C0B] border-[#D4AF37]/60 text-[#D4AF37] shadow-[0_2px_0_0_#BFA032]'
                                : 'bg-white/80 dark:bg-white/5 border-slate-200 dark:border-slate-800 text-[#778078] hover:text-[#0B5D3B]'
                            }
                          `}
                          title={isSaved ? t.unsaveProfile : t.saveProfile}
                          aria-label={isSaved ? t.unsaveProfile : t.saveProfile}
                        >
                          <Bookmark size={15} className={isSaved ? 'fill-[#D4AF37] text-[#D4AF37]' : ''} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Shared Interests Ceramic Micro-Capsule Row */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {match.sharedInterests.slice(0, 2).map((tag, i) => (
                      <SpringTiltCard key={i} maxTilt={10} scaleOnHover={1.05}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onFilterByInterest && onFilterByInterest(tag);
                          }}
                          className="
                            inline-block px-3 py-1 rounded-full
                            bg-[#E8F7EE] dark:bg-[#122A1E]
                            text-[#07472B] dark:text-[#34D399] text-[10.5px] font-black
                            border border-[#0B5D3B]/30 dark:border-[#10B981]/50
                            shadow-[0_2px_0_0_#B5E2CA] dark:shadow-[0_2px_0_0_#061D13]
                            hover:scale-105 active:scale-95 cursor-pointer transition-all
                          "
                          title={language === 'ar' ? 'اضغط للاستكشاف' : 'Click to explore'}
                        >
                          {formatInterest(tag, language)}
                        </button>
                      </SpringTiltCard>
                    ))}
                    {match.sharedInterests.length > 2 && (
                      <span className="px-1.5 py-0.5 text-[10px] text-[#07472B] dark:text-[#34D399] font-black self-center">
                        +{match.sharedInterests.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Bio, Say Hi & 3D Tactile Compare Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {onSendWave && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendWave(match);
                      }}
                      className="
                        px-2.5 py-1.5 rounded-xl
                        bg-white/90 dark:bg-[#18221C]
                        border border-slate-200 dark:border-slate-800
                        hover:border-[#0B5D3B]/40
                        text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7]
                        flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all
                      "
                      title={t.sayHi}
                    >
                      <HandMetal size={13} className="text-[#D4AF37]" />
                      <span>{t.sayHi}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMatch(match);
                    }}
                    className="text-xs font-bold text-[#778078] dark:text-slate-300 hover:text-[#0B5D3B] transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'عرض النبذة' : 'View Bio'}
                  </button>
                </div>

                <button
                  type="button"
                  id={`compare-btn-${match.id}`}
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
                    relative z-20 min-h-[44px] px-4 py-2 rounded-2xl
                    bg-gradient-to-b from-[#168858] via-[#0B5D3B] to-[#073D26]
                    dark:from-[#199863] dark:via-[#0E6D46] dark:to-[#073D26]
                    text-white text-xs font-black
                    border-2 border-[#29B076]/70 dark:border-[#34D399]/60
                    shadow-[0_4px_0_0_#052E1C,0_8px_16px_rgba(11,93,59,0.35)]
                    hover:brightness-105
                    active:translate-y-1 active:shadow-[0_0px_0_0_#052E1C]
                    flex items-center gap-2 cursor-pointer overflow-hidden
                  "
                >
                  <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
                  <Layers size={16} className="relative z-10" />
                  <span className="relative z-10">{t.comparePersonalities}</span>
                  {language === 'ar' ? (
                    <ArrowLeft size={15} className="relative z-10" />
                  ) : (
                    <ArrowRight size={15} className="relative z-10" />
                  )}
                </button>
              </div>
            </OrganicFloatingCard>
          );
        })}
      </main>
    </div>
  );
};
