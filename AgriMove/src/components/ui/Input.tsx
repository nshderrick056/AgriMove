interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}

export function Input({
  label,
  type = "text",
  placeholder,
  id,
  value,
  onChange,
  required,
  error,
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-xs text-[#666]">
        {label}{required && <span className="text-[#c62828] ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`h-10 px-3 rounded-lg border focus:outline-none focus:ring-1 text-sm text-[#333] bg-white transition-colors ${
          error
            ? "border-[#c62828] focus:border-[#c62828] focus:ring-[#c62828]/30"
            : "border-[#D3EE98] focus:border-[#72BF78] focus:ring-[#72BF78]/30"
        }`}
      />
      {error && <p className="text-[11px] text-[#c62828] mt-0.5">{error}</p>}
    </div>
  );
}
