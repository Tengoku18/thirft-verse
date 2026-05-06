import {
  SettingsCard,
  SettingsDivider,
  SettingsSectionHeader,
} from "@/components/settings";
import { ShareIcon, UserIcon } from "@/components/icons";
import { PrivacyRow } from "./PrivacyRow";
import React from "react";
import { View } from "react-native";

interface YourDataSectionProps {
  onViewSummary: () => void;
  onExportData: () => void;
}

export function YourDataSection({
  onViewSummary,
  onExportData,
}: YourDataSectionProps) {
  return (
    <View className="gap-2">
      <SettingsSectionHeader title="Your Data" />
      <SettingsCard>
        <PrivacyRow
          icon={<UserIcon width={18} height={18} color="#3B3030" />}
          title="View Data Summary"
          subtitle="See what we hold about your account"
          onPress={onViewSummary}
        />
        <SettingsDivider />
        <PrivacyRow
          icon={<ShareIcon width={18} height={18} color="#3B3030" />}
          title="Request Data Export"
          subtitle="We'll email you a copy within 30 days"
          onPress={onExportData}
        />
      </SettingsCard>
    </View>
  );
}
