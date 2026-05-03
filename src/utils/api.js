import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // The JWT token is stored in HTTP-only cookies by the backend
    // No need to manually add it to headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('Authentication error, redirecting to login');
      // You might want to redirect to login or refresh token here
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Register with backend after Firebase auth
  registerFromFirebase: async (userData) => {
    const response = await api.post('/auth/register-firebase', userData);
    return response.data;
  },

  // Login with backend after Firebase auth
  loginFromFirebase: async (userData) => {
    const response = await api.post('/auth/login-firebase', userData);
    return response.data;
  },

  // Traditional email/password login (fallback)
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Traditional email/password register (fallback)
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User management API calls
export const userAPI = {
  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (userId, updateData) => {
    const response = await api.put(`/users/${userId}/role`, updateData);
    return response.data;
  },

  // Suspend user (admin only)
  suspendUser: async (userId, suspendData) => {
    const response = await api.put(`/users/${userId}/suspend`, suspendData);
    return response.data;
  },

  // Get user statistics (admin only)
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

// Loan API calls
export const loanAPI = {
  // Get all loans (public)
  getAllLoans: async (params = {}) => {
    const response = await api.get('/loans', { params });
    return response.data;
  },

  // Get home page loans
  getHomeLoans: async () => {
    const response = await api.get('/loans/home');
    return response.data;
  },

  // Get loan by ID
  getLoanById: async (loanId) => {
    const response = await api.get(`/loans/${loanId}`);
    return response.data;
  },

  // Create loan (manager/admin only)
  createLoan: async (loanData) => {
    const config = loanData instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.post('/loans', loanData, config);
    return response.data;
  },

  // Update loan (manager/admin only)
  updateLoan: async (loanId, updateData) => {
    const config = updateData instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    const response = await api.put(`/loans/${loanId}`, updateData, config);
    return response.data;
  },

  // Delete loan (manager/admin only)
  deleteLoan: async (loanId) => {
    const response = await api.delete(`/loans/${loanId}`);
    return response.data;
  },

  // Get manager's loans
  getMyLoans: async () => {
    const response = await api.get('/loans/my/loans');
    return response.data;
  },
};

// Application API calls
export const applicationAPI = {
  // Submit loan application
  submitApplication: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  // Get user's applications
  getMyApplications: async () => {
    const response = await api.get('/applications/my');
    return response.data;
  },

  // Get pending applications (manager)
  getPendingApplications: async (params = {}) => {
    const response = await api.get('/applications/pending', { params });
    return response.data;
  },

  // Get approved applications (manager)
  getApprovedApplications: async (params = {}) => {
    const response = await api.get('/applications/approved', { params });
    return response.data;
  },

  // Get all applications (admin)
  getAllApplications: async (params = {}) => {
    const response = await api.get('/applications/all', { params });
    return response.data;
  },

  // Approve application (manager)
  approveApplication: async (applicationId) => {
    const response = await api.put(`/applications/${applicationId}/approve`);
    return response.data;
  },

  // Reject application (manager)
  rejectApplication: async (applicationId) => {
    const response = await api.put(`/applications/${applicationId}/reject`);
    return response.data;
  },

  // Cancel application (borrower)
  cancelApplication: async (applicationId) => {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },

  // Get application details
  getApplicationDetails: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },
};

// Payment API calls
export const paymentAPI = {
  // Create payment session
  createPaymentSession: async (applicationId) => {
    const response = await api.post('/payments/create-session', { applicationId });
    return response.data;
  },

  // Get payment details
  getPaymentDetails: async (applicationId) => {
    const response = await api.get(`/payments/details/${applicationId}`);
    return response.data;
  },

  // Get payment statistics (admin)
  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  },
};

// File upload API calls
export const uploadAPI = {
  // Upload loan images
  uploadLoanImages: async (formData) => {
    const response = await api.post('/upload/loan-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;