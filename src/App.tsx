import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveScreen,
  UserProfile,
  MatchProfile,
  Language,
  ThemeMode,
  PrivacySettings,
  AvatarConfig,
} from './types';
import { TRANSLATIONS } from './i18n/translations';
import { getTopTwinMatches } from './services/matchingService';
import { saveUserProfile } from './services/profileService';
import { MOCK_MATCHES } from './data/mockMatches';
import { isSupabaseConfigured } from './lib/supabase';

// Components
import { TopBarControls } from './components/navigation/TopBar';
import { BottomTabBar } from './components/navigation/BottomTabBar';
import { WelcomeScreen } from './components/auth/WelcomeScreen';
import { SignUpPreviewModal } from './components/auth/SignUpPreviewModal';
import { InteractiveOnboarding } from './components/onboarding/InteractiveOnboarding';
import { ProfileCompletionScreen } from './components/onboarding/ProfileCompletionScreen';
import { HomeScreen } from './components/home/HomeScreen';
import { FindMyTwinExperience } from './components/matching/FindMyTwinExperience';
import { MatchesListView } from './components/matching/MatchesListView';
import { MatchDetailModal } from './components/matching/MatchDetailModal';
import { ProfileComparisonView } from './components/matching/ProfileComparisonView';
import { DiscoverScreen } from './components/discover/DiscoverScreen';
import { SavedProfilesScreen } from './components/saved/SavedProfilesScreen';
import { MyProfileScreen } from './components/profile/MyProfileScreen';
import { AvatarCustomizerModal } from './components/avatar/AvatarCustomizerModal';
import { PrivacySettingsModal } from './components/settings/PrivacySettingsModal';
import { ToastNotification, ToastMessage } from './components/common/ToastNotification';

const DEFAULT_AVATAR: AvatarConfig = {
  id: 'user_main',
  baseGender: 'neutral',
  skinTone: '#E0AC69',
  hairStyle: 'traditional',
  hairColor: '#1A1816',
  clothingStyle: 'thobe',
  clothingColor: '#0B5D3B',
  accessory: 'sunglasses',
  expression: 'smile',
  direction: 'center',
  motionStyle: 'waving',
};

const DEFAULT_PRIVACY: PrivacySettings = {
  showCityPublicly: true,
  showGenderPublicly: false,
  showAgeRangePublicly: true,
  allowDiscoverability: true,
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_me',
  username: 'rayan_riyadh',
  city: 'Riyadh',
  gender: 'male',
  ageRange: '25-29',
  avatar: DEFAULT_AVATAR,
  answers: {
    q_vibe: 'vibe_ambitious',
    q_coffee: 'coffee_v60',
    q_food: 'food_burger',
    q_drinks: 'drink_mojito',
    q_sports: ['sport_football', 'sport_padel'],
    q_leisure: 'leisure_cafe',
    q_cars: 'car_luxury_sedan',
    q_places: 'place_cozycafe',
    q_lifestyle: 'lifestyle_nightowl',
  },
  bio: 'Specialty coffee aficionado, padel enthusiast, and urban architecture fan.',
  isCompleted: true,
  privacy: DEFAULT_PRIVACY,
};

export default function App() {
  // App Core States
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('twin_theme_mode');
      return saved === 'dark' || saved === 'light' ? saved : 'light';
    } catch {
      return 'light';
    }
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [simulateNoMatch, setSimulateNoMatch] = useState(false);

  // Saved Profiles State (persisted in localStorage)
  const [savedProfileIds, setSavedProfileIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('twin_saved_profile_ids');
      return saved ? JSON.parse(saved) : ['user_faisal', 'user_noura'];
    } catch {
      return ['user_faisal', 'user_noura'];
    }
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('twin_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  // Dynamic Matches State calculated by real matching engine
  const [calculatedMatches, setCalculatedMatches] = useState<MatchProfile[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Modals & Navigation Sub-states
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isAvatarCustomizerOpen, setIsAvatarCustomizerOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [selectedMatchForDetail, setSelectedMatchForDetail] = useState<MatchProfile | null>(null);
  const [activeComparisonMatch, setActiveComparisonMatch] = useState<MatchProfile | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Save bookmarked IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('twin_saved_profile_ids', JSON.stringify(savedProfileIds));
    } catch {
      // Ignore localStorage error
    }
  }, [savedProfileIds]);

  // Refresh matches deterministically based on current user answers and preferences
  const refreshMatches = useCallback(async (profile: UserProfile) => {
    setIsLoadingMatches(true);
    try {
      const matches = await getTopTwinMatches(profile, 5);
      setCalculatedMatches(matches);
    } catch (e) {
      console.error('Error calculating top matches:', e);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  // Compute matches on mount and whenever user answers change
  useEffect(() => {
    refreshMatches(userProfile);
  }, [userProfile.answers, refreshMatches]);

  // Save profile updates to localStorage & Supabase
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // Handle HTML dir & font syncing for True RTL / LTR
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    html.setAttribute('lang', language);
  }, [language]);

  // Handle Dark Mode Class and persistence
  useEffect(() => {
    try {
      localStorage.setItem('twin_theme_mode', theme);
    } catch {
      // ignore
    }
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
      document.body.classList.remove('bg-[#F8F7F2]', 'text-[#202923]');
      document.body.classList.add('bg-[#111813]', 'text-[#F8F7F2]');
    } else {
      html.classList.remove('dark');
      document.body.classList.remove('bg-[#111813]', 'text-[#F8F7F2]');
      document.body.classList.add('bg-[#F8F7F2]', 'text-[#202923]');
    }
  }, [theme]);

  // All available matches combining calculated + mock pool for bookmark resolution
  const allAvailableMatches = Array.from(
    new Map([...calculatedMatches, ...MOCK_MATCHES].map((m) => [m.id, m])).values()
  );

  // Resolved list of saved match profiles
  const savedMatchesList = allAvailableMatches.filter((m) => savedProfileIds.includes(m.id));

  // Current active twin match for the high-five reveal
  const currentTwinMatch = simulateNoMatch
    ? null
    : calculatedMatches.length > 0
    ? calculatedMatches[currentMatchIndex % calculatedMatches.length]
    : MOCK_MATCHES[0];

  const t = TRANSLATIONS[language];

  // Handlers
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleToggleTheme = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(20);
      }
    } catch {
      // ignore
    }
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      addToast(
        'info',
        nextTheme === 'dark'
          ? (language === 'ar' ? 'تم تفعيل الوضع الغامض الفاخر 🌙' : 'Mysterious Dark Mode activated 🌙')
          : (language === 'ar' ? 'تم تفعيل الوضع النهاري ☀️' : 'Light Mode activated ☀️')
      );
      return nextTheme;
    });
  };

  const handleToggleSaveProfile = (matchId: string) => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(25);
      }
    } catch {
      // Ignore vibration error
    }

    setSavedProfileIds((prev) => {
      if (prev.includes(matchId)) {
        addToast('bookmark', t.bookmarkRemovedToast);
        return prev.filter((id) => id !== matchId);
      } else {
        addToast('bookmark', t.bookmarkSavedToast);
        try {
          confetti({
            particleCount: 22,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#D4AF37', '#0B5D3B', '#FFFFFF'],
            disableForReducedMotion: true,
          });
        } catch {
          // ignore confetti
        }
        return [...prev, matchId];
      }
    });
  };

  const handleSendWave = (match: MatchProfile) => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([20, 30, 40]);
      }
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0B5D3B', '#DDF3E7', '#D4AF37'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }
    const msg = t.waveSentToast.replace('{user}', match.username);
    addToast('action', msg);
  };

  const handleSendHighFive = (match: MatchProfile) => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([50, 40, 90, 50, 140]);
      }
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#0B5D3B', '#DDF3E7', '#D4AF37', '#FFFFFF'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }
    addToast('success', t.highFiveSentToast);
  };

  const handleShareProfile = (match: MatchProfile) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${window.location.origin}/#profile/${match.username}`);
      }
    } catch {
      // ignore
    }
    addToast('info', t.linkCopiedToast);
  };

  const handleShareComparison = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${window.location.origin}/#compare/${userProfile.username}`);
      }
    } catch {
      // ignore
    }
    addToast('info', t.linkCopiedToast);
  };

  const handleOnboardingComplete = (answers: Record<string, string | string[]>) => {
    const updated = {
      ...userProfile,
      answers,
      isCompleted: true,
    };
    setUserProfile(updated);
    refreshMatches(updated);
    setActiveScreen('profile_completion');
  };

  const handleStartSignUpFlow = () => {
    setIsSignUpModalOpen(true);
  };

  const handleSignUpComplete = (username: string, city: string) => {
    const updated = {
      ...userProfile,
      username,
      city,
    };
    setUserProfile(updated);
    setIsSignUpModalOpen(false);
    setActiveScreen('onboarding');
  };

  const handleOpenComparison = (match: MatchProfile) => {
    setActiveComparisonMatch(match);
    setActiveScreen('comparison');
  };

  const handleNextTwinMatch = () => {
    if (calculatedMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % calculatedMatches.length);
    }
  };

  // Determine if bottom navigation should be visible
  const showBottomNav =
    activeScreen === 'home' ||
    activeScreen === 'discover' ||
    activeScreen === 'saved' ||
    activeScreen === 'matches' ||
    activeScreen === 'profile';

  return (
    <div className="min-h-screen bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-[#F8F7F2] transition-colors flex flex-col justify-between">
      {/* Toast Alert Notifications */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Top Bar Quick Switcher (Language, Theme, Saved Counter and Match Simulation) */}
      <TopBarControls
        language={language}
        onToggleLanguage={handleToggleLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        simulateNoMatch={simulateNoMatch}
        onToggleSimulateNoMatch={() => setSimulateNoMatch(!simulateNoMatch)}
        savedCount={savedProfileIds.length}
        onOpenSaved={() => setActiveScreen('saved')}
      />

      {/* Main Screen Switcher */}
      <div className="flex-1 w-full max-w-md mx-auto">
        {/* 1. Welcome Screen */}
        {activeScreen === 'welcome' && (
          <WelcomeScreen
            language={language}
            onStart={handleStartSignUpFlow}
            onExplore={() => setActiveScreen('discover')}
          />
        )}

        {/* 2. Interactive Personality Onboarding */}
        {activeScreen === 'onboarding' && (
          <InteractiveOnboarding
            initialAnswers={userProfile.answers}
            language={language}
            onComplete={handleOnboardingComplete}
            onExit={() => setActiveScreen('home')}
          />
        )}

        {/* 3. Profile Completion Celebration Milestone */}
        {activeScreen === 'profile_completion' && (
          <ProfileCompletionScreen
            userProfile={userProfile}
            language={language}
            onFindTwin={() => setActiveScreen('find_twin')}
            onGoHome={() => setActiveScreen('home')}
          />
        )}

        {/* 4. Home Screen */}
        {activeScreen === 'home' && (
          <HomeScreen
            userProfile={userProfile}
            topMatches={calculatedMatches.length > 0 ? calculatedMatches : MOCK_MATCHES}
            language={language}
            onFindTwin={() => setActiveScreen('find_twin')}
            onViewMatches={() => setActiveScreen('matches')}
            onEditProfile={() => setActiveScreen('profile')}
            onSelectMatch={(m) => setSelectedMatchForDetail(m)}
            savedProfileIds={savedProfileIds}
            onToggleSave={handleToggleSaveProfile}
            onOpenSaved={() => setActiveScreen('saved')}
            onExploreDiscover={() => setActiveScreen('discover')}
          />
        )}

        {/* 5. The Signature Experience: FIND MY TWIN */}
        {activeScreen === 'find_twin' && (
          <FindMyTwinExperience
            userProfile={userProfile}
            match={currentTwinMatch}
            language={language}
            reducedMotion={reducedMotion}
            onOpenComparison={handleOpenComparison}
            onClose={() => setActiveScreen('home')}
            onNextMatch={handleNextTwinMatch}
            savedProfileIds={savedProfileIds}
            onToggleSaveProfile={handleToggleSaveProfile}
            onSendHighFive={handleSendHighFive}
          />
        )}

        {/* 6. Top 5 Matches Screen */}
        {activeScreen === 'matches' && (
          <MatchesListView
            matches={calculatedMatches.length > 0 ? calculatedMatches : MOCK_MATCHES}
            language={language}
            onSelectMatch={(m) => setSelectedMatchForDetail(m)}
            onCompareMatch={handleOpenComparison}
            onFindTwinCTA={() => setActiveScreen('find_twin')}
            savedProfileIds={savedProfileIds}
            onToggleSaveProfile={handleToggleSaveProfile}
            onSendWave={handleSendWave}
            onFilterByInterest={() => setActiveScreen('discover')}
          />
        )}

        {/* 7. Dedicated Profile Comparison Screen */}
        {activeScreen === 'comparison' && activeComparisonMatch && (
          <ProfileComparisonView
            userProfile={userProfile}
            match={activeComparisonMatch}
            language={language}
            onBack={() => setActiveScreen('matches')}
            isSaved={savedProfileIds.includes(activeComparisonMatch.id)}
            onToggleSave={handleToggleSaveProfile}
            onShareComparison={handleShareComparison}
          />
        )}

        {/* 8. Discover Screen (with All vs Saved tabs) */}
        {activeScreen === 'discover' && (
          <DiscoverScreen
            matches={allAvailableMatches}
            language={language}
            onSelectMatch={(m) => setSelectedMatchForDetail(m)}
            onCompareMatch={handleOpenComparison}
            savedProfileIds={savedProfileIds}
            onToggleSaveProfile={handleToggleSaveProfile}
            onSendWave={handleSendWave}
            initialTab="all"
          />
        )}

        {/* 9. Dedicated Saved Profiles Screen */}
        {activeScreen === 'saved' && (
          <SavedProfilesScreen
            savedMatches={savedMatchesList}
            language={language}
            onSelectMatch={(m) => setSelectedMatchForDetail(m)}
            onCompareMatch={handleOpenComparison}
            onToggleSaveProfile={handleToggleSaveProfile}
            onDiscoverMore={() => setActiveScreen('discover')}
            onSendWave={handleSendWave}
            onBack={() => setActiveScreen('home')}
          />
        )}

        {/* 10. My Profile Screen */}
        {activeScreen === 'profile' && (
          <MyProfileScreen
            userProfile={userProfile}
            language={language}
            onOpenAvatarCustomizer={() => setIsAvatarCustomizerOpen(true)}
            onOpenPrivacySettings={() => setIsPrivacyModalOpen(true)}
            onRetakeOnboarding={() => setActiveScreen('onboarding')}
            savedCount={savedProfileIds.length}
            onOpenSaved={() => setActiveScreen('saved')}
          />
        )}
      </div>

      {/* Persistent Bottom Tab Bar */}
      {showBottomNav && (
        <BottomTabBar
          activeScreen={activeScreen}
          onNavigate={(screen) => {
            if (screen === 'find_twin') {
              setActiveScreen('find_twin');
            } else {
              setActiveScreen(screen);
            }
          }}
          language={language}
          savedCount={savedProfileIds.length}
        />
      )}

      {/* Global Modals */}
      {/* Sign-Up & Phone Preview Modal */}
      <SignUpPreviewModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onComplete={handleSignUpComplete}
        language={language}
      />

      {/* Avatar Customizer Modal */}
      <AvatarCustomizerModal
        avatar={userProfile.avatar}
        isOpen={isAvatarCustomizerOpen}
        onClose={() => setIsAvatarCustomizerOpen(false)}
        onSave={(newAvatar) => {
          setUserProfile((prev) => ({ ...prev, avatar: newAvatar }));
          addToast('success', language === 'ar' ? 'تم تحديث مظهر الأفاتار بنجاح! ✨' : 'Avatar updated successfully! ✨');
        }}
        language={language}
      />

      {/* Privacy Settings Modal */}
      <PrivacySettingsModal
        privacy={userProfile.privacy}
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onSave={(newPrivacy) => {
          setUserProfile((prev) => ({ ...prev, privacy: newPrivacy }));
          addToast('success', language === 'ar' ? 'تم حفظ إعدادات الخصوصية بنجاح 🔒' : 'Privacy settings saved successfully 🔒');
        }}
        language={language}
      />

      {/* Match Detail Quick Modal */}
      <MatchDetailModal
        match={selectedMatchForDetail}
        isOpen={Boolean(selectedMatchForDetail)}
        onClose={() => setSelectedMatchForDetail(null)}
        onCompare={handleOpenComparison}
        language={language}
        isSaved={selectedMatchForDetail ? savedProfileIds.includes(selectedMatchForDetail.id) : false}
        onToggleSave={handleToggleSaveProfile}
        onSendWave={handleSendWave}
        onShareProfile={handleShareProfile}
      />
    </div>
  );
}
