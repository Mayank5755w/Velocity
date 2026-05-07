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
  imageUrl: "images/bentley-mulliner-3840x2160-22211.jpg",

  },
  {
  id: '2',
  title: 'Bugatti Chiron',
  brand: 'Bugatti',
  category: 'Hypercar',
  imageUrl: "images/bugatti-chiron-3840x2160-24117.jpg",

  },
  {
  id: '3',
  title: 'Ferrari 12Cilindri',
  brand: 'Ferrari',
  category: 'Supercar',
  imageUrl: "images/ferrari-12cilindri-3840x2160-22230.jpg",

  },
  {
  id: '4',
  title: 'Ferrari 499P',
  brand: 'Ferrari',
  category: 'Motor Sport',
  imageUrl: "images/ferrari-499p-8k-7680x4320-19304.jpg",

  },
  {
  id: '5',
  title: 'Ferrari 499P',
  brand: 'Ferrari',
  category: 'Motor Sport',
  imageUrl: "images/ferrari-499p-2025-6016x3384-21449.jpg",

  },
  {
  id: '6',
  title: 'Prsche 911 GT3 RS',
  brand: 'Porsche',
  category: 'Supercar',
  imageUrl: "images/Ultrawide_Wallpaper_5.jpg",

  },
  {
  id: '7',
  title: 'Mercedes G Wagon',
  brand: 'Mercedes',
  category: 'Off-road',
  imageUrl: "images/g-wagon-mercedes-3840x2160-24405.jpg",

  },
  {
  id: '8',
  title: 'Mercedes G Wagon',
  brand: 'Mercedes',
  category: 'Off-road',
  imageUrl: "images/IMG_3770.jpg",

  },
  {
  id: '9',
  title: 'Porsche 911 Carrera',
  brand: 'Porsche',
  category: 'Supercar',
  imageUrl: "images/porsche-911-carrera-3840x2160-23036.jpeg",

  },
  {
  id: '10',
  title: 'Porsche 911 Carrera',
  brand: 'Porsche',
  category: 'Supercar',
  imageUrl: "images/porsche-911-carrera-3840x2160-23841.jpg",

  },
  {
  id: '11',
  title: 'Rolls Royce Phantom',
  brand: 'Rolls Royce',
  category: 'Luxury',
  imageUrl: "images/rolls-royce-phantom-3840x2160-24430.jpg",

  },
  {
  id: '12',
  title: 'Rolls Royce Spectre',
  brand: 'Rolls Royce',
  category: 'Luxury',
  imageUrl: "images/rolls-royce-spectre-3840x2160-22749.jpg",

  },
  {
  id: '13',
  title: 'Mazda RX-7',
  brand: 'Mazda',
  category: 'JDM',
  imageUrl: "images/Wallpaper_1.png",

  },
  {
  id: '14',
  title: 'Audi e-tron GT',
  brand: 'Audi',
  category: 'Supercar',
  imageUrl: "images/audi-e-tron-gt-3840x2160-22450.jpg",

  },
  {
  id: '15',
  title: 'Bentley Spur',
  brand: 'Bentley',
  category: 'Luxury',
  imageUrl: "images/bentley-flying-spur-3840x2160-20009.jpg",
  },
  {
  id: '16',
  title: 'Porsche 911 GT3 RS',
  brand: 'Porsche',
  category: 'Supercar',
  imageUrl: "images/Ultrawide_Wallpaper_1.jpg",
  },
  {
  id: '17',
  title: 'Honda NSX',
  brand: 'Honda',
  category: 'JDM',
  imageUrl: "images/wallhaven-475yre.png",
  },
  {
  id: '18',
  title: 'Nissan Skyline',
  brand: 'Nissan',
  category: 'JDM',
  imageUrl: "images/wallhaven-xl9krl.png",
  },
  {
  id: '19',
  title: 'Mercedes AMG GT',
  brand: 'Mercedes',
  category: 'Supercar',
  imageUrl: "images/Wallpaper_12.jpg",
  },
  {
  id: '20',
  title: 'Subaru BRZ',
  brand: 'Subaru',
  category: 'JDM',
  imageUrl: "images/subaru-2vo52uatxk5dk31e.png",
  },
  {
  id: '21',
  title: 'Bentley Spur',
  brand: 'Bentley',
  category: 'Luxury',
  imageUrl: "images/bentley-flying-spur-3840x2160-20009.jpg",
  },
  {
  id: '22',
  title: 'Nissan Skyline R34',
  brand: 'Nissan',
  category: 'JDM',
  imageUrl: "images/wallhaven-vgvjem.png",
  },
  {
  id: '23',
  title: 'Nissan 350Z',
  brand: 'Nissan',
  category: 'JDM',
  imageUrl: "images/wallhaven-6ld2yl.png",
  }

];

export const CATEGORIES = ['All', 'Supercar', 'Hypercar', 'Classic', 'Off-road', 'Luxury','JDM','Motor Sport'] as const;
