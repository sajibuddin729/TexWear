'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
  Inbox,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactMessageItem {
  id: string;
  name: string;
  contact: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
  updatedAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setMessages(data.data || []);
      } else {
        toast.error(data.error || 'Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Connection error while fetching messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'READ' ? 'UNREAD' : 'READ';
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        toast.success(newStatus === 'READ' ? 'Marked as read' : 'Marked as unread');
      } else {
        toast.error(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update message status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, senderName: string) => {
    if (!confirm(`Are you sure you want to permanently delete message from "${senderName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(id);
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Message deleted permanently from database.');
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        toast.error(data.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Connection error while deleting message');
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate time remaining before 48-hour auto-purge
  const getTimeRemaining = (createdAtStr: string) => {
    const createdTime = new Date(createdAtStr).getTime();
    const purgeTime = createdTime + 48 * 60 * 60 * 1000;
    const diffMs = purgeTime - Date.now();

    if (diffMs <= 0) {
      return 'Expiring now';
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const matchesStatus =
      statusFilter === 'ALL' ? true : msg.status === statusFilter;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      msg.name.toLowerCase().includes(query) ||
      msg.contact.toLowerCase().includes(query) ||
      msg.message.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === 'UNREAD').length;
  const readCount = totalCount - unreadCount;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
              Contact Inquiries & Messages
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Customer inquiries submitted through the Contact Us page (<Link href="/contact" target="_blank" className="text-sky-500 hover:underline inline-flex items-center gap-1 font-bold">/contact <ExternalLink className="w-3 h-3" /></Link>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMessages}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Auto-Purge Policy Alert Box */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3.5 text-xs text-amber-900 dark:text-amber-200">
        <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed">
          <p className="font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            ⚡ 48-Hour Auto-Purge Policy Active
          </p>
          <p className="text-[11px] opacity-90">
            Inquiries are automatically permanently deleted from the database and admin panel after <strong>2 days (48 hours)</strong>. You can also manually delete any message immediately with the delete button.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unread Messages</p>
            <h3 className="text-2xl font-black text-amber-500 mt-1">{unreadCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Read Messages</p>
            <h3 className="text-2xl font-black text-emerald-500 mt-1">{readCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Retention Window</p>
            <h3 className="text-xl font-black text-sky-500 mt-1">48 Hours</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'UNREAD', 'READ'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === status
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {status === 'ALL' && `All (${totalCount})`}
              {status === 'UNREAD' && `Unread (${unreadCount})`}
              {status === 'READ' && `Read (${readCount})`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading inquiries from database...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-extrabold uppercase text-slate-700 dark:text-slate-300">
            {searchQuery ? 'No matching inquiries found' : 'No Contact Messages'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No messages matched "${searchQuery}". Try a different keyword.`
              : 'When customers send inquiries from the Contact page, they will show up here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => {
            const isEmail = msg.contact.includes('@');
            const isUnread = msg.status === 'UNREAD';
            const timeRemaining = getTimeRemaining(msg.createdAt);

            return (
              <div
                key={msg.id}
                className={`p-6 rounded-3xl border transition-all duration-200 bg-white dark:bg-slate-900 shadow-sm space-y-4 ${
                  isUnread
                    ? 'border-amber-400/60 dark:border-amber-500/40 ring-1 ring-amber-400/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header row: Sender + Status + Auto-Purge countdown */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm uppercase ${
                      isUnread
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {msg.name.slice(0, 2) || 'TW'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white capitalize">
                          {msg.name}
                        </h4>
                        {isUnread ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 tracking-wide uppercase">
                            New
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 tracking-wide uppercase">
                            Read
                          </span>
                        )}
                      </div>

                      {/* Contact details */}
                      <div className="flex items-center gap-3 text-xs mt-0.5 font-medium text-slate-500">
                        {isEmail ? (
                          <a
                            href={`mailto:${msg.contact}`}
                            className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline font-bold"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{msg.contact}</span>
                          </a>
                        ) : (
                          <a
                            href={`tel:${msg.contact}`}
                            className="inline-flex items-center gap-1.5 text-sky-600 dark:text-sky-400 hover:underline font-bold"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{msg.contact}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Date & Auto-Purge Badge */}
                  <div className="flex items-center gap-2 sm:text-right">
                    <div className="text-[11px] text-slate-400 font-medium">
                      <span>{new Date(msg.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                      <div className="flex items-center gap-1 sm:justify-end text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Auto-deletes: {timeRemaining}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-xs font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {/* Mark as read/unread */}
                    <button
                      onClick={() => handleToggleStatus(msg.id, msg.status)}
                      disabled={updatingId === msg.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {msg.status === 'UNREAD' ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-sky-500" />
                          <span>Mark as Read</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Mark as Unread</span>
                        </>
                      )}
                    </button>

                    {/* Quick Respond */}
                    {isEmail ? (
                      <a
                        href={`mailto:${msg.contact}?subject=Tex%20Wear%20Support%20Reply&body=Dear%20${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank%20you%20for%20contacting%20Tex%20Wear.`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-xs font-bold transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply by Email</span>
                      </a>
                    ) : (
                      <a
                        href={`tel:${msg.contact}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-xs font-bold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Customer</span>
                      </a>
                    )}
                  </div>

                  {/* Permanent Delete Button */}
                  <button
                    onClick={() => handleDelete(msg.id, msg.name)}
                    disabled={deletingId === msg.id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                    title="Permanently delete this message from database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingId === msg.id ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
