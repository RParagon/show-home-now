import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UAParser } from 'ua-parser-js';

export type InteractionType = 'view' | 'whatsapp' | 'phone' | 'email';
export type InteractionSource = 'navbar' | 'footer' | 'floating' | 'property_details' | 'property_card';

const useInteractions = () => {
  const trackInteraction = useCallback(async (type: InteractionType, source: InteractionSource) => {
    try {
      const parser = new UAParser();
      const result = parser.getResult();

      const interaction = {
        type,
        source,
        device_type: result.device.type || 'desktop',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('interactions').insert([interaction]);
      
      if (error) {
        console.error('Erro ao registrar interação:', error);
        return;
      }

      console.log(`[Interação registrada] Tipo: ${type}, Fonte: ${source}`);
    } catch (error) {
      console.error('Erro ao registrar interação:', error);
    }
  }, []);

  return { trackInteraction };
};

export default useInteractions; 