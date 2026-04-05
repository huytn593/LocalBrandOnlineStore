import api from '../api/axios';

export const orderService = {
  // User Actions
  createOrder: async (shippingAddress) => {
    const response = await api.post('/orders', { shippingAddress });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my');
    return response.data;
  },

  // Admin Actions
  getAllOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const response = await api.put(`/admin/orders/${orderId}?status=${newStatus}`);
    return response.data;
  }
};
