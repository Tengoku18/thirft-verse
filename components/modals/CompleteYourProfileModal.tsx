import { Typography } from "@/components/ui/Typography/Typography";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Modal, Pressable, View } from "react-native";

interface CompleteYourProfileModalProps {
  visible: boolean;
  nextStep: number;
  onClose?: () => void;
}

/**
 * Modal shown when a user tries to access the app before completing onboarding.
 * Redirects to the next incomplete signup step after brief delay.
 */
export function CompleteYourProfileModal({
  visible,
  nextStep,
  onClose,
}: CompleteYourProfileModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (!visible) return;

    // Auto-redirect after 2 seconds
    const timeout = setTimeout(() => {
      // Navigate to the appropriate signup step
      const stepMap: Record<number, string> = {
        1: "/(auth)/signup-step1",
        2: "/(auth)/signup-step2",
        3: "/(auth)/signup-step3",
        4: "/(auth)/signup-step4",
        5: "/(auth)/signup-step5",
        6: "/(auth)/signup-step6",
      };

      const targetStep = stepMap[nextStep] || "/(auth)/signup-step2";
      console.log(
        `[CompleteYourProfileModal] Redirecting to ${targetStep} (step ${nextStep})`,
      );
      router.replace(targetStep as any);

      onClose?.();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [visible, nextStep, router, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      {/* Dark overlay */}
      <View className="flex-1 bg-black/50 justify-center items-center">
        {/* Modal card */}
        <View className="bg-white rounded-3xl mx-8 p-8 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Typography
              variation="h1"
              className="text-center text-2xl font-bold"
            >
              Complete Your Profile
            </Typography>
            <Typography variation="body" className="text-center text-slate-600">
              Finish setting up your account to start using Thriftverse
            </Typography>
          </View>

          {/* Message */}
          <View className="bg-blue-50 rounded-xl p-4">
            <Typography variation="body-sm" className="text-blue-900">
              You're almost there! Complete your profile to unlock full access
              to buy and sell on Thriftverse.
            </Typography>
          </View>

          {/* Loading indicator */}
          <View className="items-center py-4">
            <Typography variation="caption" className="text-slate-500">
              Redirecting...
            </Typography>
          </View>

          {/* Action button */}
          <Pressable
            className="bg-brand-tan rounded-xl py-3"
            onPress={() => {
              const stepMap: Record<number, string> = {
                1: "/(auth)/signup-step1",
                2: "/(auth)/signup-step2",
                3: "/(auth)/signup-step3",
                4: "/(auth)/signup-step4",
                5: "/(auth)/signup-step5",
                6: "/(auth)/signup-step6",
              };

              const targetStep = stepMap[nextStep] || "/(auth)/signup-step2";
              router.replace(targetStep as any);
              onClose?.();
            }}
          >
            <Typography variation="body" className="text-center font-semibold">
              Continue Setup
            </Typography>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
