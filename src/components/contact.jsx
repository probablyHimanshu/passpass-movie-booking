import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PassPassLogo from './PassPassLogo';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Submission failed.' });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: 'Unable to connect to server.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#f5eff9] flex flex-col justify-between page-transition">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full">
        <div className="text-center max-w-md mx-auto mb-10">
          <div className="inline-block mb-3">
            <PassPassLogo className="h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Contact Pass Pass
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Questions regarding ticket reservations or cinema partnerships
          </p>
        </div>

        <div className="pass-panel rounded-3xl p-6 sm:p-8 max-w-xl mx-auto border border-[#FF6B00]/20 shadow-2xl">
          {status.success && (
            <div className="p-3.5 mb-6 rounded-2xl bg-[#FF6B00]/20 border border-[#FF6B00] text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF8533] flex-shrink-0" />
              <span>Your message has been received! Our support team will get in touch.</span>
            </div>
          )}

          {status.error && (
            <div className="p-3.5 mb-6 rounded-2xl bg-[#FF6B00]/20 border border-[#FF6B00] text-white text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#FF8533]" />
              <span>{status.error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#181512] border border-[#FF6B00]/25 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6B00] text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-[#181512] border border-[#FF6B00]/25 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6B00] text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">Subject</label>
              <input
                name="subject"
                type="text"
                placeholder="Inquiry, feedback, partnership..."
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#181512] border border-[#FF6B00]/25 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6B00] text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">Message</label>
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-[#181512] border border-[#FF6B00]/25 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6B00] text-xs resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full py-3 rounded-2xl btn-pass-primary font-bold text-xs shadow-xl transition hover:scale-102"
            >
              {status.loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
