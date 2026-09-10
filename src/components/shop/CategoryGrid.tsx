'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

const DEFAULT_CATEGORY_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80';

export const CategoryGrid: React.FC = () => {
  const { categories } = useShop();

  const featuredCats = categories.slice(0, 8);

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-[#0F172A] border-b border-slate-100 dark:border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Shop By Category
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              Explore TEX WEAR exclusive fashion lines
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            View All Categories →
          </Link>
        </div>

        {/* Circular Grid: 4 items per row on mobile, 8 on desktop */}
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4 md:gap-6">
          {featuredCats.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center text-center space-y-1.5 sm:space-y-2.5"
            >
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-slate-200 dark:border-[#334155] p-0.5 sm:p-1 group-hover:border-[#D4AF37] group-hover:ring-4 group-hover:ring-[#D4AF37]/30 shadow-xs group-hover:shadow-lg transition-all duration-500 group-hover:scale-110 bg-slate-100 dark:bg-[#1E293B]">
                <img
                  src={cat.image || DEFAULT_CATEGORY_IMAGE}
                  alt={cat.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_CATEGORY_IMAGE;
                  }}
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-all duration-300 transform group-hover:-translate-y-0.5 line-clamp-2 px-0.5 leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
