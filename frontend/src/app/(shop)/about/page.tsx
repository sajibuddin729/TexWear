import React from 'react';

export default function AboutPage() {
  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-sky-600 font-extrabold text-xs uppercase tracking-widest">
            TEX WEAR — LIFE STYLE
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            About Tex Wear Life Style
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-xl mx-auto">
            Crafting luxury Bangladeshi apparel with modern fits, vibrant colors, and unparalleled comfort.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Established with a vision to redefine Bangladeshi fashion, <strong>TEX WEAR — Life Style</strong> represents the perfect blend of traditional artistry and contemporary elegance.
          </p>
          <p>
            From our signature handcrafted silk panjabi and festive ethnic wear to crisp 100% cotton executive shirts, ladies 3-piece salwar kameez, and genuine leather accessories — every TEX WEAR piece is meticulously created using premium fabrics and precision tailoring.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <h3 className="text-2xl font-black text-sky-600">100%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">Original Crafts</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <h3 className="text-2xl font-black text-emerald-600">64</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">Districts Shipping</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
              <h3 className="text-2xl font-black text-pink-600">50,000+</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
