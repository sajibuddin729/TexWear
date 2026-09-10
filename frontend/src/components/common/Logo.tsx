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
      {/* Container with Yellow Background */}
      <div className="flex items-center justify-center bg-black hover:bg-white px-2.5 py-1 rounded-xl shadow-md border border-white-200 transition-all duration-300 group-hover:scale-105">
        <img
          src="/logo1.png"
          alt="TEX WEAR Life Style"
          className="h-8 sm:h-9 w-auto object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo1.png';
          }}
        />
      </div>
    </Link>
  );
};
