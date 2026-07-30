import { useState, useEffect, useCallback } from "react";
import {
  driverApi,
  type DriverJob,
  type DriverDashboardMetrics,
  type EarningsData,
  type ApiNotification,
  type DriverComplaint,
  type DriverProfile,
  type UpdateDriverProfilePayload,
} from "../services/driverApi";

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

export function useDriverData(earningsPeriod: "weekly" | "monthly" = "weekly", jobCargoFilter?: string) {
  const dashboardState = useAsync<DriverDashboardMetrics>(() => driverApi.getDashboard(), []);
  const availableJobsState = useAsync<DriverJob[]>(() => driverApi.getAvailableJobs(jobCargoFilter), [jobCargoFilter]);
  const activeDeliveryState = useAsync<DriverJob | null>(() => driverApi.getActiveDelivery(), []);
  const earningsState = useAsync<EarningsData>(() => driverApi.getEarnings(earningsPeriod), [earningsPeriod]);
  const historyState = useAsync<DriverJob[]>(() => driverApi.getHistory(), []);
  const notificationsState = useAsync<ApiNotification[]>(() => driverApi.getNotifications(), []);
  const complaintsState = useAsync<DriverComplaint[]>(() => driverApi.getComplaints(), []);
  const profileState = useAsync<DriverProfile>(() => driverApi.getProfile(), []);

  const [rejectedIds, setRejectedIds] = useState<string[]>([]);

  const acceptJob = useCallback(
    async (id: string): Promise<DriverJob> => {
      const { delivery } = await driverApi.acceptJob(id);
      availableJobsState.refetch();
      activeDeliveryState.refetch();
      dashboardState.refetch();
      notificationsState.refetch();
      return delivery;
    },
    [availableJobsState, activeDeliveryState, dashboardState, notificationsState]
  );

  const rejectJob = useCallback(
    async (id: string): Promise<void> => {
      await driverApi.rejectJob(id);
      setRejectedIds((prev) => [...prev, id]);
      availableJobsState.refetch();
      notificationsState.refetch();
    },
    [availableJobsState, notificationsState]
  );

  const updateStatus = useCallback(
    async (id: string, status: "EN_ROUTE" | "DELIVERED"): Promise<DriverJob> => {
      const { delivery } = await driverApi.updateStatus(id, status);
      activeDeliveryState.refetch();
      dashboardState.refetch();
      earningsState.refetch();
      historyState.refetch();
      notificationsState.refetch();
      return delivery;
    },
    [activeDeliveryState, dashboardState, earningsState, historyState, notificationsState]
  );

  const markNotificationRead = useCallback(
    async (id: string): Promise<void> => {
      await driverApi.markNotificationRead(id);
      notificationsState.refetch();
    },
    [notificationsState]
  );

  const updateProfile = useCallback(
    async (payload: UpdateDriverProfilePayload): Promise<DriverProfile> => {
      const { user } = await driverApi.updateProfile(payload);
      profileState.refetch();
      return user;
    },
    [profileState]
  );

  const createComplaint = useCallback(
    async (issue: string, priority: string = "Medium"): Promise<DriverComplaint> => {
      const { complaint } = await driverApi.createComplaint(issue, priority);
      complaintsState.refetch();
      return complaint;
    },
    [complaintsState]
  );

  const filteredAvailableJobs = (availableJobsState.data ?? []).filter(
    (job) => !rejectedIds.includes(job.id)
  );

  return {
    dashboard: dashboardState,
    availableJobs: { ...availableJobsState, data: filteredAvailableJobs },
    activeDelivery: activeDeliveryState,
    earnings: earningsState,
    history: historyState,
    notifications: notificationsState,
    complaints: complaintsState,
    profile: profileState,

    acceptJob,
    rejectJob,
    updateStatus,
    markNotificationRead,
    updateProfile,
    createComplaint,
  };
}
