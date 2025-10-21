import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Package, 
  FileText, 
  CheckCircle, 
  XCircle,
  Calendar,
  Download,
  AlertCircle
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const EmployeeRestitutionPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [restitutionDate, setRestitutionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data.filter(emp => emp.materials && emp.materials.length > 0));
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setSelectedMaterials([]);
    setNotes('');
  };

  const handleMaterialToggle = (materialId) => {
    setSelectedMaterials(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId);
      } else {
        return [...prev, materialId];
      }
    });
  };

  const handleSubmitRestitution = async () => {
    if (selectedMaterials.length === 0) {
      alert('Veuillez sélectionner au moins un matériel');
      return;
    }

    // Simulation de soumission
    alert('Restitution enregistrée avec succès !');
    setSelectedEmployee(null);
    setSelectedMaterials([]);
    setNotes('');
  };

  const generatePDF = () => {
    alert('Génération du PDF... (Fonctionnalité à implémenter)');
  };

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
      <div>
        <h1 className="text-3xl font-bold gradient-text mb-2">
          Restitution employé
        </h1>
        <p className="text-slate-600">
          Interface simplifiée pour les employés
        </p>
      </div>

      {!selectedEmployee ? (
        /* Employee Selection */
        <div className="card-modern p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Sélectionnez votre nom
          </h2>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher votre nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => handleEmployeeSelect(employee)}
                className="p-4 border-2 border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all duration-200"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {employee.department}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {employee.materials?.length || 0} matériel(s)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Restitution Form */
        <div className="space-y-6">
          {/* Employee Info */}
          <div className="card-modern p-6 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Bonjour {selectedEmployee.firstName} {selectedEmployee.lastName}
            </h2>
            <p className="text-slate-600 mb-4">
              Sélectionnez le matériel que vous souhaitez restituer
            </p>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Changer de personne
            </button>
          </div>

          {/* Material Selection */}
          <div className="card-modern p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Votre matériel
            </h3>
            
            <div className="space-y-3">
              {selectedEmployee.materials?.map((material) => (
                <div
                  key={material.materialId}
                  onClick={() => handleMaterialToggle(material.materialId)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedMaterials.includes(material.materialId)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedMaterials.includes(material.materialId)
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-slate-300'
                    }`}>
                      {selectedMaterials.includes(material.materialId) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">
                        {material.type} - {material.brand} {material.model}
                      </h4>
                      <p className="text-sm text-slate-600">
                        Numéro de série: {material.serialNumber}
                      </p>
                      <p className="text-xs text-slate-500">
                        Attribué le: {new Date(material.assignedDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        material.condition === 'Neuf' ? 'bg-green-100 text-green-700' :
                        material.condition === 'Bon' ? 'bg-blue-100 text-blue-700' :
                        material.condition === 'Moyen' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {material.condition}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedMaterials.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Veuillez sélectionner au moins un matériel</p>
              </div>
            )}
          </div>

          {/* Restitution Details */}
          <div className="card-modern p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              Détails de la restitution
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date de restitution
                </label>
                <input
                  type="date"
                  value={restitutionDate}
                  onChange={(e) => setRestitutionDate(e.target.value)}
                  className="input-modern"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Remarques (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="input-modern"
                  placeholder="État du matériel, problèmes rencontrés, etc."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-modern p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <button
                onClick={generatePDF}
                className="btn-secondary flex items-center gap-2"
                disabled={selectedMaterials.length === 0}
              >
                <Download className="w-4 h-4" />
                Télécharger le reçu
              </button>
              
              <button
                onClick={handleSubmitRestitution}
                disabled={selectedMaterials.length === 0}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Confirmer la restitution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRestitutionPage;