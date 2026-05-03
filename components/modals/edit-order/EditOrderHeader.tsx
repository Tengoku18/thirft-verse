import Typography from "@/components/ui/Typography";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { XIcon } from "@/components/icons";

interface Props {
  onClose: () => void;
  disabled: boolean;
}

export function EditOrderHeader({ onClose, disabled }: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
      <View>
        <Typography variation="h4">Edit Order Details</Typography>
        <Typography variation="caption" className="text-gray-400 mt-0.5">
          Update buyer information before sending to NCM
        </Typography>
      </View>
      <TouchableOpacity
        onPress={onClose}
        disabled={disabled}
        className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
      >
        <XIcon width={16} height={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}
