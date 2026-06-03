import { Product, Service } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Bomba de Drenaje Universal',
    brand: 'Samsung / LG / Whirlpool',
    description: 'Bomba de drenaje de alta calidad compatible con la mayoría de las marcas líderes. Motor silencioso y duradero.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&q=80&w=800',
    ],
    compatibility: ['Samsung', 'LG', 'Whirlpool', 'Mabe', 'Fensa'],
    category: 'Bombas',
  },
  {
    id: '2',
    name: 'Sello de Tina 35mm',
    brand: 'LG',
    description: 'Sello original para tina de lavadora LG de carga frontal. Evita filtraciones y protege los rodamientos.',
    price: 15.50,
    image: 'https://images.unsplash.com/photo-1545173168-9f1947b8642a?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1545173168-9f1947b8642a?auto=format&fit=crop&q=80&w=800',
    ],
    compatibility: ['LG', 'Samsung'],
    category: 'Sellos',
  },
  {
    id: '3',
    name: 'Tarjeta de Control Electrónica',
    brand: 'Whirlpool',
    description: 'Tarjeta de control principal para modelos Whirlpool Xpert System. Reemplazo directo Plug & Play.',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800',
    ],
    compatibility: ['Whirlpool'],
    category: 'Electrónica',
  },
  {
    id: '4',
    name: 'Amortiguadores Hidráulicos (Par)',
    brand: 'General Electric',
    description: 'Kit de 2 amortiguadores para reducir vibraciones y ruido en el ciclo de centrifugado.',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    ],
    compatibility: ['GE', 'Mabe', 'Kenmore'],
    category: 'Suspensión',
  },
  {
    id: '5',
    name: 'Correa de Transmisión Reforzada',
    brand: 'Dayco / Mabe',
    description: 'Correa tipo V de alta resistencia para motores de lavadoras automáticas.',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1530124560612-3bd9a121ff8f?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1530124560612-3bd9a121ff8f?auto=format&fit=crop&q=80&w=800',
    ],
    compatibility: ['Mabe', 'Fensa', 'Easy'],
    category: 'Correas',
  },
  {
    id: '6',
    name: 'Válvula de Entrada de Agua Triple',
    brand: 'Samsung',
    description: 'Electroválvula triple para llenado de agua fría, caliente y pre-lavado.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1617464166445-1d247900b217?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1617464166445-1d247900b217?auto=format&fit=crop&q=80&w=800',
    ],
    compatibility: ['Samsung', 'LG'],
    category: 'Válvulas',
  },
];

export const services: Service[] = [
  {
    id: '1',
    title: 'Reparación Técnica',
    description: 'Diagnosticamos y reparamos fallas mecánicas y electrónicas en lavadoras de todas las marcas.',
    icon: 'Hammer',
  },
  {
    id: '2',
    title: 'Mantenimiento Preventivo',
    description: 'Limpieza profunda de tina, revisión de sellos y lubricación para extender la vida útil de tu equipo.',
    icon: 'Settings',
  },
  {
    id: '3',
    title: 'Instalación Profesional',
    description: 'Conexión segura a tomas de agua, desagüe y nivelación perfecta para evitar vibraciones.',
    icon: 'Package',
  },
  {
    id: '4',
    title: 'Asesoría Especializada',
    description: 'Te ayudamos a encontrar el repuesto exacto que necesitas según el modelo de tu lavadora.',
    icon: 'Wrench',
  },
];
