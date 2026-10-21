import React from 'react';
import { UserProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { RealisticIcon } from '../common/RealisticIcon';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface ProfileCompletionScreenProps {
  userProfile: UserProfile;
  language: Language;
  onFindTwin: () => void;
  onGoHome: () => void;
}

export const ProfileCompletionScreen: React.FC<ProfileCompletionScreenProps> = ({
  userProfile,
  language,
  onFindTwin,
  onGoHome,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] px-6 py-6 justify-between transition-colors">
      {/* Header Badge */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3E7] dark:bg-[#0B5D3B]/25 text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-bold">
          <CheckCircle2 size={14} />
          <span>{t.milestone4}</span>
        </div>

        <span className="text-xs font-bold text-[#D4AF37] font-mono">100% READY</span>
      </div>

      {/* Main Showcase Stage */}
      <div className="my-auto py-4 flex flex-col items-center text-center">
        {/* Dynamic Avatar with Soft Gold Glow */}
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-xl animate-pulse" />
          <AvatarRenderer avatar={userProfile.avatar} size={110} direction="center" />
        </div>

        <h1 className="text-2xl font-black text-[#202923] dark:text-white tracking-tight">
          {language === 'ar' ? 'تم تشكيل بصمة شخصيتك بنجاح!' : 'Your Personality Fingerprint is Formed!'}
        </h1>
        <p className="mt-2 text-xs text-[#778078] dark:text-slate-400 max-w-xs leading-relaxed">
          {language === 'ar'
            ? 'قمنا بتحليل أبعادك عبر 9 محاور للذوق وأسلوب الحياة. حان الوقت لمقابلة شبيهك الأول.'
            : 'We synthesized your tastes across all 9 lifestyle and comfort dimensions. Your closest Twin is waiting.'}
        </p>

        {/* Highlighted Dimension Icons */}
        <div className="my-5 flex items-center justify-center gap-3 p-3 bg-white dark:bg-[#18221C] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <RealisticIcon name="coffee_v60" size={36} />
          <RealisticIcon name="food_burger" size={36} />
          <RealisticIcon name="sport_padel" size={36} />
          <RealisticIcon name="car_luxury_sedan" size={36} />
        </div>

        {/* Private security invariant assurance */}
        <div className="flex items-center gap-1.5 text-xs text-[#0B5D3B] dark:text-[#DDF3E7] font-semibold">
          <ShieldCheck size={15} />
          <span>{t.guaranteeTitle}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        {/* Signature Find Twin Button */}
        <button
          onClick={onFindTwin}
          className="w-full h-14 rounded-2xl bg-[#0B5D3B] hover:bg-[#08422A] text-white font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-[#0B5D3B]/25 active:scale-[0.98] transition-all"
        >
          <Sparkles size={20} className="text-[#D4AF37] animate-bounce" />
          <span>{t.findTwinCTA}</span>
          {language === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>

        <button
          onClick={onGoHome}
          className="w-full h-12 rounded-2xl bg-white dark:bg-[#18221C] border border-slate-200 dark:border-slate-800 text-[#202923] dark:text-[#F8F7F2] font-bold text-xs flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          <span>{language === 'ar' ? 'الدخول إلى الصفحة الرئيسية' : 'Explore Home Feed First'}</span>
        </button>
      </div>
    </div>
  );
};
