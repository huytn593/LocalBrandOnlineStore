import api from '../api/axios';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  },

  getRevenueByMonth: async () => {
    const response = await api.get('/admin/analytics/revenue-by-month');
    return response.data;
  },

  getTopProducts: async (limit = 5) => {
    const response = await api.get(`/admin/analytics/top-products?limit=${limit}`);
    return response.data;
  }
};
