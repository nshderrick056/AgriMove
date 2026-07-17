import { Truck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import type { Language } from "../../data/mockData";

const footerLinks = {
  Platform: [
    { id: "how-it-works", label: "How it works" },
    { id: "for-farmers",  label: "For farmers" },
    { id: "for-drivers",  label: "For drivers" },
    { id: "for-buyers",   label: "For buyers" },
    { id: "pricing",      label: "Pricing" },
  ],
  Company: ["About us", "Blog", "Careers", "Press", "Contact"],
  Support: ["Help center", "SMS support", "Report an issue", "Privacy policy", "Terms of service"],
};

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "rw", label: "Kinyarwanda" },
  { code: "sw", label: "Swahili" },
];

export function Footer() {
  const { language, setLanguage } = useApp();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#2a5c2e] pt-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#72BF78] rounded-lg flex items-center justify-center">
                <Truck size={13} className="text-white" />
              </div>
              <span className="text-white font-medium">AgriMove</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Connecting East Africa's agricultural supply chain through digital logistics — from farm to market.
            </p>
          </div>

          {/* Platform column */}
          <div>
            <h4 className="text-[#D3EE98] text-[11px] uppercase tracking-[0.05em] mb-3 font-medium">Platform</h4>
            <ul className="space-y-2">
              {footerLinks.Platform.map(({ id, label }) => (
                <li key={id}>
                  <button
                    onClick={() => scrollTo(id)}
                    className="text-xs transition-colors hover:text-[#A0D683] text-left"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-[#D3EE98] text-[11px] uppercase tracking-[0.05em] mb-3 font-medium">Company</h4>
            <ul className="space-y-2">
              {footerLinks.Company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs transition-colors hover:text-[#A0D683]" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h4 className="text-[#D3EE98] text-[11px] uppercase tracking-[0.05em] mb-3 font-medium">Support</h4>
            <ul className="space-y-2">
              {footerLinks.Support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs transition-colors hover:text-[#A0D683]" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: "#1e4422" }} className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            © 2026 AgriMove. All rights reserved.
          </p>
          {/* Language selector */}
          <div className="flex items-center gap-1">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`text-[11px] px-2 py-1 rounded transition-colors ${
                  language === code
                    ? "bg-[#72BF78] text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
