'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { CheckCircle, PhoneCall, Printer, ShoppingBag, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const { orders } = useShop();

  const order = orders.find((o) => o.id === resolvedParams.orderId) || orders[0];

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Order Details Not Found</h2>
        <Link href="/" className="text-sky-600 font-bold underline mt-2 inline-block">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-8">
          {/* Success Icon Header */}
          <div className="space-y-3">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
              আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে। আমাদের কাস্টমার রিপ্রেজেন্টেটিভ শীঘ্রই ফোন করে অর্ডার কনফার্ম করবেন।
            </p>
          </div>

          {/* Order Details Receipt Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Order Invoice ID
                </span>
                <h3 className="text-lg font-black text-sky-600 dark:text-sky-400">
                  {order.orderNumber}
                </h3>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  Status
                </span>
                <span className="inline-block bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-0.5 rounded-full">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Customer Info:
                </span>
                <p className="font-black text-slate-900 dark:text-white">{order.customer.fullName}</p>
                <p className="text-slate-600 dark:text-slate-300 font-semibold">{order.customer.phoneNumber}</p>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Delivery Address:
                </span>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {order.customer.deliveryAddress}
                </p>
                <p className="text-sky-600 font-bold uppercase text-[10px] mt-0.5">
                  {order.customer.districtArea.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Items Summary Table */}
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2 text-xs">
                Items Ordered:
              </span>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-10 h-12 object-cover rounded-md"
                      />
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.product.title}
                        </h5>
                        <p className="text-[10px] text-slate-400">
                          Size: {item.selectedSize} | Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <span className="font-black text-slate-900 dark:text-white">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-1 text-xs text-right">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping Fee:</span>
                <span className="font-bold text-slate-900 dark:text-white">৳{order.shippingFee}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Total Amount:</span>
                <span className="text-sky-600 dark:text-sky-400">৳{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
