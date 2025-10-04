// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nextgen-events-backend-b34m.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Events
  EVENTS: `${API_BASE_URL}/api/events`,
  EVENT_BY_ID: (id) => `${API_BASE_URL}/api/events/${id}`,
  EVENT_REGISTER: (id) => `${API_BASE_URL}/api/events/${id}/register`,
  EVENT_UNREGISTER: (id) => `${API_BASE_URL}/api/events/${id}/unregister`,
  
  // Users
  USER_PROFILE: `${API_BASE_URL}/api/users/profile`,
  USER_EVENTS: `${API_BASE_URL}/api/users/events`,
  
  // Products (if needed)
  PRODUCTS: `${API_BASE_URL}/api/products`,
  
  // File uploads
  UPLOAD: `${API_BASE_URL}/api/upload`
};

// Default axios config
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_BASE_URL;