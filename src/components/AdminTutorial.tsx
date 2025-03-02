import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminTutorial = () => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [hasCompletedSection, setHasCompletedSection] = useState<Record<string, boolean>>({});
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Verifica se é a primeira visita ao painel ou se a seção atual já foi vista
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenAdminTutorial');
    const currentSection = location.pathname.split('/')[2] || 'dashboard';
    
    // Se já viu o tutorial completo, não mostra mais
    if (hasSeenTutorial === 'completed') {
      setRun(false);
      setIsReady(true);
      return;
    }

    // Aguarda um momento para garantir que os elementos estejam renderizados
    setTimeout(() => {
      if (!hasSeenTutorial) {
        setRun(true);
      }
      setIsReady(true);
    }, 500);

    // Cleanup function
    return () => {
      setIsReady(false);
    };
  }, [location.pathname]);

  // Atualiza o estado de conclusão da seção atual
  useEffect(() => {
    const currentSection = location.pathname.split('/')[2] || 'dashboard';
    setHasCompletedSection(prev => ({
      ...prev,
      [currentSection]: localStorage.getItem(`hasSeenTutorial_${currentSection}`) === 'true'
    }));
  }, [location.pathname]);

  const dashboardSteps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      content: 'Bem-vindo ao seu Painel Administrativo! Vamos fazer um tour rápido por todas as funcionalidades.',
      disableBeacon: true,
    },
    {
      target: '[data-tutorial="nav-menu"]',
      content: 'Este é o menu principal de navegação, onde você pode acessar todas as seções do painel.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="dashboard-link"]',
      content: 'O Dashboard mostra uma visão geral das suas métricas e estatísticas.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="dashboard-stats"]',
      content: 'Aqui você encontra as principais métricas do seu site: visualizações, leads gerados, taxa de conversão e total de imóveis ativos.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="dashboard-charts"]',
      content: 'Estes gráficos mostram as interações por hora e a distribuição dos seus imóveis por tipo.',
      placement: 'top',
    },
    {
      target: '[data-tutorial="profile-menu"]',
      content: 'Aqui você encontra as opções da sua conta.',
      placement: 'left',
    }
  ];

  const propertiesSteps: Step[] = [
    {
      target: '[data-tutorial="properties-header"]',
      content: 'Bem-vindo ao Gerenciador de Imóveis! Aqui você tem controle total sobre seu catálogo de imóveis, podendo adicionar, editar, excluir e gerenciar todas as propriedades.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tutorial="properties-add"]',
      content: 'Use este botão para adicionar um novo imóvel ao seu catálogo. Você será direcionado para um formulário completo onde poderá cadastrar todas as informações da propriedade.',
      placement: 'left',
    },
    {
      target: '[data-tutorial="properties-view-mode"]',
      content: 'Alterne entre os modos de visualização: Lista (para uma visão detalhada com todas as informações) ou Grade (para uma visualização mais visual focada nas imagens).',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="properties-search"]',
      content: 'Use a barra de pesquisa para encontrar imóveis rapidamente. Você pode buscar por título, cidade, bairro ou qualquer outra informação relevante do imóvel.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="properties-status-filter"]',
      content: 'Filtre os imóveis por status de negócio: Venda, Aluguel ou ambos. Isso ajuda a organizar sua visualização conforme a necessidade.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="properties-type-filter"]',
      content: 'Filtre por tipo de imóvel: Casa, Apartamento, Terreno ou Comercial. Útil para segmentar seu catálogo e encontrar propriedades específicas.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="properties-total"]',
      content: 'Aqui você visualiza o total de imóveis encontrados com os filtros atuais e quantos estão selecionados para ações em lote.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="properties-bulk-actions"]',
      content: 'Quando um ou mais imóveis estiverem selecionados, você pode realizar ações em lote como excluir vários imóveis de uma vez ou destacá-los simultaneamente.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="properties-table-header"]',
      content: 'Clique nos cabeçalhos da tabela para ordenar os imóveis por diferentes critérios como título, preço, data de cadastro, etc.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="properties-checkbox"]',
      content: 'Use as caixas de seleção para selecionar um ou mais imóveis. O checkbox no cabeçalho permite selecionar/desselecionar todos os imóveis da lista.',
      placement: 'right',
    },
    {
      target: '[data-tutorial="properties-featured"]',
      content: 'O ícone de estrela indica se o imóvel está destacado. Imóveis destacados aparecem primeiro nas buscas do site e têm maior visibilidade.',
      placement: 'left',
    },
    {
      target: '[data-tutorial="properties-actions"]',
      content: 'Para cada imóvel, você tem acesso rápido às ações: Editar (para modificar informações), Excluir (para remover) e Visualizar (para ver como está no site).',
      placement: 'left',
    },
    {
      target: 'body',
      placement: 'center',
      content: 'Parabéns! Agora você conhece todas as funcionalidades do gerenciador de imóveis. Use estas ferramentas para manter seu catálogo sempre atualizado e organizado.',
    }
  ];

  const settingsSteps: Step[] = [
    {
      target: '[data-tutorial="settings-header"]',
      content: 'Bem-vindo às Configurações! Aqui você pode personalizar todo o seu painel administrativo e gerenciar suas preferências.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tutorial="settings-profile"]',
      content: 'Na seção de Perfil, você pode atualizar suas informações pessoais, incluindo nome, email, telefone e foto de perfil.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="settings-security"]',
      content: 'Gerencie sua segurança alterando sua senha e configurando autenticação em duas etapas para maior proteção.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="settings-notifications"]',
      content: 'Configure suas preferências de notificações: escolha quais alertas receber por email e no painel sobre leads, visitas e interações.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="settings-appearance"]',
      content: 'Personalize a aparência do seu painel, incluindo tema (claro/escuro), cores principais e layout preferido.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="settings-integrations"]',
      content: 'Gerencie integrações com outras ferramentas e serviços, como Google Analytics, WhatsApp e redes sociais.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="settings-export"]',
      content: 'Configure opções de exportação de dados, incluindo formato preferido (CSV/Excel) e campos a serem incluídos.',
      placement: 'bottom',
    },
    {
      target: '[data-tutorial="settings-tutorial"]',
      content: 'Você pode reiniciar este tutorial a qualquer momento através desta opção. Útil quando houver atualizações ou se quiser relembrar alguma funcionalidade.',
      placement: 'bottom',
    },
    {
      target: 'body',
      placement: 'center',
      content: 'Parabéns! Você completou todo o tutorial do painel administrativo. Agora você conhece todas as funcionalidades disponíveis para gerenciar seu catálogo de imóveis de forma eficiente.',
    }
  ];

  // Seleciona os passos com base na rota atual
  const getSteps = () => {
    let steps: Step[] = [];
    switch (location.pathname) {
      case '/admin':
        steps = dashboardSteps;
        break;
      case '/admin/properties':
        steps = propertiesSteps;
        break;
      case '/admin/settings':
        steps = settingsSteps;
        break;
      default:
        steps = dashboardSteps;
    }
    return steps.filter(validateStep);
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index, action } = data;
    const currentSection = location.pathname.split('/')[2] || 'dashboard';

    // Log para debug
    console.log('Tutorial status:', { status, type, index, action, currentSection });

    // Atualiza o índice do passo atual
    if (type === 'step:after' && action === 'next') {
      setStepIndex(prev => prev + 1);
    }

    // Se voltar um passo
    if (type === 'step:after' && action === 'prev') {
      setStepIndex(prev => Math.max(0, prev - 1));
    }

    // Quando o tutorial é finalizado ou pulado
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      
      // Marca o tutorial como completamente finalizado em qualquer um destes casos:
      // 1. Usuário pulou o tutorial
      // 2. Completou a última seção (settings)
      // 3. Completou a seção atual e é a última etapa
      if (
        status === STATUS.SKIPPED ||
        currentSection === 'settings' ||
        (type === 'step:after' && index === getSteps().length - 1)
      ) {
        localStorage.setItem('hasSeenAdminTutorial', 'completed');
        setHasCompletedSection(prev => ({
          ...prev,
          [currentSection]: true
        }));
        return;
      }

      // Para outras seções, marca como visto e continua para a próxima
      localStorage.setItem('hasSeenAdminTutorial', 'true');
      localStorage.setItem(`hasSeenTutorial_${currentSection}`, 'true');
      setHasCompletedSection(prev => ({
        ...prev,
        [currentSection]: true
      }));

      // Navegação para próxima seção
      const nextSection = getNextSection(currentSection);
      if (nextSection) {
        setTimeout(() => {
          navigate(`/admin${nextSection}`);
          setRun(true);
          setStepIndex(0);
        }, 300);
      }
    }

    // Se houver erro em algum passo, tenta pular para o próximo
    if (type === 'error:target_not_found') {
      console.log('Elemento não encontrado, tentando próximo passo...', { index });
      setStepIndex(prev => prev + 1);
    }
  };

  // Determina a próxima seção do tutorial
  const getNextSection = (currentSection: string): string | null => {
    const sections = ['', '/properties', '/settings'];
    const currentIndex = sections.indexOf(currentSection === 'dashboard' ? '' : `/${currentSection}`);
    
    if (currentIndex < sections.length - 1) {
      return sections[currentIndex + 1];
    }
    
    return null;
  };

  // Reinicia o tutorial completo
  const restartTutorial = () => {
    setStepIndex(0);
    setRun(true);
    localStorage.removeItem('hasSeenAdminTutorial');
    ['dashboard', 'properties', 'settings'].forEach(section => {
      localStorage.removeItem(`hasSeenTutorial_${section}`);
    });
    setHasCompletedSection({});
    navigate('/admin');
  };

  // Reinicia o tutorial da seção atual (agora requer confirmação)
  const restartSectionTutorial = () => {
    if (window.confirm('Tem certeza que deseja reiniciar o tutorial desta seção?')) {
      const currentSection = location.pathname.split('/')[2] || 'dashboard';
      setStepIndex(0);
      setRun(true);
      // Remove apenas o status da seção atual, mantendo o status geral
      localStorage.removeItem(`hasSeenTutorial_${currentSection}`);
      setHasCompletedSection(prev => ({
        ...prev,
        [currentSection]: false
      }));
    }
  };

  // Verifica se o elemento existe antes de incluir no tutorial
  const validateStep = (step: Step): boolean => {
    if (step.target === 'body') return true;
    const element = document.querySelector(step.target as string);
    return !!element;
  };

  return isReady ? (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      stepIndex={stepIndex}
      steps={getSteps()}
      disableOverlayClose
      disableCloseOnEsc
      spotlightClicks
      styles={{
        options: {
          primaryColor: '#0891B2',
          textColor: '#1F2937',
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: 'left',
          maxWidth: '450px',
        },
        buttonNext: {
          backgroundColor: '#0891B2',
        },
        buttonBack: {
          marginRight: 10,
        },
        spotlight: {
          backgroundColor: 'rgba(255, 255, 255, 0.45)',
        },
        tooltip: {
          fontSize: '14px',
          padding: '20px',
        },
        tooltipTitle: {
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '10px',
        }
      }}
      locale={{
        back: 'Anterior',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        skip: 'Pular tutorial',
      }}
    />
  ) : null;
};

export default AdminTutorial; 