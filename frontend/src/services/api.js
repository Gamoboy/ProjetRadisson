import axios from 'axios';

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Services pour les employés
export const employeeAPI = {
  getAll: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (employee) => {
    const response = await api.post('/employees', employee);
    return response.data;
  },

  update: async (id, employee) => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

// Services pour le matériel
export const materialAPI = {
  getAll: async () => {
    const response = await api.get('/materials');
    return response.data;
  },

  create: async (material) => {
    const response = await api.post('/materials', material);
    return response.data;
  },

  update: async (id, material) => {
    const response = await api.put(`/materials/${id}`, material);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },
};

// Services pour les statistiques
export const statsAPI = {
  get: async () => {
    const response = await api.get('/stats');
    return response.data;
  },
};

// Services pour les signatures
export const signatureAPI = {
  save: async (signatureData) => {
    const response = await api.post('/signatures', signatureData);
    return response.data;
  },

  get: async (id) => {
    const response = await api.get(`/signatures/${id}`);
    return response.data;
  },
};

export default api;