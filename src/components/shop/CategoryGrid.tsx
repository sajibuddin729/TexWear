'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';

const DEFAULT_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80';

export const CategoryGrid: React.FC = () => {
  const { categories, categoriesLoaded } = useShop();

  // Only show top-level (parent) categories — no subcategories with parentId
  const topLevelCats = categories.filter((cat) => !cat.parentId);
  const featuredCats = topLevelCats.slice(0, 8);

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-10">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight text-slate-950">
              Shop By Category
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
              Explore TEX WEAR exclusive fashion lines
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            View All Categories →
          </Link>
        </div>

        {/* Category circles — flex so items always spread full width evenly */}
        <div className="flex flex-wrap justify-evenly gap-y-6 sm:gap-y-8">
          {!categoriesLoaded
            ? /* Skeleton loaders — shown before API responds, prevents flash */
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center gap-3"
                  style={{ flex: '1 1 0', minWidth: 72, maxWidth: 200 }}
                >
                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
                </div>
              ))
            : featuredCats.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center text-center gap-3"
                  style={{ flex: '1 1 0', minWidth: 72, maxWidth: 200 }}
                >
                  {/* Circle image */}
                  <div className="w-20 h-20 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-[#D4AF37] group-hover:ring-4 group-hover:ring-[#D4AF37]/30 shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 bg-slate-100">
                    <img
                      src={cat.image || DEFAULT_CATEGORY_IMAGE}
                      alt={cat.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_CATEGORY_IMAGE;
                      }}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>
                  {/* Label */}
                  <span className="text-[10px] sm:text-xs md:text-[13px] font-black uppercase tracking-wider text-slate-900 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2 leading-tight px-1">
                    {cat.name}
                  </span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};
