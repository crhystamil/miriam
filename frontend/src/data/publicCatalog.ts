export type PublicProduct = {
  id: number
  name: string
  brand: string
  image: string
  description: string
  category: string
  compatibility: string[]
  gallery: string[]
}

export const publicProducts: PublicProduct[] = [
  {
    id: 1,
    name: "Bomba de drenaje universal",
    brand: "Whirlpool",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80",
    description: "Bomba de alto rendimiento para ciclos de drenaje estables y silenciosos.",
    category: "Drenaje",
    compatibility: ["Whirlpool", "Mabe", "Electrolux"],
    gallery: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: 2,
    name: "Valvula de entrada doble",
    brand: "LG",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
    description: "Controla el ingreso de agua fria y caliente con flujo uniforme.",
    category: "Hidraulica",
    compatibility: ["LG", "Samsung", "Daewoo"],
    gallery: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: 3,
    name: "Correa de transmision 5PJE",
    brand: "Samsung",
    image: "https://images.unsplash.com/photo-1574263867128-a3d5c1b9ab2d?auto=format&fit=crop&w=800&q=80",
    description: "Correa reforzada para mejorar traccion y reducir desgaste del motor.",
    category: "Transmision",
    compatibility: ["Samsung", "LG", "Panasonic"],
    gallery: ["https://images.unsplash.com/photo-1574263867128-a3d5c1b9ab2d?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: 4,
    name: "Tarjeta electronica principal",
    brand: "Mabe",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80",
    description: "Modulo de control con proteccion de voltaje y programacion de fabrica.",
    category: "Electronica",
    compatibility: ["Mabe", "GE", "Durex"],
    gallery: ["https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: 5,
    name: "Seguro de puerta frontal",
    brand: "Bosch",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    description: "Bloqueo de puerta preciso para inicio seguro de cada ciclo.",
    category: "Seguridad",
    compatibility: ["Bosch", "Siemens", "AEG"],
    gallery: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: 6,
    name: "Amortiguador de tina",
    brand: "Electrolux",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    description: "Reduce vibraciones y protege el sistema interno en altas revoluciones.",
    category: "Suspension",
    compatibility: ["Electrolux", "Whirlpool", "Mabe"],
    gallery: ["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80"]
  }
]

export const publicServices = [
  {
    id: 1,
    title: "Diagnostico tecnico",
    description: "Revision profesional para identificar fallas electricas, mecanicas y de software en el equipo."
  },
  {
    id: 2,
    title: "Instalacion de repuestos",
    description: "Cambio seguro de componentes con pruebas de funcionamiento y calibracion final."
  },
  {
    id: 3,
    title: "Mantenimiento preventivo",
    description: "Limpieza profunda y ajustes clave para extender la vida util de la lavadora."
  },
  {
    id: 4,
    title: "Atencion a domicilio",
    description: "Servicio en sitio para hogares y negocios con tiempos rapidos de respuesta."
  }
]
