import React from 'react';
import { ActiveScreen, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { Home, Compass, Sparkles, User, Layers } from 'lucide-react';

interface BottomTabBarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  language: Language;
  savedCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeScreen,
  onNavigate,
  language,
  savedCount = 0,
}) => {
  const t = TRANSLATIONS[language];

  const tabs: { screen: ActiveScreen; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      screen: 'home',
      label: t.navHome,
      icon: <Home size={20} />,
    },
    {
      screen: 'discover',
      label: t.navDiscover,
      icon: <Compass size={20} />,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      screen: 'find_twin',
      label: t.navFindTwin,
      icon: <Sparkles size={24} className="text-[#D4AF37]" />,
    },
    {
      screen: 'matches',
      label: t.navMatches,
      icon: <Layers size={20} />,
    },
    {
      screen: 'profile',
      label: t.navProfile,
      icon: <User size={20} />,
    },
  ];

  const handleTabClick = (screen: ActiveScreen) => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(15);
      }
    } catch {
      // Ignore vibration error
    }
    onNavigate(screen);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-3 pb-2 pt-1 pointer-events-none">
      {/* 
        3D Tactile Skeuomorphic Floating Dock:
        Organic floating container with living floor shadow, ceramic fill, and mechanical buttons
      */}
      <div className="relative pointer-events-auto">
        
        {/* Living Bottom Floor Shadow underneath the entire 5-button dock */}
        <div className="absolute inset-x-6 -bottom-1 h-5 rounded-full bg-black/25 dark:bg-black/55 blur-lg pointer-events-none animate-floor-shadow" />

        <nav
          className="
            relative w-full
            bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#EFECE4]
            dark:from-[#1E2721] dark:via-[#18201A] dark:to-[#121814]
            border border-white/90 dark:border-white/10
            rounded-[28px]
            shadow-[0_8px_0_0_#D5CEBE,0_16px_28px_-4px_rgba(32,41,35,0.18)]
            dark:shadow-[0_8px_0_0_#0D130F,0_16px_28px_-4px_rgba(0,0,0,0.6)]
            px-2 py-1.5
            backdrop-blur-md
          "
          aria-label="Bottom Navigation"
        >
          {/* Top Ceramic Specular Glossy Sheen */}
          <div className="absolute inset-x-3 top-0.5 h-[35%] rounded-t-[26px] bg-gradient-to-b from-white/90 via-white/25 to-transparent dark:from-white/15 dark:via-transparent pointer-events-none" />

          {/* 5 Tactile Interactive Buttons Grid */}
          <div className="grid grid-cols-5 items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeScreen === tab.screen || (tab.screen === 'discover' && activeScreen === 'saved');
              const isFindTwin = tab.screen === 'find_twin';

              if (isFindTwin) {
                // Central Elevated 3D Tactile Skeuomorphic "Find Twin" Button
                return (
                  <div key={tab.screen} className="flex justify-center -mt-6">
                    <div className="relative group select-none">
                      {/* Ambient breathing aura glow underneath */}
                      <div className="absolute -inset-1 rounded-full bg-[#0B5D3B]/40 blur-md pointer-events-none animate-pulse" />

                      <button
                        type="button"
                        onClick={() => handleTabClick(tab.screen)}
                        className={`
                          relative w-14 h-14 rounded-full
                          bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
                          border-2 border-[#34D399]/60
                          shadow-[0_6px_0_0_#052E1C,0_12px_22px_rgba(11,93,59,0.45)]
                          active:translate-y-1 active:shadow-[0_2px_0_0_#052E1C,0_4px_10px_rgba(11,93,59,0.35)]
                          flex flex-col items-center justify-center
                          cursor-pointer transition-all duration-150 transform-gpu
                          overflow-hidden ring-4 ring-[#0B5D3B]/20
                          ${isActive ? 'scale-105 ring-[#D4AF37]/50' : 'hover:scale-105'}
                        `}
                        aria-label={tab.label}
                      >
                        {/* Top specular glossy highlight */}
                        <div className="absolute inset-x-2 top-0.5 h-[45%] rounded-full bg-gradient-to-b from-white/60 via-white/15 to-transparent pointer-events-none" />

                        <Sparkles
                          size={24}
                          className="relative z-10 text-[#D4AF37] animate-pulse drop-shadow-md"
                        />
                        <span className="relative z-10 text-[8px] font-black tracking-wider uppercase text-white/95 mt-0.5 leading-none">
                          {language === 'ar' ? 'شبيهي' : 'TWIN'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              }

              // The other 4 3D Tactile Navigation Buttons
              return (
                <button
                  key={tab.screen}
                  type="button"
                  onClick={() => handleTabClick(tab.screen)}
                  className={`
                    relative min-h-[46px] rounded-2xl py-1 px-1
                    flex flex-col items-center justify-center
                    transition-all duration-150 transform-gpu active:translate-y-0.5 cursor-pointer
                    ${
                      isActive
                        ? 'bg-gradient-to-b from-[#E6F8EF] via-[#DDF3E7] to-[#C9EBD7] dark:from-[#0B5D3B]/35 dark:to-[#08422A]/45 border border-[#0B5D3B]/40 shadow-[0_3px_0_0_#9DCDB6,0_6px_10px_rgba(11,93,59,0.15)] dark:shadow-[0_3px_0_0_#052A1A]'
                        : 'hover:bg-white/60 dark:hover:bg-white/5 text-[#778078] dark:text-slate-400'
                    }
                  `}
                  aria-label={tab.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {/* Top specular sheen for active button */}
                  {isActive && (
                    <div className="absolute inset-x-1.5 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/80 via-white/20 to-transparent pointer-events-none" />
                  )}

                  <div
                    className={`relative transition-colors duration-150 ${
                      isActive
                        ? 'text-[#0B5D3B] dark:text-[#DDF3E7] scale-105'
                        : 'text-[#778078] dark:text-slate-400'
                    }`}
                  >
                    {tab.icon}
                    {tab.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full bg-[#D4AF37] text-black text-[9px] font-black leading-none shadow-xs">
                        {tab.badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[9px] tracking-tight mt-0.5 truncate max-w-[62px] transition-colors leading-none ${
                      isActive
                        ? 'text-[#0B5D3B] dark:text-[#DDF3E7] font-extrabold'
                        : 'text-[#778078] dark:text-slate-400 font-medium'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};
