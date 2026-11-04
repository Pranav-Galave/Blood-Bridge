import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Connected Blood Drop & Bridge Network Logo SVG */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-rose-900 text-white shadow-sm ring-1 ring-red-500/20`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          {/* Stylized Blood Drop */}
          <path
            d="M24 6C24 6 11 21.5 11 30.5C11 37.4036 16.8203 43 24 43C31.1797 43 37 37.4036 37 30.5C37 21.5 24 6 24 6Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
          {/* Bridge / Interconnected Network Nodes */}
          <path
            d="M17 33C19.5 30 22 29 24 29C26 29 28.5 30 31 33"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M15 25C18 22 21 21 24 21C27 21 30 22 33 25"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <circle cx="24" cy="15" r="2.5" fill="white" />
          <circle cx="17" cy="33" r="2" fill="white" />
          <circle cx="31" cy="33" r="2" fill="white" />
          <circle cx="24" cy="29" r="2" fill="white" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`text-slate-900 ${textSizes[size]}`}>
            Blood<span className="text-red-600">Bridge</span>
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
            Smart Blood Network
          </span>
        )}
      </div>
    </div>
  );
};
