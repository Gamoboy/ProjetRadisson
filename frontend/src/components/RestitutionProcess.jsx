import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Package, 
  CheckCircle, 
  XCircle, 
  FileText,
  Calendar,
  AlertCircle,
  Download,
  Printer
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import SignatureCanvas from './SignatureCanvas';

const RestitutionProcess = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [restitutionDate, setRestitutionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [employeeSignature, setEmployeeSignature] = useState('');
  const [managerSignature, setManagerSignature] = useState('');
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
    setEmployeeSignature('');
    setManagerSignature('');
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
    if (!selectedEmployee || selectedMaterials.length === 0) {
      alert('Veuillez sélectionner un employé et au moins un matériel');
      return;
    }

    if (!employeeSignature || !managerSignature) {
      alert('Les deux signatures sont requises pour valider la restitution');
      return;
    }

    const restitutionData = {
      employeeId: selectedEmployee.id,
      employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
      materials: selectedMaterials,
      restitutionDate,
      notes,
      employeeSignature,
      managerSignature,
      status: 'completed'
    };

    // Ici vous pouvez sauvegarder la restitution
    console.log('Restitution data:', restitutionData);
    
    // Générer le PDF ou sauvegarder
    alert('Restitution enregistrée avec succès !');
    
    // Réinitialiser
    setSelectedEmployee(null);
    setSelectedMaterials([]);
    setEmployeeSignature('');
    setManagerSignature('');
    setNotes('');
  };

  const generatePDF = () => {
    // Simulation de génération de PDF
    alert('Génération du PDF en cours... (Fonctionnalité à implémenter)');
  };

  const printDocument = () => {
    window.print();
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
          Processus de restitution
        </h1>
        <p className="text-slate-600">
          Gestion des retours de matériel avec signature
        </p>
      </div>

      {!selectedEmployee ? (
        /* Step 1: Employee Selection */
        <div className="card-modern p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            Sélection de l'employé
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rechercher un employé
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Nom, prénom ou ID employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-10"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                onClick={() => handleEmployeeSelect(employee)}
                className="p-4 border border-slate-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {employee.department} • {employee.materials?.length || 0} matériel(s)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {employee.employeeId}
                    </p>
                    <p className="text-xs text-slate-500">
                      {employee.position}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchTerm ? 'Aucun employé trouvé' : 'Aucun employé avec du matériel'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Step 2: Restitution Form */
        <div className="space-y-6">
          {/* Employee Info */}
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Employé sélectionné
              </h2>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Changer d'employé
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <p className="text-slate-600">
                  {selectedEmployee.department} • {selectedEmployee.position}
                </p>
                <p className="text-sm text-slate-500">
                  ID: {selectedEmployee.employeeId}
                </p>
              </div>
            </div>
          </div>

          {/* Material Selection */}
          <div className="card-modern p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary-600" />
              Sélection du matériel à restituer
            </h2>
            
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedMaterials.includes(material.materialId)
                          ? 'bg-primary-600 border-primary-600'
                          : 'border-slate-300'
                      }`}>
                        {selectedMaterials.includes(material.materialId) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {material.type} - {material.brand} {material.model}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Série: {material.serialNumber} • État: {material.condition}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        {material.materialId}
                      </p>
                      <p className="text-xs text-slate-500">
                        Attribué le: {new Date(material.assignedDate).toLocaleDateString('fr-FR')}
                      </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Notes et observations
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="input-modern"
                    placeholder="État du matériel, remarques, etc."
                  />
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="space-y-6">
              <div className="card-modern p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Signature de l'employé
                </h3>
                <SignatureCanvas
                  onSignatureChange={setEmployeeSignature}
                  value={employeeSignature}
                  width={400}
                  height={150}
                />
              </div>
              
              <div className="card-modern p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Signature du responsable
                </h3>
                <SignatureCanvas
                  onSignatureChange={setManagerSignature}
                  value={managerSignature}
                  width={400}
                  height={150}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-modern p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generatePDF}
                  className="btn-secondary flex items-center gap-2"
                  disabled={selectedMaterials.length === 0}
                >
                  <Download className="w-4 h-4" />
                  Générer PDF
                </button>
                <button
                  onClick={printDocument}
                  className="btn-secondary flex items-center gap-2"
                  disabled={selectedMaterials.length === 0}
                >
                  <Printer className="w-4 h-4" />
                  Imprimer
                </button>
              </div>
              
              <button
                onClick={handleSubmitRestitution}
                disabled={
                  selectedMaterials.length === 0 ||
                  !employeeSignature ||
                  !managerSignature
                }
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Valider la restitution
              </button>
            </div>
            
            {(!employeeSignature || !managerSignature) && (
              <p className="text-sm text-amber-600 mt-2 text-center md:text-right">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Les deux signatures sont requises pour valider
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestitutionProcess;