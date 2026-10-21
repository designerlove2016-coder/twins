import React, { useState } from 'react';
import { AvatarConfig, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { AvatarRenderer } from './AvatarRenderer';
import { X, Check, Sparkles, Dices, Eye } from 'lucide-react';

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
  const [config, setConfig] = useState<AvatarConfig>({ ...avatar });
  const [popKey, setPopKey] = useState(0);

  if (!isOpen) return null;

  const triggerPop = () => {
    setPopKey((k) => k + 1);
  };

  const updateConfig = (patch: Partial<AvatarConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
    triggerPop();
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

  // Randomize a completely unique identity
  const handleRandomize = () => {
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)];
    const randomHair = hairOptions[Math.floor(Math.random() * hairOptions.length)].id;
    const randomCloth = clothingOptions[Math.floor(Math.random() * clothingOptions.length)].id;
    const randomColor = CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)];
    const randomAcc = accessoryOptions[Math.floor(Math.random() * accessoryOptions.length)].id;
    const randomExp = expressionOptions[Math.floor(Math.random() * expressionOptions.length)].id;
    const randomMotion = motionOptions[Math.floor(Math.random() * motionOptions.length)].id;

    setConfig({
      ...config,
      skinTone: randomSkin,
      hairStyle: randomHair,
      clothingStyle: randomCloth,
      clothingColor: randomColor,
      accessory: randomAcc,
      expression: randomExp,
      motionStyle: randomMotion,
    });
    triggerPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* 
        Fixed viewport frame:
        The avatar preview at the top stays strictly PINNED/FIXED (ثابتة),
        while only the options ribbon/strip scrolls below it (الشريط يمشي).
      */}
      <div className="relative w-full max-w-md h-[92vh] max-h-[820px] bg-white dark:bg-[#18221C] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* 1. FIXED TOP MODAL HEADER */}
        <header className="shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#18221C] z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/30 flex items-center justify-center text-[#0B5D3B] dark:text-[#DDF3E7]">
              <Sparkles size={16} className="text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#202923] dark:text-[#F8F7F2]">
                {t.customizeAvatar}
              </h2>
              <span className="text-[10px] text-[#778078] dark:text-slate-400 block leading-tight">
                {language === 'ar' ? 'صورة ثابتة وتحديث مباشر لمظهرك' : 'Static pinned showcase with live reactive updates'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        {/* 2. STRICTLY PINNED / FIXED AVATAR SHOWCASE (الصورة ثابتة لا تتحرك أثناء تمرير الخيارات) */}
        <div className="shrink-0 sticky top-0 z-20 px-4 py-3 bg-gradient-to-b from-[#F8F7F2] via-[#EEF9F3]/90 to-[#F8F7F2] dark:from-[#111813] dark:via-[#151D18] dark:to-[#111813] border-b border-[#0B5D3B]/20 shadow-xs flex flex-col items-center justify-center">
          
          <div className="w-full flex items-center justify-between px-2">
            
            {/* Quick Face Direction Switcher (Facing Left, Center, Facing Right) */}
            <div className="flex items-center gap-1 bg-white/80 dark:bg-[#18221C]/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
              <button
                type="button"
                onClick={() => updateConfig({ direction: 'right' })}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  config.direction === 'right'
                    ? 'bg-[#0B5D3B] text-white'
                    : 'text-[#778078] hover:text-[#202923] dark:hover:text-white'
                }`}
                title="Face Twin"
              >
                {language === 'ar' ? 'يمين ➔' : 'Right ➔'}
              </button>
              <button
                type="button"
                onClick={() => updateConfig({ direction: 'center' })}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  config.direction === 'center'
                    ? 'bg-[#0B5D3B] text-white'
                    : 'text-[#778078] hover:text-[#202923] dark:hover:text-white'
                }`}
              >
                {language === 'ar' ? 'أمام' : 'Front'}
              </button>
              <button
                type="button"
                onClick={() => updateConfig({ direction: 'left' })}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  config.direction === 'left'
                    ? 'bg-[#0B5D3B] text-white'
                    : 'text-[#778078] hover:text-[#202923] dark:hover:text-white'
                }`}
              >
                {language === 'ar' ? '🠔 يسار' : '🠔 Left'}
              </button>
            </div>

            {/* Main Interactive Avatar Icon (Pop Animation on edit) */}
            <div className="relative my-0.5">
              <div className="absolute -inset-2 rounded-full bg-[#D4AF37]/20 blur-md pointer-events-none animate-pulse" />
              <div key={popKey} className="animate-avatar-pop relative">
                <AvatarRenderer
                  avatar={config}
                  size={92}
                  direction={config.direction || 'center'}
                />
              </div>
            </div>

            {/* Randomize Unique Combination Button */}
            <button
              type="button"
              onClick={handleRandomize}
              className="px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-[#18221C]/90 hover:bg-[#DDF3E7] dark:hover:bg-[#0B5D3B]/30 border border-[#0B5D3B]/25 text-[#0B5D3B] dark:text-[#DDF3E7] text-[10px] font-bold flex flex-col items-center gap-0.5 shadow-2xs active:scale-95 transition-all cursor-pointer"
              title="Generate Unique Look"
            >
              <Dices size={16} className="text-[#D4AF37]" />
              <span>{language === 'ar' ? 'مظهر فريد' : 'Randomize'}</span>
            </button>

          </div>

          {/* Dynamic Status Pill */}
          <div className="mt-2 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white dark:bg-[#18221C] border border-[#0B5D3B]/20 text-[10px] font-bold text-[#0B5D3B] dark:text-[#DDF3E7] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#0B5D3B] animate-ping shrink-0" />
            <span>{t.uniqueLookBadge}</span>
          </div>
        </div>

        {/* 3. INDEPENDENTLY SCROLLING OPTIONS STRIP ("الشريط يمشي بحرية بينما الأفاتار ثابت بالأعلى") */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-5 no-scrollbar">
          
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

          {/* Motion & Interactive Animation Selector (يلوح، يبتسم، يقفز، يهز رأسه...) */}
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

        {/* 4. FIXED BOTTOM SAVE ACTION BAR */}
        <div className="shrink-0 p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#18221C] z-30">
          <button
            onClick={() => {
              onSave(config);
              onClose();
            }}
            className="w-full h-12 rounded-2xl bg-[#0B5D3B] hover:bg-[#08422A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0B5D3B]/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Check size={18} />
            <span>{t.saveBtn}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
