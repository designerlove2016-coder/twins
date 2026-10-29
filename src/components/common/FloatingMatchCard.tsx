import React, { useState, useRef } from 'react';
import { MatchProfile, Language } from '../../types';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { formatCity } from '../../utils/localization';
import { Bookmark, Zap, Sparkles, MapPin } from 'lucide-react';

interface FloatingMatchCardProps {
  match: MatchProfile;
  language: Language;
  index?: number;
  onClick?: () => void;
  className?: string;
  isSaved?: boolean;
  onToggleSave?: (matchId: string) => void;
}

export const FloatingMatchCard: React.FC<FloatingMatchCardProps> = ({
  match,
  language,
  index = 0,
  onClick,
  className = '',
  isSaved = false,
  onToggleSave,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shineX: 50, shineY: 50, isHovered: false });

  const animationDelay = `${(index * 0.5) % 2.5}s`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((clientY - centerY) / centerY) * -10;
    const rotateY = ((clientX - centerX) / centerX) * 10;

    const shineX = (clientX / rect.width) * 100;
    const shineY = (clientY / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, shineX, shineY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, shineX: 50, shineY: 50, isHovered: false });
  };

  // Clean username to display in the reference format @username@
  const cleanUsername = match.username.replace(/^@+|@+$/g, '');

  // Extract cutout or sticker URL
  const stickerImg =
    match.avatar?.cutoutUrl ||
    match.avatar?.stickerUrl ||
    (match.gender === 'female'
      ? '/assets/aistudio/character_standing_maya.png'
      : '/assets/aistudio/faisal_sticker.png');

  return (
    <div
      className={`relative perspective-card group select-none py-2 shrink-0 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Subtle Luxury Pulsing Glow Aura */}
      <div
        aria-hidden="true"
        className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-[#0B5D3B]/15 via-[#D4AF37]/10 to-[#10B981]/20 dark:from-[#10B981]/20 dark:via-[#D4AF37]/15 dark:to-[#0B5D3B]/20 blur-md pointer-events-none animate-aura-breath z-0"
        style={{ animationDelay }}
      />

      {/* Living Bottom Floor Shadow */}
      <div
        className="absolute inset-x-4 -bottom-1 h-4 rounded-full bg-black/20 dark:bg-black/50 blur-lg pointer-events-none transition-all duration-300 animate-floor-shadow"
        style={{ animationDelay }}
      />

      {/* 3D Tactile Organic Match Card matching reference design */}
      <div
        ref={cardRef}
        style={{
          transform: tilt.isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px) scale3d(1.03, 1.03, 1.03)`
            : undefined,
          animationDelay,
          transition: tilt.isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="
          relative preserve-3d
          w-[205px] min-w-[205px] sm:w-[215px] sm:min-w-[215px]
          p-4 sm:p-5 rounded-[30px]
          bg-[#FAFAF7] dark:bg-[#151D18]
          border border-[#ECE7DE] dark:border-white/10
          shadow-[0_12px_28px_-6px_rgba(11,93,59,0.08),0_4px_12px_-2px_rgba(0,0,0,0.04)]
          dark:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.6)]
          flex flex-col items-center text-center
          cursor-pointer
          animate-float-slow
          active:translate-y-1
          overflow-hidden
        "
      >
        {/* Specular glossy top sheen */}
        <div className="absolute inset-x-3 top-1 h-[35%] rounded-3xl bg-gradient-to-b from-white/90 via-white/20 to-transparent dark:from-white/10 dark:via-transparent pointer-events-none z-10" />

        {/* Dynamic Light Reflection tracking cursor */}
        {tilt.isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Top Control Bar: Circular Bookmark Button (Left) + Compatibility Pill (Right) */}
        <div className="relative z-30 w-full flex items-center justify-between mb-2">
          {/* Circular Gold Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(match.id);
            }}
            className={`
              w-9 h-9 rounded-full flex items-center justify-center
              transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer
              ${
                isSaved
                  ? 'bg-[#FBF3DC] dark:bg-[#342A16] text-[#D4AF37] border border-[#E9D9A5] shadow-xs'
                  : 'bg-[#FCF8EE] dark:bg-[#252016] text-[#D4AF37] hover:bg-[#FBF3DC] border border-[#ECDFA8] dark:border-[#52441D] shadow-xs'
              }
            `}
            title={isSaved ? 'تم الحفظ' : 'حفظ الملف'}
            aria-label={isSaved ? 'Saved bookmark' : 'Save bookmark'}
          >
            <Bookmark size={15} className={isSaved ? 'fill-[#D4AF37]' : 'fill-[#D4AF37]/90'} />
          </button>

          {/* Mint Capsule Pill with Similarity Score and Lightning Zap */}
          <div className="px-3 py-1 rounded-full bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 text-[#0B5D3B] dark:text-[#A7F3D0] text-xs font-black flex items-center gap-1 border border-[#BCE8D1]/80 shadow-xs tabular-nums">
            <span>{match.similarityScore}%</span>
            <Zap size={12} className="fill-[#0B5D3B] dark:fill-[#A7F3D0] text-[#0B5D3B] dark:text-[#A7F3D0]" />
          </div>
        </div>

        {/* Large Half-Body Sticker Character with Online Status Dot */}
        <div className="relative z-10 w-full h-[145px] sm:h-[155px] flex items-center justify-center my-1 transition-transform duration-300 group-hover:scale-105">
          {stickerImg ? (
            <img
              src={stickerImg}
              alt={match.username}
              className="h-[135px] sm:h-[145px] w-auto max-w-[170px] object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.06)] pointer-events-none select-none"
              loading="lazy"
            />
          ) : (
            <AvatarRenderer avatar={match.avatar} size={110} direction="center" />
          )}

          {/* Active Emerald Online Dot on bottom-right of sticker */}
          <div
            className="absolute bottom-1 right-5 sm:right-6 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white dark:border-[#151D18] shadow-xs"
            title="متصل الآن"
          />
        </div>

        {/* Username centered (@username@) */}
        <h4 className="relative z-10 mt-2 text-base font-black text-[#1A251E] dark:text-white tracking-tight truncate max-w-[185px]">
          @{cleanUsername}@
        </h4>

        {/* Location with Pin Icon (e.g. الرياض 📍) */}
        <div className="relative z-10 flex items-center justify-center gap-1 text-xs font-semibold text-[#6C7A70] dark:text-slate-400 mt-0.5">
          <span>{formatCity(match.city, language)}</span>
          <MapPin size={12} className="text-[#88988D] dark:text-slate-400 shrink-0" />
        </div>

        {/* Tactile Capsule Button: اهتمامات متطابقة ✨ */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="
            relative z-10 mt-3.5 w-full py-2.5 px-3 rounded-full
            bg-[#E8F7EE] hover:bg-[#D5EFE0] dark:bg-[#0B5D3B]/25 dark:hover:bg-[#0B5D3B]/40
            text-[#0B5D3B] dark:text-[#A7F3D0] text-xs font-black
            border border-[#A7E2C3]/70 dark:border-[#0B5D3B]/40
            shadow-xs flex items-center justify-center gap-1.5
            transition-all duration-150 active:scale-95 cursor-pointer
          "
        >
          <span>{language === 'ar' ? 'اهتمامات متطابقة' : 'Matching Interests'}</span>
          <Sparkles size={13} className="text-[#0B5D3B] dark:text-[#A7F3D0] shrink-0" />
        </button>
      </div>
    </div>
  );
};
