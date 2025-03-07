import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import useSettings from '../hooks/useSettings';
import useInteractions from '../hooks/useInteractions';
import Logo from './Logo';

const Footer = () => {
  const { settings, formatWhatsAppLink, formatPhoneNumber, loading, error } = useSettings();
  const { trackInteraction } = useInteractions();

  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (error) {
    console.error('Footer error:', error);
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </footer>
    );
  }

  if (!settings) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo and Contact */}
          <div className="flex-1">
            <Logo isLight showText />
            <div className="mt-4 space-y-2">
              <p className="text-gray-400">{settings.company_address}</p>
              <p className="text-gray-400">{settings.company_city}</p>
              <p className="text-gray-400">CEP: {settings.company_postal_code}</p>
              <p className="text-gray-400">CRECI: {settings.company_creci}</p>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              {settings.phone_contact && (
                <a 
                  href={`tel:+${settings.phone_contact}`} 
                  className="text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    trackInteraction('phone', 'footer');
                    window.location.href = `tel:+${settings.phone_contact}`;
                  }}
                >
                  <i className="fas fa-phone" />
                  {formatPhoneNumber(settings.phone_contact)}
                </a>
              )}
              {settings.email_contact && (
                <a 
                  href={`mailto:${settings.email_contact}`} 
                  className="text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    trackInteraction('email', 'footer');
                    window.location.href = `mailto:${settings.email_contact}`;
                  }}
                >
                  <i className="fas fa-envelope" />
                  {settings.email_contact}
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Página Inicial
                </Link>
              </li>
              <li>
                <Link to="/imoveis" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-teal-400 transition-colors">
                  Sobre a Empresa
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <FaInstagram size={24} />
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <FaFacebookF size={24} />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <FaYoutube size={24} />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <FaLinkedinIn size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} {settings.company_name}. Todos os direitos reservados.
          </p>
          <Link to="/privacidade" className="text-gray-400 hover:text-teal-400 transition-colors text-sm">
            Política de Privacidade
          </Link>
        </div>
      </div>

      {/* WhatsApp Button */}
      {settings.whatsapp_number && (
        <a
          href={formatWhatsAppLink('Olá! Vi seu site e gostaria de mais informações sobre os imóveis. Pode me ajudar?')}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50 group"
          onClick={(e) => {
            e.preventDefault();
            trackInteraction('whatsapp', 'floating');
            window.open(formatWhatsAppLink('Olá! Vi seu site e gostaria de mais informações sobre os imóveis. Pode me ajudar?'), '_blank');
          }}
        >
          <FaWhatsapp size={24} />
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm">
            Fale com um corretor
          </span>
        </a>
      )}
    </footer>
  );
};

export default Footer;