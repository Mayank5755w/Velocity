import { Link } from 'react-router-dom';
import { Gauge } from 'lucide-react';

interface PageHeaderProps {
  /** Where the "← Back" link goes. Defaults to home. */
  backTo?: string;
  /** Label for the back link. Defaults to "← Back". */
  backLabel?: string;
  /** Set false to render the logo only, with no back link (e.g. a success/confirmation state). */
  showBack?: boolean;
}

/**
 * Shared top header used across info/legal pages (About, Contact, DMCA, Privacy,
 * Terms, Brand). Extracted from the previously duplicated markup in each page
 * so styling/logo changes only need to happen in one place.
 */
export default function PageHeader({ backTo = '/', backLabel = '← Back', showBack = true }: PageHeaderProps) {
  return (
    <header className="border-b border-zinc-900 px-6 md:px-12 py-5 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 bg-white flex items-center justify-center rotate-45 transform group-hover:rotate-[225deg] transition-transform duration-700">
          <Gauge className="w-4 h-4 text-black -rotate-45" />
        </div>
        <span className="text-lg font-black italic uppercase tracking-tighter text-white">
          VELO<span className="text-zinc-400">CITY</span>
        </span>
      </Link>
      {showBack && (
        <Link to={backTo} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
          {backLabel}
        </Link>
      )}
    </header>
  );
}
