'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, products } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="p-3 bg-pink-500 text-white rounded-2xl shadow-md">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              You have {wishlistedProducts.length} items saved in your wishlist
            </p>
          </div>
        </div>

        {wishlistedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-400">Save products by clicking the heart icon on product cards.</p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-sky-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Explore Shop
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
