import {
  SettingsCard,
  SettingsDivider,
  SettingsSectionHeader,
} from "@/components/settings";
import { ChartBarFillIcon, MailIcon } from "@/components/icons";
import { PrivacyRow } from "./PrivacyRow";
import React from "react";
import { ActivityIndicator, Switch, View } from "react-native";

interface PreferencesSectionProps {
  loaded: boolean;
  marketingEnabled: boolean;
  analyticsEnabled: boolean;
  onMarketingToggle: (val: boolean) => void;
  onAnalyticsToggle: (val: boolean) => void;
}

export function PreferencesSection({
  loaded,
  marketingEnabled,
  analyticsEnabled,
  onMarketingToggle,
  onAnalyticsToggle,
}: PreferencesSectionProps) {
  return (
    <View className="gap-2">
      <SettingsSectionHeader title="Preferences" />
      <SettingsCard>
        {loaded ? (
          <>
            <PrivacyRow
              icon={<MailIcon width={18} height={18} color="#3B3030" />}
              title="Marketing Emails"
              subtitle="Deals, product drops & seller tips"
              right={
                <Switch
                  value={marketingEnabled}
                  onValueChange={onMarketingToggle}
                  trackColor={{ false: "#E5E1DA", true: "#3B3030" }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E5E1DA"
                />
              }
            />
            <SettingsDivider />
            <PrivacyRow
              icon={<ChartBarFillIcon width={18} height={18} color="#3B3030" />}
              title="Usage Analytics"
              subtitle="Anonymous data that improves the app"
              right={
                <Switch
                  value={analyticsEnabled}
                  onValueChange={onAnalyticsToggle}
                  trackColor={{ false: "#E5E1DA", true: "#3B3030" }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#E5E1DA"
                />
              }
            />
          </>
        ) : (
          <View className="py-8 items-center">
            <ActivityIndicator color="#3B3030" />
          </View>
        )}
      </SettingsCard>
    </View>
  );
}
