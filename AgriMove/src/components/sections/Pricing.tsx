import { CheckCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";

const plans = [
  {
    name: "Starter",
    price: "Free",
    sub: "Forever",
    highlight: false,
    features: [
      "Up to 5 deliveries/month",
      "SMS notifications",
      "Basic delivery tracking",
      "Delivery history (30 days)",
      "Email support",
    ],
    cta: "Get started",
  },
  {
    name: "Grower",
    price: "RWF 4,500",
    sub: "per month",
    highlight: true,
    features: [
      "Unlimited deliveries",
      "Real-time GPS tracking",
      "Priority driver matching",
      "Full delivery history",
      "SMS + email alerts",
      "Analytics dashboard",
    ],
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "Contact us",
    highlight: false,
    features: [
      "Everything in Grower",
      "Multi-user accounts",
      "Admin dashboard",
      "API access",
      "Dedicated support",
      "Custom reporting",
    ],
    cta: "Talk to our team",
  },
];

export function Pricing() {
  const { goToLogin } = useApp();
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-medium text-[#333] text-center mb-1.5">Simple, transparent pricing</h2>
        <p className="text-[#666] text-sm text-center mb-12">No hidden fees. Cancel any time.</p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col animate-slide-up stagger-${i + 1} ${
                plan.highlight
                  ? "bg-[#3a7a3e] text-white"
                  : "bg-white border border-[#D3EE98]/80"
              }`}
            >
              {plan.highlight && (
                <div className="bg-[#FEFF9F] text-[#3a7a3e] text-[10px] font-medium uppercase tracking-wide rounded-full px-2 py-0.5 self-start mb-3">
                  Most popular
                </div>
              )}
              <p className={`text-xs font-medium uppercase tracking-wide mb-2 ${plan.highlight ? "text-[#A0D683]" : "text-[#888]"}`}>
                {plan.name}
              </p>
              <div className="mb-1">
                <span className={`text-3xl font-medium ${plan.highlight ? "text-white" : "text-[#3a7a3e]"}`}>
                  {plan.price}
                </span>
              </div>
              <p className={`text-xs mb-5 ${plan.highlight ? "text-white/60" : "text-[#888]"}`}>{plan.sub}</p>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-white/90" : "text-[#555]"}`}>
                    <CheckCircle
                      size={14}
                      className={`mt-0.5 flex-shrink-0 ${plan.highlight ? "text-[#A0D683]" : "text-[#72BF78]"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => goToLogin("signup")}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-[#FEFF9F] text-[#3a7a3e] hover:bg-[#f0f070]"
                    : "bg-[#72BF78] text-white hover:bg-[#5fa865]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-[#888] mt-8">
          Prices shown in Rwandan Franc. Also available in UGX and KES.
        </p>
      </div>
    </section>
  );
}
