import React, { useState } from 'react';

export interface TactilePillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  children: React.ReactNode;
  rightBadge?: React.ReactNode;
  leftIcon?: React.ReactNode;
  variant?: 'red' | 'emerald' | 'gold';
  className?: string;
}

export const TactilePillButton: React.FC<TactilePillButtonProps> = ({
  isActive = false,
  children,
  rightBadge,
  leftIcon,
  variant = 'red',
  className = '',
  onClick,
  disabled,
  ...rest
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Gentle haptic feedback if supported
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch {
      // Ignore vibration error
    }
    if (onClick) onClick(e);
  };

  // Base 3D extrusion color and shadows based on state
  const isRed = variant === 'red';

  // Base styles:
  // Inactive: Smooth warm cream/white ceramic fill with multi-layered 3D beveled shadow and specular top sheen
  // Active: Bold brand red (#E73A2A) with glow ring and multi-layered 3D beveled shadow
  const activeStyles = `
    bg-gradient-to-b from-[#FF5E50] via-[#E73A2A] to-[#CE2B1D]
    text-white font-bold
    border border-[#FF796C]/60
    ring-4 ring-[#E73A2A]/25
    shadow-[0_6px_0_0_#9E1A0F,0_14px_22px_-2px_rgba(231,58,42,0.45)]
    active:shadow-[0_2px_0_0_#9E1A0F,0_6px_10px_0_rgba(231,58,42,0.35)]
  `;

  const inactiveStyles = `
    bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#EFECE4]
    dark:from-[#243028] dark:via-[#1D2620] dark:to-[#171E19]
    text-[#202923] dark:text-[#F8F7F2] font-semibold
    border border-white/80 dark:border-white/10
    shadow-[0_6px_0_0_#D3CBB9,0_12px_18px_-2px_rgba(32,41,35,0.12)]
    dark:shadow-[0_6px_0_0_#0F1511,0_12px_18px_-2px_rgba(0,0,0,0.5)]
    active:shadow-[0_2px_0_0_#D3CBB9,0_4px_8px_0_rgba(32,41,35,0.15)]
    dark:active:shadow-[0_2px_0_0_#0F1511,0_4px_8px_0_rgba(0,0,0,0.4)]
  `;

  return (
    <div className="relative group w-full select-none py-1">
      {/* Ambient Decoupled Blurred Drop Shadow underneath with breathing float */}
      <div
        className={`absolute inset-x-3 bottom-0 h-4 rounded-full blur-md transition-all duration-300 pointer-events-none ${
          isActive
            ? 'bg-[#E73A2A]/35 scale-95 opacity-90'
            : 'bg-[#778078]/15 dark:bg-black/35 scale-90 opacity-60 group-hover:scale-100 group-hover:opacity-80'
        } ${isPressed ? 'scale-75 opacity-30 translate-y-0.5' : ''}`}
      />

      {/* Main 3D Capsule Pill Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`
          relative w-full rounded-full min-h-[50px] px-5 py-3
          flex items-center justify-between gap-3 text-start
          transition-all duration-150 ease-out cursor-pointer
          transform-gpu active:translate-y-1
          ${isPressed ? 'translate-y-1' : 'translate-y-0'}
          ${isActive ? activeStyles : inactiveStyles}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...rest}
      >
        {/* Specular Highlight: Top inner glossy highlight sheen giving ceramic / glass bubble feel */}
        <div
          className={`absolute inset-x-3 top-1 h-[45%] rounded-full pointer-events-none transition-opacity ${
            isActive
              ? 'bg-gradient-to-b from-white/45 via-white/15 to-transparent'
              : 'bg-gradient-to-b from-white/90 via-white/40 to-transparent dark:from-white/20 dark:via-white/5 dark:to-transparent'
          }`}
        />

        {/* Content wrapper */}
        <div className="relative z-10 flex items-center gap-2.5 min-w-0">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span className="text-xs sm:text-sm tracking-tight truncate leading-tight">
            {children}
          </span>
        </div>

        {/* Right Badge / percentage */}
        {rightBadge && (
          <div className="relative z-10 shrink-0 font-mono text-xs font-bold tabular-nums">
            {rightBadge}
          </div>
        )}
      </button>
    </div>
  );
};
