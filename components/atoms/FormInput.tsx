import { BodySemiboldText, CaptionText } from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

export interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
}

export const FormInput = React.forwardRef<TextInput, FormInputProps>(
  ({ label, error, required, className, secureTextEntry, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const textColor = "#3B2F2F";

    const isPasswordField = secureTextEntry !== undefined;

    return (
      <View className="mb-6">
        {label && (
          <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
            {label}
            {required && <BodySemiboldText style={{ color: "#EF4444", fontSize: 13 }}> *</BodySemiboldText>}
          </BodySemiboldText>
        )}

        <View className="relative">
          <TextInput
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            secureTextEntry={isPasswordField ? !isPasswordVisible : false}
            className={`${
              props.multiline ? "min-h-[58px] py-4" : "h-[58px]"
            } px-4 ${isPasswordField ? "pr-12" : ""} rounded-2xl border-[2px] text-[15px] font-[NunitoSans_400Regular] ${
              error
                ? "border-[#EF4444] bg-[#FEF2F2]"
                : isFocused
                  ? "border-[#3B2F2F] bg-white"
                  : "border-[#E5E7EB] bg-white"
            } ${className || ""}`}
            style={{
              color: textColor,
              textAlignVertical: props.multiline ? 'top' : 'center',
            }}
            placeholderTextColor="#9CA3AF"
            {...props}
          />
          {isPasswordField && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-4 top-0 bottom-0 justify-center"
              activeOpacity={0.7}
            >
              <IconSymbol
                name={isPasswordVisible ? "eye" : "eye.slash"}
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>

        {error && (
          <CaptionText className="mt-2" style={{ color: "#EF4444", fontSize: 13 }}>
            {error}
          </CaptionText>
        )}
      </View>
    );
  }
);

FormInput.displayName = "FormInput";
