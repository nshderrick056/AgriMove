import { useState } from "react";
import { Download } from "lucide-react";
import { DashboardShell } from "../components/layout/DashboardShell";
import { MetricCard } from "../components/ui/MetricCard";
import { DeliveriesTable } from "../components/ui/DeliveriesTable";
import { StatusPill } from "../components/ui/StatusPill";
import { Btn } from "../components/ui/Btn";
import { Input } from "../components/ui/Input";
import { adminUsers, complaints, deliveries, systemLogs } from "../data/mockData";

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsView() {
  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h3 className="font-medium text-[#333] mb-3">System settings</h3>
        <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 space-y-3">
          <Input label="Admin name" placeholder="Admin User" />
          <Input label="Email address" type="email" placeholder="admin@agrimove.rw" />
          <Input label="Phone number" type="tel" placeholder="+250 788 000 001" />
          <Input label="Region" placeholder="Kigali, Rwanda" />
        </div>
      </div>
      <Btn variant="primary">Save changes</Btn>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [activeItem, setActiveItem] = useState(0);
  const [userFilter, setUserFilter] = useState("All");

  const content = () => {
    switch (activeItem) {
      case 0: // Overview
        return (
          <>
            <p className="text-xs text-[#888] mb-5">Admin panel · System overview</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <MetricCard label="Total active users"  value="1,284" sub="+23 this week" />
              <MetricCard label="Deliveries today"    value="47" />
              <MetricCard label="System uptime"       value="99.8%" sub="Last 30 days" />
              <MetricCard label="Open complaints"     value="5" sub="2 high priority" />
            </div>
            <h2 className="font-medium text-[#333] mb-3">Recent deliveries</h2>
            <DeliveriesTable rows={deliveries} />
          </>
        );

      case 1: // Users
        return (
          <>
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-medium text-[#333]">User management</h2>
              <div className="flex gap-1">
                {["All", "Farmer", "Driver", "Buyer"].map((f) => (
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
            <div className="overflow-x-auto rounded-xl border border-[#D3EE98]/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#f8fdf8] border-b border-[#D3EE98]/60">
                    {["Name", "Role", "Phone", "Region", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-[11px] text-[#666] font-medium uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(userFilter === "All" ? adminUsers : adminUsers.filter((u) => u.role === userFilter)).map((u, i) => (
                    <tr key={i} className="border-b border-[#D3EE98]/30 hover:bg-[#f8fdf8] transition-colors">
                      <td className="px-3 py-2.5 font-medium text-[#333] whitespace-nowrap">{u.name}</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{u.role}</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{u.phone}</td>
                      <td className="px-3 py-2.5 text-[#555] whitespace-nowrap">{u.region}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap"><StatusPill status={u.status} /></td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <div className="flex gap-1">
                          <Btn variant="ghost" className="text-xs py-0.5 px-2.5">Edit</Btn>
                          <Btn variant="danger" className="text-xs py-0.5 px-2.5">
                            {u.status === "Active" ? "Suspend" : "Restore"}
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      case 2: // All deliveries
        return (
          <>
            <h2 className="font-medium text-[#333] mb-3">All deliveries</h2>
            <DeliveriesTable rows={deliveries} />
          </>
        );

      case 3: // Reports
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Reports</h2>
            <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-[#333] mb-3">Generate report</p>
              <div className="flex flex-wrap gap-3 mb-4">
                <Input label="Date from" type="date" />
                <Input label="Date to" type="date" />
                <div className="flex flex-col gap-1">
                  <label htmlFor="report-type" className="text-xs text-[#666]">Report type</label>
                  <select
                    id="report-type"
                    className="h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm text-[#333] bg-white"
                  >
                    <option>Delivery summary</option>
                    <option>Route efficiency</option>
                    <option>User activity</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn variant="primary">Generate report</Btn>
                <Btn variant="outline"><Download size={13} /> Export PDF</Btn>
                <Btn variant="outline"><Download size={13} /> Export CSV</Btn>
              </div>
            </div>
            <div className="bg-white border border-[#D3EE98]/80 rounded-xl p-4">
              <p className="text-sm font-medium text-[#333] mb-3">Recent reports</p>
              {[
                { name: "Delivery summary — June 2026", date: "01/07/2026", type: "PDF" },
                { name: "Route efficiency — Q2 2026",   date: "30/06/2026", type: "CSV" },
                { name: "User activity — June 2026",    date: "30/06/2026", type: "PDF" },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between py-2.5 border-b border-[#D3EE98]/40 last:border-0">
                  <div>
                    <p className="text-sm text-[#333]">{r.name}</p>
                    <p className="text-xs text-[#888]">{r.date}</p>
                  </div>
                  <Btn variant="ghost" className="text-xs py-1 px-2.5">
                    <Download size={11} /> {r.type}
                  </Btn>
                </div>
              ))}
            </div>
          </>
        );

      case 4: // Complaints
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">Complaints</h2>
            <div className="space-y-2">
              {complaints.map((c) => (
                <div key={c.id} className="bg-white border border-[#D3EE98]/80 rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-medium text-[#3a7a3e]">{c.id}</span>
                      <StatusPill status={c.priority} />
                      {c.resolved && <StatusPill status="Resolved" />}
                    </div>
                    <p className="text-sm text-[#333]">{c.user}</p>
                    <p className="text-xs text-[#666] truncate">{c.issue}</p>
                  </div>
                  <Btn variant="ghost" className="text-xs flex-shrink-0">View thread</Btn>
                </div>
              ))}
            </div>
          </>
        );

      case 5: // System logs
        return (
          <>
            <h2 className="font-medium text-[#333] mb-4">System logs</h2>
            <div className="bg-white border border-[#D3EE98]/80 rounded-xl overflow-hidden">
              {systemLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-2.5 border-b border-[#D3EE98]/30 last:border-0 font-mono text-xs">
                  <span className="text-[#aaa] whitespace-nowrap flex-shrink-0">{log.time}</span>
                  <span
                    className={`font-medium flex-shrink-0 w-12 ${
                      log.level === "ERROR" ? "text-[#c62828]" :
                      log.level === "WARN"  ? "text-[#d4ac00]" :
                      "text-[#3a7a3e]"
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-[#555]">{log.msg}</span>
                </div>
              ))}
            </div>
          </>
        );

      case 6: return <SettingsView />;
      default: return null;
    }
  };

  return (
    <DashboardShell role="admin" activeItem={activeItem} setActiveItem={setActiveItem}>
      {content()}
    </DashboardShell>
  );
}
