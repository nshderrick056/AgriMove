import { Navigation, Package, Bell, History, Settings } from "lucide-react";
import { StatusPill } from "../ui/StatusPill";

const sidebarItems = ["Dashboard", "My deliveries", "New request", "Track shipment", "Notifications", "History", "Settings"];
const tableRows = [
  { id: "AGR-0041", cargo: "Tomatoes",  dest: "Kigali Market",  driver: "Samuel K.",  status: "En route" },
  { id: "AGR-0040", cargo: "Maize",     dest: "Huye Depot",     driver: "Patrick M.", status: "Delivered" },
  { id: "AGR-0039", cargo: "Beans",     dest: "Kigali Market",  driver: "—",          status: "Pending" },
];
const metrics = [
  { label: "Active deliveries",    value: "3" },
  { label: "Deliveries this month", value: "18" },
  { label: "Estimated savings",     value: "RWF 42k" },
];

export function DashboardPreview() {
  return (
    <section className="py-16 bg-[#f8fdf8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-medium text-[#333] text-center mb-1.5">
          A dashboard for every stakeholder
        </h2>
        <p className="text-[#666] text-sm text-center mb-12">
          Clean, responsive interfaces for desktop and mobile
        </p>

        {/* Browser frame */}
        <div
          className="rounded-2xl overflow-hidden border border-[#D3EE98]"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
        >
          {/* Browser chrome */}
          <div className="bg-[#e0e0e0] px-3 py-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="flex-1 mx-3 bg-white rounded h-5 flex items-center px-2">
              <span className="text-[10px] text-[#aaa]">agrimove.rw/dashboard</span>
            </div>
          </div>

          {/* App shell */}
          <div className="flex h-80 bg-white">
            {/* Sidebar */}
            <aside className="w-44 bg-[#f8fdf8] border-r border-[#D3EE98] flex-shrink-0 flex flex-col">
              <div className="bg-[#3a7a3e] px-3 py-2 flex items-center gap-1.5">
                <div className="w-5 h-5 bg-[#72BF78] rounded flex items-center justify-center">
                  <span className="text-white text-[8px]">🚛</span>
                </div>
                <span className="text-white text-xs font-medium">AgriMove</span>
              </div>
              <nav className="flex-1 py-2 px-1.5 space-y-0.5">
                {sidebarItems.map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[10px] ${
                      i === 0
                        ? "bg-[#D3EE98] text-[#3a7a3e] font-medium"
                        : "text-[#555]"
                    }`}
                  >
                    <span className="text-[#A0D683]">
                      {i === 0 ? <Navigation size={10} /> :
                       i === 1 ? <Package size={10} /> :
                       i === 5 ? <History size={10} /> :
                       i === 4 ? <Bell size={10} /> :
                       i === 6 ? <Settings size={10} /> :
                       <span className="w-2.5 h-2.5 rounded-full bg-[#D3EE98] inline-block" />}
                    </span>
                    {item}
                  </div>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-4 overflow-hidden">
              <p className="text-[9px] text-[#888] mb-3">Welcome back, Jean-Pierre Habimana · Eastern Province, Rwanda</p>

              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {metrics.map((m) => (
                  <div key={m.label} className="bg-[#f8fdf8] border border-[#D3EE98]/60 rounded-lg p-2">
                    <p className="text-[8px] text-[#888] uppercase tracking-wide mb-0.5">{m.label}</p>
                    <p className="text-sm font-medium text-[#3a7a3e]">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-lg border border-[#D3EE98]/60 overflow-hidden">
                <div className="bg-[#f8fdf8] border-b border-[#D3EE98]/60 px-2 py-1.5 grid grid-cols-5 gap-2">
                  {["ID", "Cargo", "Destination", "Driver", "Status"].map((h) => (
                    <span key={h} className="text-[8px] text-[#888] uppercase tracking-wide font-medium">{h}</span>
                  ))}
                </div>
                {tableRows.map((row) => (
                  <div key={row.id} className="px-2 py-1.5 grid grid-cols-5 gap-2 border-b border-[#D3EE98]/20 items-center">
                    <span className="text-[9px] text-[#3a7a3e] font-medium">{row.id}</span>
                    <span className="text-[9px] text-[#333]">{row.cargo}</span>
                    <span className="text-[9px] text-[#555]">{row.dest}</span>
                    <span className="text-[9px] text-[#555]">{row.driver}</span>
                    <StatusPill status={row.status} />
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}
