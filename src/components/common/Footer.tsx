'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { PhoneCall, Mail, MapPin } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export const Footer: React.FC = () => {
  const { siteSettings } = useShop();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <footer className={`bg-white text-slate-700 border-t border-slate-200 pb-8 ${isHomePage ? 'pt-8' : 'pt-12'}`}>
      {/* Features Bar - hidden on homepage (which already has Why Shop section), displayed on all other pages */}
      {!isHomePage && (
        <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="p-2.5 rounded-xl bg-amber-500/10 shrink-0">
              <img src="/fast-delivery.png" alt="Fast Home Delivery" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">Fast Home Delivery</h4>
              <p className="text-xs text-slate-500">Across Dhaka & all Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 shrink-0">
              <img src="/cash-on-delivery.png" alt="Cash on Delivery" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">Cash on Delivery</h4>
              <p className="text-xs text-slate-500">Pay when you receive your order</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="p-2.5 rounded-xl bg-pink-500/10 shrink-0">
              <img src="/hassle-free.png" alt="Easy Exchanges" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">Easy Exchanges</h4>
              <p className="text-xs text-slate-500">7 Days size & product replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="p-2.5 rounded-xl bg-amber-500/10 shrink-0">
              <img src="/authenticity.png" alt="100% Original" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h4 className="text-slate-900 font-bold text-sm">100% Original</h4>
              <p className="text-xs text-slate-500">Authentic Tex Wear Crafts</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className={`max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 ${isHomePage ? 'py-6 sm:py-8' : 'py-12'}`}>
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Logo variant="dark" />
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
            TEX WEAR — Life Style is a premier fashion and lifestyle brand in Bangladesh, offering high-quality ethnic wear, panjabi, casual & formal shirts, ladies kameez, saree, and accessories.
          </p>
          <div className="space-y-2.5 text-xs text-slate-700 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <a href={`tel:${siteSettings?.phone || '+8801825400045'}`} className="hover:text-sky-600 font-medium transition-colors">
                Hotline: {siteSettings?.phone || '+8801825400045'}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center shrink-0 border border-sky-200">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <a href={`mailto:${siteSettings?.email || 'texwearstyle.com@gmail.com'}`} className="hover:text-sky-600 font-medium transition-colors">
                Email: {siteSettings?.email || 'texwearstyle.com@gmail.com'}
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <span className="leading-relaxed">
                {siteSettings?.address || '567, 1st Floor, East Kazipara, Begum Rokeya Sarani, Mirpur, Metro Rail Pillar No. 285, Dhaka-1216'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-sky-600 pl-2">
            Categories
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/category/mens-ethnic" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Men's Ethnic & Panjabi
              </Link>
            </li>
            <li>
              <Link href="/category/casual-shirt" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Casual & Printed Shirts
              </Link>
            </li>
            <li>
              <Link href="/category/polo-shirt" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Polo Shirts & T-Shirts
              </Link>
            </li>
            <li>
              <Link href="/category/pants" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Jeans & Chino Pants
              </Link>
            </li>
            <li>
              <Link href="/category/kameez" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Salwar Kameez & Kurti
              </Link>
            </li>
            <li>
              <Link href="/category/accessories" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Wallets, Belts & Perfumes
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-sky-600 pl-2">
            Customer Support
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/store-locator" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Store Locator
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Direct Order Form
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-600 hover:text-sky-600 font-medium transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="text-amber-600 hover:text-amber-700 font-bold transition-colors flex items-center gap-1.5">
                <span>Customer Feedback & Reviews</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Methods & Policy */}
        <div>
          <h3 className="text-slate-900 font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-sky-600 pl-2">
            Payment Methods
          </h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            We accept Cash on Delivery & Mobile Financial Services nationwide:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[10px] px-2.5 py-1.5 rounded-md shadow-xs">
              CASH ON DELIVERY
            </span>
            <span className="bg-[#E2136E]/10 border border-[#E2136E]/30 text-[#E2136E] font-bold text-[10px] px-2.5 py-1.5 rounded-md shadow-xs">
              bKash
            </span>
            <span className="bg-[#F7931E]/10 border border-[#F7931E]/30 text-[#D85C00] font-bold text-[10px] px-2.5 py-1.5 rounded-md shadow-xs">
              Nagad
            </span>
          </div>

          {/* Connect With Us (Facebook & YouTube) */}
          <div className="pt-2">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-2.5">
              Connect With Us
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={siteSettings?.facebookUrl || 'https://facebook.com/texwearbd'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white rounded-lg text-xs font-bold transition-all border border-[#1877F2]/20 hover:shadow-xs"
                title="Follow TEX WEAR on Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href={siteSettings?.youtubeUrl || 'https://youtube.com/@texwearlifestyle'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF0000]/10 hover:bg-[#FF0000] text-[#FF0000] hover:text-white rounded-lg text-xs font-bold transition-all border border-[#FF0000]/20 hover:shadow-xs"
                title="Subscribe to TEX WEAR on YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <p>© {new Date().getFullYear()} TEX WEAR — Life Style. All rights reserved.</p>
        <p className="text-[11px] text-slate-500">
          Developed by{' '}
          <a
            href="https://www.fournotsix.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-700 hover:text-sky-600 transition-colors underline-offset-2 hover:underline"
          >
            FourNotSix
          </a>
        </p>
      </div>
    </footer>
  );
};
