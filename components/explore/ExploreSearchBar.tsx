import SearchIcon from "@/components/icons/SearchIcon";
import XIcon from "@/components/icons/XIcon";
import React from "react";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function ExploreSearchBar({
  value,
  onChangeText,
  placeholder = "Search items, brands, or stores",
}: Props) {
  return (
    <View
      className="flex-row items-center rounded-full px-5 bg-white"
      style={{
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: "rgba(59,47,47,0.08)",
      }}
    >
      <SearchIcon size={18} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 ml-2.5"
        style={{
          fontSize: 15,
          color: "#3B2F2F",
          height: Platform.OS === "android" ? 50 : "100%",
          paddingVertical: Platform.OS === "android" ? 0 : undefined,
        }}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}
        >
          <XIcon width={16} height={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
