# Sistema de Gestão de Imóveis - SHN Imóveis

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green)
![Licença](https://img.shields.io/badge/Licença-MIT-blue)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)

Sistema completo para gestão de imóveis, desenvolvido com React, TypeScript, Tailwind CSS e Supabase. Oferece uma interface moderna e intuitiva para gerenciamento de propriedades, com recursos avançados de filtros, buscas e análises.

## 🚀 Funcionalidades

### 📊 Dashboard
- Visão geral das métricas principais
- Gráficos de desempenho e distribuição de imóveis
- Estatísticas de visualizações e leads

### 🏠 Gerenciamento de Imóveis
- Cadastro completo de propriedades
- Sistema de busca avançada
- Filtros por tipo, status e localização
- Ações em lote (exclusão, destaque)
- Visualização em lista e grade
- Upload de múltiplas imagens
- Sistema de destaque de imóveis

### ⚙️ Configurações
- Personalização do perfil
- Configurações de segurança
- Preferências de notificações
- Personalização de aparência
- Integrações com serviços externos
- Exportação de dados

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Router DOM
  - React Query
  - React Hook Form
  - React Toastify
  - React Joyride

- **Backend:**
  - Supabase (Backend as a Service)
  - PostgreSQL
  - Storage para imagens

- **Ferramentas:**
  - Vite
  - ESLint
  - Prettier
  - Git

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/shn-imoveis.git
cd shn-imoveis
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🚀 Deploy

### Deploy no Netlify

1. Conecte seu repositório GitHub ao Netlify
2. Configure as variáveis de ambiente no Netlify:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
3. Configure as opções de build:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Ative a opção de deploy automático

O arquivo `netlify.toml` já está configurado com:
- Redirecionamento para SPA
- Versão do Node.js
- Configurações de build
- Variáveis de ambiente

## 📝 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run preview`: Visualiza a build localmente
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código com Prettier

## 🗄️ Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
├── pages/            # Páginas da aplicação
├── layouts/          # Layouts compartilhados
├── hooks/            # Custom hooks
├── services/         # Serviços e APIs
├── utils/            # Funções utilitárias
├── styles/           # Estilos globais
└── types/            # Definições de tipos
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Rafael Paragon - Desenvolvedor Principal

## 📞 Suporte

Para suporte, abra uma issue no GitHub.
