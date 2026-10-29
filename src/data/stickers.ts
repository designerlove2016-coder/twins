export interface StickerItem {
  id: string;
  imageUrl: string;
  category: 'girl' | 'boy' | 'fun';
  labelAr: string;
  labelEn: string;
  tagAr: string;
  tagEn: string;
  descriptionAr: string;
  descriptionEn: string;
  defaultAnimation: 'sway-left-right' | 'bouncy-hop';
}

export const STICKER_CATALOG: StickerItem[] = [
  {
    id: 'sticker_girl_zahra',
    imageUrl: '/assets/aistudio/876653883732250923_c68b2c16.jpg',
    category: 'girl',
    labelAr: 'زهرة كيوت كاب',
    labelEn: 'Zahra Cute Cap',
    tagAr: 'بنات 🌸',
    tagEn: 'Girls 🌸',
    descriptionAr: 'شخصية 3D كرتونية لطيفة ترتدي كاب وردي وأسلوب عصري',
    descriptionEn: 'Cute 3D character with pink cap and stylish vibe',
    defaultAnimation: 'sway-left-right',
  },
  {
    id: 'sticker_girl_anime_heart',
    imageUrl: '/assets/aistudio/517702919690437567_dc6423fa.jpg',
    category: 'girl',
    labelAr: 'أنمي قلب Okis',
    labelEn: 'Anime Heart Okis',
    tagAr: 'بنات 🌸',
    tagEn: 'Girls 🌸',
    descriptionAr: 'أنمي ثلاثية الأبعاد تصنع حركة قلب وردية بيديها',
    descriptionEn: '3D anime character forming love hands with pink Okis aura',
    defaultAnimation: 'sway-left-right',
  },
  {
    id: 'sticker_boy_good_vibes_cat',
    imageUrl: '/assets/aistudio/1131459106414123025_b387a6f4.jpg',
    category: 'boy',
    labelAr: 'قط رايق Good Vibes',
    labelEn: 'Good Vibes Cool Cat',
    tagAr: 'شباب ومرح 🔥',
    tagEn: 'Guys & Chill 🔥',
    descriptionAr: 'قط كول يرتدي نظارة شمسية هيب هوب مع طاقة إيجابية عالية',
    descriptionEn: 'Cool street-style cat with sunglasses and relaxed energy',
    defaultAnimation: 'sway-left-right',
  },
  {
    id: 'sticker_fun_tears_of_joy',
    imageUrl: '/assets/aistudio/709598485083659920_7e1c1322.jpg',
    category: 'fun',
    labelAr: 'إيموجي ضحك متدحرج 3D',
    labelEn: '3D Rolling Laughing',
    tagAr: 'شباب ومرح 🔥',
    tagEn: 'Fun & Joy 🔥',
    descriptionAr: 'إيموجي ميت من الضحك ودموع الفرحة مع تفاصيل ثلاثية الأبعاد مجسمة',
    descriptionEn: '3D rolling tears of joy laughing emoji with depth and sheen',
    defaultAnimation: 'sway-left-right',
  },
  {
    id: 'sticker_fun_splash_laughter',
    imageUrl: '/assets/aistudio/585819864076434848_e8ae8f3d.jpg',
    category: 'fun',
    labelAr: 'إيموجي رشة ماء ميت ضحك',
    labelEn: 'Water Splash Joy',
    tagAr: 'شباب ومرح 🔥',
    tagEn: 'Fun & Splash 🔥',
    descriptionAr: 'إيموجي يضحك بحرارة مع قطرات ماء رذاذ أزرق تفاعلي',
    descriptionEn: 'Laughing emoji splashing in dynamic blue water droplets',
    defaultAnimation: 'bouncy-hop',
  },
  {
    id: 'sticker_fun_action_push',
    imageUrl: '/assets/aistudio/YouTube_Subscribe_a3688620.jpg',
    category: 'boy',
    labelAr: 'ضغطة تفاعلية وحماس 3D',
    labelEn: '3D Action Button Touch',
    tagAr: 'شباب ومرح 🔥',
    tagEn: 'Interactive Action 🔥',
    descriptionAr: 'إصبع ثلاثي الأبعاد يضغط الزر بحماس وانفجار طاقة احتفالي',
    descriptionEn: '3D finger clicking an action button with celebratory pulse',
    defaultAnimation: 'bouncy-hop',
  },
];
