import { forwardRef } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label
          htmlFor={props.id || props.name}
          className="mb-2 block text-sm font-medium text-primary"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full rounded-xl border ${
            error ? 'border-red-500' : 'border-border'
          } bg-surface px-4 py-3 text-primary transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
