import { useState } from "react";
import { Truck, MapPin, ArrowRight, Filter, Phone, Navigation, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DashboardShell } from "../components/layout/DashboardShell";
import { MetricCard } from "../components/ui/MetricCard";
import { NotifBanner } from "../components/ui/NotifBanner";
import { Btn } from "../components/ui/Btn";
import { StatusPill } from "../components/ui/StatusPill";
import { availableJobs, earningsData, earningsMonthlyData, historyDeliveries, notifications } from "../data/mockData";
import { Input } from "../components/ui/Input";

// ── Track Shipment (shared inline) ────────────────────────────────────────────
function TrackShipmentView() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 max-w-md">
        <input defaultValue="AGR-0041"
          className="flex-1 h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm"
          placeholder="Enter delivery ID…" />
        <Btn variant="primary">Track</Btn>
      </div>
      <div className="bg-white border border-[#D3EE98]/80 rounded-xl overflow-hidden">
        <div className="bg-[#D3EE98] h-40 flex items-center justify-center">
          <div className="text-center">
            <Navigation size={32} className="text-[#3a7a3e] mx-auto mb-1" />
            <p className="text-[#3a7a3e] text-sm font-medium">GPS Active · 14 km away</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <p className="font-medium text-[#333]">AGR-0041 · Tomatoes · 480 kg</p>
            <StatusPill status="En route" />
          </div>
          <div className="flex gap-2">
            <Btn variant="primary" className="text-xs py-1.5">Mark as delivered</Btn>
            <Btn variant="ghost" className="text-xs py-1.5"><Phone size={12} /> Contact farmer</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Drive Mode ────────────────────────────────────────────────────────────────
function DriveModeView({ onExit }: { onExit: () => void }) {
  return (
    <div className="min-h-screen bg-[#3a7a3e] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-[#2a5c2e]">
        <span className="text-white font-medium text-lg">Drive Mode</span>
        <button
          onClick={onExit}
          className="bg-[#D3EE98] text-[#3a7a3e] rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-[#c8e88c] transition-colors"
        >
          Exit drive mode
        </button>
      </div>
      {/* GPS map area */}
      <div className="bg-[#D3EE98] mx-4 mt-4 rounded-xl flex-1 flex items-center justify-center min-h-60">
        <div className="text-center">
          <Navigation size={40} className="text-[#3a7a3e] mx-auto mb-2" />
          <p className="text-[#3a7a3e] font-medium text-lg">GPS Active</p>
          <p className="text-[#555] text-sm mt-1">Kigali Market · 14 km away</p>
        </div>
      </div>
      <div className="p-4 pb-8 space-y-3">
        <p className="text-white/70 text-sm text-center">AGR-0041 · Tomatoes · 480 kg</p>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-[#A0D683] text-[#2a5c2e] rounded-xl font-medium text-lg py-5 min-h-[56px] hover:bg-[#90c878] transition-colors">
            Mark as picked up
          </button>
          <button className="bg-[#FEFF9F] text-[#3a7a3e] rounded-xl font-medium text-lg py-5 min-h-[56px] hover:bg-[#eef088] transition-colors">
            Mark as delivered
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Settings ─────────────────────────────────────────────────────────────────
function SettingsView() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h3 className="font-medium text-[#333] mb-3">Personal information</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Full name" placeholder="Samuel Kamanzi" />
          <Input label="Phone number" type="tel" placeholder="+250 788 891 234" />
          <Input label="Email address" type="email" placeholder="samuel@example.com" />
          <Input label="Region" placeholder="Kigali, Rwanda" />
        </div>
      </div>
      <Btn variant="primary">Save changes</Btn>
    </div>
  );
}

// ── Driver Dashboard ──────────────────────────────────────────────────────────
export function DriverDashboard() {
  const [activeItem, setActiveItem] = useState(0);
  const [driveMode, setDriveMode] = useState(false);
  const [earningsPeriod, setEarningsPeriod] = useState<"weekly" | "monthly">("weekly");

  if (driveMode) return <DriveModeView onExit={() => setDriveMode(false)} />;

  const content = () => {
    switch (activeItem) {
      case 0: // Dashboard
        return (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs text-[#888]">Welcome back, Samuel Kamanzi · Kigali</p>
              <button
                onClick={() => setDriveMode(true)}
                className="flex items-center gap-1.5 bg-[#3a7a3e] text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-[#2a5c2e] transition-colors min-h-[44px]"
              >
                <Truck size={14} /> Drive Mode
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <MetricCard label="Today's earnings"    value="RWF 24,000" />
              <MetricCard label="Deliveries this week" value="7" sub="+2 from last week" />
              <MetricCard label="Rating"              value="4.8 / 5.0" sub="Based on 142 deliveries" />
            </div>
            <h2 className="font-medium text-[#333] mb-3">Available requests</h2>
            <div className="space-y-3">
              {availableJobs.slice(0, 3).map((job) => (
                <div key={job.id} className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-[#3a7a3e]">{job.id}</p>
                      <p className="text-xs text-[#666] mt-0.5">{job.cargo} · {job.weight}</p>
                    </div>
                    <p className="text-sm font-medium text-[#2a5c2e]">{job.pay}</p>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 text-xs text-[#555] mb-3">
                    <MapPin size={11} className="text-[#72BF78]" />
                    <span>{job.pickup}</span>
                    <ArrowRight size={10} />
                    <span>{job.destination}</span>
                    <span className="ml-auto text-[#888]">{job.distance}</span>
                  </div>
                  <div className="flex gap-2">
                    <Btn variant="primary" className="flex-1 text-xs py-1.5">Accept</Btn>
                    <Btn variant="danger"  className="flex-1 text-xs py-1.5">Reject</Btn>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 1: // Available jobs
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-[#333]">Available jobs</h2>
              <div className="flex items-center gap-1.5 border border-[#D3EE98] rounded-lg px-3 h-9">
                <Filter size={13} className="text-[#888]" />
                <select className="bg-transparent focus:outline-none text-sm text-[#555]">
                  <option>All cargo types</option>
                  <option>Tomatoes</option>
                  <option>Maize</option>
                  <option>Cassava</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {availableJobs.map((job) => (
                <div key={job.id} className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-[#3a7a3e]">{job.id}</p>
                      <p className="text-xs text-[#666] mt-0.5">{job.cargo} · {job.weight}</p>
                    </div>
                    <p className="text-sm font-medium text-[#2a5c2e]">{job.pay}</p>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 text-xs text-[#555] mb-3">
                    <MapPin size={11} className="text-[#72BF78]" />
                    <span>{job.pickup}</span>
                    <ArrowRight size={10} />
                    <span>{job.destination}</span>
                    <span className="ml-auto text-[#888]">{job.distance}</span>
                  </div>
                  <div className="flex gap-2">
                    <Btn variant="primary" className="flex-1 text-xs py-1.5">Accept</Btn>
                    <Btn variant="danger"  className="flex-1 text-xs py-1.5">Reject</Btn>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 2: // Active delivery
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-[#333]">Active delivery</h2>
              <button
                onClick={() => setDriveMode(true)}
                className="flex items-center gap-1.5 bg-[#3a7a3e] text-white rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-[#2a5c2e] transition-colors"
              >
                <Truck size={14} /> Drive Mode
              </button>
            </div>
            <div className="bg-white border border-[#D3EE98]/80 rounded-xl overflow-hidden mb-4">
              <div className="bg-[#D3EE98] h-40 flex items-center justify-center">
                <div className="text-center">
                  <Navigation size={32} className="text-[#3a7a3e] mx-auto mb-1" />
                  <p className="text-[#3a7a3e] text-sm font-medium">GPS Active · 14 km away</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <p className="font-medium text-[#333]">AGR-0041 · Tomatoes</p>
                  <StatusPill status="En route" />
                </div>
                <p className="text-xs text-[#666] mb-3">480 kg · Jean-Pierre Habimana</p>
                <div className="flex gap-2 flex-wrap">
                  <Btn variant="primary" className="text-xs py-1.5">Mark as delivered</Btn>
                  <Btn variant="ghost"   className="text-xs py-1.5"><Phone size={12} /> Contact farmer</Btn>
                </div>
              </div>
            </div>
            <TrackShipmentView />
          </>
        );

      case 3: // Earnings
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-[#333]">Earnings</h2>
              <div className="flex gap-1 bg-[#f8fdf8] border border-[#D3EE98]/60 rounded-lg p-0.5">
                {(["weekly", "monthly"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setEarningsPeriod(p)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      earningsPeriod === p ? "bg-white text-[#3a7a3e] shadow-sm" : "text-[#888]"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <MetricCard label="This week"        value="RWF 166,500" />
              <MetricCard label="This month"       value="RWF 482,000" sub="+8% from last month" />
              <MetricCard label="Total deliveries" value="142" />
            </div>
            <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-[#333] mb-3">
                {earningsPeriod === "weekly" ? "This week" : "This month"}
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={earningsPeriod === "weekly" ? earningsData : earningsMonthlyData} barSize={20}>
                  <XAxis dataKey={earningsPeriod === "weekly" ? "day" : "week"} tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => [`RWF ${v.toLocaleString()}`, "Earnings"]} contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #D3EE98" }} />
                  <Bar dataKey="earnings" fill="#72BF78" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Notifications</h2>
            <div className="space-y-2">{notifications.map((n, i) => <NotifBanner key={i} n={n} />)}</div>
          </>
        );

      case 5: // History
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Delivery history</h2>
            <div className="overflow-x-auto rounded-xl border border-[#D3EE98]/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fdf8] border-b border-[#D3EE98]/60">
                    {["Date", "ID", "Cargo", "Route", "Distance", "Earnings", "Status"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-[11px] text-[#666] font-medium uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyDeliveries.map((row) => (
                    <tr key={row.id} className="border-b border-[#D3EE98]/30 hover:bg-[#f8fdf8]">
                      <td className="px-3 py-2.5 text-[#888] whitespace-nowrap">{row.date}</td>
                      <td className="px-3 py-2.5 text-[#3a7a3e] font-medium whitespace-nowrap">{row.id}</td>
                      <td className="px-3 py-2.5 text-[#333] whitespace-nowrap">{row.cargo}</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.pickup} → {row.destination}</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">—</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.cost}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap"><StatusPill status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 6: return <SettingsView />;
      default: return null;
    }
  };

  return (
    <DashboardShell role="driver" activeItem={activeItem} setActiveItem={setActiveItem}>
      {content()}
    </DashboardShell>
  );
}
