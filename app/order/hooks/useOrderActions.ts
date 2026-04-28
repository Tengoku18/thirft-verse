import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { syncNCMOrderStatus, updateOrderWithNCM } from "@/lib/database-helpers";
import { pickImage, takePhoto } from "@/lib/image-picker-helpers";
import { supabase } from "@/lib/supabase";
import { ProfileRevenue } from "@/lib/types/database";
import { OrderDetail } from "@/lib/types/order";
import { uploadImageToStorage } from "@/lib/upload-helpers";
import { isValidNepaliPhone } from "@/lib/validations/create-order";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import { useState } from "react";
import { Alert, Linking } from "react-native";

export function useOrderActions(order: OrderDetail | null, loadOrder: () => void) {
  const { user } = useAuth();
  const toast = useToast();
  const dispatch = useAppDispatch();

  const [shippingId, setShippingId] = useState("");
  const [billImageUri, setBillImageUri] = useState<string | null>(null);
  const [uploadingBill, setUploadingBill] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showNCMModal, setShowNCMModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ncmOrderId, setNcmOrderId] = useState<number | null>(null);

  const handlePickBillImage = () => {
    Alert.alert("Select Bill Image", "Choose an option", [
      { text: "Take Photo", onPress: async () => { const r = await takePhoto(); if (r.success && r.uri) setBillImageUri(r.uri); } },
      { text: "Choose from Library", onPress: async () => { const r = await pickImage(); if (r.success && r.uri) setBillImageUri(r.uri); } },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleConfirmShipping = async () => {
    if (!order) return;
    if (!shippingId.trim()) { Alert.alert("Error", "Please enter the Shipping ID from your bill."); return; }
    if (!billImageUri) { Alert.alert("Error", "Please upload a photo of your shipping bill."); return; }
    setUploadingBill(true);
    try {
      const upload = await uploadImageToStorage(billImageUri, "bill", "shipping-bills");
      if (!upload.success) { Alert.alert("Error", upload.error || "Failed to upload bill image."); return; }
      const { error } = await supabase.from("orders")
        .update({ shipping_id: shippingId.trim(), shipping_bill_image: upload.url, status: "processing", updated_at: new Date().toISOString() })
        .eq("id", order.id);
      if (error) { Alert.alert("Error", "Failed to update order status."); return; }
      const { data: profile, error: profileErr } = await supabase.from("profiles").select("revenue").eq("id", order.sellerId).single();
      if (!profileErr && profile) {
        const current = (profile.revenue as ProfileRevenue) || { pendingAmount: 0, confirmedAmount: 0, withdrawnAmount: 0, withdrawalHistory: [] };
        await supabase.from("profiles")
          .update({ revenue: { ...current, pendingAmount: (current.pendingAmount || 0) + Math.round(order.payment.sellersEarning) }, updated_at: new Date().toISOString() })
          .eq("id", order.sellerId);
        if (user?.id) dispatch(fetchUserProfile(user.id));
      }
      toast.success("Order is now processing!");
      setShowShippingModal(false); setShippingId(""); setBillImageUri(null);
      loadOrder();
    } catch { Alert.alert("Error", "Something went wrong. Please try again."); }
    finally { setUploadingBill(false); }
  };

  const handleNCMOrderSuccess = async (incomingNcmOrderId: number, deliveryType: string) => {
    if (!order) return;
    const result = await updateOrderWithNCM(order.id, incomingNcmOrderId, deliveryType);
    if (result.success) {
      setShowNCMModal(false);
      setNcmOrderId(incomingNcmOrderId);
      setShowSuccessModal(true);
    } else {
      Alert.alert("Warning", "NCM order created but failed to update local record. Note the NCM Order ID: " + incomingNcmOrderId);
    }
  };

  const handleNCMSync = async () => {
    if (!order?.ncm?.orderId) return;
    const result = await syncNCMOrderStatus(order.id, order.ncm.orderId);
    if (result.success) { toast.success("NCM status synced!"); await loadOrder(); }
    else toast.error("Failed to sync NCM status");
  };

  const handleContact = (type: "email" | "phone") => {
    if (!order) return;
    if (type === "email" && order.buyer.email !== "Not available") { Linking.openURL(`mailto:${order.buyer.email}`); return; }
    if (type === "phone" && order.buyer.phone !== "Not available") {
      if (!isValidNepaliPhone(order.buyer.phone)) { Alert.alert("Invalid Phone Number", "Please edit the order to fix it."); return; }
      Linking.openURL(`tel:${order.buyer.phone}`);
    }
  };

  return {
    shippingId, setShippingId, billImageUri, setBillImageUri, uploadingBill,
    showShippingModal, setShowShippingModal, showNCMModal, setShowNCMModal,
    showEditModal, setShowEditModal, showGuideModal, setShowGuideModal,
    showSuccessModal, setShowSuccessModal, ncmOrderId,
    handlePickBillImage, handleConfirmShipping, handleNCMOrderSuccess, handleNCMSync, handleContact,
  };
}
