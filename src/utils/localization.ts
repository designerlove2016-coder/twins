import { Language, MatchProfile } from '../types';

// Controlled dictionary of all interest tags and categories in English & Arabic
export const INTEREST_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  // Broad Dimensions from matchingService
  'Sports & Gaming': { en: 'Sports & Gaming', ar: 'الرياضة والألعاب' },
  'Coffee Ritual': { en: 'Coffee Ritual', ar: 'طقس القهوة' },
  'Comfort Food': { en: 'Comfort Food', ar: 'المأكولات المفضلة' },
  'Refreshing Drinks': { en: 'Refreshing Drinks', ar: 'المشروبات المنعشة' },
  'Daily Vibe': { en: 'Daily Vibe', ar: 'الطابع اليومي' },
  'Weekend Leisure': { en: 'Weekend Leisure', ar: 'عطلة الويكند' },
  'Ideal Environment': { en: 'Ideal Environment', ar: 'المكان المفضل' },
  'Daily Pace & Rhythm': { en: 'Daily Pace & Rhythm', ar: 'الإيقاع اليومي' },
  'Driving Philosophy': { en: 'Driving Philosophy', ar: 'فلسفة القيادة' },

  // Granular Sub-interests
  'Specialty V60 Drip': { en: 'Specialty V60 Drip', ar: 'قهوة V60 مختصة' },
  'Padel Tennis': { en: 'Padel Tennis', ar: 'رياضة البادل' },
  'Gourmet Burgers': { en: 'Gourmet Burgers', ar: 'برجر الذواقة' },
  'German Luxury Sedan': { en: 'German Luxury Sedan', ar: 'سيدان ألماني فاخر' },
  'Boutique Cafes': { en: 'Boutique Cafes', ar: 'المقاهي الهادئة' },
  'Beach & Coastline': { en: 'Beach & Coastline', ar: 'شواطئ وبحر' },
  'Clean Aesthetics': { en: 'Clean Aesthetics', ar: 'طابع تصميمي عصري' },
  'Gaming & Esports': { en: 'Gaming & Esports', ar: 'الألعاب والتقنية' },
  'Night Owl Rhythm': { en: 'Night Owl Rhythm', ar: 'نشاط وسهر ليلي' },
  'Gym & Fitness': { en: 'Gym & Fitness', ar: 'تمارين ولياقة بدنية' },
  'Specialty Cafes': { en: 'Specialty Cafes', ar: 'مقاهي مختصة' },
  'Italian Pasta': { en: 'Italian Pasta', ar: 'باستا إيطالية' },
  'Road Trips': { en: 'Road Trips', ar: 'رحلات برية وكشتات' },
  'Desert Kashta': { en: 'Desert Kashta', ar: 'كشتة وشبة نار' },
  'Nature Retreats': { en: 'Nature Retreats', ar: 'أجواء الطبيعة والهدوء' },
  'Running': { en: 'Running', ar: 'رياضة الجري' },
  'Football (Soccer)': { en: 'Football (Soccer)', ar: 'كرة القدم' },
  'Traditional Gahwa': { en: 'Traditional Gahwa', ar: 'قهوة عربية أصيلة' },
  'Rugged 4x4': { en: 'Rugged 4x4', ar: 'سيارات دفع رباعي للبر' },
};

// Cities Dictionary
export const CITY_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  Riyadh: { en: 'Riyadh', ar: 'الرياض' },
  Jeddah: { en: 'Jeddah', ar: 'جدة' },
  Khobar: { en: 'Khobar', ar: 'الخبر' },
  Dubai: { en: 'Dubai', ar: 'دبي' },
  Doha: { en: 'Doha', ar: 'الدوحة' },
  Global: { en: 'Global', ar: 'العالمية' },
};

// User Bios localized in both Arabic & English
export const BIO_TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  faisal_alotaibi: {
    en: 'Specialty coffee roasters, Thursday night padel matches, and long drives around Diriyah.',
    ar: 'عاشق لمقاهي القهوة المختصة، مباريات بادل ليلة الخميس، وخطوط ليلية هادئة حول الدرعية.',
  },
  noura_design: {
    en: 'Architectural spaces, sunset walks by the Red Sea, and ceremonial matcha lovers.',
    ar: 'مساحات معمارية ملهمة، جولات عند غروب شمس البحر الأحمر، وعشاق الماتشا اليابانية.',
  },
  tariq_tech: {
    en: 'Building early stage startups, competitive gaming weekends, and espresso shots before dawn.',
    ar: 'بناء شركات ناشئة واعدة، بطولات ألعاب رقمية في الويكند، وجرعات إسبريسو قبل الفجر.',
  },
  maya_alrashid: {
    en: 'Art galleries by afternoon, flat whites with oat milk, and spontaneous weekend roadtrips.',
    ar: 'معارض فنية في المساء، فلات وايت بحليب الشوفان، ورحلات برية عفوية في الويكند.',
  },
  sarah_k: {
    en: 'Specialty coffee aficionado, passionate about literature, vintage cars, and tea over coals.',
    ar: 'شغوفة بأسرار القهوة المختصة، الأدب العربي، السيارات الكلاسيكية، والشاي على الجمر.',
  },
  omar_qatari: {
    en: 'Football enthusiast, desert dune bashing, traditional hospitality and Arabic gahwa.',
    ar: 'عاشق لكرة القدم، رحلات التطعيس والكشتات بالبر، الكرم والضيافة والقهوة العربية.',
  },
};

/**
 * Translates any interest string cleanly according to active language
 */
export function formatInterest(interest: string, language: Language): string {
  if (!interest) return '';
  const match = INTEREST_TRANSLATIONS[interest];
  if (match) {
    return language === 'ar' ? match.ar : match.en;
  }
  return interest;
}

/**
 * Translates city name cleanly according to active language
 */
export function formatCity(city: string, language: Language): string {
  if (!city) return '';
  const match = CITY_TRANSLATIONS[city];
  if (match) {
    return language === 'ar' ? match.ar : match.en;
  }
  return city;
}

/**
 * Translates match bio according to active language
 */
export function formatBio(match: MatchProfile, language: Language): string {
  const custom = BIO_TRANSLATIONS[match.username];
  if (custom) {
    return language === 'ar' ? custom.ar : custom.en;
  }
  return match.bio || '';
}
