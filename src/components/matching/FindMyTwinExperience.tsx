import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { ONBOARDING_QUESTIONS } from '../../data/questions';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { RealisticIcon } from '../common/RealisticIcon';
import { SpringTiltCard } from '../common/SpringTiltCard';
import { formatCity, formatBio } from '../../utils/localization';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Layers,
  ShieldCheck,
  Heart,
  CheckCircle2,
  Zap,
  RotateCcw,
  Bookmark,
  HandMetal,
} from 'lucide-react';

interface FindMyTwinExperienceProps {
  userProfile: UserProfile;
  match: MatchProfile | null;
  language: Language;
  onOpenComparison: (match: MatchProfile) => void;
  onClose: () => void;
  onNextMatch?: () => void;
  reducedMotion?: boolean;
  savedProfileIds?: string[];
  onToggleSaveProfile?: (matchId: string) => void;
  onSendHighFive?: (match: MatchProfile) => void;
}

type RevealPhase =
  | 'scanning' // Scanning category dimensions
  | 'approaching' // Avatars enter and face each other
  | 'collision' // Dedicated Interest Collision stage (interests slide from opposite sides and meet)
  | 'high_five' // High five moment with sparkle burst
  | 'revealed'; // Similarity score, shared interests & CTA

interface CollidingInterest {
  id: string;
  categoryNameEn: string;
  categoryNameAr: string;
  labelEn: string;
  labelAr: string;
  iconKey: string;
}

export const FindMyTwinExperience: React.FC<FindMyTwinExperienceProps> = ({
  userProfile,
  match,
  language,
  onOpenComparison,
  onClose,
  onNextMatch,
  reducedMotion = false,
  savedProfileIds = [],
  onToggleSaveProfile,
  onSendHighFive,
}) => {
  const t = TRANSLATIONS[language];
  const [phase, setPhase] = useState<RevealPhase>('scanning');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Interest collision stage states
  const [activeCollisionStep, setActiveCollisionStep] = useState(0);
  const [collidedItems, setCollidedItems] = useState<number[]>([]);

  // Subtle physical vibration pattern reinforcing the collision match
  const triggerCollisionVibration = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        // Multi-beat rhythmic haptic pulse on collision impact: 35ms pulse, 45ms pause, 60ms pulse, 40ms pause, 80ms surge
        navigator.vibrate([35, 45, 60, 40, 80]);
      }
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  };

  const triggerHighFiveVibration = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        // Celebratory crescendo haptic burst
        navigator.vibrate([60, 40, 100, 50, 160]);
      }
    } catch {
      // Ignore vibration error
    }
  };

  const categories = [
    { key: 'coffee_v60', labelEn: 'Specialty Coffee', labelAr: 'القهوة المختصة' },
    { key: 'food_burger', labelEn: 'Comfort Food', labelAr: 'المأكولات المفضلة' },
    { key: 'sport_padel', labelEn: 'Sports & Padel', labelAr: 'الرياضة والبادل' },
    { key: 'car_luxury_sedan', labelEn: 'Driving Philosophy', labelAr: 'فلسفة القيادة' },
    { key: 'lifestyle_nightowl', labelEn: 'Daily Lifestyle', labelAr: 'أسلوب الحياة' },
  ];

  // Derive actual overlapping interests between user and match
  const getOverlappingInterests = (): CollidingInterest[] => {
    if (!match) return [];
    const overlaps: CollidingInterest[] = [];

    for (const q of ONBOARDING_QUESTIONS) {
      const userAns = userProfile.answers[q.id];
      const matchAns = match.answers[q.id];

      if (!userAns || !matchAns) continue;

      if (Array.isArray(userAns) && Array.isArray(matchAns)) {
        const common = userAns.filter((item) => matchAns.includes(item) && item !== 'sport_none');
        for (const sportId of common) {
          const opt = q.options.find((o) => o.id === sportId);
          if (opt) {
            overlaps.push({
              id: `${q.id}_${opt.id}`,
              categoryNameEn: q.titleEn,
              categoryNameAr: q.titleAr,
              labelEn: opt.labelEn,
              labelAr: opt.labelAr,
              iconKey: opt.iconKey,
            });
          }
        }
      } else if (userAns === matchAns) {
        const opt = q.options.find((o) => o.id === userAns);
        if (opt) {
          overlaps.push({
            id: `${q.id}_${opt.id}`,
            categoryNameEn: q.titleEn,
            categoryNameAr: q.titleAr,
            labelEn: opt.labelEn,
            labelAr: opt.labelAr,
            iconKey: opt.iconKey,
          });
        }
      }
    }

    if (overlaps.length < 3 && match.sharedInterests.length > 0) {
      match.sharedInterests.forEach((interestStr, idx) => {
        if (!overlaps.some((o) => o.labelEn === interestStr)) {
          overlaps.push({
            id: `shared_${idx}`,
            categoryNameEn: 'Shared Taste',
            categoryNameAr: 'ذوق مشترك',
            labelEn: interestStr,
            labelAr: interestStr,
            iconKey: idx % 2 === 0 ? 'coffee_v60' : 'food_burger',
          });
        }
      });
    }

    return overlaps.slice(0, 4);
  };

  const collisionList = getOverlappingInterests();

  if (!match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-[#F8F7F2] dark:bg-[#080D0A] text-[#202923] dark:text-[#F8F7F2]">
        <div className="w-20 h-20 rounded-3xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/30 flex items-center justify-center mb-5 text-[#0B5D3B] dark:text-[#DDF3E7] shadow-lg">
          <RealisticIcon name="place_cozycafe" size={48} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#202923] dark:text-white">
          {language === 'ar' ? 'لم نجد شبيهاً يطابق معاييرك بالكامل حالياً' : 'No 80%+ Twin Found in This Area Yet'}
        </h2>
        <p className="mt-3 text-sm text-[#778078] max-w-xs leading-relaxed">
          {language === 'ar'
            ? 'تفضيلاتك فريدة جداً! بمجرد انضمام أعضاء جدد يشاركونك نفس الذوق، سننبهك فوراً.'
            : 'Your taste is exceptionally unique! As more members complete their onboarding, we will notify you.'}
        </p>
        <button
          onClick={onClose}
          className="mt-8 px-6 py-3 rounded-full bg-[#0B5D3B] text-white text-sm font-bold shadow-lg shadow-[#0B5D3B]/30 active:scale-95 transition-all cursor-pointer"
        >
          {t.doneBtn}
        </button>
      </div>
    );
  }

  // Choreographed Multi-Stage Animation Sequence
  useEffect(() => {
    if (reducedMotion) {
      setPhase('revealed');
      setAnimatedScore(match.similarityScore);
      setCollidedItems(collisionList.map((_, i) => i));
      return;
    }

    // Stage 1: Category sequence scanning
    const categoryInterval = setInterval(() => {
      setActiveCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 280);

    // Stage 2: Approaching
    const approachTimer = setTimeout(() => {
      clearInterval(categoryInterval);
      setPhase('approaching');
    }, 1400);

    // Stage 3: Dedicated Interest Collision Stage
    const collisionStartTimer = setTimeout(() => {
      setPhase('collision');
      setCollidedItems([]);
      setActiveCollisionStep(0);

      collisionList.forEach((_, index) => {
        setTimeout(() => {
          setActiveCollisionStep(index);
          // Collision impact moment: Trigger haptic vibration & lock item!
          setTimeout(() => {
            triggerCollisionVibration();
            setCollidedItems((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }, 480);
        }, index * 950);
      });
    }, 2300);

    // Stage 4: High-Five Celebration
    const totalCollisionDuration = Math.max(collisionList.length * 950 + 900, 2600);
    const highFiveTimer = setTimeout(() => {
      setPhase('high_five');
      triggerHighFiveVibration();

      try {
        confetti({
          particleCount: 55,
          spread: 80,
          origin: { y: 0.42 },
          colors: ['#0B5D3B', '#DDF3E7', '#D4AF37', '#FFFFFF'],
          disableForReducedMotion: true,
        });
      } catch {
        // fallback
      }
    }, 2300 + totalCollisionDuration);

    // Stage 5: Final Similarity Score & Comparison Reveal
    const revealTimer = setTimeout(() => {
      setPhase('revealed');
      let cur = 0;
      const target = match.similarityScore;
      const step = () => {
        cur += 2;
        if (cur <= target) {
          setAnimatedScore(cur);
          requestAnimationFrame(step);
        } else {
          setAnimatedScore(target);
        }
      };
      requestAnimationFrame(step);
    }, 2300 + totalCollisionDuration + 1300);

    return () => {
      clearInterval(categoryInterval);
      clearTimeout(approachTimer);
      clearTimeout(collisionStartTimer);
      clearTimeout(highFiveTimer);
      clearTimeout(revealTimer);
    };
  }, [match.id, reducedMotion]);

  const handleSkipToReveal = () => {
    setPhase('revealed');
    setAnimatedScore(match.similarityScore);
    setCollidedItems(collisionList.map((_, i) => i));
  };

  const handleReplayCollision = () => {
    setPhase('collision');
    setCollidedItems([]);
    setActiveCollisionStep(0);

    collisionList.forEach((_, index) => {
      setTimeout(() => {
        setActiveCollisionStep(index);
        setTimeout(() => {
          triggerCollisionVibration();
          setCollidedItems((prev) => (prev.includes(index) ? prev : [...prev, index]));
        }, 480);
      }, index * 900);
    });

    const totalDuration = collisionList.length * 900 + 800;
    setTimeout(() => {
      setPhase('revealed');
    }, totalDuration);
  };

  const handleTapCollisionItem = (index: number) => {
    triggerCollisionVibration();
    setCollidedItems((prev) => prev.filter((i) => i !== index));
    setActiveCollisionStep(index);
    setTimeout(() => {
      triggerCollisionVibration();
      setCollidedItems((prev) => [...prev, index]);
    }, 450);
  };

  return (
    <div className="relative flex flex-col min-h-screen max-w-md mx-auto w-full bg-[#F8F7F2] dark:bg-[#080D0A] text-[#202923] dark:text-[#F8F7F2] overflow-x-hidden pb-safe transition-colors">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 z-20">
        <button
          onClick={onClose}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          aria-label="Exit"
        >
          {language === 'ar' ? <ArrowRight size={22} /> : <ArrowLeft size={22} />}
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7]">
          <Sparkles size={14} className="text-[#D4AF37]" />
          <span>
            {phase === 'collision'
              ? (language === 'ar' ? 'مواجهة الاهتمامات المشتركة' : 'Interest Collision Arena')
              : phase === 'high_five'
              ? t.highFiveMoment
              : phase === 'revealed'
              ? t.twinRevealed
              : t.scannerTitle}
          </span>
        </div>

        {phase !== 'revealed' ? (
          <button
            onClick={handleSkipToReveal}
            className="text-[11px] font-semibold text-[#778078] hover:text-[#0B5D3B] transition-colors cursor-pointer"
          >
            {language === 'ar' ? 'تخطي' : 'Skip'}
          </button>
        ) : (
          <button
            onClick={handleReplayCollision}
            className="text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>{language === 'ar' ? 'إعادة' : 'Replay'}</span>
          </button>
        )}
      </div>

      {/* Main Experience Arena */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        
        {/* STAGE 1: Scanning Categories Animation */}
        {phase === 'scanning' && (
          <div className="flex flex-col items-center text-center animate-fade-in py-8">
            <div className="relative w-28 h-28 rounded-3xl bg-white dark:bg-[#151E17] border border-[#0B5D3B]/20 shadow-xl flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-3xl border-2 border-[#0B5D3B]/40 animate-ping opacity-40" />
              <RealisticIcon name={categories[activeCategoryIndex].key} size={64} />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#0B5D3B] dark:text-[#DDF3E7]">
              {t.scanningCategory}
            </span>
            <h3 className="text-lg font-bold text-[#202923] dark:text-white mt-1">
              {language === 'ar'
                ? categories[activeCategoryIndex].labelAr
                : categories[activeCategoryIndex].labelEn}
            </h3>
            <p className="text-xs text-[#778078] dark:text-slate-400 mt-2 max-w-xs">
              {t.scannerSubtitle}
            </p>
          </div>
        )}

        {/* STAGES 2, 3, 4 & 5 */}
        {phase !== 'scanning' && (
          <div className="w-full flex flex-col items-center">
            
            {/* Facing Avatars Stage */}
            <div className="relative w-full h-40 flex items-center justify-center overflow-visible my-1">
              
              {/* User Avatar (Left Side, Facing Right) */}
              <div
                className={`absolute transition-all duration-700 ease-out ${
                  phase === 'approaching'
                    ? 'left-4 scale-95'
                    : phase === 'collision'
                    ? 'left-3 scale-95'
                    : phase === 'high_five'
                    ? 'left-[18%] scale-105'
                    : 'left-[14%] scale-100'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <AvatarRenderer
                      avatar={userProfile.avatar}
                      size={phase === 'collision' ? 78 : 92}
                      direction="right"
                      highFivePose={phase === 'high_five'}
                    />
                    {phase === 'collision' && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0B5D3B] text-white text-[9px] flex items-center justify-center font-bold shadow-xs">
                        ➔
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] max-w-[85px] truncate">
                    {t.youLabel}
                  </span>
                  <span className="text-[9px] text-[#778078]">{formatCity(userProfile.city, language)}</span>
                </div>
              </div>

              {/* Match Avatar (Right Side, Facing Left) */}
              <div
                className={`absolute transition-all duration-700 ease-out ${
                  phase === 'approaching'
                    ? 'right-4 scale-95'
                    : phase === 'collision'
                    ? 'right-3 scale-95'
                    : phase === 'high_five'
                    ? 'right-[18%] scale-105'
                    : 'right-[14%] scale-100'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <AvatarRenderer
                      avatar={match.avatar}
                      size={phase === 'collision' ? 78 : 92}
                      direction="left"
                      highFivePose={phase === 'high_five'}
                    />
                    {phase === 'collision' && (
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#0B5D3B] text-white text-[9px] flex items-center justify-center font-bold shadow-xs">
                        🠔
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-[11px] font-bold text-[#202923] dark:text-white max-w-[85px] truncate">
                    @{match.username}
                  </span>
                  <span className="text-[9px] text-[#778078]">{formatCity(match.city, language)}</span>
                </div>
              </div>

              {phase === 'high_five' ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-sparkle-glow">
                  <div className="w-16 h-16 rounded-full bg-[#D4AF37]/35 blur-md flex items-center justify-center">
                    <Sparkles size={36} className="text-[#D4AF37] animate-bounce" />
                  </div>
                </div>
              ) : phase === 'collision' ? (
                <div className="flex flex-col items-center pointer-events-none">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-white/90 dark:bg-[#151E17]/90 px-2 py-0.5 rounded-full border border-[#D4AF37]/30 shadow-2xs">
                    ⚡ {language === 'ar' ? 'لقاء' : 'VS'}
                  </span>
                </div>
              ) : null}
            </div>

            {/* ============================================================== */}
            {/* DEDICATED INTEREST COLLISION STAGE WITH REACT-SPRING TILT */}
            {/* ============================================================== */}
            {phase === 'collision' && (
              <div className="w-full mt-1 mb-2 animate-fade-in flex flex-col items-center">
                {/* Stage Header */}
                <div className="text-center mb-2.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3E7] dark:bg-[#0B5D3B]/30 border border-[#0B5D3B]/25 text-[#0B5D3B] dark:text-[#DDF3E7] text-[11px] font-bold shadow-2xs">
                    <Zap size={13} className="text-[#D4AF37] animate-pulse" />
                    <span>{language === 'ar' ? 'مواجهة الاهتمامات المشتركة' : 'Interest Collision Arena'}</span>
                  </div>
                  <p className="text-[11px] text-[#778078] dark:text-slate-400 mt-1 max-w-xs">
                    {language === 'ar'
                      ? 'الأشياء التي تحبونها تنطلق من الطرفين وتلتقي في المركز (حرّك المس بالماوس/اللمس للتفاعل)'
                      : 'Mutual passions slide into the center from opposite sides to meet (touch/drag to tilt)'}
                  </p>
                </div>

                {/* The Collision Arena Container */}
                <div className="w-full relative min-h-[190px] flex flex-col items-center justify-center py-2 px-1">
                  
                  {/* Central Magnetic Vertical Axis */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#D4AF37] via-[#0B5D3B]/40 to-transparent pointer-events-none animate-electric-beam" />

                  {/* Colliding Stack with React-Spring physical drag/tilt */}
                  <div className="w-full space-y-2.5 z-10">
                    {collisionList.map((item, idx) => {
                      const isPastOrCurrent = idx <= activeCollisionStep;
                      const hasCollided = collidedItems.includes(idx);

                      if (!isPastOrCurrent) return null;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleTapCollisionItem(idx)}
                          className="relative w-full h-11 flex items-center justify-center cursor-pointer"
                          title="Touch or Drag to feel spring physics / Tap to replay collision"
                        >
                          {!hasCollided ? (
                            <div className="w-full flex items-center justify-between px-1">
                              {/* Left Sliding Item */}
                              <div className="animate-collide-left flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 border border-[#0B5D3B]/40 text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-bold shadow-sm">
                                <RealisticIcon name={item.iconKey} size={18} />
                                <span className="truncate max-w-[95px]">
                                  {language === 'ar' ? item.labelAr : item.labelEn}
                                </span>
                              </div>

                              {/* Center Impact Indicator */}
                              <div className="w-6 h-6 rounded-full bg-[#D4AF37]/30 flex items-center justify-center animate-ping">
                                <Sparkles size={12} className="text-[#D4AF37]" />
                              </div>

                              {/* Right Sliding Item */}
                              <div className="animate-collide-right flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 border border-[#0B5D3B]/40 text-[#0B5D3B] dark:text-[#DDF3E7] text-xs font-bold shadow-sm">
                                <span className="truncate max-w-[95px]">
                                  {language === 'ar' ? item.labelAr : item.labelEn}
                                </span>
                                <RealisticIcon name={item.iconKey} size={18} />
                              </div>
                            </div>
                          ) : (
                            /* MERGED COMMON GROUND BADGE WITH 3D LUXURY SKEUOMORPHIC CARD & SPRING TILT */
                            <SpringTiltCard
                              className="w-full max-w-[310px]"
                              maxTilt={16}
                              scaleOnHover={1.06}
                            >
                              <div className="
                                animate-collision-impact relative overflow-hidden w-full px-4 py-2.5 rounded-2xl
                                bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                                dark:from-[#1D2B22] dark:via-[#141F18] dark:to-[#0D1510]
                                border-2 border-[#0B5D3B] dark:border-[#10b981]
                                shadow-[0_5px_0_0_#062A1A,0_10px_16px_rgba(11,93,59,0.2)]
                                dark:shadow-[0_5px_0_0_#03180F]
                                flex items-center justify-between gap-2
                              ">
                                {/* Top specular glossy highlight sheen */}
                                <div className="absolute inset-x-2 top-0.5 h-[42%] rounded-t-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />

                                <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                                  <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#E8F7EE] to-[#D5EDE0] dark:from-[#0B5D3B]/50 dark:to-[#073D26] border border-[#0B5D3B]/25 flex items-center justify-center shrink-0 shadow-2xs">
                                    <RealisticIcon name={item.iconKey} size={20} />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[9px] uppercase tracking-wider text-[#D4AF37] font-black block leading-none">
                                      ★ {language === 'ar' ? 'نقطة التقاء مشتركة' : 'Common Ground Locked'}
                                    </span>
                                    <span className="text-xs font-black text-[#0B5D3B] dark:text-[#E8F7EE] truncate block mt-0.5">
                                      {language === 'ar' ? item.labelAr : item.labelEn}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0 relative z-10">
                                  <span className="text-[10px] font-black text-[#0B5D3B] dark:text-[#10B981]">
                                    100%
                                  </span>
                                  <div className="w-5 h-5 rounded-full bg-[#0B5D3B] text-white flex items-center justify-center shadow-xs">
                                    <CheckCircle2 size={13} strokeWidth={3} />
                                  </div>
                                </div>
                              </div>
                            </SpringTiltCard>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress Counter */}
                <div className="mt-2 text-[10px] font-bold text-[#778078] flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[#D4AF37]" />
                  <span>
                    {language === 'ar'
                      ? `تم دمج ${collidedItems.length} من ${collisionList.length} نقاط مشتركة (اسحب باللمس لتجربة الفيزياء التفاعلية)`
                      : `Merged ${collidedItems.length} of ${collisionList.length} common ground points (drag/tilt to feel physics)`}
                  </span>
                </div>
              </div>
            )}

            {/* HIGH FIVE ANNOUNCEMENT */}
            {phase === 'high_five' && (
              <div className="text-center py-4 animate-bounce">
                <span className="text-base font-black text-[#0B5D3B] dark:text-[#DDF3E7] uppercase tracking-wider">
                  {t.highFiveMoment} 🤝✨
                </span>
                <p className="text-xs text-[#778078] dark:text-slate-400 mt-1">
                  {language === 'ar'
                    ? 'التقت التفضيلات واكتملت نقطة التواصل!'
                    : 'Common ground unified. Personality sync complete!'}
                </p>
              </div>
            )}

            {/* REVEALED CARD CONTENT */}
            {phase === 'revealed' && (
              <div className="w-full mt-2 animate-fade-in space-y-4">
                
                {/* 3D Tactile Skeuomorphic Similarity Score Banner */}
                <div className="
                  relative overflow-hidden p-4 rounded-3xl
                  bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                  dark:from-[#1D2B22] dark:via-[#141F18] dark:to-[#0D1510]
                  border-2 border-white/95 dark:border-[#10B981]/40
                  shadow-[0_8px_20px_rgba(11,93,59,0.14)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]
                  flex items-center justify-between
                ">
                  {/* Top specular glossy highlight sheen */}
                  <div className="absolute inset-x-3 top-0.5 h-[40%] rounded-t-2xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    <span className="text-xs font-bold text-[#778078] dark:text-slate-300 uppercase tracking-wider block">
                      {t.similarityMatch}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-4xl font-black text-[#0B5D3B] dark:text-[#10b981] font-mono tabular-nums">
                        {animatedScore}%
                      </span>
                      <span className="text-xs font-bold text-[#D4AF37]">
                        {animatedScore >= 95 ? (language === 'ar' ? '★ شبيه استثنائي' : '★ Exceptional Twin') : (language === 'ar' ? '★ توافق عالي جداً' : '★ High Compatibility')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#0B5D3B] dark:text-[#DDF3E7] font-bold relative z-10 px-3 py-1.5 rounded-full bg-white/80 dark:bg-black/30 border border-[#0B5D3B]/20">
                    <ShieldCheck size={16} className="text-[#0B5D3B] dark:text-[#10B981]" />
                    <span>{formatCity(match.city, language)}</span>
                  </div>
                </div>

                {/* Collided Common Ground Highlights with Spring Tilt */}
                <div className="
                  relative overflow-hidden p-4 rounded-3xl
                  bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                  dark:from-[#1D2B22] dark:via-[#141F18] dark:to-[#0D1510]
                  border border-white/95 dark:border-white/10
                  shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]
                ">
                  {/* Top specular glossy highlight sheen */}
                  <div className="absolute inset-x-3 top-0.5 h-[35%] rounded-t-2xl bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none" />

                  <div className="flex items-center justify-between mb-2.5 relative z-10">
                    <h4 className="text-xs font-bold text-[#778078] dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#D4AF37]" />
                      <span>{language === 'ar' ? 'النقاط المشتركة التي التقت' : 'Unified Common Ground'}</span>
                    </h4>

                    <button
                      onClick={handleReplayCollision}
                      className="text-[11px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Zap size={12} className="text-[#D4AF37]" />
                      <span>{language === 'ar' ? 'شاهد التصادم ثانية' : 'Watch Collision Again'}</span>
                    </button>
                  </div>

                  {/* Clean list of common ground points with high contrast emerald pills */}
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {match.sharedInterests.map((interest, i) => (
                      <SpringTiltCard key={i} maxTilt={12} scaleOnHover={1.05}>
                        <div className="px-3.5 py-1.5 rounded-xl bg-[#E8F7EE] dark:bg-[#122A1E] text-[#07472B] dark:text-[#34D399] text-xs font-black border border-[#0B5D3B]/30 dark:border-[#10B981]/50 flex items-center gap-1.5 shadow-2xs">
                          <Heart size={12} className="fill-[#0B5D3B] text-[#0B5D3B] dark:fill-[#34D399] dark:text-[#34D399]" />
                          <span>{language === 'ar' ? (categories[i]?.labelAr || interest) : interest}</span>
                        </div>
                      </SpringTiltCard>
                    ))}
                  </div>

                  {/* Match Bio Quote */}
                  <p className="mt-3 text-xs italic text-[#778078] dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-800 pt-2.5 relative z-10">
                    "{formatBio(match, language)}"
                  </p>
                </div>

                {/* 3D Tactile Skeuomorphic Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    {onToggleSaveProfile && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSaveProfile(match.id);
                        }}
                        className={`
                          relative h-12 rounded-2xl flex items-center justify-center gap-2 text-xs font-black border transition-all cursor-pointer overflow-hidden
                          bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                          dark:from-[#1D2B22] dark:via-[#141E18] dark:to-[#0D1510]
                          border-white/95 dark:border-[#10B981]/30
                          shadow-[0_4px_0_0_#CFC6B4,0_8px_14px_rgba(0,0,0,0.06)]
                          dark:shadow-[0_4px_0_0_#062316]
                          active:translate-y-1 active:shadow-[0_1px_0_0_#CFC6B4]
                          dark:active:shadow-[0_1px_0_0_#062316]
                          ${savedProfileIds.includes(match.id) ? 'text-[#D4AF37]' : 'text-[#202923] dark:text-white'}
                        `}
                      >
                        <div className="absolute inset-x-2 top-0.5 h-[38%] rounded-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
                        <Bookmark size={15} className={`relative z-10 ${savedProfileIds.includes(match.id) ? 'fill-[#D4AF37]' : ''}`} />
                        <span className="relative z-10">{savedProfileIds.includes(match.id) ? t.savedProfile : t.saveProfile}</span>
                      </button>
                    )}

                    {onSendHighFive && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendHighFive(match);
                        }}
                        className="
                          relative h-12 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-black border transition-all cursor-pointer overflow-hidden
                          bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                          dark:from-[#1D2B22] dark:via-[#141E18] dark:to-[#0D1510]
                          border-white/95 dark:border-[#10B981]/30
                          shadow-[0_4px_0_0_#CFC6B4,0_8px_14px_rgba(0,0,0,0.06)]
                          dark:shadow-[0_4px_0_0_#062316]
                          active:translate-y-1 active:shadow-[0_1px_0_0_#CFC6B4]
                          dark:active:shadow-[0_1px_0_0_#062316]
                          text-[#0B5D3B] dark:text-[#10B981]
                        "
                      >
                        <div className="absolute inset-x-2 top-0.5 h-[38%] rounded-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
                        <HandMetal size={15} className="text-[#D4AF37] relative z-10" />
                        <span className="relative z-10">{t.highFive}</span>
                      </button>
                    )}
                  </div>

                  {/* COMPARE PERSONALITIES: Full 3D Tactile Skeuomorphic Master Button */}
                  <button
                    type="button"
                    id="find-twin-compare-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                          navigator.vibrate([25, 35]);
                        }
                      } catch {
                        // ignore
                      }
                      onOpenComparison(match);
                    }}
                    className="
                      relative z-20 w-full min-h-[52px] rounded-2xl
                      bg-gradient-to-b from-[#189662] via-[#0B5D3B] to-[#073D26]
                      dark:from-[#199863] dark:via-[#0E6D46] dark:to-[#073D26]
                      text-white font-black text-sm flex items-center justify-center gap-2.5
                      border-2 border-[#34D399]/70 dark:border-[#34D399]/60
                      shadow-[0_6px_0_0_#062A1A,0_14px_28px_rgba(11,93,59,0.45)]
                      dark:shadow-[0_6px_0_0_#03180F,0_14px_28px_rgba(0,0,0,0.7)]
                      hover:brightness-105 active:scale-[0.98] active:translate-y-1.5 active:shadow-[0_1px_0_0_#062A1A]
                      transition-all duration-150 transform-gpu cursor-pointer overflow-hidden
                    "
                  >
                    {/* Top specular glossy highlight sheen */}
                    <div className="absolute inset-x-3 top-0.5 h-[42%] rounded-xl bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none" />
                    <Layers size={19} className="relative z-10" />
                    <span className="relative z-10 tracking-wide">{t.comparePersonalities}</span>
                  </button>

                  {onNextMatch && (
                    <button
                      onClick={onNextMatch}
                      className="
                        relative w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-xs font-black border transition-all cursor-pointer overflow-hidden
                        bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                        dark:from-[#1D2B22] dark:via-[#141E18] dark:to-[#0D1510]
                        border-white/95 dark:border-white/10
                        shadow-[0_4px_0_0_#CFC6B4,0_8px_14px_rgba(0,0,0,0.06)]
                        dark:shadow-[0_4px_0_0_#062316]
                        active:translate-y-1 active:shadow-[0_1px_0_0_#CFC6B4]
                        text-[#202923] dark:text-[#E8F7EE]
                      "
                    >
                      <div className="absolute inset-x-2 top-0.5 h-[38%] rounded-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
                      <RefreshCw size={14} className="relative z-10" />
                      <span className="relative z-10">{t.nextTwin}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
