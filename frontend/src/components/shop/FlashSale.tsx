'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from './ProductCard';
import { Zap, Clock } from 'lucide-react';

export const FlashSale: React.FC = () => {
  const { products } = useShop();

  const flashSaleProducts = products.filter((p) => p.isFlashSale);

  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (flashSaleProducts.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden border-y border-[#D4AF37]/30 shadow-inner">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 relative z-10">
        {/* Header with Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 rounded-xl font-black shadow-lg shrink-0 animate-pulse-glow">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                Flash Sale Offers
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-300 font-medium">
                Limited time deals on signature Tex Wear fashion line!
              </p>
            </div>
          </div>

          {/* Countdown Clock with Flip Animation */}
          <div className="flex items-center gap-2 bg-[#0F172A]/90 px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl border border-[#D4AF37]/40 backdrop-blur-md shrink-0 self-start sm:self-auto shadow-xl">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] shrink-0 animate-pulse" />
            <span className="text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-wider">Ends In:</span>
            <div className="flex items-center gap-1 font-black text-xs sm:text-sm text-[#D4AF37]">
              <span key={`hrs-${timeLeft.hours}`} className="inline-block bg-[#1E293B] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-slate-700 shadow-inner animate-flip-digit text-amber-300">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span key={`min-${timeLeft.minutes}`} className="inline-block bg-[#1E293B] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-slate-700 shadow-inner animate-flip-digit text-amber-300">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span key={`sec-${timeLeft.seconds}`} className="inline-block bg-[#1E293B] px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md border border-slate-700 shadow-inner animate-flip-digit text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {flashSaleProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
