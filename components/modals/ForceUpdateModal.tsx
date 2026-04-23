import { Typography } from "@/components/ui/Typography/Typography";
import Constants from "expo-constants";
import React from "react";
import { Linking, Platform, Pressable, View } from "react-native";
import { BlurModal } from "../ui/BlurModal";

const STORE_URL =
  Platform.OS === "ios"
    ? `itms-apps://itunes.apple.com/np/app/thriftverse/id6758267809`
    : `market://details?id=com.thriftverse.app`;

async function openStore() {
  await Linking.openURL(STORE_URL);
}

interface ForceUpdateModalProps {
  visible: boolean;
}

export function ForceUpdateModal({ visible }: ForceUpdateModalProps) {
  const currentVersion = Constants.expoConfig?.version ?? "";

  return (
    <BlurModal visible={visible} onDismiss={() => {}} showCloseButton={false}>
      <View className="bg-white rounded-3xl p-8 gap-6 w-full">
        {/* Icon / header */}
        <View className="items-center gap-3">
          <View className="w-16 h-16 rounded-full bg-brand-tan items-center justify-center">
            <Typography variation="h1" className="text-3xl">
              🔄
            </Typography>
          </View>
          <Typography variation="h1" className="text-center text-2xl font-bold">
            Update Required
          </Typography>
        </View>

        {/* Description */}
        <View className="gap-2">
          <Typography variation="body" className="text-center text-slate-600">
            A new version of Thriftverse is available with important
            improvements.
          </Typography>
          {currentVersion ? (
            <Typography
              variation="caption"
              className="text-center text-slate-400"
            >
              Your version: {currentVersion}
            </Typography>
          ) : null}
        </View>

        {/* What's new callout */}
        <View className="bg-amber-50 rounded-xl p-4">
          <Typography
            variation="body-sm"
            className="text-amber-900 text-center"
          >
            Please update the app to continue using Thriftverse. This ensures
            you have the latest features and security fixes.
          </Typography>
        </View>

        {/* CTA — no dismiss option */}
        <Pressable
          className="bg-brand-tan rounded-xl py-4 active:opacity-80"
          onPress={openStore}
        >
          <Typography
            variation="h3"
            className="text-center font-semibold text-white"
          >
            Update Now
          </Typography>
        </Pressable>
      </View>
    </BlurModal>
  );
}
