import { IconSymbol } from "@/components/ui/icon-symbol";
import { INPUT_COLORS } from "@/constants/theme";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  Modal,
  Platform,
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
    variant === "error" || errorMessage
      ? "#DC2626"
      : selectedOption
        ? INPUT_COLORS.borderFocus
        : INPUT_COLORS.border;

  const renderOption: ListRenderItem<SelectOption> = ({ item: option }) => {
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
          <Typography
            variation="body"
            className={isSelected ? "text-white" : "text-[#3B2F2F]"}
          >
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

      {/* Select Trigger */}
      <TouchableOpacity
        onPress={() => !isDisabled && setIsOpen(true)}
        disabled={isDisabled}
        activeOpacity={0.7}
        className={
          containerClassName ||
          `flex-row items-center rounded-full px-4 bg-white border ${
            Platform.OS === "ios" ? "py-4" : ""
          } ${isDisabled ? "opacity-50" : ""}`
        }
        style={{ borderColor }}
      >
        {/* Left Icon */}
        {leftIcon && (
          <View className="mr-2 h-full flex-row items-center justify-center">
            {leftIcon}
          </View>
        )}

        {/* Selected Value / Placeholder */}
        <Typography
          variation="body"
          className="flex-1"
          style={{
            color: selectedOption
              ? INPUT_COLORS.text
              : INPUT_COLORS.placeholder,
            fontSize: Platform.OS === "ios" ? 20 : 16,
          }}
        >
          {selectedOption?.label || placeholder}
        </Typography>

        {/* Chevron */}
        <View className="ml-2">
          <IconSymbol
            name="chevron.up.chevron.down"
            size={16}
            color={INPUT_COLORS.icon}
          />
        </View>
      </TouchableOpacity>

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
                <Typography
                  variation="h3"
                  className="font-heading-bold"
                >
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
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2">
                  <IconSymbol
                    name="magnifyingglass"
                    size={18}
                    color="#6B7280"
                  />
                  <TextInput
                    ref={searchInputRef}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={searchPlaceholder}
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
                      <IconSymbol
                        name="xmark.circle.fill"
                        size={18}
                        color="#9CA3AF"
                      />
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
                  <Typography
                    variation="body"
                    className="text-gray-500 mt-3"
                  >
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
