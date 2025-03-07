import { Link } from 'react-router-dom';
import { Property } from '../lib/supabase';
import { useFavorites } from '../hooks/useFavorites';
import { motion } from 'framer-motion';
import useInteractions from '../hooks/useInteractions';

interface PropertyCardProps {
  property: Property;
}

const propertyTypeLabels: Record<string, string> = {
  'house': 'Casa',
  'apartment': 'Apartamento',
  'land': 'Terreno',
  'commercial': 'Comercial',
  'country': 'Campo',
  'condo': 'Condomínio'
};

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { trackInteraction } = useInteractions();
  const isFavorited = isFavorite(property.id);

  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        to={`/imoveis/${propertyTypeLabels[property.property_type].toLowerCase()}/${property.address_city.toLowerCase().replace(/\s+/g, '-')}/${property.id}`} 
        className="block"
        onClick={() => trackInteraction('view', property.id)}
      >
        <div className="relative">
          <img
            src={property.images && property.images.length > 0 ? property.images[0] : '/images/property-placeholder.jpg'}
            alt={property.title}
            className="w-full h-[220px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl font-bold text-white drop-shadow-lg leading-tight">{property.title}</h3>
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-teal-500/90 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm shadow-md">
            #{property.id.slice(-4)}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-medium px-2 py-1 rounded">{propertyTypeLabels[property.property_type]}</span>
            {property.featured && (
              <span className="bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded">Destaque</span>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
            <div className="flex flex-col items-center justify-center p-2 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
              <span className="font-medium">{property.total_area || 0}</span>
              <span className="text-gray-500 text-xs">m²</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
              <span className="font-medium">{property.bedrooms || 0}</span>
              <span className="text-gray-500 text-xs">quartos</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
              <span className="font-medium">{property.parking_spots || 0}</span>
              <span className="text-gray-500 text-xs">vagas</span>
            </div>
          </div>
          
          {/* Enhanced location display */}
          <div className="flex items-center text-gray-600 text-sm mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
            <svg className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium truncate">{property.address_neighborhood && `${property.address_neighborhood}, `}{property.address_city}, {property.address_state}</span>
          </div>
          
          {/* Divider line */}
          <hr className="border-gray-200 mb-4" />
          
          <div className="flex items-center justify-between">
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(property.id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors"
              whileTap={{ scale: 1.5 }}
              animate={isFavorited ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <i className={`fas fa-heart text-xl ${isFavorited ? 'text-red-500' : ''}`}></i>
            </motion.button>
            <p className="text-teal-600 text-xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              {property.price?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0
              })}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};