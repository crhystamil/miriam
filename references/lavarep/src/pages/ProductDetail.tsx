import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { products } from '../data';
import { MessageCircle, CheckCircle2, ChevronLeft, ArrowRight, Share2, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState(product?.image || '');

  useEffect(() => {
    if (product && !activeImage) {
      setActiveImage(product.image);
    }
    window.scrollTo(0, 0);
  }, [product, activeImage]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
        <Link to="/catalog" className="text-blue-600 font-bold hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const whatsappMessage = `Hola, me gustaría más información sobre el producto: ${product.name} (${product.brand})`;
  const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24"
    >
      {/* Breadcrumbs & Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
            <Link to="/catalog" className="hover:text-blue-600">Productos</Link>
            <span>/</span>
            <span className="text-blue-600">Detalle</span>
          </div>
          <button className="text-slate-400 hover:text-blue-600 transition-clean flex items-center space-x-1 text-xs font-bold uppercase tracking-widest leading-none">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Gallery */}
          <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
              <img
                src={activeImage || undefined}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {product.gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-clean ${
                      activeImage === img ? 'border-blue-600 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img || undefined} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="mb-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
                {product.brand}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-400 font-medium mb-8">Ref: LP-{product.id}000{product.id} • Categoría: {product.category}</p>
            
            <div className="space-y-10">
              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Descripción</h5>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              <div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Compatibilidad</h5>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.map((brand) => (
                    <span key={brand} className="bg-slate-100 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-3 py-4 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-clean shadow-lg shadow-emerald-500/10"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Consultar vía WhatsApp</span>
              </a>
              <button className="px-6 py-4 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-clean">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-20 border-t border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Stock Complementario</span>
                <h2 className="text-2xl font-bold text-slate-900">Productos Relacionados</h2>
              </div>
              <Link to="/catalog" className="text-blue-600 font-bold hover:underline flex items-center space-x-2 text-sm uppercase tracking-widest">
                <span>Ver todos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
