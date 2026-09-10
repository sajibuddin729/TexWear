'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { StoreLocationData } from '@/data/initialData';
import { Settings, MapPin, PhoneCall, Mail, Building, Megaphone, Plus, Edit2, Trash2, CheckCircle2, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings, storeLocations, addStoreLocation, updateStoreLocation, deleteStoreLocation } = useShop();

  // General Settings Form state
  const [formData, setFormData] = useState({
    storeName: siteSettings.storeName || '',
    phone: siteSettings.phone || '',
    email: siteSettings.email || '',
    address: siteSettings.address || '',
    marqueeAnnouncement: siteSettings.marqueeAnnouncement || '',
    facebookUrl: siteSettings.facebookUrl || '',
    instagramUrl: siteSettings.instagramUrl || '',
  });

  const [savingSettings, setSavingSettings] = useState(false);

  // Store Modal State
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreLocationData | null>(null);
  const [storeForm, setStoreForm] = useState({
    name: '',
    address: '',
    phone: '',
    hours: '10:00 AM - 9:30 PM (7 Days Open)',
    mapUrl: '',
    isFlagship: false,
  });

  useEffect(() => {
    setFormData({
      storeName: siteSettings.storeName || '',
      phone: siteSettings.phone || '',
      email: siteSettings.email || '',
      address: siteSettings.address || '',
      marqueeAnnouncement: siteSettings.marqueeAnnouncement || '',
      facebookUrl: siteSettings.facebookUrl || '',
      instagramUrl: siteSettings.instagramUrl || '',
    });
  }, [siteSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSiteSettings(formData);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenAddStoreModal = () => {
    setEditingStore(null);
    setStoreForm({
      name: '',
      address: '',
      phone: siteSettings.phone || '+8801623446677',
      hours: '10:00 AM - 9:30 PM (7 Days Open)',
      mapUrl: '',
      isFlagship: false,
    });
    setIsStoreModalOpen(true);
  };

  const handleOpenEditStoreModal = (store: StoreLocationData) => {
    setEditingStore(store);
    setStoreForm({
      name: store.name,
      address: store.address,
      phone: store.phone,
      hours: store.hours,
      mapUrl: store.mapUrl || '',
      isFlagship: Boolean(store.isFlagship),
    });
    setIsStoreModalOpen(true);
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeForm.name || !storeForm.address || !storeForm.phone) {
      toast.error('Please fill in Store Name, Address and Phone Number');
      return;
    }

    if (editingStore) {
      await updateStoreLocation({
        id: editingStore.id,
        ...storeForm,
      });
    } else {
      await addStoreLocation(storeForm);
    }

    setIsStoreModalOpen(false);
  };

  const handleDeleteStore = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteStoreLocation(id);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
          <Settings className="w-8 h-8 text-amber-400" />
          <span>Site Settings & Store Locations</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Manage corporate contact details, hotline number, header announcement, and physical store outlets live on your website.
        </p>
      </div>

      {/* General Settings Card */}
      <form onSubmit={handleSaveSettings} className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            <span>Store Contact & Info Settings</span>
          </h2>
          <button
            type="submit"
            disabled={savingSettings}
            className="bg-[#D4AF37] hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{savingSettings ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Brand Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <span>Store Brand Name</span>
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. TEX WEAR — Life Style"
            />
          </div>

          {/* Hotline / Customer Service Phone */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Hotline / Contact Number</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. +8801623446677"
            />
          </div>

          {/* Official Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-sky-400" />
              <span>Official Email Address</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. info@texwearlifestyle.com"
            />
          </div>

          {/* Corporate Office Address */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Corporate Address</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              placeholder="e.g. Level 4, Tex Wear Tower, Banani, Dhaka, Bangladesh"
            />
          </div>
        </div>

        {/* Top Header Marquee Announcement */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span>Header Marquee Announcement Bar Text</span>
          </label>
          <input
            type="text"
            value={formData.marqueeAnnouncement}
            onChange={(e) => setFormData({ ...formData, marqueeAnnouncement: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
            placeholder="e.g. Welcome to TEX WEAR Life Style — Premium Fashion & Lifestyle | Home Delivery Nationwide!"
          />
          <p className="text-[11px] text-slate-500">
            This text scrolls dynamically across the very top bar of the website Header.
          </p>
        </div>
      </form>

      {/* Store Outlets Management Section */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black uppercase tracking-wider text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>Physical Outlets & Store Locations ({storeLocations.length})</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add, update, or remove physical outlet locations shown on the /store-locator page.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddStoreModal}
            className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Outlet</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storeLocations.map((store) => (
            <div
              key={store.id}
              className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden"
            >
              {store.isFlagship && (
                <span className="absolute top-3 right-3 bg-[#D4AF37] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                  Flagship Store
                </span>
              )}

              <h3 className="font-bold text-white text-sm pr-20">{store.name}</h3>

              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{store.phone}</span>
                </p>
                <p className="text-slate-400 text-[11px] pl-5">Hours: {store.hours}</p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleOpenEditStoreModal(store)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteStore(store.id, store.name)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Store Modal */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-black uppercase tracking-wider text-white">
                {editingStore ? 'Edit Store Location' : 'Add New Outlet Location'}
              </h3>
              <button
                onClick={() => setIsStoreModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Outlet Name *
                </label>
                <input
                  type="text"
                  required
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Tex Wear Outlet - Dhanmondi 27"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={storeForm.address}
                  onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="e.g. Rapa Plaza, Level 2, Dhanmondi 27, Dhaka"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="+8801623446677"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={storeForm.hours}
                    onChange={(e) => setStoreForm({ ...storeForm, hours: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    placeholder="10:00 AM - 9:30 PM"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="flagship"
                  checked={storeForm.isFlagship}
                  onChange={(e) => setStoreForm({ ...storeForm, isFlagship: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <label htmlFor="flagship" className="text-xs font-bold text-slate-200 cursor-pointer">
                  Mark as Main Flagship Store
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStoreModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#D4AF37] hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  {editingStore ? 'Update Outlet' : 'Save Outlet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
