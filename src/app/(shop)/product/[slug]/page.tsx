'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ProductCard } from '@/components/shop/ProductCard';
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
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { products, addToCart, toggleWishlist, isInWishlist, setQuickOrderProduct } = useShop();

  const product = products.find((p) => p.slug === resolvedParams.slug) || products[0];

  const [selectedImg, setSelectedImg] = useState<string>(product?.images[0] || '');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>(
    product?.colors[0] || { name: 'Default', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

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

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
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
          {/* Left Gallery (5 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Display Image */}
            <div className="relative aspect-[4/5] w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner" style={{ aspectRatio: '4/5' }}>
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover object-top"
              />
              {product.discountPercentage && (
                <span className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(imgUrl)}
                    className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      mainImage === imgUrl
                        ? 'border-sky-600 ring-2 ring-sky-500/30'
                        : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Details (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-sky-400">
                  {product.categoryName} • SKU: {product.sku}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-full border transition-all ${
                    isWishlisted
                      ? 'bg-pink-600 text-white border-pink-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-pink-600'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>

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
                    <span className="text-sky-600 font-bold underline cursor-pointer">
                      Size Guide
                    </span>
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
              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Select Color: <span className="text-sky-600 font-normal">{selectedColor.name}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    {product.colors.map((clr) => (
                      <button
                        key={clr.name}
                        onClick={() => setSelectedColor(clr)}
                        className={`group relative p-1 rounded-full border-2 transition-all ${
                          selectedColor.name === clr.name
                            ? 'border-sky-600 ring-2 ring-sky-500/30'
                            : 'border-transparent'
                        }`}
                        title={clr.name}
                      >
                        <span
                          className="block w-7 h-7 rounded-full border border-slate-300 shadow-xs"
                          style={{ backgroundColor: clr.hex }}
                        />
                      </button>
                    ))}
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

            {/* Order Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleQuickBuy}
                className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-sm uppercase tracking-widest rounded-xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-101 border border-amber-400/30"
              >
                <Zap className="w-5 h-5 fill-amber-400" />
                <span>ORDER NOW (সরাসরি অর্ডার করুন)</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
            </div>

            {/* Delivery Info Hotline Box */}
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-slate-800/60 border border-sky-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sky-800 dark:text-sky-300">
                <PhoneCall className="w-4 h-4" />
                <span>Need help ordering? Call hotline: +8801623446677</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 text-[11px] pt-1">
                <div className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dhaka Delivery: ৳70</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Specification & Description */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 mb-12">
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2 text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'desc'
                  ? 'border-b-2 border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'specs'
                  ? 'border-b-2 border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all ${
                activeTab === 'shipping'
                  ? 'border-b-2 border-sky-600 text-sky-600 dark:text-sky-400'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Delivery & Exchange
            </button>
          </div>

          <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
            {activeTab === 'desc' && <p>{product.description}</p>}
            {activeTab === 'specs' && (
              <ul className="list-disc pl-5 space-y-1">
                {product.details?.map((dt, i) => (
                  <li key={i}>{dt}</li>
                )) || <li>High Quality Cotton Fabric</li>}
              </ul>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p>• <strong>Dhaka City:</strong> 24-48 Hours Delivery (Shipping Fee ৳70)</p>
                <p>• <strong>Dhaka Suburbs:</strong> 48-72 Hours Delivery (Shipping Fee ৳100)</p>
                <p>• <strong>Outside Dhaka:</strong> 3-5 Days Delivery (Shipping Fee ৳130)</p>
                <p>• <strong>Exchange Policy:</strong> 7 Days Size/Product Replacement at any outlet or via courier.</p>
              </div>
            )}
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
    </div>
  );
}
