import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PropertyCategory {
  id: string;
  title: string;
  description: string;
  image: string;
  filter: string;
}

const categories: PropertyCategory[] = [
  {
    id: 'commercial',
    title: 'Imóveis Comerciais e Industriais',
    description: 'Espaços ideais para seu negócio prosperar',
    image: '/images/comercial.png',
    filter: 'type=commercial'
  },
  {
    id: 'country',
    title: 'Imóveis no Campo',
    description: 'Tranquilidade e contato com a natureza',
    image: '/images/campo.png',
    filter: 'type=country'
  },
  {
    id: 'condo',
    title: 'Imóveis em Condomínio',
    description: 'Segurança e comodidade para sua família',
    image: '/images/condo.png',
    filter: 'type=condo'
  },
  {
    id: 'featured',
    title: 'Imóveis em Destaque',
    description: 'As melhores oportunidades do momento',
    image: '/images/destaques.png',
    filter: 'featured=true'
  }
];

const CuratedSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (filter: string) => {
    navigate(`/imoveis?${filter}`);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">Curadoria</span> de Imóveis
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Explore nossa seleção exclusiva de propriedades em diferentes categorias, cuidadosamente escolhidas para você
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => handleCategoryClick(category.filter)}
            >
              <div className="relative h-64 rounded-xl overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-teal-400 text-sm font-medium">
                    <span>Explorar</span>
                    <svg
                      className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CuratedSection;