import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gauge, Mail, MessageSquare, AlertTriangle, HelpCircle } from 'lucide-react';
import Footer from '../Footer';
import { useSEO } from '../hooks/useSEO';

const TOPICS = [
  { icon: AlertTriangle, label: 'DMCA / Copyright Claim' },
  { icon: MessageSquare, label: 'General Feedback' },
  { icon: HelpCircle, label: 'Bug Report' },
  { icon: Mail, label: 'Other' },
];

export default function ContactPage() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Web3Forms Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: 'Contact | Velocity',
    description: 'Get in touch with the Velocity team. Submit copyright claims, feedback, bug reports, or any other enquiry.',
    ogUrl: '/contact',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message || !selectedTopic) return;

    setIsSubmitting(true);
    setError(null);

    // Reads the key from Vite's environment variables
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      setError("Configuration error: Access key is missing.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: name,
          email: email,
          message: message,
          topic: selectedTopic,
          subject: `Velocity Form Submission: ${selectedTopic}`,
          from_name: "Velocity Web Form",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        <header className="border-b border-zinc-900 px-6 md:px-12 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white flex items-center justify-center rotate-45 transform group-hover:rotate-[225deg] transition-transform duration-700">
              <Gauge className="w-4 h-4 text-black -rotate-45" />
            </div>
            <span className="text-lg font-black italic uppercase tracking-tighter">
              VELO<span className="text-zinc-700">CITY</span>
            </span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <p className="text-6xl mb-8">✦</p>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tight mb-4">Message Sent</h1>
            <p className="text-zinc-400 text-base leading-relaxed mb-10">
              Thanks for reaching out. We'll review your message and get back to you within 2–5 business days.
            </p>
            <Link to="/" className="inline-block px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-100 transition-all duration-300">
              Return to Grid
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      {/* ── HEADER ── */}
      <header className="border-b border-zinc-900 px-6 md:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white flex items-center justify-center rotate-45 transform group-hover:rotate-[225deg] transition-transform duration-700">
            <Gauge className="w-4 h-4 text-black -rotate-45" />
          </div>
          <span className="text-lg font-black italic uppercase tracking-tighter">
            VELO<span className="text-zinc-700">CITY</span>
          </span>
        </Link>
        <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
          ← Back
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="px-6 md:px-16 xl:px-24 pt-16 pb-12 border-b border-zinc-900">
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-4">Get In Touch</p>
        <h1 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.88] tracking-tight">
          CONTACT
        </h1>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px]">

        {/* FORM */}
        <div className="px-6 md:px-16 xl:px-24 py-14 border-r border-zinc-900">
          <form onSubmit={handleSubmit} className="max-w-xl space-y-8">

            {/* Error banner */}
            {error && (
              <div className="border border-red-500/20 bg-red-950/20 text-red-400 p-4 text-xs font-semibold uppercase tracking-wider">
                Error: {error}
              </div>
            )}

            {/* Topic selector */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4">
                Topic *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TOPICS.map(({ icon: Icon, label }) => (
                  <button key={label} type="button"
                    disabled={isSubmitting}
                    onClick={() => setSelectedTopic(label)}
                    className={`flex items-center gap-3 px-4 py-3.5 border text-left text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 ${
                      selectedTopic === label
                        ? 'bg-white text-black border-white'
                        : 'border-zinc-800 text-zinc-400 hover:border-white/40 hover:text-white'
                    }`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-3">
                Full Name *
              </label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-white py-4 px-5 text-sm font-medium focus:outline-none transition-all placeholder:text-zinc-700"
                disabled={isSubmitting}
                required />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-3">
                Email Address *
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-white py-4 px-5 text-sm font-medium focus:outline-none transition-all placeholder:text-zinc-700"
                disabled={isSubmitting}
                required />
            </div>

            {/* Message */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-3">
                Message *
              </label>
              <textarea value={message} onChange={e => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind. For DMCA claims, include the specific URL(s) and proof of ownership."
                rows={7}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-white py-4 px-5 text-sm font-medium focus:outline-none transition-all resize-none placeholder:text-zinc-700"
                disabled={isSubmitting}
                required />
            </div>

            <button type="submit"
              disabled={!name || !email || !message || !selectedTopic || isSubmitting}
              className="w-full bg-white text-black py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-100 transition-all duration-300 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed">
              {isSubmitting ? 'Sending Message...' : 'Send Message →'}
            </button>

            <p className="text-[10px] text-zinc-600 leading-relaxed">
              We typically respond within 2–5 business days. For urgent copyright matters, please indicate "DMCA" in your topic selection and message.
            </p>
          </form>
        </div>

        {/* INFO SIDEBAR */}
        <div className="px-8 py-14 bg-zinc-950 hidden lg:block">
          <div className="space-y-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">Response Time</p>
              <p className="text-4xl font-black italic">2–5</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mt-1">Business Days</p>
            </div>

            <div className="border-t border-zinc-900 pt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">Use This Form For</p>
              <ul className="space-y-3">
                {[
                  'DMCA copyright takedown requests',
                  'Image attribution corrections',
                  'Bug reports & technical issues',
                  'General feedback & suggestions',
                  'Partnership enquiries',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-zinc-700 mt-0.5 shrink-0 font-black text-[10px]">✦</span>
                    <span className="text-zinc-400 text-xs leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-zinc-900 pt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-4">Legal Pages</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'DMCA Policy', to: '/dmca' },
                  { label: 'Privacy Policy', to: '/privacy' },
                  { label: 'Terms & Conditions', to: '/terms' },
                ].map(({ label, to }) => (
                  <Link key={to} to={to}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
                    <span className="w-3 h-px bg-zinc-700" />{label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}