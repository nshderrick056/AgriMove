// ── Types ─────────────────────────────────────────────────────────────────────
export type Page = "landing" | "login" | "farmer" | "driver" | "buyer" | "admin";
export type LoginTab = "login" | "signup";
export type DeliveryStatus = "Pending" | "Assigned" | "En route" | "Delivered" | "Cancelled";
export type Language = "en" | "rw" | "sw";

// ── Deliveries ────────────────────────────────────────────────────────────────
export interface Delivery {
  id: string;
  cargo: string;
  weight: string;
  pickup: string;
  destination: string;
  driver: string;
  status: DeliveryStatus;
}

export interface HistoryDelivery extends Delivery {
  date: string;
  cost: string;
}

export const deliveries: Delivery[] = [
  { id: "AGR-0041", cargo: "Tomatoes", weight: "480 kg", pickup: "Nyagatare Farm",  destination: "Kigali Market",  driver: "Samuel K.",   status: "En route" },
  { id: "AGR-0040", cargo: "Maize",    weight: "600 kg", pickup: "Musanze Hub",     destination: "Huye Depot",     driver: "Patrick M.",  status: "Delivered" },
  { id: "AGR-0039", cargo: "Beans",    weight: "220 kg", pickup: "Huye Depot",      destination: "Kigali Market",  driver: "—",           status: "Pending" },
  { id: "AGR-0038", cargo: "Cassava",  weight: "350 kg", pickup: "Nyagatare Farm",  destination: "Musanze Hub",    driver: "Jean B.",     status: "Assigned" },
  { id: "AGR-0037", cargo: "Bananas",  weight: "180 kg", pickup: "Kigali Market",   destination: "Huye Depot",     driver: "David A.",    status: "Cancelled" },
];

export const historyDeliveries: HistoryDelivery[] = [
  { id: "AGR-0036", cargo: "Sorghum",  weight: "410 kg", pickup: "Nyagatare Farm", destination: "Kigali Market", driver: "Samuel K.",  status: "Delivered", date: "02/07/2026", cost: "RWF 9,200" },
  { id: "AGR-0035", cargo: "Maize",    weight: "520 kg", pickup: "Musanze Hub",    destination: "Huye Depot",    driver: "Patrick M.", status: "Delivered", date: "28/06/2026", cost: "RWF 11,500" },
  { id: "AGR-0034", cargo: "Tomatoes", weight: "300 kg", pickup: "Huye Depot",     destination: "Kigali Market", driver: "Jean B.",    status: "Cancelled", date: "25/06/2026", cost: "—" },
  { id: "AGR-0033", cargo: "Beans",    weight: "200 kg", pickup: "Nyagatare Farm", destination: "Musanze Hub",   driver: "David A.",   status: "Delivered", date: "20/06/2026", cost: "RWF 7,800" },
];

// ── Earnings ──────────────────────────────────────────────────────────────────
export const earningsData = [
  { day: "Mon", earnings: 18500 },
  { day: "Tue", earnings: 24000 },
  { day: "Wed", earnings: 12000 },
  { day: "Thu", earnings: 31000 },
  { day: "Fri", earnings: 27500 },
  { day: "Sat", earnings: 38000 },
  { day: "Sun", earnings: 15000 },
];

export const earningsMonthlyData = [
  { week: "W1", earnings: 142000 },
  { week: "W2", earnings: 186500 },
  { week: "W3", earnings: 97000 },
  { week: "W4", earnings: 165000 },
];

// ── Admin Users ───────────────────────────────────────────────────────────────
export const adminUsers = [
  { name: "Jean-Pierre Habimana", role: "Farmer", phone: "+250 7** *** 234", region: "Eastern",        status: "Active" },
  { name: "Samuel Kamanzi",       role: "Driver", phone: "+250 7** *** 891", region: "Kigali",         status: "Active" },
  { name: "Marie Uwase",          role: "Buyer",  phone: "+250 7** *** 456", region: "Southern",       status: "Active" },
  { name: "Patrick Mugisha",      role: "Driver", phone: "+256 7** *** 123", region: "Western Uganda", status: "Suspended" },
  { name: "Grace Wanjiku",        role: "Buyer",  phone: "+254 7** *** 789", region: "Nairobi",        status: "Active" },
  { name: "Claudine Mukamana",    role: "Farmer", phone: "+250 7** *** 012", region: "Northern",       status: "Active" },
];

// ── Notifications ─────────────────────────────────────────────────────────────
export interface Notification {
  msg: string;
  time: string;
  type: "success" | "info" | "warning";
}

export const notifications: Notification[] = [
  { msg: "Driver Samuel K. assigned to AGR-0041",              time: "2 min ago",   type: "success" },
  { msg: "SMS sent: delivery AGR-0040 confirmed delivered",    time: "1 hour ago",  type: "info" },
  { msg: "AGR-0038 pickup delayed by 30 minutes",              time: "3 hours ago", type: "warning" },
  { msg: "Your request AGR-0042 has been submitted",           time: "Yesterday",   type: "success" },
  { msg: "AGR-0037 was cancelled — refund issued",             time: "2 days ago",  type: "info" },
];

// ── Available Driver Jobs ─────────────────────────────────────────────────────
export const availableJobs = [
  { id: "AGR-0042", pickup: "Musanze Hub",    destination: "Kigali Market",  cargo: "Sorghum", weight: "300 kg", distance: "88 km",  pay: "RWF 14,000" },
  { id: "AGR-0043", pickup: "Huye Depot",     destination: "Nyagatare Farm", cargo: "Cassava", weight: "500 kg", distance: "190 km", pay: "RWF 28,500" },
  { id: "AGR-0044", pickup: "Kigali Market",  destination: "Musanze Hub",    cargo: "Maize",   weight: "420 kg", distance: "96 km",  pay: "RWF 16,200" },
  { id: "AGR-0045", pickup: "Nyagatare Farm", destination: "Kigali Market",  cargo: "Beans",   weight: "260 kg", distance: "142 km", pay: "RWF 19,000" },
];

// ── Buyer Incoming ────────────────────────────────────────────────────────────
export const buyerIncoming = [
  { id: "AGR-0041", farmer: "Jean-Pierre Habimana", cargo: "Tomatoes", qty: "480 kg", eta: "14:30 today", driver: "Samuel K.",  status: "En route"  as DeliveryStatus },
  { id: "AGR-0038", farmer: "Claudine Mukamana",    cargo: "Cassava",  qty: "350 kg", eta: "09/07/2026",  driver: "Jean B.",    status: "Assigned"  as DeliveryStatus },
  { id: "AGR-0040", farmer: "Eric Niyonshuti",      cargo: "Maize",    qty: "600 kg", eta: "08/07/2026",  driver: "Patrick M.", status: "Delivered" as DeliveryStatus },
];

// ── System Logs ───────────────────────────────────────────────────────────────
export const systemLogs = [
  { time: "10/07/2026 14:22:03", level: "INFO",  msg: "Delivery AGR-0041 status updated to En route" },
  { time: "10/07/2026 13:58:47", level: "INFO",  msg: "SMS sent to +250 7** *** 234 — driver assigned" },
  { time: "10/07/2026 12:31:05", level: "WARN",  msg: "Driver AGR-D-019 GPS signal lost for 4 minutes" },
  { time: "10/07/2026 11:14:22", level: "INFO",  msg: "New user registered — role: Farmer — region: Eastern" },
  { time: "10/07/2026 10:05:58", level: "ERROR", msg: "SMS delivery failed for +256 7** *** 123 — retrying" },
  { time: "10/07/2026 09:44:31", level: "INFO",  msg: "Delivery AGR-0040 confirmed delivered by buyer" },
  { time: "10/07/2026 08:30:00", level: "INFO",  msg: "System health check passed — uptime 99.8%" },
];

// ── Complaints ────────────────────────────────────────────────────────────────
export const complaints = [
  { id: "C-017", user: "Patrick Mugisha", issue: "Driver did not arrive at scheduled time", priority: "High",   resolved: false },
  { id: "C-016", user: "Grace Wanjiku",   issue: "Cargo weight was incorrect at delivery",  priority: "Medium", resolved: false },
  { id: "C-015", user: "Marie Uwase",     issue: "SMS notification not received",           priority: "Medium", resolved: true },
];
