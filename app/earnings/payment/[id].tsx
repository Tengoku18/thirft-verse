import { Typography } from "@/components/ui/Typography";
import { ScreenLayout } from "@/components/layouts/ScreenLayout";
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
  pending:  { label: "Under review",               color: "#B45309", bg: "#FFFBEB" },
  approved: { label: "Payment coming soon",         color: "#1D4ED8", bg: "#EFF6FF" },
  released: { label: "Payment sent to your eSewa",  color: "#065F46", bg: "#ECFDF5" },
  rejected: { label: "Request rejected",            color: "#B91C1C", bg: "#FEF2F2" },
};

function getTimelineSteps(req: PaymentRequestDetail): TimelineStep[] {
  if (req.status === "rejected") {
    return [
      { label: "Submitted", state: "done",     timestamp: req.created_at,   description: "Withdrawal request submitted" },
      { label: "Rejected",  state: "rejected", timestamp: req.processed_at, description: req.admin_notes ?? "Your request was rejected" },
    ];
  }
  return [
    { label: "Submitted", state: "done",                                           timestamp: req.created_at,   description: "Withdrawal request submitted" },
    { label: "Approved",  state: req.status === "pending" ? "upcoming" : "done",  timestamp: req.processed_at, description: "Admin reviewed and approved your request" },
    { label: "Paid",      state: req.status === "released" ? "done" : "upcoming", timestamp: req.released_at,  description: "Payment sent to your eSewa account" },
  ];
}

// ─────────────── Sub-components ───────────────
function StepDot({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: "#3B2F2F",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#FFFFFF" }} />
      </View>
    );
  }
  if (state === "rejected") {
    return (
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: "#DC2626",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variation="caption"
          style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700", lineHeight: 13 }}
        >
          ✕
        </Typography>
      </View>
    );
  }
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#F3F4F6",
        borderWidth: 1.5,
        borderColor: "#D1D5DB",
      }}
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
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: "rgba(59,48,48,0.06)",
      }}
    >
      <Typography
        variation="caption"
        style={{ color: "rgba(59,48,48,0.5)", fontSize: 13 }}
      >
        {label}
      </Typography>
      <Typography
        variation="body-sm"
        style={{
          color: "#3B2F2F",
          fontSize: 13,
          fontWeight: "600",
          maxWidth: "60%",
          textAlign: "right",
        }}
        numberOfLines={2}
      >
        {value}
      </Typography>
    </View>
  );
}

const CARD_STYLE = {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 16,
  borderWidth: 1,
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
        .select("id, amount, status, notes, admin_notes, payment_method, transaction_id, created_at, processed_at, released_at")
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
      <ScreenLayout title="Payment Details" backgroundColor="#FAF7F2" contentBackgroundColor="#FAF7F2">
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
          <ActivityIndicator size="large" color="#3B2F2F" />
        </View>
      </ScreenLayout>
    );
  }

  if (!request) {
    return (
      <ScreenLayout title="Payment Details" backgroundColor="#FAF7F2" contentBackgroundColor="#FAF7F2">
        <View style={{ alignItems: "center", paddingTop: 80 }}>
          <Typography variation="body-sm" style={{ color: "rgba(59,48,48,0.5)" }}>
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
      <View style={{ gap: 14, paddingTop: 16, paddingBottom: 32 }}>

        {/* ── Amount hero ── */}
        <View style={{ ...CARD_STYLE, alignItems: "center", paddingVertical: 28 }}>
          <Typography
            variation="h1"
            style={{ fontSize: 36, fontWeight: "700", color: "#3B2F2F", marginBottom: 10 }}
          >
            {formatAmount(request.amount)}
          </Typography>
          <View
            style={{
              backgroundColor: meta.bg,
              paddingHorizontal: 14,
              paddingVertical: 5,
              borderRadius: 20,
              marginBottom: 10,
            }}
          >
            <Typography
              variation="caption"
              style={{ fontSize: 12, color: meta.color, fontWeight: "600" }}
            >
              {meta.label}
            </Typography>
          </View>
          <Typography
            variation="caption"
            style={{ color: "rgba(59,48,48,0.4)", fontSize: 12 }}
          >
            Submitted {formatDateTime(request.created_at)}
          </Typography>
        </View>

        {/* ── Payment timeline ── */}
        <View style={CARD_STYLE}>
          <Typography
            variation="caption"
            style={{
              fontSize: 10,
              color: "rgba(59,48,48,0.45)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 16,
            }}
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
              <View key={step.label} style={{ flexDirection: "row" }}>
                {/* Dot + vertical line */}
                <View style={{ width: 22, alignItems: "center" }}>
                  <StepDot state={step.state} />
                  {!isLast && (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 20,
                        backgroundColor: lineColor,
                        marginTop: 4,
                        marginBottom: 0,
                        opacity: step.state === "upcoming" ? 0.3 : 1,
                      }}
                    />
                  )}
                </View>

                {/* Label + timestamp */}
                <View
                  style={{
                    flex: 1,
                    marginLeft: 14,
                    paddingBottom: isLast ? 0 : 20,
                  }}
                >
                  <Typography
                    variation="label"
                    style={{ fontSize: 14, color: labelColor, fontWeight: "600" }}
                  >
                    {step.label}
                  </Typography>
                  {step.timestamp ? (
                    <Typography
                      variation="caption"
                      style={{ color: "rgba(59,48,48,0.45)", fontSize: 12, marginTop: 2 }}
                    >
                      {formatDateTime(step.timestamp)}
                    </Typography>
                  ) : (
                    <Typography
                      variation="caption"
                      style={{ color: "#D1D5DB", fontSize: 12, marginTop: 2 }}
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
        <View style={CARD_STYLE}>
          <Typography
            variation="caption"
            style={{
              fontSize: 10,
              color: "rgba(59,48,48,0.45)",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              marginBottom: 4,
            }}
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
          <View style={CARD_STYLE}>
            <Typography
              variation="caption"
              style={{
                fontSize: 10,
                color: "rgba(59,48,48,0.45)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 8,
              }}
            >
              Your Note
            </Typography>
            <Typography
              variation="body-sm"
              style={{ color: "#3B2F2F", fontSize: 14, lineHeight: 20 }}
            >
              {request.notes}
            </Typography>
          </View>
        )}

        {/* ── Admin notes ── */}
        {request.admin_notes && (
          <View
            style={{
              ...CARD_STYLE,
              backgroundColor: request.status === "rejected" ? "#FEF2F2" : "#FFFFFF",
              borderColor:
                request.status === "rejected"
                  ? "rgba(220,38,38,0.12)"
                  : "rgba(59,48,48,0.07)",
            }}
          >
            <Typography
              variation="caption"
              style={{
                fontSize: 10,
                color:
                  request.status === "rejected"
                    ? "rgba(185,28,28,0.6)"
                    : "rgba(59,48,48,0.45)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 8,
              }}
            >
              {request.status === "rejected" ? "Rejection Reason" : "Admin Note"}
            </Typography>
            <Typography
              variation="body-sm"
              style={{
                color: request.status === "rejected" ? "#B91C1C" : "#3B2F2F",
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {request.admin_notes}
            </Typography>
          </View>
        )}

        {/* ── Transaction ID (released only) ── */}
        {request.transaction_id && request.status === "released" && (
          <View style={CARD_STYLE}>
            <Typography
              variation="caption"
              style={{
                fontSize: 10,
                color: "rgba(59,48,48,0.45)",
                textTransform: "uppercase",
                letterSpacing: 0.8,
                marginBottom: 8,
              }}
            >
              Transaction ID
            </Typography>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <Typography
                variation="body-sm"
                style={{ color: "#3B2F2F", fontSize: 13, flex: 1 }}
                numberOfLines={2}
              >
                {request.transaction_id}
              </Typography>
              <TouchableOpacity
                onPress={handleCopyTxn}
                activeOpacity={0.75}
                style={{
                  backgroundColor: "#3B2F2F",
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 10,
                }}
              >
                <Typography
                  variation="caption"
                  style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "600" }}
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
