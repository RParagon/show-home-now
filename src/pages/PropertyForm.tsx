interface Feature {
  id?: string;
  feature: string;
  value: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

const handleAddFeature = () => {
  if (!newFeatureName.trim()) return;
  setFeatures(prev => [
    ...prev,
    { feature: newFeatureName.trim(), value: newFeatureValue.trim(), isNew: true },
  ]);
  setNewFeatureName('');
  setNewFeatureValue('');
};

const newFeatures = features.filter(f => f.isNew && !f.isDeleted);
if (newFeatures.length > 0) {
  const { error: insertFeaturesError } = await supabase
    .from('property_features')
    .insert(newFeatures.map(item => ({
      property_id: propertyId,
      feature: item.feature,
      value: item.value,
    })));

  if (insertFeaturesError) throw insertFeaturesError;
}

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
            {item.feature}: {item.value}
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