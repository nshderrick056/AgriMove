import { useState } from "react";
import { CheckCircle, Plus, Filter, Navigation, Phone, X } from "lucide-react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { MetricCard } from "../components/ui/MetricCard";
import { DeliveriesTable } from "../components/ui/DeliveriesTable";
import { NotifBanner } from "../components/ui/NotifBanner";
import { Btn } from "../components/ui/Btn";
import { Input } from "../components/ui/Input";
import { StatusPill } from "../components/ui/StatusPill";
import { deliveries, historyDeliveries, notifications } from "../data/mockData";

// ── Shared: Track Shipment ─────────────────────────────────────────────────────
function TrackShipmentView() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 max-w-md">
        <input
          defaultValue="AGR-0041"
          className="flex-1 h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm"
          placeholder="Enter delivery ID…"
        />
        <Btn variant="primary">Track</Btn>
      </div>

      <div className="bg-white border border-[#D3EE98]/80 rounded-xl overflow-hidden">
        <div className="bg-[#D3EE98] h-48 relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 192" fill="none">
            <line x1="150" y1="0"   x2="150" y2="192" stroke="#A0D683" strokeWidth="0.5" />
            <line x1="300" y1="0"   x2="300" y2="192" stroke="#A0D683" strokeWidth="0.5" />
            <line x1="450" y1="0"   x2="450" y2="192" stroke="#A0D683" strokeWidth="0.5" />
            <line x1="0"   y1="96"  x2="600" y2="96"  stroke="#A0D683" strokeWidth="0.5" />
            <path d="M 60 155 C 120 155 150 55 300 55 C 420 55 470 120 540 120"
              stroke="#3a7a3e" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            <circle cx="60"  cy="155" r="7" fill="#72BF78" />
            <circle cx="60"  cy="155" r="12" fill="#72BF78" fillOpacity="0.25" />
            <circle cx="540" cy="120" r="7" fill="#2a5c2e" />
            <circle cx="540" cy="120" r="12" fill="#2a5c2e" fillOpacity="0.2" />
            <circle cx="310" cy="55"  r="7" fill="#FEFF9F" stroke="#d4ac00" strokeWidth="1.5" className="driver-dot" />
            <circle cx="310" cy="55"  r="12" fill="#FEFF9F" fillOpacity="0.4" />
          </svg>
          <div className="absolute bottom-3 left-3 flex gap-3 text-xs">
            <span className="flex items-center gap-1 bg-white/80 rounded-full px-2 py-0.5">
              <span className="w-2 h-2 rounded-full bg-[#72BF78] inline-block" />Nyagatare Farm
            </span>
            <span className="flex items-center gap-1 bg-white/80 rounded-full px-2 py-0.5">
              <span className="w-2 h-2 rounded-full bg-[#FEFF9F] border border-[#d4ac00] inline-block" />Driver
            </span>
            <span className="flex items-center gap-1 bg-white/80 rounded-full px-2 py-0.5">
              <span className="w-2 h-2 rounded-full bg-[#2a5c2e] inline-block" />Kigali Market
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-[#333]">AGR-0041 · Tomatoes · 480 kg</p>
              <p className="text-xs text-[#666] mt-0.5">Driver: Samuel K. · Est. arrival: 14:30 today</p>
            </div>
            <StatusPill status="En route" />
          </div>
          <div className="flex gap-6 text-xs text-[#555] mb-4">
            <div><p className="text-[#888] mb-0.5">From</p><p className="font-medium text-[#333]">Nyagatare Farm</p></div>
            <div><p className="text-[#888] mb-0.5">To</p><p className="font-medium text-[#333]">Kigali Market</p></div>
            <div><p className="text-[#888] mb-0.5">Distance</p><p className="font-medium text-[#333]">142 km</p></div>
            <div><p className="text-[#888] mb-0.5">ETA</p><p className="font-medium text-[#333]">14:30</p></div>
          </div>
          <Btn variant="ghost" className="text-xs py-1.5">
            <Phone size={12} /> Contact driver
          </Btn>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
        <p className="font-medium text-[#333] mb-3 text-sm">Delivery timeline</p>
        <div className="space-y-3">
          {[
            { label: "Request submitted",  time: "08:00", done: true },
            { label: "Driver assigned",    time: "08:15", done: true },
            { label: "Cargo picked up",    time: "09:30", done: true },
            { label: "En route to Kigali", time: "10:05", done: true },
            { label: "Estimated delivery", time: "14:30", done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${step.done ? "bg-[#72BF78]" : "bg-[#e0e0e0]"}`}>
                {step.done && <CheckCircle size={10} className="text-white" />}
              </div>
              <span className={`text-sm flex-1 ${step.done ? "text-[#333]" : "text-[#aaa]"}`}>{step.label}</span>
              <span className="text-xs text-[#888]">{step.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Shared: Settings ───────────────────────────────────────────────────────────
function SettingsView({ name, phone, email, region }: { name: string; phone: string; email: string; region: string }) {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h3 className="font-medium text-[#333] mb-3">Personal information</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Full name" placeholder={name} />
          <Input label="Phone number" type="tel" placeholder={phone} />
          <Input label="Email address" type="email" placeholder={email} />
          <Input label="Region" placeholder={region} />
        </div>
      </div>
      <div>
        <h3 className="font-medium text-[#333] mb-3">Change password</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Current password" type="password" placeholder="••••••••" />
          <Input label="New password" type="password" placeholder="••••••••" />
          <Input label="Confirm new password" type="password" placeholder="••••••••" />
        </div>
      </div>
      <div>
        <h3 className="font-medium text-[#333] mb-3">Language preference</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="lang-pref" className="text-xs text-[#666]">Preferred language</label>
            <select
              id="lang-pref"
              className="h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm text-[#333] bg-white"
            >
              <option value="en">English</option>
              <option value="rw">Kinyarwanda</option>
              <option value="sw">Swahili</option>
            </select>
          </div>
        </div>
      </div>
      <Btn variant="primary">Save changes</Btn>
    </div>
  );
}

// ── New Delivery Request Modal ─────────────────────────────────────────────────
function NewRequestModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-medium text-[#333]">New delivery request</h2>
          <button onClick={onClose} className="text-[#888] hover:text-[#555]" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <Input label="Cargo type" placeholder="e.g. Tomatoes" />
          <Input label="Weight (kg)" type="number" placeholder="e.g. 450" />
          <Input label="Pickup location" placeholder="e.g. Nyagatare Farm" />
          <Input label="Destination" placeholder="e.g. Kigali Market" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Preferred date" type="date" />
            <Input label="Preferred time" type="time" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#666]">Additional notes (optional)</label>
            <textarea
              className="px-3 py-2 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm h-16 resize-none bg-white"
              placeholder="Any special handling instructions…"
            />
          </div>
          <div className="bg-[#D3EE98] rounded-lg px-3 py-2 flex justify-between text-xs">
            <span className="text-[#3a7a3e]">Estimated cost</span>
            <span className="font-medium text-[#3a7a3e]">RWF 8,500</span>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <Btn variant="ghost" onClick={onClose} fullWidth>Cancel</Btn>
          <Btn variant="primary" onClick={onClose} fullWidth>Send request</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Farmer Dashboard ───────────────────────────────────────────────────────────
export function FarmerDashboard() {
  const [activeItem, setActiveItem] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const content = () => {
    switch (activeItem) {
      case 0: // Dashboard
        return (
          <>
            <p className="text-xs text-[#888] mb-5">Welcome back, Jean-Pierre Habimana · Eastern Province, Rwanda</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <MetricCard label="Active deliveries"    value="3" />
              <MetricCard label="Deliveries this month" value="18" sub="+12% from last month" />
              <MetricCard label="Estimated savings"    value="RWF 42,000" sub="vs. traditional transport" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-[#333]">Recent deliveries</h2>
              <Btn variant="primary" onClick={() => setShowModal(true)}>
                <Plus size={14} /> New request
              </Btn>
            </div>
            <DeliveriesTable rows={deliveries} />
            <div className="mt-6">
              <h2 className="font-medium text-[#333] mb-3">Notifications</h2>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((n, i) => <NotifBanner key={i} n={n} />)}
              </div>
            </div>
          </>
        );

      case 1: // My deliveries
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-[#333]">My deliveries</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 border border-[#D3EE98] rounded-lg px-3 h-9">
                  <Filter size={13} className="text-[#888]" />
                  <select className="bg-transparent focus:outline-none text-sm text-[#555]">
                    <option>All statuses</option>
                    <option>Pending</option>
                    <option>En route</option>
                    <option>Delivered</option>
                  </select>
                </div>
                <Btn variant="primary" onClick={() => setShowModal(true)}>
                  <Plus size={14} /> New request
                </Btn>
              </div>
            </div>
            <DeliveriesTable rows={deliveries} />
          </>
        );

      case 2: // New request (inline page)
        return (
          <div className="max-w-lg">
            <h2 className="font-medium text-[#333] mb-5">New delivery request</h2>
            <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-5 space-y-3">
              <Input label="Cargo type" placeholder="e.g. Tomatoes" />
              <Input label="Weight (kg)" type="number" placeholder="e.g. 450" />
              <Input label="Pickup location" placeholder="e.g. Nyagatare Farm" />
              <Input label="Destination" placeholder="e.g. Kigali Market" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Preferred date" type="date" />
                <Input label="Preferred time" type="time" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#666]">Additional notes (optional)</label>
                <textarea
                  className="px-3 py-2 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm h-16 resize-none bg-white"
                  placeholder="Any special handling instructions…"
                />
              </div>
              <div className="bg-[#D3EE98] rounded-lg px-3 py-2 flex justify-between text-xs">
                <span className="text-[#3a7a3e]">Estimated cost</span>
                <span className="font-medium text-[#3a7a3e]">RWF 8,500</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Btn variant="ghost" onClick={() => setActiveItem(0)} fullWidth>Cancel</Btn>
                <Btn variant="primary" fullWidth>Send request</Btn>
              </div>
            </div>
          </div>
        );

      case 3: return <TrackShipmentView />;

      case 4: // Notifications
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Notifications</h2>
            <div className="space-y-2">
              {notifications.map((n, i) => <NotifBanner key={i} n={n} />)}
            </div>
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
                    {["Date", "ID", "Cargo", "Destination", "Driver", "Cost", "Status"].map((h) => (
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
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.destination}</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.driver}</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{row.cost}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap"><StatusPill status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 6:
        return <SettingsView name="Jean-Pierre Habimana" phone="+250 788 123 456" email="jp@example.com" region="Eastern Province, Rwanda" />;

      default: return null;
    }
  };

  return (
    <DashboardShell role="farmer" activeItem={activeItem} setActiveItem={setActiveItem}>
      {content()}
      {showModal && <NewRequestModal onClose={() => setShowModal(false)} />}
    </DashboardShell>
  );
}
