'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { X, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const QuickOrderModal: React.FC = () => {
  const router = useRouter();
  const { quickOrderProduct, setQuickOrderProduct, placeOrder } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string }>({ name: '', hex: '' });
  const [quantity, setQuantity] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [districtArea, setDistrictArea] = useState('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash / Mobile Wallet'>('Cash on Delivery');

  if (!quickOrderProduct) return null;

  const product = quickOrderProduct;
  const currentSize = selectedSize || product.sizes[0] || 'Standard';
  const currentColor = selectedColor.name ? selectedColor : product.colors[0] || { name: 'Default', hex: '#000000' };

  let shippingFee = 70;
  if (districtArea === 'suburbs_dhaka') shippingFee = 100;
  if (districtArea === 'outside_dhaka') shippingFee = 130;

  const itemTotal = product.price * quantity;
  const grandTotal = itemTotal + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim() || !deliveryAddress.trim()) {
      toast.error('Please fill in your Name, Phone Number, and Address');
      return;
    }

    if (phoneNumber.length < 11) {
      toast.error('Please enter a valid 11-digit Bangladeshi mobile number');
      return;
    }

    const orderItem = [
      {
        product,
        selectedSize: currentSize,
        selectedColor: currentColor,
        quantity,
      },
    ];

    const newOrder = placeOrder(
      {
        fullName,
        phoneNumber,
        deliveryAddress,
        districtArea,
      },
      paymentMethod,
      orderItem
    );

    setQuickOrderProduct(null);
    router.push(`/order-success/${newOrder.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase tracking-tight">
                Quick Order Form (সহজ অর্ডার)
              </h3>
              <p className="text-[11px] text-slate-300">
                অর্ডার করতে আপনার নাম, মোবাইল নম্বর ও ঠিকানা দিন
              </p>
            </div>
          </div>

          <button
            onClick={() => setQuickOrderProduct(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Product Summary Row */}
          <div className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-20 h-24 object-cover object-top rounded-lg"
            />
            <div className="flex-1 space-y-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                {product.title}
              </h4>
              <p className="text-sm font-black text-sky-600 dark:text-sky-400">
                ৳{product.price.toLocaleString()}
              </p>

              {/* Variant Selector */}
              <div className="flex flex-wrap gap-3 pt-1 text-xs">
                {/* Size */}
                {product.sizes.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500 font-medium">Size:</span>
                    <div className="flex items-center gap-1">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                            currentSize === sz
                              ? 'bg-sky-600 text-white border-sky-600'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Details Inputs */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white border-l-2 border-sky-500 pl-2">
              Deliver Information (শিপিং তথ্য)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name (আপনার নাম) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajib Rahman"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number (মোবাইল নম্বর) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Address (সম্পূর্ণ ঠিকানা) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="House No, Road No, Area, Thana..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Delivery Area Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Delivery Area (ডেলিভারি এলাকা) *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer text-xs font-bold transition-all ${
                    districtArea === 'inside_dhaka'
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quickArea"
                    value="inside_dhaka"
                    checked={districtArea === 'inside_dhaka'}
                    onChange={() => setDistrictArea('inside_dhaka')}
                    className="sr-only"
                  />
                  <span>Inside Dhaka</span>
                  <span>৳70</span>
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer text-xs font-bold transition-all ${
                    districtArea === 'suburbs_dhaka'
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quickArea"
                    value="suburbs_dhaka"
                    checked={districtArea === 'suburbs_dhaka'}
                    onChange={() => setDistrictArea('suburbs_dhaka')}
                    className="sr-only"
                  />
                  <span>Dhaka Suburbs</span>
                  <span>৳100</span>
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer text-xs font-bold transition-all ${
                    districtArea === 'outside_dhaka'
                      ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="quickArea"
                    value="outside_dhaka"
                    checked={districtArea === 'outside_dhaka'}
                    onChange={() => setDistrictArea('outside_dhaka')}
                    className="sr-only"
                  />
                  <span>Outside Dhaka</span>
                  <span>৳130</span>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing & Submit */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-sm font-black text-slate-900 dark:text-white">
              <span>Total Payable Amount:</span>
              <span className="text-xl text-sky-600 dark:text-sky-400">
                ৳{grandTotal.toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-101"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>CONFIRM ORDER NOW (অর্ডার কনফার্ম করুন)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
