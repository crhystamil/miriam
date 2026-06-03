import { motion } from 'motion/react';
import { services } from '../data';
import * as LucideIcons from 'lucide-react';
import { Calendar, MessageSquare, Clock, Shield } from 'lucide-react';

export default function Services() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-24"
    >
      {/* Hero Section */}
      <section className="bg-white py-24 relative overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Excelencia Técnica</span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight max-w-4xl">
            Servicio profesional que garantiza tu tranquilidad.
          </h1>
          <p className="text-lg text-slate-500 font-light leading-relaxed max-w-2xl">
            Soluciones integrales de mantenimiento, instalación y reparación para que tu lavadora funcione siempre como el primer día.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 border-l border-slate-100 -skew-x-12 transform origin-top-right" />
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => {
            // @ts-ignore
            const Icon = LucideIcons[service.icon] || LucideIcons.Tool;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-clean group"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-8 group-hover:scale-105 transition-clean">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light mb-8">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-blue-600" />
                    <span>Respuesta 24h</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-blue-600" />
                    <span>Garantía 6 Meses</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Reserva tu visita hoy mismo</h2>
            <p className="text-xl text-blue-100 mb-12 font-light">
              Agenda una revisión técnica a domicilio. Contamos con técnicos certificados y equipados con los repuestos originales necesarios.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/1234567890"
                className="bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all flex items-center justify-center space-x-3"
              >
                <Calendar className="h-5 w-5" />
                <span>Agendar por WhatsApp</span>
              </a>
              <a
                href="tel:+56912345678"
                className="bg-blue-700 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center space-x-3"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Llamar Ahora</span>
              </a>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 bg-slate-900/20 rounded-full blur-3xl" />
        </div>
      </section>
    </motion.div>
  );
}
