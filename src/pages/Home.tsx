import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import FeaturedProperties from '../components/FeaturedProperties';
import CuratedSection from '../components/CuratedSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <CuratedSection />
      <FeaturedProperties />
    </div>
  );
};

export default Home;