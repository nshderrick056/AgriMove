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

export interface AdminDelivery {
  id: string;
  cargo: string;
  weightKg: number;
  pickup: string;
  destination: string;
  status: 'PENDING' | 'ASSIGNED' | 'EN_ROUTE' | 'DELIVERED' | 'CANCELLED';
  eta: string | null;
  totalCost: number | null;
  currency: string;
  farmerId: string;
  farmer: { fullName: string } | null;
  driverId: string | null;
  driver: { fullName: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  region: string | null;
  role: 'FARMER' | 'TRANSPORTER' | 'ADMIN';
  status: 'Active' | 'Suspended';
  createdAt: string;
}

export interface AdminDashboardMetrics {
  activeUsersCount: number;
  deliveriesToday: number;
  systemUptime: string;
  openComplaintsCount: number;
  recentDeliveries: AdminDelivery[];
  admin: { fullName: string; email: string; region: string | null } | null;
}

export interface AdminComplaint {
  id: string;
  userId: string;
  user: { fullName: string; role: string } | null;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
  resolved: boolean;
  createdAt: string;
}

export interface SystemLog {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  msg: string;
  createdAt: string;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  region: string | null;
  role: string;
}

export interface UpdateAdminProfilePayload {
  fullName?: string;
  phone?: string;
  region?: string;
  currentPassword?: string;
  newPassword?: string;
}

// ── Admin API Service ─────────────────────────────────────────────────────────

export const adminApi = {
  getDashboard(): Promise<AdminDashboardMetrics> {
    return apiFetch('/admin/dashboard');
  },

  getUsers(role?: string): Promise<AdminUser[]> {
    const qs = role && role !== 'All' ? `?role=${encodeURIComponent(role)}` : '';
    return apiFetch(`/admin/users${qs}`);
  },

  updateUserStatus(id: string, status: 'Active' | 'Suspended'): Promise<{ message: string; user: AdminUser }> {
    return apiFetch(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getDeliveries(): Promise<AdminDelivery[]> {
    return apiFetch('/admin/deliveries');
  },

  cancelDelivery(id: string): Promise<{ message: string; delivery: AdminDelivery }> {
    return apiFetch(`/admin/deliveries/${id}/cancel`, { method: 'POST' });
  },

  deleteDelivery(id: string): Promise<{ message: string }> {
    return apiFetch(`/admin/deliveries/${id}`, { method: 'DELETE' });
  },

  generateReport(reportType: string, dateFrom?: string, dateTo?: string, format: 'json' | 'csv' = 'json') {
    if (format === 'csv') {
      const token = localStorage.getItem('agrimove_token');
      return fetch(`${BASE_URL}/admin/reports/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reportType, dateFrom, dateTo, format: 'csv' }),
      }).then((res) => res.blob());
    }

    return apiFetch<{ reportType: string; recordCount: number; deliveries: AdminDelivery[] }>(
      '/admin/reports/generate',
      {
        method: 'POST',
        body: JSON.stringify({ reportType, dateFrom, dateTo, format: 'json' }),
      }
    );
  },

  getComplaints(): Promise<AdminComplaint[]> {
    return apiFetch('/admin/complaints');
  },

  resolveComplaint(id: string): Promise<{ message: string; complaint: AdminComplaint }> {
    return apiFetch(`/admin/complaints/${id}/resolve`, { method: 'PATCH' });
  },

  getSystemLogs(): Promise<SystemLog[]> {
    return apiFetch('/admin/logs');
  },

  getProfile(): Promise<AdminProfile> {
    return apiFetch('/admin/profile');
  },

  updateProfile(payload: UpdateAdminProfilePayload): Promise<{ message: string; user: AdminProfile }> {
    return apiFetch('/admin/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};
