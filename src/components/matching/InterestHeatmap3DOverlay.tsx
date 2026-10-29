import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, MatchProfile, Language } from '../../types';
import { ONBOARDING_QUESTIONS } from '../../data/questions';
import { RealisticIcon } from '../common/RealisticIcon';
import { Sparkles, Flame, Zap, CheckCircle2, X, Eye, Layers } from 'lucide-react';

interface InterestHeatmap3DOverlayProps {
  userProfile: UserProfile;
  match: MatchProfile;
  language: Language;
  isOpen?: boolean;
  onClose?: () => void;
  inlineMode?: boolean;
}

interface HeatCellData {
  id: string;
  key: string;
  titleAr: string;
  titleEn: string;
  iconKey: string;
  userAnswer: string | string[];
  matchAnswer: string | string[];
  userLabel: string;
  matchLabel: string;
  isExact: boolean;
  isPartial: boolean;
  intensity: number; // 0 to 100
  heatColor: string;
  depthZ: number; // 3D elevation in px
}

export const InterestHeatmap3DOverlay: React.FC<InterestHeatmap3DOverlayProps> = ({
  userProfile,
  match,
  language,
  isOpen = true,
  onClose,
  inlineMode = false,
}) => {
  const componentId = useId();
  const [selectedCell, setSelectedCell] = useState<HeatCellData | null>(null);
  const [is3DTilted, setIs3DTilted] = useState(true);

  // Compatibility score governs the pulse tempo & global aura intensity
  const score = match.similarityScore || 85;
  const pulseSpeed = score >= 90 ? '1.3s' : score >= 75 ? '1.9s' : '2.6s';
  const isHighAffinity = score >= 80;

  // Compute Heatmap Matrix from Onboarding Dimensions
  const cells: HeatCellData[] = ONBOARDING_QUESTIONS.map((q) => {
    const userAns = userProfile.answers[q.id];
    const matchAns = match.answers[q.id];

    let isExact = false;
    let isPartial = false;

    if (Array.isArray(userAns) && Array.isArray(matchAns)) {
      const intersection = userAns.filter((a) => matchAns.includes(a));
      isExact = intersection.length === userAns.length && userAns.length === matchAns.length;
      isPartial = intersection.length > 0 && !isExact;
    } else {
      isExact = Boolean(userAns && matchAns && userAns === matchAns);
    }

    // Determine intensity and heat colors
    let intensity = 45;
    let heatColor = 'from-indigo-600/70 to-slate-800/80';
    let depthZ = 8;

    if (isExact) {
      intensity = 95 + Math.floor(Math.random() * 5); // 95 - 100%
      heatColor = 'from-[#10B981] via-[#059669] to-[#D4AF37]';
      depthZ = 24;
    } else if (isPartial) {
      intensity = 75 + Math.floor(Math.random() * 8); // 75 - 83%
      heatColor = 'from-[#F59E0B] via-[#D97706] to-[#10B981]';
      depthZ = 16;
    } else if (isHighAffinity && Math.random() > 0.4) {
      intensity = 60;
      heatColor = 'from-[#3B82F6] via-[#10B981] to-[#047857]';
      depthZ = 12;
    }

    // Extract human readable labels
    const getOptionLabel = (ans: string | string[] | undefined) => {
      if (!ans) return language === 'ar' ? 'غير محدد' : 'Not set';
      const single = Array.isArray(ans) ? ans[0] : ans;
      const opt = q.options.find((o) => o.id === single);
      return opt ? (language === 'ar' ? opt.labelAr : opt.labelEn) : single;
    };

    return {
      id: `${componentId}-${q.id}`,
      key: q.id,
      titleAr: q.titleAr,
      titleEn: q.titleEn,
      iconKey: q.options[0]?.iconKey || 'coffee',
      userAnswer: userAns,
      matchAnswer: matchAns,
      userLabel: getOptionLabel(userAns),
      matchLabel: getOptionLabel(matchAns),
      isExact,
      isPartial,
      intensity,
      heatColor,
      depthZ,
    };
  });

  // Calculate average intensity
  const avgIntensity = Math.round(cells.reduce((acc, c) => acc + c.intensity, 0) / cells.length);

  const content = (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#131F17] via-[#0D1510] to-[#060A08] border-2 border-[#10B981]/40 shadow-[0_16px_36px_rgba(0,0,0,0.7),0_0_24px_rgba(16,185,129,0.22)] p-4 text-white select-none">
      
      {/* Dynamic Pulsing Ambient Heat Aura (Speed tuned to compatibility score) */}
      <div
        className="absolute -inset-10 rounded-full pointer-events-none opacity-40 blur-3xl animate-pulse"
        style={{
          background: isHighAffinity
            ? 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(212,175,55,0.3) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(59,130,246,0.25) 50%, transparent 70%)',
          animationDuration: pulseSpeed,
        }}
      />

      {/* Top Controls & Header */}
      <div className="relative z-20 flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0B5D3B] to-[#10B981] flex items-center justify-center shadow-md shadow-[#10B981]/30">
            <Flame size={18} className="text-[#FBBF24] animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black tracking-wide text-white">
                {language === 'ar' ? 'خريطة الشغف الحرارية 3D' : '3D Interest Heatmap Overlay'}
              </h3>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                {score}%
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {language === 'ar'
                ? `نبض التوافق المشترك: ${avgIntensity}% كثافة حرارية`
                : `Compatibility Heat: ${avgIntensity}% active resonance`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* 3D Perspective Toggle Button */}
          <button
            type="button"
            onClick={() => setIs3DTilted(!is3DTilted)}
            className="px-2 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-white/10"
            title={language === 'ar' ? 'تبديل منظور 3D' : 'Toggle 3D Perspective'}
          >
            <Layers size={12} className={is3DTilted ? 'text-[#34D399]' : 'text-slate-400'} />
            <span>{is3DTilted ? '3D' : '2D'}</span>
          </button>

          {!inlineMode && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 
        3D PERSPECTIVE HEATMAP ARENA:
        Tactile matrix with 3D elevation extrusion, glowing borders and animated heat pulses
      */}
      <div className="relative z-10 py-4 px-1 flex flex-col items-center">
        
        {/* Heat Intensity Legend Bar */}
        <div className="w-full flex items-center justify-between text-[9px] font-bold text-slate-400 px-2 mb-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
            {language === 'ar' ? 'تطابق ناري (95-100%)' : 'Blazing Match'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
            {language === 'ar' ? 'تقارب دافئ (75%)' : 'Warm Affinity'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            {language === 'ar' ? 'تمايز ممتع' : 'Unique Diverse'}
          </span>
        </div>

        {/* The 3D Grid Container */}
        <div
          className="w-full transition-transform duration-500 ease-out py-2"
          style={{
            perspective: '900px',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="grid grid-cols-3 gap-2.5 sm:gap-3 transition-transform duration-500"
            style={{
              transform: is3DTilted ? 'rotateX(22deg) rotateZ(-3deg)' : 'none',
              transformStyle: 'preserve-3d',
            }}
          >
            {cells.map((cell) => {
              const isSelected = selectedCell?.id === cell.id;

              return (
                <motion.button
                  key={cell.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCell(isSelected ? null : cell)}
                  style={{
                    transform: `translateZ(${isSelected ? cell.depthZ + 14 : cell.depthZ}px)`,
                    transformStyle: 'preserve-3d',
                    animationDuration: pulseSpeed,
                  }}
                  className={`
                    relative group rounded-2xl p-2.5 flex flex-col items-center justify-between min-h-[82px] cursor-pointer text-center
                    transition-all duration-300
                    bg-gradient-to-br ${cell.heatColor}
                    border-2
                    ${
                      isSelected
                        ? 'border-white shadow-[0_0_20px_rgba(255,255,255,0.7)] scale-105 z-30'
                        : cell.isExact
                        ? 'border-[#34D399]/70 shadow-[0_4px_16px_rgba(16,185,129,0.4)]'
                        : cell.isPartial
                        ? 'border-[#FBBF24]/70 shadow-[0_4px_14px_rgba(245,158,11,0.35)]'
                        : 'border-white/15 shadow-[0_4px_10px_rgba(0,0,0,0.5)]'
                    }
                  `}
                >
                  {/* Dynamic Pulsing Glow Overlay */}
                  <div
                    className={`
                      absolute inset-0 rounded-2xl pointer-events-none transition-opacity
                      ${cell.isExact ? 'animate-pulse opacity-60' : 'opacity-25'}
                    `}
                    style={{
                      background: cell.isExact
                        ? 'radial-gradient(circle, rgba(52,211,153,0.8) 0%, transparent 75%)'
                        : 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 75%)',
                      animationDuration: pulseSpeed,
                    }}
                  />

                  {/* Top Specular Sheen */}
                  <div className="absolute inset-x-1.5 top-0.5 h-[35%] rounded-t-xl bg-gradient-to-b from-white/45 via-white/10 to-transparent pointer-events-none" />

                  {/* 3D Extrusion Side Shadow */}
                  <div
                    className="absolute inset-x-0 -bottom-2 h-2 rounded-b-2xl bg-black/50 pointer-events-none blur-[1px]"
                    style={{ transform: 'translateZ(-6px)' }}
                  />

                  {/* Icon & Status */}
                  <div className="relative z-10 w-7 h-7 rounded-xl bg-black/35 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-xs">
                    <RealisticIcon name={cell.iconKey} size={16} />
                  </div>

                  {/* Dimension Name */}
                  <span className="relative z-10 text-[9.5px] font-black text-white/95 truncate w-full mt-1">
                    {language === 'ar' ? cell.titleAr : cell.titleEn}
                  </span>

                  {/* Intensity Indicator Badge */}
                  <div className="relative z-10 flex items-center gap-0.5 mt-0.5">
                    {cell.isExact ? (
                      <span className="text-[8px] font-mono font-black text-[#DDF3E7] bg-black/40 px-1.5 py-0.2 rounded-md border border-[#34D399]/40">
                        {cell.intensity}% 🔥
                      </span>
                    ) : cell.isPartial ? (
                      <span className="text-[8px] font-mono font-black text-amber-200 bg-black/40 px-1.5 py-0.2 rounded-md border border-amber-400/40">
                        {cell.intensity}% ⚡
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono font-black text-slate-300 bg-black/40 px-1.5 py-0.2 rounded-md border border-white/10">
                        {cell.intensity}%
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* 
          INTERACTIVE INSPECTION DRAWER:
          Detailed Breakdown card appears when user selects any cell
        */}
        <AnimatePresence>
          {selectedCell && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#17271D] via-[#1A2E22] to-[#121E17] border border-[#10B981]/50 shadow-lg"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#34D399]">
                    {language === 'ar' ? selectedCell.titleAr : selectedCell.titleEn}
                  </span>
                  <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40">
                    {selectedCell.intensity}% {language === 'ar' ? 'حرارة التوافق' : 'Heat'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCell(null)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] mt-2">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] font-bold text-slate-400 block mb-0.5">
                    {language === 'ar' ? 'أنت:' : 'You:'}
                  </span>
                  <span className="font-black text-white">{selectedCell.userLabel}</span>
                </div>

                <div className="p-2 rounded-xl bg-[#E8E1D2]/15 border border-[#BEB19A]/30">
                  <span className="text-[9px] font-bold text-[#E2BD56] block mb-0.5">
                    @{match.username}:
                  </span>
                  <span className="font-black text-slate-100">{selectedCell.matchLabel}</span>
                </div>
              </div>

              <div className="mt-2 text-[9.5px] font-bold flex items-center justify-between text-slate-300">
                <span>
                  {selectedCell.isExact
                    ? (language === 'ar' ? '★ تطابق تام يولد شغفاً وتفاهماً عفوياً' : '★ 100% Identical taste in this vibe')
                    : (language === 'ar' ? '⚡ تمايز جميل يفتح أحاديث وتجارب جديدة' : '⚡ Complimentary contrast to enrich chats')}
                </span>
                <span className="text-[#FBBF24] font-mono">
                  {selectedCell.isExact ? '+15 pts' : '+8 pts'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info strip */}
      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-[#D4AF37]" />
          <span>
            {language === 'ar'
              ? 'اضغط على أي مكعب ثلاثي الأبعاد لفحص تفاصيل التوافق'
              : 'Tap any 3D voxel to inspect shared affinity'}
          </span>
        </span>
        <span className="font-mono text-[9px] text-[#34D399]">
          {pulseSpeed} {language === 'ar' ? 'نبضة' : 'pulse'}
        </span>
      </div>
    </div>
  );

  if (inlineMode) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm">
        {content}
      </div>
    </div>
  );
};
