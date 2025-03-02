import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardStats {
  totalProperties: number;
  featuredProperties: number;
  totalViews: number;
  totalLeads: number;
  totalWhatsapp: number;
  totalPhone: number;
  totalEmail: number;
  conversionRate: number;
  activeProperties: number;
}

interface HourlyInteraction {
  hour: string;
  views: number;
  whatsapp: number;
  phone: number;
  email: number;
}

interface PropertyTypeStats {
  type: string;
  count: number;
  originalType: string;
}

const RADIAN = Math.PI / 180;
const COLORS = {
  house: '#0088FE',      // Azul
  apartment: '#00C49F',  // Verde
  land: '#FFBB28',       // Amarelo
  commercial: '#FF8042', // Laranja
  country: '#8884D8',    // Roxo
  condo: '#FF6B6B',      // Vermelho
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="12"
      fontWeight="bold"
    >
      {`${payload.type} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

const renderLegendContent = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">
            {entry.value}: {entry.payload.count}
          </span>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    featuredProperties: 0,
    totalViews: 0,
    totalLeads: 0,
    totalWhatsapp: 0,
    totalPhone: 0,
    totalEmail: 0,
    conversionRate: 0,
    activeProperties: 0,
  });

  const [hourlyInteractions, setHourlyInteractions] = useState<HourlyInteraction[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyTypeStats[]>([]);
  const [propertyTypeCounts, setPropertyTypeCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{data.type}</p>
          <div className="space-y-1 mt-2">
            <p className="text-gray-600">
              Quantidade: <span className="font-medium">{data.count}</span>
            </p>
            <p className="text-gray-600">
              Porcentagem: <span className="font-medium">{((data.count / stats.totalProperties) * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar total de imóveis
        const { count: totalProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact' });

        // Buscar imóveis em destaque
        const { count: featuredProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact' })
          .eq('featured', true);

        // Buscar interações das últimas 24 horas
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);

        const { data: interactions } = await supabase
          .from('interactions')
          .select('*')
          .gte('created_at', oneDayAgo.toISOString())
          .order('created_at', { ascending: true });

        // Processar interações por hora
        const hourlyData: Record<string, HourlyInteraction> = {};
        
        // Inicializar todas as horas com 0
        for (let i = 0; i < 24; i++) {
          const hour = i.toString().padStart(2, '0');
          hourlyData[hour] = {
            hour: `${hour}:00`,
            views: 0,
            whatsapp: 0,
            phone: 0,
            email: 0,
          };
        }

        // Contar interações por hora
        interactions?.forEach((interaction) => {
          const date = new Date(interaction.created_at);
          const hour = date.getHours().toString().padStart(2, '0');
          
          if (hourlyData[hour]) {
            switch (interaction.type) {
              case 'view':
                hourlyData[hour].views += 1;
                break;
              case 'whatsapp':
                hourlyData[hour].whatsapp += 1;
                break;
              case 'phone':
                hourlyData[hour].phone += 1;
                break;
              case 'email':
                hourlyData[hour].email += 1;
                break;
            }
          }
        });

        // Converter para array e ordenar por hora
        const hourlyArray = Object.values(hourlyData);

        // Calcular totais
        const totalViews = interactions?.filter((i) => i.type === 'view').length || 0;
        const totalWhatsapp = interactions?.filter((i) => i.type === 'whatsapp').length || 0;
        const totalPhone = interactions?.filter((i) => i.type === 'phone').length || 0;
        const totalEmail = interactions?.filter((i) => i.type === 'email').length || 0;
        const totalLeads = totalWhatsapp + totalPhone + totalEmail;

        // Calcular taxa de conversão
        const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : '0.0';

        // Buscar tipos de imóveis
        const { data: properties } = await supabase
          .from('properties')
          .select('property_type');

        // Inicializar contagem para todos os tipos possíveis
        const propertyTypeCounts: Record<string, number> = {
          house: 0,
          apartment: 0,
          land: 0,
          commercial: 0,
          country: 0,
          condo: 0
        };

        // Contar os imóveis por tipo
        properties?.forEach((property) => {
          if (property.property_type in propertyTypeCounts) {
            propertyTypeCounts[property.property_type]++;
          }
        });

        setPropertyTypeCounts(propertyTypeCounts);

        // Formatar tipos para o gráfico
        const formattedTypes = Object.entries(propertyTypeCounts).map(([type, count]) => ({
          type: formatPropertyType(type),
          count,
          originalType: type // Adicionando o tipo original para referência
        }));

        // Filtrar apenas tipos com contagem > 0
        const nonEmptyTypes = formattedTypes.filter(type => type.count > 0);

        setPropertyTypes(nonEmptyTypes);

        setStats({
          totalProperties: totalProperties || 0,
          featuredProperties: featuredProperties || 0,
          totalViews,
          totalLeads,
          totalWhatsapp,
          totalPhone,
          totalEmail,
          conversionRate: Number(conversionRate),
          activeProperties: totalProperties || 0,
        });

        setHourlyInteractions(hourlyArray);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Atualizar a cada 5 minutos
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatPropertyType = (type: string): string => {
    const types: Record<string, string> = {
      house: 'Casa',
      apartment: 'Apartamento',
      land: 'Terreno',
      commercial: 'Comercial',
      country: 'Campo',
      condo: 'Condomínio'
    };
    return types[type] || type;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <p className="text-gray-600">
                Bem-vindo de volta! Aqui está um resumo das suas métricas.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-tutorial="dashboard-stats">
            {/* Total de Visualizações */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-teal-100 text-teal-600 p-3 rounded-lg">
                  <i className="fas fa-eye text-xl"></i>
                </div>
                <span className="text-sm font-medium text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  Últimos 30 dias
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stats.totalViews}
              </h3>
              <p className="text-gray-600">Total de Visualizações</p>
            </div>

            {/* Total de Leads */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-cyan-100 text-cyan-600 p-3 rounded-lg">
                  <i className="fas fa-user-plus text-xl"></i>
                </div>
                <span className="text-sm font-medium text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-full">
                  Últimos 30 dias
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stats.totalLeads}
              </h3>
              <p className="text-gray-600">Total de Leads</p>
            </div>

            {/* Taxa de Conversão */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-lg">
                  <i className="fas fa-chart-line text-xl"></i>
                </div>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Últimos 30 dias
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stats.conversionRate}%
              </h3>
              <p className="text-gray-600">Taxa de Conversão</p>
            </div>

            {/* Imóveis Ativos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <i className="fas fa-home text-xl"></i>
                </div>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  Total
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {stats.activeProperties}
              </h3>
              <p className="text-gray-600">Imóveis Ativos</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-tutorial="dashboard-charts">
            {/* Interações por Hora */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Interações por Hora
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyInteractions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" name="Visualizações" fill="#0D9488" />
                    <Bar dataKey="whatsapp" name="WhatsApp" fill="#0891B2" />
                    <Bar dataKey="phone" name="Telefone" fill="#FFBB28" />
                    <Bar dataKey="email" name="Email" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribuição por Tipo de Imóvel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Distribuição por Tipo de Imóvel
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Total de {stats.totalProperties} imóveis cadastrados
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {propertyTypes.map((type) => (
                    <div 
                      key={type.type} 
                      className="text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5"
                      style={{ 
                        backgroundColor: `${COLORS[type.originalType as keyof typeof COLORS]}15`,
                        color: COLORS[type.originalType as keyof typeof COLORS]
                      }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[type.originalType as keyof typeof COLORS] }} />
                      {type.count}
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={propertyTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={120}
                      innerRadius={60}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {propertyTypes.map((entry) => (
                        <Cell 
                          key={`cell-${entry.type}`} 
                          fill={COLORS[entry.originalType as keyof typeof COLORS]} 
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderLegendContent} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 