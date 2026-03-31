import ClockIcon from "@/components/icons/ClockIcon";
import { Typography } from "@/components/ui/Typography/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface ResendCodeSectionProps {
  canResend: boolean;
  timer: number;
  isLoading: boolean;
  onResendPress: () => void;
}

export const ResendCodeSection: React.FC<ResendCodeSectionProps> = ({
  canResend,
  timer,
  isLoading,
  onResendPress,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View className="flex-col justify-center items-center py-4">
      {canResend ? (
        <TouchableOpacity
          onPress={onResendPress}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Typography
            variation="body-sm"
            className="font-sans-semibold text-orange-500"
          >
            {isLoading ? "Sending..." : "Resend Code"}
          </Typography>
        </TouchableOpacity>
      ) : (
        <View className="flex-col items-center gap-2">
          <View className="flex-row items-center gap-2">
            <ClockIcon />
            <Typography variation="body-sm" className="text-slate-500">
              Resend code in{" "}
              <Typography
                variation="body-sm"
                className="font-sans-semibold text-slate-700"
              >
                {formatTime(timer)}
              </Typography>
            </Typography>
          </View>
          <Typography
            variation="body-sm"
            className="font-sans-semibold text-slate-400"
          >
            Resend Code
          </Typography>
        </View>
      )}
    </View>
  );
};
