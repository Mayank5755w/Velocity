import { Link } from 'react-router-dom';
import { Gauge, Mail, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Footer from '../Footer';
import { useSEO } from '../hooks/useSEO';

const STEPS = [
  {
    icon: AlertTriangle,
    step: '01',
    title: 'Identify the Content',
    body: 'Locate the specific URL(s) on Velocity that contain the allegedly infringing content. Include the exact page links in your notice.',
  },
  {
    icon: Mail,
    step: '02',
    title: 'Submit Your Notice',
    body: 'Send a written DMCA takedown notice to our designated agent via our Contact page. Include all required information listed below.',
  },
  {
    icon: Clock,
    step: '03',
    title: 'We Investigate',
    body: 'We will review your claim within 5–10 business days. We take all valid copyright claims seriously and act promptly.',
  },
  {
    icon: CheckCircle,
    step: '04',
    title: 'Content Removal',
    body: 'If the claim is valid, the content will be removed or disabled. You will be notified of the outcome via the contact details you provide.',
  },
];

const REQUIRED_FIELDS = [
  'Your full legal name and contact information (email address)',
  'A description of the copyrighted work you claim has been infringed',
  'The specific URL(s) on Velocity where the infringing content appears',
  'A statement that you have a good faith belief the use is not authorized by the copyright owner',
  'A statement that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf',
  'Your physical or electronic signature',
];

export default function DMCAPage() {
  useSEO({
    title: 'DMCA Policy | Velocity',
    description: 'Velocity respects intellectual property rights. Learn how to submit a DMCA takedown notice if you believe your copyrighted content has been used without permission.',
    ogUrl: '/dmca',
  });

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
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-4">Copyright Policy</p>
        <h1 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.88] tracking-tight mb-6">
          DMCA<br />POLICY
        </h1>
        <p className="text-base text-zinc-400 max-w-2xl leading-relaxed font-light">
          Velocity respects intellectual property rights. If you believe content on our site infringes your copyright, we will investigate and act promptly on valid claims.
        </p>
        <p className="text-sm text-zinc-500 mt-4">Last updated: May 2026</p>
      </section>

      {/* ── STATEMENT ── */}
      <section className="px-6 md:px-16 xl:px-24 py-12 border-b border-zinc-900">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6">Our Position</p>
          <p className="text-zinc-400 text-sm leading-relaxed mb-4">
            Velocity aggregates publicly available automotive imagery for personal, non-commercial use. We make every reasonable effort to source content that is freely available for this purpose. However, we acknowledge that errors can occur, and we are fully committed to honoring valid copyright claims under the Digital Millennium Copyright Act (17 U.S.C. § 512).
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            If you are a photographer, automaker, or rights holder and believe any image on Velocity infringes your copyright, please follow the process below. We treat every legitimate claim with urgency and respect.
          </p>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="px-6 md:px-16 xl:px-24 py-14 border-b border-zinc-900">
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-12">Takedown Process</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-900">
          {STEPS.map(({ icon: Icon, step, title, body }) => (
            <div key={step} className="bg-[#050505] p-8 md:p-10">
              <div className="flex items-start gap-5 mb-5">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mt-1">{step}</span>
                <Icon className="w-5 h-5 text-zinc-400 mt-0.5" />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tight mb-3">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REQUIRED INFO ── */}
      <section className="px-6 md:px-16 xl:px-24 py-14 border-b border-zinc-900">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6">Required Information</p>
          <h2 className="text-2xl md:text-4xl font-black italic uppercase leading-tight tracking-tight mb-8">
            YOUR NOTICE MUST INCLUDE
          </h2>
          <ul className="space-y-4">
            {REQUIRED_FIELDS.map((field, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-[10px] font-black text-zinc-700 mt-1 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-zinc-400 text-sm leading-relaxed">{field}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── COUNTER-NOTICE ── */}
      <section className="px-6 md:px-16 xl:px-24 py-14 border-b border-zinc-900">
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-6">Counter-Notice</p>
          <h2 className="text-2xl font-black italic uppercase tracking-tight mb-4">
            If Your Content Was Removed in Error
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            If you believe content was removed as a result of a mistake or misidentification, you may submit a counter-notice. Your counter-notice must include: your name and contact information, identification of the removed content, a statement under penalty of perjury that you have a good faith belief the content was removed by mistake, and your consent to jurisdiction of the relevant courts. Upon receipt of a valid counter-notice, we will notify the original complainant and, unless they seek a court order, restore the content within 10–14 business days.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-16 xl:px-24 py-14">
        <div className="max-w-xl">
          <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-4">Submit a Claim</p>
          <h2 className="text-3xl font-black italic uppercase tracking-tight mb-6">
            Ready to File a Takedown?
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">
            Use our Contact page to submit your DMCA notice. Include all required information listed above to ensure we can process your claim quickly.
          </p>
          <Link to="/contact"
            className="inline-block px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-100 transition-all duration-300">
            Contact Us →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
