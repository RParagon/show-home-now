import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, Property } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import { toast } from 'react-toastify';

interface PropertyImage {
  id: string;
  url: string;
  property_id: string;
}

const AdminProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Property;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterAndSortProperties();
  }, [searchTerm, properties, sortConfig, selectedStatus, selectedType]);

  const filterAndSortProperties = () => {
    let filtered = [...properties];

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address_neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.property_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(property => property.status === selectedStatus);
    }

    // Filtrar por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.property_type === selectedType);
    }

    // Ordenar
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? '';
      const bValue = b[sortConfig.key] ?? '';

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProperties(filtered);
  };

  const debouncedSearch = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            url,
            property_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transformar os dados para manter compatibilidade com a interface Property
      const transformedData = data.map(property => ({
        ...property,
        images: property.property_images?.map((img: PropertyImage) => img.url) || []
      }));
      
      setProperties(transformedData as Property[]);
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Erro ao carregar imóveis');
      toast.error('Erro ao carregar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;
    
    try {
      setLoading(true);
      
      // Delete property images first
      const { error: imagesError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', id);
      
      if (imagesError) throw imagesError;
      
      // Delete amenities
      const { error: amenitiesError } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', id);
      
      if (amenitiesError) throw amenitiesError;
      
      // Delete features
      const { error: featuresError } = await supabase
        .from('property_features')
        .delete()
        .eq('property_id', id);
      
      if (featuresError) throw featuresError;
      
      // Finally delete the property
      const { error: propertyError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (propertyError) throw propertyError;
      
      // Update the UI
      setProperties(properties.filter(property => property.id !== id));
      toast.success('Imóvel excluído com sucesso!');
    } catch (err: any) {
      console.error('Error deleting property:', err);
      toast.error(`Erro ao excluir imóvel: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ featured: !currentFeatured })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the UI
      setProperties(properties.map(property => 
        property.id === id ? { ...property, featured: !currentFeatured } : property
      ));
      
      toast.success(`Imóvel ${!currentFeatured ? 'destacado' : 'removido dos destaques'} com sucesso!`);
    } catch (err: any) {
      console.error('Error updating featured status:', err);
      toast.error(`Erro ao atualizar status de destaque: ${err.message}`);
    }
  };

  const handleSort = (key: keyof Property) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPropertyTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      house: 'Casa',
      apartment: 'Apartamento',
      land: 'Terreno',
      commercial: 'Comercial'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, string> = {
      for_sale: 'Venda',
      for_rent: 'Aluguel',
      both: 'Venda e Aluguel'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      for_sale: 'bg-green-100 text-green-800',
      for_rent: 'bg-blue-100 text-blue-800',
      both: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredProperties.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProperties.map(p => p.id));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedItems.length) return;
    
    if (!confirm(`Tem certeza que deseja excluir ${selectedItems.length} imóvel(is)?`)) return;

    try {
      setLoading(true);

      for (const id of selectedItems) {
        // Delete property images first
        await supabase.from('property_images').delete().eq('property_id', id);
        await supabase.from('property_amenities').delete().eq('property_id', id);
        await supabase.from('property_features').delete().eq('property_id', id);
        await supabase.from('properties').delete().eq('id', id);
      }

      // Update the UI
      setProperties(properties.filter(property => !selectedItems.includes(property.id)));
      setSelectedItems([]);
      toast.success(`${selectedItems.length} imóvel(is) excluído(s) com sucesso!`);
    } catch (err: any) {
      console.error('Error deleting properties:', err);
      toast.error(`Erro ao excluir imóveis: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkToggleFeatured = async (featured: boolean) => {
    if (!selectedItems.length) return;

    try {
      setLoading(true);

      await supabase
        .from('properties')
        .update({ featured })
        .in('id', selectedItems);

      // Update the UI
      setProperties(properties.map(property => 
        selectedItems.includes(property.id) ? { ...property, featured } : property
      ));

      setSelectedItems([]);
      toast.success(`${selectedItems.length} imóvel(is) ${featured ? 'destacado(s)' : 'removido(s) dos destaques'} com sucesso!`);
    } catch (err: any) {
      console.error('Error updating properties:', err);
      toast.error(`Erro ao atualizar imóveis: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header com Ações */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4" data-tutorial="properties-header">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Gerenciar Imóveis</h1>
              <p className="text-gray-600">
                {loading ? 'Carregando...' : `${properties.length} imóveis encontrados`}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate('/admin/properties/new')}
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
                data-tutorial="properties-add"
              >
                <i className="fas fa-plus"></i>
              Adicionar Imóvel
              </button>
              <div className="flex gap-2" data-tutorial="properties-view-mode">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Visualização em Lista"
                >
                  <i className="fas fa-list"></i>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Visualização em Grade"
                >
                  <i className="fas fa-th-large"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Filtros e Ações em Lote */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Busca */}
              <div className="relative flex items-center" data-tutorial="properties-search">
                <div className="absolute left-3 pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Buscar por título, cidade, bairro..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>

              {/* Filtro por Status */}
              <div className="relative flex items-center" data-tutorial="properties-status-filter">
                <div className="absolute left-3 pointer-events-none">
                  <i className="fas fa-tag text-gray-400"></i>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer text-sm"
                >
                  <option value="all">Todos os Status</option>
                  <option value="for_sale">Venda</option>
                  <option value="for_rent">Aluguel</option>
                  <option value="both">Venda e Aluguel</option>
                </select>
                <div className="absolute right-3 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>

              {/* Filtro por Tipo */}
              <div className="relative flex items-center" data-tutorial="properties-type-filter">
                <div className="absolute left-3 pointer-events-none">
                  <i className="fas fa-home text-gray-400"></i>
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer text-sm"
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="house">Casa</option>
                  <option value="apartment">Apartamento</option>
                  <option value="land">Terreno</option>
                  <option value="commercial">Comercial</option>
                </select>
                <div className="absolute right-3 pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>

              {/* Total e Ações em Lote */}
              <div className="flex flex-col gap-2">
                <div className="bg-gray-50 rounded-lg p-4" data-tutorial="properties-total">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm text-gray-600">Total de Imóveis</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{filteredProperties.length}</p>
                    </div>
                    {selectedItems.length > 0 && (
                      <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                        {selectedItems.length} selecionado(s)
                      </div>
                    )}
                  </div>
                </div>
                {selectedItems.length > 0 && (
                  <div className="flex gap-2 justify-center bg-white rounded-lg p-2 border border-gray-200" data-tutorial="properties-bulk-actions">
                    <button
                      onClick={handleBulkDelete}
                      className="flex-1 p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 flex items-center justify-center gap-2"
                      title="Excluir Selecionados"
                    >
                      <i className="fas fa-trash-alt"></i>
                      <span className="text-sm whitespace-nowrap">Excluir</span>
                    </button>
                    <button
                      onClick={() => handleBulkToggleFeatured(true)}
                      className="flex-1 p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all duration-200 flex items-center justify-center gap-2"
                      title="Destacar Selecionados"
                    >
                      <i className="fas fa-star"></i>
                      <span className="text-sm whitespace-nowrap">Destacar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg" role="alert">
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-200"
            >
              {searchTerm || selectedStatus !== 'all' || selectedType !== 'all' ? (
                <>
                  <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                  <p className="text-gray-600 text-lg mb-4">
                    Nenhum imóvel encontrado com os filtros selecionados
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
                      setSelectedType('all');
                    }}
                    className="text-teal-500 hover:text-teal-600 font-medium"
                  >
                    Limpar Filtros
                  </button>
                </>
              ) : (
                <>
                  <i className="fas fa-home text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-600 text-lg mb-4">Nenhum imóvel cadastrado</p>
              <Link 
                to="/admin/properties/new" 
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-teal-500/20"
              >
                    <i className="fas fa-plus-circle mr-2"></i>
                Adicionar Primeiro Imóvel
              </Link>
                </>
              )}
            </motion.div>
          ) : viewMode === 'list' ? (
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50" data-tutorial="properties-table-header">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-teal-500 focus:ring-teal-500 transition-all duration-200 mr-3"
                            checked={selectedItems.length === filteredProperties.length}
                            onChange={handleSelectAll}
                            data-tutorial="properties-checkbox"
                          />
                          <button
                            onClick={() => handleSort('title')}
                            className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-teal-500"
                          >
                            <span>Imóvel</span>
                            <i className={`fas fa-sort text-gray-400 group-hover:text-teal-500 ${
                              sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                            }`}></i>
                          </button>
                        </div>
                      </th>
                      <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('property_type')}
                          className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-teal-500"
                        >
                          <span>Tipo</span>
                          <i className={`fas fa-sort text-gray-400 group-hover:text-teal-500 ${
                            sortConfig.key === 'property_type' ? (sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </button>
                      </th>
                      <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('status')}
                          className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-teal-500"
                        >
                          <span>Status</span>
                          <i className={`fas fa-sort text-gray-400 group-hover:text-teal-500 ${
                            sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </button>
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('price')}
                          className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-teal-500"
                        >
                          <span>Preço</span>
                          <i className={`fas fa-sort text-gray-400 group-hover:text-teal-500 ${
                            sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </button>
                      </th>
                      <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localização
                      </th>
                      <th scope="col" className="hidden lg:table-cell px-6 py-3 text-left">
                        <button
                          onClick={() => handleSort('created_at')}
                          className="group inline-flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-teal-500"
                        >
                          <span>Data</span>
                          <i className={`fas fa-sort text-gray-400 group-hover:text-teal-500 ${
                            sortConfig.key === 'created_at' ? (sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''
                          }`}></i>
                        </button>
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destaque
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredProperties.map((property) => (
                        <motion.tr
                          key={property.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`hover:bg-gray-50 transition-colors duration-200 ${
                            selectedItems.includes(property.id) ? 'bg-teal-50' : ''
                          }`}
                        >
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-teal-500 focus:ring-teal-500 transition-all duration-200 mr-3"
                                checked={selectedItems.includes(property.id)}
                                onChange={() => handleSelectItem(property.id)}
                              />
                              <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg overflow-hidden">
                              {property.images && property.images.length > 0 ? (
                                  <img 
                                    src={property.images[0]} 
                                    alt={property.title} 
                                    className="h-12 w-12 object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://via.placeholder.com/120?text=Sem+Imagem';
                                    }}
                                  />
                                ) : (
                                  <div className="h-12 w-12 flex items-center justify-center text-gray-400">
                                    <i className="fas fa-image text-xl"></i>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors duration-200">
                                  {property.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  <span className="inline-flex items-center">
                                    <i className="fas fa-hashtag mr-1"></i>
                                    {property.id}
                                  </span>
                                </div>
                            </div>
                          </div>
                        </td>
                          <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {getPropertyTypeLabel(property.property_type)}
                          </span>
                        </td>
                          <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                            {getStatusLabel(property.status)}
                          </span>
                        </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {property.price.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </div>
                        </td>
                          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{property.address_city}</div>
                            <div className="text-sm text-gray-500">{property.address_neighborhood}</div>
                        </td>
                          <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(property.created_at)}
                        </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => toggleFeatured(property.id, property.featured)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                property.featured
                                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            data-tutorial="properties-featured"
                          >
                              <i className="fas fa-star"></i>
                          </button>
                        </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3" data-tutorial="properties-actions">
                            <Link 
                                to={`/admin/properties/${property.id}`}
                                className="text-teal-500 hover:text-teal-600 transition-colors duration-200"
                                title="Editar"
                            >
                                <i className="fas fa-edit"></i>
                            </Link>
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                                className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                title="Excluir"
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                              <Link
                                to={`/imoveis/${property.property_type}/${property.address_city.toLowerCase().replace(/ /g, '-')}/${property.id}`}
                                target="_blank"
                                className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                                title="Visualizar"
                              >
                                <i className="fas fa-external-link-alt"></i>
                              </Link>
                          </div>
                        </td>
                        </motion.tr>
                    ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
                      selectedItems.includes(property.id) ? 'ring-2 ring-teal-500' : ''
                    }`}
                  >
                    <div className="relative group">
                      <div className="aspect-w-16 aspect-h-9">
                        {property.images && property.images.length > 0 ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover rounded-t-lg"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/400x225?text=Sem+Imagem';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                            <i className="fas fa-image text-gray-400 text-4xl"></i>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-teal-500 focus:ring-teal-500 transition-all duration-200"
                          checked={selectedItems.includes(property.id)}
                          onChange={() => handleSelectItem(property.id)}
                        />
                        <button 
                          onClick={() => toggleFeatured(property.id, property.featured)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                            property.featured
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-white/80 text-gray-600 hover:bg-white'
                          }`}
                        >
                          <i className="fas fa-star"></i>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getPropertyTypeLabel(property.property_type)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                          {getStatusLabel(property.status)}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-teal-600 mb-2">
                        {property.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {property.address_city}
                        {property.address_neighborhood && `, ${property.address_neighborhood}`}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {formatDate(property.created_at)}
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            to={`/admin/properties/${property.id}`}
                            className="p-2 rounded-lg bg-teal-100 text-teal-600 hover:bg-teal-200 transition-all duration-200"
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                            title="Excluir"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                          <Link
                            to={`/imoveis/${property.property_type}/${property.address_city.toLowerCase().replace(/ /g, '-')}/${property.id}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                            title="Visualizar"
                          >
                            <i className="fas fa-external-link-alt"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProperties;