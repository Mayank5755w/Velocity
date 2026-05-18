import { useParams, Link } from 'react-router-dom';
import { CAR_WALLPAPERS } from '../constants';

export default function BrandPage() {
  const { brand } = useParams();

  const wallpapers = CAR_WALLPAPERS.filter(
    w =>
      w.brand.toLowerCase().replace(/\s+/g, '-') ===
      brand
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <h1 className="text-5xl md:text-7xl font-black italic uppercase mb-10">
        {brand}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wallpapers.map(w => (
          <Link
            key={w.id}
            to={`/brand/${brand}/${w.slug}`}
            className="group border border-zinc-900 overflow-hidden"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={w.imageUrl}
                alt={w.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
            </div>

            <div className="p-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                {w.category}
              </p>

              <h2 className="text-xl font-black italic uppercase mt-2">
                {w.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}