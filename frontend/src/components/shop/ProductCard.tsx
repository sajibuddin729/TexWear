'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Heart, ShoppingBag, Zap, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickOrderProduct } = useShop();

  const isWishlisted = isInWishlist(product.id);

  const mainImage = product.images[0] || DEFAULT_PRODUCT_IMAGE;
  const hoverImage = product.images[1] || mainImage;

  return (
    <div className="group relative bg-white dark:bg-[#1E293B] rounded-xl sm:rounded-2xl border border-slate-200 dark:border-[#334155] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:border-amber-400/50">
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/5] bg-slate-100 dark:bg-[#0F172A] overflow-hidden shrink-0" style={{ aspectRatio: '4 / 5' }}>
        <Link href={`/product/${product.slug}`} className="absolute inset-0 w-full h-full block">
          <img
            src={mainImage}
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
            }}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-108 group-hover:opacity-0"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <img
            src={hoverImage}
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
            }}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-108"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Link>

        {/* Badges with Pulse Glow */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="bg-red-600 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs shadow-md">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-xs shadow-md animate-pulse">
              ⚡ FLASH
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 shadow-md hover:scale-110 active:scale-95 ${isWishlisted
              ? 'bg-pink-600 text-white scale-105'
              : 'bg-white/80 dark:bg-[#0F172A]/80 text-slate-700 dark:text-slate-200 hover:bg-pink-600 hover:text-white'
            }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Buy Overlay Trigger - Metallic Gold CTA */}
        <div className="absolute bottom-2.5 inset-x-2 sm:inset-x-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out flex items-center gap-2 z-10">
          <button
            onClick={() => setQuickOrderProduct(product)}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B8860B] text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-1.5 transition-all duration-300 hover:brightness-110 hover:scale-102 active:scale-95 border border-amber-300/40"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
            <span>Quick Buy</span>
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2 sm:space-y-3 bg-white dark:bg-[#1E293B]">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest block truncate">
            {product.categoryName}
          </span>
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-amber-500 dark:hover:text-amber-400 transition-colors mt-0.5 leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center justify-between text-[10px] sm:text-xs">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 shrink-0" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-normal">({product.reviewCount})</span>
          </div>
          {product.inStock ? (
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
              In Stock
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/60 px-1.5 py-0.5 rounded-full border border-red-500/20">
              Out of Stock
            </span>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#334155]/80 flex items-center justify-between gap-1">
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-amber-400 leading-none">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through mt-0.5">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-[#0F172A] hover:bg-[#D4AF37] text-slate-700 dark:text-white hover:text-slate-950 border border-slate-200 dark:border-[#334155] hover:border-amber-400 transition-all shadow-md shrink-0 flex items-center justify-center group/btn"
            title="Add to Cart"
          >
            <img src="/add-to-cart.png" alt="Add to Cart" className="w-4 h-4 sm:w-5 sm:h-5 object-contain transition-transform group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
};
