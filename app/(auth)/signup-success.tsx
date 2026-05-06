import { BagIcon, PartyIcon, ThreeStarsIcon } from "@/components/icons";
import ShopIcon from "@/components/icons/ShopIcon";
import { Button } from "@/components/ui/Button/Button";
import { Typography } from "@/components/ui/Typography/Typography";
import { useTour } from "@/contexts/TourContext";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

export default function SignupSuccessScreen() {
  const router = useRouter();
  const { startTour } = useTour();

  const handleGoToDashboard = async () => {
    await startTour();
    router.replace("/(tabs)/home");
  };

  const handleAddFirstProduct = async () => {
    await startTour();
    router.push("/(tabs)/product");
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 justify-center">
          <View className="px-4 py-6 gap-8 items-center justify-center">
            {/* Icon Circle - Shop Icon with Decorative Icons Below */}
            <View className="w-72 h-72 items-center border-6 border-slate-200 bg-[#d4a37314] rounded-full justify-center p-4">
              {/* Large Shop Icon Circle */}
              <View className="w-64 h-64 items-center justify-center bg-[#d4a3731a] rounded-full p-6">
                <View className="">
                  <ShopIcon color="#2D2D2D" />
                </View>

                {/* Decorative Icons Below */}
                <View className="flex-row items-center justify-center gap-2">
                  <PartyIcon color="#D4A373" />
                  <BagIcon color="#D4A373" />
                  <ThreeStarsIcon color="#D4A373" />
                </View>
              </View>
            </View>

            {/* Referral Bonus Badge */}
            <View className="flex-row items-center justify-center px-6 border border-brand-tan py-3 bg-brand-surface rounded-full mx-4 gap-2">
              <ThreeStarsIcon width={20} height={20} color="#D4A373" />
              <Typography
                variation="body-sm"
                className="text-brand-tan text-center font-sans-bold"
              >
                REFERRAL BONUS APPLIED: +50 POINTS
              </Typography>
            </View>

            {/* Welcome Message */}
            <View className="mx-6">
              <Typography
                variation="h1"
                className="text-center mb-4 font-sans-extrabold text-slate-800"
              >
                Welcome to the Verse!
              </Typography>
              <Typography
                variation="h5"
                className="text-center text-slate-600 leading-loose tracking-wide px-10 font-sans-medium"
              >
                Your store is ready. Start listing your items and reach thrift
                lovers across Nepal.
              </Typography>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="px-6 py-6 gap-8">
            {/* Go to Dashboard Button */}
            <Button
              label="Go to Dashboard"
              variant="primary"
              onPress={handleGoToDashboard}
              fullWidth={true}
            />

            {/* Add Your First Product Button */}
            <Button
              label="Add Your First Product"
              variant="accent"
              onPress={handleAddFirstProduct}
              fullWidth={true}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
