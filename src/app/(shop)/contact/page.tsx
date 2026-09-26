'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { PhoneCall, Mail, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const { siteSettings } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          contact: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Thank you! Your message has been sent to TEX WEAR support.');
        setIsSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        setTimeout(() => setIsSuccess(false), 6000);
      } else {
        toast.error(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact form submit error:', err);
      toast.error('Connection error. Please try again or call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const phone = siteSettings?.phone || '+8801825400045';
  const emailAddress = siteSettings?.email || 'texwearstyle.com@gmail.com';
  const address = siteSettings?.address || '567, 1st Floor, East Kazipara, Begum Rokeya Sarani, Mirpur, Metro Rail Pillar No. 285, Dhaka-1216';

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
          <div className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-8 space-y-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-amber-400">
                Customer Hotline
              </h3>

              <div className="space-y-4 text-xs">
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 transition-colors group cursor-pointer"
                >
                  <PhoneCall className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hotline Phone</span>
                    <span className="font-extrabold text-sm text-white group-hover:text-sky-400 transition-colors">
                      {phone}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${emailAddress}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-500 transition-colors group cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    <span className="font-bold text-white group-hover:text-sky-400 transition-colors break-all">
                      {emailAddress}
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800 border border-slate-700">
                  <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Corporate Office</span>
                    <span className="font-bold leading-relaxed text-slate-200 block text-xs">
                      {address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <p>Office Hours: 10:00 AM - 09:30 PM (7 Days a week)</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            {isSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Your message has been received! Our support team will get in touch with you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sajib Rahman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address or Mobile Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 017XXXXXXXX or name@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write your question, inquiry or feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
