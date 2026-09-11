'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useShop } from '@/context/ShopContext';
import {
  Search,
  Heart,
  ShoppingCart,
  PhoneCall,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  MapPin,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const {
    getCartCount,
    wishlist,
    setIsCartOpen,
    setIsSearchOpen,
    categories,
    siteSettings,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedSubCat, setExpandedSubCat] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = getCartCount();
  const mainCategories = categories.filter((c) => !c.parentId);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  const toggleSubCategoryExpand = (subId: string) => {
    setExpandedSubCat(expandedSubCat === subId ? null : subId);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm"
    >
      {/* Top Announcement Bar / Marquee */}
      <div
        className="bg-[#071B3B] text-white text-[11px] sm:text-xs py-1.5 px-3 border-b border-slate-800 w-full overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 w-full">
          {/* Marquee message */}
          <div className="flex items-center gap-2 overflow-hidden text-left flex-1 min-w-0">
            <span className="bg-[#D4AF37] text-slate-950 text-[9px] sm:text-[10px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0 shadow-sm animate-pulse">
              HOT DEALS
            </span>
            <span className="text-slate-200 font-medium truncate text-[11px] sm:text-xs">
              {siteSettings?.marqueeAnnouncement || 'Welcome to TEX WEAR Life Style — Premium Fashion & Lifestyle | Home Delivery Nationwide!'}
            </span>
          </div>

          {/* Top Info Links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6 text-slate-300 font-medium shrink-0">
            <Link
              href="/store-locator"
              className="flex items-center gap-1 hover:text-amber-400 transition-colors text-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Store Locator</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-1 hover:text-amber-400 transition-colors text-xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact Us</span>
            </Link>
            <a
              href={`tel:${siteSettings?.phone || '+8801623446677'}`}
              className="flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-bold hover:bg-[#D4AF37] hover:text-slate-950 transition-all text-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{siteSettings?.phone || '+8801623446677'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Middle Header */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2.5 flex items-center justify-between gap-1.5 sm:gap-4 w-full">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-lg text-slate-800 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <div className="shrink-0 max-w-[140px] sm:max-w-none">
          <Logo variant="light" />
        </div>

        {/* Desktop Search Trigger Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 bg-slate-100/90 border border-slate-300 rounded-full text-slate-600 hover:border-amber-500 hover:bg-slate-100 cursor-pointer shadow-xs transition-all group"
          >
            <span className="text-xs sm:text-sm font-medium group-hover:text-slate-900 truncate">
              Search Panjabi, Shirts, Kameez, Accessories...
            </span>
            <div className="p-1 rounded-full bg-[#D4AF37] text-slate-950 shrink-0 ml-2 shadow-xs">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
          {/* Search Button (Mobile & Tablet) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-1.5 rounded-full text-slate-800 hover:bg-slate-100"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            className="relative p-1.5 text-slate-800 hover:text-amber-600 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-900 rounded-full hover:bg-[#D4AF37] hover:text-slate-950 transition-all border border-slate-300 shadow-xs group font-bold"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-slate-900 group-hover:text-slate-950" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#D4AF37] group-hover:bg-slate-950 group-hover:text-amber-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold text-xs uppercase tracking-wide">
              Cart
            </span>
          </button>

          {/* Direct Order Quick Access Button - Metallic Gold Accent */}
          <Link
            href="/checkout"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#B8860B] hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-md transition-all hover:scale-105 border border-amber-300/60"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
            <span>Order Now</span>
          </Link>
        </div>
      </div>

      {/* Main Dropdown Mega Navigation Bar (Desktop Multi-Level) */}
      <nav
        className="hidden lg:block bg-white text-slate-900 border-t border-slate-200 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <ul className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider text-slate-900">
            {mainCategories.map((cat) => {
              const subcats = categories.filter((sub) => sub.parentId === cat.id);
              return (
                <li key={cat.id} className="relative group">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-1 py-3 px-4 text-slate-900 hover:bg-slate-100 hover:text-amber-600 transition-colors rounded-xs font-black"
                  >
                    <span>{cat.name}</span>
                    {subcats.length > 0 && <ChevronDown className="w-3.5 h-3.5 opacity-70" />}
                  </Link>

                  {/* 1st Level Submenu Dropdown */}
                  {subcats.length > 0 && (
                    <div className="absolute top-full left-0 hidden group-hover:block w-60 bg-white border border-slate-200 shadow-xl rounded-b-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <ul className="py-2 divide-y divide-slate-100">
                        {subcats.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`/category/${sub.slug}`}
                              className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-800 hover:text-slate-950 hover:bg-amber-50 transition-colors font-bold"
                            >
                              <span>{sub.name}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}

            <li>
              <Link
                href="/shop"
                className="flex items-center gap-1 py-3 px-4 text-amber-600 hover:bg-amber-500 hover:text-slate-950 transition-colors rounded-xs font-black"
              >
                <span>ALL PRODUCTS</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Offcanvas Accordion Navigation Drawer */}
      {mobileMenuOpen && mounted && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-slate-950 text-white h-full overflow-y-auto flex flex-col justify-between p-4 shadow-2xl animate-in slide-in-from-left duration-300 border-r border-slate-800">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <Logo variant="light" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Quick Order Button */}
              <div className="py-3">
                <Link
                  href="/checkout"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-sky-600 text-white rounded-xl font-extrabold text-xs uppercase shadow-md"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Order Now (সরাসরি অর্ডার)</span>
                </Link>
              </div>

              {/* Navigation Categories */}
              <div className="py-2">
                <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">
                  Browse Categories
                </p>
                <ul className="space-y-1 font-semibold text-sm">
                  {mainCategories.map((cat) => {
                    const subcats = categories.filter((sub) => sub.parentId === cat.id);
                    const isExpanded = expandedCat === cat.id;
                    return (
                      <li key={cat.id} className="border-b border-slate-900 pb-1">
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/category/${cat.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-2 text-slate-200 hover:text-sky-400 font-bold text-xs uppercase"
                          >
                            {cat.name}
                          </Link>
                          {subcats.length > 0 && (
                            <button
                              onClick={() => toggleCategoryExpand(cat.id)}
                              className="p-2 text-slate-400 hover:text-sky-400"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-sky-400' : ''
                                  }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* 1st Level Collapsible Subcategories */}
                        {isExpanded && subcats.length > 0 && (
                          <ul className="ml-3 pl-3 border-l-2 border-sky-500 space-y-1 py-1 text-xs">
                            {subcats.map((sub) => {
                              const childCats = categories.filter((c) => c.parentId === sub.id);
                              const isSubExpanded = expandedSubCat === sub.id;
                              return (
                                <li key={sub.id}>
                                  <div className="flex items-center justify-between">
                                    <Link
                                      href={`/category/${sub.slug}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block text-slate-300 hover:text-sky-400 py-1 font-semibold"
                                    >
                                      {sub.name}
                                    </Link>
                                    {childCats.length > 0 && (
                                      <button
                                        onClick={() => toggleSubCategoryExpand(sub.id)}
                                        className="p-1 text-slate-400 hover:text-sky-400"
                                      >
                                        <ChevronDown
                                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isSubExpanded ? 'rotate-180 text-sky-400' : ''
                                            }`}
                                        />
                                      </button>
                                    )}
                                  </div>

                                  {/* 2nd Level Collapsible Sub-subcategories */}
                                  {isSubExpanded && childCats.length > 0 && (
                                    <ul className="ml-3 pl-2 border-l border-slate-700 space-y-1 py-1 text-[11px]">
                                      {childCats.map((child) => (
                                        <li key={child.id}>
                                          <Link
                                            href={`/category/${child.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block text-slate-400 hover:text-sky-400 py-0.5"
                                          >
                                            {child.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Bottom Contact Banner */}
            <div className="pt-4 border-t border-slate-900 space-y-2">
              <a
                href={`tel:${siteSettings?.phone || '+8801623446677'}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-sky-600 text-white rounded-xl font-bold text-xs uppercase shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Hotline: {siteSettings?.phone || '+8801623446677'}</span>
              </a>
            </div>
          </div>

          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>,
        document.body
      )}
    </header>
  );
};
