import api from '../api/axios';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity, price) => {
    const response = await api.post('/cart/add', {
      productId,
      quantity,
      price
    });
    return response.data;
  },

  updateCartItem: async (productId, quantity, price) => {
    const response = await api.put('/cart/update', {
      productId,
      quantity,
      price
    });
    return response.data;
  },

  removeFromCart: async (productId) => {
    // Standardizing to pass query param as mapped in Spring
    const response = await api.delete(`/cart/remove?productId=${productId}`);
    return response.data;
  }
};
