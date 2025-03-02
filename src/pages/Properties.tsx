import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase, Property, PropertyImage, getAvailableCities } from '../lib/supabase';
import { PropertyCard } from '../components/PropertyCard';
import { useFavorites } from '../hooks/useFavorites';

// Seção Hero com fundo impactante para complementar o navbar
const HeroSection = () => {
  return (
    <section
      className="relative h-[400px] bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
          Encontre o Lar dos Seus Sonhos
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-white max-w-2xl">
          Descubra as melhores opções de imóveis à venda com filtros avançados e uma experiência única.
        </p>
      </div>
    </section>
  );
};

interface SearchFiltersProps {
  filters: {
    propertyType: string;
    city: string;
    priceRange: string;
    customPriceMin: string;
    customPriceMax: string;
    bedrooms: string;
    parkingSpots: string;
    code: string;
  };
  setFilter: (key: string, value: string) => void;
  cities: string[];
  onSubmit: (e?: React.FormEvent) => void;
  onClear: () => void;
  isMobile?: boolean;
}

// Componente de Filtros reutilizável (para desktop e mobile)
const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  setFilter,
  cities,
  onSubmit,
  onClear,
  isMobile = false,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"}
    >
      {/* Tipo de Imóvel */}
      <div className="relative">
        <label className="sr-only" htmlFor="propertyType">
          Tipo de Imóvel
        </label>
        <select
          id="propertyType"
          value={filters.propertyType}
          onChange={(e) => setFilter('propertyType', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 hover:border-teal-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none transition-colors"
        >
          <option value="">Todos os tipos</option>
          <option value="house">Casa</option>
          <option value="apartment">Apartamento</option>
          <option value="land">Terreno</option>
          <option value="commercial">Comercial</option>
        </select>
      </div>

      {/* Localização */}
      <div className="relative">
        <label className="sr-only" htmlFor="city">
          Localização
        </label>
        <select
          id="city"
          value={filters.city}
          onChange={(e) => setFilter('city', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 hover:border-teal-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none transition-colors"
        >
          <option value="">Todas as cidades</option>
          {cities.map((city: string) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Faixa de Preço */}
      <div className="relative">
        <label className="sr-only" htmlFor="priceRange">
          Faixa de Preço
        </label>
        <select
          id="priceRange"
          value={filters.priceRange}
          onChange={(e) => setFilter('priceRange', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 hover:border-teal-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none transition-colors"
        >
          <option value="">Qualquer valor</option>
          <option value="0-500000">Até R$ 500.000</option>
          <option value="500000-1000000">R$ 500.000 - R$ 1.000.000</option>
          <option value="1000000-2000000">R$ 1.000.000 - R$ 2.000.000</option>
          <option value="2000000+">Acima de R$ 2.000.000</option>
          <option value="custom">Customizado</option>
        </select>
        {filters.priceRange === 'custom' && (
          <div className="mt-2 flex space-x-2">
            <input
              type="number"
              placeholder="Mínimo"
              value={filters.customPriceMin}
              onChange={(e) => setFilter('customPriceMin', e.target.value)}
              className="w-1/2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-teal-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none transition-colors"
            />
            <input
              type="number"
              placeholder="Máximo"
              value={filters.customPriceMax}
              onChange={(e) => setFilter('customPriceMax', e.target.value)}
              className="w-1/2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:border-teal-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Número de Quartos */}
      <div className="relative">
        <label className="sr-only" htmlFor="bedrooms">
          Quartos
        </label>
        <select
          id="bedrooms"
          value={filters.bedrooms}
          onChange={(e) => setFilter('bedrooms', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 hover:border-teal-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none transition-colors"
        >
          <option value="">Quartos</option>
          <option value="1">1 ou mais</option>
          <option value="2">2 ou mais</option>
          <option value="3">3 ou mais</option>
          <option value="4">4 ou mais</option>
        </select>
      </div>

      {/* Vagas de Garagem */}
      <div className="relative">
        <label className="sr-only" htmlFor="parkingSpots">
          Vagas de Garagem
        </label>
        <select
          id="parkingSpots"
          value={filters.parkingSpots}
          onChange={(e) => setFilter('parkingSpots', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 hover:border-teal-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none transition-colors"
        >
          <option value="">Vagas</option>
          <option value="1">1 ou mais</option>
          <option value="2">2 ou mais</option>
          <option value="3">3 ou mais</option>
          <option value="4">4 ou mais</option>
        </select>
      </div>

      {/* Código do Imóvel */}
      <div className="relative">
        <label className="sr-only" htmlFor="code">
          Código do Imóvel
        </label>
        <input
          id="code"
          type="text"
          placeholder="Código do imóvel"
          value={filters.code}
          onChange={(e) => setFilter('code', e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 hover:border-teal-400 focus:border-teal-400 focus:ring-1 focus:ring-teal-400/20 focus:outline-none transition-colors"
        />
      </div>

      {/* Botões Buscar e Limpar */}
      <div className="flex items-center space-x-2">
        <button
          type="submit"
          className="flex-1 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-xl font-medium hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
        >
          <i className="fas fa-search"></i>
          <span>{isMobile ? 'Aplicar Filtros' : 'Buscar'}</span>
        </button>
        <button
          type="button"
          onClick={onClear}
          className="py-3 px-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Limpar
        </button>
      </div>
    </form>
  );
};

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favorites } = useFavorites();

  // Estados dos filtros inicializados a partir da URL
  const [filters, setFilters] = useState({
    propertyType: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    priceRange: searchParams.get('price') || '',
    customPriceMin: '',
    customPriceMax: '',
    bedrooms: searchParams.get('bedrooms') || '',
    parkingSpots: searchParams.get('parking') || '',
    code: searchParams.get('code') || '',
  });

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Atualiza um filtro específico
  const setFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reseta os filtros e limpa os parâmetros da URL
  const resetFilters = () => {
    setFilters({
      propertyType: '',
      city: '',
      priceRange: '',
      customPriceMin: '',
      customPriceMax: '',
      bedrooms: '',
      parkingSpots: '',
      code: '',
    });
    setSearchParams({});
  };

  // Carrega as cidades disponíveis
  useEffect(() => {
    const loadCities = async () => {
      const availableCities = await getAvailableCities();
      setCities(availableCities);
    };
    loadCities();
  }, []);

  // Atualiza filtros a partir da URL e dispara a busca
  useEffect(() => {
    setFilters({
      propertyType: searchParams.get('type') || '',
      city: searchParams.get('city') || '',
      priceRange: searchParams.get('price') || '',
      customPriceMin: '',
      customPriceMax: '',
      bedrooms: searchParams.get('bedrooms') || '',
      parkingSpots: searchParams.get('parking') || '',
      code: searchParams.get('code') || '',
    });
    const favoriteParam = searchParams.get('favorite');
    fetchProperties(favoriteParam === 'true');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Refiltra caso os favoritos sejam atualizados
  useEffect(() => {
    const favoriteParam = searchParams.get('favorite');
    if (favoriteParam === 'true') {
      setProperties((prev) => prev.filter((property) => favorites.includes(property.id)));
    }
  }, [favorites, searchParams]);
  
  // Função que busca os imóveis a partir dos filtros
  const fetchProperties = useCallback(
    async (showFavorites = false) => {
    try {
      setLoading(true);
      setError(null);
      
        let query = supabase.from('properties').select('*, property_images(*)');

        if (filters.propertyType && filters.propertyType !== 'todos') {
          query = query.eq('property_type', filters.propertyType);
        }
        if (filters.city) {
          query = query.eq('address_city', filters.city);
        }
        if (filters.priceRange) {
          if (filters.priceRange === 'custom') {
            const min = Number(filters.customPriceMin);
            const max = Number(filters.customPriceMax);
            if (min) query = query.gte('price', min);
            if (max) query = query.lte('price', max);
          } else {
            const [min, max] = filters.priceRange.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }
        }
        if (filters.bedrooms) {
          query = query.gte('bedrooms', parseInt(filters.bedrooms));
        }
        if (filters.parkingSpots) {
          query = query.gte('parking_spots', parseInt(filters.parkingSpots));
        }
      
      const { data, error: queryError } = await query.order('created_at', { ascending: false });
      if (queryError) throw queryError;
      
        const propertiesWithImages = data?.map((property) => ({
        ...property,
          images: property.property_images?.map((img: PropertyImage) => img.url) || [],
      })) || [];
      
      let filteredProperties = propertiesWithImages;
      
        if (filters.code) {
          filteredProperties = filteredProperties.filter((property) =>
            property.id.slice(-4).toLowerCase().includes(filters.code.toLowerCase())
          );
        }

      if (showFavorites) {
          filteredProperties = filteredProperties.filter((property) => favorites.includes(property.id));
      }
      
      setProperties(filteredProperties);
    } catch (err) {
        console.error('Erro ao buscar imóveis:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
    },
    [filters, favorites]
  );
  
  // Handler para submeter a busca
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params: Record<string, string> = {};
    if (filters.propertyType) params.type = filters.propertyType;
    if (filters.city) params.city = filters.city;
    if (filters.priceRange) {
      params.price =
        filters.priceRange === 'custom'
          ? `${filters.customPriceMin}-${filters.customPriceMax}`
          : filters.priceRange;
    }
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters.parkingSpots) params.parking = filters.parkingSpots;
    if (filters.code) params.code = filters.code;
    
    setSearchParams(params);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="bg-white">
      {/* Seção Hero */}
      <HeroSection />
      <div className="min-h-screen pt-10 pb-20">
        <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h2 className="text-4xl font-bold text-gray-800">Imóveis à Venda</h2>
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="md:hidden w-full bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-4 py-3 rounded-xl font-medium hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
              >
                <i className="fas fa-filter"></i>
                <span>Filtrar Imóveis</span>
              </button>
            </div>

            {/* Filtros para desktop */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 hidden md:block">
              <SearchFilters
                filters={filters}
                setFilter={setFilter}
                cities={cities}
                onSubmit={handleSearch}
                onClear={resetFilters}
              />
          </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg" role="alert">
                <p>{error}</p>
              </div>
            )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : properties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-200"
              >
                <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                <p className="text-gray-600 text-lg mb-4">
                  Nenhum imóvel encontrado com os filtros selecionados
                </p>
                <button
                  onClick={resetFilters}
                  className="text-teal-500 hover:text-teal-600 font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 rounded-lg px-4 py-2"
                >
                  Limpar Filtros
                </button>
              </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      </div>

      {/* Modal de busca para mobile */}
      <AnimatePresence>
        {isSearchModalOpen && (
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Filtrar Imóveis</h3>
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <SearchFilters
                filters={filters}
                setFilter={setFilter}
                cities={cities}
                onSubmit={handleSearch}
                onClear={resetFilters}
                isMobile
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Properties;
