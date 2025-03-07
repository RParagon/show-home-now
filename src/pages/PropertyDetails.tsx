import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase, Property, PropertyImage } from '../lib/supabase';
import { useFavorites } from '../hooks/useFavorites';
import useInteractions from '../hooks/useInteractions';

const PropertyDetails = () => {
  const { id, tipo, cidade } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState('5511999999999');
  const { toggleFavorite, isFavorite } = useFavorites();
  const { trackInteraction } = useInteractions();

  useEffect(() => {
    fetchProperty();
    fetchWhatsappNumber();
  }, [id]);

  // Rastrear visualização quando o imóvel é carregado
  useEffect(() => {
    if (property && id) {
      trackInteraction('view', 'property_details');
    }
  }, [property, id, trackInteraction]);

  const fetchWhatsappNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('whatsapp_number')
        .single();
        
      if (error) throw error;
      if (data && data.whatsapp_number) {
        setWhatsappNumber(data.whatsapp_number);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp number:', error);
    }
  };

  const fetchProperty = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            url,
            position
          ),
          property_amenities (id, name),
          property_features (id, name, value)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Transformar os dados para o formato esperado
      const propertyWithFormattedImages = {
        ...data,
        images: data.property_images?.map((img: PropertyImage) => img.url) || [],
        amenities: data.property_amenities || [],
        features: data.property_features || []
      };

      setProperty(propertyWithFormattedImages);
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar propriedade');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const previousImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Propriedade não encontrada</p>
      </div>
    );
  }

  const isFavorited = isFavorite(id);
  
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
    [
      property.address_street,
      property.address_number,
      property.address_neighborhood,
      property.address_city,
      property.address_state
    ].filter(Boolean).join(', ')
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 pt-20 pb-24"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-teal-500 transition-colors"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Voltar</span>
        </button>

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-teal-500 transition-colors">Home</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <Link to="/imoveis" className="hover:text-teal-500 transition-colors">Imóveis</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <Link to={`/imoveis/${tipo}`} className="hover:text-teal-500 transition-colors capitalize">{tipo?.replace(/-/g, ' ')}</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <Link to={`/imoveis/${tipo}/${cidade}`} className="hover:text-teal-500 transition-colors capitalize">{cidade?.replace(/-/g, ' ')}</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-gray-800">{property?.title}</span>
        </nav>

        {/* Galeria de Imagens */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-[500px]">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={previousImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white p-3 rounded-full hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white p-3 rounded-full hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white mb-2">{property.title}</h1>
                    <button
                      onClick={() => toggleFavorite(id)}
                      className="bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all"
                    >
                      <i className={`fas fa-heart text-2xl ${isFavorited ? 'text-red-500' : 'text-white'}`}></i>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <i className="fas fa-map-marker-alt"></i>
                    <p className="text-sm">
                      {[
                        property.address_street,
                        property.address_number,
                        property.address_neighborhood,
                        property.address_city,
                        property.address_state
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Sem imagens disponíveis</span>
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {property.images && property.images.length > 1 && (
            <div className="p-4 overflow-x-auto bg-gray-50">
              <div className="flex space-x-4">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all ${
                      currentImageIndex === index ? 'ring-2 ring-teal-500 scale-105' : 'hover:scale-105'
                    }`}
                  >
                    <img src={image} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-teal-400 to-cyan-400 text-white px-4 py-2 rounded-lg font-semibold">
                    {property.status === 'for_sale' ? 'Venda' : property.status === 'for_rent' ? 'Aluguel' : 'Venda e Aluguel'}
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    {property.price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-100">
                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-400 hover:text-white transition-colors group">
                  <i className="fas fa-ruler-combined text-teal-500 text-2xl mb-3 group-hover:text-white"></i>
                  <p className="text-gray-600 text-sm group-hover:text-white/90">Área Total</p>
                  <p className="text-xl font-semibold mt-1">{property.total_area || 0}m²</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-400 hover:text-white transition-colors group">
                  <i className="fas fa-bed text-teal-500 text-2xl mb-3 group-hover:text-white"></i>
                  <p className="text-gray-600 text-sm group-hover:text-white/90">Quartos</p>
                  <p className="text-xl font-semibold mt-1">{property.bedrooms || 0}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-400 hover:text-white transition-colors group">
                  <i className="fas fa-bath text-teal-500 text-2xl mb-3 group-hover:text-white"></i>
                  <p className="text-gray-600 text-sm group-hover:text-white/90">Banheiros</p>
                  <p className="text-xl font-semibold mt-1">{property.bathrooms || 0}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-teal-400 hover:to-cyan-400 hover:text-white transition-colors group">
                  <i className="fas fa-car text-teal-500 text-2xl mb-3 group-hover:text-white"></i>
                  <p className="text-gray-600 text-sm group-hover:text-white/90">Vagas</p>
                  <p className="text-xl font-semibold mt-1">{property.parking_spots || 0}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>

              {/* Características específicas */}
              {property.features && property.features.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Características</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.features.map((feature: any) => (
                      <div key={feature.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-check-circle text-teal-500"></i>
                        <div>
                          <span className="font-medium">{feature.name}: </span>
                          <span className="text-gray-600">{feature.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comodidades */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Comodidades</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map((amenity: any) => (
                      <div key={amenity.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <i className="fas fa-check-circle text-teal-500"></i>
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mapa */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold mb-6">Localização</h2>
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <iframe
                  title="Localização do Imóvel"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapUrl}
                ></iframe>
              </div>
              {property.address && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-600">
                    <i className="fas fa-map-marker-alt text-teal-500"></i>
                    <p>
                      {[
                        property.address.street,
                        property.address.number,
                        property.address.complement,
                        property.address.neighborhood,
                        property.address.city,
                        property.address.state,
                        property.address.zipCode
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botão de Contato */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-semibold mb-6 text-center">Interessado?</h2>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Olá! Gostaria de mais informações sobre o imóvel: ${property.title}%0A%0ADetalhes do imóvel:%0A- Preço: ${property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}%0A- Área: ${property.total_area || 0}m²%0A- Quartos: ${property.bedrooms || 0}%0A- Banheiros: ${property.bathrooms || 0}%0A- Vagas: ${property.parking_spots || 0}%0A- Endereço: ${[property.address_street, property.address_number, property.address_neighborhood, property.address_city, property.address_state].filter(Boolean).join(', ')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] font-semibold text-lg"
                onClick={() => id && trackInteraction('whatsapp', id)}
              >
                <i className="fab fa-whatsapp text-2xl"></i>
                Saiba Mais pelo WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;