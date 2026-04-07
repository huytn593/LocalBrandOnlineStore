import { API_BASE_URL } from './api';

export const buildPaymentMockUrl = (orderId) =>
  `${API_BASE_URL}/payment/mock-success?orderId=${encodeURIComponent(orderId)}`;
