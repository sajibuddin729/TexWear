'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquareHeart,
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  Clock,
  Filter,
  RefreshCw,
  Search,
  User,
  Phone,
  Mail,
  AlertCircle,
  ThumbsUp,
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
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/feedback?status=ALL');
      const data = await res.json();
      if (data.success) {
        setFeedbacks(data.data || []);
      } else {
        toast.error('Failed to load customer feedbacks');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Connection error while fetching feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          newStatus === 'APPROVED'
            ? 'Feedback Approved! It is now live on the website.'
            : newStatus === 'REJECTED'
            ? 'Feedback marked as Rejected.'
            : 'Feedback moved back to Pending.'
        );
        // Optimistic local state update
        setFeedbacks((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      } else {
        toast.error(data.error || 'Failed to update feedback status');
      }
    } catch (error) {
      toast.error('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete feedback from "${name}"?`)) {
      return;
    }

    try {
      setUpdatingId(id);
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Feedback permanently deleted');
        setFeedbacks((prev) => prev.filter((item) => item.id !== id));
      } else {
        toast.error(data.error || 'Failed to delete feedback');
      }
    } catch (error) {
      toast.error('Error deleting feedback');
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats
  const totalCount = feedbacks.length;
  const pendingCount = feedbacks.filter((f) => f.status === 'PENDING').length;
  const approvedCount = feedbacks.filter((f) => f.status === 'APPROVED').length;
  const rejectedCount = feedbacks.filter((f) => f.status === 'REJECTED').length;

  // Filtered List
  const filteredFeedbacks = feedbacks
    .filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchComment = item.comment.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchPhone = item.phone?.toLowerCase().includes(q) || false;
        return matchName || matchComment || matchCategory || matchPhone;
      }
      return true;
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest">
            <MessageSquareHeart className="w-4 h-4" />
            <span>Customer Voice & Reviews</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
            Customer Feedback & Review Management
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Review customer submissions. Feedbacks marked as{' '}
            <span className="text-emerald-400 font-bold">Approved</span> are immediately displayed live on the public website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchFeedbacks}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors border border-slate-700"
            title="Refresh Feedbacks"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/feedback"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Submissions
          </span>
          <div className="text-2xl font-black text-white">{totalCount}</div>
          <p className="text-[10px] text-slate-500">All customer submissions</p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Pending Approval
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <div className="text-2xl font-black text-amber-300">{pendingCount}</div>
          <p className="text-[10px] text-amber-400/70">Hidden until you approve</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Live on Website
          </span>
          <div className="text-2xl font-black text-emerald-300">{approvedCount}</div>
          <p className="text-[10px] text-emerald-400/70">Approved verified reviews</p>
        </div>

        <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
            Rejected / Inappropriate
          </span>
          <div className="text-2xl font-black text-red-300">{rejectedCount}</div>
          <p className="text-[10px] text-red-400/70">Declined submissions</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => {
            const count =
              status === 'ALL'
                ? totalCount
                : status === 'PENDING'
                ? pendingCount
                : status === 'APPROVED'
                ? approvedCount
                : rejectedCount;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                  statusFilter === status
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{status === 'ALL' ? 'All Reviews' : status}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                    statusFilter === status
                      ? 'bg-sky-700 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone or text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Feedbacks List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-sky-400" />
          <p className="text-xs font-bold uppercase tracking-wider">Loading feedbacks from Neon Database...</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <MessageSquareHeart className="w-12 h-12 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white uppercase tracking-tight">No Feedbacks Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No feedbacks matching "${searchQuery}" in ${statusFilter} tab.`
              : `There are currently no ${statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} customer feedbacks.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((item) => {
            const isPending = item.status === 'PENDING';
            const isApproved = item.status === 'APPROVED';
            const isRejected = item.status === 'REJECTED';
            const isBusy = updatingId === item.id;

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl bg-slate-950 border transition-all space-y-4 ${
                  isPending
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : isApproved
                    ? 'border-emerald-500/30'
                    : 'border-slate-800 opacity-75'
                }`}
              >
                {/* Top Row: User details & Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center font-black text-sm uppercase border border-slate-700">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-white">{item.name}</h3>
                        <span className="text-[10px] font-bold text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                        {item.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {item.phone}
                          </span>
                        )}
                        {item.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            {item.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {/* Stars */}
                    <div className="flex items-center gap-1 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < item.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-black text-amber-300 ml-1">
                        {item.rating}.0
                      </span>
                    </div>

                    {isPending ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Pending Approval</span>
                      </span>
                    ) : isApproved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Live on Website</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Comment Body */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  "{item.comment}"
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                  <span className="text-[11px] text-slate-500">
                    ID: <code className="font-mono text-slate-400">{item.id}</code>
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Approve button */}
                    {!isApproved && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'APPROVED')}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow transition-all hover:scale-102 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                    )}

                    {/* Move to Pending if approved or rejected */}
                    {isApproved && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'PENDING')}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-colors disabled:opacity-50"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Hide / Make Pending</span>
                      </button>
                    )}

                    {/* Reject button */}
                    {!isRejected && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'REJECTED')}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 font-bold text-xs uppercase tracking-wider border border-slate-700 hover:border-red-900 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={isBusy}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Permanently Delete Feedback"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
