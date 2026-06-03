import { Link } from 'react-router-dom';
import { Info, MessageCircle, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const whatsappMessage = `Hola, me interesa el producto: ${product.name} (${product.brand})`;
  const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-clean"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100 rounded-lg mb-4">
        <img
          src={product.image || undefined}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-clean"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
          {product.brand}
        </span>
        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
          {product.name}
        </h3>
        
        <div className="pt-4 flex space-x-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 py-2 text-center bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100 transition-clean"
          >
            Detalles
          </Link>
          
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 text-white p-2 rounded hover:bg-emerald-600 transition-clean flex items-center justify-center shadow-sm"
            title="Compar por WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
