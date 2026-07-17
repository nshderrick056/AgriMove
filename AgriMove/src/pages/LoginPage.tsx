import { useState } from "react";
import { Truck, Eye, EyeOff, ChevronRight } from "lucide-react";
import { Btn } from "../components/ui/Btn";
import { Input } from "../components/ui/Input";
import { useApp } from "../context/AppContext";
import type { LoginTab, Page } from "../data/mockData";

export function LoginPage() {
  const { setPage, goToLogin } = useApp();
  const [tab, setTab] = useState<LoginTab>("login");
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("Farmer");

  const handleSubmit = () => {
    if (tab === "login") { setPage("farmer"); return; }
    if (role === "Farmer")      setPage("farmer");
    else if (role === "Transporter") setPage("driver");
    else setPage("buyer");
  };

  return (
    <div className="min-h-screen bg-[#f8fdf8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-7">
          <div className="w-9 h-9 bg-[#72BF78] rounded-xl flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <span className="text-[#3a7a3e] font-medium text-xl">AgriMove</span>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-2xl p-6 border border-[#D3EE98]/50"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
        >
          {/* Tabs */}
          <div className="flex mb-6 border-b border-[#e0e0e0]">
            {(["login", "signup"] as LoginTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 pb-2.5 text-sm font-medium transition-colors ${
                  tab === t
                    ? "text-[#3a7a3e] border-b-2 border-[#72BF78] -mb-px"
                    : "text-[#888] hover:text-[#555]"
                }`}
              >
                {t === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <div className="space-y-4">
              <Input label="Email or phone number" placeholder="jean@example.com" />
              {/* Password with show/hide */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-xs text-[#666]">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 pr-10 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] focus:ring-1 focus:ring-[#72BF78]/30 text-sm bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#555]"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <a href="#" className="text-xs text-[#72BF78] self-end mt-0.5 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Btn variant="primary" fullWidth onClick={handleSubmit}>Log in</Btn>
              <div className="flex items-center gap-2">
                <hr className="flex-1 border-[#e0e0e0]" />
                <span className="text-xs text-[#999]">or</span>
                <hr className="flex-1 border-[#e0e0e0]" />
              </div>
              {/* Quick demo links */}
              <div className="text-center text-xs text-[#666] space-y-2">
                <p className="text-[#aaa]">Jump to a demo dashboard:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {([ ["farmer","Farmer"], ["driver","Driver"], ["buyer","Buyer"], ["admin","Admin"] ] as [Page, string][]).map(
                    ([p, label]) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className="text-[#3a7a3e] underline hover:no-underline text-xs px-2 py-0.5 rounded hover:bg-[#f0faf0] transition-colors"
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="Full name" placeholder="Jean-Pierre Habimana" />
              <Input label="Email or phone number" placeholder="jean@example.com" />
              <div className="flex flex-col gap-1">
                <label htmlFor="new-password" className="text-xs text-[#666]">Password</label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Create a password"
                  className="h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] focus:ring-1 focus:ring-[#72BF78]/30 text-sm bg-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="role-select" className="text-xs text-[#666]">I am a</label>
                <select
                  id="role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-sm text-[#333] bg-white"
                >
                  <option>Farmer</option>
                  <option>Transporter</option>
                  <option>Buyer</option>
                </select>
              </div>
              <Btn variant="primary" fullWidth onClick={handleSubmit}>Create account</Btn>
              <p className="text-center text-[10px] text-[#999]">
                By creating an account you agree to our{" "}
                <a href="#" className="underline">Terms of service</a> and{" "}
                <a href="#" className="underline">Privacy policy</a>.
              </p>
            </div>
          )}
        </div>

        {/* Back to home */}
        <button
          onClick={() => setPage("landing")}
          className="mt-5 text-xs text-[#888] hover:text-[#3a7a3e] flex items-center gap-1 mx-auto transition-colors"
        >
          <ChevronRight size={12} className="rotate-180" />Back to home
        </button>
      </div>
    </div>
  );
}
