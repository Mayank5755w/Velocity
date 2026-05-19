import App from '../App';
import { useSEO } from '../hooks/useSEO';
import { PHONE_WALLPAPERS } from '../constants';

export default function MobilePage() {
  useSEO({
    title: `Mobile Phone Wallpapers 4K | Velocity`,
    description: `Download ${PHONE_WALLPAPERS.length} premium mobile phone wallpapers in HD portrait format. Free automotive wallpapers for iPhone and Android from the Velocity collection.`,
    ogUrl: '/mobile',
  });

  // Load the exact Homepage Layout, but switch it to the 'mobile' view automatically
  return <App defaultView="mobile" />;
}