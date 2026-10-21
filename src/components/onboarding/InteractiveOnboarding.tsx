import React, { useState } from 'react';
import { Question, Language, UserProfile } from '../../types';
import { ONBOARDING_QUESTIONS } from '../../data/questions';
import { TRANSLATIONS } from '../../i18n/translations';
import { RealisticIcon } from '../common/RealisticIcon';
import { Check, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

interface InteractiveOnboardingProps {
  initialAnswers: Record<string, string | string[]>;
  language: Language;
  onComplete: (answers: Record<string, string | string[]>) => void;
  onExit: () => void;
}

export const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({
  initialAnswers,
  language,
  onComplete,
  onExit,
}) => {
  const t = TRANSLATIONS[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(initialAnswers);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);

  const currentQ: Question = ONBOARDING_QUESTIONS[currentIndex];
  const total = ONBOARDING_QUESTIONS.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  // Dynamic Milestone banner calculation
  const getMilestone = () => {
    if (currentIndex === 0) return t.milestone1;
    if (currentIndex === 2) return t.milestone2;
    if (currentIndex === 5) return t.milestone3;
    if (currentIndex >= 8) return t.milestone4;
    return null;
  };

  const currentMilestone = getMilestone();

  const handleSelectOption = (optionId: string) => {
    setAnimatingCardId(optionId);
    setTimeout(() => setAnimatingCardId(null), 300);

    if (currentQ.isMultiSelect) {
      const prev = (answers[currentQ.id] as string[]) || [];
      let updated: string[];

      // If user clicks "I do not regularly play sports", clear others
      if (optionId === 'sport_none') {
        updated = prev.includes('sport_none') ? [] : ['sport_none'];
      } else {
        const withoutNone = prev.filter((id) => id !== 'sport_none');
        if (withoutNone.includes(optionId)) {
          updated = withoutNone.filter((id) => id !== optionId);
        } else {
          const max = currentQ.maxSelect || 4;
          if (withoutNone.length < max) {
            updated = [...withoutNone, optionId];
          } else {
            updated = [...withoutNone.slice(1), optionId];
          }
        }
      }

      setAnswers({ ...answers, [currentQ.id]: updated });
    } else {
      // Single choice
      setAnswers({ ...answers, [currentQ.id]: optionId });

      // Automatically advance to next screen after 240ms subtle rewarding delay
      setTimeout(() => {
        if (currentIndex < total - 1) {
          setCurrentIndex((idx) => idx + 1);
        } else {
          onComplete({ ...answers, [currentQ.id]: optionId });
        }
      }, 260);
    }
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    } else {
      onExit();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const currentAnswer = answers[currentQ.id];
  const isSelected = (optionId: string) => {
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.includes(optionId);
    }
    return currentAnswer === optionId;
  };

  const hasAnsweredCurrent = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : Boolean(currentAnswer);

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] transition-colors pb-safe">
      {/* Sticky Top Bar with Progress */}
      <header className="sticky top-0 z-30 bg-[#F8F7F2]/90 dark:bg-[#111813]/90 backdrop-blur-md px-5 pt-4 pb-3 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handlePrev}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300"
            aria-label="Back"
          >
            {language === 'ar' ? <ArrowRight size={22} /> : <ArrowLeft size={22} />}
          </button>

          {/* Clean unboxed step index */}
          <div className="text-xs font-semibold tracking-wide text-[#778078] flex items-center gap-1.5">
            <span>
              {t.questionOf} {currentIndex + 1} {t.of} {total}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="min-h-[44px] px-3 flex items-center justify-center text-xs font-semibold text-[#0B5D3B] dark:text-[#DDF3E7] hover:underline"
          >
            {t.skipBtn}
          </button>
        </div>

        {/* Smooth Emerald Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#0B5D3B] dark:bg-[#10b981] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestone Indicator Banner if active */}
        {currentMilestone && (
          <div className="mt-2.5 flex items-center gap-2 py-1 px-3 bg-[#DDF3E7] dark:bg-[#0B5D3B]/25 rounded-xl border border-[#0B5D3B]/20 text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-medium">
            <Sparkles size={14} className="text-[#D4AF37] shrink-0" />
            <span className="truncate">{currentMilestone}</span>
          </div>
        )}
      </header>

      {/* Main Single Question Stage */}
      <main className="flex-1 px-5 pt-5 pb-24 overflow-y-auto no-scrollbar">
        {/* Question Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#202923] dark:text-white leading-tight">
            {language === 'ar' ? currentQ.titleAr : currentQ.titleEn}
          </h1>
          <p className="mt-2 text-sm text-[#778078] dark:text-slate-400 leading-relaxed">
            {currentQ.isMultiSelect
              ? t.multiSelectHint
              : language === 'ar'
              ? currentQ.subtitleAr
              : currentQ.subtitleEn}
          </p>
        </div>

        {/* Answer Cards Grid with 3D Tactile Skeuomorphic finish */}
        <div className="space-y-3.5">
          {currentQ.options.map((option) => {
            const active = isSelected(option.id);
            const isPulsing = animatingCardId === option.id;

            return (
              <div key={option.id} className="relative group w-full py-0.5 select-none">
                {/* Ambient decoupled shadow */}
                <div
                  className={`absolute inset-x-3 bottom-0 h-4 rounded-2xl blur-md pointer-events-none transition-all ${
                    active
                      ? 'bg-[#0B5D3B]/30 scale-95 opacity-80'
                      : 'bg-black/10 dark:bg-black/40 scale-90 opacity-40 group-hover:scale-100 group-hover:opacity-60'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  className={`relative w-full p-4 rounded-2xl text-start transition-all duration-150 flex items-center gap-4 cursor-pointer transform-gpu active:translate-y-1 ${
                    isPulsing ? 'scale-[0.98]' : ''
                  } ${
                    active
                      ? 'bg-gradient-to-b from-[#E6F8EF] via-[#DDF3E7] to-[#C9EBD7] dark:from-[#0B5D3B]/45 dark:via-[#0B5D3B]/35 dark:to-[#08422A]/50 border-2 border-[#0B5D3B] dark:border-[#10b981] shadow-[0_5px_0_0_#0B5D3B,0_12px_18px_rgba(11,93,59,0.25)] dark:shadow-[0_5px_0_0_#062B1C] ring-4 ring-[#0B5D3B]/15'
                      : 'bg-gradient-to-b from-white via-[#FAF9F5] to-[#EFECE4] dark:from-[#222C24] dark:via-[#1B231D] dark:to-[#151C17] border border-white/90 dark:border-white/10 shadow-[0_5px_0_0_#D3CBB9,0_10px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_5px_0_0_#0D130F,0_10px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_7px_0_0_#D3CBB9,0_12px_18px_rgba(0,0,0,0.08)]'
                  }`}
                >
                  {/* Top specular glossy highlight sheen */}
                  <div
                    className={`absolute inset-x-2 top-1 h-[40%] rounded-xl pointer-events-none ${
                      active
                        ? 'bg-gradient-to-b from-white/70 via-white/20 to-transparent'
                        : 'bg-gradient-to-b from-white/85 via-white/25 to-transparent dark:from-white/10 dark:via-transparent'
                    }`}
                  />

                  {/* Premium Realistic Category Illustration */}
                  <div
                    className={`relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                      active ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  >
                    <RealisticIcon name={option.iconKey} size={50} />
                  </div>

                  {/* Option Text Info */}
                  <div className="relative z-10 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-base font-bold leading-snug truncate ${
                          active
                            ? 'text-[#0B5D3B] dark:text-[#DDF3E7]'
                            : 'text-[#202923] dark:text-[#F8F7F2]'
                        }`}
                      >
                        {language === 'ar' ? option.labelAr : option.labelEn}
                      </span>

                      {/* Active Checkmark Pill */}
                      {active && (
                        <div className="w-6 h-6 rounded-full bg-[#0B5D3B] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Subtitle / Description */}
                    {(option.descriptionEn || option.descriptionAr) && (
                      <p className="mt-1 text-xs text-[#778078] dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {language === 'ar' ? option.descriptionAr : option.descriptionEn}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Sticky Bottom Action Area */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-[#F8F7F2] via-[#F8F7F2] to-transparent dark:from-[#111813] dark:via-[#111813] z-20">
        <button
          onClick={handleNext}
          disabled={!hasAnsweredCurrent}
          className={`w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
            hasAnsweredCurrent
              ? 'bg-[#0B5D3B] hover:bg-[#08422A] text-white shadow-[#0B5D3B]/25 active:scale-[0.98]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>{currentIndex === total - 1 ? t.milestone4 : t.continueBtn}</span>
          {language === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
      </footer>
    </div>
  );
};
