import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Package, 
  AlertCircle, 
  TrendingUp,
  UserPlus,
  Search,
  Filter,
  Loader2,
  Building2,
  FileText,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import { employeeAPI, statsAPI } from "../services/api";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({
    activeEmployees: 0,
    totalMaterials: 0,
    pendingReturns: 0,
    departments: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [employeesData, statsData] = await Promise.all([
        employeeAPI.getAll(),
        statsAPI.get()
      ]);
      
      setEmployees(employeesData);
      setStats(statsData);
      
      // Générer des activités récentes
      const activities = generateRecentActivities(employeesData);
      setRecentActivity(activities);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivities = (employees) => {
    const activities = [];
    const now = new Date();
    
    employees.slice(0, 5).forEach(emp => {
      if (emp.materials && emp.materials.length > 0) {
        const recentMaterial = emp.materials[emp.materials.length - 1];
        activities.push({
          id: `${emp.id}-${recentMaterial.materialId}`,
          type: 'material_assigned',
          employee: `${emp.firstName} ${emp.lastName}`,
          material: recentMaterial.type,
          date: new Date(recentMaterial.assignedDate),
          department: emp.department
        });
      }
    });
    
    return activities.sort((a, b) => b.date - a.date);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatsCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="card-modern p-6 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'material_assigned':
          return <Package className="w-4 h-4 text-blue-600" />;
        default:
          return <FileText className="w-4 h-4 text-slate-600" />;
      }
    };

    const formatDate = (date) => {
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return "Aujourd'hui";
      if (days === 1) return "Hier";
      if (days < 7) return `Il y a ${days} jours`;
      return date.toLocaleDateString('fr-FR');
    };

    return (
      <div className="flex items-center p-4 hover:bg-slate-50 rounded-lg transition-colors duration-200">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">
            {activity.employee}
          </p>
          <p className="text-sm text-slate-600">
            Matériel assigné: {activity.material}
          </p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-slate-500">{activity.department}</span>
            <span className="mx-2 text-slate-300">•</span>
            <span className="text-xs text-slate-500">{formatDate(activity.date)}</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Tableau de bord
          </h1>
          <p className="text-slate-600 text-lg">
            Gestion des fiches de matériel - Hôtel Radisson
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/employee/new" className="btn-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Nouvel employé
          </Link>
          <Link to="/material-management" className="btn-secondary flex items-center gap-2">
            <Package className="w-5 h-5" />
            Gérer matériel
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Employés actifs"
          value={stats.activeEmployees}
          icon={Users}
          color="from-blue-500 to-blue-600"
          trend="+5% ce mois"
          subtitle="Dont 3 nouveaux"
        />
        <StatsCard
          title="Matériel total"
          value={stats.totalMaterials}
          icon={Package}
          color="from-green-500 to-green-600"
          subtitle="Tous types confondus"
        />
        <StatsCard
          title="Retours en attente"
          value={stats.pendingReturns}
          icon={AlertCircle}
          color="from-amber-500 to-amber-600"
          subtitle="Nécessitent attention"
        />
        <StatsCard
          title="Départements"
          value={stats.departments}
          icon={Building2}
          color="from-purple-500 to-purple-600"
          subtitle="Services actifs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search and Employees */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="card-modern p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Rechercher un employé
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern pl-10"
              />
            </div>
          </div>

          {/* Employees List */}
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Employés récents
              </h2>
              <span className="text-sm text-slate-600">
                {filteredEmployees.length} résultat{filteredEmployees.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-3">
              {filteredEmployees.slice(0, 5).map((employee) => (
                <Link
                  key={employee.id}
                  to={`/employee/edit/${employee.id}`}
                  className="block p-4 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 group-hover:text-primary-600">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {employee.department} • {employee.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {employee.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                      <span className="text-sm text-slate-500">
                        {employee.materials?.length || 0} matériel(s)
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredEmployees.length > 5 && (
              <div className="mt-6 text-center">
                <Link to="/employee-flow" className="text-primary-600 hover:text-primary-700 font-medium">
                  Voir tous les employés →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <div className="card-modern p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Activité récente
              </h2>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="space-y-2">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Aucune activité récente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;