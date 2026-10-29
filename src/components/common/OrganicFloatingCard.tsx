import React, { useRef, useEffect } from 'react';

export interface OrganicFloatingCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  enableParallax?: boolean;
  enableFloatLevitation?: boolean;
  floatDelay?: boolean;
  glowColor?: string;
  shadowClassName?: string;
  enablePulseGlow?: boolean;
}

export const OrganicFloatingCard: React.FC<OrganicFloatingCardProps> = ({
  children,
  className = '',
  onClick,
  enableParallax = true,
  enableFloatLevitation = true,
  floatDelay = false,
  glowColor = 'rgba(11, 93, 59, 0.15)',
  shadowClassName = '',
  enablePulseGlow = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableParallax || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((clientY - centerY) / centerY) * -7;
    const rotateY = ((clientX - centerX) / centerX) * 7;

    const shineX = (clientX / rect.width) * 100;
    const shineY = (clientY / rect.height) * 100;

    // Direct DOM manipulation avoids React state re-rendering and click cancellation!
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale3d(1.01, 1.01, 1.01)`;
    if (shineRef.current) {
      shineRef.current.style.opacity = '1';
      shineRef.current.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`;
    }
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.08s ease-out';
    }
    if (shineRef.current) {
      shineRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)';
    }
    if (shineRef.current) {
      shineRef.current.style.opacity = '0';
    }
  };

  const floatClass = enableFloatLevitation
    ? floatDelay
      ? 'animate-float-delayed'
      : 'animate-float-slow'
    : '';

  return (
    <div
      className="relative group py-2"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Subtle Luxury Pulsing Glow Aura */}
      {enablePulseGlow && (
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-[#0B5D3B]/20 via-[#D4AF37]/20 to-[#10B981]/25 dark:from-[#10B981]/30 dark:via-[#D4AF37]/25 dark:to-[#0B5D3B]/30 blur-md pointer-events-none animate-aura-breath z-0"
        />
      )}

      {/* Living Bottom Floor Shadow */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-4 -bottom-1 h-5 rounded-full pointer-events-none transition-all duration-300 animate-floor-shadow bg-[#202923]/25 dark:bg-black/50 ${shadowClassName}`}
      />

      {/* Main 3D Card Tile */}
      <div
        ref={cardRef}
        className={`
          relative
          rounded-3xl
          bg-white dark:bg-[#18221C]
          border border-slate-200/80 dark:border-slate-800
          shadow-lg shadow-black/5 dark:shadow-black/30
          overflow-hidden
          ${enablePulseGlow ? 'animate-pulse-glow' : ''}
          ${floatClass}
          ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
          ${className}
        `}
      >
        {/* Specular sheen header */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 via-white/10 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none z-10"
        />

        {/* Dynamic Light Reflection tracking cursor */}
        <div
          ref={shineRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-10 opacity-0 transition-opacity duration-150"
        />

        {/* Ambient Corner Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none z-0"
          style={{ background: glowColor }}
        />

        {/* Card Content: relative z-20 & pointer-events-auto guarantees instant, uninterrupted button clicks */}
        <div className="relative z-20 pointer-events-auto select-auto">{children}</div>
      </div>
    </div>
  );
};
