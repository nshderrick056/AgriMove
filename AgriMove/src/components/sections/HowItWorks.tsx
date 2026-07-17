import { Plus, Truck, CheckCircle, Navigation, Clock, MessageSquare, BarChart2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <Plus size={22} />,
    color: "#72BF78",
    title: "Farmer books a delivery",
    desc: "The farmer logs in, fills in cargo type, weight, pickup location, destination, and preferred schedule. The system auto-estimates the transport cost.",
  },
  {
    step: "02",
    icon: <Truck size={22} />,
    color: "#3a7a3e",
    title: "Driver accepts the job",
    desc: "Nearby drivers see the request and accept it. The farmer and buyer are notified by SMS instantly — no smartphone required on the driver's end.",
  },
  {
    step: "03",
    icon: <CheckCircle size={22} />,
    color: "#2a5c2e",
    title: "Buyer confirms receipt",
    desc: "The buyer tracks the delivery live, receives an SMS when the cargo arrives, and confirms receipt with one tap. Payment is logged automatically.",
  },
];

const features = [
  { bg: "#D3EE98", fg: "#3a7a3e", icon: <Navigation size={20} />, title: "Real-time GPS tracking",  desc: "Track every delivery live. Farmers and buyers see driver location and ETA." },
  { bg: "#FEFF9F", fg: "#7a7000", icon: <Clock size={20} />,       title: "Delivery scheduling",   desc: "Book transport days ahead with automated driver assignment." },
  { bg: "#A0D683", fg: "#2a5c2e", icon: <MessageSquare size={20}/>, title: "SMS notifications",    desc: "Stay informed via SMS on low-bandwidth 2G networks. No data required." },
  { bg: "#72BF78", fg: "#ffffff", icon: <BarChart2 size={20} />,   title: "Reports & analytics",   desc: "Admins track delivery history, route efficiency, and cargo loss stats." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-medium text-[#333] text-center mb-1.5">How AgriMove works</h2>
        <p className="text-[#666] text-sm text-center mb-12">Three simple steps from farm to market</p>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-[#D3EE98]" />
          {steps.map((s) => (
            <div key={s.step} className="text-center relative animate-slide-up">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 bg-white border-2 border-[#D3EE98]"
                style={{ color: s.color }}
              >
                {s.icon}
              </div>
              <p className="text-[11px] text-[#aaa] uppercase tracking-widest mb-1">Step {s.step}</p>
              <h3 className="font-medium text-[#333] mb-2">{s.title}</h3>
              <p className="text-xs text-[#666] leading-relaxed max-w-xs mx-auto">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((card, i) => (
            <div
              key={card.title}
              className={`bg-white border border-[#D3EE98]/80 rounded-xl p-5 hover:shadow-md transition-shadow animate-slide-up stagger-${i + 1}`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: card.bg }}
              >
                <span style={{ color: card.fg }}>{card.icon}</span>
              </div>
              <h3 className="font-medium text-[#333] text-sm mb-1.5">{card.title}</h3>
              <p className="text-[#666] text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
