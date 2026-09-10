'use client';

import React from 'react';
import Link from 'next/link';
import { HeroSlider } from '@/components/shop/HeroSlider';
import { CategoryGrid } from '@/components/shop/CategoryGrid';
import { FlashSale } from '@/components/shop/FlashSale';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Hero Carousel */}
      <HeroSlider />

      {/* Categories Grid */}
      <ScrollReveal direction="up" delay={0}>
        <CategoryGrid />
      </ScrollReveal>

      {/* Flash Sale Countdown Section */}
      <ScrollReveal direction="up" delay={50}>
        <FlashSale />
      </ScrollReveal>

      {/* Promotional Collections Banner Grid */}
      <section className="py-12 bg-white dark:bg-[#0F172A] border-b border-slate-100 dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Men's Ethnic */}
          <ScrollReveal direction="up" delay={0}>
            <div className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200 dark:border-[#334155]">
              <img
                src="/categories/cat-mens-ethnic.jpg"
                alt="Men's Ethnic"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[#D4AF37] font-extrabold text-xs uppercase tracking-widest">
                  FESTIVE EDITION
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight">Men's Premium Panjabi</h3>
                <div className="pt-2">
                  <Link
                    href="/category/mens-ethnic"
                    className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#D4AF37] group-hover:text-white transition-colors"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Women's Kameez */}
          <ScrollReveal direction="up" delay={150}>
            <div className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200 dark:border-[#334155]">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Women's Collection"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-pink-400 font-extrabold text-xs uppercase tracking-widest">
                  ROYAL EMBROIDERY
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight">Salwar Kameez & Saree</h3>
                <div className="pt-2">
                  <Link
                    href="/category/kameez"
                    className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-pink-400 group-hover:text-white transition-colors"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Casual Shirts */}
          <ScrollReveal direction="up" delay={300}>
            <div className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-200 dark:border-[#334155]">
              <img
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
                alt="Casual Shirts"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest">
                  SMART CASUAL
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight">100% Cotton Shirts</h3>
                <div className="pt-2">
                  <Link
                    href="/category/casual-shirt"
                    className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-amber-400 group-hover:text-white transition-colors"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Tabbed Product Grid */}
      <ScrollReveal direction="up" delay={0}>
        <ProductGrid
          title="Trending Tex Wear Collection"
          subtitle="Meticulously designed for perfection, style & comfort"
          showTabs={true}
          limit={8}
        />
      </ScrollReveal>

      {/* Trust & Guarantee Banner with Staggered Scroll Animations */}
      <section className="py-16 bg-[#0F172A] text-white relative overflow-hidden border-t border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8 relative z-10">
          <ScrollReveal direction="up" delay={0}>
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                Why Shop With Tex Wear Life Style?
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Delivering premium Bangladeshi craftsmanship directly to your doorstep with guaranteed customer satisfaction.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 text-left">
            <ScrollReveal direction="up" delay={100}>
              <div className="p-6 rounded-2xl bg-[#1E293B] border border-[#334155] space-y-4 hover:border-[#D4AF37]/60 hover:scale-102 transition-all duration-300 shadow-lg group">
                <div className="p-2.5 w-fit rounded-2xl bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <img src="/fast-delivery.png" alt="Fast Express Shipping" className="w-10 h-10 object-contain" />
                </div>
                <h4 className="text-base font-extrabold uppercase tracking-tight">Fast Express Shipping</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Home delivery inside Dhaka within 24-48 hours and 3-5 days across all districts in Bangladesh.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="p-6 rounded-2xl bg-[#1E293B] border border-[#334155] space-y-4 hover:border-emerald-500/60 hover:scale-102 transition-all duration-300 shadow-lg group">
                <div className="p-2.5 w-fit rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <img src="/cash-on-delivery.png" alt="Cash on Delivery" className="w-10 h-10 object-contain" />
                </div>
                <h4 className="text-base font-extrabold uppercase tracking-tight">Cash on Delivery</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No advance payment needed for regular items. Pay cash after inspecting your parcel.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <div className="p-6 rounded-2xl bg-[#1E293B] border border-[#334155] space-y-4 hover:border-pink-500/60 hover:scale-102 transition-all duration-300 shadow-lg group">
                <div className="p-2.5 w-fit rounded-2xl bg-pink-500/10 border border-pink-500/20 group-hover:scale-110 transition-transform">
                  <img src="/hassle-free.png" alt="Hassle-Free Exchange" className="w-10 h-10 object-contain" />
                </div>
                <h4 className="text-base font-extrabold uppercase tracking-tight">Hassle-Free Exchange</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Need a size change? Exchange easily within 7 days at any Tex Wear store or via courier.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="p-6 rounded-2xl bg-[#1E293B] border border-[#334155] space-y-4 hover:border-[#D4AF37]/60 hover:scale-102 transition-all duration-300 shadow-lg group">
                <div className="p-2.5 w-fit rounded-2xl bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform">
                  <img src="/authenticity.png" alt="100% Genuine Quality" className="w-10 h-10 object-contain" />
                </div>
                <h4 className="text-base font-extrabold uppercase tracking-tight">100% Genuine Quality</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Crafted using authentic fabrics, precision stitching, and premium original accessories.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
