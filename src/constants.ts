export interface CarWallpaper {
  id: string;
  title: string;
  brand: string;
  category: 'Supercar' | 'Hypercar' | 'Classic' | 'Off-road' | 'Luxury' | 'JDM' | 'Motor Sport';
  imageUrl: string;

}

export const CAR_WALLPAPERS: CarWallpaper[] = [
  {
  id: '1',
  title: 'Bentley Mulliner',
  brand: 'Bentley',
  category: 'Luxury',
  imageUrl: "Velocity/src/assets/bentley-mulliner-3840x2160-22211.jpg",

  },
  {
  id: '2',
  title: 'Bugatti Chiron',
  brand: 'Bugatti',
  category: 'Hypercar',
  imageUrl: "/src/assets/bugatti-chiron-3840x2160-24117.jpg",

  },
  {
  id: '3',
  title: 'Ferrari 12Cilindri',
  brand: 'Ferrari',
  category: 'Supercar',
  imageUrl: "/src/assets/ferrari-12cilindri-3840x2160-22230.jpg",

  },
  {
  id: '4',
  title: 'Ferrari 499P',
  brand: 'Ferrari',
  category: 'Motor Sport',
  imageUrl: "/src/assets/ferrari-499p-8k-7680x4320-19304.jpg",

  },
  {
  id: '5',
  title: 'Ferrari 499P',
  brand: 'Ferrari',
  category: 'Motor Sport',
  imageUrl: "/src/assets/ferrari-499p-2025-6016x3384-21449.jpg",

  },
  {
  id: '6',
  title: 'Prsche 911 GT3 RS',
  brand: 'Porsche',
  category: 'Supercar',
  imageUrl: "/src/assets/Ultrawide_Wallpaper_5.jpg",

  },
  {
  id: '7',
  title: 'Mercedes G Wagon',
  brand: 'Mercedes',
  category: 'Off-road',
  imageUrl: "/src/assets/g-wagon-mercedes-3840x2160-24405.jpg",

  },
  {
  id: '8',
  title: 'Mercedes G Wagon',
  brand: 'Mercedes',
  category: 'Off-road',
  imageUrl: "/src/assets/IMG_3770.jpg",

  },
  {
  id: '9',
  title: 'Porsche 911 Carrera',
  brand: 'Porsche',
  category: 'Supercar',
  imageUrl: "/src/assets/porsche-911-carrera-3840x2160-23036.jpeg",

  },
  {
  id: '10',
  title: 'Porsche 911 Carrera',
  brand: 'Porsche',
  category: 'Supercar',
  imageUrl: "/src/assets/porsche-911-carrera-3840x2160-23841.jpg",

  },
  {
  id: '11',
  title: 'Rolls Royce Phantom',
  brand: 'Rolls Royce',
  category: 'Luxury',
  imageUrl: "/src/assets/rolls-royce-phantom-3840x2160-24430.jpg",

  },
  {
  id: '12',
  title: 'Rolls Royce Spectre',
  brand: 'Rolls Royce',
  category: 'Luxury',
  imageUrl: "/src/assets/rolls-royce-spectre-3840x2160-22749.jpg",

  },
  {
  id: '13',
  title: 'Mazda RX-7',
  brand: 'Mazda',
  category: 'JDM',
  imageUrl: "/src/assets/Wallpaper_1.png",

  },
  {
  id: '14',
  title: 'Audi e-tron GT',
  brand: 'Audi',
  category: 'Supercar',
  imageUrl: "/src/assets/audi-e-tron-gt-3840x2160-22450.jpg",

  },
  {
  id: '15',
  title: 'Bentley Spur',
  brand: 'Bentley',
  category: 'Luxury',
  imageUrl: "/src/assets/bentley-flying-spur-3840x2160-20009.jpg",

  }

];

export const CATEGORIES = ['All', 'Supercar', 'Hypercar', 'Classic', 'Off-road', 'Luxury','JDM','Motor Sport'] as const;
