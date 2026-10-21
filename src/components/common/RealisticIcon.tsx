import React from 'react';

interface RealisticIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const RealisticIcon: React.FC<RealisticIconProps> = ({
  name,
  size = 48,
  className = '',
}) => {
  const s = size;

  switch (name) {
    // COFFEE / V60
    case 'coffee_v60':
    case 'coffee':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="v60_stand" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B5D3B" />
              <stop offset="1" stopColor="#08422A" />
            </linearGradient>
            <linearGradient id="v60_glass" x1="32" y1="12" x2="32" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E6F4EA" stopOpacity="0.9" />
              <stop offset="1" stopColor="#BCE3CF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="coffee_liquid" x1="32" y1="26" x2="32" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6F4E37" />
              <stop offset="1" stopColor="#3E2718" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="56" rx="20" ry="4" fill="#000000" fillOpacity="0.12" />
          {/* Glass server */}
          <path d="M22 38L18 52C18 54.2 19.8 56 22 56H42C44.2 56 46 54.2 46 52L42 38H22Z" fill="#E8F0EC" stroke="#0B5D3B" strokeWidth="2" />
          {/* Brewed coffee */}
          <path d="M20 48L19 52C19 53.5 20.3 54.7 21.8 54.7H42.2C43.7 54.7 45 53.5 45 52L44 48C40 49 24 49 20 48Z" fill="url(#coffee_liquid)" />
          {/* Dripper Cone */}
          <path d="M16 16L24 36H40L48 16H16Z" fill="url(#v60_glass)" stroke="#0B5D3B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Flutes / ribs on V60 */}
          <path d="M24 18L28 34" stroke="#0B5D3B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
          <path d="M32 18V34" stroke="#0B5D3B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
          <path d="M40 18L36 34" stroke="#0B5D3B" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
          {/* Paper filter rim */}
          <ellipse cx="32" cy="16" rx="16" ry="4" fill="#FFFBF2" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Aroma Steam */}
          <path d="M30 8C29 6 31 4 30 2" stroke="#0B5D3B" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
          <path d="M35 10C34 8 36 6 35 4" stroke="#0B5D3B" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
        </svg>
      );

    // FLAT WHITE / ESPRESSO
    case 'coffee_flatwhite':
    case 'coffee_espresso':
    case 'coffee_spanish':
    case 'coffee_coldbrew':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="cup_body" x1="16" y1="20" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="1" stopColor="#E2EBE5" />
            </linearGradient>
            <radialGradient id="latte_art" cx="32" cy="24" r="14" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF7E6" />
              <stop offset="0.6" stopColor="#8C5C36" />
              <stop offset="1" stopColor="#54351D" />
            </radialGradient>
          </defs>
          <ellipse cx="32" cy="56" rx="22" ry="4" fill="#000000" fillOpacity="0.1" />
          {/* Saucer */}
          <ellipse cx="32" cy="52" rx="22" ry="5" fill="#FFFFFF" stroke="#0B5D3B" strokeWidth="2" />
          {/* Cup */}
          <path d="M18 24C18 38 22 48 32 48C42 48 46 38 46 24H18Z" fill="url(#cup_body)" stroke="#0B5D3B" strokeWidth="2.5" />
          {/* Handle */}
          <path d="M46 28C52 28 54 38 45 40" stroke="#0B5D3B" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Coffee surface */}
          <ellipse cx="32" cy="24" rx="14" ry="5" fill="url(#latte_art)" stroke="#4A2F1A" strokeWidth="1" />
          {/* Latte heart */}
          <path d="M32 26C31 24 29 23 29 25C29 27 32 28.5 32 28.5C32 28.5 35 27 35 25C35 23 33 24 32 26Z" fill="#FFF7E6" />
        </svg>
      );

    // TRADITIONAL ARABIC GAHWA / DALLAH
    case 'coffee_arabic':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="gold_dallah" x1="16" y1="12" x2="48" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE082" />
              <stop offset="0.5" stopColor="#D4AF37" />
              <stop offset="1" stopColor="#997A1E" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="57" rx="16" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Dallah Base */}
          <path d="M22 55L24 40C24 34 26 28 32 28C38 28 40 34 40 40L42 55H22Z" fill="url(#gold_dallah)" stroke="#7A5E0B" strokeWidth="2" />
          {/* Neck */}
          <path d="M28 28V18H36V28" fill="url(#gold_dallah)" stroke="#7A5E0B" strokeWidth="2" />
          {/* Crown Lid */}
          <path d="M26 18C26 14 30 10 32 6C34 10 38 14 38 18H26Z" fill="url(#gold_dallah)" stroke="#7A5E0B" strokeWidth="2" />
          {/* Long curved spout */}
          <path d="M25 36C18 36 12 26 10 18C12 21 17 26 24 28" fill="url(#gold_dallah)" stroke="#7A5E0B" strokeWidth="2" strokeLinejoin="round" />
          {/* Ornate Handle */}
          <path d="M37 20C47 20 48 34 46 42C44 50 39 52 39 52" stroke="#7A5E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Finial jewel */}
          <circle cx="32" cy="6" r="2" fill="#0B5D3B" />
        </svg>
      );

    // BURGER & FOOD
    case 'food_burger':
    case 'food':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="bun_top" x1="16" y1="14" x2="48" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5B971" />
              <stop offset="1" stopColor="#D6802C" />
            </linearGradient>
            <linearGradient id="patty" x1="16" y1="36" x2="48" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5E311E" />
              <stop offset="1" stopColor="#381D12" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="56" rx="20" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Top Bun */}
          <path d="M16 28C16 18 23 12 32 12C41 12 48 18 48 28H16Z" fill="url(#bun_top)" stroke="#A05511" strokeWidth="2" />
          {/* Sesame Seeds */}
          <ellipse cx="26" cy="18" rx="1.5" ry="0.8" fill="#FFF3D6" transform="rotate(-20 26 18)" />
          <ellipse cx="34" cy="16" rx="1.5" ry="0.8" fill="#FFF3D6" />
          <ellipse cx="40" cy="20" rx="1.5" ry="0.8" fill="#FFF3D6" transform="rotate(25 40 20)" />
          {/* Lettuce */}
          <path d="M14 30C16 33 20 31 23 33C26 31 30 33 33 31C37 33 41 31 44 33C47 31 50 33 51 31L49 28H15L14 30Z" fill="#48BB78" stroke="#22543D" strokeWidth="1.5" />
          {/* Melted Cheese */}
          <path d="M16 34L22 36L28 34L35 38L42 34L48 36L47 33H17L16 34Z" fill="#ECC94B" stroke="#D69E2E" strokeWidth="1.5" />
          {/* Grilled Patty */}
          <rect x="15" y="37" width="34" height="7" rx="3.5" fill="url(#patty)" stroke="#27140B" strokeWidth="1.5" />
          {/* Bottom Bun */}
          <path d="M18 45H46C46 51 40 54 32 54C24 54 18 51 18 45Z" fill="url(#bun_top)" stroke="#A05511" strokeWidth="2" />
        </svg>
      );

    // TRADITIONAL MANDI / RICE
    case 'food_traditional':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="56" rx="22" ry="4" fill="#000000" fillOpacity="0.12" />
          {/* Big silver platter */}
          <ellipse cx="32" cy="46" rx="22" ry="8" fill="#E2E8F0" stroke="#718096" strokeWidth="2" />
          {/* Saffron spiced rice mound */}
          <path d="M15 44C15 32 22 26 32 26C42 26 49 32 49 44H15Z" fill="#ECC94B" stroke="#B7791F" strokeWidth="2" />
          {/* Tender roast meat pieces */}
          <ellipse cx="32" cy="32" rx="7" ry="4" fill="#7B341E" stroke="#4C1D0F" strokeWidth="1.5" />
          <ellipse cx="25" cy="38" rx="5" ry="3" fill="#8B4513" stroke="#4C1D0F" strokeWidth="1.5" />
          <ellipse cx="38" cy="37" rx="5" ry="3" fill="#8B4513" stroke="#4C1D0F" strokeWidth="1.5" />
          {/* Roasted almonds & raisins */}
          <ellipse cx="28" cy="42" rx="2" ry="1" fill="#FFF5D1" />
          <ellipse cx="35" cy="41" rx="2" ry="1" fill="#FFF5D1" />
          <ellipse cx="32" cy="43" rx="1.5" ry="1" fill="#3D1A10" />
        </svg>
      );

    // JAPANESE SUSHI / ASIAN
    case 'food_japanese':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="54" rx="20" ry="4" fill="#000000" fillOpacity="0.12" />
          {/* Wooden board */}
          <rect x="12" y="44" width="40" height="8" rx="2" fill="#7B4F26" stroke="#4A2E14" strokeWidth="2" />
          {/* Nigiri Rice base */}
          <rect x="18" y="32" width="28" height="12" rx="6" fill="#FFFFFF" stroke="#CBD5E0" strokeWidth="1.5" />
          {/* Fresh Salmon Slice */}
          <path d="M16 32C16 28 20 24 32 24C44 24 48 28 48 32H16Z" fill="#F87171" stroke="#DC2626" strokeWidth="1.5" />
          {/* White salmon fat striations */}
          <path d="M22 26L26 32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M30 25L34 32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M38 26L42 32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Nori nori belt */}
          <rect x="30" y="24" width="5" height="20" fill="#1A202C" />
          {/* Wasabi dollop */}
          <ellipse cx="48" cy="42" rx="3" ry="2.5" fill="#68D391" />
        </svg>
      );

    // ITALIAN / HEALTHY / BBQ
    case 'food_italian':
    case 'food_healthy':
    case 'food_bbq':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="54" rx="20" ry="4" fill="#000000" fillOpacity="0.12" />
          {/* Bowl */}
          <path d="M14 26C14 42 21 50 32 50C43 50 50 42 50 26H14Z" fill="#FFFFFF" stroke="#0B5D3B" strokeWidth="2.5" />
          {/* Healthy greens */}
          <circle cx="26" cy="28" r="8" fill="#48BB78" />
          <circle cx="38" cy="27" r="7" fill="#38A169" />
          {/* Cherry Tomatoes */}
          <circle cx="32" cy="25" r="4" fill="#E53E3E" stroke="#9B2C2C" strokeWidth="1" />
          {/* Avocado slices */}
          <ellipse cx="28" cy="23" rx="4" ry="2" fill="#9AE6B4" stroke="#48BB78" strokeWidth="1" />
          {/* Fork */}
          <path d="M46 14L43 32" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // DRINKS / MATCHA / MOJITO
    case 'drink_orangemint':
    case 'drink_matcha':
    case 'drink_mojito':
    case 'drink_pomegranate':
    case 'drink_hibiscus':
    case 'drink_boba':
    case 'drinks':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="56" rx="16" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Glass */}
          <path d="M20 18L24 52C24 53.5 25.5 55 27 55H37C38.5 55 40 53.5 40 52L44 18H20Z" fill="#E6F6ED" stroke="#0B5D3B" strokeWidth="2" />
          {/* Refreshing drink liquid */}
          <path d="M22 28L25 50C25 51.5 26.2 52.5 27.5 52.5H36.5C37.8 52.5 39 51.5 39 50L42 28C38 30 26 30 22 28Z" fill="#0B5D3B" fillOpacity="0.75" />
          {/* Ice cubes floating */}
          <rect x="26" y="32" width="7" height="7" rx="1.5" fill="#FFFFFF" fillOpacity="0.8" stroke="#DDF3E7" strokeWidth="1" transform="rotate(15 26 32)" />
          {/* Mint Leaf on Rim */}
          <path d="M20 18C16 14 16 8 22 8C26 12 24 16 20 18Z" fill="#38A169" stroke="#1C4532" strokeWidth="1.5" />
          {/* Lemon/Orange slice */}
          <circle cx="42" cy="18" r="8" fill="#F6E05E" stroke="#D69E2E" strokeWidth="1.5" />
          <circle cx="42" cy="18" r="5" fill="#ECC94B" />
          {/* Striped Straw */}
          <line x1="32" y1="46" x2="44" y2="8" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    // FOOTBALL / SOCCER
    case 'sport_football':
    case 'football':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <radialGradient id="ball_light" cx="24" cy="24" r="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.7" stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#A0AEC0" />
            </radialGradient>
          </defs>
          <ellipse cx="32" cy="56" rx="20" ry="4" fill="#000000" fillOpacity="0.15" />
          {/* Ball sphere */}
          <circle cx="32" cy="32" r="22" fill="url(#ball_light)" stroke="#2D3748" strokeWidth="2.5" />
          {/* Center pentagon */}
          <polygon points="32,24 38,28 36,36 28,36 26,28" fill="#1A202C" />
          {/* Surrounding seams */}
          <line x1="32" y1="24" x2="32" y2="12" stroke="#2D3748" strokeWidth="2" />
          <line x1="38" y1="28" x2="48" y2="22" stroke="#2D3748" strokeWidth="2" />
          <line x1="36" y1="36" x2="44" y2="44" stroke="#2D3748" strokeWidth="2" />
          <line x1="28" y1="36" x2="20" y2="44" stroke="#2D3748" strokeWidth="2" />
          <line x1="26" y1="28" x2="16" y2="22" stroke="#2D3748" strokeWidth="2" />
          {/* Hexagonal patches */}
          <polygon points="32,12 24,14 26,20" fill="#E2E8F0" stroke="#2D3748" strokeWidth="1.5" />
          <polygon points="32,12 40,14 38,20" fill="#E2E8F0" stroke="#2D3748" strokeWidth="1.5" />
        </svg>
      );

    // PADEL TENNIS
    case 'sport_padel':
    case 'padel':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="padel_blade" x1="16" y1="8" x2="48" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B5D3B" />
              <stop offset="0.6" stopColor="#08422A" />
              <stop offset="1" stopColor="#032014" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="57" rx="16" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Padel racket head */}
          <ellipse cx="32" cy="24" rx="16" ry="18" fill="url(#padel_blade)" stroke="#D4AF37" strokeWidth="2.5" />
          {/* Distinctive perforations / holes */}
          <circle cx="28" cy="18" r="1.6" fill="#F8F7F2" />
          <circle cx="32" cy="18" r="1.6" fill="#F8F7F2" />
          <circle cx="36" cy="18" r="1.6" fill="#F8F7F2" />
          <circle cx="26" cy="24" r="1.6" fill="#F8F7F2" />
          <circle cx="32" cy="24" r="1.6" fill="#D4AF37" />
          <circle cx="38" cy="24" r="1.6" fill="#F8F7F2" />
          <circle cx="28" cy="30" r="1.6" fill="#F8F7F2" />
          <circle cx="32" cy="30" r="1.6" fill="#F8F7F2" />
          <circle cx="36" cy="30" r="1.6" fill="#F8F7F2" />
          {/* Throttle throat */}
          <path d="M27 41L29 46H35L37 41" fill="#08422A" stroke="#D4AF37" strokeWidth="2" />
          {/* Grip handle */}
          <rect x="29.5" y="46" width="5" height="12" rx="1" fill="#FFFFFF" stroke="#08422A" strokeWidth="1.5" />
          <line x1="29.5" y1="49" x2="34.5" y2="49" stroke="#CBD5E0" strokeWidth="1" />
          <line x1="29.5" y1="52" x2="34.5" y2="52" stroke="#CBD5E0" strokeWidth="1" />
          <line x1="29.5" y1="55" x2="34.5" y2="55" stroke="#CBD5E0" strokeWidth="1" />
          {/* Safety wrist chord */}
          <path d="M32 58C32 61 36 62 36 60" stroke="#0B5D3B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bright optic yellow ball */}
          <circle cx="48" cy="18" r="6" fill="#CCFF00" stroke="#779900" strokeWidth="1.5" />
          <path d="M44 16C46 17 48 19 48 21" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );

    // GAMING & ESPORTS
    case 'sport_gaming':
    case 'gaming':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <defs>
            <linearGradient id="controller_body" x1="12" y1="18" x2="52" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2D3748" />
              <stop offset="1" stopColor="#1A202C" />
            </linearGradient>
          </defs>
          <ellipse cx="32" cy="54" rx="18" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Controller curved body */}
          <path d="M18 22C14 28 12 44 17 48C21 51 26 44 28 38H36C38 44 43 51 47 48C52 44 50 28 46 22C42 18 22 18 18 22Z" fill="url(#controller_body)" stroke="#0B5D3B" strokeWidth="2" />
          {/* D-Pad on left */}
          <rect x="21" y="27" width="3" height="9" rx="1" fill="#718096" />
          <rect x="18" y="30" width="9" height="3" rx="1" fill="#718096" />
          {/* Action buttons on right */}
          <circle cx="43" cy="27" r="1.8" fill="#ECC94B" />
          <circle cx="46" cy="30" r="1.8" fill="#E53E3E" />
          <circle cx="43" cy="33" r="1.8" fill="#3182CE" />
          <circle cx="40" cy="30" r="1.8" fill="#38A169" />
          {/* Thumbsticks */}
          <circle cx="26" cy="38" r="4" fill="#1A202C" stroke="#4A5568" strokeWidth="1.5" />
          <circle cx="38" cy="38" r="4" fill="#1A202C" stroke="#4A5568" strokeWidth="1.5" />
          {/* Center glowing LED */}
          <ellipse cx="32" cy="24" rx="3" ry="1.5" fill="#DDF3E7" />
        </svg>
      );

    // GYM & FITNESS
    case 'sport_gym':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="54" rx="18" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Dumbbell bar */}
          <rect x="12" y="30" width="40" height="4" rx="2" fill="#E2E8F0" stroke="#718096" strokeWidth="1.5" />
          {/* Inner plates */}
          <rect x="18" y="20" width="5" height="24" rx="2" fill="#0B5D3B" stroke="#08422A" strokeWidth="1.5" />
          <rect x="41" y="20" width="5" height="24" rx="2" fill="#0B5D3B" stroke="#08422A" strokeWidth="1.5" />
          {/* Outer large plates */}
          <rect x="13" y="16" width="5" height="32" rx="2.5" fill="#202923" stroke="#0B5D3B" strokeWidth="1.5" />
          <rect x="46" y="16" width="5" height="32" rx="2.5" fill="#202923" stroke="#0B5D3B" strokeWidth="1.5" />
          {/* Center knurled grip */}
          <line x1="28" y1="30" x2="36" y2="30" stroke="#D4AF37" strokeWidth="3" />
        </svg>
      );

    // RUNNING
    case 'sport_running':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="54" rx="18" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Modern running sneaker */}
          <path d="M12 42C14 42 16 43 20 44C26 45 42 45 46 42C49 39 52 32 46 28C42 25 36 26 32 28L24 33L14 36C12 37 11 40 12 42Z" fill="#0B5D3B" stroke="#08422A" strokeWidth="2" />
          {/* Cushion sole */}
          <path d="M10 44C16 45 42 45 52 42C53 43 53 47 50 48C44 50 20 50 10 47V44Z" fill="#FFFFFF" stroke="#CBD5E0" strokeWidth="1.5" />
          {/* Mint energetic swoop accent */}
          <path d="M22 36C28 34 38 34 44 32" stroke="#DDF3E7" strokeWidth="2.5" strokeLinecap="round" />
          {/* Laces */}
          <line x1="30" y1="29" x2="34" y2="33" stroke="#D4AF37" strokeWidth="1.5" />
          <line x1="33" y1="27" x2="37" y2="31" stroke="#D4AF37" strokeWidth="1.5" />
        </svg>
      );

    // SWIMMING & SEA
    case 'sport_swimming':
    case 'leisure_sea':
    case 'place_beach':
    case 'beach':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="55" rx="18" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Warm Sun */}
          <circle cx="44" cy="18" r="8" fill="#F6E05E" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Waves */}
          <path d="M12 38C16 34 20 42 24 38C28 34 32 42 36 38C40 34 44 42 48 38C52 34 54 38 54 38" stroke="#3182CE" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M10 46C14 42 18 50 22 46C26 42 30 50 34 46C38 42 42 50 46 46C50 42 54 46 54 46" stroke="#0B5D3B" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Palm Fronds silhouette */}
          <path d="M14 36C18 28 26 24 32 26" stroke="#22543D" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M22 24C24 18 28 16 34 18" stroke="#22543D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // BASKETBALL
    case 'sport_basketball':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="56" rx="18" ry="3.5" fill="#000000" fillOpacity="0.12" />
          <circle cx="32" cy="32" r="21" fill="#ED8936" stroke="#C05621" strokeWidth="2" />
          <line x1="11" y1="32" x2="53" y2="32" stroke="#2D3748" strokeWidth="2" />
          <line x1="32" y1="11" x2="32" y2="53" stroke="#2D3748" strokeWidth="2" />
          <path d="M17 18C25 24 25 40 17 46" stroke="#2D3748" strokeWidth="2" />
          <path d="M47 18C39 24 39 40 47 46" stroke="#2D3748" strokeWidth="2" />
        </svg>
      );

    // CARS / GERMAN LUXURY / 4X4
    case 'car_luxury_sedan':
    case 'car_rugged_4x4':
    case 'car_electric_tech':
    case 'car_sports_coupe':
    case 'car_practical_compact':
    case 'cars':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="54" rx="22" ry="4" fill="#000000" fillOpacity="0.15" />
          {/* Car silhouette */}
          <path d="M12 40L15 32C17 26 23 22 28 21H38C44 21 48 25 50 30L53 38C55 39 55 44 54 46L52 47H13C11 47 11 43 12 40Z" fill="#0B5D3B" stroke="#08422A" strokeWidth="2" />
          {/* Cabin glass windshield */}
          <path d="M22 30L26 23H38L42 30H22Z" fill="#DDF3E7" stroke="#08422A" strokeWidth="1.5" />
          {/* Wheel left */}
          <circle cx="21" cy="46" r="6" fill="#1A202C" stroke="#718096" strokeWidth="2" />
          <circle cx="21" cy="46" r="2.5" fill="#CBD5E0" />
          {/* Wheel right */}
          <circle cx="43" cy="46" r="6" fill="#1A202C" stroke="#718096" strokeWidth="2" />
          <circle cx="43" cy="46" r="2.5" fill="#CBD5E0" />
          {/* Headlights beam */}
          <circle cx="51" cy="38" r="2" fill="#FEFCBF" />
          {/* Subtle gold prestige badge */}
          <circle cx="32" cy="27" r="1.5" fill="#D4AF37" />
        </svg>
      );

    // MALLS & ICONIC PLAZAS
    case 'place_malls':
    case 'shopping':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="55" rx="18" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Modern architecture glass atrium */}
          <path d="M16 52V28L32 14L48 28V52H16Z" fill="#FFFFFF" stroke="#0B5D3B" strokeWidth="2" />
          <line x1="32" y1="14" x2="32" y2="52" stroke="#0B5D3B" strokeWidth="1.5" />
          <line x1="16" y1="36" x2="48" y2="36" stroke="#0B5D3B" strokeWidth="1.5" />
          <line x1="16" y1="44" x2="48" y2="44" stroke="#0B5D3B" strokeWidth="1.5" />
          {/* Shopping bag accent */}
          <rect x="27" y="40" width="10" height="12" rx="1.5" fill="#D4AF37" />
          <path d="M30 40V37C30 35.5 31 34 32 34C33 34 34 35.5 34 37V40" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
        </svg>
      );

    // CAFES & RESTAURANTS
    case 'leisure_cafe':
    case 'place_cozycafe':
    case 'cafes':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="55" rx="18" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Cafe awning canopy */}
          <path d="M14 24C14 20 20 18 32 18C44 18 50 20 50 24L48 30H16L14 24Z" fill="#0B5D3B" stroke="#08422A" strokeWidth="2" />
          <line x1="22" y1="19" x2="21" y2="30" stroke="#DDF3E7" strokeWidth="2.5" />
          <line x1="32" y1="18" x2="32" y2="30" stroke="#DDF3E7" strokeWidth="2.5" />
          <line x1="42" y1="19" x2="43" y2="30" stroke="#DDF3E7" strokeWidth="2.5" />
          {/* Window & door */}
          <rect x="18" y="30" width="28" height="22" fill="#FFFFFF" stroke="#0B5D3B" strokeWidth="2" />
          {/* Warm light lamp */}
          <circle cx="32" cy="38" r="4" fill="#FEFCBF" />
          <line x1="32" y1="30" x2="32" y2="34" stroke="#D4AF37" strokeWidth="1.5" />
        </svg>
      );

    // DESERT CAMPING / KASHTA
    case 'leisure_kashta':
    case 'place_nature':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="55" rx="18" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Desert dune horizon */}
          <path d="M8 48C18 42 28 46 36 42C44 38 52 44 56 46V52H8V48Z" fill="#ECC94B" fillOpacity="0.4" />
          {/* Bedouin Tent / Kashta pavilion */}
          <polygon points="32,20 14,48 50,48" fill="#202923" stroke="#0B5D3B" strokeWidth="2" />
          {/* Tent opening */}
          <polygon points="32,28 26,48 38,48" fill="#F8F7F2" />
          {/* Cozy Campfire */}
          <path d="M44 48L46 44" stroke="#8C5C36" strokeWidth="2" strokeLinecap="round" />
          <path d="M48 48L44 44" stroke="#8C5C36" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45" cy="42" r="3" fill="#E53E3E" />
          <circle cx="45" cy="41" r="1.5" fill="#F6E05E" />
          {/* Stars */}
          <circle cx="20" cy="18" r="1.5" fill="#D4AF37" />
          <circle cx="44" cy="14" r="1.2" fill="#D4AF37" />
        </svg>
      );

    // MUSIC & CONCERTS
    case 'leisure_music':
    case 'music':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="54" rx="16" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Over-ear headphones */}
          <path d="M18 36C18 24 24 16 32 16C40 16 46 24 46 36" stroke="#0B5D3B" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Left ear cushion */}
          <rect x="14" y="32" width="8" height="14" rx="4" fill="#202923" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Right ear cushion */}
          <rect x="42" y="32" width="8" height="14" rx="4" fill="#202923" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Musical sound wave notes */}
          <path d="M30 38C30 35 34 33 34 38C34 41 30 43 30 43" stroke="#0B5D3B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    // ART GALLERIES / MOVIES
    case 'leisure_arts':
    case 'place_historic':
    case 'movies':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="54" rx="16" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Framed Canvas */}
          <rect x="16" y="16" width="32" height="28" rx="2" fill="#F8F7F2" stroke="#D4AF37" strokeWidth="2.5" />
          {/* Minimalist modern art composition */}
          <circle cx="28" cy="28" r="6" fill="#0B5D3B" />
          <path d="M20 40C26 34 34 38 42 32L44 40H20Z" fill="#DDF3E7" />
          {/* Easel legs */}
          <line x1="20" y1="44" x2="16" y2="52" stroke="#7B4F26" strokeWidth="2" strokeLinecap="round" />
          <line x1="44" y1="44" x2="48" y2="52" stroke="#7B4F26" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // PETS
    case 'pets':
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="54" rx="16" ry="3.5" fill="#000000" fillOpacity="0.12" />
          {/* Central paw pad */}
          <ellipse cx="32" cy="38" rx="10" ry="8" fill="#0B5D3B" />
          {/* 4 toe pads */}
          <ellipse cx="20" cy="25" rx="4" ry="5.5" fill="#D4AF37" />
          <ellipse cx="28" cy="19" rx="4" ry="5.5" fill="#D4AF37" />
          <ellipse cx="36" cy="19" rx="4" ry="5.5" fill="#D4AF37" />
          <ellipse cx="44" cy="25" rx="4" ry="5.5" fill="#D4AF37" />
        </svg>
      );

    // DEFAULT / FALLBACK
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 64 64" fill="none" className={className}>
          <ellipse cx="32" cy="55" rx="16" ry="3.5" fill="#000000" fillOpacity="0.1" />
          <circle cx="32" cy="32" r="20" fill="#DDF3E7" stroke="#0B5D3B" strokeWidth="2" />
          <circle cx="32" cy="32" r="8" fill="#0B5D3B" />
        </svg>
      );
  }
};
