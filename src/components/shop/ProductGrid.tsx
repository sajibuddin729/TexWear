'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from './ProductCard';
import Link from 'next/link';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  showTabs?: boolean;
  limit?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title = 'Our Featured Collection',
  subtitle = 'Handpicked apparel crafted for ultimate elegance & comfort',
  showTabs = true,
  limit = 8,
}) => {
  const { products } = useShop();
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'bestseller' | 'featured'>('all');

  let filteredProducts = products;

  if (activeTab === 'new') {
    filteredProducts = products.filter((p) => p.isNewArrival);
  } else if (activeTab === 'bestseller') {
    filteredProducts = products.filter((p) => p.isBestSeller);
  } else if (activeTab === 'featured') {
    filteredProducts = products.filter((p) => p.isFeatured);
  }

  const displayedProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;

  return (
    <section className="py-12 bg-slate-50/80 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-slate-950">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs md:text-sm text-slate-600 font-medium mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Filter Tabs */}
          {showTabs && (
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-700 hover:text-amber-600 font-bold'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === 'new'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-700 hover:text-amber-600 font-bold'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('bestseller')}
                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === 'bestseller'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-700 hover:text-amber-600 font-bold'
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === 'featured'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-700 hover:text-amber-600 font-bold'
                }`}
              >
                Featured
              </button>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-slate-600 font-bold text-sm">No products found in this filter.</p>
          </div>
        )}

        {/* View All Button */}
        {limit && products.length > limit && (
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B8860B] hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-xl transition-all hover:scale-105 border border-amber-300/40"
            >
              <span>Explore All Products</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
