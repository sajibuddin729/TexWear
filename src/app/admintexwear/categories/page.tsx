'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Category } from '@/types';
import {
  Plus,
  FolderTree,
  Trash2,
  Edit,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Search,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');

  // Loading States
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setParentId('');
    setImageUrl('');
    setImageTab('upload');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setParentId(cat.parentId || '');
    setImageUrl(cat.image || '');
    setImageTab(cat.image?.startsWith('data:') ? 'upload' : 'upload');
    setIsModalOpen(true);
  };

  // Helper to compress/optimize image before storing
  const compressImage = (file: File, maxWidth = 1000, quality = 0.78): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml' || file.size < 80 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(outputType, quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(event.target?.result as string);
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Device File Upload Handler (Compress + upload via binary FormData to keep payload small)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressedDataUrl = await compressImage(file);
      if (compressedDataUrl) {
        // Attempt direct FormData upload to /api/upload to avoid 413 JSON payload limit
        try {
          const blob = await (await fetch(compressedDataUrl)).blob();
          const formData = new FormData();
          formData.append('file', blob, file.name || 'category.jpg');

          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.success && uploadData.url) {
              setImageUrl(uploadData.url);
              toast.success(`Image uploaded: ${file.name}`);
              return;
            }
          }
        } catch (uploadErr) {
          console.warn('Direct upload fallback to compressed data URL:', uploadErr);
        }

        setImageUrl(compressedDataUrl);
        toast.success(`Image uploaded: ${file.name}`);
      }
    } catch {
      toast.error('Failed to read image file from device');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Category Name is required');
      return;
    }

    setIsSaving(true);
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      if (editingCategory) {
        await updateCategory({
          ...editingCategory,
          name: name.trim(),
          slug,
          parentId: parentId || null,
          image: imageUrl.trim() || undefined,
        });
      } else {
        await addCategory({
          name: name.trim(),
          slug,
          parentId: parentId || null,
          image: imageUrl.trim() || undefined,
          itemCount: 0,
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving category:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?\nAny subcategories will become main categories.`)) {
      return;
    }

    setDeletingId(cat.id);
    try {
      await deleteCategory(cat.id);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mainCount = categories.filter((c) => !c.parentId).length;
  const subCount = categories.filter((c) => c.parentId).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2.5">
            <FolderTree className="w-7 h-7 text-sky-400" />
            <span>Category Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Manage storefront categories, circular shop-by-category images, and subcategories live in database.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Stats and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Categories Stat */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Main Categories</p>
              <p className="text-xl font-black text-white">{mainCount}</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Shows on Homepage</span>
        </div>

        {/* Subcategories Stat */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subcategories</p>
              <p className="text-xl font-black text-white">{subCount}</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500">Filtered in Menus</span>
        </div>

        {/* Search Input */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center shadow-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Type / Hierarchy</th>
                <th className="p-4 text-center">Image Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No categories found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const parentCat = categories.find((c) => c.id === cat.parentId);
                  return (
                    <tr key={cat.id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Name & Circular Image */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-900 shrink-0 shadow-sm group">
                            <img
                              src={cat.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80'}
                              alt={cat.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                              className="w-full h-full object-cover object-center rounded-full block"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80';
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-extrabold text-white text-sm block">{cat.name}</span>
                            <span className="text-[10px] text-slate-400">ID: {cat.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="p-4 font-mono text-slate-400">{cat.slug}</td>

                      {/* Type */}
                      <td className="p-4">
                        {parentCat ? (
                          <span className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full">
                            <span>Sub of</span>
                            <span className="text-white font-extrabold">{parentCat.name}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 font-bold text-[10px] uppercase px-2.5 py-1 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            <span>Main Category</span>
                          </span>
                        )}
                      </td>

                      {/* Image Preview & Status */}
                      <td className="p-4 text-center">
                        {cat.image ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Custom Image</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">Default Placeholder</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-sky-600/20 text-sky-400 border border-slate-800 hover:border-sky-500/40 font-bold text-xs transition-colors"
                            title="Edit Category & Image"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit / Image</span>
                          </button>

                          <button
                            onClick={() => handleDelete(cat)}
                            disabled={deletingId === cat.id}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-red-900/30 text-red-400 border border-slate-800 hover:border-red-500/40 transition-colors disabled:opacity-50"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-white">
                    {editingCategory ? 'Edit Category & Image' : 'Add New Category'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Upload image from your device or paste URL
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {/* Category Name */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER COLLECTION, PANJABI, SHOES..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5 uppercase tracking-wider text-[11px]">
                  Parent Category (Optional)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white font-medium focus:outline-none focus:border-sky-500 transition-colors"
                >
                  <option value="">None (Set as Main Top-Level Category)</option>
                  {categories
                    .filter((c) => !c.parentId && c.id !== editingCategory?.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Main categories appear in the circular "Shop By Category" grid on the Homepage.
                </p>
              </div>

              {/* Category Image Box */}
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-sky-400" />
                    <span>Category Image</span>
                  </label>

                  {/* Switch Tab between Device Upload and URL */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        imageTab === 'upload'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      From Device
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        imageTab === 'url'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Paste URL
                    </button>
                  </div>
                </div>

                {/* Live Image Preview (Both Circular and Card view) */}
                <div className="flex items-center gap-4 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37] bg-slate-900 shrink-0 shadow-md">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                        className="w-full h-full object-cover object-center rounded-full block"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-[9px] text-center p-1 font-bold">
                        <ImageIcon className="w-5 h-5 mb-0.5 text-slate-500" />
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-[11px] font-black uppercase text-white tracking-wider">
                      Live Circular Preview
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      This is exactly how your category circle will look on the homepage.
                    </p>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="text-[10px] text-red-400 hover:text-red-300 font-bold underline inline-flex items-center gap-1 pt-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Image</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Device Upload Mode */}
                {imageTab === 'upload' ? (
                  <div>
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-sky-500 bg-slate-950 hover:bg-slate-950/80 rounded-2xl cursor-pointer transition-all group text-center">
                      <div className="w-10 h-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="font-black text-xs text-white">
                        {isUploading ? 'Reading Image...' : 'Click to Upload from Device'}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  /* Web Image URL Mode */
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-400">
                      Direct Web Image URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] focus:outline-none focus:border-sky-500"
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl font-bold uppercase transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white rounded-xl font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-2 transition-transform hover:scale-102"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
