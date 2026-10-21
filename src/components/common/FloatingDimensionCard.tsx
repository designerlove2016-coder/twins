import React, { useState, useRef } from 'react';
import { RealisticIcon } from './RealisticIcon';

interface FloatingDimensionCardProps {
  iconKey: string;
  label?: string;
  index?: number;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FloatingDimensionCard: React.FC<FloatingDimensionCardProps> = ({
  iconKey,
  label,
  index = 0,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });

  // Staggered organic floating delay
  const animationDelay = `${(index * 0.45) % 2.5}s`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: (y / (rect.height / 2)) * -12,
      y: (x / (rect.width / 2)) * 12,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, isHovered: false });
  };

  return (
    <div
      className={`relative perspective-card group select-none py-1.5 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* 
        Living Bottom Floor Shadow
        Expands & contracts in sync with organic elevation
      */}
      <div
        className="absolute inset-x-2 bottom-0 h-3 rounded-full bg-black/25 dark:bg-black/45 blur-md pointer-events-none transition-all duration-300 animate-floor-shadow"
        style={{ animationDelay }}
      />

      {/* 
        3D Tactile Organic Card Tile
      */}
      <div
        ref={cardRef}
        style={{
          transform: tilt.isHovered
            ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale3d(1.05, 1.05, 1.05)`
            : undefined,
          animationDelay,
          transition: tilt.isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`
          relative preserve-3d
          w-full rounded-2xl p-2.5 sm:p-3
          flex flex-col items-center justify-center
          cursor-pointer
          border transition-all duration-200
          animate-float-slow
          active:translate-y-1
          ${
            isSelected
              ? 'bg-gradient-to-b from-[#DDF3E7] to-[#C7EBD7] dark:from-[#0B5D3B]/40 dark:to-[#08422A]/60 border-[#0B5D3B] ring-2 ring-[#0B5D3B]/30 shadow-[0_5px_0_0_#0B5D3B,0_10px_16px_rgba(11,93,59,0.3)]'
              : 'bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#EFECE4] dark:from-[#202923] dark:via-[#19211B] dark:to-[#131915] border-white/80 dark:border-white/10 shadow-[0_5px_0_0_#D3CBB9,0_10px_16px_rgba(32,41,35,0.1)] dark:shadow-[0_5px_0_0_#0F1511,0_10px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_7px_0_0_#D3CBB9,0_14px_20px_rgba(32,41,35,0.15)]'
          }
        `}
      >
        {/* Specular top glass bubble highlight */}
        <div className="absolute inset-x-1.5 top-1 h-[40%] rounded-xl bg-gradient-to-b from-white/80 via-white/20 to-transparent dark:from-white/15 dark:via-transparent pointer-events-none" />

        {/* 3D Realistic Icon */}
        <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
          <RealisticIcon name={iconKey} size={36} />
        </div>

        {label && (
          <span className={`relative z-10 mt-1.5 text-[10px] truncate max-w-[80px] ${
            isSelected
              ? 'text-[#0B5D3B] dark:text-[#34D399] font-black'
              : 'text-[#202923] dark:text-slate-100 font-extrabold'
          }`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
