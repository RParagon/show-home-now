import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 pt-20 pb-24"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>

          <div className="space-y-8">
            {/* Introdução */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="text-gray-600 leading-relaxed">
                A Show Home Now está comprometida em proteger sua privacidade. Esta Política de Privacidade 
                explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando 
                você utiliza nosso site e serviços.
              </p>
            </section>

            {/* Coleta de Dados */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Coleta de Dados</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Coletamos informações que você nos fornece diretamente e informações geradas automaticamente 
                durante sua interação com nosso site.
              </p>
              <h3 className="text-xl font-medium mb-2">2.1. Informações fornecidas por você:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Nome e informações de contato</li>
                <li>Preferências de busca de imóveis</li>
                <li>Mensagens enviadas através de nossos formulários</li>
                <li>Informações de perfil</li>
              </ul>
              <h3 className="text-xl font-medium mb-2">2.2. Informações coletadas automaticamente:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Endereço IP e informações do dispositivo</li>
                <li>Dados de navegação e uso do site</li>
                <li>Cookies e tecnologias similares</li>
                <li>Localização geográfica (se autorizado)</li>
              </ul>
            </section>

            {/* Uso de Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Uso de Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Utilizamos diferentes tipos de cookies para melhorar sua experiência em nosso site:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">3.1. Cookies Necessários</h3>
                  <p className="text-gray-600">
                    Essenciais para o funcionamento básico do site. Não podem ser desativados.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">3.2. Cookies Analíticos</h3>
                  <p className="text-gray-600">
                    Nos ajudam a entender como os visitantes interagem com o site através da coleta 
                    e análise de informações de forma anônima.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">3.3. Cookies de Marketing</h3>
                  <p className="text-gray-600">
                    Utilizados para rastrear visitantes em diferentes sites com o objetivo de exibir 
                    anúncios relevantes.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">3.4. Cookies de Personalização</h3>
                  <p className="text-gray-600">
                    Permitem que o site lembre suas escolhas e forneça recursos personalizados.
                  </p>
                </div>
              </div>
            </section>

            {/* Uso das Informações */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Uso das Informações</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Personalizar sua experiência</li>
                <li>Enviar atualizações e comunicações relevantes</li>
                <li>Processar suas solicitações</li>
                <li>Prevenir fraudes e melhorar a segurança</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            {/* Compartilhamento de Dados */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Compartilhamento de Dados</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Podemos compartilhar suas informações com:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Prestadores de serviços que nos auxiliam</li>
                <li>Parceiros de negócios (com seu consentimento)</li>
                <li>Autoridades legais quando exigido por lei</li>
              </ul>
            </section>

            {/* Seus Direitos */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Você tem direito a:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Retirar seu consentimento</li>
                <li>Receber seus dados em formato estruturado</li>
                <li>Opor-se ao processamento de seus dados</li>
              </ul>
            </section>

            {/* Segurança */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Segurança</h2>
              <p className="text-gray-600 leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger 
                suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            {/* Contato */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
              <p className="text-gray-600 leading-relaxed">
                Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer seus direitos, 
                entre em contato conosco através do e-mail: privacy@showhomenow.com.br
              </p>
            </section>

            {/* Atualizações */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Atualizações da Política</h2>
              <p className="text-gray-600 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente 
                estará sempre disponível em nosso site.
              </p>
            </section>

            {/* Gerenciar Preferências */}
            <section className="mt-12 p-6 bg-gray-50 rounded-xl">
              <h2 className="text-2xl font-semibold mb-4">Gerenciar Preferências de Cookies</h2>
              <p className="text-gray-600 mb-4">
                Você pode ajustar suas preferências de cookies a qualquer momento.
              </p>
              <button
                onClick={() => {
                  // Resetar as preferências de cookies
                  localStorage.removeItem('cookieConsent');
                  window.location.reload();
                }}
                className="px-6 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-lg hover:from-teal-500 hover:to-cyan-500 transition-all shadow-lg hover:shadow-teal-500/30"
              >
                Ajustar Preferências de Cookies
              </button>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy; 