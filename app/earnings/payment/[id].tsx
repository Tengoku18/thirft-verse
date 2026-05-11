import { ScreenLayout } from "@/components/layouts/ScreenLayout";
import { Typography } from "@/components/ui/Typography";
import { useToast } from "@/contexts/ToastContext";
import { supabase } from "@/lib/supabase";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

// ─────────────── Types ───────────────
interface PaymentRequestDetail {
  id: string;
  amount: number;
  status: "pending" | "approved" | "released" | "rejected";
  notes: string | null;
  admin_notes: string | null;
  payment_method: string | null;
  transaction_id: string | null;
  created_at: string;
  processed_at: string | null;
  released_at: string | null;
}

type StepState = "done" | "upcoming" | "rejected";

interface TimelineStep {
  label: string;
  state: StepState;
  timestamp: string | null | undefined;
  description: string;
}

// ─────────────── Helpers ───────────────
const formatAmount = (amount: number) =>
  `रु ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDateTime = (dateStr: string | null | undefined) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_META = {
  pending: { label: "Under review", color: "#B45309", bg: "#FFFBEB" },
  approved: { label: "Payment coming soon", color: "#1D4ED8", bg: "#EFF6FF" },
  released: {
    label: "Payment sent to your eSewa",
    color: "#065F46",
    bg: "#ECFDF5",
  },
  rejected: { label: "Request rejected", color: "#B91C1C", bg: "#FEF2F2" },
};

function getTimelineSteps(req: PaymentRequestDetail): TimelineStep[] {
  if (req.status === "rejected") {
    return [
      {
        label: "Submitted",
        state: "done",
        timestamp: req.created_at,
        description: "Withdrawal request submitted",
      },
      {
        label: "Rejected",
        state: "rejected",
        timestamp: req.processed_at,
        description: req.admin_notes ?? "Your request was rejected",
      },
    ];
  }
  return [
    {
      label: "Submitted",
      state: "done",
      timestamp: req.created_at,
      description: "Withdrawal request submitted",
    },
    {
      label: "Approved",
      state: req.status === "pending" ? "upcoming" : "done",
      timestamp: req.processed_at,
      description: "Admin reviewed and approved your request",
    },
    {
      label: "Paid",
      state: req.status === "released" ? "done" : "upcoming",
      timestamp: req.released_at,
      description: "Payment sent to your eSewa account",
    },
  ];
}

// ─────────────── Sub-components ───────────────
function StepDot({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <View
        className="w-[22px] h-[22px] rounded-full items-center justify-center"
        style={{ backgroundColor: "#3B2F2F" }}
      >
        <View className="w-[7px] h-[7px] rounded-full bg-white" />
      </View>
    );
  }
  if (state === "rejected") {
    return (
      <View
        className="w-[22px] h-[22px] rounded-full items-center justify-center"
        style={{ backgroundColor: "#DC2626" }}
      >
        <Typography
          variation="caption"
          style={{ color: "#FFFFFF", lineHeight: 13 }}
        >
          ✕
        </Typography>
      </View>
    );
  }
  return (
    <View
      className="w-[22px] h-[22px] rounded-full border-[1.5px]"
      style={{ backgroundColor: "#F3F4F6", borderColor: "#D1D5DB" }}
    />
  );
}

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className="flex-row justify-between items-center py-3"
      style={{
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: "rgba(59,48,48,0.06)",
      }}
    >
      <Typography variation="caption" style={{ color: "rgba(59,48,48,0.5)" }}>
        {label}
      </Typography>
      <Typography
        variation="label"
        className="text-right"
        style={{ color: "#3B2F2F", maxWidth: "60%" }}
        numberOfLines={2}
      >
        {value}
      </Typography>
    </View>
  );
}

const CARD_CLASS = "rounded-[20px] p-4 border";
const cardStyle = {
  backgroundColor: "#FFFFFF",
  borderColor: "rgba(59,48,48,0.07)",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
};

// ─────────────── Screen ───────────────
export default function PaymentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const [request, setRequest] = useState<PaymentRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRequest = useCallback(async () => {
    if (!id) return;
    try {
      const { data, error } = await supabase
        .from("payment_requests")
        .select(
          "id, amount, status, notes, admin_notes, payment_method, transaction_id, created_at, processed_at, released_at",
        )
        .eq("id", id)
        .single();
      if (!error && data) {
        setRequest(data as PaymentRequestDetail);
      }
    } catch (err) {
      console.error("Error loading payment detail:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  if (loading) {
    return (
      <ScreenLayout
        title="Payment Details"
        backgroundColor="#FAF7F2"
        contentBackgroundColor="#FAF7F2"
      >
        <View className="flex-1 items-center justify-center pt-20">
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </ScreenLayout>
    );
  }

  if (!request) {
    return (
      <ScreenLayout
        title="Payment Details"
        backgroundColor="#FAF7F2"
        contentBackgroundColor="#FAF7F2"
      >
        <View className="items-center pt-20">
          <Typography
            variation="body-sm"
            style={{ color: "rgba(59,48,48,0.5)" }}
          >
            Payment request not found.
          </Typography>
        </View>
      </ScreenLayout>
    );
  }

  const meta = STATUS_META[request.status] ?? STATUS_META.pending;
  const steps = getTimelineSteps(request);

  const handleCopyTxn = async () => {
    if (!request.transaction_id) return;
    await Clipboard.setStringAsync(request.transaction_id);
    toast.success("Transaction ID copied!");
  };

  return (
    <ScreenLayout
      title="Payment Details"
      backgroundColor="#FAF7F2"
      contentBackgroundColor="#FAF7F2"
      onRefresh={loadRequest}
    >
      <View className="gap-3.5 pt-4 pb-8">
        {/* ── Amount hero ── */}
        <View className={`${CARD_CLASS} items-center py-7`} style={cardStyle}>
          <Typography
            variation="h1"
            style={{ fontSize: 36, color: "#3B2F2F", marginBottom: 10 }}
          >
            {formatAmount(request.amount)}
          </Typography>
          <View
            className="px-3.5 py-[5px] rounded-full mb-2.5"
            style={{ backgroundColor: meta.bg }}
          >
            <Typography
              variation="caption"
              style={{ color: meta.color, fontWeight: "600" }}
            >
              {meta.label}
            </Typography>
          </View>
          <Typography
            variation="caption"
            style={{ color: "rgba(59,48,48,0.4)" }}
          >
            Submitted {formatDateTime(request.created_at)}
          </Typography>
        </View>

        {/* ── Payment timeline ── */}
        <View className={CARD_CLASS} style={cardStyle}>
          <Typography
            variation="caption"
            className="uppercase mb-4"
            style={{ color: "rgba(59,48,48,0.45)", letterSpacing: 0.8 }}
          >
            Payment Journey
          </Typography>

          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            const lineColor =
              step.state === "done"
                ? "#3B2F2F"
                : step.state === "rejected"
                  ? "#DC2626"
                  : "#E5E7EB";
            const labelColor =
              step.state === "upcoming"
                ? "#9CA3AF"
                : step.state === "rejected"
                  ? "#DC2626"
                  : "#3B2F2F";

            return (
              <View key={step.label} className="flex-row">
                {/* Dot + vertical line */}
                <View className="w-[22px] items-center">
                  <StepDot state={step.state} />
                  {!isLast && (
                    <View
                      className="w-0.5 flex-1 mt-1"
                      style={{
                        minHeight: 20,
                        backgroundColor: lineColor,
                        opacity: step.state === "upcoming" ? 0.3 : 1,
                      }}
                    />
                  )}
                </View>

                {/* Label + timestamp */}
                <View
                  className="flex-1 ml-3.5"
                  style={{ paddingBottom: isLast ? 0 : 20 }}
                >
                  <Typography variation="label" style={{ color: labelColor }}>
                    {step.label}
                  </Typography>
                  {step.timestamp ? (
                    <Typography
                      variation="caption"
                      className="mt-0.5"
                      style={{ color: "rgba(59,48,48,0.45)" }}
                    >
                      {formatDateTime(step.timestamp)}
                    </Typography>
                  ) : (
                    <Typography
                      variation="caption"
                      className="mt-0.5"
                      style={{ color: "#D1D5DB" }}
                    >
                      {step.state === "upcoming" ? "Pending" : "—"}
                    </Typography>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Payment details ── */}
        <View className={CARD_CLASS} style={cardStyle}>
          <Typography
            variation="caption"
            className="uppercase mb-1"
            style={{ color: "rgba(59,48,48,0.45)", letterSpacing: 0.8 }}
          >
            Request Details
          </Typography>
          <InfoRow label="Amount" value={formatAmount(request.amount)} />
          {request.payment_method && (
            <InfoRow label="eSewa account" value={request.payment_method} />
          )}
          <InfoRow
            label="Request ID"
            value={request.id.slice(0, 8).toUpperCase()}
            last
          />
        </View>

        {/* ── Your note ── */}
        {request.notes && (
          <View className={CARD_CLASS} style={cardStyle}>
            <Typography
              variation="caption"
              className="uppercase mb-2"
              style={{ color: "rgba(59,48,48,0.45)", letterSpacing: 0.8 }}
            >
              Your Note
            </Typography>
            <Typography variation="body-sm" style={{ color: "#3B2F2F" }}>
              {request.notes}
            </Typography>
          </View>
        )}

        {/* ── Admin notes ── */}
        {request.admin_notes && (
          <View
            className={CARD_CLASS}
            style={{
              ...cardStyle,
              backgroundColor:
                request.status === "rejected" ? "#FEF2F2" : "#FFFFFF",
              borderColor:
                request.status === "rejected"
                  ? "rgba(220,38,38,0.12)"
                  : "rgba(59,48,48,0.07)",
            }}
          >
            <Typography
              variation="caption"
              className="uppercase mb-2"
              style={{
                color:
                  request.status === "rejected"
                    ? "rgba(185,28,28,0.6)"
                    : "rgba(59,48,48,0.45)",
                letterSpacing: 0.8,
              }}
            >
              {request.status === "rejected"
                ? "Rejection Reason"
                : "Admin Note"}
            </Typography>
            <Typography
              variation="body-sm"
              style={{
                color: request.status === "rejected" ? "#B91C1C" : "#3B2F2F",
              }}
            >
              {request.admin_notes}
            </Typography>
          </View>
        )}

        {/* ── Transaction ID (released only) ── */}
        {request.transaction_id && request.status === "released" && (
          <View className={CARD_CLASS} style={cardStyle}>
            <Typography
              variation="caption"
              className="uppercase mb-2"
              style={{ color: "rgba(59,48,48,0.45)", letterSpacing: 0.8 }}
            >
              Transaction ID
            </Typography>
            <View className="flex-row items-center justify-between gap-3">
              <Typography
                variation="body-xs"
                className="flex-1"
                numberOfLines={2}
                style={{ color: "#3B2F2F" }}
              >
                {request.transaction_id}
              </Typography>
              <TouchableOpacity
                onPress={handleCopyTxn}
                activeOpacity={0.75}
                className="px-3.5 py-[7px] rounded-[10px]"
                style={{ backgroundColor: "#3B2F2F" }}
              >
                <Typography
                  variation="caption"
                  style={{ color: "#FFFFFF", fontWeight: "600" }}
                >
                  Copy
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScreenLayout>
  );
}
