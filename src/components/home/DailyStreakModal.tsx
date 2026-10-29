import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Language } from '../../types';
import { Flame, X, Check, Sparkles, Award, Trophy, Zap, Calendar } from 'lucide-react';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  streakCount: number;
  onClaimDailyStreak: () => void;
  hasClaimedToday: boolean;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  language,
  streakCount,
  onClaimDailyStreak,
  hasClaimedToday,
}) => {
  const [claimed, setClaimed] = useState(hasClaimedToday);

  if (!isOpen) return null;

  const handleClaim = () => {
    if (claimed) return;
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([40, 50, 60]);
      }
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#D4AF37'],
      });
    } catch {
      // ignore
    }
    setClaimed(true);
    onClaimDailyStreak();
  };

  const daysOfWeek = language === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const milestones = [
    {
      days: 1,
      titleAr: 'شرارة البداية',
      titleEn: 'Spark of Habit',
      rewardAr: '+20 نقطة كاريزما',
      rewardEn: '+20 Charisma Pts',
      isUnlocked: streakCount >= 1,
    },
    {
      days: 3,
      titleAr: 'شعلة التناغم البرونزية',
      titleEn: 'Bronze Vibe Fire',
      rewardAr: 'مضاعف توافق 1.5x',
      rewardEn: '1.5x Match Multiplier',
      isUnlocked: streakCount >= 3,
    },
    {
      days: 5,
      titleAr: 'اللهب الزمردي المتوهج',
      titleEn: 'Emerald Flame',
      rewardAr: 'أولوية الظهور للشبيه',
      rewardEn: 'Priority Twin Discoverability',
      isUnlocked: streakCount >= 5,
    },
    {
      days: 7,
      titleAr: 'تاج الكيمياء الذهبي',
      titleEn: 'Crown of Chemistry',
      rewardAr: 'كشف الشبيه النادر 98%+',
      rewardEn: 'Unlock 98%+ Rare Twin',
      isUnlocked: streakCount >= 7,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="
        relative w-full max-w-sm
        bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
        dark:from-[#1E2B22] dark:via-[#141F18] dark:to-[#0D1510]
        rounded-3xl border-2 border-white/95 dark:border-[#10B981]/40
        shadow-[0_12px_32px_rgba(0,0,0,0.3),0_4px_16px_rgba(245,158,11,0.2)]
        dark:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(245,158,11,0.25)]
        p-5 overflow-hidden
      ">
        {/* Top specular glossy highlight sheen */}
        <div className="absolute inset-x-3 top-0.5 h-[35%] rounded-t-2xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none z-10" />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={17} />
        </button>

        {/* Main Flame Hero Stage */}
        <div className="flex flex-col items-center text-center pt-2 relative z-10">
          
          {/* Animated Flame Icon with Embers */}
          <div className="relative my-2">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-t from-orange-500/30 via-amber-400/25 to-transparent blur-xl pointer-events-none" />
            
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[#FFF5EB] to-[#FFE0C2] dark:from-[#2B1F13] dark:to-[#181109] border-2 border-amber-400/60 flex items-center justify-center shadow-lg">
              <span className="text-4xl animate-flame filter drop-shadow-md">
                🔥
              </span>
              {/* Embers */}
              <span className="absolute -top-1 left-3 text-xs animate-ember">✨</span>
              <span className="absolute -top-2 right-4 text-xs animate-ember" style={{ animationDelay: '0.6s' }}>⚡</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <Sparkles size={16} className="text-[#D4AF37]" />
            <h2 className="text-lg font-black text-[#202923] dark:text-white">
              {language === 'ar' ? `سلسلة التفاعل: ${streakCount} أيام` : `${streakCount}-Day Daily Streak`}
            </h2>
          </div>

          <p className="text-xs text-[#778078] dark:text-slate-300 mt-0.5 max-w-[260px] leading-relaxed">
            {language === 'ar'
              ? 'حافظ على شعلتك مشتعلة يومياً بزيارة التطبيق أو تحديث تفضيلاتك لكسب مكافآت حصرية!'
              : 'Keep your flame burning daily by checking in or updating tastes to unlock special perks!'}
          </p>
        </div>

        {/* 7-Day Visual Progress Track */}
        <div className="my-4 p-3 rounded-2xl bg-white/80 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black text-[#778078] uppercase tracking-wider flex items-center gap-1">
              <Calendar size={12} className="text-amber-500" />
              <span>{language === 'ar' ? 'سجل الأسبوع' : 'Weekly Check-in'}</span>
            </span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {streakCount % 7} / 7 {language === 'ar' ? 'أيام' : 'days'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysOfWeek.map((day, idx) => {
              const isDone = idx < (streakCount % 7 || (streakCount > 0 ? 7 : 0));
              const isToday = idx === (new Date().getDay());

              return (
                <div
                  key={idx}
                  className={`
                    flex flex-col items-center py-1.5 px-0.5 rounded-xl border transition-all
                    ${
                      isDone
                        ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white border-amber-500 shadow-2xs'
                        : isToday
                        ? 'bg-white dark:bg-[#1A251E] border-amber-400 text-amber-600 dark:text-amber-400 ring-2 ring-amber-400/40'
                        : 'bg-slate-100 dark:bg-[#131915] border-transparent text-slate-400'
                    }
                  `}
                >
                  <span className="text-[8px] font-bold block">{day.slice(0, 3)}</span>
                  <span className="text-xs my-0.5">
                    {isDone ? '🔥' : isToday ? '⭐' : '•'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Rewards */}
        <div className="space-y-2 mb-4 relative z-10 max-h-[140px] overflow-y-auto no-scrollbar">
          {milestones.map((m) => (
            <div
              key={m.days}
              className={`
                p-2 rounded-xl border flex items-center justify-between text-xs transition-all
                ${
                  m.isUnlocked
                    ? 'bg-[#E8F7EE] dark:bg-[#0B5D3B]/25 border-[#0B5D3B]/30 text-[#0B5D3B] dark:text-[#34D399]'
                    : 'bg-white/60 dark:bg-[#151D18] border-slate-200/60 dark:border-slate-800 text-slate-500'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs ${
                  m.isUnlocked ? 'bg-[#0B5D3B] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  {m.isUnlocked ? <Check size={13} strokeWidth={3} /> : `${m.days}d`}
                </div>
                <div>
                  <span className="font-bold block leading-none text-[11px]">
                    {language === 'ar' ? m.titleAr : m.titleEn}
                  </span>
                  <span className="text-[9px] text-[#778078] dark:text-slate-400">
                    {language === 'ar' ? m.rewardAr : m.rewardEn}
                  </span>
                </div>
              </div>

              {m.isUnlocked && (
                <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                  ✓ {language === 'ar' ? 'مفعّل' : 'Unlocked'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Action Button: Claim Daily Check-In */}
        <div className="relative z-10 pt-1">
          <button
            type="button"
            onClick={handleClaim}
            disabled={claimed}
            className={`
              relative w-full h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer overflow-hidden
              ${
                claimed
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700 cursor-default'
                  : 'bg-gradient-to-b from-[#F59E0B] via-[#EA580C] to-[#C2410C] text-white border-amber-300 shadow-[0_5px_0_0_#9A3412,0_10px_20px_rgba(234,88,12,0.35)] active:translate-y-1 active:shadow-[0_1px_0_0_#9A3412] hover:brightness-105'
              }
            `}
          >
            {/* Top specular glossy highlight sheen */}
            {!claimed && (
              <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none" />
            )}
            <Flame size={18} className={claimed ? 'text-slate-400' : 'animate-flame'} />
            <span>
              {claimed
                ? (language === 'ar' ? 'تم تسجيل حضور اليوم بنجاح 🔥' : 'Streak Claimed for Today 🔥')
                : (language === 'ar' ? 'تسجيل تفاعل اليوم (+1 يوم) 🔥' : 'Claim Daily Streak (+1 Day) 🔥')}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
