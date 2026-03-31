import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface OTPInputProps extends Omit<TextInputProps, "value" | "onChangeText"> {
  value: string;
  onChangeText: (value: string) => void;
  hasError: boolean;
  isFilled: boolean;
  forwardedRef?: (ref: TextInput | null) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChangeText,
  hasError,
  isFilled,
  editable = true,
  forwardedRef,
  ...props
}) => {
  const borderColor = hasError ? "border-red-500" : "border-gray-300";
  const bgColor = "bg-white";

  return (
    <TextInput
      ref={forwardedRef}
      className={`flex-1 border-2 h-16 rounded-3xl text-center text-2xl items-center justify-center font-bold text-slate-900 ${borderColor} ${bgColor}`}
      value={value}
      onChangeText={onChangeText}
      keyboardType="number-pad"
      maxLength={1}
      selectTextOnFocus
      autoComplete="one-time-code"
      textContentType="oneTimeCode"
      editable={editable}
      placeholderTextColor="#D1D5DB"
      {...props}
    />
  );
};
