export type Language = 'en' | 'ar';
export type ThemeMode = 'light' | 'dark';

export type CategoryKey =
  | 'vibe'
  | 'coffee'
  | 'food'
  | 'drinks'
  | 'sports'
  | 'leisure'
  | 'cars'
  | 'places'
  | 'lifestyle';

export interface QuestionOption {
  id: string;
  labelEn: string;
  labelAr: string;
  iconKey: string;
  descriptionEn?: string;
  descriptionAr?: string;
}

export interface Question {
  id: string;
  category: CategoryKey;
  titleEn: string;
  titleAr: string;
  subtitleEn?: string;
  subtitleAr?: string;
  isMultiSelect?: boolean;
  maxSelect?: number;
  options: QuestionOption[];
}

export interface AvatarConfig {
  id: string;
  baseGender: 'neutral' | 'masculine' | 'feminine';
  skinTone: string; // hex
  hairStyle: 'short-fade' | 'curly' | 'wavy' | 'sleek' | 'hijab' | 'traditional' | 'cap' | 'buzz';
  hairColor: string; // hex
  clothingStyle: 'hoodie' | 'tshirt' | 'blazer' | 'thobe' | 'denim';
  clothingColor: string; // hex
  accessory: 'none' | 'glasses' | 'sunglasses' | 'headphones';
  expression: 'smile' | 'cool' | 'wink' | 'cheerful';
  direction?: 'left' | 'right' | 'center';
  motionStyle?: 'waving' | 'smiling' | 'bouncing' | 'nodding' | 'cool-sway' | 'wink';
}

export interface UserProfile {
  id: string;
  username: string;
  city: string;
  gender?: 'prefer_not_to_say' | 'male' | 'female';
  ageRange?: string;
  avatar: AvatarConfig;
  answers: Record<string, string | string[]>;
  bio?: string;
  isCompleted: boolean;
  privacy: PrivacySettings;
}

export interface PrivacySettings {
  showCityPublicly: boolean;
  showGenderPublicly: boolean;
  showAgeRangePublicly: boolean;
  allowDiscoverability: boolean;
  // Security invariants: Phone number and exact location are NEVER public
}

export interface MatchProfile {
  id: string;
  username: string;
  city: string;
  gender?: string;
  ageRange?: string;
  similarityScore: number; // 0 - 100
  avatar: AvatarConfig;
  answers: Record<string, string | string[]>;
  sharedInterests: string[];
  bio: string;
  verifiedPersonality: boolean;
}

export type ActiveScreen =
  | 'welcome'
  | 'signup_preview'
  | 'username_setup'
  | 'onboarding'
  | 'profile_completion'
  | 'home'
  | 'find_twin'
  | 'matches'
  | 'comparison'
  | 'discover'
  | 'saved'
  | 'profile'
  | 'settings';
