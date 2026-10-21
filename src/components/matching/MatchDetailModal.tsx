import React from 'react';
import { MatchProfile, Language } from '../../types';
import { TRANSLATIONS } from '../../i18n/translations';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import {
  X,
  Layers,
  MapPin,
  Bookmark,
  Share2,
  HandMetal,
  CheckCircle2,
} from 'lucide-react';

interface MatchDetailModalProps {
  match: MatchProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onCompare: (match: MatchProfile) => void;
  language: Language;
  isSaved?: boolean;
  onToggleSave?: (matchId: string) => void;
  onSendWave?: (match: MatchProfile) => void;
  onShareProfile?: (match: MatchProfile) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  isOpen,
  onClose,
  onCompare,
  language,
  isSaved = false,
  onToggleSave,
  onSendWave,
  onShareProfile,
}) => {
  const t = TRANSLATIONS[language];
  if (!isOpen || !match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#18221C] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        
        {/* Top Control Bar: Bookmark, Share & Close */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(match.id)}
                className={`
                  min-h-[38px] px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold border transition-all cursor-pointer
                  ${
                    isSaved
                      ? 'bg-[#FFF9E6] dark:bg-[#2F2612] text-[#D4AF37] border-[#D4AF37]/50 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:border-slate-300'
                  }
                `}
                title={isSaved ? t.unsaveProfile : t.saveProfile}
              >
                <Bookmark size={15} className={isSaved ? 'fill-[#D4AF37]' : ''} />
                <span>{isSaved ? t.savedProfile : t.saveProfile}</span>
              </button>
            )}

            {onShareProfile && (
              <button
                type="button"
                onClick={() => onShareProfile(match)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                title={t.shareProfile}
                aria-label={t.shareProfile}
              >
                <Share2 size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Avatar Stage */}
        <div className="flex flex-col items-center text-center pt-2">
          <AvatarRenderer avatar={match.avatar} size={92} direction="center" />
          <h3 className="mt-3 text-lg font-bold text-[#202923] dark:text-white">
            @{match.username}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#778078] dark:text-slate-400 mt-1">
            <MapPin size={13} className="text-[#0B5D3B]" />
            <span>{match.city}</span>
            {match.ageRange && (
              <>
                <span>·</span>
                <span>{match.ageRange}</span>
              </>
            )}
          </div>
        </div>

        {/* Similarity Score Pill */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#DDF3E7] dark:bg-[#0B5D3B]/20 border border-[#0B5D3B]/20 flex items-center justify-between">
          <span className="text-xs font-bold text-[#0B5D3B] dark:text-[#DDF3E7] uppercase tracking-wide">
            {t.similarityMatch}
          </span>
          <span className="text-2xl font-extrabold text-[#0B5D3B] dark:text-[#10b981] font-mono tabular-nums">
            {match.similarityScore}%
          </span>
        </div>

        {/* Bio */}
        <div className="mb-3">
          <span className="text-[11px] font-bold text-[#778078] uppercase tracking-wider block mb-1">
            {language === 'ar' ? 'نبذة الشخصية' : 'Personality Bio'}
          </span>
          <p className="text-xs text-[#202923] dark:text-slate-300 leading-relaxed italic">
            "{match.bio}"
          </p>
        </div>

        {/* Shared Tastes */}
        <div className="mb-5">
          <span className="text-[11px] font-bold text-[#778078] uppercase tracking-wider block mb-2">
            {t.sharedPassions}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {match.sharedInterests.map((item, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-[#F8F7F2] dark:bg-[#111813] text-[#202923] dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Two Action Buttons: Say Hi & Compare */}
        <div className="grid grid-cols-3 gap-2">
          {onSendWave && (
            <button
              type="button"
              onClick={() => onSendWave(match)}
              className="col-span-1 h-12 rounded-2xl bg-white dark:bg-[#202923] border border-[#0B5D3B]/40 text-[#0B5D3B] dark:text-[#DDF3E7] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#DDF3E7]/40 active:scale-95 transition-all cursor-pointer"
            >
              <HandMetal size={16} className="text-[#D4AF37]" />
              <span>{t.sayHi}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onClose();
              onCompare(match);
            }}
            className={`${onSendWave ? 'col-span-2' : 'col-span-3'} h-12 rounded-2xl bg-[#0B5D3B] hover:bg-[#08422A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0B5D3B]/20 active:scale-[0.98] transition-all cursor-pointer`}
          >
            <Layers size={18} />
            <span>{t.comparePersonalities}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
