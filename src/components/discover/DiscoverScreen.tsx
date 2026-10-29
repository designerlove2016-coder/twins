import React, { useState } from 'react';
import { MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { RealisticIcon } from '../common/RealisticIcon';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { formatCity, formatInterest } from '../../utils/localization';
import {
  Sparkles,
  MapPin,
  Layers,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  HandMetal,
  Compass,
} from 'lucide-react';

interface DiscoverScreenProps {
  matches: MatchProfile[];
  language: Language;
  onSelectMatch: (match: MatchProfile) => void;
  onCompareMatch: (match: MatchProfile) => void;
  savedProfileIds?: string[];
  onToggleSaveProfile?: (matchId: string) => void;
  onSendWave?: (match: MatchProfile) => void;
  initialTab?: 'all' | 'saved';
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  matches,
  language,
  onSelectMatch,
  onCompareMatch,
  savedProfileIds = [],
  onToggleSaveProfile,
  onSendWave,
  initialTab = 'all',
}) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>(initialTab);
  const [selectedTribe, setSelectedTribe] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const tribes = [
    { id: 'all', labelEn: 'All Tribes', labelAr: 'كل الفئات', icon: 'place_cozycafe' },
    { id: 'v60', labelEn: 'V60 Aficionados', labelAr: 'عشاق V60', icon: 'coffee_v60' },
    { id: 'padel', labelEn: 'Padel Warriors', labelAr: 'أبطال البادل', icon: 'sport_padel' },
    { id: 'tech', labelEn: 'Gamers & Tech', labelAr: 'التقنية والألعاب', icon: 'sport_gaming' },
    { id: 'kashta', labelEn: 'Desert Explorers', labelAr: 'أهل البر والكشتات', icon: 'leisure_kashta' },
  ];

  const cities = ['all', 'Riyadh', 'Jeddah', 'Dubai', 'Khobar', 'Doha'];

  // Filter matches based on active tab (all vs saved), tribe, and city
  const baseMatches = activeTab === 'saved'
    ? matches.filter((m) => savedProfileIds.includes(m.id))
    : matches;

  const filteredMatches = baseMatches.filter((m) => {
    if (selectedCity !== 'all' && m.city !== selectedCity) return false;
    if (selectedTribe === 'v60') return m.sharedInterests.some((s) => s.toLowerCase().includes('v60'));
    if (selectedTribe === 'padel') return m.sharedInterests.some((s) => s.toLowerCase().includes('padel'));
    if (selectedTribe === 'tech') return m.sharedInterests.some((s) => s.toLowerCase().includes('gaming'));
    if (selectedTribe === 'kashta') return m.sharedInterests.some((s) => s.toLowerCase().includes('kashta') || s.toLowerCase().includes('desert'));
    return true;
  });

  const savedCount = matches.filter((m) => savedProfileIds.includes(m.id)).length;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] pb-28 transition-colors">
      {/* Header */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight text-[#202923] dark:text-white">
          {language === 'ar' ? 'استكشف مجتمعات الاهتمامات' : 'Explore Personality Tribes'}
        </h1>
        <p className="text-xs text-[#778078] dark:text-slate-400 mt-1">
          {language === 'ar'
            ? 'تصفح الأعضاء حسب الاهتمام المشترك والمدينة واحفظ الملفات المفضلة'
            : 'Browse community members by specific passions, hubs, and save favorites'}
        </p>
      </div>

      {/* Primary Discovery vs Saved Profiles 3D Tactile Segment Bar */}
      <div className="px-5 pt-2 pb-1">
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-gradient-to-b from-[#EFECE4] to-[#E5E0D5] dark:from-[#1E2721] dark:to-[#121814] border border-white/80 dark:border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`
              relative py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5
              transition-all duration-150 transform-gpu cursor-pointer
              ${
                activeTab === 'all'
                  ? 'bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26] text-white shadow-[0_3px_0_0_#052E1C,0_6px_12px_rgba(11,93,59,0.25)]'
                  : 'text-[#778078] dark:text-slate-400 hover:text-[#202923] dark:hover:text-white'
              }
            `}
          >
            {activeTab === 'all' && (
              <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
            )}
            <Compass size={14} className="relative z-10" />
            <span className="relative z-10">{t.allMembers}</span>
            <span className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10'}`}>
              {matches.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`
              relative py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5
              transition-all duration-150 transform-gpu cursor-pointer
              ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26] text-white shadow-[0_3px_0_0_#052E1C,0_6px_12px_rgba(11,93,59,0.25)]'
                  : 'text-[#778078] dark:text-slate-400 hover:text-[#202923] dark:hover:text-white'
              }
            `}
          >
            {activeTab === 'saved' && (
              <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />
            )}
            <Bookmark size={14} className={`relative z-10 ${savedCount > 0 ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`} />
            <span className="relative z-10">{t.savedMembers}</span>
            <span className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'saved' ? 'bg-[#D4AF37] text-black font-extrabold' : 'bg-black/10 dark:bg-white/10'}`}>
              {savedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Horizontal Tribe Filter with 3D Tactile Capsule Pills */}
      <div className="px-5 py-2">
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          {tribes.map((tribe) => {
            const active = selectedTribe === tribe.id;
            return (
              <button
                key={tribe.id}
                onClick={() => setSelectedTribe(tribe.id)}
                className={`
                  relative min-h-[46px] px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold whitespace-nowrap
                  transition-all duration-150 transform-gpu active:translate-y-1 cursor-pointer overflow-hidden
                  ${
                    active
                      ? 'bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26] text-white border border-[#34D399]/60 shadow-[0_5px_0_0_#052E1C,0_10px_16px_rgba(11,93,59,0.3)] active:shadow-[0_1px_0_0_#052E1C]'
                      : 'bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4] dark:from-[#222C24] dark:to-[#171E19] text-[#202923] dark:text-[#F8F7F2] border border-white/90 dark:border-white/10 shadow-[0_4px_0_0_#D3CBB9,0_8px_14px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_0_#0D130F] active:shadow-[0_1px_0_0_#D3CBB9]'
                  }
                `}
              >
                {/* Top specular highlight sheen */}
                <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none" />
                <div className="w-5 h-5 flex items-center justify-center relative z-10 shrink-0">
                  <RealisticIcon name={tribe.icon} size={20} />
                </div>
                <span className="relative z-10">{language === 'ar' ? tribe.labelAr : tribe.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* City Chips Filter with 3D Micro-Capsules */}
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
                onClick={() => setSelectedCity(city)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 transform-gpu active:translate-y-0.5 cursor-pointer
                  ${
                    active
                      ? 'bg-[#0B5D3B] text-white dark:bg-[#10B981] dark:text-[#062618] border border-[#0B5D3B] shadow-xs'
                      : 'bg-white/90 dark:bg-[#18221C] text-[#202923] dark:text-slate-200 hover:text-[#0B5D3B] border border-slate-200/80 dark:border-slate-800'
                  }
                `}
              >
                {city === 'all' ? (language === 'ar' ? 'الكل' : 'All') : formatCity(city, language)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtered Matches Stream with Organic Floating Cards */}
      <main className="px-5 space-y-4 mt-2">
        {filteredMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/25 flex items-center justify-center text-[#D4AF37] mb-4 shadow-md">
              <Bookmark size={30} className={activeTab === 'saved' ? 'fill-[#D4AF37]' : ''} />
            </div>

            <h2 className="text-base font-bold text-[#202923] dark:text-white">
              {activeTab === 'saved' ? t.noSavedProfilesTitle : (language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching members')}
            </h2>
            <p className="mt-1.5 text-xs text-[#778078] dark:text-slate-400 max-w-xs leading-relaxed">
              {activeTab === 'saved'
                ? t.noSavedProfilesSubtitle
                : (language === 'ar' ? 'جرب تغيير فلاتر المدينة أو الفئة لعرض المزيد من الأعضاء.' : 'Try adjusting the city or tribe filters to view more community members.')}
            </p>

            {activeTab === 'saved' && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setSelectedTribe('all');
                  setSelectedCity('all');
                }}
                className="mt-5 px-5 py-2.5 rounded-full bg-[#0B5D3B] text-white text-xs font-bold shadow-md cursor-pointer active:scale-95 transition-all"
              >
                {t.exploreMembers}
              </button>
            )}
          </div>
        ) : (
          filteredMatches.map((match, idx) => {
            const isSaved = savedProfileIds.includes(match.id);

            return (
              <OrganicFloatingCard
                key={match.id}
                className="p-4 border border-slate-200/80 dark:border-slate-800"
                floatDelay={idx % 2 === 1}
              >
                {/* Card Upper Body: Hero Avatar (sized to user's red rectangle: 124px) + Info */}
                <div className="flex items-center gap-3.5">
                  {/* Hero Avatar */}
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
                    <span className="absolute bottom-1 right-2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131D16] shadow-sm z-20" />
                  </div>

                  {/* Info Column */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 cursor-pointer" onClick={() => onSelectMatch(match)}>
                        <h2 className="text-base font-black text-[#1A251E] dark:text-white truncate">
                          @{match.username}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-[#69726A] dark:text-slate-300 mt-1">
                          <MapPin size={12} className="text-[#0B5D3B]" />
                          <span>{formatCity(match.city, language)}</span>
                          <span>·</span>
                          <span>{match.ageRange}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Match Score Capsule */}
                        <div className="px-2.5 py-1 rounded-2xl bg-gradient-to-b from-[#DDF3E7] to-[#CCEEDC] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/50 text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-black font-mono shadow-[0_2px_0_0_#A8D5C0] dark:shadow-[0_2px_0_0_#052A1A]">
                          {match.similarityScore}%
                        </div>

                        {/* Bookmark / Save Profile Button */}
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

                    {/* Shared interests snippet */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {match.sharedInterests.slice(0, 2).map((interest, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-[#E8F7EE] dark:bg-[#122A1E] text-[#07472B] dark:text-[#34D399] text-[10.5px] font-black border border-[#0B5D3B]/30 dark:border-[#10B981]/50 shadow-xs"
                        >
                          {formatInterest(interest, language)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {onSendWave && (
                      <button
                        type="button"
                        onClick={() => onSendWave(match)}
                        className="
                          px-2.5 py-1.5 rounded-xl
                          bg-white/80 dark:bg-white/5
                          border border-slate-200 dark:border-slate-800
                          hover:border-[#0B5D3B]/40
                          text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7]
                          flex items-center gap-1 cursor-pointer active:scale-95 transition-all
                        "
                      >
                        <HandMetal size={12} className="text-[#D4AF37]" />
                        <span>{t.sayHi}</span>
                      </button>
                    )}

                    <span className="text-[11px] font-black text-[#07472B] dark:text-[#34D399] truncate max-w-[120px] sm:max-w-[160px]">
                      {match.sharedInterests.slice(0, 2).map((i) => formatInterest(i, language)).join(' · ')}
                    </span>
                  </div>

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
              </OrganicFloatingCard>
            );
          })
        )}
      </main>
    </div>
  );
};
