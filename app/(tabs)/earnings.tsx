import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { TabScreenLayout } from "@/components/layouts/TabScreenLayout";
import {
  BodyMediumText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { uploadPaymentQRImage } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

const formatPrice = (amount: number) => `Rs. ${amount.toLocaleString()}`;

export default function EarningsScreen() {
  const { user, refreshProfile } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [hasPaymentDetails, setHasPaymentDetails] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // Payment state
  const [paymentData, setPaymentData] = useState<PaymentData>({
    payment_username: "",
    payment_qr_image: null,
  });
  const [editPaymentData, setEditPaymentData] = useState<PaymentData>({
    payment_username: "",
    payment_qr_image: null,
  });
  const [newPaymentQRUri, setNewPaymentQRUri] = useState<string | null>(null);
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentErrors, setPaymentErrors] = useState<{
    payment_username?: string;
    payment_qr_image?: string;
  }>({});

  // Withdraw request state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

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
        if (profile.revenue && typeof profile.revenue === "object") {
          setRevenue(profile.revenue as RevenueData);
        } else {
          setRevenue(null);
        }

        const paymentInfo = {
          payment_username: profile.payment_username || "",
          payment_qr_image: profile.payment_qr_image || null,
        };
        setPaymentData(paymentInfo);
        setEditPaymentData(paymentInfo);

        const hasDetails = !!(
          profile.payment_username && profile.payment_qr_image
        );
        setHasPaymentDetails(hasDetails);
      }

      // Fetch payment requests for the user
      const { data: requests, error: requestsError } = await supabase
        .from("payment_requests")
        .select("id, amount, status, notes, admin_notes, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!requestsError && requests) {
        setPaymentRequests(requests as PaymentRequest[]);
      }
    } catch (error) {
      console.error("Error loading earnings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const handleStartEdit = () => {
    setEditPaymentData({ ...paymentData });
    setNewPaymentQRUri(null);
    setPaymentErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditPaymentData({ ...paymentData });
    setNewPaymentQRUri(null);
    setPaymentErrors({});
    setIsEditing(false);
  };

  const validatePayment = (): boolean => {
    const newErrors: { payment_username?: string; payment_qr_image?: string } =
      {};

    if (!editPaymentData.payment_username?.trim()) {
      newErrors.payment_username = "Payment account holder name is required";
    }

    const hasPaymentQRImage =
      editPaymentData.payment_qr_image || newPaymentQRUri;
    if (!hasPaymentQRImage) {
      newErrors.payment_qr_image = "Payment QR code image is required";
    }

    setPaymentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentQRSelect = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photos to upload a QR code."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setNewPaymentQRUri(result.assets[0].uri);
        if (paymentErrors.payment_qr_image) {
          setPaymentErrors((prev) => ({
            ...prev,
            payment_qr_image: undefined,
          }));
        }
      }
    } catch (error) {
      console.error("Error picking QR image:", error);
      Alert.alert("Error", "Failed to pick QR code image. Please try again.");
    }
  };

  const handleSavePayment = async () => {
    if (!validatePayment() || !user) return;

    setSavingPayment(true);

    try {
      let paymentQRUrl = editPaymentData.payment_qr_image;

      if (newPaymentQRUri) {
        const uploadResult = await uploadPaymentQRImage(
          user.id,
          newPaymentQRUri
        );
        if (uploadResult.success && uploadResult.url) {
          paymentQRUrl = uploadResult.url;
        } else {
          Alert.alert(
            "Error",
            "Failed to upload payment QR code. Please try again."
          );
          setSavingPayment(false);
          return;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          payment_username: editPaymentData.payment_username.trim(),
          payment_qr_image: paymentQRUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        Alert.alert(
          "Error",
          "Failed to update payment details. Please try again."
        );
        return;
      }

      const updatedPayment = {
        payment_username: editPaymentData.payment_username.trim(),
        payment_qr_image: paymentQRUrl,
      };
      setPaymentData(updatedPayment);
      setEditPaymentData(updatedPayment);
      setNewPaymentQRUri(null);
      setHasPaymentDetails(true);
      setIsEditing(false);
      await refreshProfile();
      toast.success("Payment details saved successfully");
    } catch (error) {
      console.error("Error saving payment details:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setSavingPayment(false);
    }
  };

  const getDisplayPaymentQRUri = () => {
    if (newPaymentQRUri) return newPaymentQRUri;
    return editPaymentData.payment_qr_image;
  };

  const handleOpenWithdrawModal = () => {
    setWithdrawAmount("");
    setWithdrawNote("");
    setWithdrawError(null);
    setShowWithdrawModal(true);
  };

  const handleCloseWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawAmount("");
    setWithdrawNote("");
    setWithdrawError(null);
  };

  const handleSubmitWithdrawRequest = async () => {
    if (!user) return;

    // Validate amount
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount.trim() || isNaN(amount) || amount <= 0) {
      setWithdrawError("Please enter a valid amount");
      return;
    }

    // Check if amount exceeds available balance
    const availableBalance = revenue?.confirmedAmount || 0;
    if (amount > availableBalance) {
      setWithdrawError("Amount exceeds available balance");
      return;
    }

    setSubmittingWithdraw(true);
    setWithdrawError(null);

    try {
      // Create payment request record
      const { error } = await supabase.from("payment_requests").insert({
        user_id: user.id,
        amount: amount,
        status: "pending",
        payment_method: paymentData.payment_username || "Not specified",
        account_details: {
          payment_username: paymentData.payment_username,
          payment_qr_image: paymentData.payment_qr_image,
        },
        notes: withdrawNote.trim() || null,
      });

      if (error) {
        console.error("Error submitting withdraw request:", error);
        setWithdrawError("Failed to submit request. Please try again.");
        return;
      }

      // Success
      toast.success("Withdrawal request submitted successfully");
      handleCloseWithdrawModal();
    } catch (error) {
      console.error("Error submitting withdraw request:", error);
      setWithdrawError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  if (loading) {
    return (
      <TabScreenLayout title="Earnings">
        <View className="flex-1 bg-[#FAFAFA] justify-center items-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
          <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
            Loading...
          </BodyMediumText>
        </View>
      </TabScreenLayout>
    );
  }

  // Show payment form if no payment details OR if editing
  if (!hasPaymentDetails || isEditing) {
    return (
      <TabScreenLayout title="Earnings">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 bg-[#FAFAFA]"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#3B2F2F"
              />
            }
          >
          {/* Header */}
          <View className="mx-4 mt-4 flex-row items-center justify-between">
            <BodySemiboldText style={{ fontSize: 18 }}>
              {isEditing ? "Edit Payment Details" : "Setup Payment Details"}
            </BodySemiboldText>
            {isEditing && (
              <TouchableOpacity onPress={handleCancelEdit} activeOpacity={0.7}>
                <CaptionText style={{ color: "#6B7280", fontSize: 14 }}>
                  Cancel
                </CaptionText>
              </TouchableOpacity>
            )}
          </View>

          {!isEditing && (
            <View className="mx-4 mt-4 p-5 bg-[#FEF3C7] rounded-2xl flex-row items-start">
              <View className="w-12 h-12 rounded-full bg-[#F59E0B]/20 items-center justify-center mr-3">
                <IconSymbol
                  name="exclamationmark.triangle.fill"
                  size={24}
                  color="#F59E0B"
                />
              </View>
              <View className="flex-1">
                <BodySemiboldText style={{ color: "#92400E", fontSize: 16 }}>
                  Payment Required
                </BodySemiboldText>
                <CaptionText style={{ color: "#92400E", marginTop: 4 }}>
                  Add your payment details to start receiving payments from
                  buyers.
                </CaptionText>
              </View>
            </View>
          )}

          <View className="px-4 mt-6">
            <FormInput
              label="Payment Account Holder Name"
              placeholder="e.g., eSewa: 9812345678 or Bank: John Doe"
              value={editPaymentData.payment_username}
              onChangeText={(text) => {
                setEditPaymentData((prev) => ({
                  ...prev,
                  payment_username: text,
                }));
                if (paymentErrors.payment_username) {
                  setPaymentErrors((prev) => ({
                    ...prev,
                    payment_username: undefined,
                  }));
                }
              }}
              autoCapitalize="none"
              required
              error={paymentErrors.payment_username}
            />
            <CaptionText className="mb-6 -mt-2" style={{ color: "#6B7280" }}>
              Enter your eSewa name, bank account name, or payment identifier
            </CaptionText>

            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <BodySemiboldText style={{ fontSize: 13 }}>
                  Payment QR Code
                </BodySemiboldText>
                <BodySemiboldText style={{ color: "#EF4444", fontSize: 13 }}>
                  {" "}
                  *
                </BodySemiboldText>
              </View>

              <TouchableOpacity
                onPress={handlePaymentQRSelect}
                activeOpacity={0.8}
                className="rounded-2xl overflow-hidden"
                style={{
                  height: 220,
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: paymentErrors.payment_qr_image
                    ? "#EF4444"
                    : "#E5E7EB",
                }}
              >
                {getDisplayPaymentQRUri() ? (
                  <View className="flex-1 relative bg-[#FAFAFA]">
                    <Image
                      source={{ uri: getDisplayPaymentQRUri()! }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />
                    <TouchableOpacity
                      onPress={handlePaymentQRSelect}
                      className="absolute top-3 right-3 bg-white rounded-full p-2.5"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <IconSymbol
                        name="square.and.pencil"
                        size={18}
                        color="#3B2F2F"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="flex-1 justify-center items-center bg-[#FAFAFA]">
                    <View className="w-16 h-16 rounded-full bg-[#F3F4F6] justify-center items-center mb-3">
                      <IconSymbol name="qrcode" size={28} color="#9CA3AF" />
                    </View>
                    <BodySemiboldText
                      style={{ color: "#6B7280", fontSize: 15 }}
                    >
                      Upload QR Code
                    </BodySemiboldText>
                    <CaptionText style={{ color: "#9CA3AF" }} className="mt-1">
                      Tap to add your payment QR
                    </CaptionText>
                  </View>
                )}
              </TouchableOpacity>
              {paymentErrors.payment_qr_image && (
                <CaptionText className="mt-2" style={{ color: "#EF4444" }}>
                  {paymentErrors.payment_qr_image}
                </CaptionText>
              )}
            </View>

            <FormButton
              title={
                isEditing ? "Update Payment Details" : "Save Payment Details"
              }
              onPress={handleSavePayment}
              loading={savingPayment}
              variant="primary"
            />
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </TabScreenLayout>
    );
  }

  // Show revenue details when payment details exist
  return (
    <TabScreenLayout title="Earnings">
      <ScrollView
        className="flex-1 bg-[#FAFAFA]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B2F2F"
          />
        }
      >
        {/* Payment Account Card - At Top */}
        <View
          className="mx-4 mt-4 bg-white rounded-2xl p-4"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <BodySemiboldText style={{ fontSize: 16 }}>
              Payment Account
            </BodySemiboldText>
            <TouchableOpacity
              onPress={handleStartEdit}
              activeOpacity={0.7}
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <IconSymbol name="square.and.pencil" size={14} color="#3B2F2F" />
              <CaptionText
                style={{ color: "#3B2F2F", marginLeft: 4, fontWeight: "600" }}
              >
                Edit
              </CaptionText>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#3B2F2F]/10 items-center justify-center mr-3">
              <IconSymbol name="creditcard.fill" size={20} color="#3B2F2F" />
            </View>
            <View className="flex-1">
              <CaptionText style={{ color: "#6B7280" }}>
                Account Holder
              </CaptionText>
              <BodySemiboldText style={{ fontSize: 15, marginTop: 2 }}>
                {paymentData.payment_username}
              </BodySemiboldText>
            </View>
            <View className="px-3 py-1.5 bg-[#D1FAE5] rounded-full">
              <CaptionText style={{ color: "#059669", fontWeight: "600" }}>
                Active
              </CaptionText>
            </View>
          </View>
        </View>

        {/* Available Balance Card */}
        <View
          className="mx-4 mt-4 bg-white rounded-2xl p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
            >
              <IconSymbol name="banknote.fill" size={24} color="#22C55E" />
            </View>
            <View className="flex-1">
              <CaptionText style={{ color: "#6B7280" }}>
                Available Balance
              </CaptionText>
              <HeadingBoldText style={{ fontSize: 28, color: "#059669" }}>
                {formatPrice(revenue?.confirmedAmount || 0)}
              </HeadingBoldText>
            </View>
          </View>
          {/* Request Withdraw Button */}
          <TouchableOpacity
            onPress={handleOpenWithdrawModal}
            activeOpacity={0.8}
            className="mt-4 bg-[#3B2F2F] rounded-xl py-3.5 flex-row items-center justify-center"
            style={{
              opacity: (revenue?.confirmedAmount || 0) > 0 ? 1 : 0.5,
            }}
            disabled={(revenue?.confirmedAmount || 0) <= 0}
          >
            <IconSymbol name="arrow.up.circle.fill" size={18} color="#FFFFFF" />
            <BodySemiboldText style={{ color: "#FFFFFF", marginLeft: 8, fontSize: 15 }}>
              Request Withdraw
            </BodySemiboldText>
          </TouchableOpacity>
        </View>

        {/* Revenue Stats */}
        <View className="flex-row mx-4 mt-4" style={{ gap: 12 }}>
          <View
            className="flex-1 bg-white rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
            >
              <IconSymbol name="clock.fill" size={18} color="#F59E0B" />
            </View>
            <CaptionText style={{ color: "#6B7280" }}>Pending</CaptionText>
            <HeadingBoldText
              style={{ fontSize: 18, marginTop: 2, color: "#F59E0B" }}
            >
              {formatPrice(revenue?.pendingAmount || 0)}
            </HeadingBoldText>
          </View>
          <View
            className="flex-1 bg-white rounded-2xl p-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2"
              style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
            >
              <IconSymbol
                name="arrow.up.circle.fill"
                size={18}
                color="#8B5CF6"
              />
            </View>
            <CaptionText style={{ color: "#6B7280" }}>Withdrawn</CaptionText>
            <HeadingBoldText style={{ fontSize: 18, marginTop: 2, color: "#8B5CF6" }}>
              {formatPrice(revenue?.withdrawnAmount || 0)}
            </HeadingBoldText>
          </View>
        </View>

        {/* Withdrawal Requests Section */}
        <View className="mx-4 mt-6">
          <BodySemiboldText style={{ fontSize: 16, marginBottom: 12 }}>
            Withdrawal Requests
          </BodySemiboldText>

          {paymentRequests.length > 0 ? (
            paymentRequests.map((request) => {
              const statusConfig = {
                pending: {
                  bg: "#FEF3C7",
                  text: "#D97706",
                  label: "Pending",
                  icon: "clock.fill" as const,
                },
                released: {
                  bg: "#D1FAE5",
                  text: "#059669",
                  label: "Released",
                  icon: "checkmark.circle.fill" as const,
                },
                rejected: {
                  bg: "#FEE2E2",
                  text: "#DC2626",
                  label: "Rejected",
                  icon: "xmark.circle.fill" as const,
                },
              };
              const config = statusConfig[request.status] || statusConfig.pending;

              return (
                <View
                  key={request.id}
                  className="bg-white rounded-2xl p-4 mb-3"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: config.bg }}
                      >
                        <IconSymbol
                          name={config.icon}
                          size={20}
                          color={config.text}
                        />
                      </View>
                      <View className="flex-1">
                        <BodySemiboldText style={{ fontSize: 15 }}>
                          {formatPrice(request.amount)}
                        </BodySemiboldText>
                        {request.notes && (
                          <CaptionText style={{ color: "#6B7280", marginTop: 2 }} numberOfLines={1}>
                            {request.notes}
                          </CaptionText>
                        )}
                      </View>
                    </View>
                    <View className="items-end">
                      <View
                        className="px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: config.bg }}
                      >
                        <CaptionText style={{ color: config.text, fontWeight: "600", fontSize: 11 }}>
                          {config.label}
                        </CaptionText>
                      </View>
                      <CaptionText style={{ color: "#9CA3AF", marginTop: 4, fontSize: 11 }}>
                        {new Date(request.created_at).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </CaptionText>
                    </View>
                  </View>
                  {request.admin_notes && request.status !== "pending" && (
                    <View className="mt-3 pt-3 border-t border-[#F3F4F6]">
                      <CaptionText style={{ color: "#6B7280", fontSize: 12 }}>
                        Admin: {request.admin_notes}
                      </CaptionText>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View
              className="bg-white rounded-2xl p-6 items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View
                className="w-14 h-14 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: "#F3F4F6" }}
              >
                <IconSymbol name="clock.arrow.circlepath" size={24} color="#9CA3AF" />
              </View>
              <BodyMediumText style={{ color: "#6B7280", textAlign: "center" }}>
                No withdrawal requests yet
              </BodyMediumText>
              <CaptionText style={{ color: "#9CA3AF", textAlign: "center", marginTop: 4 }}>
                Your withdrawal requests will appear here
              </CaptionText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Withdraw Request Modal */}
      <Modal
        visible={showWithdrawModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseWithdrawModal}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View className="bg-white rounded-t-3xl px-4 pt-6 pb-10">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <HeadingBoldText style={{ fontSize: 20 }}>
                  Request Withdrawal
                </HeadingBoldText>
                <TouchableOpacity
                  onPress={handleCloseWithdrawModal}
                  className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center"
                >
                  <IconSymbol name="xmark" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Available Balance Info */}
              <View className="bg-[#F0FDF4] rounded-xl p-4 mb-6">
                <View className="flex-row items-center">
                  <IconSymbol name="banknote.fill" size={20} color="#22C55E" />
                  <View className="ml-3">
                    <CaptionText style={{ color: "#6B7280" }}>
                      Available Balance
                    </CaptionText>
                    <BodySemiboldText style={{ color: "#059669", fontSize: 18 }}>
                      {formatPrice(revenue?.confirmedAmount || 0)}
                    </BodySemiboldText>
                  </View>
                </View>
              </View>

              {/* Amount Input */}
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <BodySemiboldText style={{ fontSize: 14, color: "#374151" }}>
                    Withdraw Amount
                  </BodySemiboldText>
                  <BodySemiboldText style={{ color: "#EF4444", fontSize: 14 }}>
                    {" "}*
                  </BodySemiboldText>
                </View>
                <View
                  className="flex-row items-center bg-[#F3F4F6] rounded-xl px-4"
                  style={{
                    borderWidth: withdrawError ? 1 : 0,
                    borderColor: "#EF4444",
                  }}
                >
                  <BodySemiboldText style={{ color: "#6B7280", fontSize: 16 }}>
                    Rs.
                  </BodySemiboldText>
                  <TextInput
                    value={withdrawAmount}
                    onChangeText={(text) => {
                      setWithdrawAmount(text.replace(/[^0-9.]/g, ""));
                      if (withdrawError) setWithdrawError(null);
                    }}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    className="flex-1 py-3.5 ml-2"
                    style={{ fontSize: 16, color: "#1F2937" }}
                  />
                </View>
                {withdrawError && (
                  <CaptionText className="mt-2" style={{ color: "#EF4444" }}>
                    {withdrawError}
                  </CaptionText>
                )}
              </View>

              {/* Note Input */}
              <View className="mb-6">
                <BodySemiboldText style={{ fontSize: 14, color: "#374151", marginBottom: 8 }}>
                  Note (Optional)
                </BodySemiboldText>
                <TextInput
                  value={withdrawNote}
                  onChangeText={setWithdrawNote}
                  placeholder="Add a note for admin..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  className="bg-[#F3F4F6] rounded-xl px-4 py-3"
                  style={{
                    fontSize: 15,
                    color: "#1F2937",
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmitWithdrawRequest}
                disabled={submittingWithdraw || !withdrawAmount.trim()}
                className="bg-[#3B2F2F] rounded-xl py-4 flex-row items-center justify-center"
                style={{
                  opacity: submittingWithdraw || !withdrawAmount.trim() ? 0.5 : 1,
                }}
                activeOpacity={0.8}
              >
                {submittingWithdraw ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <BodySemiboldText style={{ color: "#FFFFFF", fontSize: 16, marginLeft: 8 }}>
                      Submitting...
                    </BodySemiboldText>
                  </>
                ) : (
                  <>
                    <IconSymbol name="paperplane.fill" size={18} color="#FFFFFF" />
                    <BodySemiboldText style={{ color: "#FFFFFF", fontSize: 16, marginLeft: 8 }}>
                      Submit Request
                    </BodySemiboldText>
                  </>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={handleCloseWithdrawModal}
                disabled={submittingWithdraw}
                className="mt-3 py-3"
                activeOpacity={0.7}
              >
                <BodyMediumText style={{ color: "#6B7280", fontSize: 15, textAlign: "center" }}>
                  Cancel
                </BodyMediumText>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </TabScreenLayout>
  );
}
