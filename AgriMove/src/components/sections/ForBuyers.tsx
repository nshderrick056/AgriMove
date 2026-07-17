import { ShoppingCart, CheckCircle, ArrowRight, Navigation } from "lucide-react";
import { Btn } from "../ui/Btn";
import { StatusPill } from "../ui/StatusPill";
import { useApp } from "../../context/AppContext";

const features = [
  "Track incoming cargo live on a map",
  "SMS alert when your delivery is 30 minutes away",
  "Confirm receipt with a single tap",
  "Full delivery and transaction history",
  "Filter by cargo type, date, or farmer",
];

const incomingDeliveries = [
  { id: "AGR-0041", farmer: "Jean-Pierre Habimana", cargo: "Tomatoes · 480 kg", eta: "14:30 today", status: "En route" },
  { id: "AGR-0038", farmer: "Claudine Mukamana",    cargo: "Cassava · 350 kg",  eta: "09/07/2026", status: "Assigned" },
];

export function ForBuyers() {
  const { goToLogin } = useApp();
  return (
    <section id="for-buyers" className="py-16 bg-[#D3EE98]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-3 py-1 mb-4">
            <ShoppingCart size={12} className="text-[#3a7a3e]" />
            <span className="text-xs text-[#3a7a3e] font-medium">For buyers</span>
          </div>
          <h2 className="text-2xl font-medium text-[#333] mb-3">Know exactly when your goods arrive.</h2>
          <p className="text-[#555] text-sm leading-relaxed mb-6">
            No more guessing whether the truck is coming. AgriMove gives buyers real-time tracking,
            SMS alerts, and a clean history of every delivery and transaction.
          </p>
          <ul className="space-y-3 mb-6">
            {features.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[#444]">
                <CheckCircle size={15} className="text-[#72BF78] mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Btn variant="primary" onClick={() => goToLogin("signup")}>
            Join as a buyer <ArrowRight size={14} />
          </Btn>
        </div>

        {/* Preview cards */}
        <div className="space-y-3">
          {incomingDeliveries.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-[#A0D683]/50 p-4">
              <div className="flex justify-between mb-1.5">
                <p className="text-sm font-medium text-[#3a7a3e]">{d.id}</p>
                <StatusPill status={d.status} />
              </div>
              <p className="text-xs text-[#666] mb-1">{d.farmer} · {d.cargo}</p>
              <p className="text-xs text-[#888]">ETA: {d.eta}</p>
              <div className="flex gap-2 mt-3">
                <Btn variant="ghost" className="text-xs py-1.5">
                  <Navigation size={11} /> View on map
                </Btn>
                {d.status === "Delivered" && (
                  <Btn variant="primary" className="text-xs py-1.5">Confirm</Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
