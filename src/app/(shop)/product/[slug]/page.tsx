'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { SizeGuideModal } from '@/components/shop/SizeGuideModal';
import {
  Heart,
  ShoppingBag,
  Zap,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  PhoneCall,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { products, siteSettings, addToCart, toggleWishlist, isInWishlist, setQuickOrderProduct } = useShop();

  const product = products.find((p) => p.slug === resolvedParams.slug) || products[0];

  const [selectedImg, setSelectedImg] = useState<string>(product?.images[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product?.colors?.[0] || { name: 'Standard', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.images?.[0]) setSelectedImg(product.images[0]);
      if (product.sizes?.[0]) setSelectedSize(product.sizes[0]);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <Link href="/shop" className="text-sky-600 font-bold underline mt-2 inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  const mainImage = selectedImg || product.images[0];
  const isWishlisted = isInWishlist(product.id);

  const currentImageIndex = Math.max(0, product.images.indexOf(mainImage));

  const handlePrevImage = () => {
    if (product.images.length <= 1) return;
    const newIdx = (currentImageIndex - 1 + product.images.length) % product.images.length;
    setSelectedImg(product.images[newIdx]);
  };

  const handleNextImage = () => {
    if (product.images.length <= 1) return;
    const newIdx = (currentImageIndex + 1) % product.images.length;
    setSelectedImg(product.images[newIdx]);
  };

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    const colorToUse = selectedColor?.name ? selectedColor : (product.colors?.[0] || { name: 'Standard', hex: '#000000' });
    addToCart(product, selectedSize, colorToUse, quantity);
  };

  const handleQuickBuy = () => {
    setQuickOrderProduct(product);
  };

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
          <Link href="/" className="hover:text-sky-600">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-sky-600">Shop</Link>
          <span>/</span>
          <Link href={`/category/${product.categoryId}`} className="hover:text-sky-600">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white line-clamp-1">{product.title}</span>
        </div>

        {/* Top Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-12">
          {/* Left Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Display Image */}
            <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-square bg-slate-50 dark:bg-slate-800/40 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/80 p-3 sm:p-5 flex items-center justify-center shadow-inner group">
              <img
                key={mainImage}
                src={mainImage}
                alt={product.title}
                className="w-full h-full max-h-[500px] object-contain transition-all duration-300 group-hover:scale-105"
              />
              {product.discountPercentage && (
                <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs uppercase tracking-wider px-3 py-1 rounded-md shadow-md z-10">
                  -{product.discountPercentage}% OFF
                </span>
              )}

              {/* Prev / Next Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-lg hover:bg-white dark:hover:bg-slate-900 hover:text-sky-600 transition-all opacity-85 group-hover:opacity-100 cursor-pointer"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shadow-lg hover:bg-white dark:hover:bg-slate-900 hover:text-sky-600 transition-all opacity-85 group-hover:opacity-100 cursor-pointer"
                    title="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Image Counter Badge */}
                  <span className="absolute bottom-4 right-4 bg-slate-950/75 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full border border-white/20 shadow-md">
                    {currentImageIndex + 1} / {product.images.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnails Row (Multiple & Single Image Gallery) */}
            {product.images.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                  {product.images.map((imgUrl, idx) => {
                    const isActive = mainImage === imgUrl;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImg(imgUrl)}
                        className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 p-1.5 bg-white dark:bg-slate-800 transition-all shrink-0 flex items-center justify-center cursor-pointer group ${
                          isActive
                            ? 'border-sky-600 ring-2 ring-sky-500/40 shadow-md scale-102'
                            : 'border-slate-200 dark:border-slate-700 opacity-65 hover:opacity-100 hover:border-slate-400 dark:hover:border-slate-500'
                        }`}
                        title={`Select image ${idx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.title} view ${idx + 1}`}
                          className="w-full h-full object-contain transition-transform group-hover:scale-105"
                        />
                        {isActive && (
                          <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-sky-600 ring-2 ring-white dark:ring-slate-800" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {product.images.length > 1 && (
                  <p className="text-[11px] font-bold text-slate-400">
                    Click any thumbnail above to view in high resolution
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Product Details (6 cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-5">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {product.title}
                </h1>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-full border shrink-0 transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-pink-600 text-white border-pink-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-pink-600 bg-white dark:bg-slate-800'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Rating & Availability */}
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">({product.reviewCount} Reviews)</span>
                </div>

                <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>In Stock ({product.stockCount} left)</span>
                </span>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-baseline gap-4">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-slate-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Select Size:
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-sky-600 dark:text-sky-400 font-bold underline cursor-pointer hover:text-sky-500 transition-colors"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-12 h-11 px-3 rounded-xl font-bold text-xs flex items-center justify-center border transition-all ${
                          selectedSize === sz
                            ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-500/30'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-500'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                      Select Color: <span className="text-sky-600 dark:text-sky-400 font-bold ml-1">{selectedColor.name}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colors.map((c, idx) => {
                      const isSelected = selectedColor.name === c.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-sm ring-2 ring-sky-500/20'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-inner shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Quantity:
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-black text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Action Buttons - Horizontal Layout with reduced width */}
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleQuickBuy}
                  className="w-full py-3 sm:py-3.5 px-3 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] border border-amber-400/30 cursor-pointer"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 shrink-0" />
                  <span className="truncate">ORDER NOW</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-3 sm:py-3.5 px-3 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 sm:gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="truncate">ADD TO CART</span>
                </button>
              </div>
            </div>

            {/* Delivery Info Hotline Box */}
            <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-slate-800/60 border border-sky-200 dark:border-slate-700 space-y-2 text-xs">
              <a
                href={`tel:${siteSettings?.phone || '+8801623446677'}`}
                className="flex items-center gap-2 font-bold text-sky-800 dark:text-sky-300 hover:underline"
              >
                <PhoneCall className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Need help ordering? Call hotline: {siteSettings?.phone || '+8801623446677'}</span>
              </a>
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 text-[11px] pt-1 border-t border-sky-100 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Dhaka Delivery: ৳70</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Product Description & Specifications Dropdown (Accordion on Right Side) */}
            <div className="space-y-3 pt-1">
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/70 dark:bg-slate-800/40 transition-all">
                <button
                  type="button"
                  onClick={() => setIsDescriptionOpen((prev) => !prev)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      Product Description
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                      {isDescriptionOpen ? 'Hide' : 'Click to View'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                        isDescriptionOpen ? 'rotate-180 text-sky-600' : ''
                      }`}
                    />
                  </div>
                </button>

                {isDescriptionOpen && (
                  <div className="px-4 pb-5 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 animate-in fade-in duration-200">
                    <div
                      className="rich-description text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto space-y-3"
                      dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }}
                    />
                  </div>
                )}
              </div>

              {product.details && product.details.length > 0 && (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/70 dark:bg-slate-800/40 transition-all">
                  <button
                    type="button"
                    onClick={() => setIsSpecsOpen((prev) => !prev)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        Specifications & Features
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                        {isSpecsOpen ? 'Hide' : 'Click to View'}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                          isSpecsOpen ? 'rotate-180 text-amber-500' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isSpecsOpen && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 animate-in fade-in duration-200">
                      <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {product.details.map((dt, i) => (
                          <li key={i}>{dt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Official Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        defaultTab={
          /pant|jean|denim|trouser|gabardine/i.test((product.title || '') + ' ' + (product.categoryName || ''))
            ? 'pants'
            : /shoe|sandal|loafer|sneaker|footwear/i.test((product.title || '') + ' ' + (product.categoryName || ''))
            ? 'shoes'
            : 'tops'
        }
      />
    </div>
  );
}
