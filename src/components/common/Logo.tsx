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
    <Link href="/" className={`inline-flex items-center group shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}>
      <img
        src="/update_logo.png"
        alt="TEX WEAR Life Style"
        className="h-10 sm:h-12 md:h-14 w-auto object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/update_logo.png';
        }}
      />
    </Link>
  );
};
