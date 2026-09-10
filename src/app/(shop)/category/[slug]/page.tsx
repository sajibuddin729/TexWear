'use client';

import React, { use } from 'react';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/shop/ProductCard';
import Link from 'next/link';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { categories, products } = useShop();

  const currentCategory = categories.find((c) => c.slug === resolvedParams.slug);

  const categoryProducts = products.filter(
    (p) =>
      p.categoryId === currentCategory?.id ||
      p.categoryName.toLowerCase().includes(resolvedParams.slug.replace('-', ' '))
  );

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Category Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-12 mb-10 shadow-lg">
          {currentCategory?.image && (
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
            />
          )}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-sky-400 font-bold uppercase tracking-widest">
              <Link href="/shop" className="hover:underline">Shop</Link>
              <span>/</span>
              <span>Category</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              {currentCategory?.name || resolvedParams.slug.replace('-', ' ')}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl font-medium">
              Explore our exclusive {currentCategory?.name || resolvedParams.slug} collection designed for modern lifestyle.
            </p>
          </div>
        </div>

        {/* Product Items */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No products found in this category
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Check back soon for new arrivals in {currentCategory?.name || resolvedParams.slug}.
            </p>
            <div className="mt-4">
              <Link
                href="/shop"
                className="px-6 py-2.5 bg-sky-600 text-white rounded-full text-xs font-bold uppercase tracking-wider inline-block"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
