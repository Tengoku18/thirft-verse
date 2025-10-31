import { forwardRef } from 'react'

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  required?: boolean
  options: { value: string; label: string }[]
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, required, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label
          htmlFor={props.id || props.name}
          className="mb-2 block text-sm font-medium text-primary"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={`w-full appearance-none rounded-xl border ${
              error ? 'border-red-500' : 'border-border'
            } bg-surface pl-4 pr-10 py-3 text-primary transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-primary/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
