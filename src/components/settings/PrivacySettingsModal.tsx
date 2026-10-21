import React, { useState } from 'react';
import { PrivacySettings, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { X, ShieldCheck, Lock, Check } from 'lucide-react';

interface PrivacySettingsModalProps {
  privacy: PrivacySettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPrivacy: PrivacySettings) => void;
  language: Language;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  privacy,
  isOpen,
  onClose,
  onSave,
  language,
}) => {
  const t = TRANSLATIONS[language];
  const [settings, setSettings] = useState<PrivacySettings>({ ...privacy });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#18221C] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-[#0B5D3B]" />
            <h2 className="text-base font-bold text-[#202923] dark:text-white">
              {t.privacyTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Security Guarantee Box */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/20 border border-[#0B5D3B]/20">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7] uppercase tracking-wide">
            <ShieldCheck size={16} />
            <span>{t.guaranteeTitle}</span>
          </div>
          <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {t.guaranteeText}
          </p>
        </div>

        {/* Visibility Toggles */}
        <div className="space-y-4 my-5">
          {/* Show City */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#202923] dark:text-white block">
                {t.showCityToggle}
              </span>
              <span className="text-[11px] text-[#778078]">
                {language === 'ar' ? 'يظهر اسم المدينة فقط بدون عنوان دقيق' : 'Shows general city only'}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, showCityPublicly: !settings.showCityPublicly })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.showCityPublicly ? 'bg-[#0B5D3B]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.showCityPublicly ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Show Gender */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#202923] dark:text-white block">
                {t.showGenderToggle}
              </span>
              <span className="text-[11px] text-[#778078]">
                {language === 'ar' ? 'إظهار التحديد على بطاقتك الشخصية' : 'Shown on public match card'}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, showGenderPublicly: !settings.showGenderPublicly })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.showGenderPublicly ? 'bg-[#0B5D3B]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.showGenderPublicly ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Show Age Range */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#202923] dark:text-white block">
                {t.showAgeToggle}
              </span>
              <span className="text-[11px] text-[#778078]">
                {language === 'ar' ? 'فئة عمرية عامة (مثلاً 24-29)' : 'Broad range bracket'}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, showAgeRangePublicly: !settings.showAgeRangePublicly })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.showAgeRangePublicly ? 'bg-[#0B5D3B]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.showAgeRangePublicly ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Allow Discoverability */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#202923] dark:text-white block">
                {t.discoverableToggle}
              </span>
              <span className="text-[11px] text-[#778078]">
                {language === 'ar' ? 'الظهور في نتائج البحث عند توافق التفضيلات' : 'Allow others to find your profile'}
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setSettings({ ...settings, allowDiscoverability: !settings.allowDiscoverability })
              }
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.allowDiscoverability ? 'bg-[#0B5D3B]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.allowDiscoverability ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            onSave(settings);
            onClose();
          }}
          className="w-full h-12 rounded-2xl bg-[#0B5D3B] hover:bg-[#08422A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0B5D3B]/20 active:scale-[0.98] transition-all"
        >
          <Check size={18} />
          <span>{t.saveBtn}</span>
        </button>
      </div>
    </div>
  );
};
