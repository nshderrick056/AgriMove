type Status = string;

const statusStyles: Record<string, string> = {
  "Pending":   "bg-[#FEFF9F] text-[#7a7000]",
  "Assigned":  "bg-[#A0D683] text-[#2a5c2e]",
  "En route":  "bg-[#D3EE98] text-[#3a7a3e]",
  "Delivered": "bg-[#e8f5e9] text-[#2e7d32]",
  "Cancelled": "bg-[#fdecea] text-[#c62828]",
  "Active":    "bg-[#D3EE98] text-[#3a7a3e]",
  "Suspended": "bg-[#fdecea] text-[#c62828]",
  "High":      "bg-[#FEFF9F] text-[#7a7000]",
  "Medium":    "bg-[#D3EE98] text-[#3a7a3e]",
  "Resolved":  "bg-[#e0e0e0] text-[#666]",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
        statusStyles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
