import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

export const useCookieConsent = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    if (storedConsent) {
      setPreferences(JSON.parse(storedConsent));
      setHasConsent(true);
    }
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    setHasConsent(true);
    localStorage.setItem('cookieConsent', JSON.stringify(newPreferences));

    // Aplicar as preferências
    if (newPreferences.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    if (newPreferences.marketing) {
      enableMarketing();
    } else {
      disableMarketing();
    }
  };

  const resetPreferences = () => {
    localStorage.removeItem('cookieConsent');
    setPreferences(defaultPreferences);
    setHasConsent(false);
    disableAllCookies();
  };

  // Funções auxiliares para gerenciar cookies específicos
  const enableAnalytics = () => {
    // Implementar lógica para habilitar cookies analíticos (ex: Google Analytics)
    console.log('Analytics cookies enabled');
  };

  const disableAnalytics = () => {
    // Implementar lógica para desabilitar cookies analíticos
    console.log('Analytics cookies disabled');
  };

  const enableMarketing = () => {
    // Implementar lógica para habilitar cookies de marketing
    console.log('Marketing cookies enabled');
  };

  const disableMarketing = () => {
    // Implementar lógica para desabilitar cookies de marketing
    console.log('Marketing cookies disabled');
  };

  const disableAllCookies = () => {
    disableAnalytics();
    disableMarketing();
    // Manter apenas os cookies necessários
  };

  return {
    preferences,
    hasConsent,
    savePreferences,
    resetPreferences,
  };
};

export default useCookieConsent; 