'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, ShieldCheck, CheckCircle2, Truck, PhoneCall, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartSubtotal, placeOrder } = useShop();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [districtArea, setDistrictArea] = useState('inside_dhaka');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash / Mobile Wallet'>('Cash on Delivery');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartSubtotal();

  let shippingFee = 70;
  if (districtArea === 'suburbs_dhaka') shippingFee = 100;
  if (districtArea === 'outside_dhaka') shippingFee = 130;

  const totalAmount = Math.max(0, subtotal + shippingFee - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'TEX10') {
      setDiscount(Math.round(subtotal * 0.1));
      toast.success('Coupon TEX10 Applied! 10% Discount given');
    } else {
      toast.error('Invalid Coupon Code. Try "TEX10"');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!fullName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      toast.error('Please fill in required fields (*)');
      return;
    }

    if (phoneNumber.length < 11) {
      toast.error('Please enter a valid 11-digit mobile number');
      return;
    }

    const order = placeOrder(
      {
        fullName,
        phoneNumber,
        alternativePhone,
        deliveryAddress,
        districtArea,
        note,
      },
      paymentMethod
    );

    router.push(`/order-success/${order.id}`);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-sky-600 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md"
          >
            Explore Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-sky-600 mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Shopping</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Guest Checkout (সরাসরি অর্ডার ক্যাশ অন ডেলিভারি)
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>No Account or Password Required</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer Info Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Details */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-2 border-sky-500 pl-2">
                1. Customer & Shipping Details (শিপিংয়ের ঠিকানা)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (আপনার পূর্ণ নাম) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sajib Ahmed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number (মোবাইল নম্বর) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alternative Contact Number (বিকল্প মোবাইল নম্বর - optional)
                </label>
                <input
                  type="tel"
                  placeholder="018XXXXXXXX"
                  value={alternativePhone}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Delivery Address (সম্পূর্ণ ঠিকানা) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="House Number, Road Name/Number, Flat, Thana, District..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Step 2: Delivery Area */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-2 border-sky-500 pl-2">
                2. Delivery Area (ডেলিভারি এলাকা নির্বাচন করুন)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    districtArea === 'inside_dhaka'
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="area"
                    value="inside_dhaka"
                    checked={districtArea === 'inside_dhaka'}
                    onChange={() => setDistrictArea('inside_dhaka')}
                    className="sr-only"
                  />
                  <span className="font-extrabold text-xs">Inside Dhaka</span>
                  <span className="text-xs text-sky-600 font-black mt-1">৳70 (24-48 hrs)</span>
                </label>

                <label
                  className={`flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    districtArea === 'suburbs_dhaka'
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="area"
                    value="suburbs_dhaka"
                    checked={districtArea === 'suburbs_dhaka'}
                    onChange={() => setDistrictArea('suburbs_dhaka')}
                    className="sr-only"
                  />
                  <span className="font-extrabold text-xs">Dhaka Suburbs</span>
                  <span className="text-xs text-sky-600 font-black mt-1">৳100 (2-3 days)</span>
                </label>

                <label
                  className={`flex flex-col justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    districtArea === 'outside_dhaka'
                      ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="area"
                    value="outside_dhaka"
                    checked={districtArea === 'outside_dhaka'}
                    onChange={() => setDistrictArea('outside_dhaka')}
                    className="sr-only"
                  />
                  <span className="font-extrabold text-xs">Outside Dhaka</span>
                  <span className="text-xs text-sky-600 font-black mt-1">৳130 (3-5 days)</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Order Note / Special Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, deliver in afternoon..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-2 border-sky-500 pl-2">
                3. Payment Method (পেমেন্ট পদ্ধতি)
              </h3>

              <div className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                    />
                    <div>
                      <span className="font-extrabold text-xs block">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
                      <span className="text-[11px] text-slate-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</span>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                    RECOMMENDED
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'bKash / Mobile Wallet'
                      ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500 text-pink-900 dark:text-pink-200'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bKash / Mobile Wallet'}
                      onChange={() => setPaymentMethod('bKash / Mobile Wallet')}
                    />
                    <div>
                      <span className="font-extrabold text-xs block">bKash / Nagad Mobile Wallet</span>
                      <span className="text-[11px] text-slate-500">বিকাশ বা নগদের মাধ্যমে প্রিপেইড পেমেন্ট</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-28">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-2 border-sky-500 pl-2">
                Order Summary ({cart.length} Items)
              </h3>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-14 h-16 object-cover rounded-lg bg-slate-100"
                    />
                    <div className="flex-1">
                      <h5 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {item.product.title}
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        Size: {item.selectedSize} | Color: {item.selectedColor.name}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-slate-500 font-medium">Qty: {item.quantity}</span>
                        <span className="font-black text-slate-900 dark:text-white">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. TEX10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-2 text-xs border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping Charge</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ৳{shippingFee}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-xl text-sky-600 dark:text-sky-400">
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-sm uppercase tracking-widest rounded-xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-101"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>PLACE ORDER NOW (অর্ডার কনফার্ম করুন)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
