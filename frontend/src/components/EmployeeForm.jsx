import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, X, User, Mail, Phone, MapPin, Calendar, Building2, Briefcase } from 'lucide-react';
import { employeeAPI } from '../services/api';
import SignatureCanvas from './SignatureCanvas';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    startDate: '',
    endDate: '',
    status: 'active',
    address: '',
    employeeId: '',
    signature: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadEmployee();
    } else {
      // Générer un ID employé pour les nouveaux employés
      setFormData(prev => ({
        ...prev,
        employeeId: `EMP${Date.now().toString().slice(-6)}`
      }));
    }
  }, [id, isEdit]);

  const loadEmployee = async () => {
    setLoading(true);
    try {
      const employee = await employeeAPI.getById(id);
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        startDate: employee.startDate || '',
        endDate: employee.endDate || '',
        status: employee.status || 'active',
        address: employee.address || '',
        employeeId: employee.employeeId || '',
        signature: employee.signature || ''
      });
    } catch (error) {
      console.error('Erreur lors du chargement de l\'employé:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignatureChange = (signatureData) => {
    setFormData(prev => ({
      ...prev,
      signature: signatureData
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (isEdit) {
        await employeeAPI.update(id, formData);
      } else {
        await employeeAPI.create(formData);
      }
      
      navigate('/employee-flow');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  const departments = [
    'Réception',
    'IT',
    'Housekeeping',
    'Restauration',
    'Maintenance',
    'Sécurité',
    'Comptabilité',
    'Ressources Humaines',
    'Direction'
  ];

  const positions = [
    'Réceptionniste',
    'Responsable Réception',
    'Technicien IT',
    'Responsable Informatique',
    'Femme de chambre',
    'Chef Housekeeping',
    'Serveur',
    'Chef de cuisine',
    'Technicien Maintenance',
    'Agent de sécurité',
    'Comptable',
    'DRH',
    'Directeur'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {isEdit ? 'Modifier l\'employé' : 'Nouvel employé'}
            </h1>
            <p className="text-slate-600">
              {isEdit 
                ? `Modification de ${formData.firstName} ${formData.lastName}` 
                : 'Création d\'une nouvelle fiche employé avec signature'
              }
            </p>
          </div>
          <button
            onClick={() => navigate('/employee-flow')}
            className="btn-secondary flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="card-modern p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary-600" />
            Informations personnelles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="input-modern"
                placeholder="Entrez le prénom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="input-modern"
                placeholder="Entrez le nom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-modern pl-10"
                  placeholder="email@radisson.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-modern pl-10"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-modern pl-10"
                  placeholder="Adresse postale complète"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div className="card-modern p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-600" />
            Informations professionnelles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ID Employé
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="input-modern bg-slate-50"
                readOnly={!isEdit}
                placeholder="Généré automatiquement"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Département *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="input-modern pl-10 appearance-none"
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Poste *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="input-modern appearance-none"
              >
                <option value="">Sélectionner un poste</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Statut
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-modern appearance-none"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="terminated">Terminé</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date d'entrée *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="input-modern pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date de sortie
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input-modern pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="card-modern p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Signature de l'employé
          </h2>
          
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-slate-600 mb-2">
              <strong>Important :</strong> La signature est obligatoire pour valider la fiche employé.
            </p>
            <p className="text-sm text-slate-600">
              Utilisez votre souris ou votre doigt (sur mobile) pour signer dans le cadre ci-dessous.
            </p>
          </div>
          
          <SignatureCanvas
            onSignatureChange={handleSignatureChange}
            value={formData.signature}
            width={600}
            height={250}
            className="mx-auto"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/employee-flow')}
            className="btn-secondary flex items-center gap-2"
            disabled={saving}
          >
            <X className="w-4 h-4" />
            Annuler
          </button>
          
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={saving || !formData.signature}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Mettre à jour' : 'Créer'} l'employé
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;