import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
  isLight?: boolean;
  to?: string;
  isInsideLink?: boolean;
}

const Logo = ({ className = '', showText = true, isLight = false, to = '/', isInsideLink = false }: LogoProps) => {
  const Component = isInsideLink ? 'div' : Link;
  
  return (
    <Component to={isInsideLink ? undefined : to} className={`flex items-center gap-2 ${className}`}>
      <motion.img
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="/images/logo.png"
        alt="Show Home Now"
        className="h-10 w-auto"
      />
      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-xl font-bold ${
            isLight 
              ? 'text-white' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400'
          }`}
        >
          Show Home Now
        </motion.span>
      )}
    </Component>
  );
};

export default Logo; 