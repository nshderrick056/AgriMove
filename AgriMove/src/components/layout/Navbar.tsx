import { useState } from "react";
import { Truck, Menu, X } from "lucide-react";
import { Btn } from "../ui/Btn";
import { useApp } from "../../context/AppContext";

const navLinks = [
  { id: "how-it-works", label: "How it works" },
  { id: "for-farmers",  label: "For farmers" },
  { id: "for-drivers",  label: "For drivers" },
  { id: "for-buyers",   label: "For buyers" },
  { id: "pricing",      label: "Pricing" },
];

export function Navbar() {
  const { goToLogin } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-[#D3EE98] sticky top-0 z-50 shadow-sm shadow-[#D3EE98]/20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-[#72BF78] rounded-lg flex items-center justify-center">
            <Truck size={16} className="text-white" />
          </div>
          <span className="text-[#3a7a3e] font-medium text-base">AgriMove</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-5 flex-1">
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-sm pb-0.5 transition-colors ${
                activeNav === id
                  ? "text-[#3a7a3e] border-b-2 border-[#72BF78]"
                  : "text-[#666] hover:text-[#3a7a3e]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Btn variant="outline" onClick={() => goToLogin("login")}>Log in</Btn>
          <Btn variant="primary" onClick={() => goToLogin("signup")}>Get started</Btn>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden ml-auto text-[#666] hover:text-[#3a7a3e] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#D3EE98] px-4 py-3 space-y-1 bg-white animate-slide-down">
          {navLinks.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="block w-full text-left text-sm text-[#666] hover:text-[#3a7a3e] py-2.5 transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="flex gap-2 pt-2 border-t border-[#D3EE98]/60">
            <Btn variant="outline" onClick={() => goToLogin("login")} className="flex-1">Log in</Btn>
            <Btn variant="primary" onClick={() => goToLogin("signup")} className="flex-1">Get started</Btn>
          </div>
        </div>
      )}
    </nav>
  );
}
