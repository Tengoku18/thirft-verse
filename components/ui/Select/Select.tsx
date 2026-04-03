import { IconSymbol } from "@/components/ui/icon-symbol";
import { SearchInput } from "@/components/ui/SearchInput";
import { Colors, INPUT_COLORS } from "@/constants/theme";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Typography from "../Typography";

export type SelectVariant = "default" | "error" | "disabled";

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
  searchableText?: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  variant?: SelectVariant;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  errorMessage?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  modalTitle?: string;
  disabled?: boolean;
}

const MODAL_HEIGHT = Dimensions.get("window").height * 0.8;

export function Select({
  label,
  placeholder = "Select an option",
  variant = "default",
  leftIcon,
  containerClassName,
  labelClassName,
  errorMessage,
  value,
  options,
  onChange,
  searchable = true,
  searchPlaceholder = "Search...",
  modalTitle,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const isDisabled = variant === "disabled" || disabled;

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const filteredOptions = options.filter((option) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      option.label.toLowerCase().includes(query) ||
      option.description?.toLowerCase().includes(query) ||
      option.searchableText?.toLowerCase().includes(query)
    );
  });

  const borderColor =
    variant === "error" || errorMessage ? "#DC2626" : INPUT_COLORS.border;

  const renderOption: ListRenderItem<SelectOption> = ({ item: option }) => {
    const isSelected = option.value === value;
    return (
      <TouchableOpacity
        onPress={() => handleSelect(option.value)}
        className="py-4 px-4 rounded-xl my-1 flex-row items-center justify-between"
        style={{
          backgroundColor: isSelected
            ? "rgba(212, 163, 115, 0.15)"
            : "transparent",
        }}
        activeOpacity={0.7}
      >
        <View className="flex-1 mr-2">
          <Typography variation="body" style={{ color: Colors.light.text }}>
            {option.label}
          </Typography>
          {option.description && (
            <Typography
              variation="body-sm"
              className={`mt-1 ${isSelected ? "text-gray-300" : "text-gray-500"}`}
            >
              {option.description}
            </Typography>
          )}
        </View>
        {isSelected && (
          <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {/* Label */}
      {label && (
        <Typography
          variation="body"
          className={
            labelClassName || "text-input-label font-sans-semibold mb-2"
          }
        >
          {label}
        </Typography>
      )}

      {/* Select Trigger - Search Style */}
      <Pressable
        onPress={() => !isDisabled && setIsOpen(true)}
        disabled={isDisabled}
        className={
          containerClassName ||
          `flex-row items-center rounded-3xl px-4 py-5 bg-white border ${
            isDisabled ? "opacity-50" : ""
          }`
        }
        style={{ borderColor }}
      >
        {/* Search Icon */}
        {leftIcon && <View className="mr-2">{leftIcon}</View>}

        {/* Selected Value / Placeholder Text Input (non-editable) */}
        <View className="flex-1">
          <TextInput
            editable={false}
            style={{
              color: selectedOption
                ? INPUT_COLORS.text
                : INPUT_COLORS.placeholder,
              fontSize: 15,
            }}
            className="font-sans-regular text-input-text"
            value={selectedOption?.label || ""}
            placeholder={placeholder}
            placeholderTextColor={INPUT_COLORS.placeholder}
            pointerEvents="none"
          />
        </View>

        {/* Chevron */}
        <View className="ml-2">
          <IconSymbol
            name="chevron.up.chevron.down"
            size={16}
            color={INPUT_COLORS.icon}
          />
        </View>
      </Pressable>

      {/* Error Message */}
      {errorMessage && (
        <Typography variation="caption" className="text-status-error mt-2">
          {errorMessage}
        </Typography>
      )}

      {/* Modal */}
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
            <View className="border-b border-gray-200 px-6 py-4">
              <View className="flex-row items-center justify-between mb-3">
                <Typography variation="h3" className="font-heading-bold">
                  {modalTitle || label || "Select an option"}
                </Typography>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 items-center justify-center"
                >
                  <IconSymbol name="xmark" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Search */}
              {searchable && options.length > 5 && (
                <SearchInput
                  ref={searchInputRef}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={searchPlaceholder}
                  clearable
                  onClear={() => searchInputRef.current?.focus()}
                />
              )}
            </View>

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View className="flex-1 justify-center items-center py-12">
                  <IconSymbol
                    name="magnifyingglass"
                    size={40}
                    color="#D1D5DB"
                  />
                  <Typography variation="body" className="text-gray-500 mt-3">
                    {searchQuery.trim()
                      ? `No results for "${searchQuery.trim()}"`
                      : "No options available"}
                  </Typography>
                  {searchQuery.trim() && (
                    <Typography
                      variation="body-sm"
                      className="text-gray-400 mt-1"
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
}
