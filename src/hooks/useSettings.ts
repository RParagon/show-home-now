import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Settings {
  whatsapp_number: string;
  email_contact: string;
  phone_contact: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  linkedin_url: string;
  company_name: string;
  company_address: string;
  company_creci: string;
  company_postal_code: string;
  company_city: string;
  updated_at: string;
}

const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 'general')
          .single();

        if (error) throw error;
        setSettings(data);
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
        setError('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const formatWhatsAppLink = (message?: string) => {
    if (!settings?.whatsapp_number) return '';
    const baseUrl = 'https://wa.me/';
    const formattedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
    return `${baseUrl}${settings.whatsapp_number}${formattedMessage}`;
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    return `(${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  };

  return {
    settings,
    loading,
    error,
    formatWhatsAppLink,
    formatPhoneNumber
  };
};

export default useSettings; 