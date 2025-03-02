import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import useSettings from '../hooks/useSettings';
import useInteractions from '../hooks/useInteractions';

const Navbar = () => {
  const location = useLocation();
  const { favorites } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings, formatWhatsAppLink } = useSettings();
  const { trackInteraction } = useInteractions();

  const handleContactClick = () => {
    trackInteraction('whatsapp', 'navbar');
    const message = 'Olá! Gostaria de mais informações sobre os imóveis disponíveis.';
    window.open(formatWhatsAppLink(message), '_blank');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/imoveis"
              className={`nav-link text-gray-600 hover:text-teal-500 ${
                location.pathname === '/imoveis' ? 'active' : ''
              }`}
            >
              Imóveis
            </Link>
            <Link
              to="/sobre"
              className={`nav-link text-gray-600 hover:text-teal-500 ${
                location.pathname === '/sobre' ? 'active' : ''
              }`}
            >
              Sobre
            </Link>
            <button
              onClick={handleContactClick}
              className="px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-lg font-medium hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-teal-500/30"
            >
              Fale Conosco
            </button>
            <Link
              to="/imoveis?favorite=true"
              className="relative group"
            >
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {favorites.length}
              </span>
              <i className="fas fa-heart text-xl text-gray-600 group-hover:text-red-500 transition-colors"></i>
            </Link>
          </div>

          {/* Mobile Menu Controls */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/imoveis?favorite=true"
              className="relative group p-2"
            >
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {favorites.length}
              </span>
              <i className="fas fa-heart text-xl text-gray-600 group-hover:text-red-500 transition-colors"></i>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-gray-600`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/imoveis"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname === '/imoveis'
                    ? 'bg-teal-50 text-teal-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Imóveis
              </Link>
              <Link
                to="/sobre"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname === '/sobre'
                    ? 'bg-teal-50 text-teal-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Sobre
              </Link>
              <button
                onClick={() => {
                  handleContactClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-lg font-medium hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-teal-500/30"
              >
                Fale Conosco
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;