import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase, Property, PropertyImage } from '../lib/supabase';
import { PropertyCard } from './PropertyCard';

const FeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(*)')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching featured properties:', error);
      } else {
        // Transform the data to include images in the expected format
        const propertiesWithImages = data.map(property => ({
          ...property,
          images: property.property_images?.map((img: PropertyImage) => img.url) || []
        }));
        setFeaturedProperties(propertiesWithImages as Property[]);
      }
      setLoading(false);
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Imóveis</span> em Destaque
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Descubra nossas propriedades mais exclusivas, selecionadas especialmente para você
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum imóvel em destaque disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;