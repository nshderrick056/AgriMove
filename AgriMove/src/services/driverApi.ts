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

// ── Types ─────────────────────────────────────────────────────────────────────

export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'EN_ROUTE' | 'DELIVERED' | 'CANCELLED';

export interface DriverJob {
  id: string;
  cargo: string;
  weightKg: number;
  pickup: string;
  destination: string;
  status: DeliveryStatus;
  eta: string | null;
  totalCost: number | null;
  currency: string;
  proofImageUrl?: string | null;
  farmerId: string;
  farmer: { fullName: string; region: string | null; phone?: string | null } | null;
  buyer?: { fullName: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface DriverDashboardMetrics {
  todayEarnings: number;
  currency: string;
  deliveriesThisWeek: number;
  activeDelivery: DriverJob | null;
  driver: { fullName: string; region: string | null } | null;
  tripsCompletedThisMonth?: number;
  availableJobsCount?: number;
  driverRating?: number;
  recentNotification?: { message: string } | null;
}

export interface EarningsData {
  period: 'weekly' | 'monthly';
  data: Array<{ day?: string; week?: string; earnings: number; name?: string; amount?: number }>;
  total: number;
  currency: string;
  totalEarnings?: number;
  platformFee?: number;
  netEarnings?: number;
  completedCount?: number;
  chartData?: Array<{ name: string; amount: number }>;
}

export interface ApiNotification {
  id: string;
  userId: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
  createdAt: string;
}

export interface DriverComplaint {
  id: string;
  userId: string;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
  resolved: boolean;
  createdAt: string;
}

export interface DriverProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  region: string | null;
  role: string;
  status?: string;
}

export interface UpdateDriverProfilePayload {
  fullName?: string;
  phone?: string;
  region?: string;
  currentPassword?: string;
  newPassword?: string;
}

// ── Driver API Service ────────────────────────────────────────────────────────

export const driverApi = {
  getDashboard(): Promise<DriverDashboardMetrics> {
    return apiFetch('/driver/dashboard');
  },

  getAvailableJobs(cargo?: string): Promise<DriverJob[]> {
    const qs = cargo ? `?cargo=${encodeURIComponent(cargo)}` : '';
    return apiFetch(`/driver/jobs${qs}`);
  },

  acceptJob(id: string): Promise<{ message: string; delivery: DriverJob }> {
    return apiFetch(`/driver/jobs/${id}/accept`, { method: 'POST' });
  },

  rejectJob(id: string): Promise<{ message: string }> {
    return apiFetch(`/driver/jobs/${id}/reject`, { method: 'POST' });
  },

  getActiveDelivery(): Promise<DriverJob | null> {
    return apiFetch('/driver/active');
  },

  updateStatus(id: string, status: 'EN_ROUTE' | 'DELIVERED'): Promise<{ message: string; delivery: DriverJob }> {
    return apiFetch(`/driver/active/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async uploadProofImage(id: string, file: File): Promise<{ message: string; delivery: DriverJob; proofImageUrl: string }> {
    const token = localStorage.getItem('agrimove_token');
    const formData = new FormData();
    formData.append('proofImage', file);

    const res = await fetch(`${BASE_URL}/driver/active/${id}/proof`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Proof upload failed');
    }

    return res.json();
  },

  getEarnings(period: 'weekly' | 'monthly' = 'weekly'): Promise<EarningsData> {
    return apiFetch(`/driver/earnings?period=${period}`);
  },

  getHistory(): Promise<DriverJob[]> {
    return apiFetch('/driver/history');
  },

  getNotifications(): Promise<ApiNotification[]> {
    return apiFetch('/driver/notifications');
  },

  markNotificationRead(id: string): Promise<ApiNotification> {
    return apiFetch(`/driver/notifications/${id}/read`, { method: 'PATCH' });
  },

  getProfile(): Promise<DriverProfile> {
    return apiFetch('/driver/profile');
  },

  updateProfile(payload: UpdateDriverProfilePayload): Promise<{ message: string; user: DriverProfile }> {
    return apiFetch('/driver/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  getComplaints(): Promise<DriverComplaint[]> {
    return apiFetch('/driver/complaints');
  },

  createComplaint(issue: string, priority: string = 'Medium'): Promise<{ message: string; complaint: DriverComplaint }> {
    return apiFetch('/driver/complaints', {
      method: 'POST',
      body: JSON.stringify({ issue, priority }),
    });
  },
};
