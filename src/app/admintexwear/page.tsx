'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { Package, FolderTree, ShoppingBag, DollarSign, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { products, categories, orders } = useShop();

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          Admin Dashboard Overview
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Welcome to TEX WEAR — Life Style Management Console
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">
            ৳{totalSales.toLocaleString()}
          </h2>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Lifetime Store Earnings</span>
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">{orders.length}</h2>
          <p className="text-[11px] text-sky-400 font-semibold">Guest & Store Orders</p>
        </div>

        {/* Total Products */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Active Products
            </span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">{products.length}</h2>
          <p className="text-[11px] text-purple-400 font-semibold">Catalog Items</p>
        </div>

        {/* Categories */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Categories
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white">{categories.length}</h2>
          <p className="text-[11px] text-amber-400 font-semibold">Product Classifications</p>
        </div>
      </div>

      {/* Recent Customer Orders Section */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-base font-black uppercase tracking-wider text-white">
            Recent Customer Orders
          </h2>
          <Link
            href="/admintexwear/orders"
            className="text-xs font-bold text-sky-400 hover:underline uppercase tracking-wider"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/60">
                  <td className="p-3 font-black text-sky-400">{ord.orderNumber}</td>
                  <td className="p-3 font-bold text-white">{ord.customer.fullName}</td>
                  <td className="p-3">{ord.customer.phoneNumber}</td>
                  <td className="p-3 font-black text-white">৳{ord.totalAmount.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="bg-amber-500/20 text-amber-400 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full border border-amber-500/30">
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
