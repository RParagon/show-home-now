import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  rent_price: string;
  property_type: 'house' | 'apartment' | 'land' | 'commercial';
  status: 'for_sale' | 'for_rent' | 'both';
  bedrooms: string;
  bathrooms: string;
  parking_spots: string;
  total_area: string;
  built_area: string;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  latitude: string;
  longitude: string;
  featured: boolean;
}

interface PropertyImage {
  id?: string;
  url: string;
  position: number;
  file?: File;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface Amenity {
  id?: string;
  name: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

interface Feature {
  id?: string;
  name: string;
  value: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

const initialFormData: PropertyFormData = {
  title: '',
  description: '',
  price: '',
  rent_price: '',
  property_type: 'house',
  status: 'for_sale',
  bedrooms: '',
  bathrooms: '',
  parking_spots: '',
  total_area: '',
  built_area: '',
  address_street: '',
  address_number: '',
  address_complement: '',
  address_neighborhood: '',
  address_city: '',
  address_state: '',
  address_postal_code: '',
  latitude: '',
  longitude: '',
  featured: false,
};

const PropertyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureValue, setNewFeatureValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      fetchPropertyData(id);
    }
  }, [isEditMode, id]);

  // Carrega dados do imóvel (para edição)
  const fetchPropertyData = async (propertyId: string) => {
    try {
      setLoading(true);
      setError(null);

      // 1) Busca imóvel
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (propertyError) throw propertyError;
      if (!propertyData) throw new Error('Imóvel não encontrado');

      // 2) Busca imagens
      const { data: imagesData, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', propertyId)
        .order('position', { ascending: true });
      if (imagesError) throw imagesError;

      // 3) Busca amenidades
      const { data: amenitiesData, error: amenitiesError } = await supabase
        .from('property_amenities')
        .select('*')
        .eq('property_id', propertyId);
      if (amenitiesError) throw amenitiesError;

      // 4) Busca recursos (features)
      const { data: featuresData, error: featuresError } = await supabase
        .from('property_features')
        .select('*')
        .eq('property_id', propertyId);
      if (featuresError) throw featuresError;

      // Monta formData
      setFormData({
        title: propertyData.title || '',
        description: propertyData.description || '',
        price: propertyData.price?.toString() || '',
        rent_price: propertyData.rent_price?.toString() || '',
        property_type: propertyData.property_type || 'house',
        status: propertyData.status || 'for_sale',
        bedrooms: propertyData.bedrooms?.toString() || '',
        bathrooms: propertyData.bathrooms?.toString() || '',
        parking_spots: propertyData.parking_spots?.toString() || '',
        total_area: propertyData.total_area?.toString() || '',
        built_area: propertyData.built_area?.toString() || '',
        address_street: propertyData.address_street || '',
        address_number: propertyData.address_number || '',
        address_complement: propertyData.address_complement || '',
        address_neighborhood: propertyData.address_neighborhood || '',
        address_city: propertyData.address_city || '',
        address_state: propertyData.address_state || '',
        address_postal_code: propertyData.address_postal_code || '',
        latitude: propertyData.latitude?.toString() || '',
        longitude: propertyData.longitude?.toString() || '',
        featured: propertyData.featured || false,
      });

      setImages(imagesData || []);
      setAmenities(amenitiesData || []);
      setFeatures(featuresData || []);
    } catch (err: any) {
      console.error('Error fetching property data:', err);
      setError(err.message || 'Erro ao carregar dados do imóvel');
    } finally {
      setLoading(false);
    }
  };

  // Muda valores do form
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Upload de imagens
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    const newImages: PropertyImage[] = newFiles.map((file, index) => ({
      url: URL.createObjectURL(file),
      position: images.length + index,
      file,
      isNew: true,
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  // Remover imagem (marcar como deletada ou remover do array se não tiver ID)
  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      if (updated[index].id) {
        updated[index] = { ...updated[index], isDeleted: true };
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  // Amenidades
  const handleAddAmenity = () => {
    if (!newAmenity.trim()) return;
    setAmenities(prev => [...prev, { name: newAmenity.trim(), isNew: true }]);
    setNewAmenity('');
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(prev => {
      const updated = [...prev];
      if (updated[index].id) {
        updated[index] = { ...updated[index], isDeleted: true };
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  // Recursos (Features)
  const handleAddFeature = () => {
    if (!newFeatureName.trim()) return;
    setFeatures(prev => [
      ...prev,
      { name: newFeatureName.trim(), value: newFeatureValue.trim(), isNew: true },
    ]);
    setNewFeatureName('');
    setNewFeatureValue('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(prev => {
      const updated = [...prev];
      if (updated[index].id) {
        updated[index] = { ...updated[index], isDeleted: true };
      } else {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  // Submit do form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validação simples
      if (!formData.title || !formData.price || !formData.address_city || !formData.address_state) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      // Monta objeto
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        rent_price: formData.rent_price ? parseFloat(formData.rent_price) : null,
        property_type: formData.property_type,
        status: formData.status,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        parking_spots: formData.parking_spots ? parseInt(formData.parking_spots) : null,
        total_area: formData.total_area ? parseFloat(formData.total_area) : null,
        built_area: formData.built_area ? parseFloat(formData.built_area) : null,
        address_street: formData.address_street || null,
        address_number: formData.address_number || null,
        address_complement: formData.address_complement || null,
        address_neighborhood: formData.address_neighborhood || null,
        address_city: formData.address_city,
        address_state: formData.address_state,
        address_postal_code: formData.address_postal_code || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        featured: formData.featured,
      };

      let propertyId = id;

      // Se for edição
      if (isEditMode && propertyId) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId);

        if (updateError) throw updateError;
      } else {
        // Se for criação
        const { data: newProperty, error: insertError } = await supabase
          .from('properties')
          .insert([propertyData])
          .select();

        if (insertError) throw insertError;
        if (!newProperty || newProperty.length === 0) {
          throw new Error('Erro ao criar imóvel');
        }
        propertyId = newProperty[0].id;
      }

      // Se já existe propertyId, processamos imagens, amenidades, etc.
      if (propertyId) {
        // 1) Imagens removidas
        const imagesToDelete = images.filter(img => img.id && img.isDeleted);
        for (const img of imagesToDelete) {
          await supabase
            .from('property_images')
            .delete()
            .eq('id', img.id);
        }

        // 2) Upload de novas imagens
        const newImages = images.filter(img => img.isNew && !img.isDeleted && img.file);
        for (const img of newImages) {
          const fileExt = img.file!.name.split('.').pop();
          const fileName = `${propertyId}/${Date.now()}.${fileExt}`;

          // Bucket 'property-images' (crie no Supabase se ainda não existir)
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, img.file!);

          if (uploadError) throw uploadError;

          // Pega URL pública
          const { data: publicURL } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          if (!publicURL) throw new Error('Erro ao obter URL da imagem');

          // Cria registro na tabela property_images
          const { error: insertImageError } = await supabase
            .from('property_images')
            .insert({
              property_id: propertyId,
              url: publicURL.publicUrl,
              position: img.position,
            });

          if (insertImageError) throw insertImageError;
        }

        // 3) Amenidades
        const amenitiesToDelete = amenities.filter(a => a.id && a.isDeleted);
        for (const item of amenitiesToDelete) {
          await supabase
            .from('property_amenities')
            .delete()
            .eq('id', item.id);
        }

        const newAmenities = amenities.filter(a => a.isNew && !a.isDeleted);
        if (newAmenities.length > 0) {
          const { error: insertAmenitiesError } = await supabase
            .from('property_amenities')
            .insert(newAmenities.map(item => ({
              property_id: propertyId,
              name: item.name,
            })));

          if (insertAmenitiesError) throw insertAmenitiesError;
        }

        // 4) Recursos (Features)
        const featuresToDelete = features.filter(f => f.id && f.isDeleted);
        for (const item of featuresToDelete) {
          await supabase
            .from('property_features')
            .delete()
            .eq('id', item.id);
        }

        const newFeatures = features.filter(f => f.isNew && !f.isDeleted);
        if (newFeatures.length > 0) {
          const { error: insertFeaturesError } = await supabase
            .from('property_features')
            .insert(newFeatures.map(item => ({
              property_id: propertyId,
              name: item.name,
              value: item.value,
            })));

          if (insertFeaturesError) throw insertFeaturesError;
        }
      }

      setSuccess(isEditMode ? 'Imóvel atualizado com sucesso!' : 'Imóvel criado com sucesso!');
      // Após 2s, volta para listagem de imóveis no Admin
      setTimeout(() => {
        navigate('/admin/properties');
      }, 2000);
    } catch (err: any) {
      console.error('Error saving property:', err);
      // Para ver o erro completo:
      // console.error(JSON.stringify(err, null, 2));
      setError(err?.message || 'Erro ao salvar imóvel');
    } finally {
      setSaving(false);
    }
  };

  // Reordena imagens (drag and drop)
  const reorderImages = (startIndex: number, endIndex: number) => {
    const result = Array.from(images);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const updatedImages = result.map((img, index) => ({
      ...img,
      position: index,
    }));

    setImages(updatedImages);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditMode ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}
            </h1>
            <button
              onClick={() => navigate('/admin/properties')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Básicas</h2>
              </div>

              {/* Título */}
              <div className="col-span-2">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Descrição */}
              <div className="col-span-2">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Tipo de imóvel */}
              <div>
                <label htmlFor="property_type" className="block text-gray-700 font-medium mb-2">
                  Tipo de Imóvel <span className="text-red-500">*</span>
                </label>
                <select
                  id="property_type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                >
                  <option value="house">Casa</option>
                  <option value="apartment">Apartamento</option>
                  <option value="land">Terreno</option>
                  <option value="commercial">Comercial</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                >
                  <option value="for_sale">Para Venda</option>
                  <option value="for_rent">Para Aluguel</option>
                  <option value="both">Venda e Aluguel</option>
                </select>
              </div>

              {/* Preço de venda */}
              <div>
                <label htmlFor="price" className="block text-gray-700 font-medium mb-2">
                  Preço de Venda <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Preço de aluguel */}
              <div>
                <label htmlFor="rent_price" className="block text-gray-700 font-medium mb-2">
                  Preço de Aluguel
                </label>
                <input
                  type="number"
                  id="rent_price"
                  name="rent_price"
                  value={formData.rent_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Destaque */}
              <div className="col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-5 w-5 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-gray-700 font-medium">
                    Destacar este imóvel na página inicial
                  </label>
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Características</h2>
              </div>

              {/* Quartos */}
              <div>
                <label htmlFor="bedrooms" className="block text-gray-700 font-medium mb-2">
                  Quartos
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Banheiros */}
              <div>
                <label htmlFor="bathrooms" className="block text-gray-700 font-medium mb-2">
                  Banheiros
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Vagas de garagem */}
              <div>
                <label htmlFor="parking_spots" className="block text-gray-700 font-medium mb-2">
                  Vagas de Garagem
                </label>
                <input
                  type="number"
                  id="parking_spots"
                  name="parking_spots"
                  value={formData.parking_spots}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Área total */}
              <div>
                <label htmlFor="total_area" className="block text-gray-700 font-medium mb-2">
                  Área Total (m²)
                </label>
                <input
                  type="number"
                  id="total_area"
                  name="total_area"
                  value={formData.total_area}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              {/* Área construída */}
              <div>
                <label htmlFor="built_area" className="block text-gray-700 font-medium mb-2">
                  Área Construída (m²)
                </label>
                <input
                  type="number"
                  id="built_area"
                  name="built_area"
                  value={formData.built_area}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Endereço</h2>
              </div>

              <div>
                <label htmlFor="address_street" className="block text-gray-700 font-medium mb-2">
                  Rua
                </label>
                <input
                  type="text"
                  id="address_street"
                  name="address_street"
                  value={formData.address_street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="address_number" className="block text-gray-700 font-medium mb-2">
                  Número
                </label>
                <input
                  type="text"
                  id="address_number"
                  name="address_number"
                  value={formData.address_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="address_complement" className="block text-gray-700 font-medium mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  id="address_complement"
                  name="address_complement"
                  value={formData.address_complement}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="address_neighborhood" className="block text-gray-700 font-medium mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  id="address_neighborhood"
                  name="address_neighborhood"
                  value={formData.address_neighborhood}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="address_city" className="block text-gray-700 font-medium mb-2">
                  Cidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address_city"
                  name="address_city"
                  value={formData.address_city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="address_state" className="block text-gray-700 font-medium mb-2">
                  Estado <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address_state"
                  name="address_state"
                  value={formData.address_state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="address_postal_code" className="block text-gray-700 font-medium mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  id="address_postal_code"
                  name="address_postal_code"
                  value={formData.address_postal_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Imagens */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Imagens</h2>
              <input type="file" multiple onChange={handleImageUpload} className="mb-4" />
              <div className="grid grid-cols-3 gap-4">
                {images
                  .filter(img => !img.isDeleted)
                  .map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img.url}
                        alt={`Imagem ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Amenidades */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenidades</h2>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Adicionar amenidade"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="ml-2 bg-teal-500 text-white px-4 py-2 rounded-lg"
                >
                  Adicionar
                </button>
              </div>
              <ul>
                {amenities
                  .filter(item => !item.isDeleted)
                  .map((item, index) => (
                    <li key={index} className="flex justify-between items-center mb-2">
                      <span>{item.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(index)}
                        className="text-red-500"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Recursos (Features) */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Características Específicas</h2>
              <div className="flex mb-4 space-x-2">
                <input
                  type="text"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  placeholder="Nome da característica"
                  className="w-1/2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={newFeatureValue}
                  onChange={(e) => setNewFeatureValue(e.target.value)}
                  placeholder="Valor"
                  className="w-1/2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:border-teal-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg"
                >
                  Adicionar
                </button>
              </div>
              <ul>
                {features
                  .filter(item => !item.isDeleted)
                  .map((item, index) => (
                    <li key={index} className="flex justify-between items-center mb-2">
                      <span>
                        {item.name}: {item.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Botão de Submit */}
            <div>
              <button
                type="submit"
                disabled={saving}
                className="bg-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                {saving ? 'Salvando...' : 'Salvar Imóvel'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyForm;
