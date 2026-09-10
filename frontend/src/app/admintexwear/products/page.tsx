'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Product } from '@/types';
import { Plus, Search, Trash2, Edit, X, Package, Upload, Image as ImageIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(1500);
  const [originalPrice, setOriginalPrice] = useState<number>(1800);
  const [categoryId, setCategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [sizes, setSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [description, setDescription] = useState('');
  const [stockCount, setStockCount] = useState<number>(30);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSku(`TW-PR-${Math.floor(100 + Math.random() * 900)}`);
    setPrice(1850);
    setOriginalPrice(2200);
    setCategoryId(categories[0]?.id || '');
    setImages(['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80']);
    setUrlInput('');
    setSizes(['M', 'L', 'XL', 'XXL']);
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
    setImages(product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80']);
    setUrlInput('');
    setSizes(product.sizes);
    setDescription(product.description);
    setStockCount(product.stockCount);
    setIsFlashSale(!!product.isFlashSale);
    setIsNewArrival(!!product.isNewArrival);
    setIsModalOpen(true);
  };

  // Device File Upload Handler (FileReader -> base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages((prev) => [...prev, result]);
          toast.success(`Uploaded ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !categoryId) {
      toast.error('Title and Category are required');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const categoryName = selectedCategory ? selectedCategory.name : 'General';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);

    const finalImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'];

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
      colors: [
        { name: 'Navy', hex: '#0f172a' },
        { name: 'Black', hex: '#000000' },
      ],
      description,
      details: ['Fabric: Premium Cotton Blend', 'Fit: Modern Comfort Fit', 'Care: Machine Wash Cold'],
      inStock: stockCount > 0,
      stockCount: Number(stockCount),
      isNewArrival,
      isFlashSale,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 12,
    };

    if (editingProduct) {
      updateProduct({
        ...productPayload,
        id: editingProduct.id,
        createdAt: editingProduct.createdAt,
      });
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
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

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by Title, SKU or Category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
        />
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
                <th className="p-4">Tags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {filteredProducts.map((product) => (
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
                        <span className="text-[10px] text-slate-500">
                          Sizes: {product.sizes.join(', ')}
                        </span>
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
                    <div className="flex flex-wrap gap-1">
                      {product.isFlashSale && (
                        <span className="bg-amber-500/20 text-amber-400 font-bold text-[9px] uppercase px-2 py-0.5 rounded">
                          FLASH
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase px-2 py-0.5 rounded">
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
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-red-900/40 text-red-400 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                {images.length > 0 && (
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
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white"
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
                  className="px-6 py-2.5 bg-sky-600 text-white rounded-xl font-extrabold uppercase shadow-lg"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
