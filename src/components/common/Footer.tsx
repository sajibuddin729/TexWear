'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { PhoneCall, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export const Footer: React.FC = () => {
  const { siteSettings } = useShop();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <footer className={`bg-[#0B132B] text-slate-400 border-t border-slate-800/80 pb-8 ${isHomePage ? 'pt-8' : 'pt-12'}`}>
      {/* Features Bar - hidden on homepage (which already has Why Shop section), displayed on all other pages */}
      {!isHomePage && (
        <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/10 shrink-0">
              <img src="/fast-delivery.png" alt="Fast Home Delivery" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Fast Home Delivery</h4>
              <p className="text-xs text-slate-400">Across Dhaka & all Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 shrink-0">
              <img src="/cash-on-delivery.png" alt="Cash on Delivery" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Cash on Delivery</h4>
              <p className="text-xs text-slate-400">Pay when you receive your order</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-slate-800">
            <div className="p-2 rounded-xl bg-pink-500/10 shrink-0">
              <img src="/hassle-free.png" alt="Easy Exchanges" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Easy Exchanges</h4>
              <p className="text-xs text-slate-400">7 Days size & product replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0F172A] border border-slate-800">
            <div className="p-2 rounded-xl bg-amber-500/10 shrink-0">
              <img src="/authenticity.png" alt="100% Original" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Original</h4>
              <p className="text-xs text-slate-400">Authentic Tex Wear Crafts</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className={`max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 ${isHomePage ? 'py-6 sm:py-8' : 'py-12'}`}>
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Logo variant="light" />
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            TEX WEAR — Life Style is a premier fashion and lifestyle brand in Bangladesh, offering high-quality ethnic wear, panjabi, casual & formal shirts, ladies kameez, saree, and accessories.
          </p>
          <div className="space-y-2 text-xs text-slate-300 pt-2">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Hotline: {siteSettings?.phone || '+8801623446677'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Email: {siteSettings?.email || 'info@texwearlifestyle.com'}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{siteSettings?.address || 'Corporate Office: Level 4, Tex Wear Tower, Dhaka, Bangladesh'}</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
            Categories
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/category/mens-ethnic" className="hover:text-sky-400 transition-colors">
                Men's Ethnic & Panjabi
              </Link>
            </li>
            <li>
              <Link href="/category/casual-shirt" className="hover:text-sky-400 transition-colors">
                Casual & Printed Shirts
              </Link>
            </li>
            <li>
              <Link href="/category/polo-shirt" className="hover:text-sky-400 transition-colors">
                Polo Shirts & T-Shirts
              </Link>
            </li>
            <li>
              <Link href="/category/pants" className="hover:text-sky-400 transition-colors">
                Jeans & Chino Pants
              </Link>
            </li>
            <li>
              <Link href="/category/kameez" className="hover:text-sky-400 transition-colors">
                Salwar Kameez & Kurti
              </Link>
            </li>
            <li>
              <Link href="/category/accessories" className="hover:text-sky-400 transition-colors">
                Wallets, Belts & Perfumes
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
            Customer Support
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/store-locator" className="hover:text-sky-400 transition-colors">
                Store Locator
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-sky-400 transition-colors">
                Direct Order Form
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-sky-400 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-sky-400 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="hover:text-amber-400 text-amber-400/90 font-bold transition-colors flex items-center gap-1.5">
                <span>Customer Feedback & Reviews</span>

              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Methods & Policy */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-sky-500 pl-2">
            Payment Methods
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            We accept Cash on Delivery & Mobile Financial Services nationwide:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-slate-900 border border-slate-800 text-sky-400 font-black text-[10px] px-2.5 py-1.5 rounded-md">
              CASH ON DELIVERY
            </span>
            <span className="bg-pink-950/80 border border-pink-900 text-pink-300 font-bold text-[10px] px-2.5 py-1.5 rounded-md">
              bKash
            </span>
            <span className="bg-orange-950/80 border border-orange-900 text-orange-300 font-bold text-[10px] px-2.5 py-1.5 rounded-md">
              Nagad
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} TEX WEAR — Life Style. All rights reserved.</p>
        <p className="text-[11px]">Designed & Developed for TEX WEAR Bangladesh</p>
      </div>
    </footer>
  );
};
