import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  showTagline = false,
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic interlocking Twin emblem */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-[#0B5D3B] text-white shadow-md shadow-[#0B5D3B]/20 ${
          isSm ? 'w-8 h-8' : isLg ? 'w-12 h-12' : 'w-10 h-10'
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className={isSm ? 'w-5 h-5' : isLg ? 'w-7 h-7' : 'w-6 h-6'}
        >
          {/* Twin overlapping mirrored infinity nodes */}
          <circle cx="12" cy="16" r="6" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="20" cy="16" r="6" stroke="#D4AF37" strokeWidth="2.5" strokeDasharray="18 10" />
          <circle cx="16" cy="16" r="2" fill="#DDF3E7" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-black tracking-tight text-[#0B5D3B] dark:text-[#DDF3E7] font-sans ${
            isSm ? 'text-lg leading-none' : isLg ? 'text-2xl leading-tight' : 'text-xl leading-none'
          }`}
        >
          TWIN
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium text-[#778078] tracking-tight">
            Personality Match
          </span>
        )}
      </div>
    </div>
  );
};
