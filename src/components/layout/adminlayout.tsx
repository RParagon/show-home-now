import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import Logo from '../Logo';
import AdminTutorial from '../AdminTutorial';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else if (session.user.email) {
        setUserName(session.user.email);
      }
    };

    checkAuth();
  }, [navigate]);

  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' ? 'border-teal-400 text-teal-400' : 'border-transparent text-gray-500 hover:border-teal-400 hover:text-teal-400';
    }
    return location.pathname.startsWith(path) ? 'border-teal-400 text-teal-400' : 'border-transparent text-gray-500 hover:border-teal-400 hover:text-teal-400';
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/admin" className="flex items-center">
                <Logo showText isInsideLink />
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8" data-tutorial="nav-menu">
                <Link
                  to="/admin"
                  className={`${isActivePath('/admin')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  data-tutorial="dashboard-link"
                >
                  <i className="fas fa-home mr-2"></i>
                  Dashboard
                </Link>
                <Link
                  to="/admin/properties"
                  className={`${isActivePath('/admin/properties')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  data-tutorial="properties-link"
                >
                  <i className="fas fa-home mr-2"></i>
                  Imóveis
                </Link>
                <Link
                  to="/admin/settings"
                  className={`${isActivePath('/admin/settings')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  data-tutorial="settings-link"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Configurações
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="hidden sm:flex items-center">
                <div className="relative" data-tutorial="profile-menu">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-teal-500 focus:outline-none px-3 py-2 rounded-md transition-colors duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center text-white">
                      {userName ? userName[0].toUpperCase() : 'A'}
                    </div>
                    <span className="font-medium text-sm">{userName || 'Admin'}</span>
                    <i className={`fas fa-chevron-down transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mobile menu button */}
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-400"
                >
                  <span className="sr-only">Abrir menu</span>
                  <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} h-6 w-6`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden overflow-hidden`}
        >
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/admin"
              className={`${
                isActivePath('/admin')
                  ? 'bg-teal-50 border-teal-400 text-teal-400'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
            >
              <i className="fas fa-home mr-2"></i>
              Dashboard
            </Link>
            <Link
              to="/admin/properties"
              className={`${
                isActivePath('/admin/properties')
                  ? 'bg-teal-50 border-teal-400 text-teal-400'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
            >
              <i className="fas fa-home mr-2"></i>
              Imóveis
            </Link>
            <Link
              to="/admin/settings"
              className={`${
                isActivePath('/admin/settings')
                  ? 'bg-teal-50 border-teal-400 text-teal-400'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
            >
              <i className="fas fa-cog mr-2"></i>
              Configurações
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Sair
            </button>
          </div>
        </motion.div>
      </nav>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>

      <AdminTutorial />

      {/* Footer com direitos autorais */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>&copy; 2025 Shop Home Now</span>
            <span className="text-gray-400">|</span>
            <span>Desenvolvido por Rafael Paragon</span>
            <a 
              href="https://github.com/rparagon" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              title="GitHub"
            >
              <i className="fab fa-github text-lg"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;