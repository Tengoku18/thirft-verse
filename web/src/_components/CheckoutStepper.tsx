'use client'

import { Check } from 'lucide-react'

export interface Step {
  id: number
  name: string
  shortName: string
}

interface CheckoutStepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export default function CheckoutStepper({
  steps,
  currentStep,
  onStepClick,
}: CheckoutStepperProps) {
  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden sm:block">
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute left-0 top-5 h-0.5 w-full bg-border/30" />

          {/* Progress Line Active */}
          <div
            className="absolute left-0 top-5 h-0.5 bg-secondary transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              const isClickable = onStepClick && currentStep > step.id

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center"
                >
                  {/* Step Circle */}
                  <button
                    type="button"
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    className={`
                      relative z-10 flex h-10 w-10 items-center justify-center rounded-full
                      border-2 transition-all duration-300
                      ${
                        isCompleted
                          ? 'border-secondary bg-secondary text-white cursor-pointer hover:scale-110'
                          : isCurrent
                          ? 'border-secondary bg-background text-secondary shadow-lg shadow-secondary/20'
                          : 'border-border/50 bg-background text-primary/40'
                      }
                      ${isClickable ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" strokeWidth={3} />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </button>

                  {/* Step Name */}
                  <span
                    className={`
                      mt-3 text-sm font-medium transition-colors
                      ${isCurrent ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-primary/40'}
                    `}
                  >
                    {step.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobile Stepper */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Indicator */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-full
                      border-2 transition-all duration-300
                      ${
                        isCompleted
                          ? 'border-secondary bg-secondary text-white'
                          : isCurrent
                          ? 'border-secondary bg-background text-secondary'
                          : 'border-border/50 bg-background text-primary/40'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      <span className="text-xs font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`
                      mt-1 text-[10px] font-medium text-center leading-tight
                      ${isCurrent ? 'text-primary' : isCompleted ? 'text-secondary' : 'text-primary/40'}
                    `}
                  >
                    {step.shortName}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-0.5 flex-1 mx-1 transition-colors duration-300
                      ${currentStep > step.id ? 'bg-secondary' : 'bg-border/30'}
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Current Step Label */}
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-primary/60">
            Step {currentStep} of {steps.length}
          </p>
          <p className="font-heading text-lg font-semibold text-primary">
            {steps.find((s) => s.id === currentStep)?.name}
          </p>
        </div>
      </div>
    </div>
  )
}
