import React from 'react';

interface LogoProps {
  variant?: 'default' | 'glow';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'default', size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size]} relative flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${variant === 'glow' ? 'drop-shadow-[0_0_15px_rgba(0,245,160,0.5)]' : ''}`}
        >
          {/* Shield Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="white"
            strokeWidth="2"
            fill="none"
            opacity="0.9"
          />

          {/* Vertical Stability Line */}
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="85"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Inner Shield Shape */}
          <path
            d="M50 25 L65 35 L65 55 L50 70 L35 55 L35 35 Z"
            stroke="white"
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
        </svg>

        {variant === 'glow' && (
          <div className="absolute inset-0 bg-aegis-green/20 rounded-full blur-xl"></div>
        )}
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-serif font-bold text-white tracking-wider ${textSizes[size]}`}>
          AEGIS
        </span>
        <span className={`font-sans text-white/60 uppercase tracking-widest ${size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : 'text-xs'}`}>
          BANK
        </span>
      </div>
    </div>
  );
};
