import React, { useState } from 'react';
import { UserProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { ONBOARDING_QUESTIONS } from '../../data/questions';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { RealisticIcon } from '../common/RealisticIcon';
import { OrganicFloatingCard } from '../common/OrganicFloatingCard';
import { formatCity } from '../../utils/localization';
import {
  ShieldCheck,
  Eye,
  Sparkles,
  MapPin,
  Lock,
  Paintbrush,
  Bookmark,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface MyProfileScreenProps {
  userProfile: UserProfile;
  language: Language;
  onOpenAvatarCustomizer: () => void;
  onOpenPrivacySettings: () => void;
  onRetakeOnboarding: () => void;
  savedCount?: number;
  onOpenSaved?: () => void;
}

export const MyProfileScreen: React.FC<MyProfileScreenProps> = ({
  userProfile,
  language,
  onOpenAvatarCustomizer,
  onOpenPrivacySettings,
  onRetakeOnboarding,
  savedCount = 0,
  onOpenSaved,
}) => {
  const t = TRANSLATIONS[language];
  const [isPublicPreview, setIsPublicPreview] = useState(false);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] pb-28 transition-colors">
      
      {/* 1. Header */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#202923] dark:text-white">
            {t.navProfile}
          </h1>
          <p className="text-xs text-[#778078] dark:text-slate-400 mt-0.5">
            {language === 'ar' ? 'إدارة هويتك وبصمة شخصيتك' : 'Manage your identity and fingerprint'}
          </p>
        </div>

        {/* 3D Tactile Public/Private View Mode Switcher */}
        <button
          onClick={() => setIsPublicPreview(!isPublicPreview)}
          className={`
            relative min-h-[42px] px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5
            transition-all duration-150 transform-gpu active:translate-y-1 cursor-pointer overflow-hidden
            ${
              isPublicPreview
                ? 'bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26] text-white border border-[#229D68]/50 shadow-[0_4px_0_0_#052E1C,0_8px_14px_rgba(11,93,59,0.3)] active:shadow-[0_1px_0_0_#052E1C]'
                : 'bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4] dark:from-[#243028] dark:to-[#18221C] text-[#202923] dark:text-[#F8F7F2] border border-white/80 dark:border-white/10 shadow-[0_4px_0_0_#D3CBB9,0_8px_14px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_0_0_#0F1511] active:shadow-[0_1px_0_0_#D3CBB9]'
            }
          `}
        >
          {/* Top specular glossy highlight */}
          <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-full bg-gradient-to-b from-white/70 via-white/20 to-transparent pointer-events-none" />
          <Eye size={14} className="relative z-10" />
          <span className="relative z-10">
            {isPublicPreview
              ? (language === 'ar' ? 'معاينة عامة' : 'Public View')
              : (language === 'ar' ? 'عرض خاص' : 'Private View')}
          </span>
        </button>
      </div>

      {/* 2. Main Profile Identity Card (OrganicFloatingCard with 3D Parallax Tilt) */}
      <div className="px-5 mt-2">
        <OrganicFloatingCard
          className="p-5 text-center flex flex-col items-center relative overflow-hidden"
          glowColor="rgba(11, 93, 59, 0.15)"
        >
          {/* Avatar with 3D tactile edit button */}
          <div className="relative group cursor-pointer" onClick={onOpenAvatarCustomizer}>
            <div className="relative">
              <AvatarRenderer avatar={userProfile.avatar} size={92} direction="center" />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAvatarCustomizer();
              }}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-gradient-to-b from-[#137A4F] to-[#073D26] text-white flex items-center justify-center border-2 border-white dark:border-[#18221C] shadow-[0_3px_0_0_#052E1C,0_6px_10px_rgba(0,0,0,0.2)] active:translate-y-0.5 active:shadow-[0_1px_0_0_#052E1C] cursor-pointer"
              aria-label="Customize avatar"
              title={language === 'ar' ? 'تعديل الأفاتار والحركة' : 'Customize Avatar & Motion'}
            >
              <Paintbrush size={15} />
            </button>
          </div>

          <h2 className="mt-3 text-lg font-bold text-[#202923] dark:text-white">
            @{userProfile.username}
          </h2>

          {/* Current Motion Badge (Clickable to switch motion) */}
          <button
            type="button"
            onClick={onOpenAvatarCustomizer}
            className="mt-1 px-3 py-1 rounded-full bg-[#DDF3E7] dark:bg-[#0B5D3B]/30 border border-[#0B5D3B]/20 text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span>
              {language === 'ar'
                ? `الحركة: ${
                    userProfile.avatar.motionStyle === 'smiling'
                      ? 'يبتسم ويتألق 😊'
                      : userProfile.avatar.motionStyle === 'bouncing'
                      ? 'يقفز بمرح 🎉'
                      : userProfile.avatar.motionStyle === 'nodding'
                      ? 'إيماءة واثقة 😎'
                      : userProfile.avatar.motionStyle === 'cool-sway'
                      ? 'تمايل رايق ✨'
                      : userProfile.avatar.motionStyle === 'wink'
                      ? 'غمزة مرحة 😉'
                      : 'يلوح ويرحب 👋'
                  }`
                : `Motion: ${
                    userProfile.avatar.motionStyle === 'smiling'
                      ? 'Gentle Smile 😊'
                      : userProfile.avatar.motionStyle === 'bouncing'
                      ? 'Joyful Bounce 🎉'
                      : userProfile.avatar.motionStyle === 'nodding'
                      ? 'Confident Nod 😎'
                      : userProfile.avatar.motionStyle === 'cool-sway'
                      ? 'Chill Sway ✨'
                      : userProfile.avatar.motionStyle === 'wink'
                      ? 'Playful Wink 😉'
                      : 'Friendly Wave 👋'
                  }`}
            </span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#778078] dark:text-slate-400 mt-2">
            <div className="flex items-center gap-1 font-semibold text-[#0B5D3B] dark:text-[#DDF3E7]">
              <MapPin size={13} />
              <span>{formatCity(userProfile.city, language)}</span>
            </div>
            <span>·</span>
            <span>{language === 'ar' ? 'عضو موثق' : 'Verified Twin'}</span>
          </div>

          {/* Strict Privacy Safety Assurance Note */}
          <div className="mt-4 w-full p-2.5 rounded-2xl bg-gradient-to-b from-[#DDF3E7]/80 to-[#D5EFE0]/60 dark:bg-[#0B5D3B]/20 border border-[#0B5D3B]/20 flex items-center justify-center gap-1.5 text-xs text-[#0B5D3B] dark:text-[#DDF3E7] font-bold shadow-2xs">
            <ShieldCheck size={14} className="shrink-0" />
            <span className="text-[11px]">{t.guaranteeTitle}</span>
          </div>
        </OrganicFloatingCard>
      </div>

      {/* 3. Saved Profiles Shortcut Card */}
      {onOpenSaved && (
        <div className="px-5 mt-3">
          <button
            type="button"
            onClick={onOpenSaved}
            className="
              relative w-full p-4 rounded-2xl
              bg-gradient-to-b from-[#FFFDF8] via-[#FAF6EC] to-[#F3ECD8]
              dark:from-[#252219] dark:via-[#1D1A13] dark:to-[#17140E]
              border border-[#D4AF37]/40 dark:border-[#D4AF37]/25
              shadow-[0_5px_0_0_#D5C69E,0_10px_16px_rgba(212,175,55,0.12)]
              dark:shadow-[0_5px_0_0_#0F0E0A]
              active:translate-y-1 active:shadow-[0_1px_0_0_#D5C69E]
              flex items-center justify-between
              transition-all duration-150 cursor-pointer overflow-hidden
            "
          >
            <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                <Bookmark size={20} className="fill-[#D4AF37]" />
              </div>
              <div className="text-start">
                <span className="text-xs font-bold text-[#202923] dark:text-white block">
                  {t.savedProfilesTitle}
                </span>
                <span className="text-[11px] text-[#778078] dark:text-slate-400">
                  {language === 'ar' ? `${savedCount} ملفات محفوظة في قائمتك` : `${savedCount} profiles bookmarked in your list`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 relative z-10 text-[#0B5D3B] dark:text-[#DDF3E7]">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#0B5D3B]/10 dark:bg-white/10">
                {savedCount}
              </span>
              {language === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </div>
          </button>
        </div>
      )}

      {/* 4. Action Controls: 3D Tactile Capsule Buttons */}
      <div className="px-5 mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={onOpenPrivacySettings}
          className="
            relative min-h-[50px] p-3.5 rounded-2xl
            bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
            dark:from-[#222C24] dark:via-[#1B231D] dark:to-[#151C17]
            border border-white/90 dark:border-white/10
            shadow-[0_5px_0_0_#D3CBB9,0_10px_16px_rgba(32,41,35,0.08)]
            dark:shadow-[0_5px_0_0_#0D130F,0_10px_16px_rgba(0,0,0,0.4)]
            active:translate-y-1 active:shadow-[0_1px_0_0_#D3CBB9]
            dark:active:shadow-[0_1px_0_0_#0D130F]
            text-xs font-bold text-[#202923] dark:text-[#F8F7F2]
            flex items-center justify-center gap-2
            transition-all duration-150 cursor-pointer overflow-hidden
          "
        >
          {/* Top specular glossy sheen */}
          <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
          <Lock size={15} className="text-[#0B5D3B] relative z-10 shrink-0" />
          <span className="relative z-10 truncate">{t.privacyTitle}</span>
        </button>

        <button
          onClick={onRetakeOnboarding}
          className="
            relative min-h-[50px] p-3.5 rounded-2xl
            bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
            dark:from-[#222C24] dark:via-[#1B231D] dark:to-[#151C17]
            border border-white/90 dark:border-white/10
            shadow-[0_5px_0_0_#D3CBB9,0_10px_16px_rgba(32,41,35,0.08)]
            dark:shadow-[0_5px_0_0_#0D130F,0_10px_16px_rgba(0,0,0,0.4)]
            active:translate-y-1 active:shadow-[0_1px_0_0_#D3CBB9]
            dark:active:shadow-[0_1px_0_0_#0D130F]
            text-xs font-bold text-[#202923] dark:text-[#F8F7F2]
            flex items-center justify-center gap-2
            transition-all duration-150 cursor-pointer overflow-hidden
          "
        >
          {/* Top specular glossy sheen */}
          <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
          <Sparkles size={15} className="text-[#D4AF37] relative z-10 shrink-0" />
          <span className="relative z-10 truncate">
            {language === 'ar' ? 'إعادة ضبط الإجابات' : 'Update Taste Profile'}
          </span>
        </button>
      </div>

      {/* 4. Personality Fingerprint Breakdown with 3D Tactile Cards */}
      <div className="px-5 mt-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-[#778078] uppercase tracking-wider px-1">
          <span>{language === 'ar' ? 'سماتك وأبعاد شخصيتك' : 'Your Personality Attributes'}</span>
        </div>

        {ONBOARDING_QUESTIONS.map((question) => {
          const ans = userProfile.answers[question.id];
          if (!ans) return null;

          let displayVal = '';
          if (Array.isArray(ans)) {
            displayVal = ans
              .map((id) => {
                const opt = question.options.find((o) => o.id === id);
                return opt ? (language === 'ar' ? opt.labelAr : opt.labelEn) : id;
              })
              .join(', ');
          } else {
            const opt = question.options.find((o) => o.id === ans);
            displayVal = opt ? (language === 'ar' ? opt.labelAr : opt.labelEn) : String(ans);
          }

          return (
            <div key={question.id} className="relative group select-none py-0.5">
              {/* Ambient decoupled shadow */}
              <div className="absolute inset-x-3 bottom-0 h-3 rounded-2xl bg-black/10 dark:bg-black/35 blur-md pointer-events-none" />

              <div
                className="
                  relative p-4 rounded-2xl
                  bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4]
                  dark:from-[#1E2721] dark:via-[#18211B] dark:to-[#131915]
                  border border-white/90 dark:border-white/10
                  shadow-[0_5px_0_0_#D3CBB9,0_10px_16px_rgba(0,0,0,0.06)]
                  dark:shadow-[0_5px_0_0_#0D130F,0_10px_16px_rgba(0,0,0,0.4)]
                  flex items-center justify-between gap-3
                  overflow-hidden
                "
              >
                {/* Top specular highlight sheen */}
                <div className="absolute inset-x-2 top-0.5 h-[38%] rounded-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent dark:from-white/10 dark:via-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[#F8F7F2] dark:bg-[#111813] shadow-xs flex items-center justify-center shrink-0">
                    <RealisticIcon name={question.options[0]?.iconKey || 'coffee'} size={28} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#778078] block truncate">
                      {language === 'ar' ? question.titleAr : question.titleEn}
                    </span>
                    <span className="text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7] truncate block">
                      {displayVal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
