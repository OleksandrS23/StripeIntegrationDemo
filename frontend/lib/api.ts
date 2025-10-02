import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Connect Account APIs
export const connectAccountAPI = {
  listAccounts: async (limit: number = 10) => {
    const response = await api.get(`/stripe/connect/accounts?limit=${limit}`);
    return response.data;
  },

  createAccount: async (data: {
    email: string;
    country?: string;
    type?: 'express' | 'standard' | 'custom';
  }) => {
    const response = await api.post('/stripe/connect/accounts', data);
    return response.data;
  },

  getAccount: async (accountId: string) => {
    const response = await api.get(`/stripe/connect/accounts/${accountId}`);
    return response.data;
  },

  getAccountBalance: async (accountId: string) => {
    const response = await api.get(
      `/stripe/connect/accounts/${accountId}/balance`,
    );
    return response.data;
  },

  createAccountLink: async (data: {
    accountId: string;
    refreshUrl: string;
    returnUrl: string;
  }) => {
    const response = await api.post('/stripe/connect/account-links', data);
    return response.data;
  },

  simulateFlow: async (data: { email: string; amount: number }) => {
    const response = await api.post('/stripe/connect/simulate-flow', data);
    return response.data;
  },
};

// Payment APIs
export const paymentAPI = {
  createPaymentIntent: async (data: {
    amount: number;
    currency?: string;
    connectedAccountId: string;
    applicationFeeAmount?: number;
    description?: string;
    customerEmail?: string;
    paymentMethods?: string[];
  }) => {
    const response = await api.post(
      '/stripe/payments/payment-intents',
      data,
    );
    return response.data;
  },

  confirmPaymentIntent: async (
    paymentIntentId: string,
    paymentMethodId?: string,
  ) => {
    const response = await api.post(
      `/stripe/payments/payment-intents/${paymentIntentId}/confirm`,
      { paymentMethodId },
    );
    return response.data;
  },

  cancelPaymentIntent: async (paymentIntentId: string) => {
    const response = await api.post(
      `/stripe/payments/payment-intents/${paymentIntentId}/cancel`,
    );
    return response.data;
  },

  getPaymentIntent: async (paymentIntentId: string) => {
    const response = await api.get(
      `/stripe/payments/payment-intents/${paymentIntentId}`,
    );
    return response.data;
  },

  getAvailablePaymentMethods: async (currency: string = 'eur') => {
    const response = await api.get(
      `/stripe/payments/payment-methods/available?currency=${currency}`,
    );
    return response.data;
  },

  createMBWayPayment: async (data: {
    amount: number;
    connectedAccountId: string;
    applicationFeeAmount?: number;
    description?: string;
    customerEmail?: string;
    customerPhone?: string;
  }) => {
    const response = await api.post(
      '/stripe/payments/payment-intents/mbway',
      data,
    );
    return response.data;
  },

  createTransfer: async (data: {
    amount: number;
    currency?: string;
    destination: string;
  }) => {
    const response = await api.post('/stripe/payments/transfers', data);
    return response.data;
  },
};

// Checkout APIs
export const checkoutAPI = {
  createCheckoutSession: async (data: {
    amount: number;
    currency?: string;
    connectedAccountId: string;
    applicationFeeAmount: number;
    productName?: string;
    customerEmail?: string;
  }) => {
    const response = await api.post('/stripe/checkout/sessions', data);
    return response.data;
  },

  createPaymentLink: async (data: {
    amount: number;
    currency?: string;
    connectedAccountId: string;
    applicationFeeAmount: number;
    productName?: string;
    productDescription?: string;
  }) => {
    const response = await api.post('/stripe/checkout/payment-links', data);
    return response.data;
  },

  createPaymentLinkWithFee: async (data: {
    amount: number;
    currency?: string;
    connectedAccountId: string;
    applicationFeeAmount: number;
    productName?: string;
    productDescription?: string;
  }) => {
    const response = await api.post(
      '/stripe/checkout/payment-links/with-fee',
      data,
    );
    return response.data;
  },

  createPaymentIntentForElements: async (data: {
    amount: number;
    currency?: string;
    connectedAccountId: string;
    applicationFeeAmount?: number;
    customerEmail?: string;
  }) => {
    const response = await api.post(
      '/stripe/checkout/payment-intents-elements',
      data,
    );
    return response.data;
  },
};

export default api;

