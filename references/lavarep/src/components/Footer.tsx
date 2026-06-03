import { Link } from 'react-router-dom';
import { WashingMachine, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <WashingMachine className="h-5 w-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 uppercase">
                Lava<span className="text-blue-600">Repuestos</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Tu solución integral para repuestos de lavadoras de todas las marcas. Calidad garantizada y servicio técnico especializado.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Navegación</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Inicio</Link></li>
              <li><Link to="/catalog" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Catálogo de Productos</Link></li>
              <li><Link to="/services" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Nuestros Servicios</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Soporte</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Envíos y Entregas</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Garantías</a></li>
              <li><a href="#" className="text-slate-500 hover:text-blue-600 text-sm transition-colors">Términos de Servicio</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-slate-500 text-sm">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0" />
                <span>Av. Principal #123, Sector Servicios, Santiago, Chile</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-500 text-sm">
                <Phone className="h-5 w-5 text-blue-600 shrink-0" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-500 text-sm">
                <Mail className="h-5 w-5 text-blue-600 shrink-0" />
                <span>contacto@lavarepuestos.cl</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs">
          <p>© {currentYear} LavaRepuestos. Todos los derechos reservados.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-slate-600">Privacidad</a>
            <a href="#" className="hover:text-slate-600">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
