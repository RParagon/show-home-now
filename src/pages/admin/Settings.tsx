import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

interface Settings {
  whatsapp_number: string;
  updated_at: string;
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
}

const Settings = () => {
  const [settings, setSettings] = useState<Settings>({
    whatsapp_number: '',
    email_contact: '',
    phone_contact: '',
    instagram_url: '',
    facebook_url: '',
    youtube_url: '',
    linkedin_url: '',
    company_name: '',
    company_address: '',
    company_creci: '',
    company_postal_code: '',
    company_city: '',
    updated_at: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'company'>('contact');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'general')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'general',
          ...settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setSettings(prev => ({ ...prev, whatsapp_number: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setSettings(prev => ({ ...prev, phone_contact: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-6"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">Configurações</h1>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'contact'
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-address-book mr-2"></i>
              Contato
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'company'
                  ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-building mr-2"></i>
              Empresa
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {activeTab === 'contact' ? (
                  <>
                    {/* WhatsApp */}
                    <div>
                      <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 mb-2">
                        Número do WhatsApp
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fab fa-whatsapp text-green-500"></i>
                        </div>
                        <input
                          type="text"
                          name="whatsapp_number"
                          id="whatsapp_number"
                          value={settings.whatsapp_number}
                          onChange={handleWhatsAppChange}
                          placeholder="5511999999999"
                          className="block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">BR (+55)</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Digite o número completo com código do país (55 para Brasil) e DDD, sem espaços ou caracteres especiais.
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email_contact" className="block text-sm font-medium text-gray-700 mb-2">
                        Email de Contato
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-envelope text-gray-400"></i>
                        </div>
                        <input
                          type="email"
                          name="email_contact"
                          id="email_contact"
                          value={settings.email_contact}
                          onChange={handleInputChange}
                          placeholder="contato@empresa.com"
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Telefone */}
                    <div>
                      <label htmlFor="phone_contact" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone de Contato
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-phone text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          name="phone_contact"
                          id="phone_contact"
                          value={settings.phone_contact}
                          onChange={handlePhoneChange}
                          placeholder="5511999999999"
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Redes Sociais */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-instagram text-pink-500"></i>
                          </div>
                          <input
                            type="text"
                            name="instagram_url"
                            id="instagram_url"
                            value={settings.instagram_url}
                            onChange={handleInputChange}
                            placeholder="https://instagram.com/sua_empresa"
                            className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-facebook text-blue-600"></i>
                          </div>
                          <input
                            type="text"
                            name="facebook_url"
                            id="facebook_url"
                            value={settings.facebook_url}
                            onChange={handleInputChange}
                            placeholder="https://facebook.com/sua_empresa"
                            className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-2">
                          YouTube
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-youtube text-red-600"></i>
                          </div>
                          <input
                            type="text"
                            name="youtube_url"
                            id="youtube_url"
                            value={settings.youtube_url}
                            onChange={handleInputChange}
                            placeholder="https://youtube.com/@sua_empresa"
                            className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-linkedin text-blue-700"></i>
                          </div>
                          <input
                            type="text"
                            name="linkedin_url"
                            id="linkedin_url"
                            value={settings.linkedin_url}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/company/sua_empresa"
                            className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Nome da Empresa */}
                    <div>
                      <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Empresa
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-building text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          name="company_name"
                          id="company_name"
                          value={settings.company_name}
                          onChange={handleInputChange}
                          placeholder="Nome da sua empresa"
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Endereço da Empresa */}
                    <div>
                      <label htmlFor="company_address" className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço da Empresa
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-map-marker-alt text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          name="company_address"
                          id="company_address"
                          value={settings.company_address}
                          onChange={handleInputChange}
                          placeholder="Endereço completo da empresa"
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Cidade */}
                    <div>
                      <label htmlFor="company_city" className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-city text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          name="company_city"
                          id="company_city"
                          value={settings.company_city}
                          onChange={handleInputChange}
                          placeholder="Cidade/Estado"
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* CEP */}
                    <div>
                      <label htmlFor="company_postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                        CEP
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-map-pin text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          name="company_postal_code"
                          id="company_postal_code"
                          value={settings.company_postal_code}
                          onChange={handleInputChange}
                          placeholder="00000-000"
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* CRECI */}
                    <div>
                      <label htmlFor="company_creci" className="block text-sm font-medium text-gray-700 mb-2">
                        CRECI
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-id-badge text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          name="company_creci"
                          id="company_creci"
                          value={settings.company_creci}
                          onChange={handleInputChange}
                          placeholder="Número do CRECI"
                          className="block w-full pl-10 py-2 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`
                      inline-flex justify-center items-center px-6 py-2 rounded-lg shadow-lg text-base font-medium text-white
                      ${saving
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 hover:shadow-teal-500/20'
                      }
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                      transition-all duration-200
                    `}
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Salvar Configurações
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              <i className="fas fa-info-circle mr-2 text-teal-500"></i>
              Instruções
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">
                Configure as informações de contato e da empresa que serão exibidas em todo o site.
                Certifique-se de:
              </p>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-teal-500 mt-1 mr-2"></i>
                  <span>Incluir números de telefone com código do país (55 para Brasil) e DDD, sem espaços ou caracteres especiais</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-teal-500 mt-1 mr-2"></i>
                  <span>Verificar se os links das redes sociais estão corretos e ativos</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-teal-500 mt-1 mr-2"></i>
                  <span>Manter o endereço da empresa atualizado para facilitar a localização pelos clientes</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-teal-500 mt-1 mr-2"></i>
                  <span>Usar um email de contato profissional e que seja verificado regularmente</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <i className="fas fa-lightbulb text-blue-500 mt-1 mr-2"></i>
                  <p className="text-blue-700 text-sm">
                    Dica: Mantenha todas as informações atualizadas para garantir uma comunicação eficiente com seus clientes.
                    Números de telefone inativos ou links quebrados podem prejudicar a experiência do usuário.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Seção de Tutorial */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tutorial</h3>
            <p className="text-gray-600 mb-4">
              Reinicie o tutorial interativo para rever as funcionalidades do painel administrativo.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('hasSeenAdminTutorial');
                window.location.href = '/admin';
              }}
              className="bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-teal-500/20"
            >
              <i className="fas fa-play-circle mr-2"></i>
              Iniciar Tutorial
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
