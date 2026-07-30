import { useState } from "react";
import { Download, Loader2, AlertCircle, Navigation, CheckCircle, X } from "lucide-react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { MetricCard } from "../components/ui/MetricCard";
import { StatusPill } from "../components/ui/StatusPill";
import { Btn } from "../components/ui/Btn";
import { Input } from "../components/ui/Input";
import { useAdminData } from "../hooks/useAdminData";
import { adminApi, type AdminDelivery } from "../services/adminApi";
import type { DeliveryStatus } from "../data/mockData";
import { DeliveryMap } from "../components/ui/DeliveryMap";


// ── Helpers ───────────────────────────────────────────────────────────────────

function uiStatus(s: string): DeliveryStatus {
  const map: Record<string, DeliveryStatus> = {
    PENDING: "Pending",
    ASSIGNED: "Assigned",
    EN_ROUTE: "En route",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return map[s] ?? (s as DeliveryStatus);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col gap-2 py-6 items-center text-[#888] text-sm">
      <Loader2 size={20} className="animate-spin text-[#72BF78]" />
      <span>Loading…</span>
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 p-3 text-[#c62828] bg-[#fdecea] rounded-lg text-sm mb-4">
      <AlertCircle size={16} />
      <span>{msg}</span>
    </div>
  );
}

// ── Deliveries Table Helper ───────────────────────────────────────────────────
function DeliveriesTable({
  rows,
  onTrackDelivery,
  onCancelDelivery,
  onDeleteDelivery,
}: {
  rows: AdminDelivery[];
  onTrackDelivery?: (delivery: AdminDelivery) => void;
  onCancelDelivery?: (id: string) => Promise<any>;
  onDeleteDelivery?: (id: string) => Promise<any>;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (rows.length === 0) {
    return <p className="text-sm text-[#888] py-4">No deliveries found.</p>;
  }

  const handleCancel = async (id: string) => {
    if (!window.confirm(`Are you sure you want to cancel delivery request ${id}?`)) return;
    setLoadingId(id);
    try {
      if (onCancelDelivery) await onCancelDelivery(id);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete delivery request ${id}? This action cannot be undone.`)) return;
    setLoadingId(id);
    try {
      if (onDeleteDelivery) await onDeleteDelivery(id);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-[#D3EE98]/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f8fdf8] border-b border-[#D3EE98]/60">
            {["ID", "Cargo", "Weight", "Pickup", "Destination", "Farmer", "Driver", "Status", "Actions"].map((h) => (
              <th key={h} className="px-3 py-2.5 text-left text-[11px] text-[#666] font-medium uppercase tracking-wide whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-[#D3EE98]/30 hover:bg-[#f8fdf8]">
              <td className="px-3 py-2.5 whitespace-nowrap">
                {onTrackDelivery ? (
                  <button
                    onClick={() => onTrackDelivery(row)}
                    className="text-[#3a7a3e] font-mono font-medium hover:underline hover:text-[#2a5c2e] cursor-pointer flex items-center gap-1 group"
                    title="Click to track delivery"
                  >
                    <span>{row.id}</span>
                    <Navigation size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ) : (
                  <span className="text-[#3a7a3e] font-medium font-mono">{row.id}</span>
                )}
              </td>
              <td className="px-3 py-2.5 text-[#333] whitespace-nowrap">{row.cargo}</td>
              <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.weightKg} kg</td>
              <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.pickup}</td>
              <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.destination}</td>
              <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.farmer?.fullName ?? "—"}</td>
              <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.driver?.fullName ?? "—"}</td>
              <td className="px-3 py-2.5 whitespace-nowrap"><StatusPill status={uiStatus(row.status)} /></td>
              <td className="px-3 py-2.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  {row.status !== "CANCELLED" && row.status !== "DELIVERED" && onCancelDelivery && (
                    <button
                      disabled={loadingId === row.id}
                      onClick={() => handleCancel(row.id)}
                      className="px-2.5 py-1 bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                      title="Cancel delivery request"
                    >
                      {loadingId === row.id ? <Loader2 size={12} className="animate-spin" /> : "Cancel"}
                    </button>
                  )}
                  {onDeleteDelivery && (
                    <button
                      disabled={loadingId === row.id}
                      onClick={() => handleDelete(row.id)}
                      className="px-2.5 py-1 bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 rounded-md text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                      title="Delete delivery request"
                    >
                      {loadingId === row.id ? <Loader2 size={12} className="animate-spin" /> : "Delete"}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Admin Track Delivery Modal ─────────────────────────────────────────────────
function AdminTrackDeliveryModal({
  delivery,
  onClose,
  onCancelDelivery,
  onDeleteDelivery,
}: {
  delivery: AdminDelivery;
  onClose: () => void;
  onCancelDelivery?: (id: string) => Promise<any>;
  onDeleteDelivery?: (id: string) => Promise<any>;
}) {
  const [actionLoading, setActionLoading] = useState(false);

  const TIMELINE = [
    { label: "Request submitted",  statusThreshold: "PENDING" },
    { label: "Driver assigned",    statusThreshold: "ASSIGNED" },
    { label: "Cargo picked up",    statusThreshold: "EN_ROUTE" },
    { label: "En route to market", statusThreshold: "EN_ROUTE" },
    { label: "Delivered",          statusThreshold: "DELIVERED" },
  ];

  const ORDER: Record<string, number> = {
    PENDING: 0, ASSIGNED: 1, EN_ROUTE: 3, DELIVERED: 4, CANCELLED: -1,
  };

  const handleModalCancel = async () => {
    if (!window.confirm(`Are you sure you want to cancel delivery request ${delivery.id}?`)) return;
    setActionLoading(true);
    try {
      if (onCancelDelivery) await onCancelDelivery(delivery.id);
      onClose();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleModalDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete delivery request ${delivery.id}? This action cannot be undone.`)) return;
    setActionLoading(true);
    try {
      if (onDeleteDelivery) await onDeleteDelivery(delivery.id);
      onClose();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#D3EE98] w-full max-w-2xl overflow-hidden shadow-2xl space-y-0 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#2a5c2e] px-5 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-[#D3EE98]" />
            <span className="font-medium text-sm font-mono">Live Admin Tracker — {delivery.id}</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Live Mapbox map */}
          <DeliveryMap
            pickup={delivery.pickup}
            destination={delivery.destination}
            status={delivery.status}
            height="192px"
            className="rounded-xl"
          />

          {/* Info Card */}
          <div className="bg-[#f8fdf8] border border-[#D3EE98] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[#333] text-base">{delivery.cargo} ({delivery.weightKg} kg)</h3>
                <p className="text-xs text-[#666] mt-0.5">
                  Route: {delivery.pickup} → {delivery.destination}
                </p>
              </div>
              <StatusPill status={uiStatus(delivery.status)} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#D3EE98]/60">
              <div className="bg-white p-2.5 rounded-lg border border-[#D3EE98]/60">
                <span className="text-[#888] block text-[10px]">Farmer</span>
                <span className="font-medium text-[#333] block">{delivery.farmer?.fullName ?? "—"}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#D3EE98]/60">
                <span className="text-[#888] block text-[10px]">Driver</span>
                <span className="font-medium text-[#333] block">{delivery.driver?.fullName ?? "Unassigned"}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
            <p className="font-medium text-[#333] mb-3 text-xs uppercase tracking-wide text-[#3a7a3e]">Delivery Status Progress</p>
            <div className="space-y-3">
              {TIMELINE.map((step, i) => {
                const done = ORDER[delivery.status] >= ORDER[step.statusThreshold];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${done ? "bg-[#72BF78]" : "bg-[#e0e0e0]"}`}>
                      {done && <CheckCircle size={10} className="text-white" />}
                    </div>
                    <span className={`text-xs flex-1 ${done ? "text-[#333] font-medium" : "text-[#aaa]"}`}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#f8fdf8] px-5 py-3 border-t border-[#D3EE98] flex items-center justify-between">
          <div className="flex gap-2">
            {delivery.status !== "CANCELLED" && delivery.status !== "DELIVERED" && onCancelDelivery && (
              <button
                disabled={actionLoading}
                onClick={handleModalCancel}
                className="px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {actionLoading ? <Loader2 size={12} className="animate-spin" /> : "Cancel Request"}
              </button>
            )}
            {onDeleteDelivery && (
              <button
                disabled={actionLoading}
                onClick={handleModalDelete}
                className="px-3 py-1.5 bg-red-50 border border-red-300 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {actionLoading ? <Loader2 size={12} className="animate-spin" /> : "Delete Request"}
              </button>
            )}
          </div>
          <Btn variant="primary" onClick={onClose}>Close tracker</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsView({
  profile,
  onSave,
}: {
  profile: { fullName: string; phone: string | null; email: string; region: string | null } | null;
  onSave: (payload: {
    fullName?: string;
    phone?: string;
    region?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(profile?.fullName ?? "admin");
  const [phone, setPhone] = useState(profile?.phone ?? "+250 788 000 000");
  const [region, setRegion] = useState(profile?.region ?? "Kigali, Rwanda");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setMsg(null);
    setError(null);
    if (newPw && newPw !== confirmPw) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        fullName: fullName || undefined,
        phone: phone || undefined,
        region: region || undefined,
        currentPassword: currentPw || undefined,
        newPassword: newPw || undefined,
      });
      setMsg("System settings updated successfully");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h3 className="font-medium text-[#333] mb-3">System settings</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Admin name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="admin" />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#666]">Email address</label>
            <input
              className="h-10 px-3 rounded-lg border border-[#e0e0e0] text-sm text-[#888] bg-[#f8f8f8] cursor-not-allowed"
              value={profile?.email ?? "admin@agrimove.com"}
              disabled
            />
          </div>
          <Input label="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250 788 000 000" />
          <Input label="Region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Kigali, Rwanda" />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-[#333] mb-3">Change admin password</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Current password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} type="password" placeholder="••••••••" />
          <Input label="New password" value={newPw} onChange={(e) => setNewPw(e.target.value)} type="password" placeholder="••••••••" />
          <Input label="Confirm new password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} type="password" placeholder="••••••••" />
        </div>
      </div>

      {msg && <div className="text-sm text-[#2e7d32] bg-[#e8f5e9] rounded-lg px-3 py-2">{msg}</div>}
      {error && <div className="text-sm text-[#c62828] bg-[#fdecea] rounded-lg px-3 py-2">{error}</div>}

      <Btn variant="primary" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
        Save changes
      </Btn>
    </div>
  );
}

import { useHashTab } from "../hooks/useHashTab";

const ADMIN_SLUGS = ["overview", "users", "deliveries", "active-deliveries", "reports", "complaints", "logs", "settings"];

// ── Admin Dashboard Component ──────────────────────────────────────────────────
export function AdminDashboard() {
  const [activeItem, setActiveItem] = useHashTab(ADMIN_SLUGS);
  const [userFilter, setUserFilter] = useState("All");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [trackingDelivery, setTrackingDelivery] = useState<AdminDelivery | null>(null);

  // Reports state
  const [reportType, setReportType] = useState("Delivery summary");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [reportExporting, setReportExporting] = useState(false);

  const {
    dashboard,
    users,
    deliveries,
    complaints,
    logs,
    profile,
    toggleUserStatus,
    resolveComplaint,
    updateProfile,
    cancelDelivery,
    deleteDelivery,
  } = useAdminData(userFilter);

  async function handleToggleStatus(userId: string, currentStatus: "Active" | "Suspended") {
    setUpdatingUserId(userId);
    try {
      await toggleUserStatus(userId, currentStatus);
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleExportCsv() {
    setReportExporting(true);
    try {
      const blob = (await adminApi.generateReport(reportType, dateFrom || undefined, dateTo || undefined, "csv")) as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `agrimove_${reportType.toLowerCase().replace(/\s+/g, "_")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setReportExporting(false);
    }
  }

  const activeDeliveriesList = (deliveries.data ?? []).filter((d) =>
    ["PENDING", "ASSIGNED", "EN_ROUTE"].includes(d.status)
  );

  const content = () => {
    switch (activeItem) {
      // ── 0: Overview ────────────────────────────────────────────────────────
      case 0:
        return (
          <>
            <p className="text-xs text-[#888] mb-5">Admin panel · System overview</p>

            {dashboard.loading ? (
              <LoadingSpinner />
            ) : dashboard.error ? (
              <ErrorBanner msg={dashboard.error} />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <MetricCard label="Total active users" value={String(dashboard.data?.activeUsersCount ?? 0)} />
                <MetricCard label="Deliveries today" value={String(dashboard.data?.deliveriesToday ?? 0)} />
                <MetricCard label="System uptime" value={dashboard.data?.systemUptime ?? "99.8%"} sub="Last 30 days" />
                <MetricCard label="Open complaints" value={String(dashboard.data?.openComplaintsCount ?? 0)} />
              </div>
            )}

            <h2 className="font-medium text-[#333] mb-3">Recent deliveries</h2>
            {deliveries.loading ? (
              <LoadingSpinner />
            ) : deliveries.error ? (
              <ErrorBanner msg={deliveries.error} />
            ) : (
              <DeliveriesTable
                rows={deliveries.data?.slice(0, 5) ?? []}
                onTrackDelivery={setTrackingDelivery}
                onCancelDelivery={cancelDelivery}
                onDeleteDelivery={deleteDelivery}
              />
            )}
          </>
        );

      // ── 1: User Management ──────────────────────────────────────────────────
      case 1:
        return (
          <>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-medium text-[#333]">User management</h2>
              <div className="flex gap-1">
                {["All", "Farmer", "Driver"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setUserFilter(f)}
                    className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                      userFilter === f ? "bg-[#D3EE98] text-[#3a7a3e] font-medium" : "text-[#666] hover:bg-[#f0f0f0]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {users.loading ? (
              <LoadingSpinner />
            ) : users.error ? (
              <ErrorBanner msg={users.error} />
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#D3EE98]/60">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f8fdf8] border-b border-[#D3EE98]/60">
                      {["Name", "Email", "Role", "Phone", "Region", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-3 py-2.5 text-left text-[11px] text-[#666] font-medium uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.data?.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 text-center text-[#888] text-sm">No users found.</td>
                      </tr>
                    ) : (
                      users.data?.map((u) => (
                        <tr key={u.id} className="border-b border-[#D3EE98]/30 hover:bg-[#f8fdf8] transition-colors">
                          <td className="px-3 py-2.5 font-medium text-[#333] whitespace-nowrap">{u.fullName}</td>
                          <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{u.email}</td>
                          <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{u.role}</td>
                          <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{u.phone ?? "—"}</td>
                          <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{u.region ?? "—"}</td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <StatusPill status={u.status === "Active" ? "Delivered" : "Cancelled"} />
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            {u.role !== "ADMIN" && (
                              <Btn
                                variant={u.status === "Active" ? "danger" : "primary"}
                                className="text-xs py-0.5 px-2.5"
                                onClick={() => handleToggleStatus(u.id, u.status)}
                                disabled={updatingUserId === u.id}
                              >
                                {updatingUserId === u.id ? <Loader2 size={12} className="animate-spin" /> : u.status === "Active" ? "Suspend" : "Restore"}
                              </Btn>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        );

      // ── 2: All Deliveries ───────────────────────────────────────────────────
      case 2:
        return (
          <>
            <h2 className="font-medium text-[#333] mb-3">All deliveries</h2>
            {deliveries.loading ? (
              <LoadingSpinner />
            ) : deliveries.error ? (
              <ErrorBanner msg={deliveries.error} />
            ) : (
              <DeliveriesTable
                rows={deliveries.data ?? []}
                onTrackDelivery={setTrackingDelivery}
                onCancelDelivery={cancelDelivery}
                onDeleteDelivery={deleteDelivery}
              />
            )}
          </>
        );

      // ── 3: Active Deliveries ────────────────────────────────────────────────
      case 3:
        return (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-[#333]">Active deliveries</h2>
              <span className="text-xs text-[#3a7a3e] font-medium bg-[#edfae0] px-2.5 py-1 rounded-lg">
                {activeDeliveriesList.length} active in system (click ID to track)
              </span>
            </div>
            {deliveries.loading ? (
              <LoadingSpinner />
            ) : deliveries.error ? (
              <ErrorBanner msg={deliveries.error} />
            ) : (
              <DeliveriesTable
                rows={activeDeliveriesList}
                onTrackDelivery={setTrackingDelivery}
                onCancelDelivery={cancelDelivery}
                onDeleteDelivery={deleteDelivery}
              />
            )}
          </>
        );

      // ── 4: Reports ─────────────────────────────────────────────────────────
      case 4:
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Reports</h2>
            <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-[#333] mb-3">Generate report</p>
              <div className="flex flex-wrap gap-3 mb-4">
                <Input label="Date from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <Input label="Date to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                <div className="flex flex-col gap-1">
                  <label htmlFor="report-type" className="text-xs text-[#666]">Report type</label>
                  <select
                    id="report-type"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm text-[#333] bg-white"
                  >
                    <option>Delivery summary</option>
                    <option>Route efficiency</option>
                    <option>User activity</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn variant="primary" onClick={handleExportCsv} disabled={reportExporting}>
                  {reportExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                  Export CSV
                </Btn>
              </div>
            </div>

            <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
              <p className="text-sm font-medium text-[#333] mb-3">Recent report downloads</p>
              {[
                { name: "Delivery summary — July 2026", date: "26/07/2026", type: "CSV" },
                { name: "User activity — July 2026", date: "25/07/2026", type: "CSV" },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between py-2.5 border-b border-[#D3EE98]/40 last:border-0">
                  <div>
                    <p className="text-sm text-[#333]">{r.name}</p>
                    <p className="text-xs text-[#888]">{r.date}</p>
                  </div>
                  <Btn variant="ghost" className="text-xs py-1 px-2.5" onClick={handleExportCsv}>
                    <Download size={11} /> {r.type}
                  </Btn>
                </div>
              ))}
            </div>
          </>
        );

      // ── 5: Complaints ───────────────────────────────────────────────────────
      case 5:
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Complaints</h2>
            {complaints.loading ? (
              <LoadingSpinner />
            ) : complaints.error ? (
              <ErrorBanner msg={complaints.error} />
            ) : complaints.data?.length === 0 ? (
              <p className="text-sm text-[#888]">No open complaints.</p>
            ) : (
              <div className="space-y-2">
                {complaints.data?.map((c) => (
                  <div key={c.id} className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-medium text-[#3a7a3e]">{c.id}</span>
                        <StatusPill status={c.priority as any} />
                        {c.resolved && <StatusPill status="Delivered" />}
                      </div>
                      <p className="text-sm text-[#333]">{c.user?.fullName ?? "System User"} ({c.user?.role ?? "User"})</p>
                      <p className="text-xs text-[#666] truncate">{c.issue}</p>
                    </div>
                    <Btn
                      variant={c.resolved ? "ghost" : "primary"}
                      className="text-xs flex-shrink-0"
                      onClick={() => resolveComplaint(c.id)}
                    >
                      {c.resolved ? "Reopen" : "Mark resolved"}
                    </Btn>
                  </div>
                ))}
              </div>
            )}
          </>
        );

      // ── 6: System Logs ──────────────────────────────────────────────────────
      case 6:
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">System logs</h2>
            {logs.loading ? (
              <LoadingSpinner />
            ) : logs.error ? (
              <ErrorBanner msg={logs.error} />
            ) : (
              <div className="bg-[#1e293b] text-[#f8fafc] border border-slate-700 rounded-xl p-4 font-mono text-xs max-h-96 overflow-y-auto space-y-2 shadow-inner">
                {logs.data?.length === 0 ? (
                  <p className="text-slate-400">No system logs recorded yet.</p>
                ) : (
                  logs.data?.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 py-1 border-b border-slate-800 last:border-0">
                      <span className="text-slate-500 whitespace-nowrap">{formatDate(log.createdAt)}</span>
                      <span
                        className={`font-bold flex-shrink-0 w-12 ${
                          log.level === "ERROR" ? "text-red-400" :
                          log.level === "WARN"  ? "text-amber-400" :
                          "text-emerald-400"
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-slate-300">{log.msg}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        );

      // ── 7: Settings ─────────────────────────────────────────────────────────
      case 7:
        return <SettingsView profile={profile.data} onSave={updateProfile} />;

      default:
        return null;
    }
  };

  return (
    <DashboardShell role="admin" activeItem={activeItem} setActiveItem={setActiveItem}>
      {content()}

      {/* Admin Track Delivery Modal */}
      {trackingDelivery && (
        <AdminTrackDeliveryModal
          delivery={trackingDelivery}
          onClose={() => setTrackingDelivery(null)}
          onCancelDelivery={cancelDelivery}
          onDeleteDelivery={deleteDelivery}
        />
      )}
    </DashboardShell>
  );
}
