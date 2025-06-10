import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await apiClient({
      url: endpoint,
      ...options,
    });

    return response.data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard/stats'),
  getComplaintsByCity: () => apiRequest('/dashboard/complaints-by-city'),
  getComplaintsByCategory: () => apiRequest('/dashboard/complaints-by-category'),
  getDepartmentRatings: () => apiRequest('/dashboard/department-ratings'),
  getMonthlyTrends: () => apiRequest('/dashboard/monthly-trends'),
  getRecentComplaints: (limit = 10) => apiRequest('/dashboard/recent-complaints', {
    params: { limit },
  }),
};

export const citizenApi = {
    create : (data) => apiRequest('/auth',{
        method:'POST',
        data
    })
}
export const resolutionApi = {
    create : (data) => apiRequest('/resolution',{
        method:'POST',
        data
    })
}

export const complaintsAPI = {
  getAll: (params = {}) => apiRequest('/complaint', { params }),
  getById: (id) => apiRequest(`/complaint/${id}`),
  create: (data) => apiRequest('/complaint', {
    method: 'POST',
    data,
  }),
  
};

export const citiesAPI = {
  getAll: () => apiRequest('/cities'),
  getById: (id) => apiRequest(`/cities/${id}`),
  create: (data) => apiRequest('/cities', {
    method: 'POST',
    data,
  }),
 
  getLocations: (id) => apiRequest(`/cities/${id}/locations`),
};

export const departmentsAPI = {
  getAll: () => apiRequest('/departments'),
  getById: (id) => apiRequest(`/departments/${id}`),
  create: (data) => apiRequest('/departments', {
    method: 'POST',
    data,
  }),
  getWorkers: (id) => apiRequest(`/departments/${id}/workers`),
  getCategories: (id) => apiRequest(`/departments/${id}/categories`),
};

export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  getById: (id) => apiRequest(`/categories/${id}`),
  getByDepartment: (departmentId) => apiRequest(`/categories/by-department/${departmentId}`),

 
};

export const workersAPI = {
  getAll: () => apiRequest('/workers'),
  getById: (id) => apiRequest(`/workers/${id}`),
  create: (data) => apiRequest('/workers', {
    method: 'POST',
    data,
  }),
  getAssignments: (id) => apiRequest(`/workers/${id}/assignments`),
};

export const feedbackAPI = {
  getAll: (params = {}) => apiRequest('/feedback', { params }),
  getByComplaint: (complaintId) => apiRequest(`/feedback/complaint/${complaintId}`),
  create: (data) => apiRequest('/feedback', {
    method: 'POST',
    data,
  }),
  getStatistics: () => apiRequest('/feedback/statistics'),
};
