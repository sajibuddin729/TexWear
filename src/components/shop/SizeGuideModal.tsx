'use client';

import React, { useState } from 'react';
import { X, Ruler, HelpCircle, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'pants' | 'tops' | 'shoes';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'pants',
}) => {
  const [activeCategory, setActiveCategory] = useState<'pants' | 'tops' | 'shoes'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-slate-950 dark:text-white">
                TEX WEAR Official Size Guide
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Accurate measurement chart for Bangladeshi standard fitting (Inches & CM)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('pants')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'pants'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-sky-600 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>👖 Pants & Jeans (30, 31, 32...)</span>
          </button>

          <button
            onClick={() => setActiveCategory('tops')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'tops'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-sky-600 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>👕 Shirts & Tops (M, L, XL, XXL)</span>
          </button>

          <button
            onClick={() => setActiveCategory('shoes')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'shoes'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-sky-600 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>👞 Shoes & Footwear (39 - 45)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Pants Chart */}
          {activeCategory === 'pants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Pants / Jeans / Chinos Measurement Chart (Inches)
                </span>
                <span className="text-[11px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                  Standard Waist Fit
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[11px]">
                    <tr>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Size (Waist)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Waist (কোমর)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Length (লম্বা)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Hip (হিপ)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Thigh (থাই)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Inseam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-800 dark:text-slate-200 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">28</td>
                      <td className="p-3">28&quot; - 29&quot;</td>
                      <td className="p-3">39&quot; - 40&quot;</td>
                      <td className="p-3">36&quot;</td>
                      <td className="p-3">21&quot;</td>
                      <td className="p-3">30&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">30</td>
                      <td className="p-3">30&quot; - 31&quot;</td>
                      <td className="p-3">40&quot;</td>
                      <td className="p-3">38&quot;</td>
                      <td className="p-3">22&quot;</td>
                      <td className="p-3">30.5&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">31</td>
                      <td className="p-3">31&quot; - 32&quot;</td>
                      <td className="p-3">40.5&quot;</td>
                      <td className="p-3">39&quot;</td>
                      <td className="p-3">22.5&quot;</td>
                      <td className="p-3">31&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">32</td>
                      <td className="p-3">32&quot; - 33&quot;</td>
                      <td className="p-3">41&quot;</td>
                      <td className="p-3">40&quot;</td>
                      <td className="p-3">23&quot;</td>
                      <td className="p-3">31&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">33</td>
                      <td className="p-3">33&quot; - 34&quot;</td>
                      <td className="p-3">41.5&quot;</td>
                      <td className="p-3">41&quot;</td>
                      <td className="p-3">23.5&quot;</td>
                      <td className="p-3">31.5&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">34</td>
                      <td className="p-3">34&quot; - 35&quot;</td>
                      <td className="p-3">42&quot;</td>
                      <td className="p-3">42&quot;</td>
                      <td className="p-3">24&quot;</td>
                      <td className="p-3">32&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">36</td>
                      <td className="p-3">36&quot; - 37&quot;</td>
                      <td className="p-3">42&quot; - 43&quot;</td>
                      <td className="p-3">44&quot;</td>
                      <td className="p-3">25&quot;</td>
                      <td className="p-3">32&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">38</td>
                      <td className="p-3">38&quot; - 39&quot;</td>
                      <td className="p-3">43&quot;</td>
                      <td className="p-3">46&quot;</td>
                      <td className="p-3">26&quot;</td>
                      <td className="p-3">32.5&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>প্যান্টের সঠিক সাইজ নির্ধারণের টিপস:</span>
                </p>
                <p>
                  আপনার নিয়মিত পরা যেকোনো পারফেক্ট ফিটিং প্যান্টের বোতাম লাগিয়ে ফিতা দিয়ে কোমর মেপে সাইজ নিশ্চিত করুন। যদি কোমরের মাপ ৩১ ইঞ্চি হয়, তবে আরামদায়ক ফিটিংয়ের জন্য সাইজ ৩১ বা ৩২ বেছে নিন।
                </p>
              </div>
            </div>
          )}

          {/* Tops Chart */}
          {activeCategory === 'tops' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Shirts / Panjabi / Polo / T-Shirts Measurement (Inches)
                </span>
                <span className="text-[11px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                  Comfort Regular Fit
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[11px]">
                    <tr>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Size</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Chest (বুকের মাপ)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Length (লম্বা)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Shoulder (কাঁধ)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Sleeve (হাতা)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-800 dark:text-slate-200 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">S (Small)</td>
                      <td className="p-3">38&quot;</td>
                      <td className="p-3">27&quot;</td>
                      <td className="p-3">16.5&quot;</td>
                      <td className="p-3">8&quot; / 24&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">M (Medium)</td>
                      <td className="p-3">40&quot;</td>
                      <td className="p-3">28&quot;</td>
                      <td className="p-3">17.5&quot;</td>
                      <td className="p-3">8.5&quot; / 24.5&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">L (Large)</td>
                      <td className="p-3">42&quot;</td>
                      <td className="p-3">29&quot;</td>
                      <td className="p-3">18.5&quot;</td>
                      <td className="p-3">9&quot; / 25&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">XL (Extra Large)</td>
                      <td className="p-3">44&quot;</td>
                      <td className="p-3">30&quot;</td>
                      <td className="p-3">19.5&quot;</td>
                      <td className="p-3">9.5&quot; / 25.5&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">XXL (2XL)</td>
                      <td className="p-3">46&quot;</td>
                      <td className="p-3">31&quot;</td>
                      <td className="p-3">20.5&quot;</td>
                      <td className="p-3">10&quot; / 26&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">3XL (Triple Large)</td>
                      <td className="p-3">48&quot;</td>
                      <td className="p-3">32&quot;</td>
                      <td className="p-3">21.5&quot;</td>
                      <td className="p-3">10.5&quot; / 26.5&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 text-[11px] text-sky-900 dark:text-sky-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>শার্ট/পাঞ্জাবি মাপার নিয়ম:</span>
                </p>
                <p>
                  বুকের মাপ বলতে পুরো বুকের চারপাশের পরিধি বুঝায়। দুই বগলের নিচের অংশ বরাবর ফিতা রেখে পরিমাপ করুন।
                </p>
              </div>
            </div>
          )}

          {/* Shoes Chart */}
          {activeCategory === 'shoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Footwear Size Conversion & Length
                </span>
                <span className="text-[11px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
                  EU / BD Standard
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[11px]">
                    <tr>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">BD / EU Size</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">UK Size</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">US Size</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Foot Length (CM)</th>
                      <th className="p-3 border-b border-slate-200 dark:border-slate-800">Inches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900 text-slate-800 dark:text-slate-200 font-medium">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">39</td>
                      <td className="p-3">5.5</td>
                      <td className="p-3">6.5</td>
                      <td className="p-3">24.5 cm</td>
                      <td className="p-3">9.6&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">40</td>
                      <td className="p-3">6.0</td>
                      <td className="p-3">7.0</td>
                      <td className="p-3">25.0 cm</td>
                      <td className="p-3">9.8&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">41</td>
                      <td className="p-3">7.0</td>
                      <td className="p-3">8.0</td>
                      <td className="p-3">25.5 cm</td>
                      <td className="p-3">10.0&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">42</td>
                      <td className="p-3">7.5</td>
                      <td className="p-3">8.5</td>
                      <td className="p-3">26.0 cm</td>
                      <td className="p-3">10.2&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">43</td>
                      <td className="p-3">8.5</td>
                      <td className="p-3">9.5</td>
                      <td className="p-3">26.5 cm</td>
                      <td className="p-3">10.4&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-slate-50/50 dark:bg-slate-900/20">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">44</td>
                      <td className="p-3">9.5</td>
                      <td className="p-3">10.5</td>
                      <td className="p-3">27.5 cm</td>
                      <td className="p-3">10.8&quot;</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-3 font-black text-sky-600 dark:text-sky-400">45</td>
                      <td className="p-3">10.5</td>
                      <td className="p-3">11.5</td>
                      <td className="p-3">28.5 cm</td>
                      <td className="p-3">11.2&quot;</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>পায়ের মাপ নেওয়ার নিয়ম:</span>
                </p>
                <p>
                  কাগজের উপর সোজা দাঁড়িয়ে গোড়ালি থেকে সবচেয়ে বড় আঙুলের ডগা পর্যন্ত স্কেল দিয়ে মেপে সেন্টিমিটার (CM) মিলিয়ে সাইজ নির্বাচন করুন।
                </p>
              </div>
            </div>
          )}

          {/* Quick measurement guide */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                সাইজ নিয়ে কনফিউশন আছে?
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                যেকোনো প্রয়োজনে আমাদের কাস্টমার হটলাইনে সরাসরি কল করে সাইজ নিশ্চিত হতে পারেন। আমাদের প্রতিনিধি আপনার পারফেক্ট সাইজ বেছে দিতে সাহায্য করবে।
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
