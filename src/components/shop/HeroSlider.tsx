'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Truck } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { banners } = useShop();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-50 border-b border-slate-200 group">
      {/* Background Ambient Blur with Crossfade Transition */}
      {banners.map((banner, idx) => (
        <div
          key={`ambient-${banner.id || idx}`}
          className={`absolute inset-0 z-0 overflow-hidden transition-all duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-15 scale-125' : 'opacity-0 scale-135 pointer-events-none'
          }`}
        >
          <img
            src={banner.image}
            alt="Ambient Background"
            className="w-full h-full object-cover filter blur-3xl"
          />
          <div className="absolute inset-0 bg-white/60" />
        </div>
      ))}

      {/* Main Grid Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 min-h-[520px] lg:min-h-[580px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Column: Typography & CTAs with Smooth Slow Text Reveal */}
          <div key={`hero-text-${currentIndex}`} className="lg:col-span-7 space-y-4 sm:space-y-6 text-slate-900 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#D4AF37]/15 text-amber-900 rounded-full font-extrabold text-xs uppercase tracking-widest border border-[#D4AF37]/40 shadow-xs animate-slide-up-fade">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
              <span>TEX WEAR EXCLUSIVE 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight sm:leading-none text-slate-950 drop-shadow-xs animate-slide-up-fade animation-delay-150">
              {currentBanner.title}
            </h1>

            {currentBanner.subtitle && (
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up-fade animation-delay-300">
                {currentBanner.subtitle}
              </p>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up-fade animation-delay-450">
              <Link
                href={currentBanner.link}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B8860B] hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 border border-amber-300/60"
              >
                <span>{currentBanner.buttonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Feature Badges */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs font-bold text-slate-700 border-t border-slate-200 animate-slide-up-fade animation-delay-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Premium Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Express Delivery Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Right Column: Framed Model Image Showcase with Smooth Crossfade */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end z-10 relative">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl bg-white group-hover:border-[#D4AF37] transition-all duration-500" style={{ aspectRatio: '4/5' }}>
              {banners.map((banner, idx) => (
                <div
                  key={`card-${banner.id || idx}`}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    idx === currentIndex
                      ? 'opacity-100 scale-100 z-10'
                      : 'opacity-0 scale-105 pointer-events-none z-0'
                  }`}
                >
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover object-top transition-transform duration-1000 hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white flex items-center justify-between shadow-lg">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Collection Highlight</span>
                      <span className="text-xs sm:text-sm font-extrabold line-clamp-1">{banner.title}</span>
                    </div>
                    <span className="px-2.5 py-1 bg-[#D4AF37] text-slate-950 font-black text-[10px] uppercase rounded-md shadow-xs animate-pulse">
                      NEW
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-[#D4AF37] hover:text-slate-950 text-slate-900 flex items-center justify-center backdrop-blur-md border border-slate-300 transition-all z-20 shadow-md active:scale-95"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 sm:left-auto sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-[#D4AF37] hover:text-slate-950 text-slate-900 flex items-center justify-center backdrop-blur-md border border-slate-300 transition-all z-20 shadow-md active:scale-95"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 rounded-full transition-all duration-500 ${
              idx === currentIndex ? 'w-8 bg-[#D4AF37] shadow-md' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
