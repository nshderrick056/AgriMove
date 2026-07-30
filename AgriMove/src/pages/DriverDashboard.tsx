import { useState, useEffect } from "react";
import { Truck, MapPin, ArrowRight, Filter, Phone, Navigation, Loader2, AlertCircle, CheckCircle, Package, Search, X, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DashboardShell } from "../components/layout/DashboardShell";
import { MetricCard } from "../components/ui/MetricCard";
import { NotifBanner } from "../components/ui/NotifBanner";
import { Btn } from "../components/ui/Btn";
import { StatusPill } from "../components/ui/StatusPill";
import { Input } from "../components/ui/Input";
import { useDriverData } from "../hooks/useDriverData";
import { driverApi, type DriverJob } from "../services/driverApi";
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

function formatCost(cost: number | null, currency: string): string {
  if (cost == null) return "—";
  return `${currency} ${cost.toLocaleString()}`;
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

// ── Track Shipment (inline tracker) ───────────────────────────────────────────
function TrackShipmentView({
  activeJob,
  onUpdateStatus,
  onEnterDriveMode,
}: {
  activeJob: DriverJob | null;
  onUpdateStatus: (id: string, nextStatus: "EN_ROUTE" | "DELIVERED") => Promise<any>;
  onEnterDriveMode?: () => void;
}) {
  const [trackId, setTrackId] = useState(activeJob?.id ?? "");
  const [tracked, setTracked] = useState<DriverJob | null>(activeJob);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  async function handleTrack(targetId?: string) {
    const idToUse = targetId || trackId.trim();
    if (!idToUse) return;
    setTrackId(idToUse);
    setLoading(true);
    setError(null);
    try {
      const data = await driverApi.getActiveDelivery();
      if (data && data.id === idToUse) {
        setTracked(data);
      } else {
        setTracked(activeJob?.id === idToUse ? activeJob : null);
        if (!activeJob || activeJob.id !== idToUse) {
          setError("Delivery not found among active assignments");
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdvance() {
    if (!tracked) return;
    setActionLoading(true);
    try {
      const nextStatus = tracked.status === "ASSIGNED" ? "EN_ROUTE" : "DELIVERED";
      await onUpdateStatus(tracked.id, nextStatus);
      setTracked((prev) => (prev ? { ...prev, status: nextStatus } : null));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading(false);
    }
  }

  const job = tracked ?? activeJob;
  const isJobActive = activeJob && ["ASSIGNED", "EN_ROUTE"].includes(activeJob.status);

  return (
    <div className="space-y-4">
      {/* Search Input Bar FIRST */}
      <div className="flex gap-2 max-w-md">
        <input
          value={trackId}
          onChange={(e) => setTrackId(e.target.value)}
          className="flex-1 h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm"
          placeholder="Enter delivery ID…"
        />
        <Btn variant="primary" onClick={() => handleTrack()} disabled={loading}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Track"}
        </Btn>
      </div>

      {/* Quick Select card BELOW search input */}
      {isJobActive && (
        <div className="bg-white border border-[#D3EE98] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#72BF78] animate-pulse" />
            <h4 className="text-xs font-semibold text-[#3a7a3e] uppercase tracking-wide">
              Active Assignment Quick-Select
            </h4>
          </div>
          <button
            onClick={() => handleTrack(activeJob.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150 border text-left cursor-pointer ${
              trackId === activeJob.id
                ? "bg-[#3a7a3e] text-white border-[#3a7a3e] shadow-sm font-medium"
                : "bg-[#f8fdf8] text-[#333] border-[#D3EE98] hover:border-[#72BF78] hover:bg-[#edfae0]"
            }`}
          >
            <Package size={14} className={trackId === activeJob.id ? "text-[#D3EE98]" : "text-[#72BF78]"} />
            <div>
              <span className="font-mono font-medium block">{activeJob.id}</span>
              <span className={`text-[10px] block ${trackId === activeJob.id ? "text-white/80" : "text-[#777]"}`}>
                {activeJob.cargo} · {activeJob.weightKg}kg ({uiStatus(activeJob.status)})
              </span>
            </div>
          </button>
        </div>
      )}

      {error && <ErrorBanner msg={error} />}

      {job ? (
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl overflow-hidden">
          <DeliveryMap
            pickup={job.pickup}
            destination={job.destination}
            status={job.status}
            height="160px"
          />
          <div className="p-4">
            <div className="flex justify-between mb-2">
              <p className="font-medium text-[#333]">
                {job.id} · {job.cargo} · {job.weightKg} kg
              </p>
              <StatusPill status={uiStatus(job.status)} />
            </div>
            <p className="text-xs text-[#666] mb-3">Farmer: {job.farmer?.fullName ?? "—"} ({job.pickup})</p>
            <div className="flex flex-wrap gap-2 items-center">
              {job.status !== "DELIVERED" && (
                <Btn variant="primary" className="text-xs py-1.5" onClick={handleAdvance} disabled={actionLoading}>
                  {actionLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                  {job.status === "ASSIGNED" ? "Mark as picked up" : "Mark as delivered"}
                </Btn>
              )}
              {onEnterDriveMode && (
                <button
                  type="button"
                  onClick={onEnterDriveMode}
                  className="flex items-center gap-1.5 bg-[#3a7a3e] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#2a5c2e] transition-colors"
                >
                  <Truck size={14} /> Enter Drive Mode
                </button>
              )}
              {/* Direct phone contact */}
              <div className="flex items-center gap-1.5 text-xs text-[#3a7a3e] font-medium bg-[#edfae0] px-3 py-1.5 rounded-lg">
                <Phone size={13} />
                <span>Farmer Contact: {job.farmer?.fullName ?? "Farmer"} ({job.farmer?.phone ?? "+250 788 000 456"})</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#888]">No active shipment tracked.</p>
      )}
    </div>
  );
}

// ── Drive Mode ────────────────────────────────────────────────────────────────
function DriveModeView({
  activeJob,
  onExit,
  onUpdateStatus,
}: {
  activeJob: DriverJob | null;
  onExit: () => void;
  onUpdateStatus: (id: string, status: "EN_ROUTE" | "DELIVERED") => Promise<any>;
}) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live Geolocation State
  const [liveCoords, setLiveCoords] = useState<[number, number] | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [gpsActive, setGpsActive] = useState<boolean>(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsActive(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLiveCoords([lat, lng]);
        setGpsActive(true);
        if (pos.coords.heading != null && !isNaN(pos.coords.heading)) {
          setHeading(pos.coords.heading);
        }
      },
      (err) => {
        console.warn("Geolocation positioning error/fallback:", err.message);
        setGpsActive(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  async function handleStatusChange(nextStatus: "EN_ROUTE" | "DELIVERED") {
    if (!activeJob) return;
    setLoadingAction(nextStatus);
    setError(null);
    try {
      await onUpdateStatus(activeJob.id, nextStatus);
      if (nextStatus === "DELIVERED") {
        onExit();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="h-screen bg-[#3a7a3e] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#2a5c2e] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Truck className="text-[#FEFF9F]" size={20} />
            <span className="text-white font-medium text-lg">Drive Mode</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1b431e] px-2.5 py-1 rounded-full text-xs font-medium text-white border border-[#D3EE98]/30">
            <span className={`w-2 h-2 rounded-full ${gpsActive ? 'bg-[#72BF78] animate-pulse' : 'bg-amber-400'}`} />
            <span>{gpsActive ? 'Live GPS Pointing Active' : 'Simulated Route GPS'}</span>
          </div>
        </div>

        <button
          onClick={onExit}
          className="bg-[#D3EE98] text-[#3a7a3e] rounded-lg px-3.5 py-1.5 text-sm font-semibold hover:bg-[#c8e88c] transition-colors"
        >
          Exit drive mode
        </button>
      </div>

      {error && (
        <div className="mx-4 mt-2 p-2.5 bg-red-100 text-red-700 rounded-lg text-xs shrink-0">
          {error}
        </div>
      )}

      {/* Map fills all available remaining vertical space */}
      <div className="flex-1 h-full flex flex-col mx-4 my-3 rounded-xl overflow-hidden shadow-inner relative">
        {activeJob ? (
          <DeliveryMap
            pickup={activeJob.pickup}
            destination={activeJob.destination}
            status={activeJob.status}
            height="100%"
            driverLiveCoords={liveCoords}
            driverHeading={heading}
            isDriveMode={true}
          />
        ) : (
          <div className="bg-[#D3EE98] h-full flex items-center justify-center rounded-xl">
            <div className="text-center p-4">
              <Navigation size={40} className="text-[#3a7a3e] mx-auto mb-2" />
              <p className="text-[#3a7a3e] font-medium text-lg">No active trip assigned</p>
            </div>
          </div>
        )}
      </div>

      {/* Compact Bottom Action Bar — pinned to bottom without huge empty zone */}
      <div className="bg-[#2a5c2e] px-4 py-3 shrink-0 border-t border-[#D3EE98]/20 shadow-lg">
        {activeJob ? (
          <div className="max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-white/90 px-1">
              <span className="font-mono font-medium">{activeJob.id} · {activeJob.cargo} ({activeJob.weightKg} kg)</span>
              <span className="truncate max-w-[220px]">From: {activeJob.pickup} → To: {activeJob.destination}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={activeJob.status !== "ASSIGNED" || loadingAction != null}
                onClick={() => handleStatusChange("EN_ROUTE")}
                className="bg-[#A0D683] text-[#2a5c2e] rounded-xl font-medium text-base py-3.5 hover:bg-[#90c878] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loadingAction === "EN_ROUTE" && <Loader2 size={16} className="animate-spin" />}
                Mark as picked up
              </button>
              <button
                disabled={activeJob.status !== "EN_ROUTE" || loadingAction != null}
                onClick={() => handleStatusChange("DELIVERED")}
                className="bg-[#FEFF9F] text-[#3a7a3e] rounded-xl font-medium text-base py-3.5 hover:bg-[#eef088] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
              >
                {loadingAction === "DELIVERED" && <Loader2 size={16} className="animate-spin" />}
                Mark as delivered
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white/70 text-center text-sm py-1">Accept a delivery job to begin Drive Mode.</p>
        )}
      </div>
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
              placeholder="Provide details about payment, route, or cargo issue…"
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
  const [fullName,  setFullName]  = useState(profile?.fullName ?? "");
  const [phone,     setPhone]     = useState(profile?.phone    ?? "");
  const [region,    setRegion]    = useState(profile?.region   ?? "");
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
        <h3 className="font-medium text-[#333] mb-3">Driver profile</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Driver full name" />
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#666]">Email address</label>
            <input
              className="h-10 px-3 rounded-lg border border-[#e0e0e0] text-sm text-[#888] bg-[#f8f8f8] cursor-not-allowed"
              value={profile?.email ?? ""}
              disabled
            />
          </div>
          <Input label="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+250 788 000 000" />
          <Input label="Primary region" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Kigali, Northern Province" />
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

const DRIVER_SLUGS = ["dashboard", "jobs", "active", "earnings", "complaints", "history", "settings"];

import { useApp } from "../context/AppContext";

// ── Driver Pending Approval Screen Component ──────────────────────────────────
function DriverPendingApprovalScreen({
  profileName,
  profileEmail,
  onRefresh,
  onLogout,
}: {
  profileName?: string;
  profileEmail?: string;
  onRefresh: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f8fdf8] flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-3 border-b border-[#D3EE98]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3a7a3e] rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-xs">
            🚛
          </div>
          <span className="font-semibold text-lg text-[#3a7a3e]">AgriMove</span>
        </div>
        <div className="flex items-center gap-3">
          {profileEmail && <span className="text-xs text-[#666] hidden sm:inline">{profileEmail}</span>}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg border border-[#D3EE98] text-xs text-[#333] hover:bg-[#edfae0] transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-white border border-[#D3EE98] rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <Clock size={32} className="animate-pulse text-amber-600" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 bg-amber-100/90 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full border border-amber-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Pending Admin Approval
            </span>
            <h2 className="text-xl font-bold text-[#333] mt-1">Driver Application Under Review</h2>
            <p className="text-xs text-[#666] mt-2 leading-relaxed">
              Welcome{profileName ? `, ${profileName}` : ""}! Your driver registration is currently being verified by system administration. Portal access, job assignments, and drive mode will remain locked until your application is approved.
            </p>
          </div>

          <div className="bg-[#f8fdf8] border border-[#D3EE98] rounded-xl p-4 text-left text-xs space-y-2.5 text-[#444]">
            <p className="font-semibold text-[#3a7a3e] uppercase tracking-wider text-[10px]">Application Status Overview</p>
            <div className="flex items-start gap-2">
              <span className="text-[#72BF78] font-bold mt-0.5">✓</span>
              <span>Account Registration Submitted</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">⏳</span>
              <span>Admin Verification & Credential Review (In Progress)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-gray-400 font-bold mt-0.5">○</span>
              <span>Portal & Available Jobs Activation (Pending)</span>
            </div>
          </div>

          <div className="pt-2 space-y-2.5">
            <Btn variant="primary" className="w-full py-2.5 text-sm font-medium" onClick={onRefresh}>
              Refresh Application Status
            </Btn>
            <button
              onClick={onLogout}
              className="w-full text-xs text-[#666] hover:text-[#333] py-1.5 transition-colors"
            >
              Sign out & return to landing page
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#888] py-2">
        Need assistance? Contact support at <a href="mailto:support@agrimove.rw" className="text-[#3a7a3e] underline font-medium">support@agrimove.rw</a>
      </footer>
    </div>
  );
}

// ── Driver Dashboard Component ─────────────────────────────────────────────────
export function DriverDashboard() {
  const { user, logout } = useApp();
  const [activeItem, setActiveItem] = useHashTab(DRIVER_SLUGS);
  const [driveMode, setDriveMode] = useState(false);
  const [jobFilter, setJobFilter] = useState("ALL");
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [earningsPeriod, setEarningsPeriod] = useState<"weekly" | "monthly">("weekly");
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const {
    dashboard,
    availableJobs,
    activeDelivery,
    earnings,
    history,
    complaints,
    profile,
    acceptJob,
    updateStatus,
    updateProfile,
    createComplaint,
  } = useDriverData(earningsPeriod, jobFilter === "ALL" ? undefined : jobFilter);

  const isPendingDriver = user?.status === "Pending" || profile.data?.status === "Pending";

  if (isPendingDriver) {
    return (
      <DriverPendingApprovalScreen
        profileName={profile.data?.fullName || user?.fullName}
        profileEmail={profile.data?.email || user?.email}
        onRefresh={() => window.location.reload()}
        onLogout={logout}
      />
    );
  }

  const hasActiveDelivery = activeDelivery.data != null && ["ASSIGNED", "EN_ROUTE"].includes(activeDelivery.data.status);

  const handleAcceptJob = async (id: string) => {
    if (isPendingDriver) {
      alert("Your account is pending admin approval. You cannot accept jobs until approved.");
      return;
    }
    if (hasActiveDelivery) {
      alert(`You already have an active delivery in progress (${activeDelivery.data?.id}). Please complete your current active delivery before accepting another job.`);
      return;
    }
    setAcceptingId(id);
    try {
      await acceptJob(id);
      setDriveMode(true); // Automatically switch driver into Drive Mode to fulfill delivery!
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setAcceptingId(null);
    }
  };

  if (driveMode) {
    return (
      <DriveModeView
        activeJob={activeDelivery.data}
        onExit={() => setDriveMode(false)}
        onUpdateStatus={updateStatus}
      />
    );
  }

  const content = () => {
    switch (activeItem) {
      case 0: // Overview
        return (
          <>
            {isPendingDriver && (
              <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl mb-4 flex items-start gap-3 text-amber-900 shadow-xs animate-slide-down">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Driver Registration Pending Admin Approval</h4>
                  <p className="text-xs mt-0.5 text-amber-800 leading-relaxed">
                    Your driver account application is currently under review by system administration. You can explore the portal, but accepting jobs is locked until an administrator reviews and approves your account.
                  </p>
                </div>
              </div>
            )}

            {dashboard.data?.recentNotification && (
              <NotifBanner n={{ msg: dashboard.data.recentNotification.message, time: "Just now", type: "info" }} />
            )}

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <p className="text-xs text-[#888]">Driver portal · Dashboard</p>
                <h1 className="font-medium text-[#333] text-lg">
                  Ready to drive{profile.data?.fullName ? `, ${profile.data.fullName}` : ""}?
                </h1>
              </div>
              <Btn variant="primary" onClick={() => setDriveMode(true)}>
                <Truck size={15} /> Launch drive mode
              </Btn>
            </div>

            {dashboard.loading ? (
              <LoadingSpinner />
            ) : dashboard.error ? (
              <ErrorBanner msg={dashboard.error} />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <MetricCard label="Today's earnings"  value={formatCost(dashboard.data?.todayEarnings ?? 0, "RWF")} />
                <MetricCard label="Trips completed"   value={String(dashboard.data?.tripsCompletedThisMonth ?? 0)} sub="This month" />
                <MetricCard label="Available jobs"    value={String(dashboard.data?.availableJobsCount ?? 0)} />
                <MetricCard label="Driver rating"     value={String(dashboard.data?.driverRating ?? 4.9)} sub="Out of 5.0" />
              </div>
            )}

            {/* Active Delivery card if any */}
            {activeDelivery.data && (
              <div className="mb-6 bg-[#f8fdf8] border border-[#D3EE98] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#3a7a3e] uppercase tracking-wide">Active Assignment</span>
                  <StatusPill status={uiStatus(activeDelivery.data.status)} />
                </div>
                <p className="font-medium text-[#333]">
                  {activeDelivery.data.id} · {activeDelivery.data.cargo} ({activeDelivery.data.weightKg} kg)
                </p>
                <p className="text-xs text-[#666] mt-1">From: {activeDelivery.data.pickup} → To: {activeDelivery.data.destination}</p>
                
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  <Btn variant="primary" className="text-xs py-1" onClick={() => setDriveMode(true)}>
                    <Truck size={13} /> Start delivery in Drive Mode
                  </Btn>
                  <Btn variant="outline" className="text-xs py-1" onClick={() => setActiveItem(2)}>
                    View active delivery
                  </Btn>
                  {/* Direct contact phone number */}
                  <div className="flex items-center gap-1.5 text-xs text-[#3a7a3e] font-medium bg-[#edfae0] px-3 py-1.5 rounded-lg">
                    <Phone size={13} />
                    <span>Farmer Contact: {activeDelivery.data.farmer?.fullName ?? "Farmer"} ({activeDelivery.data.farmer?.phone ?? "+250 788 000 456"})</span>
                  </div>
                </div>
              </div>
            )}

            <h2 className="font-medium text-[#333] mb-3">Available jobs nearby</h2>
            {hasActiveDelivery && (
              <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl mb-4 flex items-center justify-between text-amber-900 text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <span>
                    You have an active delivery in progress (<strong>{activeDelivery.data?.id}</strong>). Complete it before accepting another job.
                  </span>
                </div>
                <Btn variant="primary" className="text-xs py-1 px-2.5 ml-2 whitespace-nowrap" onClick={() => setDriveMode(true)}>
                  Go to Drive Mode →
                </Btn>
              </div>
            )}
            {availableJobs.loading ? (
              <LoadingSpinner />
            ) : availableJobs.error ? (
              <ErrorBanner msg={availableJobs.error} />
            ) : (
              <JobsTable rows={availableJobs.data?.slice(0, 5) ?? []} onAccept={handleAcceptJob} acceptingId={acceptingId} hasActiveDelivery={hasActiveDelivery} />
            )}
          </>
        );

      case 1: // Available jobs
        {
          const filteredJobs = (availableJobs.data ?? []).filter((j) => {
            const q = jobSearchQuery.trim().toLowerCase();
            if (!q) return true;
            return (
              j.id.toLowerCase().includes(q) ||
              j.cargo.toLowerCase().includes(q) ||
              j.pickup.toLowerCase().includes(q) ||
              j.destination.toLowerCase().includes(q) ||
              (j.farmer?.fullName && j.farmer.fullName.toLowerCase().includes(q))
            );
          });

          return (
            <>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-medium text-[#333]">Available jobs</h2>
                  <span className="text-xs text-[#888]">({filteredJobs.length} available)</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                    <input
                      type="text"
                      value={jobSearchQuery}
                      onChange={(e) => setJobSearchQuery(e.target.value)}
                      placeholder="Search produce, route, ID..."
                      className="w-full h-9 pl-8 pr-7 rounded-lg border border-[#D3EE98] text-xs text-[#333] bg-white focus:outline-none focus:border-[#72BF78]"
                    />
                    {jobSearchQuery && (
                      <button onClick={() => setJobSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#333]">
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <Filter size={13} className="absolute left-2.5 text-[#888] pointer-events-none" />
                    <select
                      value={jobFilter}
                      onChange={(e) => setJobFilter(e.target.value)}
                      className="h-9 pl-7 pr-3 rounded-lg border border-[#D3EE98] text-xs text-[#333] bg-white focus:outline-none focus:border-[#72BF78]"
                    >
                      <option value="ALL">All produce</option>
                      <option value="Tomatoes">Tomatoes</option>
                      <option value="Potatoes">Potatoes</option>
                      <option value="Avocados">Avocados</option>
                    </select>
                  </div>
                </div>
              </div>

              {hasActiveDelivery && (
                <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-xl mb-4 flex items-center justify-between text-amber-900 text-xs shadow-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-600 shrink-0" />
                    <span>
                      You have an active delivery in progress (<strong>{activeDelivery.data?.id}</strong>). Complete it before accepting another job.
                    </span>
                  </div>
                  <Btn variant="primary" className="text-xs py-1 px-2.5 ml-2 whitespace-nowrap" onClick={() => setDriveMode(true)}>
                    Go to Drive Mode →
                  </Btn>
                </div>
              )}
              {availableJobs.loading ? (
                <LoadingSpinner />
              ) : availableJobs.error ? (
                <ErrorBanner msg={availableJobs.error} />
              ) : (
                <JobsTable rows={filteredJobs} onAccept={handleAcceptJob} acceptingId={acceptingId} hasActiveDelivery={hasActiveDelivery} />
              )}
            </>
          );
        }

      case 2: // Active delivery
        return (
          <TrackShipmentView
            activeJob={activeDelivery.data}
            onUpdateStatus={updateStatus}
            onEnterDriveMode={() => setDriveMode(true)}
          />
        );

      case 3: // Earnings
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-[#333]">Earnings & payouts</h2>
              <div className="flex gap-1 bg-[#f0f7eb] p-1 rounded-lg">
                {(["weekly", "monthly"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setEarningsPeriod(p)}
                    className={`px-3 py-1 rounded-md text-xs capitalize transition-colors ${
                      earningsPeriod === p ? "bg-[#3a7a3e] text-white font-medium" : "text-[#555] hover:text-[#333]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {earnings.loading ? (
              <LoadingSpinner />
            ) : earnings.error ? (
              <ErrorBanner msg={earnings.error} />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <MetricCard label="Total gross"  value={formatCost(earnings.data?.totalEarnings ?? 0, "RWF")} />
                  <MetricCard label="Platform fee" value={formatCost(earnings.data?.platformFee ?? 0, "RWF")} sub="10%" />
                  <MetricCard label="Net payout"   value={formatCost(earnings.data?.netEarnings ?? 0, "RWF")} />
                  <MetricCard label="Completed"    value={String(earnings.data?.completedCount ?? 0)} sub="Deliveries" />
                </div>

                <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-[#333] mb-4">Earnings chart ({earningsPeriod})</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={earnings.data?.chartData ?? []}>
                        <XAxis dataKey="name" stroke="#888" fontSize={11} />
                        <YAxis stroke="#888" fontSize={11} />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#72BF78" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </>
        );

      case 4: // Complaints
        return <ComplaintsView complaints={complaints.data ?? []} onCreateComplaint={createComplaint} />;

      case 5: // History
        {
          const filteredHistory = (history.data ?? []).filter((j) => {
            const q = jobSearchQuery.trim().toLowerCase();
            if (!q) return true;
            return (
              j.id.toLowerCase().includes(q) ||
              j.cargo.toLowerCase().includes(q) ||
              j.pickup.toLowerCase().includes(q) ||
              j.destination.toLowerCase().includes(q) ||
              (j.farmer?.fullName && j.farmer.fullName.toLowerCase().includes(q))
            );
          });

          return (
            <>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h2 className="font-medium text-[#333]">Completed delivery history ({filteredHistory.length})</h2>
                <div className="relative flex-1 max-w-xs">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#888] pointer-events-none" />
                  <input
                    type="text"
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    placeholder="Search history by produce, route, ID..."
                    className="w-full h-9 pl-8 pr-7 rounded-lg border border-[#D3EE98] text-xs text-[#333] bg-white focus:outline-none focus:border-[#72BF78]"
                  />
                  {jobSearchQuery && (
                    <button onClick={() => setJobSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#333]">
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
              {history.loading ? (
                <LoadingSpinner />
              ) : history.error ? (
                <ErrorBanner msg={history.error} />
              ) : (
                <JobsTable rows={filteredHistory} readOnly />
              )}
            </>
          );
        }

      case 6: // Settings
        return <SettingsView profile={profile.data} onSave={updateProfile} />;

      default:
        return null;
    }
  };

  return (
    <DashboardShell role="driver" activeItem={activeItem} setActiveItem={setActiveItem}>
      {content()}
    </DashboardShell>
  );
}

// ── Jobs Table Helper ────────────────────────────────────────────────────────
function JobsTable({
  rows,
  onAccept,
  acceptingId,
  readOnly,
  hasActiveDelivery,
}: {
  rows: DriverJob[];
  onAccept?: (id: string) => Promise<void>;
  acceptingId?: string | null;
  readOnly?: boolean;
  hasActiveDelivery?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-[#888] py-4 text-center">No jobs found matching your criteria.</p>;
  }

  return (
    <div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="bg-white border border-[#D3EE98] rounded-xl p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-medium text-[#3a7a3e]">{row.id}</span>
                <h4 className="font-semibold text-sm text-[#333]">{row.cargo} ({row.weightKg} kg)</h4>
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
                <span className="text-[#888] block text-[10px] uppercase font-medium">Est. Pay</span>
                <span className="font-semibold text-[#3a7a3e]">{formatCost(row.totalCost, row.currency)}</span>
              </div>
              <div>
                <span className="text-[#888] block text-[10px] uppercase font-medium">Farmer</span>
                <span className="font-medium text-[#333]">{row.farmer?.fullName ?? "—"}</span>
              </div>
            </div>

            {!readOnly && row.status === "PENDING" && onAccept && (
              <div className="pt-1">
                <Btn
                  variant={hasActiveDelivery ? "ghost" : "primary"}
                  className={`w-full text-xs py-1.5 ${hasActiveDelivery ? "opacity-60 cursor-not-allowed bg-gray-100 border-gray-300 text-gray-500" : ""}`}
                  onClick={() => onAccept(row.id)}
                  disabled={acceptingId === row.id || hasActiveDelivery}
                  title={hasActiveDelivery ? "Complete your active delivery before accepting another job" : undefined}
                >
                  {acceptingId === row.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : hasActiveDelivery ? (
                    "Active Job in Progress"
                  ) : (
                    "Accept job"
                  )}
                </Btn>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[#D3EE98]/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#f8fdf8] border-b border-[#D3EE98]/60">
              {["ID", "Produce", "Weight", "Pickup", "Destination", "Est. Pay", "Farmer", "Status", !readOnly ? "Action" : ""].filter(Boolean).map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-[11px] text-[#666] font-medium uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[#D3EE98]/30 hover:bg-[#f8fdf8] transition-colors">
                <td className="px-3 py-2.5 text-[#3a7a3e] font-medium whitespace-nowrap">{row.id}</td>
                <td className="px-3 py-2.5 text-[#333] whitespace-nowrap">{row.cargo}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.weightKg} kg</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.pickup}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.destination}</td>
                <td className="px-3 py-2.5 text-[#3a7a3e] font-medium whitespace-nowrap">{formatCost(row.totalCost, row.currency)}</td>
                <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.farmer?.fullName ?? "—"}</td>
                <td className="px-3 py-2.5 whitespace-nowrap"><StatusPill status={uiStatus(row.status)} /></td>
                {!readOnly && (
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    {row.status === "PENDING" && onAccept && (
                      <Btn
                        variant={hasActiveDelivery ? "ghost" : "primary"}
                        className={`text-xs py-1 px-3 ${hasActiveDelivery ? "opacity-60 cursor-not-allowed bg-gray-100 border border-gray-300 text-gray-500" : ""}`}
                        onClick={() => onAccept(row.id)}
                        disabled={acceptingId === row.id || hasActiveDelivery}
                        title={hasActiveDelivery ? "Complete your active delivery before accepting another job" : undefined}
                      >
                        {acceptingId === row.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : hasActiveDelivery ? (
                          "Active Job in Progress"
                        ) : (
                          "Accept job"
                        )}
                      </Btn>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
