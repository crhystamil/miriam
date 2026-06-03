import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Send } from 'lucide-react';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3 block">Estamos para ayudarte</span>
          <h1 className="text-5xl font-bold text-slate-900 mb-8 tracking-tight">Ponte en contacto</h1>
          <p className="text-xl text-slate-500 font-light leading-relaxed mb-12">
            ¿Tienes dudas sobre un repuesto o necesitas agendar un servicio técnico? Nuestro equipo de atención al cliente responderá a la brevedad.
          </p>

          <div className="space-y-10">
            <div className="flex items-start space-x-6 group">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Sucursal Principal</h3>
                <p className="text-slate-500 font-light">Av. Principal #123, Sector Industrial, Santiago, Chile</p>
              </div>
            </div>

            <div className="flex items-start space-x-6 group">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Teléfonos y WhatsApp</h3>
                <p className="text-slate-500 font-light">+56 9 1234 5678 (Ventas)</p>
                <p className="text-slate-500 font-light">+56 2 2345 6789 (Servicio Técnico)</p>
              </div>
            </div>

            <div className="flex items-start space-x-6 group">
              <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Horario de Atención</h3>
                <p className="text-slate-500 font-light">Lunes a Viernes: 09:00 - 18:30</p>
                <p className="text-slate-500 font-light">Sábados: 10:00 - 14:00</p>
              </div>
            </div>
          </div>

          <div className="mt-16 flex space-x-4">
            <a href="#" className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-pink-600 hover:border-pink-100 transition-all">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-400 hover:border-blue-100 transition-all">
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-[2rem] shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Mensaje Directo</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white outline-none transition-clean text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white outline-none transition-clean text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Asunto</label>
              <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white outline-none transition-clean text-sm appearance-none">
                <option>Consulta de Repuesto</option>
                <option>Servicio Técnico</option>
                <option>Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mensaje</label>
              <textarea
                placeholder="¿Cómo podemos ayudarte?"
                rows={5}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white outline-none transition-clean text-sm resize-none"
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full flex items-center justify-center space-x-3 py-4 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-clean shadow-sm"
            >
              <span>Enviar Formulario</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Map Placeholder */}
      <div className="mt-24 h-96 w-full rounded-[3rem] overflow-hidden border border-slate-200 relative group">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1920"
          alt="Map Location"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-all" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="p-4 bg-blue-600 text-white rounded-full shadow-2xl animate-bounce">
            <MapPin className="h-8 w-8" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
