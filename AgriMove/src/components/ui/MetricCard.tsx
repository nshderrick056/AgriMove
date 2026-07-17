interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, sub, icon }: MetricCardProps) {
  return (
    <div className="bg-[#f8fdf8] rounded-xl p-4 border border-[#D3EE98]/60 flex flex-col gap-1 animate-slide-up">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[11px] text-[#888] uppercase tracking-wide font-medium">{label}</p>
        {icon && <span className="text-[#A0D683]">{icon}</span>}
      </div>
      <p className="text-xl font-medium text-[#3a7a3e]">{value}</p>
      {sub && <p className="text-xs text-[#888]">{sub}</p>}
    </div>
  );
}
