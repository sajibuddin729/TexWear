import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  imageClassName?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  imageClassName = '',
}) => {
  return (
    <Link href="/" className={`inline-flex items-center group shrink-0 max-w-full transition-transform duration-300 hover:scale-105 ${className}`}>
      <img
        src="/final_logo6.png"
        alt="TEX WEAR Life Style"
        className={`h-[25px] min-[390px]:h-[27px] sm:h-12 md:h-14 w-auto max-w-full object-contain ${imageClassName}`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/final_logo6.png';
        }}
      />
    </Link>
  );
};
