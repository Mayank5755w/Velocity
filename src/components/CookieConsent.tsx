import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react'; // Uses your project's Framer Motion package
import { Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem('velocity_cookie_consent');
    if (!consent) {
      // Add a slight delay before showing the banner for a premium feel
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('velocity_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('velocity_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#050505] border border-zinc-900 p-6 shadow-2xl shadow-black/90 flex flex-col gap-5 font-sans text-white"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Cookie Consent</p>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                We use cookies to save your favorites and gather lightweight diagnostics to maintain high page loading speeds.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-zinc-900/50">
            <Link
              to="/privacy"
              onClick={() => setIsVisible(false)}
              className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleDecline}
                className="px-4 py-2 border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:border-white hover:text-white transition-all duration-300 cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300 cursor-pointer"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}