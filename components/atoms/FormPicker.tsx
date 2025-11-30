import {
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";

export interface PickerOption {
  label: string;
  value: string;
}

export interface FormPickerProps {
  label?: string;
  error?: string;
  value?: string;
  onChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FormPicker: React.FC<FormPickerProps> = ({
  label,
  error,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View className="mb-6">
      {/* Label */}
      {label && (
        <BodySemiboldText className="mb-3" style={{ fontSize: 13 }}>
          {label}
          {required && <BodySemiboldText style={{ color: "#EF4444", fontSize: 13 }}> *</BodySemiboldText>}
        </BodySemiboldText>
      )}

      {/* Picker Button */}
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`h-[58px] px-4 rounded-2xl border-[2px] flex-row items-center justify-between ${
          error
            ? "border-red-500 bg-red-50"
            : "border-[#E5E7EB] bg-white"
        } ${disabled ? 'opacity-50' : ''}`}
        activeOpacity={0.7}
      >
        <BodyRegularText
          className="flex-1"
          style={{ color: selectedOption ? '#3B2F2F' : '#9CA3AF', fontSize: 15 }}
        >
          {selectedOption?.label || placeholder}
        </BodyRegularText>
        <IconSymbol
          name="chevron.down"
          size={20}
          color={disabled ? "#9CA3AF" : "#6B705C"}
        />
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <CaptionText className="mt-2" style={{ color: "#EF4444", fontSize: 13 }}>
          {error}
        </CaptionText>
      )}

      {/* Modal Picker */}
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            className="bg-white rounded-t-3xl max-h-[70%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View className="border-b border-[#E5E7EB] px-6 py-5">
              <View className="flex-row items-center justify-between">
                <HeadingBoldText style={{ fontSize: 18 }}>
                  {label || 'Select an option'}
                </HeadingBoldText>
                <TouchableOpacity
                  onPress={() => setIsOpen(false)}
                  className="w-8 h-8 items-center justify-center"
                >
                  <IconSymbol name="xmark" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Options List */}
            <ScrollView className="px-4 py-2">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    className={`py-4 px-4 rounded-xl my-1 flex-row items-center justify-between ${
                      isSelected ? 'bg-[#3B2F2F]' : 'bg-transparent'
                    }`}
                    activeOpacity={0.7}
                  >
                    <BodyRegularText
                      style={{ color: isSelected ? '#FFFFFF' : '#3B2F2F', fontSize: 16 }}
                    >
                      {option.label}
                    </BodyRegularText>
                    {isSelected && (
                      <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
