import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { TAB_ICON_BTN_STYLE } from "@/components/navigation/TabHeader";
import {
  StoreProductGrid,
  StoreProfileActions,
  StoreProfileHeader,
  StoreTab,
  StoreTabBar,
} from "@/components/store-profile";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsByStoreId } from "@/lib/database-helpers";
import { Product } from "@/lib/types/database";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Share, TouchableOpacity, View } from "react-native";

export default function ProfileV2Screen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector((state) => state.profile.profile);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StoreTab>("items");

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      dispatch(fetchUserProfile(user.id));
      const result = await getProductsByStoreId({
        storeId: user.id,
        status: "available",
      });
      setProducts(result.data ?? []);
    } catch (e) {
      console.error("Error loading profile data:", e);
    } finally {
      setLoading(false);
    }
  }, [user, dispatch]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleShare = async () => {
    if (!profile?.store_username) return;
    await Share.share({
      message: `Check out ${profile.name}'s store on Thriftverse: https://thriftverse.shop/${profile.store_username}`,
    });
  };

  const settingsButton = (
    <TouchableOpacity
      onPress={() => router.push("/settings" as any)}
      activeOpacity={0.8}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={TAB_ICON_BTN_STYLE}
    >
      <IconSymbol name="gearshape.fill" size={20} color="#3B2F2F" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <TabScreenLayout
        title="Profile"
        headerVariant="light"
        scrollable={false}
        rightComponent={settingsButton}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </TabScreenLayout>
    );
  }

  // const salesCount = (profile?.revenue as any)?.confirmedAmount
  //   ? Math.floor((profile?.revenue as any).confirmedAmount / 500)
  //   : 0;

  return (
    <TabScreenLayout
      title="Profile"
      headerVariant="light"
      onRefresh={loadData}
      backgroundColor="#FAF7F2"
      rightComponent={settingsButton}
    >
      <StoreProfileHeader
        name={profile?.name ?? "Store"}
        storeUsername={profile?.store_username ?? ""}
        bio={profile?.bio}
        profileImage={profile?.profile_image}
        isFounder={profile?.is_founder}
      />

      <StoreProfileActions
        onEditProfile={() => router.push("/settings/edit-profile" as any)}
        onShare={handleShare}
      />

      {/* <StoreStats productCount={products.length} salesCount={salesCount} /> */}

      <StoreTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <StoreProductGrid products={products} />
    </TabScreenLayout>
  );
}
