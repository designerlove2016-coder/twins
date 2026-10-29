import React, { useState } from 'react';
import { UserProfile, MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { BrandLogo } from '../common/BrandLogo';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { TactilePillButton } from '../common/TactilePillButton';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { FloatingDimensionCard } from '../common/FloatingDimensionCard';
import { FloatingMatchCard } from '../common/FloatingMatchCard';
import { DailyStreakModal } from './DailyStreakModal';
import { formatCity } from '../../utils/localization';
import {
  Bell,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Heart,
  Zap,
  Bookmark,
  Compass,
  X,
  Flame,
} from 'lucide-react';

interface HomeScreenProps {
  userProfile: UserProfile;
  topMatches: MatchProfile[];
  language: Language;
  onFindTwin: () => void;
  onViewMatches: () => void;
  onEditProfile: () => void;
  onSelectMatch: (match: MatchProfile) => void;
  savedProfileIds?: string[];
  onToggleSave?: (matchId: string) => void;
  onOpenSaved?: () => void;
  onExploreDiscover?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  topMatches,
  language,
  onFindTwin,
  onViewMatches,
  onEditProfile,
  onSelectMatch,
  savedProfileIds = [],
  onToggleSave,
  onOpenSaved,
  onExploreDiscover,
}) => {
  const t = TRANSLATIONS[language];
  const [dailyChoice, setDailyChoice] = useState<'opt1' | 'opt2' | null>(null);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<number | null>(null);

  // Daily Interaction Streak State
  const [streakCount, setStreakCount] = useState(5);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour > 16 || hour < 4 ? t.greetingEvening : t.greetingDay;

  // Personality Fingerprint dimension tags
  const fingerprintKeys = [
    { key: 'coffee_v60', labelEn: 'V60 Coffee', labelAr: 'قهوة مختصة' },
    { key: 'food_burger', labelEn: 'Gourmet Burger', labelAr: 'برجر ذواقة' },
    { key: 'sport_padel', labelEn: 'Padel Sport', labelAr: 'رياضة البادل' },
    { key: 'car_luxury_sedan', labelEn: 'Fast Sedan', labelAr: 'سيارة فاخرة' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] pb-24 transition-colors">
      
      {/* 1. TOP MOBILE APP HEADER */}
      <header className="sticky top-0 z-30 bg-[#F8F7F2]/90 dark:bg-[#111813]/90 backdrop-blur-md px-5 pt-4 pb-3 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <BrandLogo size="sm" showTagline={false} />

        {/* User Quick Glance, Streak, Bookmarks & Notification Trigger */}
        <div className="flex items-center gap-2">
          {/* Daily Interaction Streak Counter with Visual Flame Animation */}
          <button
            type="button"
            onClick={() => setShowStreakModal(true)}
            className="
              relative min-h-[42px] px-2.5 py-1.5 flex items-center gap-1.5 rounded-full
              bg-gradient-to-b from-[#FFF5EB] via-[#FAF9F5] to-[#F5ECE0]
              dark:from-[#2B1E12] dark:via-[#1F160C] dark:to-[#140E07]
              border border-amber-300/80 dark:border-amber-500/50
              shadow-[0_4px_0_0_#D5B895,0_8px_14px_rgba(245,158,11,0.18)]
              dark:shadow-[0_4px_0_0_#1A1005,0_0_12px_rgba(245,158,11,0.25)]
              active:translate-y-1 active:shadow-[0_1px_0_0_#D5B895]
              hover:brightness-105 transition-all cursor-pointer overflow-hidden
            "
            title={language === 'ar' ? 'سلسلة التفاعل اليومي 🔥' : 'Daily Interaction Streak 🔥'}
            aria-label={language === 'ar' ? 'سلسلة التفاعل اليومي' : 'Daily Interaction Streak'}
          >
            <div className="absolute inset-x-1.5 top-0.5 h-[38%] rounded-full bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
            <span className="text-base animate-flame shrink-0 leading-none filter drop-shadow-xs">
              🔥
            </span>
            <span className="text-xs font-black font-mono text-amber-700 dark:text-amber-300">
              {streakCount}
            </span>
            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
              {language === 'ar' ? 'يوم' : 'd'}
            </span>
          </button>

          {/* Saved Bookmarks Shortcut Button */}
          {onOpenSaved && (
            <button
              type="button"
              onClick={onOpenSaved}
              className="
                relative min-h-[42px] px-3 py-1.5 flex items-center gap-1.5 rounded-full
                bg-gradient-to-b from-white to-[#F2EFE8] dark:from-[#243028] dark:to-[#18221C]
                border border-white/80 dark:border-white/10
                shadow-[0_4px_0_0_#D3CBB9,0_8px_14px_rgba(0,0,0,0.08)]
                dark:shadow-[0_4px_0_0_#0F1511]
                active:translate-y-1 active:shadow-[0_1px_0_0_#D3CBB9]
                text-slate-700 dark:text-slate-300 hover:text-[#D4AF37] transition-all cursor-pointer
              "
              title={t.savedProfilesTitle}
              aria-label={t.savedProfilesTitle}
            >
              <Bookmark size={16} className={`${savedProfileIds.length > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
              <span className="text-xs font-black font-mono text-[#0B5D3B] dark:text-[#DDF3E7]">
                {savedProfileIds.length}
              </span>
            </button>
          )}

          {/* Notification Trigger Button */}
          <button
            type="button"
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            className="relative min-h-[42px] min-w-[42px] flex items-center justify-center rounded-full bg-gradient-to-b from-white to-[#F2EFE8] dark:from-[#243028] dark:to-[#18221C] border border-white/80 dark:border-white/10 shadow-[0_4px_0_0_#D3CBB9,0_8px_14px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_0_0_#0F1511] active:translate-y-1 active:shadow-[0_1px_0_0_#D3CBB9] text-slate-700 dark:text-slate-300 hover:text-[#0B5D3B] transition-all cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#E73A2A] ring-2 ring-white animate-pulse" />
          </button>

          {/* My Profile Button */}
          <button
            type="button"
            onClick={onEditProfile}
            className="flex items-center gap-2 rounded-full p-0.5 hover:ring-3 hover:ring-[#0B5D3B]/40 active:scale-95 transition-all cursor-pointer shadow-sm"
            aria-label="My Profile"
          >
            <AvatarRenderer avatar={userProfile.avatar} size={42} direction="center" />
          </button>
        </div>
      </header>

      {/* Notification Toast Panel with Action Buttons */}
      {showNotificationDrawer && (
        <div className="mx-5 mt-2 p-4 bg-gradient-to-b from-white to-[#FAF9F5] dark:from-[#1E2721] dark:to-[#151D18] border border-[#0B5D3B]/30 rounded-2xl shadow-xl text-xs space-y-2 animate-fade-in z-20">
          <div className="flex items-center justify-between font-bold text-[#0B5D3B] dark:text-[#DDF3E7]">
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-[#D4AF37]" />
              {language === 'ar' ? 'تنبيهات توأم الذكية' : 'Twin Smart Alerts'}
            </span>
            <button
              type="button"
              onClick={() => setShowNotificationDrawer(false)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === 'ar'
              ? 'انضم 3 أشخاص جدد في مدينتك يشاركونك حب القهوة المقطرة V60 ولعب البادل بنسبة تطابق 95%!'
              : '3 new members in your city share your passion for V60 drip coffee and Padel at 95% match!'}
          </p>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setShowNotificationDrawer(false);
                onViewMatches();
              }}
              className="px-3 py-1 rounded-xl bg-[#0B5D3B] text-white text-[11px] font-bold cursor-pointer active:scale-95 transition-all"
            >
              {language === 'ar' ? 'عرض المتطابقين' : 'View Matches'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Feed */}
      <main className="px-5 pt-3 space-y-4">
        
        {/* User Greeting & City */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-semibold text-[#778078] block">
              {greeting}
            </span>
            <h1 className="text-xl font-black tracking-tight text-[#202923] dark:text-white">
              @{userProfile.username}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#0B5D3B] dark:text-[#DDF3E7] font-bold bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/30 dark:to-[#08422A]/40 px-3.5 py-1.5 rounded-full border border-white/60 dark:border-[#0B5D3B]/30 shadow-[0_3px_0_0_#B6E0C9,0_6px_10px_rgba(11,93,59,0.12)]">
            <MapPin size={13} />
            <span>{formatCity(userProfile.city, language)}</span>
          </div>
        </div>

        {/* Daily Interaction Streak Quick Visual Banner */}
        <div
          onClick={() => setShowStreakModal(true)}
          className="
            p-3 rounded-2xl cursor-pointer transition-all active:scale-[0.99]
            bg-gradient-to-r from-[#FFF5EB] via-[#FFF9F2] to-[#FFF0DE]
            dark:from-[#261709] dark:via-[#1A1208] dark:to-[#261709]
            border-2 border-amber-300/80 dark:border-amber-500/40
            shadow-[0_4px_12px_rgba(245,158,11,0.14)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.4)]
            flex items-center justify-between gap-2.5 overflow-hidden relative group
          "
        >
          {/* Ambient flame sheen */}
          <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none" />

          <div className="flex items-center gap-2.5 min-w-0 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <span className="text-xl animate-flame">🔥</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-900 dark:text-amber-200 truncate">
                  {language === 'ar' ? `سلسلة تفاعل نشطة: ${streakCount} أيام متتالية!` : `Active Streak: ${streakCount} Days in a row!`}
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0">
                  {language === 'ar' ? '+50 نقطة' : '+50 pts'}
                </span>
              </div>
              <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80 truncate">
                {language === 'ar' ? 'حافظ على اشتعال شعلتك اليومية لكسب مضاعفات التوافق والجوائز' : 'Check in daily to keep flame lit & unlock chemistry boosts'}
              </p>
            </div>
          </div>

          <span className="relative z-10 text-[10px] font-black text-amber-800 dark:text-amber-300 bg-white/90 dark:bg-black/40 px-2.5 py-1 rounded-xl border border-amber-300/50 shrink-0 group-hover:scale-105 transition-transform">
            {language === 'ar' ? 'المكافآت ➔' : 'Rewards ➔'}
          </span>
        </div>

        {/* ============================================================== */}
        {/* HERO FEATURE: Personality Fingerprint & Signature CTA Card */}
        {/* ============================================================== */}
        <OrganicFloatingCard
          className="p-5 border border-[#0B5D3B]/25"
          glowColor="rgba(212, 175, 55, 0.18)"
        >
          {/* Top Row: Fingerprint & Status */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={16} className="text-[#D4AF37]" />
                <h2 className="text-sm font-bold text-[#202923] dark:text-white">
                  {t.myFingerprint}
                </h2>
              </div>
              <p className="text-xs text-[#778078] dark:text-slate-400 mt-0.5">
                {t.fingerprintSubtitle}
              </p>
            </div>

            {/* Profile ready badge - High contrast crisp legible styling */}
            <div className="flex items-center gap-1.5 text-[11px] font-black text-white bg-[#0B5D3B] dark:bg-[#10B981] dark:text-[#062618] px-3.5 py-1 rounded-full shadow-sm border border-[#168858] dark:border-[#34D399]">
              <CheckCircle2 size={13} strokeWidth={3} className="text-[#D4AF37] dark:text-[#062618]" />
              <span className="tracking-wide">{t.profileComplete}</span>
            </div>
          </div>

          {/* 
            DIMENSIONS 3D TACTILE FLOATING CARDS
            Interactive 3D capsule tiles with organic float & living floor shadow
          */}
          <div className="my-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#778078] dark:text-slate-300 block">
                {language === 'ar' ? 'أبعاد الهوية والتفضيلات (اضغط للاستكشاف)' : 'Identity Dimensions (Tap to inspect)'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {fingerprintKeys.map((item, i) => (
                <FloatingDimensionCard
                  key={item.key}
                  iconKey={item.key}
                  label={language === 'ar' ? item.labelAr : item.labelEn}
                  index={i}
                  isSelected={selectedDimension === i}
                  onClick={() => setSelectedDimension(selectedDimension === i ? null : i)}
                />
              ))}
            </div>

            {selectedDimension !== null && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-[#E8F7EE] dark:bg-[#122A1E] border border-[#0B5D3B]/30 dark:border-[#10B981]/40 flex items-center justify-between text-xs animate-fade-in">
                <span className="text-[#07472B] dark:text-[#34D399] font-black">
                  {language === 'ar' ? `البعد المختار: ${fingerprintKeys[selectedDimension].labelAr}` : `Selected dimension: ${fingerprintKeys[selectedDimension].labelEn}`}
                </span>
                <button
                  type="button"
                  onClick={onExploreDiscover}
                  className="px-2.5 py-1 rounded-lg bg-[#0B5D3B] hover:bg-[#08422A] text-white text-[10px] font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  {language === 'ar' ? 'استكشف الفئة' : 'Explore Tribe'}
                </button>
              </div>
            )}
          </div>

          {/* 
            GRAND 3D TACTILE SKEUOMORPHIC "FIND MY TWIN" ACTION BUTTON
            Deep physical 3D compression, rich emerald sheen & guaranteed instant response
          */}
          <div className="relative group w-full pt-2 z-30">
            <div className="absolute inset-x-6 bottom-1 h-5 rounded-full bg-[#0B5D3B]/50 dark:bg-[#10B981]/30 blur-lg pointer-events-none transition-all group-hover:scale-105 group-hover:opacity-100" />

            <button
              type="button"
              id="find-twin-primary-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                    navigator.vibrate([35, 45]);
                  }
                } catch {
                  // ignore
                }
                onFindTwin();
              }}
              className="
                relative z-30 w-full h-15 rounded-2xl
                bg-gradient-to-b from-[#168858] via-[#0B5D3B] to-[#073D26]
                dark:from-[#199863] dark:via-[#0E6D46] dark:to-[#073D26]
                text-white font-black text-base tracking-wide
                flex items-center justify-center gap-3
                border-2 border-[#29B076]/70 dark:border-[#34D399]/60
                shadow-[0_8px_0_0_#052E1C,0_18px_26px_rgba(11,93,59,0.45)]
                dark:shadow-[0_8px_0_0_#031E12,0_18px_28px_rgba(16,185,129,0.3)]
                hover:brightness-105
                active:translate-y-2 active:shadow-[0_0px_0_0_#052E1C,0_4px_10px_rgba(11,93,59,0.25)]
                active:scale-[0.985]
                transition-all duration-100 cursor-pointer overflow-hidden select-none
              "
              aria-label={t.findTwinCTA}
            >
              {/* Top specular glossy highlight sheen */}
              <div className="absolute inset-x-3 top-1 h-[42%] rounded-xl bg-gradient-to-b from-white/55 via-white/15 to-transparent pointer-events-none" />

              <Sparkles size={20} className="text-[#D4AF37] animate-pulse relative z-10" />
              <span className="relative z-10 drop-shadow-xs">{t.findTwinCTA}</span>
              {language === 'ar' ? (
                <ArrowLeft size={18} className="text-white relative z-10" />
              ) : (
                <ArrowRight size={18} className="text-white relative z-10" />
              )}
            </button>
          </div>

          <span className="block text-center text-[11px] text-[#778078] dark:text-slate-400 mt-2.5">
            {t.findTwinSub}
          </span>
        </OrganicFloatingCard>

        {/* SHARED-INTEREST HIGHLIGHT STRIP */}
        <div
          onClick={onViewMatches}
          className="cursor-pointer transition-transform active:scale-[0.99]"
        >
          <OrganicFloatingCard
            className="p-4 bg-gradient-to-r from-[#DDF3E7] via-white to-[#DDF3E7] dark:from-[#0B5D3B]/25 dark:via-[#18221C] dark:to-[#0B5D3B]/20 border border-[#0B5D3B]/20"
            enableParallax={false}
            floatDelay={true}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#18221C] shadow-sm flex items-center justify-center shrink-0 text-[#0B5D3B]">
                  <Heart size={20} className="fill-[#0B5D3B]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7] uppercase tracking-wide">
                    {t.sharedHighlights}
                  </h3>
                  <p className="text-xs text-[#202923] dark:text-slate-300 mt-0.5 leading-relaxed">
                    {t.sharedHighlightText}
                  </p>
                </div>
              </div>

              <div className="p-1 rounded-full text-[#0B5D3B] dark:text-[#DDF3E7] self-center">
                {language === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </div>
            </div>
          </OrganicFloatingCard>
        </div>

        {/* ============================================================== */}
        {/* TOP MATCHES CAROUSEL WITH ORGANIC FLOATING CARDS & BOOKMARKS */}
        {/* ============================================================== */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-base font-black text-[#1A251E] dark:text-white">
              {t.topMatchesTitle}
            </h3>
            <button
              type="button"
              onClick={onViewMatches}
              className="text-xs sm:text-sm font-bold text-[#0B5D3B] dark:text-[#A7F3D0] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{t.viewAllMatches}</span>
              {language === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth">
            {topMatches.map((m, idx) => (
              <FloatingMatchCard
                key={m.id}
                match={m}
                language={language}
                index={idx}
                onClick={() => onSelectMatch(m)}
                isSaved={savedProfileIds.includes(m.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* DAILY TWIN QUESTION WITH 3D TACTILE SKEUOMORPHIC PILL BUTTONS */}
        {/* ============================================================== */}
        <OrganicFloatingCard
          className="p-5 border border-slate-200/80 dark:border-slate-800"
          glowColor="rgba(231, 58, 42, 0.12)"
        >
          {/* Title Header */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wide">
            <TrendingUp size={15} />
            <span>{t.dailyPromptTitle}</span>
          </div>

          {/* Question Text */}
          <p className="mt-2 text-sm font-bold text-[#202923] dark:text-white leading-snug">
            {t.dailyPromptQuestion}
          </p>

          {/* 3D Tactile Capsule Pill Buttons for Question Options */}
          <div className="mt-4 space-y-3">
            <TactilePillButton
              isActive={dailyChoice === 'opt1'}
              onClick={() => setDailyChoice('opt1')}
              rightBadge={dailyChoice ? '64%' : undefined}
            >
              {t.dailyOption1}
            </TactilePillButton>

            <TactilePillButton
              isActive={dailyChoice === 'opt2'}
              onClick={() => setDailyChoice('opt2')}
              rightBadge={dailyChoice ? '36%' : undefined}
            >
              {t.dailyOption2}
            </TactilePillButton>
          </div>

          {dailyChoice && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-fade-in">
              <p className="text-[11px] text-[#0B5D3B] dark:text-[#DDF3E7] text-center font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#0B5D3B]" />
                <span>
                  {language === 'ar'
                    ? 'تم تسجيل اختيارك! يشاركك في هذا الخيار 820 عضواً في مجتمع توأم.'
                    : 'Choice recorded! 820 community members shared your preference.'}
                </span>
              </p>

              {onExploreDiscover && (
                <button
                  type="button"
                  onClick={onExploreDiscover}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Compass size={13} />
                  <span>{language === 'ar' ? 'عرض الأعضاء الذين وافقوك في الاختيار' : 'See members with same answer'}</span>
                </button>
              )}
            </div>
          )}
        </OrganicFloatingCard>

      </main>

      {/* Daily Interaction Streak Modal */}
      <DailyStreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        language={language}
        streakCount={streakCount}
        hasClaimedToday={hasClaimedToday}
        onClaimDailyStreak={() => {
          setStreakCount((prev) => prev + 1);
          setHasClaimedToday(true);
        }}
      />
    </div>
  );
};
