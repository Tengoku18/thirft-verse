import SearchIcon from "@/components/icons/SearchIcon";
import { Typography } from "@/components/ui/Typography";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export const HomeExploreSearchBar: React.FC = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push("/explore" as never)}
      activeOpacity={0.75}
      className="mx-5 mt-4"
      accessibilityLabel="Search marketplace"
      accessibilityRole="search"
    >
      <View
        className="flex-row items-center bg-white rounded-full px-5"
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
        <Typography
          variation="body"
          style={{ color: "#9CA3AF", marginLeft: 10, flex: 1, fontSize: 15 }}
        >
          Search items, brands, or stores
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
