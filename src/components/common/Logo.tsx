import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
}) => {
  return (
    <Link href="/" className={`inline-flex items-center group shrink-0 ${className}`}>
      {/* Premium Dark Slate Background for Silver/White Metallic Logo */}
      <div className="flex items-center justify-center bg-[#0F172A] hover:bg-[#1E293B] px-3 py-1.5 rounded-xl shadow-md border border-slate-700/60 transition-all duration-300 group-hover:scale-105">
        <img
          src="/updated_logo_textware.png"
          alt="TEX WEAR Life Style"
          className="h-7 sm:h-8 md:h-9 w-auto object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/updated_logo_textware.png';
          }}
        />
      </div>
    </Link>
  );
};
