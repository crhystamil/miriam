import { Link, useLocation } from 'react-router-dom';
import { WashingMachine, Menu, X, Phone } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Catálogo', path: '/catalog' },
  { name: 'Servicios', path: '/services' },
  { name: 'Contacto', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transition-clean group-hover:scale-105">
                <WashingMachine className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold tracking-tight text-xl text-slate-900">
                LAVA<span className="text-blue-600">-PRO</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "transition-clean hover:text-blue-600",
                  location.pathname === link.path ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-slate-500"
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-blue-700 transition-clean flex items-center space-x-2"
            >
              <Phone className="h-4 w-4" />
              <span>WhatsApp Directo</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 focus:outline-none transition-clean"
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-white border-b border-slate-200 max-h-[calc(100vh-64px)] overflow-y-auto"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-3 rounded-lg text-base font-medium transition-colors",
                location.pathname === link.path 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://wa.me/1234567890"
            className="flex items-center space-x-2 px-3 py-4 w-full bg-blue-600 text-white rounded-lg font-semibold"
          >
            <Phone className="h-5 w-5" />
            <span>Contactar por WhatsApp</span>
          </a>
        </div>
      </motion.div>
    </nav>
  );
}
