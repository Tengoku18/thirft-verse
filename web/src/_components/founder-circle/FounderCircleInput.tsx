import { forwardRef } from 'react';

interface FounderCircleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const FounderCircleInput = forwardRef<
  HTMLInputElement,
  FounderCircleInputProps
>(({ label, error, required, icon, ...props }, ref) => {
  return (
    <div className="w-full">
      <label
        htmlFor={props.id || props.name}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-white/60"
      >
        {icon && <span className="text-white/35">{icon}</span>}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <input
        ref={ref}
        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/25 transition-all focus:outline-none"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: error
            ? '1px solid rgba(239,68,68,0.7)'
            : '1px solid rgba(255,255,255,0.1)',
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.border = '1px solid rgba(212,163,115,0.6)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(212,163,115,0.12)';
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
});

FounderCircleInput.displayName = 'FounderCircleInput';
