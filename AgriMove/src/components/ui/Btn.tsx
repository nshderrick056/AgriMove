export type BtnVariant = "primary" | "outline" | "ghost" | "danger" | "highlight";

interface BtnProps {
  variant?: BtnVariant;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

const variants: Record<BtnVariant, string> = {
  primary:   "bg-[#72BF78] text-white hover:bg-[#5fa865] active:bg-[#4d9052]",
  outline:   "bg-transparent text-[#3a7a3e] border border-[#72BF78] hover:bg-[#f0faf0]",
  ghost:     "bg-transparent text-[#3a7a3e] border border-[#A0D683]/60 hover:bg-[#f0faf0]",
  danger:    "bg-transparent text-[#c62828] border border-[#c62828] hover:bg-[#fdecea]",
  highlight: "bg-[#FEFF9F] text-[#3a7a3e] hover:bg-[#f0f070] active:bg-[#e8e060]",
};

export function Btn({
  variant = "primary",
  children,
  onClick,
  className = "",
  type = "button",
  fullWidth = false,
  disabled = false,
  ariaLabel,
}: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer select-none min-h-[36px] disabled:opacity-50 disabled:cursor-not-allowed";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
