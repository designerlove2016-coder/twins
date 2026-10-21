import React, { useState, useRef } from 'react';
import { MatchProfile, Language } from '../../types';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { formatCity } from '../../utils/localization';
import { Bookmark } from 'lucide-react';

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

  const animationDelay = `${(index * 0.6) % 3}s`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((clientY - centerY) / centerY) * -12;
    const rotateY = ((clientX - centerX) / centerX) * 12;

    const shineX = (clientX / rect.width) * 100;
    const shineY = (clientY / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, shineX, shineY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, shineX: 50, shineY: 50, isHovered: false });
  };

  return (
    <div
      className={`relative perspective-card group select-none py-2 shrink-0 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Living Bottom Floor Shadow */}
      <div
        className="absolute inset-x-3 -bottom-1 h-4 rounded-full bg-black/25 dark:bg-black/50 blur-lg pointer-events-none transition-all duration-300 animate-floor-shadow"
        style={{ animationDelay }}
      />

      {/* 3D Tactile Organic Levitation Match Card */}
      <div
        ref={cardRef}
        style={{
          transform: tilt.isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px) scale3d(1.04, 1.04, 1.04)`
            : undefined,
          animationDelay,
          transition: tilt.isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="
          relative preserve-3d
          min-w-[155px] sm:min-w-[165px]
          p-4 rounded-3xl
          bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#F2EFE8]
          dark:from-[#1E2721] dark:via-[#18211B] dark:to-[#131915]
          border border-white/90 dark:border-white/10
          shadow-[0_6px_0_0_#D5CEBE,0_12px_20px_-2px_rgba(32,41,35,0.12)]
          dark:shadow-[0_6px_0_0_#0D130F,0_12px_20px_-2px_rgba(0,0,0,0.5)]
          flex flex-col items-center text-center
          cursor-pointer
          animate-float-slow
          active:translate-y-1
          overflow-hidden
        "
      >
        {/* Specular glossy top sheen */}
        <div className="absolute inset-x-2 top-1 h-[42%] rounded-2xl bg-gradient-to-b from-white/85 via-white/20 to-transparent dark:from-white/15 dark:via-transparent pointer-events-none z-10" />

        {/* Dynamic Light Reflection tracking cursor */}
        {tilt.isHovered && (
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 255, 255, 0.5) 0%, transparent 60%)`,
            }}
          />
        )}

        {/* Quick Bookmark Button in Card Corner */}
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(match.id);
            }}
            className={`
              absolute top-2.5 right-2.5 z-30 w-7 h-7 rounded-full flex items-center justify-center
              transition-all duration-150 active:scale-90
              ${
                isSaved
                  ? 'bg-[#FFF9E6] dark:bg-[#2F2612] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
                  : 'bg-white/80 dark:bg-black/30 text-slate-400 hover:text-[#0B5D3B] border border-slate-200/50 dark:border-white/10'
              }
            `}
            title={isSaved ? 'Bookmarked' : 'Bookmark profile'}
            aria-label={isSaved ? 'Bookmarked' : 'Bookmark profile'}
          >
            <Bookmark size={13} className={isSaved ? 'fill-[#D4AF37]' : ''} />
          </button>
        )}

        {/* Avatar with subtle 3D lift */}
        <div className="relative z-10 my-1 transition-transform duration-300 group-hover:scale-110">
          <AvatarRenderer avatar={match.avatar} size={58} direction="center" />
        </div>

        {/* Username */}
        <h4 className="relative z-10 mt-2 text-xs font-bold text-[#202923] dark:text-white truncate max-w-[125px]">
          @{match.username}
        </h4>

        {/* City label with clean localization */}
        <span className="relative z-10 text-[10px] text-[#778078] dark:text-slate-400 mt-0.5">
          {formatCity(match.city, language)}
        </span>

        {/* Tactile 3D Pill Badge: [95% Twin / 95% تطابق] */}
        <div className="relative z-10 mt-2.5 px-3 py-1 rounded-full bg-gradient-to-b from-[#DDF3E7] via-[#D5F0E1] to-[#C2E7D1] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/60 text-[#0B5D3B] dark:text-[#DDF3E7] text-[11px] font-extrabold font-mono tabular-nums border border-white/60 dark:border-[#0B5D3B]/40 shadow-[0_3px_0_0_#9DCDB6,0_6px_10px_rgba(11,93,59,0.15)] dark:shadow-[0_3px_0_0_#062A1B]">
          {match.similarityScore}% {language === 'ar' ? 'تطابق' : 'Twin'}
        </div>
      </div>
    </div>
  );
};
