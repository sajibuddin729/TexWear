'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { ProductCard } from '@/components/shop/ProductCard';
import { FilterState } from '@/types';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function ShopPage() {
  const { products } = useShop();

  const [filters, setFilters] = useState<FilterState>({
    categoryId: undefined,
    subcategoryId: undefined,
    minPrice: 0,
    maxPrice: 10000,
    sizes: [],
    colors: [],
    sortBy: 'latest',
    searchQuery: '',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Apply Filters
  let filteredProducts = products.filter((p) => {
    if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
    if (p.price > filters.maxPrice) return false;
    if (filters.sizes.length > 0 && !filters.sizes.some((sz) => p.sizes.includes(sz))) return false;
    return true;
  });

  // Apply Sorting
  if (filters.sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'popular') {
    filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Tex Wear Shop Catalog
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Showing {filteredProducts.length} items
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-xs text-xs font-bold text-slate-700 dark:text-slate-300">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span>Sort By:</span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="bg-transparent focus:outline-none cursor-pointer font-bold text-slate-900 dark:text-white"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Mobile Filter Offcanvas */}
          {mobileFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
              <div className="w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full p-4 overflow-y-auto shadow-2xl">
                <FilterSidebar filters={filters} setFilters={setFilters} />
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full mt-4 py-2.5 bg-sky-600 text-white font-bold text-xs uppercase rounded-xl"
                >
                  Apply & Close
                </button>
              </div>
              <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
            </div>
          )}

          {/* Product Items Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Products Match Your Criteria
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your price slider or selected category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
