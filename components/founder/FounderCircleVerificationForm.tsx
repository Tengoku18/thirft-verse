import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Input } from "@/components/ui/Input";
import { Link } from "@/components/ui/Link";
import { Typography } from "@/components/ui/Typography";
import {
  FounderCircleFormData,
  founderCircleSchema,
} from "@/lib/validations/founder-circle";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

interface FounderCircleVerificationFormProps {
  loading: boolean;
  error: string;
  successMessage: string;
  onSubmit: (data: FounderCircleFormData) => Promise<void>;
}

export function FounderCircleVerificationForm({
  loading,
  error,
  successMessage,
  onSubmit,
}: FounderCircleVerificationFormProps) {
  const { control, handleSubmit } = useForm<FounderCircleFormData>({
    resolver: yupResolver(founderCircleSchema),
    mode: "onBlur",
    defaultValues: {
      verificationCode: "",
    },
  });

  return (
    <View className="mb-6 mx-4">
      <View className="bg-white rounded-2xl p-5 border border-brand-beige/40 gap-4">
        <View>
          <Typography
            variation="h4"
            className="text-brand-espresso font-folito-bold mb-1"
          >
            Verification Form
          </Typography>
          <Typography variation="body-sm" className="text-slate-500">
            Enter the code provided by the Thriftverse team.
          </Typography>
        </View>

        {error && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-3">
            <Typography
              variation="body-sm"
              className="text-red-700 font-sans-semibold"
            >
              ⚠️ {error}
            </Typography>
          </View>
        )}

        {successMessage && (
          <View className="bg-green-50 border border-green-200 rounded-xl p-3">
            <Typography
              variation="body-sm"
              className="text-green-700 font-sans-semibold"
            >
              {successMessage}
            </Typography>
          </View>
        )}

        <Controller
          control={control}
          name="verificationCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="ENTER 8-DIGIT CODE"
              keyboardType="number-pad"
              maxLength={8}
              editable={!loading}
              className="text-center tracking-widest text-lg font-sans-bold"
            />
          )}
        />

        <Button
          label="Verify Now"
          onPress={handleSubmit(onSubmit)}
          isLoading={loading}
          disabled={loading}
          fullWidth
          icon={
            <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
          }
          iconPosition="right"
        />
      </View>

      <View className="mt-4 items-center gap-1">
        <Typography variation="body-sm" className="text-slate-500">
          Didn&apos;t get a code?{" "}
        </Typography>
        <Link
          label="Contact support"
          href="#"
          variant="primary"
          underline={false}
          className="text-brand-tan font-sans-bold"
        />
      </View>
    </View>
  );
}
