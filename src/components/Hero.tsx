import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAvailableCities } from '../lib/supabase';

const Hero = () => {
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [code, setCode] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      const availableCities = await getAvailableCities();
      setCities(availableCities);
    };
    loadCities();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (propertyType) params.append('type', propertyType);
    if (city) params.append('city', city);
    if (priceRange) params.append('price', priceRange);
    if (code) params.append('code', code);
    
    navigate(`/imoveis?${params.toString()}`);
    setIsSearchModalOpen(false);
  };

  // Componente do Modal de Busca
  const SearchModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
      onClick={() => setIsSearchModalOpen(false)}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Buscar Imóveis</h3>
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de Imóvel</label>
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none text-sm transition-all"
              >
                <option value="">Todos os tipos</option>
                <option value="house">Casa</option>
                <option value="apartment">Apartamento</option>
                <option value="land">Terreno</option>
                <option value="commercial">Comercial</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Localização</label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none text-sm transition-all"
              >
                <option value="">Todas as cidades</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Faixa de Preço</label>
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none text-sm transition-all"
              >
                <option value="">Qualquer valor</option>
                <option value="0-500000">Até R$ 500.000</option>
                <option value="500000-1000000">R$ 500.000 - R$ 1.000.000</option>
                <option value="1000000-2000000">R$ 1.000.000 - R$ 2.000.000</option>
                <option value="2000000+">Acima de R$ 2.000.000</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Código do Imóvel</label>
            <input
              type="text"
              placeholder="Digite o código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-xl font-medium hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-teal-500/30 mt-6 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-search"></i>
            <span>Buscar Imóveis</span>
          </button>
        </form>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 md:px-0 py-16 md:py-0 md:mt-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/modern-house.jpg)'
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-3 md:space-y-4 px-4 mt-4 md:mt-0"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-tight">
              Encontre a Casa dos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                Seus Sonhos
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-gray-200 max-w-3xl mx-auto">
              Descubra propriedades exclusivas em localizações privilegiadas de{' '}
              <span className="text-teal-400">Itapecerica da Serra</span>
            </p>
          </motion.div>

          {/* Search Form - Desktop Version */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearch}
            className="w-full max-w-4xl px-4 mt-2 md:mt-0 hidden md:block"
          >
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3 bg-white/95 backdrop-blur-sm rounded-lg p-5 md:p-4 shadow-lg">
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 md:py-2 rounded-lg bg-transparent text-gray-800 border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none text-sm transition-all"
                  >
                    <option value="">Tipo de Imóvel</option>
                    <option value="house">Casa</option>
                    <option value="apartment">Apartamento</option>
                    <option value="land">Terreno</option>
                    <option value="commercial">Comercial</option>
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 md:py-2 rounded-lg bg-transparent text-gray-800 border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none text-sm transition-all"
                  >
                    <option value="">Localização</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-3 md:py-2 rounded-lg bg-transparent text-gray-800 border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none text-sm transition-all"
                  >
                    <option value="">Valor</option>
                    <option value="0-500000">Até R$ 500.000</option>
                    <option value="500000-1000000">R$ 500.000 - R$ 1.000.000</option>
                    <option value="1000000-2000000">R$ 1.000.000 - R$ 2.000.000</option>
                    <option value="2000000+">Acima de R$ 2.000.000</option>
                  </select>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Código"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-3 md:py-2 rounded-lg bg-transparent text-gray-800 border border-gray-200 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none text-sm transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3.5 md:py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-lg font-medium hover:from-teal-500 hover:to-cyan-500 transition-all text-base md:text-sm shadow-lg hover:shadow-teal-500/30 hover:translate-y-[-2px] self-stretch flex items-center justify-center"
              >
                Buscar
              </button>
            </div>
          </motion.form>

          {/* Mobile Search Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onClick={() => setIsSearchModalOpen(true)}
            className="md:hidden w-full max-w-xs px-6 py-4 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-xl font-medium hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center space-x-2"
          >
            <i className="fas fa-search"></i>
            <span>Buscar Imóveis</span>
          </motion.button>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 px-4 mt-4 md:mt-2"
          >
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-colors">
              <span className="font-semibold text-teal-400">200+</span> Imóveis Disponíveis
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-colors">
              <span className="font-semibold text-teal-400">50+</span> Condomínios
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs sm:text-sm border border-white/20 hover:bg-white/20 transition-colors">
              <span className="font-semibold text-teal-400">24/7</span> Suporte
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-center cursor-pointer hidden md:block"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <p className="text-xs font-medium mb-1">Explore Mais</p>
        <svg
          className="w-5 h-5 mx-auto"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </motion.div>

      {/* Search Modal for Mobile */}
      <AnimatePresence>
        {isSearchModalOpen && <SearchModal />}
      </AnimatePresence>
    </div>
  );
};

export default Hero;