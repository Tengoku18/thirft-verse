import { CustomHeader } from "@/components/navigation/CustomHeader";
import { IconSymbol } from "@/components/ui/icon-symbol";
import Typography from "@/components/ui/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface OrderDetailHeaderProps {
  orderCode: string;
  isEditable: boolean;
  isSeller: boolean;
  onEdit: () => void;
  onGuide: () => void;
}

export function OrderDetailHeader({
  orderCode, isEditable, isSeller, onEdit, onGuide,
}: OrderDetailHeaderProps) {
  return (
    <CustomHeader
      title={orderCode}
      showBackButton
      rightComponent={
        isSeller ? (
          <View className="flex-row items-center gap-2">
            {isEditable && (
              <TouchableOpacity
                onPress={onEdit}
                activeOpacity={0.7}
                className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50"
              >
                <IconSymbol name="pencil" size={14} color="#3B82F6" />
                <Typography variation="body-sm" style={{ color: "#3B82F6" }}>Edit</Typography>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onGuide}
              activeOpacity={0.7}
              className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-brand-espresso/5"
            >
              <IconSymbol name="book.fill" size={14} color="#3B2F2F" />
              <Typography variation="body-sm" className="text-brand-espresso">Guide</Typography>
            </TouchableOpacity>
          </View>
        ) : undefined
      }
    />
  );
}
