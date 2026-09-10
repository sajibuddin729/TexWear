'use client';

import React from 'react';
import { MapPin, PhoneCall, Clock, Sparkles } from 'lucide-react';
import { useShop } from '@/context/ShopContext';

export default function StoreLocatorPage() {
  const { storeLocations } = useShop();

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3">
          <span className="bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/40 px-3 py-1 rounded-full font-black text-xs uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            FIND US NEAR YOU
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Tex Wear Store Locator
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
            Visit our physical outlets across Bangladesh to experience our fabrics and collection in person.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storeLocations.map((store) => (
            <div
              key={store.id}
              className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden transition-all hover:border-amber-400/50"
            >
              {store.isFlagship && (
                <div className="absolute top-4 right-4 bg-[#D4AF37] text-slate-950 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
                  Flagship Store
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-400/10 text-amber-500 rounded-2xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white pr-20">
                  {store.name}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-500" />
                  <a href={`tel:${store.phone}`} className="font-bold text-amber-500 hover:underline">
                    {store.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{store.hours}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
