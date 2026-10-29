import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { formatCity } from '../../utils/localization';
import {
  X,
  Layers,
  MapPin,
  Bookmark,
  Share2,
  HandMetal,
  Heart,
  Sparkles,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface MatchDetailModalProps {
  match: MatchProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onCompare: (match: MatchProfile) => void;
  language: Language;
  isSaved?: boolean;
  onToggleSave?: (matchId: string) => void;
  onSendWave?: (match: MatchProfile) => void;
  onShareProfile?: (match: MatchProfile) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  isOpen,
  onClose,
  onCompare,
  language,
  isSaved = false,
  onToggleSave,
  onSendWave,
  onShareProfile,
}) => {
  const t = TRANSLATIONS[language];
  const [isLiked, setIsLiked] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(28);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Multi-Touch & Gesture States
  const [touchScale, setTouchScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  const initialPinchDistRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    setIsLiked(isSaved);
  }, [isSaved]);

  if (!isOpen || !match) return null;

  // Subtle rhythmic haptic vibration when liking a profile (اهتزاز خفيف تفاعلي)
  const triggerLikeHaptic = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        // Subtle rhythmic heartbeat pulse: 35ms pulse, 40ms pause, 50ms surge
        navigator.vibrate([35, 40, 50]);
      }
    } catch {
      // ignore
    }
  };

  // Physical dismissal haptic vibration
  const triggerDismissHaptic = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([20, 30]);
      }
    } catch {
      // ignore
    }
  };

  const handleLikeAction = () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    if (nextLiked) {
      triggerLikeHaptic();
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 950);
    }
    onToggleSave?.(match.id);
  };

  // ==============================================================
  // MULTI-TOUCH GESTURE HANDLERS (دعم خاصية اللمس المتعدد)
  // Pinch-to-zoom with 2 fingers, 2-finger tap to like, double-tap to like
  // ==============================================================
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // 1. Two-finger multi-touch detection (Pinch or 2-finger tap)
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      setIsPinching(true);

      // Two-finger tap trigger for instant like & haptic!
      if (!isLiked) {
        handleLikeAction();
      }
      return;
    }

    // 2. Single-finger double-tap detection
    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        handleLikeAction();
      }
      lastTapRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // Multi-touch 2-finger pinch scaling
    if (e.touches.length === 2 && initialPinchDistRef.current) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / initialPinchDistRef.current;
      const clampedScale = Math.min(Math.max(ratio, 0.88), 1.25);
      setTouchScale(clampedScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      initialPinchDistRef.current = null;
      setIsPinching(false);
      // Smoothly spring scale back to 1.0
      setTouchScale(1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md select-none"
      >
        {/* 
          3D Tactile Skeuomorphic Modal Card with Framer Motion Swipe-to-Dismiss & Physical Spring Bounce
        */}
        <motion.div
          drag="y"
          dragDirectionLock
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.04, bottom: 0.85 }}
          dragSnapToOrigin={true}
          onDragEnd={(_e, info: PanInfo) => {
            // Dismiss if pulled down past 105px or flicked down with velocity > 420px/s
            if (info.offset.y > 105 || info.velocity.y > 420) {
              triggerDismissHaptic();
              onClose();
            }
          }}
          transition={{
            type: 'spring',
            damping: 18,
            stiffness: 260,
            mass: 0.85,
            bounce: 0.45,
          }}
          initial={{ y: 55, opacity: 0, scale: 0.94 }}
          animate={{ y: 0, opacity: 1, scale: touchScale }}
          exit={{ y: 450, opacity: 0, scale: 0.9, transition: { duration: 0.22 } }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="
            relative w-full max-w-sm
            bg-gradient-to-b from-[#F8F5EC] via-[#EFEAE0] to-[#E2DCCE]
            dark:from-[#151D17] dark:via-[#0F1712] dark:to-[#080E0B]
            rounded-3xl
            border-2 border-[#C5B8A1]/80 dark:border-[#10B981]/40
            shadow-[0_12px_32px_rgba(0,0,0,0.28),0_4px_16px_rgba(11,93,59,0.18)]
            dark:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.2)]
            p-5 overflow-hidden
          "
        >
          {/* Top specular glossy highlight sheen */}
          <div className="absolute inset-x-3 top-0.5 h-[36%] rounded-t-2xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none z-10" />

          {/* Framer Motion Pull-down gesture handle with physical prompt */}
          <div className="flex flex-col items-center justify-center mb-2 shrink-0 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-slate-300/90 dark:bg-slate-700/90 shadow-xs" />
            <span className="text-[8.5px] font-bold text-slate-500/80 dark:text-slate-400/80 mt-1 tracking-tight">
              {language === 'ar' ? 'اسحب للأسفل للإغلاق ⇣' : 'Swipe down to dismiss ⇣'}
            </span>
          </div>

        {/* Multi-Touch guidance pill */}
        <div className="flex items-center justify-center mb-2.5">
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#0B5D3B]/10 dark:bg-[#10B981]/15 text-[#0B5D3B] dark:text-[#10B981] border border-[#0B5D3B]/15 flex items-center gap-1">
            <Sparkles size={11} className="text-[#D4AF37]" />
            <span>
              {language === 'ar'
                ? 'يدعم اللمس المتعدد: كبّر بأصبعين أو انقر مرتين للإعجاب ❤️'
                : 'Multi-Touch: Pinch with 2 fingers or double-tap to like ❤️'}
            </span>
          </span>
        </div>

        {/* Top Controls Bar: Like Heart Button, Bookmark, Share & Close */}
        <div className="flex items-center justify-between pb-1.5 relative z-20">
          
          <div className="flex items-center gap-1.5">
            {/* Interactive Heart Like Button with count and haptics */}
            <button
              type="button"
              onClick={handleLikeAction}
              className={`
                min-h-[38px] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-black border transition-all cursor-pointer overflow-hidden
                bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                dark:from-[#243328] dark:to-[#121B15]
                border-white/95 dark:border-white/10
                shadow-[0_3px_0_0_#CFC6B4,0_6px_10px_rgba(0,0,0,0.06)]
                dark:shadow-[0_3px_0_0_#062316]
                active:translate-y-0.5
                ${isLiked ? 'text-red-500 dark:text-red-400' : 'text-[#778078] hover:text-red-500'}
              `}
              title={isLiked ? (language === 'ar' ? 'معجب' : 'Liked') : (language === 'ar' ? 'إعجاب' : 'Like')}
            >
              <Heart
                size={16}
                className={`transition-transform duration-200 ${
                  isLiked ? 'fill-red-500 text-red-500 scale-110' : ''
                }`}
              />
              <span className="text-[11px] font-mono tabular-nums">{likeCount}</span>
            </button>

            {/* Bookmark button */}
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(match.id)}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer
                  bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                  dark:from-[#243328] dark:to-[#121B15]
                  border-white/95 dark:border-white/10
                  shadow-[0_3px_0_0_#CFC6B4] dark:shadow-[0_3px_0_0_#062316]
                  active:translate-y-0.5
                  ${isSaved ? 'text-[#D4AF37]' : 'text-[#778078]'}
                `}
                title={isSaved ? t.unsaveProfile : t.saveProfile}
              >
                <Bookmark size={15} className={isSaved ? 'fill-[#D4AF37]' : ''} />
              </button>
            )}

            {/* Share profile button */}
            {onShareProfile && (
              <button
                type="button"
                onClick={() => onShareProfile(match)}
                className="
                  w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer
                  bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                  dark:from-[#243328] dark:to-[#121B15]
                  border-white/95 dark:border-white/10
                  shadow-[0_3px_0_0_#CFC6B4] dark:shadow-[0_3px_0_0_#062316]
                  active:translate-y-0.5 text-slate-500 hover:text-slate-800 dark:hover:text-white
                "
                title={t.shareProfile}
                aria-label={t.shareProfile}
              >
                <Share2 size={15} />
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="
              w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer
              bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
              dark:from-[#243328] dark:to-[#121B15]
              border-white/95 dark:border-white/10
              shadow-[0_3px_0_0_#CFC6B4] dark:shadow-[0_3px_0_0_#062316]
              active:translate-y-0.5 text-slate-500 hover:text-slate-800 dark:hover:text-white
            "
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* 
          Main Avatar Stage with Portrait Card (matching user Image 1 exactly)
        */}
        <div
          className="mx-auto w-full max-w-[210px] rounded-2xl bg-white dark:bg-[#1A261E] border-2 border-slate-200/90 dark:border-slate-700/80 shadow-[0_6px_16px_rgba(0,0,0,0.1)] overflow-hidden my-2 cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={handleLikeAction}
          title="Double-tap to like"
        >
          {/* Upper dark portrait photo */}
          <div className="relative w-full aspect-[4/4.4] bg-black flex items-center justify-center overflow-hidden">
            <img
              src={match.avatar.portraitUrl || match.avatar.stickerUrl || '/assets/aistudio/maya_portrait_card.jpg'}
              alt={match.username}
              className="w-full h-full object-cover object-center select-none pointer-events-none"
            />
            {/* Animated Heart Particle Burst on Like */}
            {showHeartBurst && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-heart-burst bg-black/40">
                <div className="w-16 h-16 rounded-full bg-red-500/30 backdrop-blur-xs flex items-center justify-center shadow-lg border-2 border-red-400">
                  <Heart size={38} className="fill-red-500 text-red-500 drop-shadow-md animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Lower info banner attached to photo card */}
          <div className="p-2.5 text-center bg-white dark:bg-[#162119]">
            <h3 className="text-base font-black text-[#1A251E] dark:text-white tracking-tight">
              @{match.username}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#0B5D3B] dark:text-[#34D399] font-bold mt-0.5">
              <MapPin size={12} className="text-[#0B5D3B] dark:text-[#10B981]" />
              <span>{formatCity(match.city, language)}</span>
              {match.ageRange && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="text-[#69726A] dark:text-slate-300 font-semibold">{match.ageRange}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3D Skeuomorphic Similarity Score Pill matching user Image 1: '85% نسبة التطابق ⚡' */}
        <div className="
          my-3 px-4 py-2.5 rounded-2xl
          bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
          dark:from-[#202D24] dark:to-[#131D16]
          border-2 border-[#0B5D3B]/30 dark:border-[#10B981]/40
          shadow-[0_3px_0_0_#CFC6B4,0_6px_12px_rgba(11,93,59,0.1)]
          dark:shadow-[0_3px_0_0_#062316]
          flex items-center justify-between
        ">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-[#0B5D3B] dark:text-[#10B981] font-mono tabular-nums">
              {match.similarityScore}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-[#0B5D3B] dark:text-[#DDF3E7] uppercase tracking-wide">
              {language === 'ar' ? 'نسبة التطابق' : 'Match Compatibility'}
            </span>
            <Zap size={15} className="text-[#D4AF37]" />
          </div>
        </div>

        {/* Personality Bio matching user Image 1 */}
        <div className="mb-3 px-1">
          <span className="text-[11px] font-black text-[#778078] dark:text-slate-300 uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'نبذة الشخصية' : 'Personality Bio'}
          </span>
          <p className="text-xs text-[#202923] dark:text-slate-200 leading-relaxed italic bg-white/80 dark:bg-black/30 p-3 rounded-xl border border-slate-200/80 dark:border-white/5 shadow-2xs">
            "{match.bio}"
          </p>
        </div>

        {/* Shared Passions / Common Ground matching user Image 1 */}
        <div className="mb-4 px-1">
          <span className="text-[11px] font-black text-[#778078] dark:text-slate-300 uppercase tracking-wider block mb-1.5">
            {language === 'ar' ? 'أقوى النقاط المشتركة' : 'Top Common Grounds'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {match.sharedInterests.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl bg-[#E8F7EE] dark:bg-[#122A1E] text-[#07472B] dark:text-[#34D399] text-xs font-black border border-[#0B5D3B]/25 dark:border-[#10B981]/40 shadow-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 3D Tactile Skeuomorphic Action Buttons matching user Image 1 */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onCompare(match);
            }}
            className="
              relative h-12 rounded-2xl
              bg-gradient-to-b from-[#189662] via-[#0B5D3B] to-[#073D26]
              dark:from-[#199863] dark:via-[#0E6D46] dark:to-[#073D26]
              text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2
              border-2 border-[#34D399]/70 dark:border-[#34D399]/60
              shadow-[0_4px_0_0_#062A1A,0_10px_18px_rgba(11,93,59,0.35)]
              dark:shadow-[0_4px_0_0_#03180F]
              active:translate-y-1 active:shadow-none
              hover:brightness-105 transition-all cursor-pointer overflow-hidden
            "
          >
            {/* Top specular glossy highlight sheen */}
            <div className="absolute inset-x-3 top-0.5 h-[42%] rounded-xl bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none" />
            <Layers size={16} className="relative z-10" />
            <span className="relative z-10 tracking-wide">{t.comparePersonalities}</span>
          </button>

          {onSendWave && (
            <button
              type="button"
              onClick={() => onSendWave(match)}
              className="
                relative h-12 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-black border transition-all cursor-pointer overflow-hidden
                bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC]
                dark:from-[#243328] dark:to-[#121B15]
                border-white/95 dark:border-[#10B981]/30
                shadow-[0_4px_0_0_#CFC6B4,0_6px_12px_rgba(0,0,0,0.06)]
                dark:shadow-[0_4px_0_0_#062316]
                active:translate-y-1 active:shadow-[0_1px_0_0_#CFC6B4]
                text-[#0B5D3B] dark:text-[#10B981]
              "
            >
              <div className="absolute inset-x-2 top-0.5 h-[38%] rounded-xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />
              <HandMetal size={15} className="text-[#D4AF37] relative z-10" />
              <span className="relative z-10">{t.sayHi}</span>
            </button>
          )}
        </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
