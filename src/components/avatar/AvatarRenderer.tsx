import React, { useState } from 'react';
import { AvatarConfig } from '../../types';

interface AvatarRendererProps {
  avatar: AvatarConfig;
  size?: number;
  direction?: 'left' | 'right' | 'center';
  highFivePose?: boolean;
  className?: string;
  showBackdrop?: boolean;
  animate?: boolean;
  interactive?: boolean;
  forceMotion?: AvatarConfig['motionStyle'];
  onClick?: (e: React.MouseEvent) => void;
}

export const AvatarRenderer: React.FC<AvatarRendererProps> = ({
  avatar,
  size = 96,
  direction,
  highFivePose = false,
  className = '',
  showBackdrop = true,
  animate = true,
  interactive = true,
  forceMotion,
  onClick,
}) => {
  const [isTapped, setIsTapped] = useState(false);
  const dir = direction || avatar.direction || 'center';
  const s = size;

  const motion = forceMotion || avatar.motionStyle || 'waving';

  // Face shift based on direction
  const faceShiftX = dir === 'right' ? 4 : dir === 'left' ? -4 : 0;
  const isFacingRight = dir === 'right';
  const isFacingLeft = dir === 'left';

  // Determine motion class
  let motionClass = '';
  if (animate) {
    if (motion === 'bouncing') {
      motionClass = 'animate-avatar-bounce';
    } else if (motion === 'cool-sway') {
      motionClass = 'animate-avatar-sway';
    } else if (motion === 'smiling') {
      motionClass = 'animate-avatar-smile';
    }
  }

  const handleInteraction = (e: React.MouseEvent) => {
    if (!interactive) return;
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(20);
      }
    } catch {
      // ignore
    }
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 900);
    onClick?.(e);
  };

  return (
    <div
      style={{ width: s, height: s }}
      onClick={interactive ? handleInteraction : onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        interactive ? 'cursor-pointer active:scale-95 transition-transform' : ''
      } ${className}`}
      aria-label={`Avatar for ${avatar.id}`}
    >
      {/* Interactive celebratory tap reaction sparkle */}
      {isTapped && (
        <div className="absolute -top-3 inset-x-0 flex justify-center pointer-events-none z-30 animate-avatar-pop">
          <span className="text-sm">✨</span>
        </div>
      )}

      <svg
        width={s}
        height={s}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible ${motionClass}`}
      >
        <defs>
          <filter id={`shadow_${avatar.id}`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="#000" floodOpacity="0.14" />
          </filter>
          <linearGradient id={`bg_${avatar.id}`} x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5F9F6" />
            <stop offset="1" stopColor="#E2EFE7" />
          </linearGradient>
          <radialGradient id={`glow_${avatar.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Circular soft backdrop with emerald border */}
        {showBackdrop && (
          <circle
            cx="60"
            cy="60"
            r="56"
            fill={`url(#bg_${avatar.id})`}
            stroke="#0B5D3B"
            strokeWidth="2.5"
            strokeOpacity="0.3"
            className="dark:fill-[#15221B] dark:stroke-[#10B981]/50"
          />
        )}

        {/* Subtle motion aura for smiling or joyful motion */}
        {animate && (motion === 'smiling' || motion === 'wink' || isTapped) && (
          <circle cx="60" cy="56" r="46" fill={`url(#glow_${avatar.id})`} className="animate-pulse" />
        )}

        <g filter={`url(#shadow_${avatar.id})`}>
          {/* SHOULDERS & CLOTHING */}
          {/* Base Torso */}
          <path
            d="M24 116C24 94 38 82 60 82C82 82 96 94 96 116H24Z"
            fill={avatar.clothingColor || '#0B5D3B'}
          />

          {/* Clothing Collar & Style details */}
          {avatar.clothingStyle === 'thobe' && (
            <>
              {/* Thobe collar (Saudi Gellaba / Qamis) */}
              <path d="M52 82V96H68V82" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              <line x1="60" y1="96" x2="60" y2="116" stroke="#CBD5E0" strokeWidth="1.5" />
              <circle cx="60" cy="88" r="1.5" fill="#D4AF37" />
              <circle cx="60" cy="104" r="1.5" fill="#D4AF37" />
            </>
          )}

          {avatar.clothingStyle === 'blazer' && (
            <>
              {/* Inner shirt */}
              <polygon points="52,82 68,82 60,98" fill="#FFFFFF" />
              {/* Lapels */}
              <polygon points="46,82 56,104 38,116" fill="#18221C" fillOpacity="0.3" />
              <polygon points="74,82 64,104 82,116" fill="#18221C" fillOpacity="0.3" />
            </>
          )}

          {avatar.clothingStyle === 'hoodie' && (
            <>
              {/* Hoodie strings */}
              <path d="M50 86C50 94 48 98 48 102" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              <path d="M70 86C70 94 72 98 72 102" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {/* NECK */}
          <rect x="52" y="70" width="16" height="18" rx="4" fill={avatar.skinTone} />

          {/* HEAD & JAW (Wrapped in motion group for nodding) */}
          <g className={animate && motion === 'nodding' ? 'animate-avatar-nod' : ''}>
            <ellipse
              cx={60 + faceShiftX}
              cy="54"
              rx="24"
              ry="27"
              fill={avatar.skinTone}
            />

            {/* EARS */}
            <ellipse cx={36 + faceShiftX * 0.5} cy="56" rx="4.5" ry="7" fill={avatar.skinTone} />
            <ellipse cx={84 + faceShiftX * 0.5} cy="56" rx="4.5" ry="7" fill={avatar.skinTone} />

            {/* HAIR / HEADWEAR */}
            {avatar.hairStyle === 'traditional' && (
              <>
                {/* Shemagh / Ghutra white & red patterned drape */}
                <path
                  d="M32 54C32 26 88 26 88 54C88 68 84 84 94 98L82 100C78 84 74 68 74 54H46C46 68 42 84 38 100L26 98C36 84 32 68 32 54Z"
                  fill="#FAF9F6"
                  stroke="#C53030"
                  strokeWidth="1.5"
                  strokeDasharray="2,3"
                />
                {/* Egal black double ring */}
                <ellipse cx={60 + faceShiftX} cy="36" rx="26" ry="6" stroke="#1A202C" strokeWidth="4.5" fill="none" />
                <ellipse cx={60 + faceShiftX} cy="32" rx="24" ry="5.5" stroke="#2D3748" strokeWidth="4" fill="none" />
              </>
            )}

            {avatar.hairStyle === 'hijab' && (
              <>
                {/* Hijab drapery */}
                <path
                  d="M34 52C34 26 86 26 86 52C86 78 82 92 88 102H32C38 92 34 78 34 52Z"
                  fill="#202923"
                />
                <ellipse cx={60 + faceShiftX} cy="54" rx="20" ry="23" fill={avatar.skinTone} />
              </>
            )}

            {avatar.hairStyle === 'short-fade' && (
              <path
                d={`M${36 + faceShiftX} 50C${36 + faceShiftX} 28 ${84 + faceShiftX} 28 ${84 + faceShiftX} 50C84 42 78 32 60 32C42 32 36 42 ${36 + faceShiftX} 50Z`}
                fill={avatar.hairColor || '#1A202C'}
              />
            )}

            {avatar.hairStyle === 'curly' && (
              <g fill={avatar.hairColor || '#2D3748'}>
                <circle cx={42 + faceShiftX} cy="36" r="9" />
                <circle cx={54 + faceShiftX} cy="30" r="10" />
                <circle cx={66 + faceShiftX} cy="30" r="10" />
                <circle cx={78 + faceShiftX} cy="36" r="9" />
                <circle cx={36 + faceShiftX} cy="46" r="7" />
                <circle cx={84 + faceShiftX} cy="46" r="7" />
              </g>
            )}

            {avatar.hairStyle === 'wavy' && (
              <path
                d={`M${34 + faceShiftX} 52C${34 + faceShiftX} 24 ${86 + faceShiftX} 24 ${86 + faceShiftX} 52C88 64 92 78 94 92C90 90 86 76 84 66C82 46 80 36 60 36C40 36 38 46 36 66C34 76 30 90 26 92C28 78 32 64 ${34 + faceShiftX} 52Z`}
                fill={avatar.hairColor || '#4A3728'}
              />
            )}

            {avatar.hairStyle === 'cap' && (
              <>
                {/* Baseball cap */}
                <path d={`M${34 + faceShiftX} 44C${34 + faceShiftX} 28 ${86 + faceShiftX} 28 ${86 + faceShiftX} 44H${34 + faceShiftX}Z`} fill="#0B5D3B" />
                <ellipse cx={60 + (isFacingRight ? 18 : isFacingLeft ? -18 : 0)} cy="44" rx="26" ry="6" fill="#08422A" />
              </>
            )}

            {/* FACIAL FEATURES */}
            {/* Eyebrows */}
            <path
              d={isFacingRight ? "M48 45C52 43 56 43 59 45" : isFacingLeft ? "M45 45C48 43 52 43 56 45" : "M47 45C51 43 55 43 57 45"}
              stroke="#2D3748"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d={isFacingRight ? "M65 45C68 43 72 43 76 45" : isFacingLeft ? "M63 45C66 43 70 43 74 45" : "M63 45C65 43 69 43 73 45"}
              stroke="#2D3748"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Eyes */}
            {avatar.expression === 'wink' || motion === 'wink' ? (
              <>
                <circle cx={52 + faceShiftX} cy="51" r="3.2" fill="#1A202C" />
                <circle cx={53 + faceShiftX} cy="50" r="1.2" fill="#FFFFFF" />
                {/* Winking right eye */}
                <path
                  d={`M${65 + faceShiftX} 52C${68 + faceShiftX} 50 ${72 + faceShiftX} 50 ${75 + faceShiftX} 52`}
                  stroke="#1A202C"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  className={animate ? 'animate-avatar-wink' : ''}
                />
                {/* Golden sparkle star near wink */}
                <path
                  d={`M${78 + faceShiftX} 48L${80 + faceShiftX} 44L${82 + faceShiftX} 48L${86 + faceShiftX} 50L${82 + faceShiftX} 52L${80 + faceShiftX} 56L${78 + faceShiftX} 52L${74 + faceShiftX} 50Z`}
                  fill="#D4AF37"
                  className="animate-sparkle-glow"
                />
              </>
            ) : (
              <>
                <circle cx={52 + faceShiftX} cy="51" r="3.2" fill="#1A202C" />
                <circle cx={53 + faceShiftX} cy="50" r="1.2" fill="#FFFFFF" />
                <circle cx={69 + faceShiftX} cy="51" r="3.2" fill="#1A202C" />
                <circle cx={70 + faceShiftX} cy="50" r="1.2" fill="#FFFFFF" />
              </>
            )}

            {/* Rosy Cheek Blush when smiling or cheerful */}
            {(avatar.expression === 'smile' || avatar.expression === 'cheerful' || motion === 'smiling' || isTapped) && (
              <>
                <ellipse cx={45 + faceShiftX} cy="59" rx="4.5" ry="2.6" fill="#FF8A8A" fillOpacity="0.45" />
                <ellipse cx={75 + faceShiftX} cy="59" rx="4.5" ry="2.6" fill="#FF8A8A" fillOpacity="0.45" />
              </>
            )}

            {/* Nose */}
            <path
              d={`M${60 + faceShiftX} 52V58C${60 + faceShiftX} 59.5 ${62 + faceShiftX} 60.5 ${63 + faceShiftX} 60.5`}
              stroke="#B7791F"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mouth */}
            {avatar.expression === 'smile' || avatar.expression === 'cheerful' || motion === 'smiling' ? (
              <path
                d={`M${53 + faceShiftX} 65C${56 + faceShiftX} 71 ${64 + faceShiftX} 71 ${67 + faceShiftX} 65`}
                stroke="#822727"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill={avatar.expression === 'cheerful' ? '#E53E3E' : 'none'}
              />
            ) : (
              <path
                d={`M${55 + faceShiftX} 67C${58 + faceShiftX} 68.5 ${63 + faceShiftX} 68.5 ${66 + faceShiftX} 67`}
                stroke="#822727"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {/* ACCESSORIES */}
            {avatar.accessory === 'sunglasses' && (
              <g>
                <rect x={44 + faceShiftX} y="46" width="14" height="10" rx="3" fill="#1A202C" stroke="#D4AF37" strokeWidth="1" />
                <rect x={62 + faceShiftX} y="46" width="14" height="10" rx="3" fill="#1A202C" stroke="#D4AF37" strokeWidth="1" />
                <line x1={58 + faceShiftX} y1="50" x2={62 + faceShiftX} y2="50" stroke="#D4AF37" strokeWidth="1.5" />
              </g>
            )}

            {avatar.accessory === 'glasses' && (
              <g>
                <circle cx={52 + faceShiftX} cy="51" r="7" stroke="#0B5D3B" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.2" />
                <circle cx={69 + faceShiftX} cy="51" r="7" stroke="#0B5D3B" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.2" />
                <line x1={59 + faceShiftX} y1="51" x2={62 + faceShiftX} y2="51" stroke="#0B5D3B" strokeWidth="1.8" />
              </g>
            )}

            {avatar.accessory === 'headphones' && (
              <g>
                <path d="M34 50C34 32 86 32 86 50" stroke="#0B5D3B" strokeWidth="4" fill="none" strokeLinecap="round" />
                <rect x="30" y="46" width="8" height="16" rx="4" fill="#D4AF37" />
                <rect x="82" y="46" width="8" height="16" rx="4" fill="#D4AF37" />
              </g>
            )}
          </g>

          {/* ============================================================== */}
          {/* INTERACTIVE ANIMATED WAVING ARM (يلوح ويرحب) */}
          {/* ============================================================== */}
          {!highFivePose && (motion === 'waving' || isTapped) && (
            <>
              {dir !== 'left' ? (
                /* Waving right arm (viewer's right) */
                <g className="animate-avatar-wave" style={{ transformOrigin: '82px 90px' }}>
                  {/* Sleeve */}
                  <path
                    d="M80 90 L98 62 L106 66 L86 98 Z"
                    fill={avatar.clothingColor || '#0B5D3B'}
                  />
                  {/* Wrist cuff */}
                  <line x1="97" y1="63" x2="105" y2="67" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" />
                  {/* Palm */}
                  <circle cx="104" cy="54" r="6.5" fill={avatar.skinTone} />
                  {/* Waving fingers */}
                  <path d="M102 48 L104 42 L106 48" stroke={avatar.skinTone} strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M105 48 L108 42 L110 48" stroke={avatar.skinTone} strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M108 50 L112 45 L112 50" stroke={avatar.skinTone} strokeWidth="2" strokeLinecap="round" />
                  <path d="M99 53 L94 51 L98 56" stroke={avatar.skinTone} strokeWidth="2" strokeLinecap="round" />
                </g>
              ) : (
                /* Waving left arm (viewer's left) */
                <g className="animate-avatar-wave-left" style={{ transformOrigin: '38px 90px' }}>
                  {/* Sleeve */}
                  <path
                    d="M40 90 L22 62 L14 66 L34 98 Z"
                    fill={avatar.clothingColor || '#0B5D3B'}
                  />
                  {/* Wrist cuff */}
                  <line x1="23" y1="63" x2="15" y2="67" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.6" />
                  {/* Palm */}
                  <circle cx="16" cy="54" r="6.5" fill={avatar.skinTone} />
                  {/* Waving fingers */}
                  <path d="M18 48 L16 42 L14 48" stroke={avatar.skinTone} strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M15 48 L12 42 L10 48" stroke={avatar.skinTone} strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M12 50 L8 45 L8 50" stroke={avatar.skinTone} strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 53 L26 51 L22 56" stroke={avatar.skinTone} strokeWidth="2" strokeLinecap="round" />
                </g>
              )}
            </>
          )}

          {/* HIGH-FIVE RAISED HAND & ARM FOR SPECIAL REVEALS */}
          {highFivePose && isFacingRight && (
            <g className="origin-bottom-left transition-transform duration-300">
              <path
                d="M78 88L110 52L116 57L86 96Z"
                fill={avatar.clothingColor || '#0B5D3B'}
              />
              <circle cx="114" cy="50" r="7" fill={avatar.skinTone} />
              <path d="M112 44L120 40L122 43L115 47Z" fill={avatar.skinTone} />
              <path d="M116 46L124 44L125 48L118 50Z" fill={avatar.skinTone} />
              <path d="M117 50L125 51L124 55L116 53Z" fill={avatar.skinTone} />
            </g>
          )}

          {highFivePose && isFacingLeft && (
            <g className="origin-bottom-right transition-transform duration-300">
              <path
                d="M42 88L10 52L4 57L34 96Z"
                fill={avatar.clothingColor || '#0B5D3B'}
              />
              <circle cx="6" cy="50" r="7" fill={avatar.skinTone} />
              <path d="M8 44L0 40L-2 43L5 47Z" fill={avatar.skinTone} />
              <path d="M4 46L-4 44L-5 48L2 50Z" fill={avatar.skinTone} />
              <path d="M3 50L-5 51L-4 55L4 53Z" fill={avatar.skinTone} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
