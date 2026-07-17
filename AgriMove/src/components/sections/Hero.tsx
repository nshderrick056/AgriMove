import { MapPin, Navigation, ArrowRight, Play } from "lucide-react";
import { Btn } from "../ui/Btn";
import { StatusPill } from "../ui/StatusPill";
import { useApp } from "../../context/AppContext";

export function Hero() {
  const { goToLogin } = useApp();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{ background: "linear-gradient(135deg, #3a7a3e 0%, #72BF78 55%, #A0D683 100%)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left — Hero text */}
        <div className="animate-slide-up">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <MapPin size={11} className="text-white" />
            <span className="text-white text-xs">East Africa · Rwanda · Uganda · Kenya</span>
          </div>

          <h1 className="text-3xl lg:text-[2.6rem] font-medium text-white leading-tight mb-4">
            Move your harvest.<br />Connect your market.
          </h1>

          <p
            className="text-sm leading-relaxed mb-7 max-w-md"
            style={{ color: "rgba(255,255,255,0.88)" }}
          >
            AgriMove connects small-scale farmers, transport drivers, and buyers across East Africa —
            reducing post-harvest losses through digital delivery booking, GPS tracking, and real-time logistics.
          </p>

          <div className="flex flex-wrap gap-3">
            <Btn
              variant="highlight"
              onClick={() => goToLogin("signup")}
              className="px-5 py-2.5 text-base"
            >
              Start for free <ArrowRight size={14} />
            </Btn>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="flex items-center gap-2 text-white text-sm rounded-lg px-5 py-2.5 transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.6)" }}
            >
              <Play size={13} /> Watch how it works
            </button>
          </div>
        </div>

        {/* Right — Live Tracker UI card */}
        <div className="flex justify-center lg:justify-end animate-slide-up stagger-2">
          <div
            className="bg-white rounded-2xl p-4 w-full max-w-sm"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
          >
            {/* Card header */}
            <div className="flex items-center gap-2 mb-3">
              <Navigation size={14} className="text-[#3a7a3e]" />
              <span className="text-sm font-medium text-[#333]">Live delivery tracker</span>
              <div className="ml-auto flex items-center gap-1 bg-[#D3EE98] rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3a7a3e] animate-pulse-dot" />
                <span className="text-[10px] text-[#3a7a3e] font-medium">Live</span>
              </div>
            </div>

            {/* Map preview */}
            <div className="bg-[#D3EE98] rounded-[10px] h-28 relative mb-3 overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 112" fill="none">
                {/* Grid lines */}
                <line x1="80"  y1="0" x2="80"  y2="112" stroke="#A0D683" strokeWidth="0.5" />
                <line x1="160" y1="0" x2="160" y2="112" stroke="#A0D683" strokeWidth="0.5" />
                <line x1="240" y1="0" x2="240" y2="112" stroke="#A0D683" strokeWidth="0.5" />
                <line x1="0"   y1="56" x2="320" y2="56" stroke="#A0D683" strokeWidth="0.5" />
                {/* Route path */}
                <path
                  d="M 40 85 C 80 85 80 30 165 30 C 230 30 255 68 282 68"
                  stroke="#3a7a3e" strokeWidth="1.5" strokeDasharray="5 3" fill="none"
                />
                {/* Pickup dot */}
                <circle cx="40" cy="85" r="5" fill="#72BF78" />
                <circle cx="40" cy="85" r="9" fill="#72BF78" fillOpacity="0.25" />
                {/* Destination dot */}
                <circle cx="282" cy="68" r="5" fill="#2a5c2e" />
                <circle cx="282" cy="68" r="9" fill="#2a5c2e" fillOpacity="0.2" />
                {/* Driver dot (animated) */}
                <circle cx="168" cy="30" r="5" fill="#FEFF9F" stroke="#d4ac00" strokeWidth="1" className="driver-dot" />
                <circle cx="168" cy="30" r="9" fill="#FEFF9F" fillOpacity="0.4" />
              </svg>
              {/* Legend */}
              <div className="absolute bottom-2 left-2 flex gap-3 text-[9px] text-[#3a7a3e]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#72BF78] inline-block" />Farm
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#FEFF9F] border border-[#d4ac00] inline-block" />Driver
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#2a5c2e] inline-block" />Market
                </span>
              </div>
            </div>

            {/* Delivery rows */}
            <div className="space-y-1.5 mb-3">
              {[
                { id: "AGR-0041", cargo: "Tomatoes · 480 kg", status: "En route" },
                { id: "AGR-0040", cargo: "Maize · 600 kg",    status: "Delivered" },
                { id: "AGR-0039", cargo: "Beans · 220 kg",    status: "Pending" },
              ].map((row) => (
                <div key={row.id} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-[#3a7a3e] font-medium">{row.id}</span>
                  <span className="text-[#666]">{row.cargo}</span>
                  <StatusPill status={row.status} />
                </div>
              ))}
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: "Active deliveries", value: "24" },
                { label: "On-time rate",      value: "94%" },
                { label: "Drivers online",    value: "37" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#D3EE98] rounded-lg p-2 text-center">
                  <p className="text-base font-medium text-[#3a7a3e]">{stat.value}</p>
                  <p className="text-[9px] text-[#555] leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
