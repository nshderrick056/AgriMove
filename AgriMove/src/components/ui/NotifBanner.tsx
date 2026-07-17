import { CheckCircle, Bell, AlertCircle } from "lucide-react";
import type { Notification } from "../../data/mockData";

export function NotifBanner({ n }: { n: Notification }) {
  const styles = {
    success: "bg-[#e8f5e9] border-l-[3px] border-[#2e7d32] text-[#1b5e20]",
    warning: "bg-[#FEFF9F] border-l-[3px] border-[#d4ac00] text-[#5a4a00]",
    info:    "bg-[#D3EE98] border-l-[3px] border-[#72BF78] text-[#3a7a3e]",
  };

  const icons = {
    success: <CheckCircle size={13} />,
    warning: <AlertCircle size={13} />,
    info:    <Bell size={13} />,
  };

  return (
    <div className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-xs ${styles[n.type]}`}>
      <span className="mt-0.5 flex-shrink-0">{icons[n.type]}</span>
      <span className="flex-1">{n.msg}</span>
      <span className="text-[10px] opacity-70 whitespace-nowrap">{n.time}</span>
    </div>
  );
}
