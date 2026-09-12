'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  CheckCircle,
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  ThumbsUp,
  Heart,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FeedbackItem {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  rating: number;
  category: string;
  comment: string;
  status: string;
  createdAt: string;
}

const CATEGORIES = [
  'Product Quality',
  'Fabric & Stitching',
  'Sizing & Fit',
  'Delivery Speed',
  'Customer Support',
  'Store Experience',
  'General Feedback',
];

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({ totalApproved: 0, averageRating: 5.0 });

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState('Product Quality');
  const [comment, setComment] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter your feedback message');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          rating,
          category,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          'Thank you! Your feedback was submitted and will appear on the site once approved by our team.',
          { duration: 5000 }
        );
        setName('');
        setEmail('');
        setPhone('');
        setRating(5);
        setCategory('Product Quality');
        setComment('');
      } else {
        toast.error(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredFeedbacks =
    filterCategory === 'ALL'
      ? feedbacks
      : feedbacks.filter((f) => f.category.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Customer Voice & Experience</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-950">
            Customer Feedback & Reviews
          </h1>
          <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
            Your honest voice shapes our craftsmanship. Share your experience or explore verified customer stories from all across Bangladesh.
          </p>
        </div>

        {/* Stats & Guarantee Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-hidden py-1">
          {/* Left card slides in from left */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 animate-slide-in-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-2xl shrink-0 border border-amber-200 shadow-inner">
              {stats.averageRating || '4.8'}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-900">Average Customer Rating</p>
              <p className="text-[11px] text-slate-500">Based on verified customer orders</p>
            </div>
          </div>

          {/* Right card slides in from right */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 animate-slide-in-right">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200 shadow-inner">
              <ThumbsUp className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                {stats.totalApproved}+ Verified Reviews
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Real feedback from real lifestyle shoppers
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Left is Form, Right is Reviews List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Feedback Submission Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-md sticky top-24">
            <div className="space-y-2 mb-6 pb-4 border-b border-slate-100">
              <span className="text-sky-600 font-extrabold text-[11px] uppercase tracking-widest block">
                Share Your Experience
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-950">
                Leave A Review
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Tell us about product quality, fit, or delivery speed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 rounded-lg hover:scale-125 transition-transform"
                      title={`${star} Star`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating !== null ? hoverRating >= star : rating >= star)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-extrabold text-amber-700 ml-2">
                    {rating === 5
                      ? '5.0 - Excellent!'
                      : rating === 4
                      ? '4.0 - Very Good'
                      : rating === 3
                      ? '3.0 - Average'
                      : rating === 2
                      ? '2.0 - Poor'
                      : '1.0 - Terrible'}
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajib Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Feedback Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Review / Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about the fabric, stitching, comfort, or delivery experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-102 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Review...' : 'Submit Feedback'}</span>
              </button>

              <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reviews are reviewed by admin to keep the community genuine.</span>
              </p>
            </form>
          </div>

          {/* Right Column: Approved Customer Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Filter Chips */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Filter by Topic:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setFilterCategory('ALL')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterCategory === 'ALL'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All ({feedbacks.length})
                </button>
                {CATEGORIES.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      filterCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Reviews Grid */}
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/4" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">
                  No Reviews in this category yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Be the first to share your experience with TEX WEAR garments and service!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedbacks.map((item, index) => (
                  <div
                    key={item.id}
                    style={{ animationDelay: `${Math.min(index * 130, 800)}ms` }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3 animate-review-entrance"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm uppercase">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-slate-900">{item.name}</h4>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle className="w-3 h-3" />
                              <span>Verified Buyer</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < item.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-black text-amber-800 ml-1">
                          {item.rating}.0
                        </span>
                      </div>
                    </div>

                    {/* Category Tag */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                        {item.category}
                      </span>
                    </div>

                    {/* Review text */}
                    <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                      "{item.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
