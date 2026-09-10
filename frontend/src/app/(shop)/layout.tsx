'use client';

import React from 'react';
import { ShopProvider } from '@/context/ShopContext';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { QuickOrderModal } from '@/components/shop/QuickOrderModal';
import { SearchModal } from '@/components/shop/SearchModal';
import { Toaster } from 'react-hot-toast';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-sky-500 selection:text-white">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <QuickOrderModal />
        <SearchModal />
      </div>
    </ShopProvider>
  );
}
