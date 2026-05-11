import { FullScreenLoader } from "@/components/atoms/FullScreenLoader";
import type { PaymentRequestStatus } from "@/components/earnings";
import { PaymentHistoryItem } from "@/components/earnings";
import { ClockArrowIcon } from "@/components/icons";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Typography } from "@/components/ui/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

// ─────────────── Types ───────────────
interface PaymentRequest {
  id: string;
  amount: number;
  status: PaymentRequestStatus;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  processed_at: string | null;
  released_at: string | null;
  transaction_id: string | null;
}

type FilterStatus = "all" | PaymentRequestStatus;

// ─────────────── Filter pill ───────────────
interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterPill({ label, active, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="px-4 py-[7px] rounded-full border"
      style={{
        backgroundColor: active ? "#3B2F2F" : "#FFFFFF",
        borderColor: active ? "#3B2F2F" : "rgba(59,48,48,0.15)",
      }}
    >
      <Typography
        variation="label"
        style={{ color: active ? "#FFFFFF" : "rgba(59,48,48,0.6)" }}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
}

// ─────────────── Screen ───────────────
export default function AllTransactionsScreen() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const loadRequests = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payment_requests")
        .select("id, amount, status, notes, admin_notes, created_at, processed_at, released_at, transaction_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRequests(data as PaymentRequest[]);
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const totalPending = requests
    .filter((r) => r.status === "pending")
    .reduce((s, r) => s + r.amount, 0);
  const totalReleased = requests
    .filter((r) => r.status === "released")
    .reduce((s, r) => s + r.amount, 0);
  const totalRejected = requests
    .filter((r) => r.status === "rejected")
    .reduce((s, r) => s + r.amount, 0);

  const formatAmt = (n: number) =>
    `रु ${n.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

  return (
    <ScreenLayout
      title="All Transactions"
      backgroundColor="#FAF7F2"
      contentBackgroundColor="#FAF7F2"
      onRefresh={loadRequests}
    >
      {loading ? (
        <FullScreenLoader message="Loading transactions..." />
      ) : (
        <>
          {/* ── Summary cards ── */}
          <View className="flex-row gap-2.5 mt-4 mb-5">
            {/* Pending */}
            <View
              className="flex-1 rounded-[14px] p-3.5 border"
              style={{ backgroundColor: "#FDF2B3", borderColor: "rgba(0,0,0,0.04)" }}
            >
              <Typography
                variation="caption"
                className="uppercase mb-1"
                style={{ color: "rgba(59,48,48,0.55)", letterSpacing: 0.8 }}
              >
                Pending
              </Typography>
              <Typography variation="label" style={{ color: "#3B2F2F" }}>
                {formatAmt(totalPending)}
              </Typography>
            </View>

            {/* Released */}
            <View
              className="flex-1 rounded-[14px] p-3.5 border"
              style={{ backgroundColor: "#D1E7D1", borderColor: "rgba(0,0,0,0.04)" }}
            >
              <Typography
                variation="caption"
                className="uppercase mb-1"
                style={{ color: "rgba(59,48,48,0.55)", letterSpacing: 0.8 }}
              >
                Released
              </Typography>
              <Typography variation="label" style={{ color: "#3B2F2F" }}>
                {formatAmt(totalReleased)}
              </Typography>
            </View>

            {/* Rejected */}
            <View
              className="flex-1 rounded-[14px] p-3.5 border"
              style={{ backgroundColor: "#FEE2E2", borderColor: "rgba(0,0,0,0.04)" }}
            >
              <Typography
                variation="caption"
                className="uppercase mb-1"
                style={{ color: "rgba(59,48,48,0.55)", letterSpacing: 0.8 }}
              >
                Rejected
              </Typography>
              <Typography variation="label" style={{ color: "#3B2F2F" }}>
                {formatAmt(totalRejected)}
              </Typography>
            </View>
          </View>

          {/* ── Filter pills ── */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {(["all", "pending", "approved", "released", "rejected"] as FilterStatus[]).map(
              (f) => (
                <FilterPill
                  key={f}
                  label={f.charAt(0).toUpperCase() + f.slice(1)}
                  active={filter === f}
                  onPress={() => setFilter(f)}
                />
              ),
            )}
          </View>

          {/* ── List ── */}
          {filtered.length === 0 ? (
            <View
              className="rounded-2xl p-9 items-center mt-2 border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(59,48,48,0.06)" }}
            >
              <View
                className="w-[52px] h-[52px] rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: "#F3F4F6" }}
              >
                <ClockArrowIcon width={22} height={22} color="#9CA3AF" />
              </View>
              <Typography
                variation="body-sm"
                className="text-center"
                style={{ color: "#6B7280" }}
              >
                No {filter === "all" ? "" : filter} transactions found
              </Typography>
            </View>
          ) : (
            <View className="gap-2.5">
              {filtered.map((req) => (
                <PaymentHistoryItem
                  key={req.id}
                  id={req.id}
                  amount={req.amount}
                  createdAt={req.created_at}
                  status={req.status}
                  adminNotes={req.admin_notes}
                  transactionId={req.transaction_id}
                  processedAt={req.processed_at}
                  releasedAt={req.released_at}
                />
              ))}
            </View>
          )}
        </>
      )}
    </ScreenLayout>
  );
}
