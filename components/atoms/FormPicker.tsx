import { Typography } from "@/components/ui/Typography";

import React, { useRef, useState } from "react";
import { CheckmarkIcon, ChevronRightIcon, SearchIcon, XIcon } from "@/components/icons";
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  FlatList,
  Dimensions,
  ListRenderItem,
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
  const searchInputRef = useRef<TextInput>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  const MODAL_HEIGHT = Dimensions.get("window").height * 0.8;

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
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const matchesLabel = option.label.toLowerCase().includes(query);
    const matchesDescription = option.description?.toLowerCase().includes(query);
    const matchesSearchable = option.searchableText?.toLowerCase().includes(query);
    return matchesLabel || matchesDescription || matchesSearchable;
  });

  const renderOption: ListRenderItem<PickerOption> = ({ item: option }) => {
    const isSelected = option.value === value;
    return (
      <TouchableOpacity
        onPress={() => handleSelect(option.value)}
        className={`py-4 px-4 rounded-xl my-1 flex-row items-center justify-between ${
          isSelected ? "bg-[#3B2F2F]" : "bg-transparent"
        }`}
        activeOpacity={0.7}
      >
        <View className="flex-1 mr-2">
          <Typography variation="body"
            style={{
              color: isSelected ? "#FFFFFF" : "#3B2F2F",
              fontSize: 16,
            }}
          >
            {option.label}
          </Typography>
          {option.description && (
            <Typography variation="body"
              style={{
                color: isSelected ? "#E5E7EB" : "#6B7280",
                fontSize: 13,
                marginTop: 4,
                lineHeight: 18,
              }}
            >
              {option.description}
            </Typography>
          )}
        </View>
        {isSelected && (
          <CheckmarkIcon width={20} height={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      {/* Label */}
      {label && (
        <Typography variation="label" className="mb-3" style={{ fontSize: 13 }}>
          {label}
          {required && <Typography variation="label" style={{ color: "#EF4444", fontSize: 13 }}> *</Typography>}
        </Typography>
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
        <Typography variation="body"
          className="flex-1"
          style={{ color: disabled ? '#6B7280' : (selectedOption ? '#3B2F2F' : '#9CA3AF'), fontSize: 15 }}
        >
          {selectedOption?.label || placeholder}
        </Typography>
        <ChevronRightIcon width={20} height={20} color={disabled ? "#9CA3AF" : "#6B705C"} />
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <Typography variation="caption" className="mt-2" style={{ color: "#EF4444", fontSize: 13 }}>
          {error}
        </Typography>
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
              className="bg-white rounded-t-3xl"
              style={{ height: MODAL_HEIGHT }}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <View className="border-b border-[#E5E7EB] px-6 py-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Typography variation="h2" style={{ fontSize: 18 }}>
                    {label || "Select an option"}
                  </Typography>
                  <TouchableOpacity
                    onPress={handleClose}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <XIcon width={20} height={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Search Input */}
                {options.length > 5 && (
                  <View className="flex-row items-center bg-[#F3F4F6] rounded-xl px-4 py-2">
                    <SearchIcon width={18} height={18} color="#6B7280" />
                    <TextInput
                      ref={searchInputRef}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search by name or area..."
                      placeholderTextColor="#9CA3AF"
                      className="flex-1 ml-2 text-[#3B2F2F]"
                      style={{
                        fontSize: 15,
                        fontFamily: "NunitoSans_400Regular",
                      }}
                      autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setSearchQuery("");
                          searchInputRef.current?.focus();
                        }}
                      >
                        <XIcon width={18} height={18} color="#9CA3AF" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Options List */}
              <FlatList
                data={filteredOptions}
                renderItem={renderOption}
                keyExtractor={(item) => item.value}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View className="flex-1 justify-center items-center py-12">
                    <SearchIcon width={40} height={40} color="#D1D5DB" />
                    <Typography variation="label"
                      style={{
                        color: "#6B7280",
                        fontSize: 15,
                        marginTop: 12,
                      }}
                    >
                      {searchQuery.trim()
                        ? `No results for "${searchQuery.trim()}"`
                        : "No options available"}
                    </Typography>
                    {searchQuery.trim() && (
                      <Typography variation="body"
                        style={{
                          color: "#9CA3AF",
                          fontSize: 13,
                          marginTop: 4,
                        }}
                      >
                        Try a different search term
                      </Typography>
                    )}
                  </View>
                }
              />
            </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
