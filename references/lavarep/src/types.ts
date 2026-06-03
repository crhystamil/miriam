export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  image: string;
  gallery: string[];
  compatibility: string[];
  category: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}
