import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Building2,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const EmployeeFlow = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, departmentFilter, statusFilter]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeAPI.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await employeeAPI.delete(id);
        loadEmployees();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const departments = [...new Set(employees.map(emp => emp.department))];
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'active').length,
    inactive: employees.filter(emp => emp.status === 'inactive').length,
    withMaterials: employees.filter(emp => emp.materials && emp.materials.length > 0).length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-amber-100 text-amber-700';
      case 'terminated': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'terminated': return 'Terminé';
      default: return 'Inconnu';
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Gestion des employés
          </h1>
          <p className="text-slate-600">
            Liste complète des employés et leurs matériels
          </p>
        </div>
        <Link to="/employee/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouvel employé
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-modern p-4 text-center">
          <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          <p className="text-sm text-slate-600">Total</p>
        </div>
        <div className="card-modern p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.active}</p>
          <p className="text-sm text-slate-600">Actifs</p>
        </div>
        <div className="card-modern p-4 text-center">
          <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.inactive}</p>
          <p className="text-sm text-slate-600">Inactifs</p>
        </div>
        <div className="card-modern p-4 text-center">
          <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.withMaterials}</p>
          <p className="text-sm text-slate-600">Avec matériel</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card-modern p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-modern pl-10"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Département
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="input-modern appearance-none"
              >
                <option value="">Tous les départements</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Statut
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-modern appearance-none"
              >
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="terminated">Terminé</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Employees List */}
      <div className="card-modern">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              Liste des employés
            </h2>
            <span className="text-sm text-slate-600">
              {filteredEmployees.length} employé{filteredEmployees.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Département
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Matériel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                        {employee.firstName?.[0] || ''}{employee.lastName?.[0] || ''}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-slate-500">
                          {employee.employeeId || 'ID non défini'}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-900">
                        {employee.department || 'Non défini'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 ml-6">
                      {employee.position || 'Non défini'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="text-sm text-slate-900">
                        {employee.materials?.length || 0} matériel(s)
                      </span>
                    </div>
                    {employee.materials?.length > 0 && (
                      <div className="text-xs text-slate-500 ml-6">
                        {employee.materials[0].type} {employee.materials.length > 1 ? `+${employee.materials.length - 1}` : ''}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(employee.status)
                    }`}>
                      {getStatusLabel(employee.status)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/employee/edit/${employee.id}`}
                        className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(employee.id)}
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

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">
              {searchTerm || departmentFilter || statusFilter 
                ? 'Aucun employé ne correspond aux filtres' 
                : 'Aucun employé enregistré'
              }
            </p>
            {!employees.length && (
              <Link to="/employee/new" className="btn-primary">
                Créer le premier employé
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeFlow;