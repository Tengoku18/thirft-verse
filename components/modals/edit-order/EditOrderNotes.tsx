import { Textarea } from "@/components/ui/TextareaInput";
import Typography from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

interface Props {
  notes: string;
  onNotesChange: (v: string) => void;
}

export function EditOrderNotes({ notes, onNotesChange }: Props) {
  return (
    <View className="gap-4">
      <Typography variation="h5" className="text-brand-espresso">
        Additional Notes (Optional)
      </Typography>
      <Textarea
        placeholder="Any special instructions for delivery..."
        value={notes}
        onChangeText={onNotesChange}
        maxLength={500}
        numberOfLines={3}
      />
    </View>
  );
}
