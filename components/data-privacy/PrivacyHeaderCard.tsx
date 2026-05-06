import { LockIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import React from "react";
import { View } from "react-native";

export function PrivacyHeaderCard() {
  return (
    <View className="bg-white rounded-2xl border border-brand-beige/60 px-5 py-5 flex-row gap-4 items-center shadow-sm">
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center"
        style={{ backgroundColor: "rgba(59,48,48,0.07)" }}
      >
        <LockIcon width={22} height={22} color="#3B3030" />
      </View>
      <View className="flex-1">
        <Typography variation="body" className="text-brand-espresso font-sans-bold">
          Your data, your control
        </Typography>
        <Typography variation="body-sm" className="text-slate-400 mt-0.5 leading-relaxed">
          Manage what Thriftverse stores and how it&apos;s used.
        </Typography>
      </View>
    </View>
  );
}
