'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQty,
    getCartSubtotal,
    getCartCount,
  } = useShop();

  if (!isCartOpen) return null;

  const subtotal = getCartSubtotal();
  const cartCount = getCartCount();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-300">
      {/* Backdrop click */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Slide-over Drawer Panel */}
      <div className="w-full max-w-full sm:max-w-md h-full flex flex-col justify-between bg-white dark:bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-slate-800">
        {/* Drawer Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-600 text-white shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                Your Shopping Cart
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}-${index}`}
                className="flex gap-2.5 sm:gap-3.5 p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800"
              >
                {/* Thumbnail */}
                <img
                  src={item.product.images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80'}
                  alt={item.product.title}
                  className="w-16 h-20 sm:w-20 sm:h-24 object-cover object-top rounded-lg bg-slate-200 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor.name
                          )
                        }
                        className="text-slate-400 hover:text-red-500 transition-colors p-0.5 shrink-0 ml-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 mt-1">
                      <span className="font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-1.5 py-0.2 rounded-xs">
                        {item.selectedSize}
                      </span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-slate-400 shrink-0"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="truncate max-w-[80px]">{item.selectedColor.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shrink-0">
                      <button
                        onClick={() =>
                          updateCartQty(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor.name,
                            -1
                          )
                        }
                        className="p-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-black text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQty(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor.name,
                            1
                          )
                        }
                        className="p-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white shrink-0">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Discover our latest Panjabi, Shirts, Kameez & Accessories collections.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2 bg-sky-600 text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {cart.length > 0 && (
          <div className="p-3.5 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 space-y-3 shrink-0">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Estimated Shipping</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  Calculated at Checkout
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm sm:text-base font-black text-slate-900 dark:text-white">
                <span>Total</span>
                <span className="text-sky-600 dark:text-sky-400">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No login required! Fill form & place order directly.</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
