import { useState, useEffect, useCallback } from "react";
import {
  farmerApi,
  type ApiDelivery,
  type ApiNotification,
  type ApiComplaint,
  type ApiProfile,
  type DashboardMetrics,
  type CreateDeliveryPayload,
  type UpdateProfilePayload,
} from "../services/farmerApi";

// ── Generic async state ───────────────────────────────────────────────────────
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

// ── Main hook ─────────────────────────────────────────────────────────────────

export function useFarmerData(deliveryStatusFilter?: string) {
  // ─ Dashboard metrics ────────────────────────────────────────────────────────
  const dashboardState = useAsync<DashboardMetrics>(() => farmerApi.getDashboard(), []);

  // ─ Deliveries ───────────────────────────────────────────────────────────────
  const deliveriesState = useAsync<ApiDelivery[]>(
    () => farmerApi.getDeliveries(deliveryStatusFilter),
    [deliveryStatusFilter]
  );

  // ─ History ──────────────────────────────────────────────────────────────────
  const historyState = useAsync<ApiDelivery[]>(() => farmerApi.getHistory(), []);

  // ─ Notifications ────────────────────────────────────────────────────────────
  const notificationsState = useAsync<ApiNotification[]>(
    () => farmerApi.getNotifications(),
    []
  );

  // ─ Complaints ───────────────────────────────────────────────────────────────
  const complaintsState = useAsync<ApiComplaint[]>(() => farmerApi.getComplaints(), []);

  // ─ Profile ──────────────────────────────────────────────────────────────────
  const profileState = useAsync<ApiProfile>(() => farmerApi.getProfile(), []);

  // ─ Mutations ────────────────────────────────────────────────────────────────

  const createDelivery = useCallback(
    async (payload: CreateDeliveryPayload): Promise<ApiDelivery> => {
      const { delivery } = await farmerApi.createDelivery(payload);
      // Refresh deliveries + dashboard after creation
      deliveriesState.refetch();
      dashboardState.refetch();
      notificationsState.refetch();
      return delivery;
    },
    [deliveriesState, dashboardState, notificationsState]
  );

  const cancelDelivery = useCallback(
    async (id: string): Promise<void> => {
      await farmerApi.cancelDelivery(id);
      // Optimistically remove from active list, then refresh
      deliveriesState.refetch();
      dashboardState.refetch();
      notificationsState.refetch();
    },
    [deliveriesState, dashboardState, notificationsState]
  );

  const markNotificationRead = useCallback(
    async (id: string): Promise<void> => {
      await farmerApi.markNotificationRead(id);
      notificationsState.refetch();
    },
    [notificationsState]
  );

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<ApiProfile> => {
      const { user } = await farmerApi.updateProfile(payload);
      profileState.refetch();
      return user;
    },
    [profileState]
  );

  const createComplaint = useCallback(
    async (issue: string, priority: string = "Medium"): Promise<ApiComplaint> => {
      const { complaint } = await farmerApi.createComplaint(issue, priority);
      complaintsState.refetch();
      return complaint;
    },
    [complaintsState]
  );

  return {
    // State
    dashboard: dashboardState,
    deliveries: deliveriesState,
    history: historyState,
    notifications: notificationsState,
    complaints: complaintsState,
    profile: profileState,

    // Mutations
    createDelivery,
    cancelDelivery,
    markNotificationRead,
    updateProfile,
    createComplaint,
  };
}
