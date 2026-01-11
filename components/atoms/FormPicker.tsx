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
  TextInput,
} from "react-native";

export interface PickerOption {
  label: string;
  value: string;
  description?: string; // Optional description shown below label
  searchableText?: string; // Additional text to search through (not displayed)
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
  const [searchQuery, setSearchQuery] = useState("");
  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  // Filter options based on search query (search in label, description, and searchableText)
  const filteredOptions = options.filter((option) => {
    const query = searchQuery.toLowerCase();
    const matchesLabel = option.label.toLowerCase().includes(query);
    const matchesDescription = option.description?.toLowerCase().includes(query);
    const matchesSearchable = option.searchableText?.toLowerCase().includes(query);
    return matchesLabel || matchesDescription || matchesSearchable;
  });

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
            ? "border-[#EF4444] bg-[#FEF2F2]"
            : disabled
              ? "border-[#E5E7EB] bg-[#F9FAFB]"
              : isOpen || selectedOption
                ? "border-[#3B2F2F] bg-white"
                : "border-[#E5E7EB] bg-white"
        }`}
        activeOpacity={0.7}
      >
        <BodyRegularText
          className="flex-1"
          style={{ color: disabled ? '#6B7280' : (selectedOption ? '#3B2F2F' : '#9CA3AF'), fontSize: 15 }}
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
        onRequestClose={handleClose}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={handleClose}
        >
          <Pressable
            className="bg-white rounded-t-3xl max-h-[70%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View className="border-b border-[#E5E7EB] px-6 py-4">
              <View className="flex-row items-center justify-between mb-3">
                <HeadingBoldText style={{ fontSize: 18 }}>
                  {label || 'Select an option'}
                </HeadingBoldText>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 items-center justify-center"
                >
                  <IconSymbol name="xmark" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              {options.length > 5 && (
                <View className="flex-row items-center bg-[#F3F4F6] rounded-xl px-4 py-2">
                  <IconSymbol name="magnifyingglass" size={18} color="#6B7280" />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search..."
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 ml-2 text-[#3B2F2F]"
                    style={{ fontSize: 15, fontFamily: 'NunitoSans_400Regular' }}
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <IconSymbol name="xmark.circle.fill" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Options List */}
            <ScrollView className="px-4 py-2">
              {filteredOptions.length === 0 ? (
                <View className="py-8 items-center">
                  <BodyRegularText style={{ color: "#9CA3AF" }}>
                    No results found
                  </BodyRegularText>
                </View>
              ) : (
                filteredOptions.map((option) => {
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
                    <View className="flex-1 mr-2">
                      <BodyRegularText
                        style={{ color: isSelected ? '#FFFFFF' : '#3B2F2F', fontSize: 16 }}
                      >
                        {option.label}
                      </BodyRegularText>
                      {option.description && (
                        <BodyRegularText
                          style={{
                            color: isSelected ? '#E5E7EB' : '#6B7280',
                            fontSize: 13,
                            marginTop: 4,
                            lineHeight: 18
                          }}
                        >
                          {option.description}
                        </BodyRegularText>
                      )}
                    </View>
                    {isSelected && (
                      <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                );
              }))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
