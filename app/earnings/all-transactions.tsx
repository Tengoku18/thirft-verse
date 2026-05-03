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
      style={{
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: active ? "#3B2F2F" : "#FFFFFF",
        borderWidth: 1,
        borderColor: active ? "#3B2F2F" : "rgba(59,48,48,0.15)",
      }}
    >
      <Typography
        variation="body-sm"
        style={{
          fontSize: 13,
          color: active ? "#FFFFFF" : "rgba(59,48,48,0.6)",
          fontWeight: "600",
        }}
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
        .select("id, amount, status, notes, admin_notes, created_at")
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

  // Stats summary
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
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 16,
              marginBottom: 20,
            }}
          >
            {/* Pending */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#FDF2B3",
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                variation="caption"
                style={{
                  fontSize: 10,
                  color: "rgba(59,48,48,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 4,
                }}
              >
                Pending
              </Typography>
              <Typography
                variation="body-sm"
                style={{ fontSize: 13, color: "#3B2F2F", fontWeight: "600" }}
              >
                {formatAmt(totalPending)}
              </Typography>
            </View>

            {/* Released */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#D1E7D1",
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                variation="caption"
                style={{
                  fontSize: 10,
                  color: "rgba(59,48,48,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 4,
                }}
              >
                Approved
              </Typography>
              <Typography
                variation="body-sm"
                style={{ fontSize: 13, color: "#3B2F2F", fontWeight: "600" }}
              >
                {formatAmt(totalReleased)}
              </Typography>
            </View>

            {/* Rejected */}
            <View
              style={{
                flex: 1,
                backgroundColor: "#FEE2E2",
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.04)",
              }}
            >
              <Typography
                variation="caption"
                style={{
                  fontSize: 10,
                  color: "rgba(59,48,48,0.55)",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginBottom: 4,
                }}
              >
                Rejected
              </Typography>
              <Typography
                variation="body-sm"
                style={{ fontSize: 13, color: "#3B2F2F", fontWeight: "600" }}
              >
                {formatAmt(totalRejected)}
              </Typography>
            </View>
          </View>

          {/* ── Filter pills ── */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {(["all", "pending", "released", "rejected"] as FilterStatus[]).map(
              (f) => (
                <FilterPill
                  key={f}
                  label={
                    f === "released"
                      ? "Approved"
                      : f.charAt(0).toUpperCase() + f.slice(1)
                  }
                  active={filter === f}
                  onPress={() => setFilter(f)}
                />
              ),
            )}
          </View>

          {/* ── List ── */}
          {filtered.length === 0 ? (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 36,
                alignItems: "center",
                marginTop: 8,
                borderWidth: 1,
                borderColor: "rgba(59,48,48,0.06)",
              }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  backgroundColor: "#F3F4F6",
                  borderRadius: 26,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <ClockArrowIcon width={22} height={22} color="#9CA3AF" />
              </View>
              <Typography
                variation="body-sm"
                style={{ color: "#6B7280", textAlign: "center" }}
              >
                No {filter === "all" ? "" : filter} transactions found
              </Typography>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {filtered.map((req) => (
                <PaymentHistoryItem
                  key={req.id}
                  amount={req.amount}
                  createdAt={req.created_at}
                  status={req.status}
                  adminNotes={req.admin_notes}
                />
              ))}
            </View>
          )}
        </>
      )}
    </ScreenLayout>
  );
}
