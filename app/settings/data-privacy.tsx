import { ScreenLayout } from "@/components/layouts";
import { DangerZoneSection } from "@/components/data-privacy/DangerZoneSection";
import { DataSummarySheet, DataSummary } from "@/components/data-privacy/DataSummarySheet";
import { DeleteModal, DeleteInfo } from "@/components/data-privacy/DeleteModal";
import { PreferencesSection } from "@/components/data-privacy/PreferencesSection";
import { PrivacyHeaderCard } from "@/components/data-privacy/PrivacyHeaderCard";
import { YourDataSection } from "@/components/data-privacy/YourDataSection";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { getOrdersBySeller } from "@/lib/database-helpers";
import { supabase } from "@/lib/supabase";
import { clearAuth, signOutUser } from "@/store/authSlice";
import { clearProfile } from "@/store/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Linking, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MARKETING_KEY = "@thriftverse:marketing_emails";
const ANALYTICS_KEY = "@thriftverse:analytics_enabled";

// Any of these statuses means the order is still active
const ACTIVE_ORDER_STATUSES = ["pending", "processing", "confirmed", "shipped"];

export default function DataPrivacyScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const profile = useAppSelector((s) => s.profile.profile);
  const insets = useSafeAreaInsets();

  // Preferences
  const [marketingEnabled, setMarketingEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState<DeleteInfo | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Summary sheet
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);

  // ── Preferences ──
  useEffect(() => {
    AsyncStorage.multiGet([MARKETING_KEY, ANALYTICS_KEY]).then((pairs) => {
      if (pairs[0][1] !== null) setMarketingEnabled(pairs[0][1] === "true");
      if (pairs[1][1] !== null) setAnalyticsEnabled(pairs[1][1] === "true");
      setPrefsLoaded(true);
    });
  }, []);

  const handleMarketingToggle = useCallback(async (val: boolean) => {
    setMarketingEnabled(val);
    await AsyncStorage.setItem(MARKETING_KEY, String(val));
  }, []);

  const handleAnalyticsToggle = useCallback(async (val: boolean) => {
    setAnalyticsEnabled(val);
    await AsyncStorage.setItem(ANALYTICS_KEY, String(val));
  }, []);

  // ── Data summary ──
  const handleViewSummary = useCallback(async () => {
    if (!user) return;
    setShowSummaryModal(true);
    setSummaryLoading(true);
    try {
      const [activeRes, totalRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("seller_id", user.id).eq("status", "active"),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("seller_id", user.id),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("seller_id", user.id),
      ]);
      setDataSummary({
        name: profile?.name || "—",
        email: user.email || "—",
        memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—",
        activeListings: activeRes.count ?? 0,
        totalListings: totalRes.count ?? 0,
        totalOrders: ordersRes.count ?? 0,
      });
    } catch {
      toast.error("Could not load your data");
      setShowSummaryModal(false);
    } finally {
      setSummaryLoading(false);
    }
  }, [user, profile, toast]);

  // ── Export ──
  const handleExportData = useCallback(() => {
    const subject = encodeURIComponent("Data Export Request – Thriftverse");
    const body = encodeURIComponent(`Hi Thriftverse,\n\nPlease send an export of all data for my account.\n\nEmail: ${user?.email ?? ""}\n\nThank you.`);
    Linking.openURL(`mailto:hello@thriftverse.shop?subject=${subject}&body=${body}`);
  }, [user]);

  // ── Open delete modal — check orders first ──
  const handleDeletePress = useCallback(async () => {
    if (!user) return;
    setDeleteInfo(null);
    setShowDeleteModal(true);
    try {
      const [ordersResult, listingsRes] = await Promise.all([
        getOrdersBySeller(user.id),
        supabase.from("products").select("id", { count: "exact", head: true }).eq("seller_id", user.id),
      ]);
      const activeOrders = ordersResult.success
        ? ordersResult.data.filter((o: any) => ACTIVE_ORDER_STATUSES.includes(o.status)).length
        : 0;
      setDeleteInfo({
        activeOrders,
        totalListings: listingsRes.count ?? 0,
      });
    } catch {
      toast.error("Could not check account status.");
      setShowDeleteModal(false);
    }
  }, [user, toast]);

  // ── Confirm deletion ──
  const handleDeleteConfirm = useCallback(async () => {
    if (!user) return;
    setDeleteLoading(true);
    try {
      // Re-verify no active orders at deletion time (race condition guard)
      const liveOrdersResult = await getOrdersBySeller(user.id);
      const liveActiveOrders = liveOrdersResult.success
        ? liveOrdersResult.data.filter((o: any) => ACTIVE_ORDER_STATUSES.includes(o.status)).length
        : 0;
      if (liveActiveOrders > 0) {
        toast.error("You still have active orders. Complete them before deleting your account.");
        setDeleteLoading(false);
        setDeleteInfo({ activeOrders: liveActiveOrders, totalListings: deleteInfo?.totalListings ?? 0 });
        return;
      }
      await supabase.from("products").delete().eq("seller_id", user.id);
      const { error: rpcError } = await supabase.rpc("delete_user");
      if (rpcError) {
        await supabase.from("profiles").update({ name: "Deleted User", profile_image: null, payment_username: null, payment_qr_image: null, store_username: null }).eq("id", user.id);
      }
      await AsyncStorage.multiRemove([MARKETING_KEY, ANALYTICS_KEY]);
      await dispatch(signOutUser());
      dispatch(clearAuth());
      dispatch(clearProfile());
      router.replace("/(auth)/signin" as any);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setDeleteLoading(false);
    }
  }, [user, deleteInfo, dispatch, router, toast]);

  const handleCloseDeleteModal = useCallback(() => {
    if (deleteLoading) return;
    setShowDeleteModal(false);
    setDeleteInfo(null);
  }, [deleteLoading]);

  const handleViewOrders = useCallback(() => {
    setShowDeleteModal(false);
    router.push("/(tabs)/orders?filter=all" as any);
  }, [router]);

  return (
    <ScreenLayout title="Data & Privacy" contentBackgroundColor="#F5F5F5">
      <View className="pt-5 pb-10 gap-6">
        <PrivacyHeaderCard />
        <PreferencesSection
          loaded={prefsLoaded}
          marketingEnabled={marketingEnabled}
          analyticsEnabled={analyticsEnabled}
          onMarketingToggle={handleMarketingToggle}
          onAnalyticsToggle={handleAnalyticsToggle}
        />
        <YourDataSection onViewSummary={handleViewSummary} onExportData={handleExportData} />
        <DangerZoneSection onDeletePress={handleDeletePress} />
      </View>

      <DeleteModal
        visible={showDeleteModal}
        deleteInfo={deleteInfo}
        deleteLoading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onClose={handleCloseDeleteModal}
        onViewOrders={handleViewOrders}
      />
      <DataSummarySheet
        visible={showSummaryModal}
        loading={summaryLoading}
        summary={dataSummary}
        onClose={() => setShowSummaryModal(false)}
        bottomInset={insets.bottom}
      />
    </ScreenLayout>
  );
}
