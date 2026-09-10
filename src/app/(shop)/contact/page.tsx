'use client';

import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! Your message has been sent to TEX WEAR support.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-sky-600 font-extrabold text-xs uppercase tracking-widest">
            GET IN TOUCH WITH US
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Contact Tex Wear Support
          </h1>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
            Have a question regarding your order or product inquiries? Contact our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Info Card */}
          <div className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-wider text-amber-400">
              Customer Hotline
            </h3>

            <div className="space-y-4 text-xs">
              <a
                href="tel:+8801623446677"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 transition-colors"
              >
                <PhoneCall className="w-5 h-5 text-sky-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Hotline Phone</span>
                  <span className="font-extrabold text-sm">+8801623446677</span>
                </div>
              </a>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
                <Mail className="w-5 h-5 text-sky-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Email Address</span>
                  <span className="font-bold">support@texwearlifestyle.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Corporate Office</span>
                  <span className="font-bold leading-tight block">
                    Tex Wear Tower, Level 4, Banani C/A, Dhaka 1213, Bangladesh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajib Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 017XXXXXXXX or name@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your question or feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
