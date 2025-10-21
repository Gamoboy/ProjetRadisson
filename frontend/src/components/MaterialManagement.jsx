import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, Edit, Trash2, User, AlertCircle } from 'lucide-react';
import { materialAPI, employeeAPI } from '../services/api';

const MaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    materialId: '',
    type: '',
    brand: '',
    model: '',
    serialNumber: '',
    assignedTo: '',
    condition: 'Neuf',
    purchaseDate: '',
    warrantyEnd: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [materialsData, employeesData] = await Promise.all([
        materialAPI.getAll(),
        employeeAPI.getAll()
      ]);
      setMaterials(materialsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await materialAPI.create(formData);
      setShowForm(false);
      setFormData({
        materialId: `MAT${Date.now().toString().slice(-6)}`,
        type: '',
        brand: '',
        model: '',
        serialNumber: '',
        assignedTo: '',
        condition: 'Neuf',
        purchaseDate: '',
        warrantyEnd: ''
      });
      loadData();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
      try {
        await materialAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const materialTypes = [
    'Ordinateur portable',
    'Ordinateur de bureau',
    'Téléphone',
    'Tablette',
    'Imprimante',
    'Écran',
    'Clavier',
    'Souris',
    'Casque',
    'Webcam',
    'Routeur',
    'Câble réseau',
    'Autre'
  ];

  const conditions = ['Neuf', 'Bon', 'Moyen', 'Mauvais'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Gestion du matériel
          </h1>
          <p className="text-slate-600">
            Suivi et attribution du matériel informatique
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter matériel
        </button>
      </div>

      {/* Search */}
      <div className="card-modern p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher du matériel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-modern pl-10"
          />
        </div>
      </div>

      {/* Material List */}
      <div className="card-modern">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Liste du matériel
            </h2>
            <span className="text-sm text-slate-600">
              {filteredMaterials.length} matériel{filteredMaterials.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Matériel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Marque/Modèle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Numéro de série
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Attribué à
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              État
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-slate-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {material.type}
                        </div>
                        <div className="text-sm text-slate-500">
                          {material.materialId}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {material.brand}
                    </div>
                    <div className="text-sm text-slate-500">
                      {material.model}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {material.serialNumber}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {material.assignedTo ? (
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-900">
                          {employees.find(emp => emp.id === material.assignedTo)?.firstName || ''} 
                          {' '}
                          {employees.find(emp => emp.id === material.assignedTo)?.lastName || ''}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        Non attribué
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      material.condition === 'Neuf' ? 'bg-green-100 text-green-700' :
                      material.condition === 'Bon' ? 'bg-blue-100 text-blue-700' :
                      material.condition === 'Moyen' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {material.condition}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">
              {searchTerm ? 'Aucun matéiel ne correspond à la recherche' : 'Aucun matériel enregistré'}
            </p>
            {!materials.length && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Ajouter le premier matériel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Material Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  Ajouter du matériel
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type de matériel *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                    className="input-modern appearance-none"
                  >
                    <option value="">Sélectionner un type</option>
                    {materialTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Marque *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    required
                    className="input-modern"
                    placeholder="Ex: Dell, HP, Apple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Modèle *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    required
                    className="input-modern"
                    placeholder="Ex: Latitude 5520"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Numéro de série *
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    required
                    className="input-modern"
                    placeholder="Numéro de série unique"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Attribué à
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    className="input-modern appearance-none"
                  >
                    <option value="">Non attribué</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    État
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="input-modern appearance-none"
                  >
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date d'achat
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
                    className="input-modern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fin de garantie
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyEnd}
                    onChange={(e) => setFormData({...formData, warrantyEnd: e.target.value})}
                    className="input-modern"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter le matériel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialManagement;