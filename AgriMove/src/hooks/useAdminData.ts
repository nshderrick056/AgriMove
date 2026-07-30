import { useState, useEffect, useCallback } from "react";
import {
  adminApi,
  type AdminUser,
  type AdminDelivery,
  type AdminDashboardMetrics,
  type AdminComplaint,
  type SystemLog,
  type AdminProfile,
  type UpdateAdminProfilePayload,
} from "../services/adminApi";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}

export function useAdminData(userRoleFilter?: string) {
  const dashboardState = useAsync<AdminDashboardMetrics>(() => adminApi.getDashboard(), []);
  const usersState = useAsync<AdminUser[]>(() => adminApi.getUsers(userRoleFilter), [userRoleFilter]);
  const deliveriesState = useAsync<AdminDelivery[]>(() => adminApi.getDeliveries(), []);
  const complaintsState = useAsync<AdminComplaint[]>(() => adminApi.getComplaints(), []);
  const logsState = useAsync<SystemLog[]>(() => adminApi.getSystemLogs(), []);
  const profileState = useAsync<AdminProfile>(() => adminApi.getProfile(), []);

  const toggleUserStatus = useCallback(
    async (id: string, currentStatus: "Active" | "Suspended"): Promise<AdminUser> => {
      const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
      const { user } = await adminApi.updateUserStatus(id, nextStatus);
      usersState.refetch();
      dashboardState.refetch();
      return user;
    },
    [usersState, dashboardState]
  );

  const resolveComplaint = useCallback(
    async (id: string): Promise<AdminComplaint> => {
      const { complaint } = await adminApi.resolveComplaint(id);
      complaintsState.refetch();
      dashboardState.refetch();
      return complaint;
    },
    [complaintsState, dashboardState]
  );

  const updateProfile = useCallback(
    async (payload: UpdateAdminProfilePayload): Promise<AdminProfile> => {
      const { user } = await adminApi.updateProfile(payload);
      profileState.refetch();
      return user;
    },
    [profileState]
  );

  const cancelDelivery = useCallback(
    async (id: string): Promise<AdminDelivery> => {
      const { delivery } = await adminApi.cancelDelivery(id);
      deliveriesState.refetch();
      dashboardState.refetch();
      logsState.refetch();
      return delivery;
    },
    [deliveriesState, dashboardState, logsState]
  );

  const deleteDelivery = useCallback(
    async (id: string): Promise<void> => {
      await adminApi.deleteDelivery(id);
      deliveriesState.refetch();
      dashboardState.refetch();
      logsState.refetch();
    },
    [deliveriesState, dashboardState, logsState]
  );

  return {
    dashboard: dashboardState,
    users: usersState,
    deliveries: deliveriesState,
    complaints: complaintsState,
    logs: logsState,
    profile: profileState,

    toggleUserStatus,
    resolveComplaint,
    updateProfile,
    cancelDelivery,
    deleteDelivery,
  };
}
