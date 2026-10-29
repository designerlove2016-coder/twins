import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { UserProfile, MatchProfile, Language } from '../../types';
import { ONBOARDING_QUESTIONS } from '../../data/questions';
import { Sparkles, Layers, Eye, RefreshCw } from 'lucide-react';

interface PersonalityVibePolarChartProps {
  userProfile: UserProfile;
  match: MatchProfile;
  language: Language;
}

interface PolarDimension {
  key: string;
  labelAr: string;
  labelEn: string;
  userScore: number;
  matchScore: number;
  userChoiceLabel: string;
  matchChoiceLabel: string;
  isExact: boolean;
  icon: string;
}

export const PersonalityVibePolarChart: React.FC<PersonalityVibePolarChartProps> = ({
  userProfile,
  match,
  language,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeDimension, setActiveDimension] = useState<PolarDimension | null>(null);
  const [filterMode, setFilterMode] = useState<'both' | 'user' | 'match'>('both');
  const [animationProgress, setAnimationProgress] = useState(0);

  // Helper to extract option label safely
  const getLabel = (questionId: string, answerVal: string | string[] | undefined): string => {
    if (!answerVal) return language === 'ar' ? 'غير محدد' : 'Not set';
    const q = ONBOARDING_QUESTIONS.find((item) => item.id === questionId);
    if (!q) return String(answerVal);

    if (Array.isArray(answerVal)) {
      return answerVal
        .map((val) => {
          const opt = q.options.find((o) => o.id === val);
          return opt ? (language === 'ar' ? opt.labelAr : opt.labelEn) : val;
        })
        .join(', ');
    }

    const opt = q.options.find((o) => o.id === answerVal);
    return opt ? (language === 'ar' ? opt.labelAr : opt.labelEn) : String(answerVal);
  };

  // Derive the 6 polar dimensions
  const dimensions: PolarDimension[] = [
    {
      key: 'vibe',
      labelAr: 'الطاقة والمزاج',
      labelEn: 'Energy & Vibe',
      icon: '⚡',
      userScore: userProfile.answers['q_vibe'] === match.answers['q_vibe'] ? 95 : 75,
      matchScore: userProfile.answers['q_vibe'] === match.answers['q_vibe'] ? 95 : 82,
      userChoiceLabel: getLabel('q_vibe', userProfile.answers['q_vibe']),
      matchChoiceLabel: getLabel('q_vibe', match.answers['q_vibe']),
      isExact: userProfile.answers['q_vibe'] === match.answers['q_vibe'],
    },
    {
      key: 'coffee',
      labelAr: 'طقس القهوة',
      labelEn: 'Coffee Ritual',
      icon: '☕',
      userScore: userProfile.answers['q_coffee'] === match.answers['q_coffee'] ? 98 : 70,
      matchScore: userProfile.answers['q_coffee'] === match.answers['q_coffee'] ? 98 : 78,
      userChoiceLabel: getLabel('q_coffee', userProfile.answers['q_coffee']),
      matchChoiceLabel: getLabel('q_coffee', match.answers['q_coffee']),
      isExact: userProfile.answers['q_coffee'] === match.answers['q_coffee'],
    },
    {
      key: 'food',
      labelAr: 'الذوق الغذائي',
      labelEn: 'Comfort Dining',
      icon: '🍽️',
      userScore: userProfile.answers['q_food'] === match.answers['q_food'] ? 94 : 68,
      matchScore: userProfile.answers['q_food'] === match.answers['q_food'] ? 94 : 76,
      userChoiceLabel: getLabel('q_food', userProfile.answers['q_food']),
      matchChoiceLabel: getLabel('q_food', match.answers['q_food']),
      isExact: userProfile.answers['q_food'] === match.answers['q_food'],
    },
    {
      key: 'sports',
      labelAr: 'الرياضة والحركة',
      labelEn: 'Active Pursuits',
      icon: '🎾',
      userScore: 90,
      matchScore: 88,
      userChoiceLabel: getLabel('q_sports', userProfile.answers['q_sports']),
      matchChoiceLabel: getLabel('q_sports', match.answers['q_sports']),
      isExact: Array.isArray(userProfile.answers['q_sports']) &&
        Array.isArray(match.answers['q_sports']) &&
        userProfile.answers['q_sports'].some((s) => (match.answers['q_sports'] as string[]).includes(s)),
    },
    {
      key: 'cars',
      labelAr: 'فلسفة القيادة',
      labelEn: 'Driving Vibe',
      icon: '🚗',
      userScore: userProfile.answers['q_cars'] === match.answers['q_cars'] ? 92 : 65,
      matchScore: userProfile.answers['q_cars'] === match.answers['q_cars'] ? 92 : 72,
      userChoiceLabel: getLabel('q_cars', userProfile.answers['q_cars']),
      matchChoiceLabel: getLabel('q_cars', match.answers['q_cars']),
      isExact: userProfile.answers['q_cars'] === match.answers['q_cars'],
    },
    {
      key: 'leisure',
      labelAr: 'أجواء الويكند',
      labelEn: 'Weekend Leisure',
      icon: '🌴',
      userScore: userProfile.answers['q_leisure'] === match.answers['q_leisure'] ? 96 : 74,
      matchScore: userProfile.answers['q_leisure'] === match.answers['q_leisure'] ? 96 : 80,
      userChoiceLabel: getLabel('q_leisure', userProfile.answers['q_leisure']),
      matchChoiceLabel: getLabel('q_leisure', match.answers['q_leisure']),
      isExact: userProfile.answers['q_leisure'] === match.answers['q_leisure'],
    },
  ];

  // Animate chart entry smoothly
  useEffect(() => {
    let frameId: number;
    let start: number | null = null;
    const duration = 850;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [match.id]);

  // D3 Polar Chart Render
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // clean slate

    const width = 320;
    const height = 300;
    const margin = 34;
    const radius = Math.min(width, height) / 2 - margin;

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Radius scale (0 to 100%)
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    const numAxes = dimensions.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    // 1. Concentric Guide Circles & Labels (20%, 40%, 60%, 80%, 100%)
    const levels = [25, 50, 75, 100];
    levels.forEach((level) => {
      const r = rScale(level);

      // Circle ring
      g.append('circle')
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', level === 100 ? 'rgba(11, 93, 59, 0.35)' : 'rgba(148, 163, 184, 0.25)')
        .attr('stroke-width', level === 100 ? 1.5 : 1)
        .attr('stroke-dasharray', level === 100 ? 'none' : '3 3');

      // Subtle level indicator
      g.append('text')
        .attr('x', 4)
        .attr('y', -r + 10)
        .attr('fill', '#94a3b8')
        .attr('font-size', '8px')
        .attr('font-weight', 'bold')
        .text(`${level}%`);
    });

    // 2. Radial Spoke Axes
    dimensions.forEach((dim, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = rScale(100) * Math.cos(angle);
      const y = rScale(100) * Math.sin(angle);

      // Axis Line
      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'rgba(148, 163, 184, 0.3)')
        .attr('stroke-width', 1.2);

      // Axis Label Endpoint (Icon & short title)
      const labelX = (rScale(100) + 18) * Math.cos(angle);
      const labelY = (rScale(100) + 18) * Math.sin(angle);

      const labelGroup = g
        .append('g')
        .attr('transform', `translate(${labelX}, ${labelY})`)
        .attr('class', 'cursor-pointer select-none')
        .on('click', () => {
          setActiveDimension(dim);
        });

      labelGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '13px')
        .text(dim.icon);

      labelGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 14)
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('fill', dim.isExact ? '#0B5D3B' : '#778078')
        .attr('class', 'dark:fill-slate-300')
        .text(language === 'ar' ? dim.labelAr.split(' ')[0] : dim.labelEn.split(' ')[0]);
    });

    // Generator function for polar polygons
    const getCoordinates = (scores: number[]) => {
      return scores.map((score, i) => {
        const scaledScore = score * animationProgress;
        const angle = i * angleSlice - Math.PI / 2;
        return [
          rScale(scaledScore) * Math.cos(angle),
          rScale(scaledScore) * Math.sin(angle),
        ] as [number, number];
      });
    };

    // 3. User Polygon (Emerald Green)
    if (filterMode === 'both' || filterMode === 'user') {
      const userCoords = getCoordinates(dimensions.map((d) => d.userScore));
      const lineGenerator = d3.line().curve(d3.curveLinearClosed);
      const userPathData = lineGenerator(userCoords) || '';

      // Shaded Area
      g.append('path')
        .attr('d', userPathData)
        .attr('fill', '#10B981')
        .attr('fill-opacity', 0.28)
        .attr('stroke', '#0B5D3B')
        .attr('stroke-width', 2.2)
        .attr('class', 'dark:stroke-[#10B981] transition-all duration-300 filter drop-shadow-xs');

      // Vertices circles
      userCoords.forEach(([cx, cy], i) => {
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 4.5)
          .attr('fill', '#0B5D3B')
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 1.8)
          .attr('class', 'cursor-pointer hover:scale-125 transition-transform')
          .on('click', () => setActiveDimension(dimensions[i]))
          .append('title')
          .text(`${language === 'ar' ? dimensions[i].labelAr : dimensions[i].labelEn}: ${dimensions[i].userScore}%`);
      });
    }

    // 4. Match Polygon (Warm Gold / Amber)
    if (filterMode === 'both' || filterMode === 'match') {
      const matchCoords = getCoordinates(dimensions.map((d) => d.matchScore));
      const lineGenerator = d3.line().curve(d3.curveLinearClosed);
      const matchPathData = lineGenerator(matchCoords) || '';

      // Shaded Area
      g.append('path')
        .attr('d', matchPathData)
        .attr('fill', '#D4AF37')
        .attr('fill-opacity', 0.28)
        .attr('stroke', '#D4AF37')
        .attr('stroke-width', 2.2)
        .attr('stroke-dasharray', '4 2')
        .attr('class', 'transition-all duration-300 filter drop-shadow-xs');

      // Vertices circles
      matchCoords.forEach(([cx, cy], i) => {
        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 4.5)
          .attr('fill', '#D4AF37')
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 1.8)
          .attr('class', 'cursor-pointer hover:scale-125 transition-transform')
          .on('click', () => setActiveDimension(dimensions[i]))
          .append('title')
          .text(`@${match.username}: ${dimensions[i].matchScore}%`);
      });
    }

    // Central core pulse
    g.append('circle')
      .attr('r', 3)
      .attr('fill', '#0B5D3B')
      .attr('class', 'animate-ping opacity-60');
  }, [dimensions, animationProgress, filterMode, language, match]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-[#FAF9F5] to-[#EAE6DC] dark:from-[#1D2B22] dark:via-[#141F18] dark:to-[#0D1510] border-2 border-white/95 dark:border-[#10B981]/40 shadow-[0_8px_20px_rgba(11,93,59,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)] p-4 select-none my-1">
      {/* Top specular glossy highlight sheen */}
      <div className="absolute inset-x-3 top-0.5 h-[35%] rounded-t-2xl bg-gradient-to-b from-white/90 via-white/20 to-transparent pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between mb-1 relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-[#DDF3E7] dark:bg-[#0B5D3B]/40 flex items-center justify-center text-[#0B5D3B] dark:text-[#DDF3E7] shadow-xs">
            <Layers size={15} />
          </div>
          <div>
            <h3 className="text-xs font-black text-[#202923] dark:text-white uppercase tracking-wider">
              {language === 'ar' ? 'تداخل أبعاد وطاقة الشخصية (D3 Polar Chart)' : 'Personality Vibe Overlap (D3 Polar Chart)'}
            </h3>
            <span className="text-[10px] text-[#778078] dark:text-slate-400 block leading-none">
              {language === 'ar' ? 'مخطط قطبي تفاعلي يوضح تلاقي الأذواق' : 'Interactive polar radar showing dimensional chemistry'}
            </span>
          </div>
        </div>

        {/* Legend Filter Toggle */}
        <div className="flex items-center gap-1 bg-white/80 dark:bg-black/30 p-1 rounded-xl border border-slate-200/70 dark:border-white/10 text-[9px] font-bold">
          <button
            type="button"
            onClick={() => setFilterMode('both')}
            className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
              filterMode === 'both' ? 'bg-[#0B5D3B] text-white shadow-2xs' : 'text-[#778078]'
            }`}
          >
            {language === 'ar' ? 'الكل' : 'Both'}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('user')}
            className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
              filterMode === 'user' ? 'bg-[#0B5D3B] text-white shadow-2xs' : 'text-[#778078]'
            }`}
          >
            {language === 'ar' ? 'أنت' : 'You'}
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('match')}
            className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
              filterMode === 'match' ? 'bg-[#D4AF37] text-white shadow-2xs' : 'text-[#778078]'
            }`}
          >
            @{match.username.slice(0, 5)}
          </button>
        </div>
      </div>

      {/* D3 Polar SVG Container */}
      <div className="relative flex items-center justify-center py-1">
        <svg
          ref={svgRef}
          width={320}
          height={300}
          className="overflow-visible max-w-full drop-shadow-sm"
        />
      </div>

      {/* Dimension Detail Card on Selection or Tap */}
      {activeDimension && (
        <div className="mt-2 p-3 rounded-2xl bg-white/90 dark:bg-[#152019] border border-[#0B5D3B]/25 shadow-sm animate-fade-in relative z-10">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{activeDimension.icon}</span>
              <span className="text-xs font-black text-[#0B5D3B] dark:text-[#10B981]">
                {language === 'ar' ? activeDimension.labelAr : activeDimension.labelEn}
              </span>
            </div>

            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                activeDimension.isExact
                  ? 'bg-[#E8F7EE] dark:bg-[#0B5D3B]/40 text-[#0B5D3B] dark:text-[#34D399] border border-[#0B5D3B]/30'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/40'
              }`}
            >
              {activeDimension.isExact
                ? (language === 'ar' ? '★ تطابق كامل' : '★ Perfect Match')
                : (language === 'ar' ? '⚡ ذوق مميز لكل منكما' : '⚡ Unique Taste')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-[#F8F7F2] dark:bg-[#101712] border border-slate-200/60 dark:border-slate-800">
              <span className="text-[9px] font-bold text-[#778078] block">
                {language === 'ar' ? 'اختيارك أنت' : 'Your Choice'}:
              </span>
              <span className="font-bold text-[#0B5D3B] dark:text-[#E8F7EE] truncate block">
                {activeDimension.userChoiceLabel}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-[#F8F7F2] dark:bg-[#101712] border border-slate-200/60 dark:border-slate-800">
              <span className="text-[9px] font-bold text-[#778078] block">
                @{match.username}:
              </span>
              <span className="font-bold text-[#D4AF37] truncate block">
                {activeDimension.matchChoiceLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-[#778078] dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0B5D3B] dark:bg-[#10B981] inline-block" />
            <span>{language === 'ar' ? 'أنت (أخضر زمردي)' : 'You (Emerald)'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] inline-block" />
            <span>@{match.username} ({language === 'ar' ? 'ذهبي' : 'Gold'})</span>
          </span>
        </div>

        <span className="text-[9px] text-[#0B5D3B] dark:text-[#10B981] font-black">
          {match.similarityScore}% {language === 'ar' ? 'تناغم كلي' : 'Overall Harmony'}
        </span>
      </div>
    </div>
  );
};
