import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/update-profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

export const productAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  search: (q: string) => api.get('/products/search', { params: { q } }),
  getFeatured: () => api.get('/products/featured'),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data: any) => api.post('/cart/add', data),
  update: (itemId: string, data: any) => api.put(`/cart/update/${itemId}`, data),
  remove: (itemId: string) => api.delete(`/cart/remove/${itemId}`),
  clear: () => api.delete('/cart/clear'),
  applyCoupon: (code: string) => api.post('/cart/apply-coupon', { couponCode: code }),
};

export const orderAPI = {
  getMyOrders: (params?: any) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  cancel: (id: string, reason: string) => api.put(`/orders/${id}/cancel`, { reason }),
};

export const reviewAPI = {
  getProductReviews: (productId: string, params?: any) =>
    api.get(`/reviews/product/${productId}`, { params }),
  create: (data: any) => api.post('/reviews', data),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
  markHelpful: (id: string) => api.post(`/reviews/${id}/helpful`),
};

export const userAPI = {
  getWishlist: () => api.get('/users/wishlist'),
  addToWishlist: (productId: string) => api.post(`/users/wishlist/${productId}`),
  removeFromWishlist: (productId: string) => api.delete(`/users/wishlist/${productId}`),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data: any) => api.post('/users/addresses', data),
  updateAddress: (id: string, data: any) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id: string) => api.delete(`/users/addresses/${id}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllOrders: (params?: any) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id: string, data: any) => api.put(`/admin/orders/${id}/status`, data),
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
  toggleUserStatus: (id: string) => api.put(`/admin/users/${id}/toggle-status`),
  getPendingProducts: () => api.get('/admin/products/pending'),
  approveProduct: (id: string) => api.put(`/admin/products/${id}/approve`),
};

export default api;
