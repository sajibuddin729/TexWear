'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Product } from '@/types';
import { Plus, Search, Trash2, Edit, X, Package, Upload, Image as ImageIcon, Check, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

const POPULAR_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Navy Blue', hex: '#0f172a' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Charcoal', hex: '#334155' },
  { name: 'Gray', hex: '#64748b' },
  { name: 'Olive Green', hex: '#4d7c0f' },
  { name: 'Forest Green', hex: '#14532d' },
  { name: 'Maroon', hex: '#881337' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Beige / Khaki', hex: '#d4b996' },
  { name: 'Brown', hex: '#78350f' },
];

export default function AdminProductsPage() {
  const { products, productsLoaded, categories, addProduct, updateProduct, deleteProduct, toggleFlashSale } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'flash' | 'new'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(1500);
  const [originalPrice, setOriginalPrice] = useState<number>(1800);
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [sizes, setSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: 'Black', hex: '#000000' },
    { name: 'Navy Blue', hex: '#0f172a' },
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#2563eb');
  const [description, setDescription] = useState('');
  const [stockCount, setStockCount] = useState<number>(30);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Size helper functions
  const handleToggleSize = (sizeToAddOrRemove: string) => {
    const trimmed = sizeToAddOrRemove.trim();
    if (!trimmed) return;
    if (sizes.includes(trimmed)) {
      setSizes(sizes.filter((s) => s !== trimmed));
    } else {
      setSizes([...sizes, trimmed]);
    }
  };

  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (!trimmed) return;
    if (!sizes.includes(trimmed)) {
      setSizes([...sizes, trimmed]);
    }
    setCustomSizeInput('');
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleSetPresetSizes = (presetSizes: string[]) => {
    setSizes(presetSizes);
  };

  // Color helper functions
  const handleToggleColor = (colorItem: { name: string; hex: string }) => {
    const exists = colors.some((c) => c.name.toLowerCase() === colorItem.name.toLowerCase());
    if (exists) {
      setColors(colors.filter((c) => c.name.toLowerCase() !== colorItem.name.toLowerCase()));
    } else {
      setColors([...colors, colorItem]);
    }
  };

  const handleAddCustomColor = () => {
    const trimmedName = customColorName.trim();
    if (!trimmedName) {
      toast.error('Please enter a color name (e.g. Olive, Sky Blue)');
      return;
    }
    const exists = colors.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      toast.error('This color is already added');
      return;
    }
    setColors([...colors, { name: trimmedName, hex: customColorHex }]);
    setCustomColorName('');
  };

  const handleRemoveColor = (nameToRemove: string) => {
    setColors(colors.filter((c) => c.name !== nameToRemove));
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to permanently delete "${product.title}"?\nThis action will immediately and permanently delete this product from the database.`)) {
      return;
    }

    setDeletingId(product.id);
    try {
      await deleteProduct(product.id);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'flash') return p.isFlashSale;
    if (activeFilter === 'new') return p.isNewArrival;
    return true;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSku(`TW-PR-${Math.floor(100 + Math.random() * 900)}`);
    setPrice(1850);
    setOriginalPrice(2200);
    setCategoryId(categories[0]?.id || '');
    setImages([]);
    setUrlInput('');
    setSizes(['M', 'L', 'XL', 'XXL']);
    setCustomSizeInput('');
    setColors([
      { name: 'Black', hex: '#000000' },
      { name: 'Navy Blue', hex: '#0f172a' },
    ]);
    setCustomColorName('');
    setCustomColorHex('#2563eb');
    setDescription('Premium TEX WEAR crafted product with modern silhouette and comfortable fabric.');
    setStockCount(40);
    setIsFlashSale(false);
    setIsNewArrival(true);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setSku(product.sku);
    setPrice(product.price);
    setOriginalPrice(product.originalPrice || product.price);
    setCategoryId(product.categoryId);
    setImages(product.images && product.images.length > 0 ? product.images : []);
    setUrlInput('');
    setSizes(product.sizes && product.sizes.length > 0 ? product.sizes : ['M', 'L', 'XL']);
    setCustomSizeInput('');
    setColors(
      product.colors && product.colors.length > 0
        ? product.colors
        : [
            { name: 'Black', hex: '#000000' },
            { name: 'Navy Blue', hex: '#0f172a' },
          ]
    );
    setCustomColorName('');
    setCustomColorHex('#2563eb');
    setDescription(product.description);
    setStockCount(product.stockCount);
    setIsFlashSale(!!product.isFlashSale);
    setIsNewArrival(!!product.isNewArrival);
    setIsModalOpen(true);
  };

  // Helper to compress/optimize image before storing
  const compressImage = (file: File, maxWidth = 1000, quality = 0.78): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml') {
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
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const compressedDataUrl = await compressImage(file);
        if (compressedDataUrl) {
          // Attempt direct FormData upload to /api/upload to avoid 413 JSON payload limit
          try {
            const blob = await (await fetch(compressedDataUrl)).blob();
            const formData = new FormData();
            formData.append('file', blob, file.name || 'product.jpg');

            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });

            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              if (uploadData.success && uploadData.url) {
                setImages((prev) => [...prev, uploadData.url]);
                toast.success(`Uploaded ${file.name}`);
                continue;
              }
            }
          } catch (uploadErr) {
            console.warn('Direct upload fallback to compressed data URL:', uploadErr);
          }

          // Fallback to lightweight compressed base64
          setImages((prev) => [...prev, compressedDataUrl]);
          toast.success(`Uploaded ${file.name}`);
        }
      } catch {
        toast.error(`Failed to read ${file.name}`);
      }
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
    toast.success('Image URL added');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !categoryId) {
      toast.error('Title and Category are required');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload or provide at least one product image');
      return;
    }

    if (!sizes || sizes.length === 0) {
      toast.error('Please select or add at least one available size (e.g. 30, 31, 32 or M, L, XL)');
      return;
    }

    if (!colors || colors.length === 0) {
      toast.error('Please select or add at least one color for the product');
      return;
    }

    setIsSaving(true);

    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const categoryName = selectedCategory ? selectedCategory.name : 'General';
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

      const finalImages = images;

      const productPayload = {
        title,
        slug,
        sku,
        price: Number(price),
        originalPrice: Number(originalPrice),
        discountPercentage: discountPercentage > 0 ? discountPercentage : 0,
        categoryId,
        categoryName,
        images: finalImages,
        sizes,
        colors,
        description,
        details: editingProduct?.details && editingProduct.details.length > 0 ? editingProduct.details : ['Fabric: Premium Cotton Blend', 'Fit: Modern Comfort Fit', 'Care: Machine Wash Cold'],
        inStock: stockCount > 0,
        stockCount: Number(stockCount),
        isNewArrival,
        isFlashSale,
        isBestSeller: true,
        rating: editingProduct?.rating || 4.9,
        reviewCount: editingProduct?.reviewCount || 12,
      };

      let success = false;
      if (editingProduct) {
        success = await updateProduct({
          ...productPayload,
          id: editingProduct.id,
          createdAt: editingProduct.createdAt,
        });
      } else {
        success = await addProduct(productPayload);
      }

      if (success) {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-sky-400" />
            <span>Product Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Add, update, or remove apparel items in your Tex Wear store
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            All Products ({productsLoaded ? products.length : '...'})
          </button>
          <button
            onClick={() => setActiveFilter('flash')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === 'flash'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-950 hover:bg-slate-900 text-amber-400 border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Flash Sale Only ({productsLoaded ? products.filter((p) => p.isFlashSale).length : '...'})</span>
          </button>
          <button
            onClick={() => setActiveFilter('new')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeFilter === 'new'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-950 hover:bg-slate-900 text-emerald-400 border border-slate-800'
            }`}
          >
            New Arrivals ({productsLoaded ? products.filter((p) => p.isNewArrival).length : '...'})
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Search by Title, SKU or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Flash Sale & Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {!productsLoaded ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-7 h-7 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Loading live products from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <Package className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
                    <p className="text-sm font-bold text-slate-400">No products found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {searchQuery ? 'Try adjusting your search query' : 'Click "Add New Product" to create one in your database'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-900/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-14 object-cover rounded-lg bg-slate-800"
                        />
                        <div>
                          <h4 className="font-bold text-white max-w-xs line-clamp-1">{product.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500 mt-0.5">
                            <span>Sizes: {product.sizes?.join(', ')}</span>
                            {product.colors && product.colors.length > 0 && (
                              <span className="flex items-center gap-1">
                                • Colors:
                                {product.colors.map((c, i) => (
                                  <span
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-full border border-slate-600 inline-block shadow-xs"
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  />
                                ))}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-sky-400">{product.categoryName}</td>
                    <td className="p-4 text-slate-400 font-mono">{product.sku}</td>
                    <td className="p-4 font-black text-white">৳{product.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span
                        className={`font-extrabold text-[10px] px-2.5 py-1 rounded-full ${
                          product.inStock
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {product.stockCount} units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleFlashSale(product.id, !product.isFlashSale)}
                          title={product.isFlashSale ? "Click to remove from Flash Sale" : "Click to add to Flash Sale"}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                            product.isFlashSale
                              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-red-500 hover:to-red-600 hover:text-white shadow-amber-500/20'
                              : 'bg-slate-900 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40'
                          }`}
                        >
                          <Zap className={`w-3.5 h-3.5 ${product.isFlashSale ? 'fill-slate-950' : 'text-slate-500'}`} />
                          <span>{product.isFlashSale ? 'FLASH (ON)' : '+ ADD FLASH'}</span>
                        </button>

                        {product.isNewArrival && (
                          <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase px-2 py-0.5 rounded border border-emerald-500/30">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          disabled={deletingId === product.id}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-red-900/40 text-red-400 transition-colors disabled:opacity-50"
                          title="Permanently Delete Product"
                        >
                          {deletingId === product.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black uppercase tracking-wide text-white">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TEX WEAR Executive Silk Panjabi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Selling Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Regular Price (৳)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={stockCount}
                    onChange={(e) => setStockCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-semibold"
                  />
                </div>
              </div>

              {/* Available Sizes Management */}
              <div className="space-y-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="block font-extrabold text-slate-200 uppercase tracking-wider">
                      Available Sizes *
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Select preset sizes, click to toggle, or type custom sizes (e.g. 30, 31, 32, M, L, XL).
                    </p>
                  </div>
                  {sizes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSizes([])}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                    >
                      Clear All ({sizes.length})
                    </button>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleSetPresetSizes(['28', '30', '31', '32', '33', '34', '36', '38'])}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-700 hover:border-sky-500 rounded-lg transition-colors"
                  >
                    Pants (28-38)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPresetSizes(['S', 'M', 'L', 'XL', 'XXL', '3XL'])}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-700 hover:border-sky-500 rounded-lg transition-colors"
                  >
                    Shirts / Panjabi (S-3XL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPresetSizes(['M', 'L', 'XL', 'XXL'])}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-700 hover:border-sky-500 rounded-lg transition-colors"
                  >
                    Standard (M-XXL)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPresetSizes(['39', '40', '41', '42', '43', '44', '45'])}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-700 hover:border-sky-500 rounded-lg transition-colors"
                  >
                    Shoes (39-45)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetPresetSizes(['Free Size'])}
                    className="px-2.5 py-1 text-[11px] font-bold bg-slate-950 hover:bg-slate-800 text-sky-400 border border-slate-700 hover:border-sky-500 rounded-lg transition-colors"
                  >
                    Free Size
                  </button>
                </div>

                {/* Common Size Toggles */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-400">Quick Toggle Pants Sizes:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['28', '29', '30', '31', '32', '33', '34', '35', '36', '38', '40'].map((sz) => {
                      const isSelected = sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleToggleSize(sz)}
                          className={`w-9 h-8 rounded-lg text-xs font-black transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-1 ring-sky-400'
                              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400">Quick Toggle Tops Sizes:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'].map((sz) => {
                      const isSelected = sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleToggleSize(sz)}
                          className={`min-w-9 h-8 px-2 rounded-lg text-xs font-black transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-1 ring-sky-400'
                              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Size Input & Active Chips */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add custom size (e.g. 31.5, 42, Slim, etc.)..."
                      value={customSizeInput}
                      onChange={(e) => setCustomSizeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSize();
                        }
                      }}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs flex-1 font-semibold focus:outline-none focus:border-sky-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSize}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      + Add Size
                    </button>
                  </div>

                  {/* Active Selected Sizes List */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400">Selected:</span>
                    {sizes.length === 0 ? (
                      <span className="text-[11px] text-amber-400 font-semibold italic">
                        No size selected! Please select or add at least one size.
                      </span>
                    ) : (
                      sizes.map((sz) => (
                        <span
                          key={sz}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-950 border border-sky-600/50 text-sky-200 text-xs font-bold rounded-lg group"
                        >
                          <span>{sz}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(sz)}
                            className="text-sky-400 hover:text-white rounded-full p-0.5 hover:bg-sky-800/60 transition-colors"
                            title={`Remove size ${sz}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Available Colors Management */}
              <div className="space-y-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <label className="block font-extrabold text-slate-200 uppercase tracking-wider">
                      Available Colors *
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Select popular garment colors or add custom color with name and color picker.
                    </p>
                  </div>
                  {colors.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setColors([])}
                      className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                    >
                      Clear All ({colors.length})
                    </button>
                  )}
                </div>

                {/* Popular Color Quick Toggles */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-400">Popular Clothing Colors (Click to toggle):</div>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_COLORS.map((c) => {
                      const isSelected = colors.some((item) => item.name.toLowerCase() === c.name.toLowerCase());
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleToggleColor(c)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30 ring-1 ring-sky-400'
                              : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-500/80 shadow-xs shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Input & Color Picker */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex items-center justify-center w-10 h-9 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden cursor-pointer shrink-0">
                        <input
                          type="color"
                          value={customColorHex}
                          onChange={(e) => setCustomColorHex(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          title="Choose Color Hex"
                        />
                        <div
                          className="w-6 h-6 rounded-lg border border-slate-600 shadow-inner"
                          style={{ backgroundColor: customColorHex }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{customColorHex.toUpperCase()}</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Color Name (e.g. Light Wash Jeans, Vintage Olive)..."
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomColor();
                        }
                      }}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs flex-1 w-full font-semibold focus:outline-none focus:border-sky-500"
                    />

                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs whitespace-nowrap transition-colors w-full sm:w-auto cursor-pointer"
                    >
                      + Add Color
                    </button>
                  </div>

                  {/* Active Selected Colors List */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400">Selected Colors:</span>
                    {colors.length === 0 ? (
                      <span className="text-[11px] text-amber-400 font-semibold italic">
                        No color selected! Please select or add at least one color.
                      </span>
                    ) : (
                      colors.map((c) => (
                        <span
                          key={c.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-950 border border-sky-600/50 text-sky-200 text-xs font-bold rounded-lg group"
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-slate-400 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(c.name)}
                            className="text-sky-400 hover:text-white rounded-full p-0.5 hover:bg-sky-800/60 transition-colors"
                            title={`Remove color ${c.name}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Image Upload & Gallery Box */}
              <div className="space-y-3 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <label className="block font-extrabold text-slate-200 uppercase tracking-wider">
                  Product Images (device upload or URL)
                </label>

                {/* File Upload Zone */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-950 hover:bg-slate-800 border border-dashed border-sky-500/50 rounded-xl text-sky-400 font-bold cursor-pointer transition-colors w-full">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="url"
                      placeholder="Or paste Image URL..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs flex-1 sm:w-48 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Previews Grid */}
                {images.length > 0 ? (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {images.map((imgSrc, idx) => (
                      <div key={idx} className="relative w-20 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                        <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 group-hover:opacity-100"
                          title="Remove Image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 right-1 bg-sky-600 text-white font-bold text-[9px] text-center rounded py-0.5">
                            MAIN
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                    <p className="text-[11px] text-slate-500 font-medium">
                      No images selected yet. Upload an image from your device or paste a URL.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-300">
                    Product Description & Size/Spec Details (Word-Style)
                  </label>
                  <span className="text-[11px] text-sky-400 font-bold bg-sky-950/60 border border-sky-600/30 px-2 py-0.5 rounded-md">
                    WYSIWYG Word Editor
                  </span>
                </div>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Write description, size charts, fabric specs, or insert tables here..."
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFlashSale}
                    onChange={(e) => setIsFlashSale(e.target.checked)}
                    className="rounded accent-sky-500"
                  />
                  <span>Flash Sale Offer</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="rounded accent-sky-500"
                  />
                  <span>New Arrival Badge</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-900 text-slate-400 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl font-extrabold uppercase shadow-lg flex items-center gap-2 cursor-pointer transition-all"
                >
                  {isSaving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
