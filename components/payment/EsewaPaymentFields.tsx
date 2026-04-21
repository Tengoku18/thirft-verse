import { UploadBox } from "@/components/atoms/UploadBox";
import { RHFInput } from "@/components/forms/ReactHookForm";
import { QRCodeIcon, UserIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { View } from "react-native";

interface EsewaPaymentFieldsProps<T extends FieldValues> {
  control: Control<T>;
  esewaIdFieldName: FieldPath<T>;
  qrImage: string | null;
  onPickQRImage: () => void;
  qrError?: string;
}

export function EsewaPaymentFields<T extends FieldValues>({
  control,
  esewaIdFieldName,
  qrImage,
  onPickQRImage,
  qrError,
}: EsewaPaymentFieldsProps<T>) {
  return (
    <View className="gap-6">
      {/* eSewa ID */}
      <View className="gap-3">
        <Typography variation="body" className="font-sans-semibold">
          ESEWA ID / USERNAME
        </Typography>
        <RHFInput
          control={control}
          name={esewaIdFieldName}
          placeholder="Enter your eSewa ID"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="phone-pad"
          leftIcon={<UserIcon />}
        />
      </View>

      {/* QR Code */}
      <View className="gap-3">
        <Typography variation="body" className="font-sans-semibold">
          ESEWA QR CODE
        </Typography>
        <UploadBox
          icon={<QRCodeIcon size={32} />}
          title="Upload QR Image"
          subtitle="PNG, JPG up to 5MB"
          onPress={onPickQRImage}
          image={qrImage}
        />
        {qrError && (
          <Typography variation="body-sm" className="text-red-500">
            {qrError}
          </Typography>
        )}
      </View>
    </View>
  );
}
