import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { products } from '../data';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="mb-16">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4 block">Nuestra Colección</span>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Catálogo Completo</h1>
        <p className="text-lg text-slate-500 font-light max-w-2xl">Repuestos originales y alternativos seleccionados bajo los más altos estándares de calidad.</p>
      </div>

      <div className="space-y-8">
        {/* Search row */}
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar repuesto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-clean text-sm placeholder:text-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-100">
              <div className="inline-flex p-4 bg-slate-50 rounded-full text-slate-400 mb-6">
                <SlidersHorizontal className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron productos</h3>
              <p className="text-slate-500">Prueba cambiando el término de búsqueda.</p>
              <button
                onClick={() => { setSearchQuery(''); }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
