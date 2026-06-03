import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, Zap, Phone } from 'lucide-react';
import { products } from '../data';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-24 pb-24"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Especialistas en Lavado</span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[1.05] tracking-tight">
              Cuidado Total para tu <span className="text-blue-600">Lavadora</span>
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-light max-w-lg">
              Desde repuestos certificados hasta servicio técnico profesional. Mantenemos tu hogar en movimiento con la eficiencia que mereces.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-blue-700 transition-clean shadow-sm"
              >
                Ver Catálogo
              </Link>
              <a
                href="https://wa.me/1234567890"
                className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-emerald-600 transition-clean flex items-center space-x-2"
              >
                <Phone className="h-4 w-4" />
                <span>WhatsApp Directo</span>
              </a>
            </div>
          </motion.div>

          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl shadow-slate-200/50">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200"
                alt="Washing Machine"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative minimalist elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-slate-200/50 rounded-full blur-3xl text-slate-200 shadow-inner" />
          </div>
        </div>
      </section>

      {/* Featured Banner (based on Design HTML Carousel) */}
      <section className="max-w-4xl mx-auto px-4 mt-20">
        <div className="bg-blue-600 rounded-[2rem] p-10 md:p-16 text-white relative overflow-hidden flex flex-col justify-center min-h-[280px]">
          <h2 className="text-3xl md:text-5xl font-bold z-10 leading-tight">Repuestos Originales</h2>
          <p className="text-blue-100 mt-4 z-10 opacity-90 max-w-md text-lg">
            Detergentes biodegradables y repuestos certificados para todas las marcas.
          </p>
          <Link 
            to="/catalog" 
            className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-xl text-sm font-bold w-max z-10 hover:bg-slate-50 transition-clean shadow-lg shadow-blue-900/10"
          >
            Ver Ofertas
          </Link>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500 rounded-full opacity-30 blur-xl" />
          <div className="absolute top-[-20%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">Stock Actualizado</span>
            <h3 className="text-2xl font-bold text-slate-900">Catálogo Destacado</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Mostrando {featuredProducts.length} de {products.length} productos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <Link to="/catalog" className="sm:hidden flex items-center justify-center space-x-2 text-blue-600 font-bold mt-8 py-4 border border-blue-100 rounded-xl">
          <span>Ver Catálogo Completo</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Store Info / Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                ¿No estás seguro de qué repuesto necesitas?
              </h2>
              <p className="text-lg text-slate-500 mb-10 font-light leading-relaxed">
                Nuestros especialistas están listos para ayudarte. Envíanos una foto del modelo de tu lavadora y el problema que presenta, y te recomendaremos la pieza exacta.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/1234567890"
                  className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-emerald-600 transition-clean shadow-lg shadow-emerald-500/10"
                >
                  Hablar con un Técnico
                </a>
                <Link
                  to="/contact"
                  className="bg-slate-50 text-slate-600 border border-slate-200 px-8 py-4 rounded-xl font-bold text-sm tracking-tight hover:bg-slate-100 transition-clean"
                >
                  Ver Sucursales
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-auto min-h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1200"
                alt="Support Team"
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-blue-600/5" />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
