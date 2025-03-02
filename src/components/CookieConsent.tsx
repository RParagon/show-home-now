import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../hooks/useCookieConsent';

const CookieConsent = () => {
  const { preferences, hasConsent, savePreferences } = useCookieConsent();
  const [showBanner, setShowBanner] = useState(!hasConsent);

  useEffect(() => {
    setShowBanner(!hasConsent);
  }, [hasConsent]);

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    });
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:flex md:items-center md:justify-between space-y-4 md:space-y-0 backdrop-blur-lg bg-opacity-95 border border-gray-100">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-teal-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <h2 className="text-lg font-semibold text-gray-800">Sua privacidade é importante</h2>
              </div>
              <p className="text-gray-600 text-sm md:text-base">
                Utilizamos cookies para melhorar sua experiência. Para saber mais, acesse nossa{' '}
                <Link to="/privacidade" className="text-teal-600 hover:text-teal-700 underline font-medium">
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:w-auto">
              <button
                onClick={handleAcceptNecessary}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Apenas Necessários
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-teal-500/30"
              >
                Aceitar Todos
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsent; 