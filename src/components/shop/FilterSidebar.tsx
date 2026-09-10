'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { FilterState } from '@/types';
import { RotateCcw, Filter } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const { categories } = useShop();

  const handleCategorySelect = (catId?: string) => {
    setFilters((prev) => ({ ...prev, categoryId: catId }));
  };

  const handleSizeToggle = (size: string) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const handleResetFilters = () => {
    setFilters({
      categoryId: undefined,
      subcategoryId: undefined,
      minPrice: 0,
      maxPrice: 10000,
      sizes: [],
      colors: [],
      sortBy: 'latest',
      searchQuery: '',
    });
  };

  return (
    <aside className="w-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            Filters
          </h3>
        </div>
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-sky-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Categories
        </h4>
        <ul className="space-y-1.5 text-xs font-medium">
          <li>
            <button
              onClick={() => handleCategorySelect(undefined)}
              className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors font-bold ${
                !filters.categoryId
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Categories
            </button>
          </li>
          {categories
            .filter((c) => !c.parentId)
            .map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`w-full text-left py-1.5 px-3 rounded-lg transition-colors ${
                    filters.categoryId === cat.id
                      ? 'bg-sky-600 text-white font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          <span>Max Price</span>
          <span className="text-sky-600 dark:text-sky-400">৳{filters.maxPrice.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="500"
          max="10000"
          step="200"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-sky-600 cursor-pointer"
        />
      </div>

      {/* Sizes */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'].map((sz) => {
            const isSelected = filters.sizes.includes(sz);
            return (
              <button
                key={sz}
                onClick={() => handleSizeToggle(sz)}
                className={`w-9 h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all border ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-500'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
