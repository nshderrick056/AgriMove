import { useState } from "react";
import {
  Truck, Bell, User, Menu, X, Home, Package, Navigation,
  History, Settings, LogOut, BarChart2, Users, FileText, AlertCircle, Shield, Check,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

type Role = "farmer" | "driver" | "admin";

const sidebarItems: Record<Role, { icon: React.ReactNode; label: string }[]> = {
  farmer: [
    { icon: <Home size={15} />,       label: "Dashboard" },
    { icon: <Package size={15} />,    label: "My deliveries" },
    { icon: <Navigation size={15} />, label: "Track shipment" },
    { icon: <AlertCircle size={15} />,label: "Complaints" },
    { icon: <History size={15} />,    label: "History" },
    { icon: <Settings size={15} />,   label: "Settings" },
  ],
  driver: [
    { icon: <Home size={15} />,       label: "Dashboard" },
    { icon: <Package size={15} />,    label: "Available jobs" },
    { icon: <Truck size={15} />,      label: "Active delivery" },
    { icon: <BarChart2 size={15} />,  label: "Earnings" },
    { icon: <AlertCircle size={15} />,label: "Complaints" },
    { icon: <History size={15} />,    label: "History" },
    { icon: <Settings size={15} />,   label: "Settings" },
  ],
  admin: [
    { icon: <Home size={15} />,        label: "Overview" },
    { icon: <Users size={15} />,       label: "Users" },
    { icon: <Package size={15} />,     label: "All deliveries" },
    { icon: <Truck size={15} />,       label: "Active deliveries" },
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
  const { logout, user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: "1", message: "Delivery #cms22wc57 is now PENDING", time: "10 mins ago", read: false },
    { id: "2", message: "Driver assigned to delivery #cms22byhx", time: "1 hour ago", read: false },
    { id: "3", message: "System maintenance scheduled for 02:00 AM", time: "1 day ago", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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
            onClick={() => logout()}
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
        <header className={`${navBg} px-4 py-3 flex items-center gap-3 flex-shrink-0 relative`}>
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

          <div className="ml-auto flex items-center gap-3 relative">
            {/* Bell button with notification popover trigger */}
            <button
              className="text-white/80 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center relative"
              aria-label="Notifications"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#FF2E93] rounded-full border-2 border-[#3a7a3e]" />
              )}
            </button>

            {/* Notifications Popover */}
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-xl border border-[#D3EE98] z-50 text-[#333] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-[#f8fdf8] border-b border-[#D3EE98]/60">
                  <h4 className="text-xs font-semibold text-[#3a7a3e] uppercase tracking-wide">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-[#72BF78] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Check size={12} /> Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#D3EE98]/30">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition-colors ${
                        n.read ? "bg-white text-[#666]" : "bg-[#f8fdf8] text-[#333] font-medium"
                      }`}
                    >
                      <p>{n.message}</p>
                      <span className="text-[10px] text-[#aaa] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#A0D683] rounded-full flex items-center justify-center">
                <User size={14} className="text-[#2a5c2e]" />
              </div>
              <span className="text-white text-xs font-medium hidden sm:inline">{user?.fullName ?? "User"}</span>
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
