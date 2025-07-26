import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://saas-laravel-api-master-ldxqg1.laravel.cloud/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

console.log('API Base URL:', api.defaults.baseURL);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API response wrapper
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    pagination?: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}

// Utility API (health checks, etc.)
export const utilityApi = {
  health: async (): Promise<ApiResponse> => {
    const response = await api.get('/health');
    return response.data;
  },

  version: async (): Promise<ApiResponse> => {
    const response = await api.get('/version');
    return response.data;
  },

  testRateLimit: async (): Promise<ApiResponse> => {
    const response = await api.get('/debug/rate-limit');
    return response.data;
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string, teamId?: number): Promise<ApiResponse> => {
    const payload: any = { email, password };
    if (teamId) {
      payload.team_id = teamId;
    }
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  register: async (userData: any): Promise<ApiResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  

  getUser: async (): Promise<ApiResponse> => {
    // Use profile endpoint instead of /auth/user which doesn't exist
    const response = await api.get('/auth/profile');
    return response.data;
  },

  getUserProfile: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData: any): Promise<ApiResponse> => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  updatePassword: async (passwordData: any): Promise<ApiResponse> => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },

  switchTeam: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.post('/auth/switch-team', { team_id: teamId });
    return response.data;
  },

  getCurrentTeam: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/current-team');
    return response.data;
  },

  getUserTeams: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/teams');
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: any): Promise<ApiResponse> => {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  sendVerificationEmail: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/email/resend');
    return response.data;
  },

  verifyEmail: async (id: string, hash: string): Promise<ApiResponse> => {
    const response = await api.get(`/auth/email/verify/${id}/${hash}`);
    return response.data;
  },

  setup2FA: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/2fa/setup');
    return response.data;
  },

  enable2FA: async (code: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/2fa/enable', { code });
    return response.data;
  },

  disable2FA: async (code: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/2fa/disable', { code });
    return response.data;
  },

  verify2FA: async (code: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/2fa/verify', { code });
    return response.data;
  },

  regenerateBackupCodes: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/2fa/regenerate-codes');
    return response.data;
  },

  exportData: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/export-data');
    return response.data;
  },

  deleteAccount: async (): Promise<ApiResponse> => {
    const response = await api.delete('/auth/delete-account');
    return response.data;
  },

  anonymizeData: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/anonymize');
    return response.data;
  },

  getUserSessions: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/sessions');
    return response.data;
  },

  revokeSession: async (tokenId: string): Promise<void> => {
    await api.delete(`/auth/sessions/${tokenId}`);
  },

  revokeAllOtherSessions: async (): Promise<void> => {
    await api.delete('/auth/sessions/revoke-all');
  },

  getSecurityStatus: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/security-status');
    return response.data;
  },
};

// Social Auth API
export const socialAuthApi = {
  redirect: async (provider: string): Promise<ApiResponse> => {
    const response = await api.get(`/auth/${provider}/redirect`);
    return response.data;
  },

  callback: async (provider: string, code: string): Promise<ApiResponse> => {
    const response = await api.get(`/auth/${provider}/callback?code=${code}`);
    return response.data;
  },

  linkAccount: async (provider: string, data: any): Promise<ApiResponse> => {
    const response = await api.post(`/auth/${provider}/link`, data);
    return response.data;
  },

  unlinkAccount: async (provider: string): Promise<void> => {
    await api.delete(`/auth/${provider}/unlink`);
  },
};

// Team API
export const teamApi = {
  getTeams: async (): Promise<ApiResponse> => {
    const response = await api.get('/teams');
    return response.data;
  },

  getCurrentTeam: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/current-team');
    return response.data;
  },

  getUserTeams: async (): Promise<ApiResponse> => {
    const response = await api.get('/auth/teams');
    return response.data;
  },

  getTeam: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  createTeam: async (teamData: any): Promise<ApiResponse> => {
    const response = await api.post('/teams', teamData);
    return response.data;
  },

  updateTeam: async (teamId: number, teamData: any): Promise<ApiResponse> => {
    const response = await api.put(`/teams/${teamId}`, teamData);
    return response.data;
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    await api.delete(`/teams/${teamId}`);
  },

  getTeamMembers: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/members`);
    return response.data;
  },

  inviteMember: async (teamId: number, memberData: any): Promise<ApiResponse> => {
    const response = await api.post(`/teams/${teamId}/members`, memberData);
    return response.data;
  },

  updateMember: async (teamId: number, userId: number, memberData: any): Promise<ApiResponse> => {
    const response = await api.put(`/teams/${teamId}/members/${userId}`, memberData);
    return response.data;
  },

  removeMember: async (teamId: number, userId: number): Promise<void> => {
    await api.delete(`/teams/${teamId}/members/${userId}`);
  },

  getTeamAnalytics: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/analytics`);
    return response.data;
  },

  acceptInvitation: async (token: string): Promise<ApiResponse> => {
    const response = await api.get(`/team/invitation/${token}/accept`);
    return response.data;
  },

  declineInvitation: async (token: string): Promise<ApiResponse> => {
    const response = await api.get(`/team/invitation/${token}/decline`);
    return response.data;
  },
};

// Subscription API
export const subscriptionApi = {
  getPlans: async (): Promise<ApiResponse> => {
    const response = await api.get('/plans');
    return response.data;
  },

  getPlan: async (planId: number): Promise<ApiResponse> => {
    const response = await api.get(`/plans/${planId}`);
    return response.data;
  },

  getSubscriptions: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/subscriptions`);
    return response.data;
  },

  getSubscription: async (teamId: number, subscriptionId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/subscriptions/${subscriptionId}`);
    return response.data;
  },

  createSubscription: async (teamId: number, subscriptionData: any): Promise<ApiResponse> => {
    const response = await api.post(`/teams/${teamId}/subscriptions`, subscriptionData);
    return response.data;
  },

  updateSubscription: async (teamId: number, subscriptionId: number, subscriptionData: any): Promise<ApiResponse> => {
    const response = await api.put(`/teams/${teamId}/subscriptions/${subscriptionId}`, subscriptionData);
    return response.data;
  },

  cancelSubscription: async (teamId: number, subscriptionId: number): Promise<ApiResponse> => {
    const response = await api.delete(`/teams/${teamId}/subscriptions/${subscriptionId}`);
    return response.data;
  },

  resumeSubscription: async (teamId: number, subscriptionId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/subscriptions/${subscriptionId}/resume`);
    return response.data;
  },

  getInvoices: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/invoices`);
    return response.data;
  },

  getInvoice: async (teamId: number, invoiceId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/invoices/${invoiceId}`);
    return response.data;
  },

  getSubscriptionAnalytics: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/subscriptions/analytics`);
    return response.data;
  },
};

// Credit API
export const creditApi = {
  getCredits: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/credits`);
    return response.data;
  },

  getCreditTransactions: async (teamId: number, params?: any): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/credits/transactions`, { params });
    return response.data;
  },

  getCreditPackages: async (): Promise<ApiResponse> => {
    const response = await api.get('/credit-packages');
    return response.data;
  },

  getCreditPurchases: async (teamId: number, params?: any): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/credits/purchases`, { params });
    return response.data;
  },

  purchaseCredits: async (teamId: number, purchaseData: any): Promise<ApiResponse> => {
    const response = await api.post(`/teams/${teamId}/credits/purchase`, purchaseData);
    return response.data;
  },

  useCredits: async (teamId: number, usageData: any): Promise<ApiResponse> => {
    const response = await api.post(`/teams/${teamId}/credits/use`, usageData);
    return response.data;
  },

  getCreditAnalytics: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/credits/analytics`);
    return response.data;
  },

  // Global credit routes (for backward compatibility)
  getGlobalCredits: async (): Promise<ApiResponse> => {
    const response = await api.get('/credits');
    return response.data;
  },

  getGlobalTransactions: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/credits/transactions', { params });
    return response.data;
  },

  useGlobalCredits: async (usageData: any): Promise<ApiResponse> => {
    const response = await api.post('/credits/use', usageData);
    return response.data;
  },

  purchaseGlobalCredits: async (purchaseData: any): Promise<ApiResponse> => {
    const response = await api.post('/credits/purchase', purchaseData);
    return response.data;
  },

  getGlobalPurchases: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/credits/purchases', { params });
    return response.data;
  },
};

// Seat API
export const seatApi = {
  getSeats: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/seats`);
    return response.data;
  },

  getSeat: async (teamId: number, seatId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/seats/${seatId}`);
    return response.data;
  },

  allocateSeat: async (teamId: number, seatData: any): Promise<ApiResponse> => {
    const response = await api.post(`/teams/${teamId}/seats`, seatData);
    return response.data;
  },

  updateSeat: async (teamId: number, seatId: number, seatData: any): Promise<ApiResponse> => {
    const response = await api.put(`/teams/${teamId}/seats/${seatId}`, seatData);
    return response.data;
  },

  deallocateSeat: async (teamId: number, seatId: number): Promise<void> => {
    await api.delete(`/teams/${teamId}/seats/${seatId}`);
  },

  getSeatUsage: async (teamId: number, seatId: number, params?: any): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/seats/${seatId}/usage`, { params });
    return response.data;
  },

  getSeatAnalytics: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/seats/analytics`);
    return response.data;
  },
};

// Notification API
export const notificationApi = {
  getNotifications: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getNotification: async (notificationId: number): Promise<ApiResponse> => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<ApiResponse> => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse> => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId: number): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`);
  },

  getNotificationSettings: async (): Promise<ApiResponse> => {
    const response = await api.get('/notifications/settings');
    return response.data;
  },

  updateNotificationSettings: async (settings: any): Promise<ApiResponse> => {
    const response = await api.put('/notifications/settings', settings);
    return response.data;
  },

  getUnreadCount: async (): Promise<ApiResponse> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  getTeamNotifications: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/teams/${teamId}/notifications`);
    return response.data;
  },
};

// Admin API
export const adminApi = {
  login: async (email: string, password: string): Promise<ApiResponse> => {
    const response = await api.post('/admin/auth/login', { email, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/admin/auth/logout');
  },

  getProfile: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/auth/profile');
    return response.data;
  },

  updateProfile: async (profileData: any): Promise<ApiResponse> => {
    const response = await api.put('/admin/auth/profile', profileData);
    return response.data;
  },

  getDashboard: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getTeams: async (params?: any): Promise<ApiResponse> => {
    const response = await api.get('/admin/teams', { params });
    return response.data;
  },

  getTeam: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/admin/teams/${teamId}`);
    return response.data;
  },

  updateTeam: async (teamId: number, teamData: any): Promise<ApiResponse> => {
    const response = await api.put(`/admin/teams/${teamId}`, teamData);
    return response.data;
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    await api.delete(`/admin/teams/${teamId}`);
  },

  suspendTeam: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.post(`/admin/teams/${teamId}/suspend`);
    return response.data;
  },

  activateTeam: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.post(`/admin/teams/${teamId}/activate`);
    return response.data;
  },

  getAnalytics: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/teams/analytics');
    return response.data;
  },

  getTeamAnalytics: async (teamId: number): Promise<ApiResponse> => {
    const response = await api.get(`/admin/teams/${teamId}/analytics`);
    return response.data;
  },

  getUsers: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUser: async (userId: number): Promise<ApiResponse> => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: number, userData: any): Promise<ApiResponse> => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  getWebhooks: async (): Promise<ApiResponse> => {
    const response = await api.get('/admin/webhooks');
    return response.data;
  },

  getWebhook: async (webhookId: number): Promise<ApiResponse> => {
    const response = await api.get(`/admin/webhooks/${webhookId}`);
    return response.data;
  },

  retryWebhook: async (webhookId: number): Promise<ApiResponse> => {
    const response = await api.post(`/admin/webhooks/${webhookId}/retry`);
    return response.data;
  },
};

// Webhook API
export const webhookApi = {
  handleStripeWebhook: async (payload: any): Promise<ApiResponse> => {
    const response = await api.post('/webhooks/stripe', payload);
    return response.data;
  },

  testStripeWebhook: async (): Promise<ApiResponse> => {
    const response = await api.get('/webhooks/stripe/test');
    return response.data;
  },
};

// Stripe API
export const stripeApi = {
  createPaymentIntent: async (data: { amount: number; currency: string; description?: string }): Promise<ApiResponse> => {
    const response = await api.post('/stripe/create-payment-intent', data);
    return response.data;
  },

  createSetupIntent: async (data: { payment_method_types?: string[] }): Promise<ApiResponse> => {
    const response = await api.post('/stripe/create-setup-intent', data);
    return response.data;
  },

  getPaymentMethods: async (): Promise<ApiResponse> => {
    const response = await api.get('/stripe/payment-methods');
    return response.data;
  },

  addPaymentMethod: async (paymentMethodId: string): Promise<ApiResponse> => {
    const response = await api.post('/stripe/payment-methods', { payment_method_id: paymentMethodId });
    return response.data;
  },

  removePaymentMethod: async (paymentMethodId: string): Promise<void> => {
    await api.delete(`/stripe/payment-methods/${paymentMethodId}`);
  },

  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<ApiResponse> => {
    const response = await api.post(`/stripe/payment-methods/${paymentMethodId}/default`);
    return response.data;
  },

  getPaymentIntent: async (paymentIntentId: string): Promise<ApiResponse> => {
    const response = await api.get(`/stripe/payment-intents/${paymentIntentId}`);
    return response.data;
  },

  confirmPaymentIntent: async (paymentIntentId: string, data: any): Promise<ApiResponse> => {
    const response = await api.post(`/stripe/payment-intents/${paymentIntentId}/confirm`, data);
    return response.data;
  },
};

export default api;
