import React, { useState } from 'react';
import { UserProfile, MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { ONBOARDING_QUESTIONS } from '../../data/questions';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { RealisticIcon } from '../common/RealisticIcon';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { PersonalityVibePolarChart } from './PersonalityVibePolarChart';
import { InterestHeatmap3DOverlay } from './InterestHeatmap3DOverlay';
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
  Radar,
  ListOrdered,
  Flame,
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
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'polar' | 'heatmap'>('feed');

  // Robust helper to format answers so IDs like leisure_cafe and place_cozycafe never appear raw
  const getSafeAnswerLabel = (questionId: string, answerVal: string | string[] | undefined): string => {
    if (!answerVal) return t.emptyNotice;

    const resolveVal = (val: string): string => {
      // 1. Try finding in current question
      const question = ONBOARDING_QUESTIONS.find((q) => q.id === questionId);
      if (question) {
        const opt = question.options.find((o) => o.id === val);
        if (opt) return language === 'ar' ? opt.labelAr : opt.labelEn;
      }
      // 2. Global search across all questions
      for (const anyQ of ONBOARDING_QUESTIONS) {
        const opt = anyQ.options.find((o) => o.id === val);
        if (opt) return language === 'ar' ? opt.labelAr : opt.labelEn;
      }
      // 3. Fallback clean label
      return val
        .replace(/^(q_|leisure_|place_|food_|coffee_|sport_|drink_|vibe_|car_|lifestyle_)/, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    if (Array.isArray(answerVal)) {
      if (answerVal.length === 0) return t.emptyNotice;
      return answerVal.map(resolveVal).join(', ');
    }

    return resolveVal(String(answerVal));
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
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] pb-28 transition-colors select-none">
      
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

          {/* Quick 3D Heatmap Overlay Trigger Button */}
          <button
            type="button"
            onClick={() => setShowHeatmapOverlay(true)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0B5D3B]/20 via-[#10B981]/25 to-amber-500/20 border border-[#10B981]/50 flex items-center justify-center text-[#10B981] hover:scale-105 transition-all cursor-pointer shadow-xs"
            title={language === 'ar' ? 'خريطة الشغف الحرارية 3D' : '3D Interest Heatmap Overlay'}
          >
            <Flame size={16} className="text-[#F59E0B] animate-pulse" />
          </button>

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
      <div className="px-4 pt-3 pb-2 space-y-2.5">
        <OrganicFloatingCard
          className="p-4 border border-[#0B5D3B]/25"
          glowColor="rgba(212, 175, 55, 0.2)"
        >
          {/* Dual Columns Structure with Central Dividing Spine */}
          <div className="grid grid-cols-7 items-center">
            
            {/* Left Column Head: You */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 rounded-2xl bg-white/75 dark:bg-[#1B2720]/70 border border-[#0B5D3B]/15 dark:border-[#10B981]/20 shadow-2xs">
              <AvatarRenderer avatar={userProfile.avatar} size={66} direction="right" />
              <span className="mt-1.5 text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7] truncate max-w-[100px]">
                {t.youLabel}
              </span>
              <span className="text-[10px] text-[#778078]">{formatCity(userProfile.city, language)}</span>
            </div>

            {/* Central Similarity Percentage Hub */}
            <div className="col-span-1 flex flex-col items-center justify-center px-0.5">
              <span className="text-xl font-black text-[#0B5D3B] dark:text-[#10b981] font-mono tabular-nums leading-none">
                {match.similarityScore}%
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-[#D4AF37] mt-0.5 text-center leading-none">
                {language === 'ar' ? 'تطابق' : 'MATCH'}
              </span>
              <div className="mt-1.5 w-full h-1 bg-[#D4AF37] rounded-full shadow-2xs" />
            </div>

            {/* Right Column Head: The Twin Match (Darker shade from his side - أغمق شوي من جهتو) */}
            <div className="col-span-3 flex flex-col items-center text-center p-2 rounded-2xl bg-[#E8E1D2]/85 dark:bg-[#121A15]/90 border border-[#BEB19A]/80 dark:border-white/10 shadow-inner">
              <AvatarRenderer avatar={match.avatar} size={66} direction="left" />
              <span className="mt-1.5 text-xs font-bold text-[#7A500C] dark:text-[#E2BD56] truncate max-w-[100px]">
                @{match.username}
              </span>
              <span className="text-[10px] text-[#69726A] dark:text-slate-400">{formatCity(match.city, language)}</span>
            </div>

          </div>
        </OrganicFloatingCard>

        {/* View Mode Toggle: Comparison Cards Feed vs D3 Polar Radar Chart vs 3D Heatmap */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-[#1A251E] border border-white/60 dark:border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab('feed')}
            className={`
              min-h-[38px] px-1.5 py-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer
              ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-b from-[#137A4F] to-[#0B5D3B] text-white shadow-md shadow-[#0B5D3B]/25 scale-[1.01]'
                  : 'text-[#778078] dark:text-slate-400 hover:text-[#202923] dark:hover:text-white'
              }
            `}
          >
            <ListOrdered size={14} />
            <span>{language === 'ar' ? 'المواجهة' : 'Facing Feed'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('polar')}
            className={`
              min-h-[38px] px-1.5 py-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer
              ${
                activeTab === 'polar'
                  ? 'bg-gradient-to-b from-[#137A4F] to-[#0B5D3B] text-white shadow-md shadow-[#0B5D3B]/25 scale-[1.01]'
                  : 'text-[#778078] dark:text-slate-400 hover:text-[#202923] dark:hover:text-white'
              }
            `}
          >
            <Radar size={14} className={activeTab === 'polar' ? 'text-[#D4AF37]' : ''} />
            <span>{language === 'ar' ? 'رادار الهالة' : 'Vibe Radar'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('heatmap')}
            className={`
              min-h-[38px] px-1.5 py-1 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer
              ${
                activeTab === 'heatmap'
                  ? 'bg-gradient-to-b from-[#137A4F] to-[#0B5D3B] text-white shadow-md shadow-[#0B5D3B]/25 scale-[1.01]'
                  : 'text-[#778078] dark:text-slate-400 hover:text-[#202923] dark:hover:text-white'
              }
            `}
          >
            <Flame size={14} className={activeTab === 'heatmap' ? 'text-[#FBBF24] animate-bounce' : 'text-amber-500'} />
            <span>{language === 'ar' ? 'حرارة 3D 🔥' : '3D Heat 🔥'}</span>
          </button>
        </div>

        {/* 3D Tactile Watch Synergy Collision Capsule Button */}
        <div className="relative group w-full select-none">
          <button
            onClick={() => setShowCollisionModal(true)}
            className="
              relative w-full min-h-[46px] px-4 py-2.5 rounded-full
              bg-gradient-to-b from-[#E6F8EF] via-[#DDF3E7] to-[#C9EBD7]
              dark:from-[#0B5D3B]/40 dark:via-[#0B5D3B]/30 dark:to-[#08422A]/45
              border-2 border-[#0B5D3B]/50 dark:border-[#10b981]/50
              shadow-[0_4px_0_0_#9DCDB6,0_8px_16px_rgba(11,93,59,0.18)]
              dark:shadow-[0_4px_0_0_#062A1A]
              active:translate-y-1 active:shadow-[0_1px_0_0_#9DCDB6]
              dark:active:shadow-[0_1px_0_0_#062A1A]
              text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-black
              flex items-center justify-center gap-2 cursor-pointer
              transition-all duration-150 transform-gpu overflow-hidden
            "
          >
            <div className="absolute inset-x-3 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none" />
            <Zap size={15} className="text-[#D4AF37] relative z-10 animate-pulse" />
            <span className="relative z-10">{t.watchCollision}</span>
          </button>
        </div>
      </div>

      {/* 3. D3 POLAR RADAR OVERLAP CHART SECTION (When polar tab is active) */}
      {activeTab === 'polar' && (
        <div className="px-4 py-2 animate-fade-in">
          <PersonalityVibePolarChart
            userProfile={userProfile}
            match={match}
            language={language}
          />
        </div>
      )}

      {/* 4. 3D INTEREST HEATMAP OVERLAY VIEW SECTION (When heatmap tab is active) */}
      {activeTab === 'heatmap' && (
        <div className="px-4 py-2 animate-fade-in">
          <InterestHeatmap3DOverlay
            userProfile={userProfile}
            match={match}
            language={language}
            inlineMode={true}
          />
        </div>
      )}

      {/* 5. SEPARATED FACING COMPARISON CARDS FEED WITH CLEAR DISTINCT LINE */}
      {/* (كل نتيجة شخص تجي منفصلة مواجهة لبعض عن الأشياء المتشابهة أو غير المتشابهة ويكون في خط واضح) */}
      {activeTab === 'feed' && (
        <main className="flex-1 px-4 py-2 space-y-4 overflow-y-auto no-scrollbar animate-fade-in">
          {ONBOARDING_QUESTIONS.map((question) => {
            const userAns = userProfile.answers[question.id];
            const matchAns = match.answers[question.id];
            const userLabel = getSafeAnswerLabel(question.id, userAns);
            const matchLabel = getSafeAnswerLabel(question.id, matchAns);
            const status = getComparisonStatus(userAns, matchAns);

            const isExact = status.type === 'exact';
            const isMissing = status.type === 'missing';

            return (
              <div key={question.id} className="relative group select-none py-1">
                {/* Living floor shadow */}
                <div
                  className={`absolute inset-x-3 bottom-0 h-4 rounded-2xl blur-md pointer-events-none ${
                    isExact ? 'bg-[#0B5D3B]/20' : 'bg-black/10 dark:bg-black/40'
                  }`}
                />

                {/* 3D Skeuomorphic Outer Container Card */}
                <div
                  className={`
                    relative rounded-3xl overflow-hidden transition-all
                    bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                    dark:from-[#1D2B22] dark:via-[#141F18] dark:to-[#0D1510]
                    border-2
                    ${
                      isExact
                        ? 'border-[#0B5D3B]/40 dark:border-[#10B981]/50 shadow-[0_6px_0_0_#9DCDB6,0_12px_20px_rgba(11,93,59,0.14)] dark:shadow-[0_6px_0_0_#062A1A]'
                        : 'border-slate-200/90 dark:border-slate-800 shadow-[0_6px_0_0_#CFC6B4,0_12px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_0_0_#06140D]'
                    }
                  `}
                >
                  {/* Top specular highlight sheen */}
                  <div className="absolute inset-x-2 top-0.5 h-[35%] rounded-t-2xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />

                  {/* Question / Category Header Axis */}
                  <div className="relative z-10 px-4 py-2.5 bg-slate-50/80 dark:bg-[#131D16] border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-white dark:bg-[#1C2720] border border-slate-200/60 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                        <RealisticIcon name={question.options[0]?.iconKey || 'coffee'} size={18} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#202923] dark:text-slate-200 truncate">
                        {language === 'ar' ? question.titleAr : question.titleEn}
                      </span>
                    </div>

                    {/* Compatibility Pill Badge */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isExact && <CheckCircle2 size={13} className="text-[#0B5D3B] dark:text-[#10b981]" />}
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isExact
                            ? 'bg-[#E8F7EE] dark:bg-[#0B5D3B]/40 text-[#0B5D3B] dark:text-[#34D399] border border-[#0B5D3B]/30'
                            : isMissing
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/40'
                        }`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* 
                    CONFRONTATION ARENA:
                    Separated, independent cards facing each other with a PROMINENT CLEAR DIVIDING LINE
                    (كل نتيجة شخص تجي منفصلة مواجهة لبعض ويكون في خط واضح)
                  */}
                  <div className="relative z-10 p-3.5 flex items-stretch gap-2.5">
                    
                    {/* PERSON 1 (You / أنت): Independent Elevated 3D Pill Card - Crisp & Light */}
                    <div className={`
                      flex-1 p-3 rounded-2xl border transition-all flex flex-col justify-between
                      bg-gradient-to-b from-white via-[#FCFBF8] to-[#F3EEE3]
                      dark:from-[#1A261F] dark:via-[#141E18] dark:to-[#0D1510]
                      ${isExact
                        ? 'border-[#0B5D3B]/40 dark:border-[#10B981]/40 shadow-[0_3px_0_0_#9DCDB6] dark:shadow-[0_3px_0_0_#062A1A]'
                        : 'border-slate-200 dark:border-slate-800 shadow-[0_3px_0_0_#CFC6B4] dark:shadow-[0_3px_0_0_#09130D]'
                      }
                    `}>
                      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full overflow-hidden border border-[#0B5D3B]/30 shrink-0">
                            <AvatarRenderer avatar={userProfile.avatar} size={20} direction="right" />
                          </div>
                          <span className="text-[10px] font-black text-[#0B5D3B] dark:text-[#34D399] uppercase tracking-wide">
                            {t.youLabel}
                          </span>
                        </div>
                        <span className="text-[11px] font-black text-[#0B5D3B] dark:text-[#34D399]">➔</span>
                      </div>

                      <p className="text-xs font-black text-[#1A251E] dark:text-white leading-relaxed">
                        {userLabel}
                      </p>
                    </div>

                    {/* 
                      PROMINENT CLEAR DIVIDING LINE & CONFRONTATION AXIS (خط واضح وفاصل)
                    */}
                    <div className="relative flex flex-col items-center justify-center shrink-0 w-8">
                      {/* Clear, distinct, sharp dividing spine line */}
                      <div className="absolute top-1 bottom-1 w-[2.5px] bg-gradient-to-b from-slate-300 via-[#0B5D3B] to-slate-300 dark:from-slate-700 dark:via-[#10B981] dark:to-slate-700 rounded-full" />
                      
                      {/* Center Confrontation Hub Node */}
                      <div className={`
                        relative z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-md font-black text-xs border-2
                        ${isExact
                          ? 'bg-[#0B5D3B] text-white border-white dark:border-[#10B981] animate-pulse ring-2 ring-[#0B5D3B]/20'
                          : 'bg-[#D4AF37] text-white border-white dark:border-amber-300'
                        }
                      `}>
                        {isExact ? '★' : '⚡'}
                      </div>
                    </div>

                    {/* PERSON 2 (Twin Match / الشبيه): Independent Elevated 3D Pill Card - DARKER SHADE ("أغمق شوي من جهتو") */}
                    <div className={`
                      flex-1 p-3 rounded-2xl border transition-all flex flex-col justify-between
                      bg-gradient-to-b from-[#E7E0D0] via-[#DDD4C1] to-[#CFBFAB]
                      dark:from-[#131B15] dark:via-[#0E1510] dark:to-[#070D09]
                      ${isExact
                        ? 'border-[#0B5D3B]/45 dark:border-[#10B981]/40 shadow-[0_3px_0_0_#7AA891] dark:shadow-[0_3px_0_0_#051F14]'
                        : 'border-[#BAAE95] dark:border-slate-800 shadow-[0_3px_0_0_#A09277] dark:shadow-[0_3px_0_0_#050B07]'
                      }
                    `}>
                      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-black/10 dark:border-white/10">
                        <span className="text-[11px] font-black text-[#875B10] dark:text-[#E2BD56]">🠔</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black text-[#7A500C] dark:text-[#E2BD56] uppercase tracking-wide truncate max-w-[85px]">
                            @{match.username}
                          </span>
                          <div className="w-5 h-5 rounded-full overflow-hidden border border-[#D4AF37]/50 shrink-0">
                            <AvatarRenderer avatar={match.avatar} size={20} direction="left" />
                          </div>
                        </div>
                      </div>

                      <p className="text-xs font-black text-[#141C16] dark:text-slate-100 leading-relaxed text-end">
                        {matchLabel}
                      </p>
                    </div>

                  </div>

                  {/* Footer State Banner: Distinct indication for Similar vs Dissimilar */}
                  {isExact ? (
                    <div className="relative z-10 px-4 py-2 bg-gradient-to-r from-[#DDF3E7]/90 to-[#CCEEDC]/90 dark:bg-[#0B5D3B]/30 border-t border-[#0B5D3B]/20 flex items-center justify-center gap-1.5 text-[10px] font-black text-[#0B5D3B] dark:text-[#34D399]">
                      <Heart size={12} className="fill-[#0B5D3B] text-[#0B5D3B] dark:fill-[#34D399] dark:text-[#34D399]" />
                      <span>
                        {language === 'ar' ? '★ كلاكـما يتطابق في هذا الاختيار تماماً (100% Match)' : '★ Both of you share this exact taste (100% Match)'}
                      </span>
                    </div>
                  ) : (
                    <div className="relative z-10 px-4 py-1.5 bg-slate-100/60 dark:bg-black/20 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#778078] dark:text-slate-400">
                      <Zap size={11} className="text-[#D4AF37]" />
                      <span>
                        {language === 'ar' ? '⚡ نقطة تنوع وتمايز تثري الحديث بينكما' : '⚡ Unique diverse taste to spark conversations'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </main>
      )}

      {/* 5. FIXED BOTTOM ACTION BUTTON */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-[#F8F7F2] via-[#F8F7F2] to-transparent dark:from-[#111813] dark:via-[#111813] z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={onBack}
            className="
              relative w-full h-12 rounded-2xl
              bg-gradient-to-b from-[#189662] via-[#0B5D3B] to-[#073D26]
              dark:from-[#199863] dark:via-[#0E6D46] dark:to-[#073D26]
              text-white font-black text-sm
              border-2 border-[#34D399]/70 dark:border-[#34D399]/60
              shadow-[0_5px_0_0_#062A1A,0_12px_22px_rgba(11,93,59,0.35)]
              dark:shadow-[0_5px_0_0_#03180F]
              active:translate-y-1 active:shadow-[0_1px_0_0_#062A1A]
              hover:brightness-105 transition-all cursor-pointer overflow-hidden flex items-center justify-center gap-2
            "
          >
            {/* Top specular highlight sheen */}
            <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none" />
            <span className="relative z-10">{t.doneBtn}</span>
          </button>
        </div>
      </footer>

      {/* 6. INTERACTIVE COLLISION OVERLAY MODAL */}
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
                const label = getSafeAnswerLabel(question.id, ans);
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

      {/* 7. 3D ANIMATED HEATMAP OVERLAY MODAL */}
      {showHeatmapOverlay && (
        <InterestHeatmap3DOverlay
          userProfile={userProfile}
          match={match}
          language={language}
          isOpen={showHeatmapOverlay}
          onClose={() => setShowHeatmapOverlay(false)}
          inlineMode={false}
        />
      )}

    </div>
  );
};
