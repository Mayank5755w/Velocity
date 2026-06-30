import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Shield, Eye, Database, Settings } from 'lucide-react';
import Footer from '../Footer';
import PageHeader from '../components/PageHeader';
import { useSEO } from '../hooks/useSEO';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `Velocity collects minimal information to operate the site. We do not require account registration. When you visit the site, standard server logs may record your IP address, browser type, pages visited, and visit duration. This is standard practice for all websites and is used solely for security and performance monitoring.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `Any data collected is used only to maintain and improve the Site. We do not sell, rent, or trade your personal information to third parties for marketing purposes. Server logs are retained for a limited period and used only for security auditing and analytics.`,
  },
  {
    title: '3. Cookies',
    body: `Velocity uses cookies to enhance your experience. Essential cookies remember your preferences such as favorited wallpapers (stored locally in your browser). We may also use analytics cookies to understand how visitors use the site. You can control cookie settings through your browser preferences at any time.`,
  },
  {
    title: '4. Local Storage',
    body: `Your saved/favorited wallpapers are stored in your browser\'s local storage. This data never leaves your device and is not transmitted to our servers. You can clear this data at any time by clearing your browser\'s site data.`,
  },
  {
    title: '5. Analytics',
    body: `We may use privacy-respecting analytics tools to understand aggregate usage patterns (page views, popular wallpapers, device types). These tools are configured to anonymize IP addresses and do not build individual user profiles. We do not use Google Analytics tracking cookies without your consent.`,
  },
  {
    title: '6. Third-Party Services',
    body: `Velocity may link to or embed content from third-party services. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the privacy practices of any third-party sites or services.`,
  },
  {
    title: '7. Data Security',
    body: `We implement appropriate technical measures to protect any data we process. However, no internet transmission is completely secure, and we cannot guarantee the absolute security of data transmitted to or from the Site.`,
  },
  {
    title: '8. Children\'s Privacy',
    body: `Velocity is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. We will indicate the date of the latest revision at the bottom of the page. Continued use of the Site following any changes constitutes your acceptance of the revised policy.`,
  },
  {
    title: '10. Your Rights',
    body: `Depending on your jurisdiction, you may have rights to access, correct, or delete personal data we hold about you. Since we collect minimal data, there is very little to request. For any privacy-related enquiries or data deletion requests, please use our Contact page.`,
  },
];

const COOKIE_TYPES = [
  {
    icon: Settings,
    name: 'Essential Cookies',
    purpose: 'Required for the site to function correctly.',
    examples: 'Browser preferences, favorites/saved wallpapers.',
    canDisable: false,
  },
  {
    icon: Eye,
    name: 'Analytics Cookies',
    purpose: 'Help us understand how the site is being used.',
    examples: 'Page views, popular content, device type.',
    canDisable: true,
  },
  {
    icon: Database,
    name: 'Local Storage',
    purpose: 'Stores your saved wallpapers locally on your device.',
    examples: 'Favorited wallpapers list.',
    canDisable: true,
  },
];

const COOKIE_PREFS_KEY = 'velocity_cookie_prefs';

export default function PrivacyPage() {
  const [cookiePrefs, setCookiePrefs] = useState({
    analytics: true,
    localStorage: true,
  });
  const [savedConfirmation, setSavedConfirmation] = useState(false);

  // Load any previously saved cookie preferences on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_PREFS_KEY);
      if (saved) setCookiePrefs(JSON.parse(saved));
    } catch {
      // Ignore malformed/missing saved prefs and keep defaults.
    }
  }, []);

  const handleSavePreferences = () => {
    try {
      localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(cookiePrefs));
      setSavedConfirmation(true);
      setTimeout(() => setSavedConfirmation(false), 2000);
    } catch {
      // localStorage may be unavailable (e.g. private browsing) — fail silently.
    }
  };

  useSEO({
    title: 'Privacy & Cookie Policy | Velocity',
    description: 'Read the Velocity Privacy and Cookie Policy. Learn what data we collect, how we use it, and how to manage your cookie preferences.',
    ogUrl: '/privacy',
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">

      {/* ── HEADER ── */}
      <PageHeader />

      {/* ── HERO ── */}
      <section className="px-6 md:px-16 xl:px-24 pt-16 pb-12 border-b border-zinc-900">
        <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-600 mb-4">Legal</p>
        <h1 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.88] tracking-tight mb-6">
          PRIVACY &<br />COOKIES
        </h1>
        <p className="text-sm text-zinc-500">Last updated: May 2026</p>
      </section>

      {/* ── COOKIE PREFERENCES ── */}
      <section className="px-6 md:px-16 xl:px-24 py-12 border-b border-zinc-900 bg-zinc-950">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Cookie className="w-5 h-5 text-zinc-400" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500">Cookie Preferences</p>
          </div>

          <div className="space-y-4">
            {COOKIE_TYPES.map(({ icon: Icon, name, purpose, examples, canDisable }) => (
              <div key={name} className="flex items-start justify-between gap-6 p-5 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <Icon className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.25em] mb-1">{name}</p>
                    <p className="text-zinc-500 text-xs leading-relaxed">{purpose}</p>
                    <p className="text-zinc-600 text-[10px] mt-1">Examples: {examples}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  {canDisable ? (
                    <button
                      onClick={() => setCookiePrefs(prev => ({
                        ...prev,
                        [name === 'Analytics Cookies' ? 'analytics' : 'localStorage']: !prev[name === 'Analytics Cookies' ? 'analytics' : 'localStorage']
                      }))}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                        cookiePrefs[name === 'Analytics Cookies' ? 'analytics' : 'localStorage']
                          ? 'bg-white' : 'bg-zinc-800'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${
                        cookiePrefs[name === 'Analytics Cookies' ? 'analytics' : 'localStorage']
                          ? 'left-7 bg-black' : 'left-1 bg-zinc-500'
                      }`} />
                    </button>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 border border-zinc-800 px-2 py-1">
                      Required
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSavePreferences} className="mt-6 px-6 py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-100 transition-all duration-300 cursor-pointer">
            {savedConfirmation ? 'Preferences Saved' : 'Save Preferences'}
          </button>
        </div>
      </section>

      {/* ── PRIVACY POLICY SECTIONS ── */}
      <main className="flex-1 px-6 md:px-16 xl:px-24 py-14">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-10">
            <Shield className="w-5 h-5 text-zinc-400" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-zinc-500">Full Privacy Policy</p>
          </div>

          <div className="space-y-12">
            {SECTIONS.map(({ title, body }) => (
              <div key={title} className="border-t border-zinc-900 pt-8">
                <h2 className="text-lg font-black uppercase tracking-tight mb-4">{title}</h2>
                <p className="text-zinc-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related pages */}
        <div className="max-w-3xl mt-16 pt-10 border-t border-zinc-900">
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mb-6">Related Pages</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Terms & Conditions', to: '/terms' },
              { label: 'DMCA Policy', to: '/dmca' },
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
