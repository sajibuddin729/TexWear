'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { Search, X, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useShop();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300">
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-950/60">
          <Search className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search Panjabi, Shirts, Kameez, Pants, Accessories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() ? (
            results.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Found {results.length} Matching Products
                </p>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-14 h-16 object-cover object-top rounded-lg bg-slate-200"
                    />
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">
                        ৳{product.price.toLocaleString()}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 font-bold text-sm">
                  No products found matching "{query}"
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching for 'Panjabi', 'Shirt', 'Kameez', or 'Denim'
                </p>
              </div>
            )
          ) : (
            <div className="py-8 text-center space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Popular Searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Panjabi', 'Casual Shirt', 'Salwar Kameez', 'Polo Shirt', 'Pants', 'Saree', 'Wallet'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
