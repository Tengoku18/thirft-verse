import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export interface StepperStep {
  id: number;
  label: string;
}

interface ProgressStepperProps {
  steps: StepperStep[];
  currentStep: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <View className="flex-row items-start justify-between py-6">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isLast = index === steps.length - 1;

        const circleColor = isCompleted
          ? 'bg-[#6B705C]'
          : isActive
          ? 'bg-[#D4A373]'
          : 'bg-[#C7BFB3]';

        const textColor = isActive
          ? 'text-[#D4A373]'
          : isCompleted
          ? 'text-[#6B705C]'
          : 'text-[#C7BFB3]';

        return (
          <View key={step.id} className="flex-1 flex-row items-start">
            <View className="items-center flex-1">
              {/* Circle */}
              <View
                className={`w-9 h-9 rounded-full justify-center items-center mb-2 ${circleColor} ${
                  isActive ? 'border-2 border-[#D4A373]' : ''
                }`}>
                <ThemedText
                  className="text-sm font-semibold font-[NunitoSans_600SemiBold]"
                  style={{ color: isActive || isCompleted ? '#FFFFFF' : '#3B2F2F' }}>
                  {isCompleted ? '✓' : step.id}
                </ThemedText>
              </View>

              {/* Label */}
              <ThemedText
                className={`text-xs text-center font-[NunitoSans_400Regular] ${textColor} ${
                  isActive ? 'font-semibold' : ''
                }`}>
                {step.label}
              </ThemedText>
            </View>

            {/* Connector Line */}
            {!isLast && (
              <View
                className={`h-0.5 flex-[0.5] mt-[17px] -mx-2 ${
                  isCompleted ? 'bg-[#6B705C]' : 'bg-[#C7BFB3]'
                }`}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};
