import { useState } from "react";
import { X, Send, CheckCircle, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Btn } from "./Btn";
import { Input } from "./Input";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export function ContactModal({ isOpen, onClose, defaultSubject = "" }: ContactModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Farmer");
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API contact dispatch
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-[#D3EE98] w-full max-w-xl shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="bg-[#2a5c2e] p-5 text-white flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg text-white">Contact Our Team</h3>
            <p className="text-xs text-[#D3EE98] mt-0.5">
              Have questions or enterprise inquiry? Send us a message anytime.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-[#edfae0] text-[#3a7a3e] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-[#333]">Message Sent Successfully!</h4>
              <p className="text-xs text-[#666] mt-1 max-w-md mx-auto">
                Thank you, <strong>{fullName}</strong>. Our AgriMove logistics team has received your request and will contact you back via <strong>{email || phone || "email"}</strong> within 24 hours.
              </p>
            </div>
            <Btn variant="primary" onClick={handleResetAndClose} className="px-6 py-2.5 mx-auto">
              Done
            </Btn>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Quick Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#f8fdf8] p-3 rounded-xl border border-[#D3EE98]/60 text-xs">
              <div className="flex items-center gap-1.5 text-[#3a7a3e]">
                <Mail size={13} className="shrink-0" />
                <span className="truncate">support@agrimove.com</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3a7a3e]">
                <Phone size={13} className="shrink-0" />
                <span>+250 788 000 000</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#3a7a3e]">
                <MapPin size={13} className="shrink-0" />
                <span className="truncate">Kigali, Rwanda</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Full name"
                placeholder="e.g. Jean Habimana"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Email address"
                type="email"
                placeholder="e.g. jean@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Phone number"
                type="tel"
                placeholder="+250 788 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#666] font-medium">Your Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-[#D3EE98] text-xs text-[#333] bg-white focus:outline-none focus:border-[#72BF78]"
                >
                  <option value="Farmer">Farmer</option>
                  <option value="Driver">Driver / Transporter</option>
                  <option value="Buyer">Produce Buyer / Enterprise</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>
            </div>

            <Input
              label="Subject / Topic"
              placeholder="e.g. Custom Transport Partnership Request"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#666] font-medium">Message / Details</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us how we can help your farm, fleet, or business..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-3 text-xs rounded-lg border border-[#D3EE98] focus:outline-none focus:border-[#72BF78] text-[#333] bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D3EE98]/60">
              <Btn variant="outline" type="button" onClick={handleResetAndClose}>
                Cancel
              </Btn>
              <Btn variant="primary" type="submit" disabled={loading} className="px-5">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Send message
              </Btn>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
