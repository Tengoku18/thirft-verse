import {
  SettingsCard,
  SettingsSectionHeader,
} from "@/components/settings";
import { TrashIcon, WarningFillIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { PrivacyRow } from "./PrivacyRow";
import React from "react";
import { View } from "react-native";

interface DangerZoneSectionProps {
  onDeletePress: () => void;
}

export function DangerZoneSection({ onDeletePress }: DangerZoneSectionProps) {
  return (
    <View className="gap-2">
      <SettingsSectionHeader title="Danger Zone" />
      <SettingsCard>
        <PrivacyRow
          icon={<TrashIcon width={18} height={18} color="#DC2626" />}
          title="Delete Account"
          subtitle="Permanently removes all your data"
          onPress={onDeletePress}
          destructive
        />
      </SettingsCard>
      <View className="flex-row items-start gap-2 px-1 mt-1">
        <WarningFillIcon
          width={13}
          height={13}
          color="#F59E0B"
          style={{ marginTop: 2 }}
        />
        <Typography
          variation="body-sm"
          className="text-slate-400 flex-1 leading-relaxed"
        >
          Accounts with active orders cannot be deleted. Complete or cancel all
          orders before requesting deletion.
        </Typography>
      </View>
    </View>
  );
}
