import { Typography } from "@/components/ui/Typography/Typography";
import React from "react";
import { View } from "react-native";

interface StepperProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  showStepCount?: boolean;
}

/**
 * Stepper Component
 *
 * A reusable progress indicator for multi-step forms/onboarding flows.
 * Displays:
 * - Title/label on the left
 * - Step counter on the right (e.g., "Step 2 of 5")
 * - Progress bar showing current progress
 *
 * @example
 * ```tsx
 * <Stepper
 *   title="Payout Info"
 *   currentStep={4}
 *   totalSteps={4}
 * />
 * ```
 */
export function Stepper({
  title,
  currentStep,
  totalSteps,
  showStepCount = true,
}: StepperProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View className="px-4 py-4">
      {/* Title and Step Counter Row */}
      <View className="flex-row justify-between items-center mb-3">
        {/* Title */}
        <Typography variation="h4" className="text-black font-sans-bold">
          {title}
        </Typography>

        {/* Step Counter */}
        {showStepCount && (
          <Typography
            variation="body-sm"
            className="text-slate-500 font-sans-medium"
          >
            Step {currentStep} of {totalSteps}
          </Typography>
        )}
      </View>

      {/* Progress Bar */}
      <View className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-brand-tan rounded-full"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </View>
    </View>
  );
}

export default Stepper;
