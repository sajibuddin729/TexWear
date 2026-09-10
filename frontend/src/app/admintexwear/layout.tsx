'use client';

import React, { useState } from 'react';
import { ShopProvider } from '@/context/ShopContext';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Toaster } from 'react-hot-toast';
import { Shield, Lock, Key, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminProtectedContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login } = useAdminAuth();
  const [passcode, setPasscode] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(passcode);
    if (success) {
      toast.success('Admin Passcode Authorized! Welcome.');
    } else {
      toast.error('Invalid Admin Passcode! Access Denied.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-sky-500/20 text-sky-400 rounded-2xl flex items-center justify-center mx-auto border border-sky-500/30 shadow-lg">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Tex Wear Admin Login
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Private access point. Enter Admin Security Passcode to continue.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-sky-400" />
                <span>Admin Passcode</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter passcode (default: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Protected route — Public users restricted</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      <AdminSidebar />
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShopProvider>
      <AdminAuthProvider>
        <Toaster position="top-right" />
        <AdminProtectedContent>{children}</AdminProtectedContent>
      </AdminAuthProvider>
    </ShopProvider>
  );
}
