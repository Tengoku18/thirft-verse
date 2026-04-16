import SearchIcon from "@/components/icons/SearchIcon";
import XIcon from "@/components/icons/XIcon";
import { INPUT_COLORS } from "@/constants/theme";
import React, { forwardRef } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchInputProps extends Omit<TextInputProps, "ref"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  clearable?: boolean;
  onClear?: () => void;
  showSearchIcon?: boolean;
  showClearIcon?: boolean;
}

/**
 * SearchInput Component
 * A reusable, pill-shaped search input field with optional search and clear icons.
 *
 * @example
 * ```tsx
 * const [search, setSearch] = useState("");
 * <SearchInput
 *   value={search}
 *   onChangeText={setSearch}
 *   placeholder="Search districts..."
 *   clearable
 *   onClear={() => setSearch("")}
 * />
 * ```
 */
export const SearchInput = forwardRef<TextInput, SearchInputProps>(
  (
    {
      value,
      onChangeText,
      placeholder = "Search...",
      clearable = true,
      onClear,
      showSearchIcon = true,
      showClearIcon = true,
      ...props
    },
    ref,
  ) => {
    const handleClear = () => {
      onChangeText("");
      onClear?.();
      // Auto-focus after clearing
      if (ref && "current" in ref) {
        ref.current?.focus();
      }
    };

    return (
      <View className="flex-row items-center bg-gray-100 rounded-full px-6">
        {/* Search Icon */}
        {showSearchIcon && (
          <SearchIcon width={20} height={20} color={INPUT_COLORS.icon} />
        )}

        {/* Text Input */}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={INPUT_COLORS.placeholder}
          className={`flex-1 font-sans-regular text-input-text px-2 py-4 ${
            showSearchIcon ? "ml-2" : ""
          }`}
          style={{
            fontSize: 20,
            color: INPUT_COLORS.text,
            textAlignVertical: "center",
          }}
          autoCorrect={false}
          {...props}
        />

        {/* Clear Icon */}
        {clearable && showClearIcon && value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            className="ml-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
          >
            <XIcon width={18} height={18} color={INPUT_COLORS.icon} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

SearchInput.displayName = "SearchInput";
