import { useState } from "react";
import { Filter, Navigation, CheckCircle } from "lucide-react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { MetricCard } from "../components/ui/MetricCard";
import { NotifBanner } from "../components/ui/NotifBanner";
import { Btn } from "../components/ui/Btn";
import { StatusPill } from "../components/ui/StatusPill";
import { Input } from "../components/ui/Input";
import { buyerIncoming, historyDeliveries, notifications } from "../data/mockData";

// ── Track Shipment (inline) ────────────────────────────────────────────────────
function TrackShipmentView() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 max-w-md">
        <input defaultValue="AGR-0041"
          className="flex-1 h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm"
          placeholder="Enter delivery ID…" />
        <Btn variant="primary">Track</Btn>
      </div>
      <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
        <p className="font-medium text-[#333] mb-2">AGR-0041 · Tomatoes · 480 kg</p>
        <StatusPill status="En route" />
        <p className="text-xs text-[#666] mt-2">Driver: Samuel K. · ETA: 14:30 today</p>
        <p className="text-xs text-[#888] mt-1">Nyagatare Farm → Kigali Market · 142 km</p>
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsView() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h3 className="font-medium text-[#333] mb-3">Personal information</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Full name" placeholder="Grace Wanjiku" />
          <Input label="Phone number" type="tel" placeholder="+254 789 123 456" />
          <Input label="Email address" type="email" placeholder="grace@example.com" />
          <Input label="Region" placeholder="Nairobi, Kenya" />
        </div>
      </div>
      <Btn variant="primary">Save changes</Btn>
    </div>
  );
}

// ── Buyer Dashboard ────────────────────────────────────────────────────────────
export function BuyerDashboard() {
  const [activeItem, setActiveItem] = useState(0);

  const IncomingCard = ({ d }: { d: typeof buyerIncoming[0] }) => (
    <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
      <div className="flex items-start justify-between mb-1.5">
        <div>
          <p className="text-sm font-medium text-[#3a7a3e]">{d.id}</p>
          <p className="text-xs text-[#666] mt-0.5">{d.farmer} · {d.cargo} · {d.qty}</p>
        </div>
        <StatusPill status={d.status} />
      </div>
      <div className="flex items-center gap-3 text-xs text-[#555] mb-3">
        <span>ETA: {d.eta}</span>
        <span className="text-[#ccc]">·</span>
        <span>Driver: {d.driver}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {d.status === "Delivered" && (
          <Btn variant="primary" className="text-xs py-1.5">
            <CheckCircle size={12} /> Confirm delivery
          </Btn>
        )}
        <Btn variant="ghost" className="text-xs py-1.5">
          <Navigation size={12} /> View on map
        </Btn>
      </div>
    </div>
  );

  const content = () => {
    switch (activeItem) {
      case 0: // Dashboard
        return (
          <>
            <p className="text-xs text-[#888] mb-5">Welcome back, Grace Wanjiku · Nairobi, Kenya</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <MetricCard label="Incoming shipments" value="2" />
              <MetricCard label="Orders this month"  value="11" sub="+3 from last month" />
              <MetricCard label="Total spent"        value="KES 184,500" sub="July 2026" />
            </div>
            <h2 className="font-medium text-[#333] mb-3">Incoming deliveries</h2>
            <div className="space-y-3">
              {buyerIncoming.map((d) => <IncomingCard key={d.id} d={d} />)}
            </div>
          </>
        );

      case 1: // Incoming deliveries
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-[#333]">Incoming deliveries</h2>
              <div className="flex items-center gap-1.5 border border-[#D3EE98] rounded-lg px-3 h-9">
                <Filter size={13} className="text-[#888]" />
                <select className="bg-transparent focus:outline-none text-sm text-[#555]">
                  <option>All statuses</option>
                  <option>En route</option>
                  <option>Assigned</option>
                  <option>Pending</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {buyerIncoming.map((d) => <IncomingCard key={d.id} d={d} />)}
            </div>
          </>
        );

      case 2: return <TrackShipmentView />;

      case 3: // Notifications + preferences
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Notifications</h2>
            <div className="space-y-2 mb-6">
              {notifications.map((n, i) => <NotifBanner key={i} n={n} />)}
            </div>
            <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
              <p className="font-medium text-[#333] text-sm mb-3">Notification preferences</p>
              <div className="space-y-3 mb-4">
                {[{ l: "Email alerts", on: true }, { l: "SMS alerts", on: true }].map((p) => (
                  <div key={p.l} className="flex items-center justify-between">
                    <span className="text-sm text-[#333]">{p.l}</span>
                    <div
                      className="w-10 h-5 rounded-full relative cursor-pointer transition-colors"
                      style={{ background: p.on ? "#72BF78" : "#ddd" }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all"
                        style={{ left: p.on ? "calc(100% - 1.25rem)" : "0.125rem" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#D3EE98]/60 pt-3">
                <p className="text-xs text-[#666] mb-2 font-medium">Notify me when:</p>
                {["Dispatched", "En route", "30 min from arrival", "Delivered"].map((t) => (
                  <label key={t} className="flex items-center gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#72BF78]" />
                    <span className="text-xs text-[#555]">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        );

      case 4: // History
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Delivery history</h2>
            <div className="overflow-x-auto rounded-xl border border-[#D3EE98]/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fdf8] border-b border-[#D3EE98]/60">
                    {["Date", "ID", "Cargo", "Qty", "Farmer", "Total cost", "Status"].map((h) => (
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
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.weight}</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">Jean-Pierre H.</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.cost}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap"><StatusPill status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 5: return <SettingsView />;
      default: return null;
    }
  };

  return (
    <DashboardShell role="buyer" activeItem={activeItem} setActiveItem={setActiveItem}>
      {content()}
    </DashboardShell>
  );
}
