'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { LayoutDashboard, Package, FolderTree, ShoppingBag, Settings, ArrowLeft, Shield, LogOut, MessageSquareHeart } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  const links = [
    { href: '/admintexwear', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admintexwear/products', label: 'Products', icon: Package },
    { href: '/admintexwear/categories', label: 'Categories', icon: FolderTree },
    { href: '/admintexwear/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admintexwear/feedback', label: 'Customer Feedback', icon: MessageSquareHeart },
    { href: '/admintexwear/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen p-6 border-r border-slate-800 flex flex-col justify-between shrink-0">
      <div className="space-y-8">
        {/* Brand */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              <span>Admin Control</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition-colors"
              title="Logout Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <Logo variant="light" showSubtitle={false} />
        </div>

        {/* Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to Shop */}
      <div className="pt-6 border-t border-slate-900 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back To Main Shop</span>
        </Link>
      </div>
    </aside>
  );
};
