import { FullScreenLoader } from "@/components/atoms/FullScreenLoader";
import {
  EarningsStatCard,
  PaymentHistoryItem,
  PaymentMethodCard,
  WithdrawModal,
} from "@/components/earnings";
import {
  ClockArrowIcon,
  CreditCardFillIcon,
  GearIcon,
} from "@/components/icons";
import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import { EsewaPaymentForm } from "@/components/payment/EsewaPaymentForm";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useTour } from "@/contexts/TourContext";
import { supabase } from "@/lib/supabase";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";

// ─────────────── Types ───────────────
interface PaymentData {
  payment_username: string;
  payment_qr_image: string | null;
}

interface WithdrawalRecord {
  amount: number;
  settledBy: string;
  transactionId: string;
  settlementDate: string;
}

interface RevenueData {
  pendingAmount: number;
  confirmedAmount: number;
  withdrawnAmount: number;
  withdrawalHistory: WithdrawalRecord[];
}

interface PaymentRequest {
  id: string;
  amount: number;
  status: "pending" | "released" | "rejected";
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
}

const PREVIEW_COUNT = 3;

// ─────────────── Screen ───────────────
export default function EarningsScreen() {
  const { user } = useAuth();
  const toast = useToast();
  const { isActive, isTransitioning, currentStep, registerTarget, measureAndSetSpotlight } =
    useTour();
  const earningsOverviewRef = useRef<View>(null);

  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    payment_username: "",
    payment_qr_image: null,
  });
  const [hasPaymentDetails, setHasPaymentDetails] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // ── Data loading ──
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("revenue, payment_username, payment_qr_image")
        .eq("id", user.id)
        .single();

      if (profile) {
        setRevenue(
          profile.revenue && typeof profile.revenue === "object"
            ? (profile.revenue as RevenueData)
            : null,
        );
        setPaymentData({
          payment_username: profile.payment_username || "",
          payment_qr_image: profile.payment_qr_image || null,
        });
        setHasPaymentDetails(
          !!(profile.payment_username && profile.payment_qr_image),
        );
      }

      const { data: requests, error: requestsError } = await supabase
        .from("payment_requests")
        .select("id, amount, status, notes, admin_notes, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!requestsError && requests) {
        setPaymentRequests(requests as PaymentRequest[]);
      }
    } catch (err) {
      console.error("Error loading earnings:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  useEffect(() => {
    registerTarget("earnings_overview", earningsOverviewRef);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useFocusEffect(
    useCallback(() => {
      if (isActive && currentStep?.key === "earnings_overview") {
        measureAndSetSpotlight("earnings_overview");
      }
    }, [isActive, currentStep, measureAndSetSpotlight]),
  );

  // Re-attempt measurement after data loads — the ref View only renders once
  // loading=false and hasPaymentDetails=true, so early attempts (during loading) fail silently.
  useEffect(() => {
    if (loading || !hasPaymentDetails || !isActive || isTransitioning) return;
    if (currentStep?.key === "earnings_overview") {
      measureAndSetSpotlight("earnings_overview");
    }
  }, [loading, hasPaymentDetails, isActive, isTransitioning, currentStep?.key, measureAndSetSpotlight]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Withdrawal submission ──
  const handleWithdrawSubmit = async (amount: number, note: string) => {
    if (!user) return;

    const { error: insertError } = await supabase
      .from("payment_requests")
      .insert({
        user_id: user.id,
        amount,
        status: "pending",
        payment_method: paymentData.payment_username || "Not specified",
        account_details: {
          payment_username: paymentData.payment_username,
          payment_qr_image: paymentData.payment_qr_image,
        },
        notes: note || null,
      });

    if (insertError) throw new Error(insertError.message);

    const current: RevenueData = revenue ?? {
      pendingAmount: 0,
      confirmedAmount: 0,
      withdrawnAmount: 0,
      withdrawalHistory: [],
    };

    const updated: RevenueData = {
      ...current,
      confirmedAmount: Math.max(0, current.confirmedAmount - amount),
      withdrawnAmount: current.withdrawnAmount + amount,
      withdrawalHistory: [
        ...current.withdrawalHistory,
        {
          amount,
          settledBy: "",
          transactionId: "",
          settlementDate: new Date().toISOString(),
        },
      ],
    };

    const { error: revenueError } = await supabase
      .from("profiles")
      .update({ revenue: updated, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (revenueError) {
      console.error("Revenue update error:", revenueError);
      toast.error("Request sent, but balance sync failed. Refresh to update.");
    } else {
      setRevenue(updated);
    }

    toast.success("Withdrawal request submitted!");
    setShowWithdrawModal(false);
    await loadData();
  };

  // ── Loading state ──
  if (loading) {
    return (
      <TabScreenLayout
        title="Earnings"
        headerVariant="light"
        scrollable={false}
      >
        <FullScreenLoader message="Loading your earnings..." />
      </TabScreenLayout>
    );
  }

  // ── Payment setup state ──
  if (!hasPaymentDetails) {
    return (
      <TabScreenLayout
        title="Earnings"
        headerVariant="light"
        contentContainerStyle={{ padding: 20 }}
      >
        <EsewaPaymentForm
          userId={user?.id ?? ""}
          initialUsername={paymentData.payment_username}
          initialQrImage={paymentData.payment_qr_image}
          title="Setup Payment"
          subtitle="Link your eSewa wallet to start receiving withdrawals."
          onCancel={undefined}
          onSuccess={() => {
            setHasPaymentDetails(true);
            loadData();
          }}
        />
      </TabScreenLayout>
    );
  }

  // ── Main earnings view ──
  const confirmedBalance = revenue?.confirmedAmount ?? 0;
  const previewRequests = paymentRequests.slice(0, PREVIEW_COUNT);
  const hasMoreRequests = paymentRequests.length > PREVIEW_COUNT;

  return (
    <TabScreenLayout
      title="Earnings"
      headerVariant="light"
      onRefresh={loadData}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* ── Revenue stat cards ── */}
      <View ref={earningsOverviewRef} collapsable={false} style={{ gap: 12 }}>
        <EarningsStatCard
          label="Pending"
          amount={revenue?.pendingAmount ?? 0}
          description="Will be confirmed after order completion"
          backgroundColor="#FDF2B3"
          iconName="clock.fill"
          iconColor="#3B2F2F"
        />
        <EarningsStatCard
          label="Confirmed"
          amount={confirmedBalance}
          description="Available for withdrawal"
          backgroundColor="#D1E7D1"
          iconName="checkmark.circle.fill"
          iconColor="#3B2F2F"
        />
        <EarningsStatCard
          label="Withdrawn"
          amount={revenue?.withdrawnAmount ?? 0}
          description="Total amount cashed out"
          backgroundColor="#E5E1DA"
          iconName="payments"
          iconColor="#3B2F2F"
        />
      </View>

      {/* ── Withdraw CTA ── */}
      <TouchableOpacity
        onPress={() => setShowWithdrawModal(true)}
        activeOpacity={0.85}
        disabled={confirmedBalance <= 0}
        style={{
          backgroundColor: "#3B2F2F",
          borderRadius: 16,
          paddingVertical: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: confirmedBalance > 0 ? 1 : 0.45,
          shadowColor: "#3B2F2F",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <CreditCardFillIcon width={20} height={20} color="#FFFFFF" />
        <Typography
          variation="body-sm"
          style={{ color: "#FFFFFF", fontSize: 17, fontWeight: "600" }}
        >
          Withdraw Request
        </Typography>
      </TouchableOpacity>

      {confirmedBalance <= 0 && (
        <Typography
          variation="caption"
          style={{
            textAlign: "center",
            color: "rgba(59,48,48,0.4)",
            marginTop: -8,
          }}
        >
          No confirmed balance available for withdrawal
        </Typography>
      )}

      {/* ── Payment method card ── */}
      <PaymentMethodCard
        username={paymentData.payment_username}
        qrImageUrl={paymentData.payment_qr_image}
        onChangePress={() => router.push("/settings/payment-method")}
      />

      {/* ── Payment history ── */}
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            paddingHorizontal: 2,
          }}
        >
          <Typography
            variation="h3"
            style={{ fontSize: 18, color: "#3B2F2F", fontWeight: "700" }}
          >
            Payment History
          </Typography>
          <TouchableOpacity activeOpacity={0.7}>
            <GearIcon width={20} height={20} color="rgba(59,48,48,0.4)" />
          </TouchableOpacity>
        </View>

        {paymentRequests.length === 0 ? (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 32,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(59,48,48,0.06)",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                backgroundColor: "#F3F4F6",
                borderRadius: 28,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <ClockArrowIcon width={24} height={24} color="#9CA3AF" />
            </View>
            <Typography
              variation="body-sm"
              style={{ color: "#6B7280", textAlign: "center" }}
            >
              No withdrawal requests yet
            </Typography>
            <Typography
              variation="caption"
              style={{ color: "#9CA3AF", textAlign: "center", marginTop: 4 }}
            >
              Your requests will appear here
            </Typography>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {previewRequests.map((req) => (
              <PaymentHistoryItem
                key={req.id}
                amount={req.amount}
                createdAt={req.created_at}
                status={req.status}
                adminNotes={req.admin_notes}
              />
            ))}

            {hasMoreRequests && (
              <TouchableOpacity
                onPress={() => router.push("/earnings/all-transactions")}
                activeOpacity={0.7}
                style={{ alignItems: "center", paddingVertical: 12 }}
              >
                <Typography
                  variation="body-sm"
                  style={{ color: "#D4A373", fontSize: 14, fontWeight: "600" }}
                >
                  View All Transactions
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* ── Withdrawal modal (rendered outside scroll, inside layout) ── */}
      <WithdrawModal
        visible={showWithdrawModal}
        availableBalance={confirmedBalance}
        paymentUsername={paymentData.payment_username}
        onClose={() => setShowWithdrawModal(false)}
        onSubmit={handleWithdrawSubmit}
      />
    </TabScreenLayout>
  );
}
