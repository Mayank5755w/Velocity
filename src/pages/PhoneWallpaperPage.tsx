import { useParams, Link } from 'react-router-dom';
import { PHONE_WALLPAPERS } from '../constants';

export default function PhoneWallpaperPage() {

  const { slug } = useParams();

  const wallpaper = PHONE_WALLPAPERS.find(
    w => w.slug === slug
  );

  if (!wallpaper) {
    return <div>Wallpaper not found</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <Link
        to="/"
        className="inline-block mb-8 border border-zinc-800 px-5 py-3 uppercase text-xs tracking-[0.3em]"
      >
        Back
      </Link>

      <div className="max-w-sm mx-auto">

        <div className="relative rounded-[3rem] overflow-hidden border border-zinc-800 aspect-[9/19] bg-black">

          <img
            src={wallpaper.imageUrl}
            alt={wallpaper.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 border-[8px] border-black rounded-[3rem]" />

          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full" />

        </div>

        <div className="mt-8 text-center">

          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">
            Mobile Wallpaper
          </p>

          <h1 className="text-4xl font-black italic uppercase mt-3">
            {wallpaper.title}
          </h1>

          <a
            href={wallpaper.imageUrl}
            download
            className="mt-8 inline-block bg-white text-black px-8 py-4 font-black uppercase tracking-[0.2em]"
          >
            Download
          </a>

        </div>

      </div>

    </div>
  );
}