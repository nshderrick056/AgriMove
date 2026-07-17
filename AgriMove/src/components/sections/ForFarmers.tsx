import { Leaf, CheckCircle, ArrowRight } from "lucide-react";
import { Btn } from "../ui/Btn";
import { useApp } from "../../context/AppContext";
import { deliveries } from "../../data/mockData";
import { DeliveriesTable } from "../ui/DeliveriesTable";

const features = [
  "Book transport in under 2 minutes",
  "Get SMS updates — no data required",
  "See real-time driver location and ETA",
  "View full delivery history and receipts",
  "Automatic cost estimate before you confirm",
];

export function ForFarmers() {
  const { goToLogin } = useApp();
  return (
    <section id="for-farmers" className="py-16 bg-[#f8fdf8]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#D3EE98] rounded-full px-3 py-1 mb-4">
            <Leaf size={12} className="text-[#3a7a3e]" />
            <span className="text-xs text-[#3a7a3e] font-medium">For farmers</span>
          </div>
          <h2 className="text-2xl font-medium text-[#333] mb-3">Stop losing harvest to poor transport</h2>
          <p className="text-[#555] text-sm leading-relaxed mb-6">
            Every year, East African farmers lose up to 30% of their produce to spoilage caused by delayed
            or unavailable transport. AgriMove gives you a reliable, affordable logistics network — directly
            from your phone.
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
            Start as a farmer <ArrowRight size={14} />
          </Btn>
        </div>

        {/* Preview card */}
        <div className="bg-white border border-[#D3EE98] rounded-2xl p-5 space-y-3">
          <p className="text-xs text-[#888] font-medium uppercase tracking-wide">Farmer snapshot</p>
          <div className="grid grid-cols-3 gap-2">
            {[{ l: "Active deliveries", v: "3" }, { l: "This month", v: "18" }, { l: "Savings", v: "RWF 42k" }].map((m) => (
              <div key={m.l} className="bg-[#f8fdf8] border border-[#D3EE98]/60 rounded-lg p-3 text-center">
                <p className="text-lg font-medium text-[#3a7a3e]">{m.v}</p>
                <p className="text-[9px] text-[#888] leading-tight">{m.l}</p>
              </div>
            ))}
          </div>
          <DeliveriesTable rows={deliveries.slice(0, 3)} showActions={false} />
        </div>
      </div>
    </section>
  );
}
