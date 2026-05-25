import { Link } from 'react-router-dom';
import { Gauge } from 'lucide-react';
import Footer from '../Footer';
import { useSEO } from '../hooks/useSEO';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing and using Velocity ("the Site"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Site. We reserve the right to modify these terms at any time, and your continued use of the Site following any changes constitutes your acceptance of the revised terms.`,
  },
  {
    title: '2. Use of Content',
    body: `The wallpapers and images available on Velocity are provided for personal, non-commercial use only. You may download and use them as wallpapers on your personal devices. You may not redistribute, sell, sublicense, or use the images for commercial purposes without explicit written permission from the respective rights holders.`,
  },
  {
    title: '3. Intellectual Property',
    body: `Velocity does not claim ownership over the automotive images featured on this site. All vehicle images remain the property of their respective photographers, automakers, and rights holders. The Velocity brand, logo, website design, and original content are the intellectual property of Velocity and may not be reproduced without permission.`,
  },
  {
    title: '4. DMCA & Copyright',
    body: `We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe any content on Velocity infringes your copyright, please submit a DMCA notice through our designated contact. We will investigate and remove infringing content promptly. See our dedicated DMCA page for full takedown procedures.`,
  },
  {
    title: '5. Disclaimer of Warranties',
    body: `The Site is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses. We make no representations about the accuracy, reliability, or completeness of any content on the Site.`,
  },
  {
    title: '6. Limitation of Liability',
    body: `To the fullest extent permitted by law, Velocity shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Site or the content available on it, even if we have been advised of the possibility of such damages.`,
  },
  {
    title: '7. Third-Party Links',
    body: `The Site may contain links to third-party websites. These links are provided for your convenience only. We have no control over the content of those sites and accept no responsibility for them or for any loss or damage that may arise from your use of them.`,
  },
  {
    title: '8. Governing Law',
    body: `These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts.`,
  },
  {
    title: '9. Contact',
    body: `If you have any questions about these Terms and Conditions, please contact us through our Contact page.`,
  },
];

export default function TermsPage() {
  useSEO({
    title: 'Terms & Conditions | Velocity',
    description: 'Read the Terms and Conditions for using Velocity — the premium automotive wallpaper collection. Understand your rights and responsibilities.',
    ogUrl: '/terms',
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
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-4">Legal</p>
        <h1 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.88] tracking-tight mb-6">
          TERMS &<br />CONDITIONS
        </h1>
        <p className="text-sm text-zinc-500">Last updated: May 2026</p>
      </section>

      {/* ── CONTENT ── */}
      <main className="flex-1 px-6 md:px-16 xl:px-24 py-14">
        <div className="max-w-3xl space-y-12">
          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="border-t border-zinc-900 pt-8">
              <h2 className="text-lg font-black uppercase tracking-tight mb-4">{title}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Quick links to related pages */}
        <div className="max-w-3xl mt-16 pt-10 border-t border-zinc-900">
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mb-6">Related Pages</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'DMCA Policy', to: '/dmca' },
              { label: 'Privacy Policy', to: '/privacy' },
              { label: 'Contact Us', to: '/contact' },
            ].map(({ label, to }) => (
              <Link key={to} to={to}
                className="px-5 py-3 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:border-white hover:text-white transition-all duration-200">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
