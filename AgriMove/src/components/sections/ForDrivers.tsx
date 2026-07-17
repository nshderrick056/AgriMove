import { Truck, CheckCircle, ArrowRight, MapPin } from "lucide-react";
import { Btn } from "../ui/Btn";
import { useApp } from "../../context/AppContext";

const features = [
  "See available jobs near you instantly",
  "Accept or reject requests in one tap",
  "Drive Mode: big buttons optimised for the road",
  "GPS route guidance built in",
  "Weekly earnings dashboard and history",
];

const sampleJobs = [
  { pickup: "Musanze Hub",  dest: "Kigali Market", cargo: "Sorghum · 300 kg",  dist: "88 km",  pay: "RWF 14,000" },
  { pickup: "Huye Depot",   dest: "Nyagatare Farm", cargo: "Cassava · 500 kg", dist: "190 km", pay: "RWF 28,500" },
];

export function ForDrivers() {
  const { goToLogin } = useApp();
  return (
    <section id="for-drivers" className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Preview card */}
        <div className="bg-white border border-[#D3EE98] rounded-2xl p-5 space-y-3 order-2 lg:order-1">
          <p className="text-xs text-[#888] font-medium uppercase tracking-wide">Driver snapshot</p>
          <div className="grid grid-cols-3 gap-2">
            {[{ l: "Today's earnings", v: "RWF 24k" }, { l: "This week", v: "7 jobs" }, { l: "Rating", v: "4.8★" }].map((m) => (
              <div key={m.l} className="bg-[#f8fdf8] border border-[#D3EE98]/60 rounded-lg p-3 text-center">
                <p className="text-sm font-medium text-[#3a7a3e]">{m.v}</p>
                <p className="text-[9px] text-[#888] leading-tight">{m.l}</p>
              </div>
            ))}
          </div>
          {sampleJobs.map((job) => (
            <div key={job.pickup} className="border border-[#D3EE98]/80 rounded-xl p-3">
              <div className="flex justify-between mb-1.5">
                <p className="text-xs text-[#666]">{job.cargo}</p>
                <p className="text-sm font-medium text-[#2a5c2e]">{job.pay}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#555] mb-2">
                <MapPin size={10} className="text-[#72BF78]" />
                <span>{job.pickup}</span>
                <ArrowRight size={9} />
                <span>{job.dest}</span>
                <span className="ml-auto text-[#888]">{job.dist}</span>
              </div>
              <div className="flex gap-1.5">
                <Btn variant="primary" className="flex-1 text-xs py-1">Accept</Btn>
                <Btn variant="danger"  className="flex-1 text-xs py-1">Reject</Btn>
              </div>
            </div>
          ))}
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 bg-[#D3EE98] rounded-full px-3 py-1 mb-4">
            <Truck size={12} className="text-[#3a7a3e]" />
            <span className="text-xs text-[#3a7a3e] font-medium">For drivers</span>
          </div>
          <h2 className="text-2xl font-medium text-[#333] mb-3">More jobs. Better pay. Less idle time.</h2>
          <p className="text-[#555] text-sm leading-relaxed mb-6">
            AgriMove matches you with delivery requests in your area — so your truck is always earning.
            Accept jobs, update delivery status, and get paid reliably on every completed route.
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
            Register as a driver <ArrowRight size={14} />
          </Btn>
        </div>
      </div>
    </section>
  );
}
