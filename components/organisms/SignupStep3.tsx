import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { showImagePickerOptions } from "@/lib/image-picker-helpers";
import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface SignupStep3Props {
  onNext: (data: {
    paymentUsername: string;
    paymentQRImage: string | null;
  }) => void;
  onSkip: () => void;
  loading?: boolean;
}

export const SignupStep3: React.FC<SignupStep3Props> = ({
  onNext,
  onSkip,
  loading = false,
}) => {
  const [paymentUsername, setPaymentUsername] = useState("");
  const [paymentQRImage, setPaymentQRImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleImageSelect = () => {
    showImagePickerOptions(
      { aspectRatio: [1, 1], quality: 0.8 },
      (result) => {
        if (result.success && result.uri) {
          setPaymentQRImage(result.uri);
        }
      },
      !!paymentQRImage,
      () => setPaymentQRImage(null)
    );
  };

  const handleContinue = () => {
    // Validate - at least payment username is required
    if (!paymentUsername.trim()) {
      setError("Please enter your payment account name");
      return;
    }

    setError("");
    onNext({
      paymentUsername: paymentUsername.trim(),
      paymentQRImage,
    });
  };

  return (
    <View className="flex-1">
      {/* Info Banner */}
      <View className="mb-6 p-4 bg-[#FEF3C7] rounded-2xl border-[2px] border-[#FCD34D]">
        <View className="flex-row items-start">
          <IconSymbol name="info.circle.fill" size={20} color="#D97706" />
          <BodyRegularText
            className="ml-3 flex-1 leading-5"
            style={{ color: "#92400E", fontSize: 13 }}
          >
            Add your payment details so buyers can pay you directly. This will
            be shown when someone wants to purchase your items.
          </BodyRegularText>
        </View>
      </View>

      {/* Payment Username Field */}
      <FormInput
        label="Payment Account Name"
        placeholder="e.g., eSewa: 9812345678 or Bank: John Doe"
        value={paymentUsername}
        onChangeText={(text) => {
          setPaymentUsername(text);
          if (error) setError("");
        }}
        error={error}
        autoCapitalize="none"
      />

      <CaptionText className="mb-6 -mt-2" style={{ color: "#6B7280" }}>
        Enter your eSewa number, bank account name, or any payment identifier
      </CaptionText>

      {/* QR Code Upload */}
      <View className="mb-6">
        <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
          Payment QR Code{" "}
          <CaptionText style={{ color: "#9CA3AF" }}>(Optional)</CaptionText>
        </BodySemiboldText>

        <TouchableOpacity
          onPress={handleImageSelect}
          activeOpacity={0.8}
          className="border-2 border-dashed border-[#E5E7EB] rounded-2xl overflow-hidden"
          style={{ height: 200 }}
        >
          {paymentQRImage ? (
            <View className="flex-1 relative">
              <Image
                source={{ uri: paymentQRImage }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
              />
              <View
                className="absolute top-2 right-2 bg-white rounded-full p-2"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <IconSymbol name="pencil" size={16} color="#3B2F2F" />
              </View>
            </View>
          ) : (
            <View className="flex-1 justify-center items-center bg-[#FAFAFA]">
              <View className="w-16 h-16 rounded-full bg-[#F3F4F6] justify-center items-center mb-3">
                <IconSymbol name="qrcode" size={28} color="#9CA3AF" />
              </View>
              <BodySemiboldText style={{ color: "#6B7280", fontSize: 14 }}>
                Upload QR Code
              </BodySemiboldText>
              <CaptionText style={{ color: "#9CA3AF" }} className="mt-1">
                Tap to add your payment QR
              </CaptionText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View className="mt-auto">
        <FormButton
          title="Complete Setup"
          onPress={handleContinue}
          loading={loading}
          variant="primary"
          className="mb-4"
        />

        <FormButton
          title="Skip for Now"
          onPress={onSkip}
          variant="outline"
          disabled={loading}
        />
      </View>
    </View>
  );
};
