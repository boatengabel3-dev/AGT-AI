import {
  User,
  FarmerProfile,
  Farm,
  Product,
  Order,
  FinancingProduct,
  LoanApplication,
  EquipmentListing,
  EquipmentBooking,
  UserRole,
  CropDiagnosisResult,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('agritrust_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = { ...getAuthHeaders(), ...options.headers };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data: any) =>
    request<{ message: string; user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<{ message: string; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  googleSync: (data: { id?: string; fullName: string; email: string; phone?: string; role?: string; avatarUrl?: string }) =>
    request<{ message: string; user: User; token: string }>('/auth/google-sync', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  demoLogin: (role: UserRole) =>
    request<{ message: string; user: User; token: string }>('/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  getMe: () =>
    request<{ user: User; profile: FarmerProfile | null; unreadNotificationsCount: number }>('/auth/me'),

  // Farmer
  getFarmerProfile: (userId?: string) =>
    request<FarmerProfile>(`/farmers/profile${userId ? `?userId=${userId}` : ''}`),

  updateFarmerProfile: (data: Partial<FarmerProfile>) =>
    request<{ message: string; profile: FarmerProfile }>('/farmers/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateDataConsent: (consent: { shareWithBanks: boolean; shareWithSuppliers: boolean; shareWithFieldAgents: boolean }) =>
    request<{ message: string; consent: any }>('/farmers/consent', {
      method: 'PUT',
      body: JSON.stringify(consent),
    }),

  // Farms
  getFarms: () => request<Farm[]>('/farms'),
  getFarmById: (id: string) => request<Farm>(`/farms/${id}`),
  registerFarm: (data: any) =>
    request<{ message: string; farm: Farm }>('/farms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyFarm: (id: string, data: { status: string; notes: string; verifiedAreaAcres?: number }) =>
    request<{ message: string; farm: Farm }>(`/farms/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Marketplace
  getProducts: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return request<Product[]>(`/marketplace/products?${params.toString()}`);
  },
  createProduct: (data: any) =>
    request<{ message: string; product: Product }>('/marketplace/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: any) =>
    request<{ message: string; product: Product }>(`/marketplace/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: string) =>
    request<{ message: string }>(`/marketplace/products/${id}`, {
      method: 'DELETE',
    }),
  placeOrder: (data: any) =>
    request<{ message: string; order: Order }>('/marketplace/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getOrders: () => request<Order[]>('/marketplace/orders'),
  updateOrderStatus: (id: string, data: { fulfilmentStatus: string; paymentStatus?: string }) =>
    request<{ message: string; order: Order }>(`/marketplace/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Loans
  getFinancingProducts: () => request<FinancingProduct[]>('/loans/products'),
  createFinancingProduct: (data: any) =>
    request<{ message: string; product: FinancingProduct }>('/loans/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFinancingProduct: (id: string, data: any) =>
    request<{ message: string; product: FinancingProduct }>(`/loans/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFinancingProduct: (id: string) =>
    request<{ message: string }>(`/loans/products/${id}`, {
      method: 'DELETE',
    }),
  getLoanApplications: () => request<LoanApplication[]>('/loans/applications'),
  submitLoanApplication: (data: any) =>
    request<{ message: string; application: LoanApplication }>('/loans/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateLoanDecision: (id: string, data: { status: string; note: string; approvedAmountGHS?: number }) =>
    request<{ message: string; application: LoanApplication }>(`/loans/${id}/decision`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Equipment
  getEquipmentListings: (region?: string, category?: string) => {
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    if (category) params.append('category', category);
    return request<EquipmentListing[]>(`/equipment/listings?${params.toString()}`);
  },
  createEquipmentListing: (data: any) =>
    request<{ message: string; listing: EquipmentListing }>('/equipment/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEquipmentListing: (id: string, data: any) =>
    request<{ message: string; listing: EquipmentListing }>(`/equipment/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteEquipmentListing: (id: string) =>
    request<{ message: string }>(`/equipment/listings/${id}`, {
      method: 'DELETE',
    }),
  bookEquipment: (data: any) =>
    request<{ message: string; booking: EquipmentBooking }>('/equipment/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getBookings: () => request<EquipmentBooking[]>('/equipment/bookings'),
  updateBookingStatus: (id: string, data: { status: string; providerNote?: string }) =>
    request<{ message: string; booking: EquipmentBooking }>(`/equipment/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // AI Assistant with Multi-Turn History, Model Selector, Vision & Maps Grounding
  askAssistant: (
    message: string,
    history: any[] = [],
    modelType: string = 'gemini-3.8-flash',
    userLocation?: { lat: number; lng: number },
    image?: string
  ) =>
    request<{
      reply: string;
      source: string;
      modelUsed: string;
      mapsLinks?: { title: string; uri: string }[];
    }>('/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ message, history, modelType, userLocation, imageBase64: image }),
    }),

  // Crop Pest & Disease Multimodal Vision Diagnostic Scanner
  diagnoseCrop: (data: {
    imageBase64: string;
    cropHint?: string;
    farmerNotes?: string;
    region?: string;
  }) =>
    request<{
      success: boolean;
      diagnosis: CropDiagnosisResult;
      source: string;
    }>('/ai/diagnose-crop', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin
  getAdminOverview: () => request<any>('/admin/overview'),
  getAdminUsers: () => request<User[]>('/admin/users'),
  verifyUser: (id: string, isVerified: boolean) =>
    request<{ message: string; user: User }>(`/admin/users/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ isVerified }),
    }),
  getAuditLogs: () => request<any[]>('/admin/audit-logs'),
};
