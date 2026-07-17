import { useState } from "react";
import {
  Truck, Bell, User, Menu, X, Home, Package, Plus, Navigation,
  History, Settings, LogOut, BarChart2, Users, FileText, AlertCircle, Shield,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import type { Page } from "../../data/mockData";

type Role = "farmer" | "driver" | "buyer" | "admin";

const sidebarItems: Record<Role, { icon: React.ReactNode; label: string }[]> = {
  farmer: [
    { icon: <Home size={15} />,       label: "Dashboard" },
    { icon: <Package size={15} />,    label: "My deliveries" },
    { icon: <Plus size={15} />,       label: "New request" },
    { icon: <Navigation size={15} />, label: "Track shipment" },
    { icon: <Bell size={15} />,       label: "Notifications" },
    { icon: <History size={15} />,    label: "History" },
    { icon: <Settings size={15} />,   label: "Settings" },
  ],
  driver: [
    { icon: <Home size={15} />,       label: "Dashboard" },
    { icon: <Package size={15} />,    label: "Available jobs" },
    { icon: <Truck size={15} />,      label: "Active delivery" },
    { icon: <BarChart2 size={15} />,  label: "Earnings" },
    { icon: <Bell size={15} />,       label: "Notifications" },
    { icon: <History size={15} />,    label: "History" },
    { icon: <Settings size={15} />,   label: "Settings" },
  ],
  buyer: [
    { icon: <Home size={15} />,       label: "Dashboard" },
    { icon: <Package size={15} />,    label: "Incoming deliveries" },
    { icon: <Navigation size={15} />, label: "Track shipment" },
    { icon: <Bell size={15} />,       label: "Notifications" },
    { icon: <History size={15} />,    label: "History" },
    { icon: <Settings size={15} />,   label: "Settings" },
  ],
  admin: [
    { icon: <Home size={15} />,        label: "Overview" },
    { icon: <Users size={15} />,       label: "Users" },
    { icon: <Package size={15} />,     label: "All deliveries" },
    { icon: <FileText size={15} />,    label: "Reports" },
    { icon: <AlertCircle size={15} />, label: "Complaints" },
    { icon: <Shield size={15} />,      label: "System logs" },
    { icon: <Settings size={15} />,    label: "Settings" },
  ],
};

interface DashboardShellProps {
  role: Role;
  children: React.ReactNode;
  activeItem: number;
  setActiveItem: (i: number) => void;
}

export function DashboardShell({ role, children, activeItem, setActiveItem }: DashboardShellProps) {
  const { setPage } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navBg = role === "admin" ? "bg-[#2a5c2e]" : "bg-[#3a7a3e]";
  const items = sidebarItems[role];

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-52 bg-[#f8fdf8] border-r border-[#D3EE98] flex flex-col transition-transform duration-200 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar header */}
        <div className={`${navBg} px-4 py-3.5 flex items-center gap-2 flex-shrink-0`}>
          <div className="w-7 h-7 bg-[#72BF78] rounded-lg flex items-center justify-center flex-shrink-0">
            <Truck size={13} className="text-white" />
          </div>
          <span className="text-white font-medium text-sm">AgriMove</span>
          <button
            className="ml-auto lg:hidden text-white hover:text-white/80 min-w-[36px] min-h-[36px] flex items-center justify-center"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-4 py-2 bg-[#edfae0] border-b border-[#D3EE98]/60">
          <span className="text-[10px] text-[#3a7a3e] uppercase tracking-widest font-medium capitalize">
            {role} portal
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {items.map((item, i) => (
            <button
              key={item.label}
              onClick={() => { setActiveItem(i); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left min-h-[40px] ${
                activeItem === i
                  ? "bg-[#D3EE98] text-[#3a7a3e] font-medium"
                  : "text-[#555] hover:bg-[#edfae0] hover:text-[#3a7a3e]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-[#D3EE98]">
          <button
            onClick={() => setPage("landing")}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#555] hover:bg-[#fdecea] hover:text-[#c62828] transition-colors min-h-[40px]"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top nav */}
        <header className={`${navBg} px-4 py-3 flex items-center gap-3 flex-shrink-0`}>
          <button
            className="lg:hidden text-white hover:text-white/80 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <span className="text-white/60 text-sm hidden lg:block capitalize">
            {items[activeItem]?.label}
          </span>
          <div className="ml-auto flex items-center gap-3">
            <button className="text-white/80 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 bg-[#A0D683] rounded-full flex items-center justify-center">
              <User size={14} className="text-[#2a5c2e]" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
