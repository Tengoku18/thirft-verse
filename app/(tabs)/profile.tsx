import { GearIcon } from "@/components/icons";
import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { TAB_ICON_BTN_STYLE } from "@/components/navigation/TabHeader";
import {
  ProfileScreenSkeleton,
  StoreProductGrid,
  StoreProfileActions,
  StoreProfileHeader,
  StoreTab,
  StoreTabBar,
} from "@/components/store-profile";
import { useAuth } from "@/contexts/AuthContext";
import { getProductsByStoreId } from "@/lib/database-helpers";
import { Product } from "@/lib/types/database";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Share, TouchableOpacity } from "react-native";

export default function ProfileV2Screen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector((state) => state.profile.profile);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StoreTab>("active");

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      dispatch(fetchUserProfile(user.id));
      const result = await getProductsByStoreId({
        storeId: user.id,
        limit: 1000,
      });
      setAllProducts(result.data ?? []);
    } catch (e) {
      console.error("Error loading profile data:", e);
    } finally {
      setLoading(false);
    }
  }, [user, dispatch]);

  const products = allProducts.filter((product) => {
    if (activeTab === "active") {
      return product.status === "available";
    } else if (activeTab === "out_of_stock") {
      return product.status === "out_of_stock";
    }
    return true;
  });

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
      <GearIcon width={20} height={20} color="#3B2F2F" />
    </TouchableOpacity>
  );

  if (loading) {
    return <ProfileScreenSkeleton rightComponent={settingsButton} />;
  }

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

      <StoreProductGrid
        products={products}
        emptyMessage={
          activeTab === "out_of_stock"
            ? "No out of stock items"
            : "No products yet"
        }
      />
    </TabScreenLayout>
  );
}
