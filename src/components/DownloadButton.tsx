import { useState } from 'react';

interface DownloadButtonProps {
  href: string;
  filename: string;
  /** Tailwind classes for the main button, matching each page's existing style. */
  className: string;
  label: string;
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  // Covers iPhone/iPad/iPod, plus iPadOS 13+ which reports as "MacIntel" but has touch support.
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Download button used on WallpaperPage and PhoneWallpaperPage.
 * iOS Safari ignores the `download` attribute for these static assets and just
 * opens the image in a new tab instead of saving it — there's no reliable
 * client-side fix for that on static hosting, so instead we surface a one-time
 * instructional hint for iOS visitors explaining how to save manually.
 */
export default function DownloadButton({ href, filename, className, label }: DownloadButtonProps) {
  const [showHint, setShowHint] = useState(false);

  const handleClick = () => {
    if (isIOS()) setShowHint(true);
  };

  return (
    <div>
      <a href={href} download={filename} onClick={handleClick} className={className}>
        {label}
      </a>
      {showHint && (
        <p className="mt-2 text-[10px] leading-relaxed text-zinc-400 text-center px-2">
          On iPhone/iPad: press and hold the image that opens, then tap "Add to Photos" to save it.
        </p>
      )}
    </div>
  );
}
