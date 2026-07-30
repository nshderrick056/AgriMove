import { useState, useRef } from "react";
import { CheckCircle, Plus, Filter, Phone, X, Loader2, AlertCircle, Package, Route, Search } from "lucide-react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { MetricCard } from "../components/ui/MetricCard";
import { NotifBanner } from "../components/ui/NotifBanner";
import { Btn } from "../components/ui/Btn";
import { Input } from "../components/ui/Input";
import { StatusPill } from "../components/ui/StatusPill";
import { useFarmerData } from "../hooks/useFarmerData";
import { farmerApi, type ApiDelivery } from "../services/farmerApi";
import type { DeliveryStatus } from "../data/mockData";
import { DeliveryMap } from "../components/ui/DeliveryMap";
import { LocationPickerMap } from "../components/ui/LocationPickerMap";
import { calculateDeliveryCost } from "../utils/locationCoords";

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

function formatCost(cost: number | null, currency: string): string {
  if (cost == null) return "—";
  return `${currency} ${cost.toLocaleString()}`;
}

function formatWeight(kg: number): string {
  return `${kg} kg`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// ── Inline loading / error states ─────────────────────────────────────────────
function LoadingRows() {
  return (
    <div className="flex flex-col gap-2 py-6 items-center text-[#888] text-sm">
      <Loader2 size={20} className="animate-spin text-[#72BF78]" />
      <span>Loading…</span>
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 py-4 text-[#c62828] text-sm">
      <AlertCircle size={16} />
      <span>{msg}</span>
    </div>
  );
}

// ── Track Shipment ─────────────────────────────────────────────────────────────
function TrackShipmentView({ deliveries }: { deliveries: ApiDelivery[] }) {
  const [trackId, setTrackId] = useState("");
  const [tracked, setTracked] = useState<ApiDelivery | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  async function handleTrack(targetId?: string) {
    const idToUse = targetId || trackId.trim();
    if (!idToUse) return;
    setTrackId(idToUse);
    setTrackLoading(true);
    setTrackError(null);
    try {
      const data = await farmerApi.getDeliveryById(idToUse);
      setTracked(data);
    } catch (err) {
      setTrackError((err as Error).message);
      setTracked(null);
    } finally {
      setTrackLoading(false);
    }
  }

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

  const activeOnly = deliveries.filter((d) =>
    ["PENDING", "ASSIGNED", "EN_ROUTE"].includes(d.status)
  );

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="flex gap-2 max-w-md">
        <input
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          className="flex-1 h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm"
          placeholder="Enter delivery ID…"
        />
        <Btn variant="primary" onClick={() => handleTrack()} disabled={trackLoading}>
          {trackLoading ? <Loader2 size={14} className="animate-spin" /> : "Track"}
        </Btn>
      </div>

      {/* Clickable Active Delivery Quick-Select placed BELOW search */}
      {activeOnly.length > 0 && (
        <div className="bg-white border border-[#D3EE98] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#72BF78] animate-pulse" />
            <h4 className="text-xs font-semibold text-[#3a7a3e] uppercase tracking-wide">
              Active Deliveries Quick-Select
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeOnly.map((d) => {
              const active = trackId === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => handleTrack(d.id)}
                  className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 border text-left cursor-pointer ${
                    active
                      ? "bg-[#3a7a3e] text-white border-[#3a7a3e] shadow-sm font-medium"
                      : "bg-[#f8fdf8] text-[#333] border-[#D3EE98] hover:border-[#72BF78] hover:bg-[#edfae0]"
                  }`}
                >
                  <Package size={14} className={active ? "text-[#D3EE98]" : "text-[#72BF78]"} />
                  <div>
                    <span className="font-mono font-medium block">{d.id}</span>
                    <span className={`text-[10px] block ${active ? "text-white/80" : "text-[#777]"}`}>
                      {d.cargo} · {d.weightKg}kg ({uiStatus(d.status)})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {trackError && <ErrorMsg msg={trackError} />}

      {tracked && (
        <>
          <div className="bg-white border border-[#D3EE98]/80 rounded-xl overflow-hidden">
            {/* Live Mapbox map */}
            <DeliveryMap
              pickup={tracked.pickup}
              destination={tracked.destination}
              status={tracked.status}
              height="192px"
            />

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium text-[#333]">
                    {tracked.id} · {tracked.cargo} · {formatWeight(tracked.weightKg)}
                  </p>
                  <p className="text-xs text-[#666] mt-0.5">
                    Driver: {tracked.driver?.fullName ?? "Not assigned"}
                    {tracked.eta ? ` · Est. arrival: ${new Date(tracked.eta).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
                  </p>
                </div>
                <StatusPill status={uiStatus(tracked.status)} />
              </div>
              <div className="flex gap-6 text-xs text-[#555] mb-4">
                <div><p className="text-[#888] mb-0.5">From</p><p className="font-medium text-[#333]">{tracked.pickup}</p></div>
                <div><p className="text-[#888] mb-0.5">To</p><p className="font-medium text-[#333]">{tracked.destination}</p></div>
                <div><p className="text-[#888] mb-0.5">Cost</p><p className="font-medium text-[#333]">{formatCost(tracked.totalCost, tracked.currency)}</p></div>
              </div>

              {/* Direct phone number replacement */}
              {tracked.driver && (
                <div className="flex items-center gap-2 text-xs text-[#3a7a3e] font-medium bg-[#edfae0] px-3 py-2 rounded-lg w-fit">
                  <Phone size={13} />
                  <span>Driver Contact: {tracked.driver.fullName ?? "Driver"} ({tracked.driver.phone ?? "+250 788 123 456"})</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
            <p className="font-medium text-[#333] mb-3 text-sm">Delivery timeline</p>
            <div className="space-y-3">
              {TIMELINE.map((step, i) => {
                const done = ORDER[tracked.status] >= ORDER[step.statusThreshold];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${done ? "bg-[#72BF78]" : "bg-[#e0e0e0]"}`}>
                      {done && <CheckCircle size={10} className="text-white" />}
                    </div>
                    <span className={`text-sm flex-1 ${done ? "text-[#333]" : "text-[#aaa]"}`}>{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Complaints View ────────────────────────────────────────────────────────────
function ComplaintsView({
  complaints,
  onCreateComplaint,
}: {
  complaints: any[];
  onCreateComplaint: (issue: string, priority: string) => Promise<any>;
}) {
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!issue.trim()) return;
    setSubmitting(true);
    setMsg(null);
    try {
      await onCreateComplaint(issue.trim(), priority);
      setIssue("");
      setMsg("Complaint submitted successfully.");
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="font-medium text-[#333] mb-3">Submit a complaint</h3>
        <form onSubmit={handleSubmit} className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <div>
            <label className="text-xs text-[#666] mb-1 block">Describe the issue</label>
            <textarea
              required
              rows={3}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Provide details about the issue with your shipment or transport…"
              className="w-full p-2.5 rounded-lg border border-[#D3EE98] text-sm text-[#333] focus:outline-none focus:border-[#72BF78]"
            />
          </div>
          <div>
            <label className="text-xs text-[#666] mb-1 block">Priority level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="h-10 px-3 rounded-lg border border-[#D3EE98] text-sm text-[#333] bg-white"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {msg && <div className="text-xs text-[#2e7d32] bg-[#e8f5e9] rounded-lg p-2">{msg}</div>}

          <Btn variant="primary" type="submit" disabled={submitting}>
            {submitting ? <Loader2 size={14} className="animate-spin" /> : "Submit complaint"}
          </Btn>
        </form>
      </div>

      <div>
        <h3 className="font-medium text-[#333] mb-3">My complaints</h3>
        <div className="space-y-2">
          {complaints.length === 0 ? (
            <p className="text-xs text-[#888]">No complaints submitted yet.</p>
          ) : (
            complaints.map((c) => (
              <div key={c.id} className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-[#3a7a3e]">{c.id}</span>
                    <StatusPill status={c.priority as any} />
                    {c.resolved && <StatusPill status="Delivered" />}
                  </div>
                  <p className="text-sm text-[#333]">{c.issue}</p>
                  <p className="text-xs text-[#888] mt-1">{formatDate(c.createdAt)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.resolved ? "bg-[#e8f5e9] text-[#2e7d32]" : "bg-[#fff8e1] text-[#f57f17]"}`}>
                  {c.resolved ? "Resolved" : "Pending review"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Settings view ──────────────────────────────────────────────────────────────
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
  }) => Promise<any>;
}) {
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [phone,    setPhone]    = useState(profile?.phone    ?? "");
  const [region,   setRegion]   = useState(profile?.region   ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);

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
      setMsg("Changes saved successfully");
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
        <h3 className="font-medium text-[#333] mb-3">Personal information</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Full name"     value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#666]">Email address</label>
            <input
              className="h-10 px-3 rounded-lg border border-[#e0e0e0] text-sm text-[#888] bg-[#f8f8f8] cursor-not-allowed"
              value={profile?.email ?? ""}
              disabled
            />
          </div>
          <Input label="Phone number text" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250 788 000 000" />
          <Input label="Region / District" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Musanze, Northern Province" />
        </div>
      </div>

      <div>
        <h3 className="font-medium text-[#333] mb-3">Change password</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Current password"     value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} type="password" placeholder="••••••••" />
          <Input label="New password"         value={newPw}     onChange={(e) => setNewPw(e.target.value)}     type="password" placeholder="••••••••" />
          <Input label="Confirm new password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} type="password" placeholder="••••••••" />
        </div>
      </div>

      {msg   && <div className="text-sm text-[#2e7d32] bg-[#e8f5e9] rounded-lg px-3 py-2">{msg}</div>}
      {error && <div className="text-sm text-[#c62828] bg-[#fdecea] rounded-lg px-3 py-2">{error}</div>}

      <Btn variant="primary" onClick={handleSave} disabled={saving}>
        {saving ? <Loader2 size={14} className="animate-spin" /> : null}
        Save changes
      </Btn>
    </div>
  );
}

import { useHashTab } from "../hooks/useHashTab";

const FARMER_SLUGS = ["dashboard", "deliveries", "track", "complaints", "history", "settings"];

// ── Farmer Dashboard Component ─────────────────────────────────────────────────
export function FarmerDashboard() {
  const [activeItem, setActiveItem] = useHashTab(FARMER_SLUGS);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [cargo, setCargo] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    dashboard,
    deliveries,
    history,
    complaints,
    profile,
    createDelivery,
    cancelDelivery,
    updateProfile,
    createComplaint,
  } = useFarmerData(statusFilter);

  const filteredDeliveries = (deliveries.data ?? []).filter((d) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      d.id.toLowerCase().includes(q) ||
      d.cargo.toLowerCase().includes(q) ||
      d.pickup.toLowerCase().includes(q) ||
      d.destination.toLowerCase().includes(q) ||
      (d.driver?.fullName && d.driver.fullName.toLowerCase().includes(q))
    );
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const w = parseFloat(weightKg);
    if (isNaN(w) || w <= 0) {
      setFormError("Please enter a valid weight in kg.");
      return;
    }

    setSubmitting(true);
    try {
      await createDelivery({ cargo, weightKg: w, pickup, destination });
      setShowModal(false);
      setCargo(""); setWeightKg(""); setPickup(""); setDestination("");
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredHistory = (history.data ?? []).filter((d) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      d.id.toLowerCase().includes(q) ||
      d.cargo.toLowerCase().includes(q) ||
      d.pickup.toLowerCase().includes(q) ||
      d.destination.toLowerCase().includes(q) ||
      (d.driver?.fullName && d.driver.fullName.toLowerCase().includes(q))
    );
  });

  const content = () => {
    switch (activeItem) {
      case 0: // Overview
        return (
          <>
            {dashboard.data?.recentNotification && (
              <NotifBanner n={{ msg: dashboard.data.recentNotification.message, time: "Just now", type: "info" }} />
            )}

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <p className="text-xs text-[#888]">Farmer portal · Overview</p>
                <h1 className="font-medium text-[#333] text-lg">Welcome back!</h1>
              </div>
              <Btn variant="primary" onClick={() => setShowModal(true)}>
                <Plus size={15} /> New request
              </Btn>
            </div>

            {dashboard.loading ? (
              <LoadingRows />
            ) : dashboard.error ? (
              <ErrorMsg msg={dashboard.error} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <MetricCard label="Active deliveries"    value={String(dashboard.data?.activeCount ?? 0)} sub="In transit / pending" />
                <MetricCard label="Delivered this month" value={String(dashboard.data?.deliveredThisMonthCount ?? 0)} />
                <MetricCard label="Total spent"          value={formatCost(dashboard.data?.totalSpent ?? 0, "RWF")} />
                <MetricCard label="Next pickup"          value={dashboard.data?.nextPickupDate ? formatDate(dashboard.data.nextPickupDate) : "None scheduled"} />
              </div>
            )}

            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-medium text-[#333]">Recent deliveries</h2>
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recent deliveries..."
                  className="w-full h-9 pl-8 pr-7 rounded-lg border border-[#D3EE98] text-xs text-[#333] bg-white focus:outline-none focus:border-[#72BF78]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#333]">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {deliveries.loading ? (
              <LoadingRows />
            ) : deliveries.error ? (
              <ErrorMsg msg={deliveries.error} />
            ) : (
              <DeliveriesTable
                rows={filteredDeliveries.slice(0, 5)}
                onCancel={cancelDelivery}
              />
            )}
          </>
        );

      case 1: // My deliveries
        return (
          <>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-medium text-[#333]">My deliveries</h2>
                <span className="text-xs text-[#888]">
                  ({filteredDeliveries.length} found)
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search input bar */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ID, cargo, destination..."
                    className="w-full h-9 pl-8 pr-7 rounded-lg border border-[#D3EE98] text-xs text-[#333] bg-white focus:outline-none focus:border-[#72BF78]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#333]"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <Btn variant="primary" onClick={() => setShowModal(true)}>
                  <Plus size={15} /> New request
                </Btn>
                <div className="relative flex items-center">
                  <Filter size={13} className="absolute left-2.5 text-[#888] pointer-events-none" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 pl-7 pr-3 rounded-lg border border-[#D3EE98] text-xs text-[#333] bg-white focus:outline-none focus:border-[#72BF78]"
                  >
                    <option value="ALL">All statuses</option>
                    <option value="PENDING">Pending</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="EN_ROUTE">En route</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {deliveries.loading ? (
              <LoadingRows />
            ) : deliveries.error ? (
              <ErrorMsg msg={deliveries.error} />
            ) : (
              <DeliveriesTable
                rows={filteredDeliveries}
                onCancel={cancelDelivery}
              />
            )}
          </>
        );

      case 2: // Track shipment
        return <TrackShipmentView deliveries={deliveries.data ?? []} />;

      case 3: // Complaints
        return <ComplaintsView complaints={complaints.data ?? []} onCreateComplaint={createComplaint} />;

      case 4: // History
        return (
          <>
            <h2 className="font-medium text-[#333] mb-3">Delivery history</h2>
            {history.loading ? (
              <LoadingRows />
            ) : history.error ? (
              <ErrorMsg msg={history.error} />
            ) : history.data?.length === 0 ? (
              <p className="text-sm text-[#888] py-4">No completed or cancelled deliveries yet.</p>
            ) : (
              <DeliveriesTable rows={history.data ?? []} />
            )}
          </>
        );

      case 5: // Settings
        return <SettingsView profile={profile.data} onSave={updateProfile} />;

      default:
        return null;
    }
  };

  return (
    <DashboardShell role="farmer" activeItem={activeItem} setActiveItem={setActiveItem}>
      {content()}

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#D3EE98] w-full max-w-4xl p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-[#333] text-lg">New delivery request</h3>
                <p className="text-xs text-[#666]">Enter details or click on the map to set exact pickup and destination points</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#888] hover:text-[#333] p-1">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="text-xs text-[#c62828] bg-[#fdecea] p-2.5 rounded-lg">{formError}</div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input label="Produce / Cargo" placeholder="e.g. Tomatoes, Potatoes" value={cargo} onChange={(e) => setCargo(e.target.value)} required />
                <Input label="Estimated weight (kg)" type="number" placeholder="e.g. 500" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
              </div>

              {/* Interactive Widescreen Map Picker */}
              <LocationPickerMap
                pickup={pickup}
                destination={destination}
                onSelectPickup={(val) => setPickup(val)}
                onSelectDestination={(val) => setDestination(val)}
                height="360px"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input label="Pickup location" placeholder="e.g. Musanze Sector 4" value={pickup} onChange={(e) => setPickup(e.target.value)} required />
                <Input label="Destination" placeholder="e.g. Kigali Wholesale Market" value={destination} onChange={(e) => setDestination(e.target.value)} required />
              </div>

              {/* Dynamic Distance-Based Cost Estimation Card */}
              {(() => {
                const parsedWeight = parseFloat(weightKg) || 0;
                const costEst = calculateDeliveryCost(pickup, destination, parsedWeight);
                const hasValidLocations = Boolean(pickup.trim()) && Boolean(destination.trim());

                if (!hasValidLocations) return null;

                return (
                  <div className="bg-[#f8fdf8] border border-[#D3EE98] rounded-xl p-3 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#3a7a3e]">
                        <Route size={15} />
                        <span>Distance: {costEst.distanceKm} km</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#777] uppercase block font-medium">Est. Distance-Based Charge</span>
                        <span className="text-sm font-bold text-[#3a7a3e]">
                          RWF {costEst.totalCost.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-[#D3EE98]/60 text-[10px] text-[#555]">
                      <div className="bg-white p-1.5 rounded-md border border-[#e0e0e0] text-center">
                        <span className="block text-[#888] text-[9px]">Base Fee</span>
                        <span className="font-semibold text-[#333]">RWF 2,000</span>
                      </div>
                      <div className="bg-white p-1.5 rounded-md border border-[#D3EE98] text-center bg-[#edfae0]/50">
                        <span className="block text-[#3a7a3e] text-[9px] font-medium">Distance ({costEst.distanceKm} km)</span>
                        <span className="font-bold text-[#3a7a3e]">RWF {costEst.distanceFee.toLocaleString()}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded-md border border-[#e0e0e0] text-center">
                        <span className="block text-[#888] text-[9px]">Cargo ({parsedWeight} kg)</span>
                        <span className="font-semibold text-[#333]">RWF {costEst.weightFee.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2">
                <Btn variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Btn>
                <Btn variant="primary" type="submit" disabled={submitting}>
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : "Submit request"}
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// ── Deliveries Table Helper ───────────────────────────────────────────────────
function DeliveriesTable({
  rows,
  onCancel,
}: {
  rows: ApiDelivery[];
  onCancel?: (id: string) => Promise<void>;
}) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (rows.length === 0) {
    return <p className="text-sm text-[#888] py-4">No deliveries found.</p>;
  }

  const handleCancelClick = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this delivery request?")) return;
    setCancellingId(id);
    try {
      if (onCancel) await onCancel(id);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {rows.length === 0 ? (
          <div className="bg-white border border-[#D3EE98] rounded-xl p-4 text-center text-xs text-[#888]">
            No deliveries found.
          </div>
        ) : (
          rows.map((row) => (
            <div key={row.id} className="bg-white border border-[#D3EE98] rounded-xl p-4 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-medium text-[#3a7a3e]">{row.id}</span>
                  <h4 className="font-semibold text-sm text-[#333]">{row.cargo} ({formatWeight(row.weightKg)})</h4>
                </div>
                <StatusPill status={uiStatus(row.status)} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#555] bg-[#f8fdf8] p-2.5 rounded-lg border border-[#D3EE98]/50">
                <div>
                  <span className="text-[#888] block text-[10px] uppercase font-medium">Pickup</span>
                  <span className="truncate block font-medium text-[#333]">{row.pickup}</span>
                </div>
                <div>
                  <span className="text-[#888] block text-[10px] uppercase font-medium">Destination</span>
                  <span className="truncate block font-medium text-[#333]">{row.destination}</span>
                </div>
                <div>
                  <span className="text-[#888] block text-[10px] uppercase font-medium">Est. Cost</span>
                  <span className="font-semibold text-[#3a7a3e]">{formatCost(row.totalCost, row.currency)}</span>
                </div>
                <div>
                  <span className="text-[#888] block text-[10px] uppercase font-medium">Driver</span>
                  <span className="font-medium text-[#333]">{row.driver?.fullName ?? "Not assigned"}</span>
                </div>
              </div>

              {row.status === "PENDING" && onCancel && (
                <div className="pt-1">
                  <Btn
                    variant="ghost"
                    className="w-full text-xs text-red-600 hover:text-red-700 py-1.5 border border-red-200 bg-red-50/50"
                    onClick={() => handleCancelClick(row.id)}
                    disabled={cancellingId === row.id}
                  >
                    {cancellingId === row.id ? <Loader2 size={12} className="animate-spin" /> : "Cancel Request"}
                  </Btn>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#D3EE98]/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fdf8] border-b border-[#D3EE98]/60">
              {["ID", "Produce", "Weight", "Pickup", "Destination", "Est. Cost", "Driver", "Status", "Actions"].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-[11px] text-[#666] font-medium uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#D3EE98]/30 hover:bg-[#f8fdf8] transition-colors">
                <td className="px-3 py-2.5 text-[#3a7a3e] font-medium whitespace-nowrap">{row.id}</td>
                <td className="px-3 py-2.5 text-[#333] whitespace-nowrap">{row.cargo}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{formatWeight(row.weightKg)}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.pickup}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.destination}</td>
                <td className="px-3 py-2.5 text-[#555] font-medium whitespace-nowrap">{formatCost(row.totalCost, row.currency)}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.driver?.fullName ?? "—"}</td>
                <td className="px-3 py-2.5 whitespace-nowrap"><StatusPill status={uiStatus(row.status)} /></td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {row.status === "PENDING" && onCancel && (
                    <Btn
                      variant="ghost"
                      className="text-xs text-red-600 hover:text-red-700 py-1 px-2"
                      onClick={() => handleCancelClick(row.id)}
                      disabled={cancellingId === row.id}
                    >
                      {cancellingId === row.id ? <Loader2 size={12} className="animate-spin" /> : "Cancel"}
                    </Btn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
