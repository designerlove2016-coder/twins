import React, { useState } from 'react';
import { AvatarConfig, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { STICKER_CATALOG, StickerItem } from '../../data/stickers';
import { AvatarRenderer } from './AvatarRenderer';
import { X, Check, Sparkles, Dices, Smile, Palette, Zap } from 'lucide-react';

interface AvatarCustomizerModalProps {
  avatar: AvatarConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAvatar: AvatarConfig) => void;
  language: Language;
}

const SKIN_TONES = ['#F5D0A9', '#F3C59D', '#E0AC69', '#C68642', '#8D5524'];
const CLOTHING_COLORS = ['#0B5D3B', '#202923', '#2C3E35', '#1A4A7A', '#8C5C36', '#9B2C2C', '#F8F7F2'];

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  avatar,
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [config, setConfig] = useState<AvatarConfig>({
    ...avatar,
    avatarType: avatar.avatarType || (avatar.stickerUrl ? 'sticker' : 'sticker'),
    stickerUrl: avatar.stickerUrl || STICKER_CATALOG[0].imageUrl,
    stickerAnimation: avatar.stickerAnimation || 'sway-left-right',
  });
  const [popKey, setPopKey] = useState(0);

  // Tab: 3D Stickers & Emojis vs Custom Illustrated Avatar
  const [activeTab, setActiveTab] = useState<'stickers' | 'custom'>(
    avatar.avatarType === 'illustrated' && !avatar.stickerUrl ? 'custom' : 'stickers'
  );

  // Sticker filter: all, girl, boy
  const [stickerFilter, setStickerFilter] = useState<'all' | 'girl' | 'boy'>('all');

  if (!isOpen) return null;

  const triggerPop = () => {
    setPopKey((k) => k + 1);
  };

  const updateConfig = (patch: Partial<AvatarConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
    triggerPop();
  };

  const handleSelectSticker = (item: StickerItem) => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([25, 30]);
      }
    } catch {
      // ignore
    }
    updateConfig({
      avatarType: 'sticker',
      stickerUrl: item.imageUrl,
      stickerCategory: item.category,
      stickerAnimation: config.stickerAnimation || item.defaultAnimation || 'sway-left-right',
      motionStyle: 'sway-left-right',
    });
  };

  const hairOptions: { id: AvatarConfig['hairStyle']; labelEn: string; labelAr: string }[] = [
    { id: 'traditional', labelEn: 'Shemagh / Ghutra', labelAr: 'شماغ / غترة' },
    { id: 'short-fade', labelEn: 'Modern Fade', labelAr: 'تدريج عصري' },
    { id: 'hijab', labelEn: 'Hijab', labelAr: 'حجاب' },
    { id: 'curly', labelEn: 'Curly Volume', labelAr: 'كيرلي' },
    { id: 'wavy', labelEn: 'Wavy Layers', labelAr: 'مموج' },
    { id: 'cap', labelEn: 'Snapback Cap', labelAr: 'كاب رياضي' },
  ];

  const clothingOptions: { id: AvatarConfig['clothingStyle']; labelEn: string; labelAr: string }[] = [
    { id: 'thobe', labelEn: 'Saudi Thobe', labelAr: 'ثوب سعودي' },
    { id: 'blazer', labelEn: 'Structured Blazer', labelAr: 'بليزر رسمي' },
    { id: 'hoodie', labelEn: 'Comfort Hoodie', labelAr: 'هودي مريح' },
    { id: 'denim', labelEn: 'Denim Jacket', labelAr: 'جاكيت جينز' },
    { id: 'tshirt', labelEn: 'Minimal T-Shirt', labelAr: 'تيشيرت ناعم' },
  ];

  const accessoryOptions: { id: AvatarConfig['accessory']; labelEn: string; labelAr: string }[] = [
    { id: 'none', labelEn: 'None', labelAr: 'بدون إكسسوار' },
    { id: 'sunglasses', labelEn: 'Dark Shades', labelAr: 'نظارة شمسية' },
    { id: 'glasses', labelEn: 'Classic Glasses', labelAr: 'نظارة طبية' },
    { id: 'headphones', labelEn: 'Studio Headphones', labelAr: 'سماعات رأس' },
  ];

  const expressionOptions: { id: AvatarConfig['expression']; labelEn: string; labelAr: string }[] = [
    { id: 'smile', labelEn: 'Gentle Smile', labelAr: 'ابتسامة هادئة' },
    { id: 'cheerful', labelEn: 'Wide Laugh', labelAr: 'ضحكة وفرحة' },
    { id: 'cool', labelEn: 'Cool & Chill', labelAr: 'نظرة واثقة' },
    { id: 'wink', labelEn: 'Playful Wink', labelAr: 'غمزة مرحة' },
  ];

  const motionOptions: {
    id: NonNullable<AvatarConfig['motionStyle']>;
    labelEn: string;
    labelAr: string;
    icon: string;
    descEn: string;
    descAr: string;
  }[] = [
    { id: 'waving', labelEn: 'Friendly Wave 👋', labelAr: 'يلوح ويرحب 👋', icon: '👋', descEn: 'Waves hand warmly to new visitors', descAr: 'يلوح بيده ويرحب بالأصدقاء' },
    { id: 'smiling', labelEn: 'Gentle Smile 😊', labelAr: 'يبتسم ويتألق 😊', icon: '😊', descEn: 'Blushing smile with sparkles', descAr: 'ابتسامة متألقة مع وميض ذهبي' },
    { id: 'bouncing', labelEn: 'Joyful Bounce 🎉', labelAr: 'يقفز بمرح 🎉', icon: '🎉', descEn: 'Energetic happy bounce', descAr: 'قفزة حيوية وحماسية مرحة' },
    { id: 'nodding', labelEn: 'Confident Nod 😎', labelAr: 'إيماءة واثقة 😎', icon: '😎', descEn: 'Cool affirming nod', descAr: 'إيماءة رأس رايقة وواثقة' },
    { id: 'cool-sway', labelEn: 'Chill Sway ✨', labelAr: 'تمايل رايق ✨', icon: '✨', descEn: 'Smooth calm rhythm', descAr: 'تمايل انسيابي هادئ ومريح' },
    { id: 'wink', labelEn: 'Playful Wink 😉', labelAr: 'غمزة مرحة 😉', icon: '😉', descEn: 'Cheeky wink with star sparkle', descAr: 'غمزة مرحة مع نجمة براقة' },
  ];

  // Sticker interactive motion options (تتحرك تروح يمين ويسار وتتفاعل)
  const stickerMotionOptions: {
    id: NonNullable<AvatarConfig['stickerAnimation']>;
    labelEn: string;
    labelAr: string;
    icon: string;
    descEn: string;
    descAr: string;
  }[] = [
    {
      id: 'sway-left-right',
      labelEn: 'Sway Left & Right ↔️',
      labelAr: 'تمايل يمين ويسار تفاعلي ↔️',
      icon: '↔️',
      descEn: 'Sways rhythmically from left to right',
      descAr: 'تتحرك بانسيابية مرحة بين اليمين واليسار',
    },
    {
      id: 'bouncy-hop',
      labelEn: 'Joyful Bouncy Hop 🎉',
      labelAr: 'قفز حيوي مرح 🎉',
      icon: '🎉',
      descEn: 'Energetic responsive bounce with squash',
      descAr: 'قفزة مبهجة متفاعلة مع اللمس',
    },
    {
      id: 'pulse-grow',
      labelEn: 'Dynamic Pulse ⚡',
      labelAr: 'نبض حماسي متصاعد ⚡',
      icon: '⚡',
      descEn: 'Rhythmic breath and scale pulse',
      descAr: 'نبض وتكبير حيوي ملفت للنظر',
    },
    {
      id: 'tilt-wiggle',
      labelEn: 'Playful Tilt 💫',
      labelAr: 'إيماءة وزوايا رايقة 💫',
      icon: '💫',
      descEn: 'Smooth angle tilt back and forth',
      descAr: 'تمايل خفيف ممتع للزوايا',
    },
  ];

  // Randomize a unique combination
  const handleRandomize = () => {
    if (activeTab === 'stickers') {
      const randomSticker = STICKER_CATALOG[Math.floor(Math.random() * STICKER_CATALOG.length)];
      handleSelectSticker(randomSticker);
    } else {
      const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)];
      const randomHair = hairOptions[Math.floor(Math.random() * hairOptions.length)].id;
      const randomCloth = clothingOptions[Math.floor(Math.random() * clothingOptions.length)].id;
      const randomColor = CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)];
      const randomAcc = accessoryOptions[Math.floor(Math.random() * accessoryOptions.length)].id;
      const randomExp = expressionOptions[Math.floor(Math.random() * expressionOptions.length)].id;
      const randomMotion = motionOptions[Math.floor(Math.random() * motionOptions.length)].id;

      setConfig({
        ...config,
        avatarType: 'illustrated',
        stickerUrl: undefined,
        skinTone: randomSkin,
        hairStyle: randomHair,
        clothingStyle: randomCloth,
        clothingColor: randomColor,
        accessory: randomAcc,
        expression: randomExp,
        motionStyle: randomMotion,
      });
      triggerPop();
    }
  };

  const filteredStickers = STICKER_CATALOG.filter((item) => {
    if (stickerFilter === 'all') return true;
    if (stickerFilter === 'girl') return item.category === 'girl';
    if (stickerFilter === 'boy') return item.category === 'boy' || item.category === 'fun';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md h-[92vh] max-h-[820px] bg-white dark:bg-[#18221C] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* 1. FIXED TOP MODAL HEADER */}
        <header className="shrink-0 flex items-center justify-between px-5 pt-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#18221C] z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 flex items-center justify-center text-[#0B5D3B] dark:text-[#DDF3E7] shadow-xs">
              <Sparkles size={16} className="text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#202923] dark:text-[#F8F7F2]">
                {language === 'ar' ? 'تخصيص الهوية والأفاتار' : 'Customize Identity & Avatar'}
              </h2>
              <span className="text-[10px] text-[#778078] dark:text-slate-400 block leading-tight">
                {language === 'ar' ? 'ملصقات 3D متحركة متفاعلة للبنات والشباب' : '3D Animated & Interactive Stickers for Girls & Guys'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        {/* PRIMARY MODE TABS: 3D STICKERS VS CUSTOM AVATAR */}
        <div className="shrink-0 px-4 py-2 bg-[#F8F7F2] dark:bg-[#121814] border-b border-slate-200/60 dark:border-slate-800/80 z-20">
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-[#1A251E] border border-white/50 dark:border-white/5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('stickers');
                if (!config.stickerUrl) {
                  handleSelectSticker(STICKER_CATALOG[0]);
                } else {
                  updateConfig({ avatarType: 'sticker' });
                }
              }}
              className={`
                min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer
                ${
                  activeTab === 'stickers'
                    ? 'bg-gradient-to-b from-[#137A4F] to-[#0B5D3B] text-white shadow-md shadow-[#0B5D3B]/25 scale-[1.01]'
                    : 'text-[#778078] dark:text-slate-400 hover:text-[#202923] dark:hover:text-white'
                }
              `}
            >
              <Smile size={15} className={activeTab === 'stickers' ? 'text-[#D4AF37]' : ''} />
              <span>{language === 'ar' ? 'ملصقات وإيموجي 3D ✨' : '3D Stickers & Emojis ✨'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('custom');
                updateConfig({ avatarType: 'illustrated' });
              }}
              className={`
                min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer
                ${
                  activeTab === 'custom'
                    ? 'bg-gradient-to-b from-[#137A4F] to-[#0B5D3B] text-white shadow-md shadow-[#0B5D3B]/25 scale-[1.01]'
                    : 'text-[#778078] dark:text-slate-400 hover:text-[#202923] dark:hover:text-white'
                }
              `}
            >
              <Palette size={15} />
              <span>{language === 'ar' ? 'أفاتار مخصص 🎨' : 'Custom Avatar 🎨'}</span>
            </button>
          </div>
        </div>

        {/* 2. STRICTLY PINNED / FIXED AVATAR SHOWCASE (الصورة ثابتة بالأعلى وتتحرك يمين ويسار تفاعلياً) */}
        <div className="shrink-0 sticky top-0 z-20 px-4 py-2.5 bg-gradient-to-b from-[#FAF9F5] via-[#EEF9F3] to-[#FAF9F5] dark:from-[#111813] dark:via-[#16201A] dark:to-[#111813] border-b border-[#0B5D3B]/20 shadow-xs flex flex-col items-center justify-center">
          
          <div className="w-full flex items-center justify-between px-2">
            
            {/* Direction Shift Buttons */}
            <div className="flex items-center gap-1 bg-white/90 dark:bg-[#18221C]/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <button
                type="button"
                onClick={() => updateConfig({ direction: 'right' })}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  config.direction === 'right'
                    ? 'bg-[#0B5D3B] text-white shadow-xs'
                    : 'text-[#778078] hover:text-[#202923] dark:hover:text-white'
                }`}
                title="Face Twin"
              >
                {language === 'ar' ? 'يمين ➔' : 'Right ➔'}
              </button>
              <button
                type="button"
                onClick={() => updateConfig({ direction: 'center' })}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  config.direction === 'center'
                    ? 'bg-[#0B5D3B] text-white shadow-xs'
                    : 'text-[#778078] hover:text-[#202923] dark:hover:text-white'
                }`}
              >
                {language === 'ar' ? 'وسط' : 'Center'}
              </button>
              <button
                type="button"
                onClick={() => updateConfig({ direction: 'left' })}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  config.direction === 'left'
                    ? 'bg-[#0B5D3B] text-white shadow-xs'
                    : 'text-[#778078] hover:text-[#202923] dark:hover:text-white'
                }`}
              >
                {language === 'ar' ? '🠔 يسار' : '🠔 Left'}
              </button>
            </div>

            {/* Main Interactive Avatar (Live Animated Swaying Left-Right or Wave) */}
            <div className="relative my-0.5">
              <div className="absolute -inset-2.5 rounded-full bg-[#D4AF37]/25 blur-md pointer-events-none animate-pulse" />
              <div key={popKey} className="animate-avatar-pop relative">
                <AvatarRenderer
                  avatar={config}
                  size={92}
                  direction={config.direction || 'center'}
                />
              </div>
            </div>

            {/* Randomize Button */}
            <button
              type="button"
              onClick={handleRandomize}
              className="px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-[#18221C]/95 hover:bg-[#DDF3E7] dark:hover:bg-[#0B5D3B]/30 border border-[#0B5D3B]/25 text-[#0B5D3B] dark:text-[#DDF3E7] text-[10px] font-bold flex flex-col items-center gap-0.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Pick Random"
            >
              <Dices size={16} className="text-[#D4AF37]" />
              <span>{language === 'ar' ? 'اختيار عشوائي' : 'Random'}</span>
            </button>

          </div>

          {/* Dynamic Active Movement Status */}
          <div className="mt-1.5 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/95 dark:bg-[#18221C]/95 border border-[#0B5D3B]/25 text-[10px] font-extrabold text-[#0B5D3B] dark:text-[#10B981] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0B5D3B] dark:bg-[#10B981] animate-ping shrink-0" />
            <span>
              {config.avatarType === 'sticker'
                ? (language === 'ar' ? '✨ ملصق 3D متفاعل يتمايل يميناً ويساراً' : '✨ Interactive 3D Sticker Swaying Left & Right')
                : (language === 'ar' ? 'أفاتار كرتوني تفاعلي متجاوب' : 'Interactive Illustrated Avatar')}
            </span>
          </div>
        </div>

        {/* 3. SCROLLABLE OPTIONS STRIP */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-3.5 space-y-4 no-scrollbar">
          
          {/* ============================================================== */}
          {/* TAB 1: 3D STICKERS & EMOJIS (الملصقات والإيموجي للبنات والشباب) */}
          {/* ============================================================== */}
          {activeTab === 'stickers' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Category Pills (الكل، بنات 🌸، شباب ومرح 🔥) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0B5D3B] dark:text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#D4AF37]" />
                    <span>{language === 'ar' ? 'اختر ملصق أو إيموجي 3D' : 'Choose 3D Sticker or Emoji'}</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#778078]">
                    {filteredStickers.length} {language === 'ar' ? 'ملصقات حصرية' : 'exclusive stickers'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStickerFilter('all')}
                    className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      stickerFilter === 'all'
                        ? 'bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-xs'
                        : 'bg-white dark:bg-[#202923] text-[#778078] dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0B5D3B]/40'
                    }`}
                  >
                    {language === 'ar' ? 'الكل 🌟' : 'All 🌟'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStickerFilter('girl')}
                    className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      stickerFilter === 'girl'
                        ? 'bg-[#E53E3E] text-white border-[#E53E3E] shadow-xs'
                        : 'bg-white dark:bg-[#202923] text-[#778078] dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-pink-400'
                    }`}
                  >
                    {language === 'ar' ? 'بنات 🌸' : 'Girls 🌸'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStickerFilter('boy')}
                    className={`min-h-[34px] px-3.5 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      stickerFilter === 'boy'
                        ? 'bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-xs'
                        : 'bg-white dark:bg-[#202923] text-[#778078] dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0B5D3B]/40'
                    }`}
                  >
                    {language === 'ar' ? 'شباب ومرح 🔥' : 'Guys & Fun 🔥'}
                  </button>
                </div>
              </div>

              {/* 3D Stickers Grid with High Visual Quality */}
              <div className="grid grid-cols-2 gap-2.5">
                {filteredStickers.map((item) => {
                  const isSelected = config.avatarType === 'sticker' && config.stickerUrl === item.imageUrl;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSticker(item)}
                      className={`
                        relative group p-2.5 rounded-2xl border transition-all cursor-pointer overflow-hidden
                        ${
                          isSelected
                            ? 'bg-[#DDF3E7] dark:bg-[#0B5D3B]/35 border-[#0B5D3B] dark:border-[#10B981] shadow-md scale-[1.02] ring-2 ring-[#0B5D3B]/30'
                            : 'bg-white dark:bg-[#1E2721] border-slate-200 dark:border-slate-800 hover:border-[#0B5D3B]/50 hover:shadow-xs'
                        }
                      `}
                    >
                      {/* Top specular glossy sheen */}
                      <div className="absolute inset-x-2 top-0.5 h-[35%] rounded-t-xl bg-gradient-to-b from-white/70 via-white/10 to-transparent pointer-events-none" />

                      <div className="flex flex-col items-center text-center">
                        {/* Circular framed sticker image */}
                        <div className="relative w-18 h-18 rounded-full overflow-hidden border-2 border-white dark:border-[#10B981]/40 shadow-sm bg-slate-100 dark:bg-black/40 my-1">
                          <img
                            src={item.imageUrl}
                            alt={language === 'ar' ? item.labelAr : item.labelEn}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {/* Inner glossy reflection */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 via-transparent to-black/20 pointer-events-none" />
                        </div>

                        {/* Tag Pill (بنات / شباب) */}
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/40 text-[#0B5D3B] dark:text-[#DDF3E7] border border-[#0B5D3B]/20 mb-1">
                          {language === 'ar' ? item.tagAr : item.tagEn}
                        </span>

                        <h4 className="text-xs font-bold text-[#202923] dark:text-white leading-tight">
                          {language === 'ar' ? item.labelAr : item.labelEn}
                        </h4>
                        <p className="text-[9px] text-[#778078] dark:text-slate-400 mt-0.5 line-clamp-1">
                          {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                        </p>

                        {isSelected && (
                          <div className="mt-1 flex items-center gap-1 text-[9px] font-extrabold text-[#0B5D3B] dark:text-[#10B981]">
                            <Check size={12} strokeWidth={3} />
                            <span>{language === 'ar' ? 'مفعل حالياً' : 'Selected'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sticker Interactive Movement Selector (يمين ويسار، قفز، إلخ) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0B5D3B] dark:text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={14} className="text-[#D4AF37]" />
                    <span>{language === 'ar' ? 'حركة وتفاعل الملصق (تتحرك يمين ويسار)' : 'Sticker Motion & Interaction'}</span>
                  </label>
                  <span className="text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">
                    {language === 'ar' ? 'متفاعل حي' : 'Live Motion'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stickerMotionOptions.map((opt) => {
                    const isSelected = (config.stickerAnimation || 'sway-left-right') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateConfig({ stickerAnimation: opt.id, motionStyle: 'sway-left-right' })}
                        className={`
                          p-2.5 rounded-2xl text-start transition-all cursor-pointer border flex items-center gap-2.5
                          ${
                            isSelected
                              ? 'bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 border-[#0B5D3B] dark:border-[#10B981] shadow-sm scale-[1.01]'
                              : 'bg-white dark:bg-[#202923] border-slate-200 dark:border-slate-800 hover:border-[#0B5D3B]/40'
                          }
                        `}
                      >
                        <span className="text-xl shrink-0 p-1.5 rounded-xl bg-white/90 dark:bg-black/30 shadow-2xs">
                          {opt.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isSelected ? 'text-[#0B5D3B] dark:text-[#DDF3E7]' : 'text-[#202923] dark:text-white'}`}>
                              {language === 'ar' ? opt.labelAr : opt.labelEn}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#0B5D3B] dark:bg-[#10B981] animate-ping" />
                            )}
                          </div>
                          <p className="text-[9px] text-[#778078] dark:text-slate-400 mt-0.5">
                            {language === 'ar' ? opt.descAr : opt.descEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: CUSTOM ILLUSTRATED AVATAR (الأفاتار الكرتوني المخصص) */}
          {/* ============================================================== */}
          {activeTab === 'custom' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Skin Tone */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#778078] uppercase tracking-wider">
                    {t.skinTone}
                  </label>
                  <span className="text-[10px] text-[#0B5D3B] font-semibold">
                    {SKIN_TONES.indexOf(config.skinTone) + 1} / {SKIN_TONES.length}
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => updateConfig({ skinTone: tone })}
                      style={{ backgroundColor: tone }}
                      className={`w-10 h-10 rounded-full transition-all cursor-pointer ${
                        config.skinTone === tone
                          ? 'scale-115 ring-4 ring-[#0B5D3B] ring-offset-2 dark:ring-offset-[#18221C] shadow-md'
                          : 'hover:scale-105 opacity-80'
                      }`}
                      aria-label={`Skin tone ${tone}`}
                    />
                  ))}
                </div>
              </div>

              {/* Hair & Headwear */}
              <div>
                <label className="block text-xs font-bold text-[#778078] mb-2 uppercase tracking-wider">
                  {t.hairStyle}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {hairOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateConfig({ hairStyle: opt.id })}
                      className={`min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-xl text-start transition-all cursor-pointer border ${
                        config.hairStyle === opt.id
                          ? 'bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 border-[#0B5D3B] text-[#0B5D3B] dark:text-[#DDF3E7] font-bold shadow-2xs scale-[1.01]'
                          : 'bg-white dark:bg-[#202923] border-slate-200 dark:border-slate-700 text-[#202923] dark:text-[#F8F7F2] hover:border-slate-400'
                      }`}
                    >
                      {language === 'ar' ? opt.labelAr : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clothing Style */}
              <div>
                <label className="block text-xs font-bold text-[#778078] mb-2 uppercase tracking-wider">
                  {t.clothingStyle}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {clothingOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateConfig({ clothingStyle: opt.id })}
                      className={`min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-xl text-start transition-all cursor-pointer border ${
                        config.clothingStyle === opt.id
                          ? 'bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 border-[#0B5D3B] text-[#0B5D3B] dark:text-[#DDF3E7] font-bold shadow-2xs scale-[1.01]'
                          : 'bg-white dark:bg-[#202923] border-slate-200 dark:border-slate-700 text-[#202923] dark:text-[#F8F7F2] hover:border-slate-400'
                      }`}
                    >
                      {language === 'ar' ? opt.labelAr : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clothing Color */}
              <div>
                <label className="block text-xs font-bold text-[#778078] mb-2 uppercase tracking-wider">
                  {t.outfitColor}
                </label>
                <div className="flex items-center gap-3">
                  {CLOTHING_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateConfig({ clothingColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 transition-transform cursor-pointer ${
                        config.clothingColor === color
                          ? 'scale-115 ring-3 ring-[#0B5D3B] ring-offset-2 dark:ring-offset-[#18221C] shadow-md'
                          : 'hover:scale-105'
                      }`}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Accessories */}
              <div>
                <label className="block text-xs font-bold text-[#778078] mb-2 uppercase tracking-wider">
                  {t.accessory}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {accessoryOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateConfig({ accessory: opt.id })}
                      className={`min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-xl text-start transition-all cursor-pointer border ${
                        config.accessory === opt.id
                          ? 'bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 border-[#0B5D3B] text-[#0B5D3B] dark:text-[#DDF3E7] font-bold shadow-2xs scale-[1.01]'
                          : 'bg-white dark:bg-[#202923] border-slate-200 dark:border-slate-700 text-[#202923] dark:text-[#F8F7F2] hover:border-slate-400'
                      }`}
                    >
                      {language === 'ar' ? opt.labelAr : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Facial Expressions */}
              <div>
                <label className="block text-xs font-bold text-[#778078] mb-2 uppercase tracking-wider">
                  {t.expressionMood}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {expressionOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateConfig({ expression: opt.id })}
                      className={`min-h-[44px] px-3.5 py-2 text-xs font-medium rounded-xl text-start transition-all cursor-pointer border ${
                        config.expression === opt.id
                          ? 'bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 border-[#0B5D3B] text-[#0B5D3B] dark:text-[#DDF3E7] font-bold shadow-2xs scale-[1.01]'
                          : 'bg-white dark:bg-[#202923] border-slate-200 dark:border-slate-700 text-[#202923] dark:text-[#F8F7F2] hover:border-slate-400'
                      }`}
                    >
                      {language === 'ar' ? opt.labelAr : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Motion Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#0B5D3B] dark:text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#D4AF37]" />
                    <span>{t.avatarMotion}</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">
                    {language === 'ar' ? 'حركة حية متفاعلة' : 'Live Motion'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {motionOptions.map((opt) => {
                    const isSelected = (config.motionStyle || 'waving') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateConfig({ motionStyle: opt.id })}
                        className={`p-3 rounded-2xl text-start transition-all cursor-pointer border flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 border-[#0B5D3B] dark:border-[#10B981] shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-[#202923] border-slate-200 dark:border-slate-700 hover:border-[#0B5D3B]/50'
                        }`}
                      >
                        <span className="text-2xl shrink-0 p-1 rounded-xl bg-white/80 dark:bg-black/20 shadow-2xs">
                          {opt.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isSelected ? 'text-[#0B5D3B] dark:text-[#DDF3E7]' : 'text-[#202923] dark:text-white'}`}>
                              {language === 'ar' ? opt.labelAr : opt.labelEn}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#0B5D3B] dark:bg-[#10B981] animate-ping" />
                            )}
                          </div>
                          <p className="text-[10px] text-[#778078] dark:text-slate-400 mt-0.5 line-clamp-1">
                            {language === 'ar' ? opt.descAr : opt.descEn}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* 4. FIXED BOTTOM SAVE ACTION BAR */}
        <div className="shrink-0 p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#18221C] z-30">
          <button
            onClick={() => {
              onSave(config);
              onClose();
            }}
            className="
              relative w-full h-12 rounded-2xl
              bg-gradient-to-b from-[#137A4F] via-[#0B5D3B] to-[#073D26]
              text-white font-bold text-sm flex items-center justify-center gap-2
              border border-[#34D399]/40
              shadow-[0_5px_0_0_#073D26,0_10px_20px_rgba(11,93,59,0.3)]
              active:translate-y-1 active:shadow-[0_1px_0_0_#073D26]
              transition-all cursor-pointer overflow-hidden
            "
          >
            {/* Top specular glossy highlight sheen */}
            <div className="absolute inset-x-2 top-0.5 h-[40%] rounded-xl bg-gradient-to-b from-white/70 via-white/15 to-transparent pointer-events-none" />
            <Check size={18} className="relative z-10" />
            <span className="relative z-10">{t.saveBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
