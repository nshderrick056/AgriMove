// ── Base helper ───────────────────────────────────────────────────────────────

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:5000/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('agrimove_token');

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('agrimove_token');
      localStorage.removeItem('agrimove_user');
    }
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Types mirrored from backend ───────────────────────────────────────────────

export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'EN_ROUTE' | 'DELIVERED' | 'CANCELLED';

export interface ApiDelivery {
  id: string;
  cargo: string;
  weightKg: number;
  pickup: string;
  destination: string;
  status: DeliveryStatus;
  eta: string | null;
  totalCost: number | null;
  currency: string;
  farmerId: string;
  driverId: string | null;
  driver: { fullName: string; phone?: string | null } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiNotification {
  id: string;
  userId: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
  createdAt: string;
}

export interface ApiComplaint {
  id: string;
  userId: string;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
  resolved: boolean;
  createdAt: string;
}

export interface ApiProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  region: string | null;
  role: string;
}

export interface DashboardMetrics {
  activeDeliveries: number;
  deliveriesThisMonth: number;
  estimatedSavings: number;
  farmer: { fullName: string; region: string | null } | null;
  activeCount?: number;
  deliveredThisMonthCount?: number;
  totalSpent?: number;
  nextPickupDate?: string | null;
  recentNotification?: { message: string } | null;
}

export interface CreateDeliveryPayload {
  cargo: string;
  weightKg: number;
  pickup: string;
  destination: string;
  preferredDate?: string;
  notes?: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  region?: string;
  currentPassword?: string;
  newPassword?: string;
}

// ── Farmer API calls ──────────────────────────────────────────────────────────

export const farmerApi = {
  /** Dashboard metrics + greeting */
  getDashboard(): Promise<DashboardMetrics> {
    return apiFetch('/farmer/dashboard');
  },

  /** Farmer deliveries (optional status filter) */
  getDeliveries(status?: string): Promise<ApiDelivery[]> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiFetch(`/farmer/deliveries${qs}`);
  },

  /** Single delivery by ID */
  getDeliveryById(id: string): Promise<ApiDelivery> {
    return apiFetch(`/farmer/deliveries/${id}`);
  },

  /** Create a new delivery request */
  createDelivery(payload: CreateDeliveryPayload): Promise<{ message: string; delivery: ApiDelivery }> {
    return apiFetch('/farmer/deliveries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /** Cancel a PENDING delivery */
  cancelDelivery(id: string): Promise<{ message: string; delivery: ApiDelivery }> {
    return apiFetch(`/farmer/deliveries/${id}`, { method: 'DELETE' });
  },

  /** Completed / cancelled history */
  getHistory(): Promise<ApiDelivery[]> {
    return apiFetch('/farmer/history');
  },

  /** Track a specific delivery (returns status + ETA + driver) */
  trackDelivery(id: string): Promise<Omit<ApiDelivery, 'farmerId' | 'buyerId' | 'currency'>> {
    return apiFetch(`/farmer/track/${id}`);
  },

  /** Notifications feed */
  getNotifications(): Promise<ApiNotification[]> {
    return apiFetch('/farmer/notifications');
  },

  /** Mark a single notification read */
  markNotificationRead(id: string): Promise<ApiNotification> {
    return apiFetch(`/farmer/notifications/${id}/read`, { method: 'PATCH' });
  },

  /** Get farmer profile */
  getProfile(): Promise<ApiProfile> {
    return apiFetch('/farmer/profile');
  },

  /** Update farmer profile / password */
  updateProfile(payload: UpdateProfilePayload): Promise<{ message: string; user: ApiProfile }> {
    return apiFetch('/farmer/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  getComplaints(): Promise<ApiComplaint[]> {
    return apiFetch('/farmer/complaints');
  },

  createComplaint(issue: string, priority: string = 'Medium'): Promise<{ message: string; complaint: ApiComplaint }> {
    return apiFetch('/farmer/complaints', {
      method: 'POST',
      body: JSON.stringify({ issue, priority }),
    });
  },
};
