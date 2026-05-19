/**
 * DesktopPage — /desktop route
 * Simply renders the main App component. App already defaults to 'desktop' section.
 * This route exists purely for SEO (a real URL for the desktop collection).
 */
import App from '../App';
import { useSEO } from '../hooks/useSEO';
import { CAR_WALLPAPERS } from '../constants';

export default function DesktopPage() {
  useSEO({
    title: `Desktop Car Wallpapers 4K | Velocity`,
    description: `Download ${CAR_WALLPAPERS.length} premium 4K desktop car wallpapers. Browse Supercars, Hypercars, JDM, Luxury, Classic and Motor Sport collections — free to download.`,
    ogUrl: '/desktop',
  });

  return <App />;
}
