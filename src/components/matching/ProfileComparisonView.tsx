import React, { useState } from 'react';
import { UserProfile, MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { ONBOARDING_QUESTIONS } from '../../data/questions';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { RealisticIcon } from '../common/RealisticIcon';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { formatCity } from '../../utils/localization';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Heart,
  Zap,
  X,
  Bookmark,
  Share2,
} from 'lucide-react';

interface ProfileComparisonViewProps {
  userProfile: UserProfile;
  match: MatchProfile;
  language: Language;
  onBack: () => void;
  onLaunchCollisionExperience?: () => void;
  isSaved?: boolean;
  onToggleSave?: (matchId: string) => void;
  onShareComparison?: () => void;
}

export const ProfileComparisonView: React.FC<ProfileComparisonViewProps> = ({
  userProfile,
  match,
  language,
  onBack,
  isSaved = false,
  onToggleSave,
  onShareComparison,
}) => {
  const t = TRANSLATIONS[language];
  const [showCollisionModal, setShowCollisionModal] = useState(false);

  // Helper to format answers
  const getAnswerLabel = (questionId: string, answerVal: string | string[] | undefined) => {
    if (!answerVal) return null;
    const question = ONBOARDING_QUESTIONS.find((q) => q.id === questionId);
    if (!question) return String(answerVal);

    if (Array.isArray(answerVal)) {
      if (answerVal.length === 0) return null;
      return answerVal
        .map((id) => {
          const opt = question.options.find((o) => o.id === id);
          return opt ? (language === 'ar' ? opt.labelAr : opt.labelEn) : id;
        })
        .join(', ');
    }

    const opt = question.options.find((o) => o.id === answerVal);
    return opt ? (language === 'ar' ? opt.labelAr : opt.labelEn) : String(answerVal);
  };

  // Check relationship type
  const getComparisonStatus = (
    userAns: string | string[] | undefined,
    matchAns: string | string[] | undefined
  ) => {
    if (!userAns || !matchAns) {
      return { type: 'missing', label: t.emptyNotice };
    }

    if (Array.isArray(userAns) && Array.isArray(matchAns)) {
      const common = userAns.filter((item) => matchAns.includes(item) && item !== 'sport_none');
      if (common.length > 0) {
        return {
          type: 'exact',
          label: `${common.length} ${language === 'ar' ? 'رياضات مشتركة' : 'Shared sports'}`,
        };
      }
      return { type: 'different', label: t.divergentBadge };
    }

    if (userAns === matchAns) {
      return { type: 'exact', label: t.matchBadge };
    }

    return { type: 'different', label: t.divergentBadge };
  };

  // Find all exact matching items to feature in the confrontation collision
  const exactMatches = ONBOARDING_QUESTIONS.filter((q) => {
    const u = userProfile.answers[q.id];
    const m = match.answers[q.id];
    if (!u || !m) return false;
    if (Array.isArray(u) && Array.isArray(m)) {
      return u.some((item) => m.includes(item) && item !== 'sport_none');
    }
    return u === m;
  });

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] pb-28 transition-colors">
      
      {/* 1. TOP APP BAR */}
      <header className="sticky top-0 z-40 bg-[#F8F7F2]/95 dark:bg-[#111813]/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          aria-label="Back"
        >
          {language === 'ar' ? <ArrowRight size={22} /> : <ArrowLeft size={22} />}
        </button>

        <h1 className="text-sm font-bold text-[#202923] dark:text-white truncate">
          {t.comparisonTitle}
        </h1>

        <div className="flex items-center gap-2">
          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(match.id)}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer
                ${
                  isSaved
                    ? 'bg-[#FFF9E6] dark:bg-[#2F2612] text-[#D4AF37] border-[#D4AF37]/50 shadow-xs'
                    : 'bg-white dark:bg-[#1E2721] text-slate-500 border-slate-200 dark:border-slate-800'
                }
              `}
              title={isSaved ? t.unsaveProfile : t.saveProfile}
            >
              <Bookmark size={16} className={isSaved ? 'fill-[#D4AF37]' : ''} />
            </button>
          )}

          {onShareComparison && (
            <button
              type="button"
              onClick={onShareComparison}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1E2721] border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title={t.shareTwinComparison}
            >
              <Share2 size={16} />
            </button>
          )}
        </div>
      </header>

      {/* 2. DUAL-COLUMN HERO HEADER (FACING AVATARS IN AN ORGANIC FLOATING CARD) */}
      <div className="px-4 pt-3 pb-2">
        <OrganicFloatingCard
          className="p-4 border border-[#0B5D3B]/25"
          glowColor="rgba(212, 175, 55, 0.2)"
        >
          {/* Dual Columns Structure with Central Dividing Spine */}
          <div className="grid grid-cols-7 items-center">
            
            {/* Left Column Head: You */}
            <div className="col-span-3 flex flex-col items-center text-center">
              <AvatarRenderer avatar={userProfile.avatar} size={66} direction="right" />
              <span className="mt-1.5 text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7] truncate max-w-[100px]">
                {t.youLabel}
              </span>
              <span className="text-[10px] text-[#778078]">{formatCity(userProfile.city, language)}</span>
            </div>

            {/* Central Similarity Percentage Hub & Vertical Dividing Spine */}
            <div className="col-span-1 flex flex-col items-center justify-center px-0.5">
              <span className="text-xl font-black text-[#0B5D3B] dark:text-[#10b981] font-mono tabular-nums leading-none">
                {match.similarityScore}%
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#D4AF37] mt-0.5 text-center leading-none">
                {language === 'ar' ? 'تطابق' : 'MATCH'}
              </span>
              <div className="mt-1.5 w-full h-1 bg-[#D4AF37] rounded-full shadow-2xs" />
            </div>

            {/* Right Column Head: The Twin Match */}
            <div className="col-span-3 flex flex-col items-center text-center">
              <AvatarRenderer avatar={match.avatar} size={66} direction="left" />
              <span className="mt-1.5 text-xs font-bold text-[#202923] dark:text-white truncate max-w-[100px]">
                @{match.username}
              </span>
              <span className="text-[10px] text-[#778078]">{formatCity(match.city, language)}</span>
            </div>

          </div>
        </OrganicFloatingCard>

        {/* 
          3D TACTILE SKEUOMORPHIC "WATCH INTERESTS COLLIDE" CAPSULE BUTTON
          (As shown in image_b7d5a326.png)
        */}
        <div className="relative group w-full mt-2.5 select-none">
          {/* Ambient floor shadow */}
          <div className="absolute inset-x-4 bottom-0 h-4 rounded-full bg-[#0B5D3B]/30 blur-md pointer-events-none" />

          <button
            onClick={() => setShowCollisionModal(true)}
            className="
              relative w-full min-h-[48px] px-4 py-2.5 rounded-full
              bg-gradient-to-b from-[#E6F8EF] via-[#DDF3E7] to-[#C9EBD7]
              dark:from-[#0B5D3B]/40 dark:via-[#0B5D3B]/30 dark:to-[#08422A]/45
              border-2 border-[#0B5D3B]/50 dark:border-[#10b981]/50
              shadow-[0_5px_0_0_#9DCDB6,0_10px_18px_rgba(11,93,59,0.2)]
              dark:shadow-[0_5px_0_0_#062A1A]
              active:translate-y-1 active:shadow-[0_1px_0_0_#9DCDB6]
              dark:active:shadow-[0_1px_0_0_#062A1A]
              text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-extrabold
              flex items-center justify-center gap-2 cursor-pointer
              transition-all duration-150 transform-gpu overflow-hidden
            "
          >
            {/* Top specular glossy highlight sheen */}
            <div className="absolute inset-x-3 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none" />
            <Zap size={16} className="text-[#D4AF37] relative z-10 animate-pulse" />
            <span className="relative z-10">{t.watchCollision}</span>
          </button>
        </div>
      </div>

      {/* 3. CONTINUOUS FACING COMPARISON FEED WITH 3D TACTILE CARDS */}
      <main className="flex-1 px-4 py-3 space-y-4 overflow-y-auto no-scrollbar">
        {ONBOARDING_QUESTIONS.map((question) => {
          const userAns = userProfile.answers[question.id];
          const matchAns = match.answers[question.id];
          const userLabel = getAnswerLabel(question.id, userAns) || t.emptyNotice;
          const matchLabel = getAnswerLabel(question.id, matchAns) || t.emptyNotice;
          const status = getComparisonStatus(userAns, matchAns);

          const isExact = status.type === 'exact';
          const isMissing = status.type === 'missing';

          return (
            <div key={question.id} className="relative group select-none py-0.5">
              {/* Living floor shadow */}
              <div
                className={`absolute inset-x-3 bottom-0 h-3 rounded-2xl blur-md pointer-events-none ${
                  isExact ? 'bg-[#0B5D3B]/25' : 'bg-black/10 dark:bg-black/40'
                }`}
              />

              <div
                className={`
                  relative rounded-2xl overflow-hidden transition-all
                  bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
                  dark:from-[#1E2721] dark:via-[#18211B] dark:to-[#131915]
                  border border-white/90 dark:border-white/10
                  ${
                    isExact
                      ? 'shadow-[0_5px_0_0_#9DCDB6,0_10px_16px_rgba(11,93,59,0.15)] dark:shadow-[0_5px_0_0_#062A1A] ring-1 ring-[#0B5D3B]/30'
                      : 'shadow-[0_5px_0_0_#D3CBB9,0_10px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_5px_0_0_#0D130F,0_10px_16px_rgba(0,0,0,0.4)]'
                  }
                `}
              >
                {/* Top specular highlight sheen */}
                <div className="absolute inset-x-2 top-0.5 h-[35%] rounded-t-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent dark:from-white/10 dark:via-transparent pointer-events-none" />

                {/* Question / Category Header Axis */}
                <div className="relative z-10 px-3.5 py-2 bg-slate-50/70 dark:bg-[#151D18] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white dark:bg-[#18221C] flex items-center justify-center shrink-0 shadow-2xs">
                      <RealisticIcon name={question.options[0]?.iconKey || 'coffee'} size={18} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#778078] dark:text-slate-300">
                      {language === 'ar' ? question.titleAr : question.titleEn}
                    </span>
                  </div>

                  {/* Compatibility Badge */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isExact && <CheckCircle2 size={12} className="text-[#0B5D3B] dark:text-[#10b981]" />}
                    <span
                      className={`text-[10px] font-bold ${
                        isExact
                          ? 'text-[#0B5D3B] dark:text-[#DDF3E7]'
                          : isMissing
                          ? 'text-slate-400'
                          : 'text-[#D4AF37]'
                      }`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Two Facing Aligned Columns with Central Spine */}
                <div className="relative z-10 grid grid-cols-2">
                  
                  {/* Central Vertical Dividing Spine */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-slate-200 dark:bg-slate-700/80 z-10 pointer-events-none flex flex-col items-center justify-center">
                    {isExact && (
                      <div className="w-5 h-5 rounded-full bg-[#0B5D3B] text-white flex items-center justify-center text-[10px] shadow-xs">
                        ★
                      </div>
                    )}
                  </div>

                  {/* Left Side: You */}
                  <div
                    className={`p-3.5 flex flex-col justify-between transition-colors ${
                      isExact
                        ? 'bg-[#DDF3E7]/40 dark:bg-[#0B5D3B]/15 text-[#0B5D3B] dark:text-[#DDF3E7]'
                        : 'bg-transparent text-[#202923] dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-bold text-[#778078] uppercase tracking-wider">
                        {t.youLabel}
                      </span>
                      <span className="text-[10px] text-[#0B5D3B] font-bold opacity-70">➔</span>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed">
                      {userLabel}
                    </p>
                  </div>

                  {/* Right Side: Twin Match */}
                  <div
                    className={`p-3.5 flex flex-col justify-between transition-colors ${
                      isExact
                        ? 'bg-[#DDF3E7]/40 dark:bg-[#0B5D3B]/15 text-[#0B5D3B] dark:text-[#DDF3E7]'
                        : 'bg-transparent text-[#202923] dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-[#0B5D3B] font-bold opacity-70">🠔</span>
                      <span className="text-[9px] font-bold text-[#778078] uppercase tracking-wider">
                        @{match.username}
                      </span>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed">
                      {matchLabel}
                    </p>
                  </div>

                </div>

                {/* Shared Harmony Footer when exact match */}
                {isExact && (
                  <div className="relative z-10 px-3.5 py-1.5 bg-gradient-to-r from-[#DDF3E7]/80 to-[#CCEEDC]/80 dark:bg-[#0B5D3B]/25 border-t border-[#0B5D3B]/15 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7]">
                    <Heart size={11} className="fill-[#0B5D3B] text-[#0B5D3B]" />
                    <span>
                      {language === 'ar' ? 'كلاكما يفضل نفس الاختيار تماماً' : 'Both of you share this exact taste'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* 4. FIXED BOTTOM ACTION */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-[#F8F7F2] via-[#F8F7F2] to-transparent dark:from-[#111813] dark:via-[#111813] z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={onBack}
            className="
              relative w-full h-12 rounded-2xl
              bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
              text-white font-bold text-sm
              border border-[#34D399]/50
              shadow-[0_5px_0_0_#052E1C,0_10px_18px_rgba(11,93,59,0.3)]
              active:translate-y-1 active:shadow-[0_1px_0_0_#052E1C]
              flex items-center justify-center gap-2 cursor-pointer overflow-hidden
            "
          >
            {/* Top specular highlight sheen */}
            <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
            <span className="relative z-10">{t.doneBtn}</span>
          </button>
        </div>
      </footer>

      {/* 5. INTERACTIVE COLLISION OVERLAY MODAL */}
      {showCollisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#18221C] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-[#202923] dark:text-white">
                  {t.collisionArena}
                </h3>
              </div>
              <button
                onClick={() => setShowCollisionModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#778078] dark:text-slate-400 mt-2 text-center">
              {t.collisionArenaSubtitle}
            </p>

            {/* Facing Avatars at Top */}
            <div className="flex items-center justify-between px-6 py-4 my-2 bg-[#F8F7F2] dark:bg-[#111813] rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <div className="flex flex-col items-center">
                <AvatarRenderer avatar={userProfile.avatar} size={58} direction="right" />
                <span className="text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] mt-1">{t.youLabel}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-[#D4AF37]">⚡ VS ⚡</span>
                <span className="text-[9px] uppercase tracking-wider text-[#778078]">{match.similarityScore}% Match</span>
              </div>

              <div className="flex flex-col items-center">
                <AvatarRenderer avatar={match.avatar} size={58} direction="left" />
                <span className="text-[11px] font-bold text-[#202923] dark:text-white mt-1">@{match.username}</span>
              </div>
            </div>

            {/* Colliding Common Ground Cards */}
            <div className="space-y-2.5 my-3 max-h-[300px] overflow-y-auto no-scrollbar">
              {exactMatches.map((question) => {
                const ans = userProfile.answers[question.id];
                const label = getAnswerLabel(question.id, ans);
                const iconKey = question.options[0]?.iconKey || 'coffee';

                return (
                  <div
                    key={question.id}
                    className="relative p-3 rounded-2xl bg-[#DDF3E7]/50 dark:bg-[#0B5D3B]/20 border border-[#0B5D3B]/30 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#18221C] flex items-center justify-center shrink-0 shadow-2xs">
                        <RealisticIcon name={iconKey} size={22} />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                          {language === 'ar' ? question.titleAr : question.titleEn}
                        </span>
                        <span className="text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7]">
                          {label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7]">
                        {language === 'ar' ? 'تطابق تام' : 'Common'}
                      </span>
                      <CheckCircle2 size={14} className="text-[#0B5D3B] dark:text-[#10b981]" />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowCollisionModal(false)}
              className="mt-2 w-full py-3 rounded-2xl bg-[#0B5D3B] text-white text-xs font-bold shadow-md cursor-pointer active:scale-98"
            >
              {language === 'ar' ? 'إغلاق المواجهة' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
