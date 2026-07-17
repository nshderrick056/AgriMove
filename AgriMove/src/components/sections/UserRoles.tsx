import { CheckCircle } from "lucide-react";

const roles = [
  {
    title: "Farmer",
    avatarBg: "#A0D683",
    avatarColor: "#2a5c2e",
    emoji: "🌱",
    capabilities: [
      "Create delivery requests in minutes",
      "Track shipments in real time",
      "Receive SMS updates on any phone",
      "View full delivery history",
    ],
  },
  {
    title: "Driver",
    avatarBg: "#72BF78",
    avatarColor: "#ffffff",
    emoji: "🚛",
    capabilities: [
      "View nearby available jobs",
      "Accept or reject requests",
      "GPS route guidance built in",
      "Update delivery status on the go",
    ],
  },
  {
    title: "Buyer",
    avatarBg: "#FEFF9F",
    avatarColor: "#7a7000",
    emoji: "🛒",
    capabilities: [
      "Track incoming cargo live",
      "Arrival SMS alerts",
      "Confirm receipt with one tap",
      "View transaction history",
    ],
  },
  {
    title: "Admin",
    avatarBg: "#3a7a3e",
    avatarColor: "#D3EE98",
    emoji: "⚙️",
    capabilities: [
      "Manage all users and roles",
      "Monitor deliveries system-wide",
      "Generate and export reports",
      "Handle complaints and issues",
    ],
  },
];

export function UserRoles() {
  return (
    <section className="py-16 bg-[#D3EE98]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-medium text-[#333] text-center mb-1.5">
          Built for every role in the chain
        </h2>
        <p className="text-[#555] text-sm text-center mb-12">
          Each user gets a tailored experience — simple enough for any literacy level
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role, i) => (
            <div
              key={role.title}
              className={`bg-white border border-[#A0D683]/50 rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow animate-slide-up stagger-${i + 1}`}
            >
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
                style={{ background: role.avatarBg }}
              >
                {role.emoji}
              </div>
              <h3 className="font-medium text-[#333] mb-3">{role.title}</h3>
              <ul className="space-y-2 flex-1">
                {role.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-2">
                    <CheckCircle size={11} className="text-[#72BF78] mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-[#3a7a3e]">{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
