"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] px-6 py-16 max-w-2xl mx-auto">
      <div className="border-4 border-black bg-white p-12 shadow-[12px_12px_0_#0a0a0a]">
        <h1 className="text-5xl font-black mb-6 text-black" style={{ letterSpacing: '-0.03em', fontWeight: 900 }}>
          📞 Contact
          <span className="block w-32 h-1 bg-[#0EA5E9] mt-4"></span>
        </h1>

        <p className="text-gray-600 mb-8 text-lg font-medium leading-relaxed">
          Reach out anytime. I usually reply within the same day.
        </p>

        <div className="space-y-3 mb-10 border-4 border-black bg-[#F4C430] p-6">
          <p className="text-black text-sm">
            <span className="font-bold">Email:</span>{" "}
            <a
              href="mailto:Lilianajs27@gmail.com"
              className="text-black hover:text-[#0EA5E9] transition-colors font-bold underline"
            >
              Lilianajs27@gmail.com
            </a>
          </p>

          <p className="text-black text-sm">
            <span className="font-bold">Phone:</span>{" "}
            <a
              href="tel:+17798956325"
              className="text-black hover:text-[#0EA5E9] transition-colors font-bold underline"
            >
              779-895-6325
            </a>
          </p>
        </div>

        {/* Success Message - Replaces Form */}
        {submitted ? (
          <div className="border-4 border-[#00ff41] bg-black p-12 text-center animate-in fade-in">
            <div className="mb-6">
              <p className="text-[#00ff41] font-black text-4xl mb-4" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.03em' }}>
                ✓ TRANSMISSION RECEIVED
              </p>
              <p className="text-[#00ff41] text-lg leading-relaxed" style={{ fontFamily: 'Courier New, Monaco, monospace', letterSpacing: '-0.01em' }}>
                Bailey Systems has your data.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-3 h-3 rounded-full bg-[#00ff41] animate-pulse"></div>
              <span className="text-xs font-bold text-[#00ff41]" style={{ fontFamily: 'Courier New, Monaco, Consolas, monospace', letterSpacing: '0.05em' }}>
                PROCESSING_REQUEST...
              </span>
            </div>
          </div>
        ) : (
          /* Contact Form */
          <form 
            className="space-y-6 contact-form"
            action="https://formspree.io/f/mgoalzvj"
            method="POST"
            onSubmit={handleSubmit}
          >
            {/* Hidden input for Formspree redirect (optional) */}
            <input type="hidden" name="_next" value={typeof window !== 'undefined' ? `${window.location.origin}/contacts?success=true` : ''} />
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-full p-4 border-4 border-black bg-white text-black outline-none focus:shadow-[4px_4px_0_#0EA5E9] transition-shadow font-medium"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="w-full p-4 border-4 border-black bg-white text-black outline-none focus:shadow-[4px_4px_0_#0EA5E9] transition-shadow font-medium"
            />
          </div>

          <div>
            <label htmlFor="discount" className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Discount Code (Optional)
            </label>
            <input
              id="discount"
              name="discount"
              type="text"
              placeholder="AMZ_DEAL"
              className="w-full p-4 border-4 border-black bg-white text-black outline-none focus:shadow-[4px_4px_0_#0EA5E9] transition-shadow font-medium"
              style={{ fontFamily: 'Courier New, Monaco, monospace' }}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-black mb-2 uppercase tracking-wider">
              Project Details
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell me about your project…"
              required
              rows={6}
              className="w-full p-4 border-4 border-black bg-white text-black outline-none focus:shadow-[4px_4px_0_#0EA5E9] transition-shadow resize-none font-medium"
            />
          </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#0EA5E9] text-white border-4 border-black font-black text-lg uppercase tracking-wider shadow-[4px_4px_0_#0a0a0a] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#0a0a0a] transition-all"
              style={{ letterSpacing: '-0.01em' }}
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
