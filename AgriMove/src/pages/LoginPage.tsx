import { useState } from "react";
import { Truck, Eye, EyeOff, ChevronRight } from "lucide-react";
import { Btn } from "../components/ui/Btn";
import { Input } from "../components/ui/Input";
import { useApp } from "../context/AppContext";
import type { LoginTab, Page } from "../data/mockData";

export function LoginPage() {
  const { setPage, loginTab } = useApp();
  const [tab, setTab] = useState<LoginTab>(loginTab);
  const [showForgot, setShowForgot] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState("Farmer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload = tab === "login" 
        ? { email, password }
        : { email, password, fullName, role: role.toUpperCase() };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      // Success, store token and redirect
      localStorage.setItem("agrimove_token", data.token);
      
      const userRole = data.user.role;
      if (userRole === "FARMER") setPage("farmer");
      else if (userRole === "TRANSPORTER") setPage("driver");
      else if (userRole === "BUYER") setPage("buyer");
      else if (userRole === "ADMIN") setPage("admin");
      
    } catch (err) {
      setErrorMsg("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
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
          {showForgot ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-[#333]">Reset your password</h3>
              <p className="text-sm text-[#666]">Enter your email address and we'll send you a link to reset your password.</p>
              {errorMsg && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{errorMsg}</div>}
              <Input 
                label="Email address" 
                placeholder="jean@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Btn variant="primary" fullWidth onClick={async () => {
                setErrorMsg("");
                setLoading(true);
                // Replace with actual API call later
                setTimeout(() => { 
                  setLoading(false); 
                  setErrorMsg("If an account exists, a reset link was sent!"); 
                }, 1000);
              }} disabled={loading}>
                {loading ? "Please wait..." : "Send reset link"}
              </Btn>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setErrorMsg(""); }}
                className="w-full text-center text-sm text-[#72BF78] hover:underline mt-2"
              >
                Back to login
              </button>
            </div>
          ) : (
            <>
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
              {errorMsg && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{errorMsg}</div>}
              <Input 
                label="Email or phone number" 
                placeholder="jean@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Password with show/hide */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-xs text-[#666]">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <button 
                  type="button"
                  onClick={() => { setShowForgot(true); setErrorMsg(""); }}
                  className="text-xs text-[#72BF78] self-end mt-0.5 hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <Btn variant="primary" fullWidth onClick={handleSubmit} disabled={loading}>
                {loading ? "Please wait..." : "Log in"}
              </Btn>

            </div>
          ) : (
            <div className="space-y-4">
              {errorMsg && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{errorMsg}</div>}
              <Input 
                label="Full name" 
                placeholder="Jean-Pierre Habimana" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input 
                label="Email or phone number" 
                placeholder="jean@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label htmlFor="new-password" className="text-xs text-[#666]">Password</label>
                <input
                  id="new-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <Btn variant="primary" fullWidth onClick={handleSubmit} disabled={loading}>
                {loading ? "Please wait..." : "Create account"}
              </Btn>
              <p className="text-center text-[10px] text-[#999]">
                By creating an account you agree to our{" "}
                <a href="#" className="underline">Terms of service</a> and{" "}
                <a href="#" className="underline">Privacy policy</a>.
              </p>
            </div>
          )}
          </>
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
