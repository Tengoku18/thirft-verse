import { EditOrderModal } from "@/components/modals/EditOrderModal";
import { NCMOrderModal } from "@/components/modals/NCMOrderModal";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import { NCMCommentsSection, NCMTrackingSection } from "@/components/order";
import {
  BodyBoldText,
  BodyMediumText,
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
  HeadingBoldText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  getOrderById,
  syncNCMOrderStatus,
  updateOrderWithNCM,
} from "@/lib/database-helpers";
import { pickImage, takePhoto } from "@/lib/image-picker-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import { Product, ProfileRevenue } from "@/lib/types/database";
import { uploadImageToStorage } from "@/lib/upload-helpers";
import { isValidNepaliPhone } from "@/lib/validations/create-order";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile } from "@/store/profileSlice";
import dayjs from "dayjs";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ============================================================================
// TYPES
// ============================================================================

interface OrderDetailItem {
  id: string;
  title: string;
  image: string | null;
  price: number;
  quantity: number;
}

interface OrderDetail {
  // Core
  id: string;
  type: "order" | "product";
  orderCode: string;
  status: string; // pending, shipping, processing, delivered, completed, cancelled, refunded

  // Product (primary product for single-product orders, first item for multi)
  product: {
    id: string;
    title: string;
    image: string | null;
    price: number;
    category: string;
  };
  quantity: number;

  // Multi-product items (empty for single-product orders)
  items: OrderDetailItem[];

  // Buyer
  buyer: {
    name: string;
    email: string;
    phone: string;
  };

  // Shipping
  shipping: {
    method: string;
    fee: number;
    address: {
      street: string;
      city: string;
      district: string;
      country: string;
    } | null;
  };

  // Payment
  payment: {
    method: string;
    transactionCode: string;
    subtotal: number;
    total: number;
    sellersEarning: number;
  };

  // NCM (Nepal Can Move) Tracking
  ncm: {
    orderId: number | null;
    status: string | null;
    deliveryStatus: string | null;
    paymentStatus: string | null;
    deliveryCharge: number | null;
    lastSyncedAt: string | null;
  } | null;

  // Meta
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const formatPrice = (amount: number) => `Rs. ${amount.toLocaleString()}`;

// Simplified status config - only 3 main statuses + cancelled/refunded
const STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; label: string; icon: string }
> = {
  pending: {
    bg: "#FEF3C7",
    text: "#D97706",
    label: "Pending",
    icon: "clock.fill",
  },
  processing: {
    bg: "#DBEAFE",
    text: "#2563EB",
    label: "Processing",
    icon: "shippingbox.fill",
  },
  completed: {
    bg: "#D1FAE5",
    text: "#059669",
    label: "Completed",
    icon: "checkmark.circle.fill",
  },
  cancelled: {
    bg: "#FEE2E2",
    text: "#DC2626",
    label: "Cancelled",
    icon: "xmark.circle.fill",
  },
  refunded: {
    bg: "#E9D5FF",
    text: "#7C3AED",
    label: "Refunded",
    icon: "arrow.uturn.left.circle.fill",
  },
};

const DEFAULT_STATUS = {
  bg: "#F3F4F6",
  text: "#6B7280",
  label: "Unknown",
  icon: "questionmark.circle.fill",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mx-4 mt-5">
      <BodySemiboldText
        style={{ fontSize: 15, marginBottom: 10, color: "#374151" }}
      >
        {title}
      </BodySemiboldText>
      <View
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  icon,
  onPress,
  highlight,
  last,
}: {
  label: string;
  value: string;
  icon?: string;
  onPress?: () => void;
  highlight?: boolean;
  last?: boolean;
}) {
  const content = (
    <View
      className={`flex-row items-center justify-between px-4 py-3.5 ${
        !last ? "border-b border-[#F3F4F6]" : ""
      }`}
    >
      <View className="flex-row items-center flex-1 mr-3">
        {icon && (
          <IconSymbol
            name={icon as any}
            size={16}
            color="#9CA3AF"
            style={{ marginRight: 10 }}
          />
        )}
        <BodyRegularText style={{ color: "#6B7280", fontSize: 14 }}>
          {label}
        </BodyRegularText>
      </View>
      <View className="flex-row items-center" style={{ maxWidth: "55%" }}>
        <BodySemiboldText
          style={{
            fontSize: 14,
            color: highlight ? "#3B82F6" : "#1F2937",
            textAlign: "right",
          }}
          numberOfLines={2}
        >
          {value}
        </BodySemiboldText>
        {onPress && (
          <IconSymbol
            name="chevron.right"
            size={12}
            color="#D1D5DB"
            style={{ marginLeft: 6 }}
          />
        )}
      </View>
    </View>
  );

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      {content}
    </TouchableOpacity>
  ) : (
    content
  );
}

// Simple timeline for pending orders (before NCM)
// For NCM orders, the NCMTrackingSection component handles the detailed timeline
function SimpleTimeline({
  status,
  createdAt,
  updatedAt,
}: {
  status: string;
  createdAt: string;
  updatedAt: string;
}) {
  const orderDate = dayjs(createdAt);
  const updateDate = dayjs(updatedAt);

  // Handle cancelled/refunded
  if (status === "cancelled" || status === "refunded") {
    return (
      <View className="px-4 py-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-[#DC2626] items-center justify-center">
            <IconSymbol name="xmark" size={16} color="#FFFFFF" />
          </View>
          <View className="ml-3">
            <BodySemiboldText style={{ fontSize: 14 }}>
              Order {status === "cancelled" ? "Cancelled" : "Refunded"}
            </BodySemiboldText>
            <CaptionText style={{ color: "#9CA3AF", marginTop: 2 }}>
              {updateDate.format("DD MMM, YYYY • h:mm A")}
            </CaptionText>
          </View>
        </View>
      </View>
    );
  }

  // Simplified 3-step flow: Order Placed → Sent to NCM → Completed
  const isProcessingOrBeyond = ["processing", "completed"].includes(status);
  const isCompleted = status === "completed";

  const steps = [
    {
      id: "placed",
      title: "Order Placed",
      description: "Customer has placed the order",
      done: true,
      current: status === "pending",
      date: orderDate.format("DD MMM • h:mm A"),
    },
    {
      id: "processing",
      title: "Sent to NCM",
      description: "Order sent to Nepal Can Move for delivery",
      done: isProcessingOrBeyond,
      current: status === "processing",
      date: isProcessingOrBeyond
        ? updateDate.format("DD MMM • h:mm A")
        : undefined,
    },
    {
      id: "completed",
      title: "Completed",
      description: "Delivered & payment settled",
      done: isCompleted,
      current: false,
      date: isCompleted ? updateDate.format("DD MMM • h:mm A") : undefined,
    },
  ];

  return (
    <View className="px-4 py-3">
      {steps.map((step, idx) => (
        <View key={step.id} className="flex-row">
          <View className="items-center" style={{ width: 32 }}>
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{
                backgroundColor: step.done
                  ? "#059669"
                  : step.current
                    ? "#3B82F6"
                    : "#E5E7EB",
              }}
            >
              {step.done ? (
                <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
              ) : step.current ? (
                <View className="w-3 h-3 rounded-full bg-white" />
              ) : (
                <View className="w-2 h-2 rounded-full bg-white" />
              )}
            </View>
            {idx < steps.length - 1 && (
              <View
                style={{
                  width: 2,
                  height: step.done || step.current ? 44 : 36,
                  backgroundColor: step.done ? "#059669" : "#E5E7EB",
                }}
              />
            )}
          </View>
          <View className="ml-3 pb-5 flex-1">
            <BodySemiboldText
              style={{
                fontSize: 14,
                color: step.done || step.current ? "#1F2937" : "#9CA3AF",
              }}
            >
              {step.title}
            </BodySemiboldText>
            <CaptionText
              style={{
                color: step.done || step.current ? "#6B7280" : "#D1D5DB",
                marginTop: 2,
                fontSize: 11,
                lineHeight: 15,
              }}
            >
              {step.description}
            </CaptionText>
            {step.date && (
              <CaptionText
                style={{
                  color: "#059669",
                  marginTop: 4,
                  fontSize: 11,
                  fontWeight: "600",
                }}
              >
                {step.date}
              </CaptionText>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

export default function SingleOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile.profile);
  const insets = useSafeAreaInsets();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Shipping confirmation modal state
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingId, setShippingId] = useState("");
  const [billImageUri, setBillImageUri] = useState<string | null>(null);
  const [uploadingBill, setUploadingBill] = useState(false);

  // NCM modal state
  const [showNCMModal, setShowNCMModal] = useState(false);

  // Edit order modal state
  const [showEditModal, setShowEditModal] = useState(false);

  // Load data
  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      // Try loading as order first
      const result = await getOrderById(id);

      if (result.success && result.data) {
        const o = result.data as any;
        const orderItems = result.order_items || [];
        // Use order amount for price calculation (not product price which could be updated)
        const shippingFee = o.shipping_fee || 0;
        const productPrice = (o.amount || 0) - shippingFee;

        // Determine if multi-product order and build items list
        const isMultiProduct = !o.product_id;
        let primaryProduct;
        let itemsList: OrderDetailItem[] = [];

        if (isMultiProduct && orderItems.length > 0) {
          // Multi-product order with items loaded
          const firstItem = orderItems[0];
          primaryProduct = {
            id: firstItem.product_id,
            title:
              orderItems.length > 1
                ? `${firstItem.product_name} + ${orderItems.length - 1} more`
                : firstItem.product_name,
            image: firstItem.cover_image || null,
            price: productPrice,
            category: "Product",
          };
          itemsList = orderItems.map((item: any) => ({
            id: item.product_id,
            title: item.product_name,
            image: item.cover_image || null,
            price: item.price * item.quantity,
            quantity: item.quantity,
          }));
        } else if (isMultiProduct && orderItems.length === 0) {
          // Multi-product order but items not loaded (RLS issue or no data)
          primaryProduct = {
            id: "",
            title: `Order with ${o.quantity || 1} items`,
            image: null,
            price: productPrice,
            category: "Product",
          };
        } else if (orderItems.length > 0 && !isMultiProduct) {
          // Single-product order with order_items (migrated legacy order)
          primaryProduct = {
            id: o.product_id,
            title:
              o.product?.title || orderItems[0]?.product_name || "Order Item",
            image: o.product?.cover_image || orderItems[0]?.cover_image || null,
            price: productPrice,
            category: o.product?.category || "Product",
          };
          // Still show single item in the items list for consistency
          if (orderItems.length === 1) {
            itemsList = [
              {
                id: orderItems[0].product_id,
                title: orderItems[0].product_name,
                image: orderItems[0].cover_image || null,
                price: orderItems[0].price * orderItems[0].quantity,
                quantity: orderItems[0].quantity,
              },
            ];
          }
        } else {
          // Legacy single-product order without order_items
          primaryProduct = {
            id: o.product_id || "",
            title: o.product?.title || "Order Item",
            image: o.product?.cover_image || null,
            price: productPrice,
            category: o.product?.category || "Product",
          };
        }

        setOrder({
          id: o.id,
          type: "order",
          orderCode: o.order_code || `#${o.id.slice(0, 8).toUpperCase()}`,
          status: o.status,
          product: primaryProduct,
          quantity: o.quantity || 1,
          items: itemsList,
          buyer: {
            name: o.buyer_name,
            email: o.buyer_email,
            phone: o.shipping_address?.phone || o.buyer_phone || "",
          },
          shipping: {
            method: o.shipping_option || "Standard Delivery",
            fee: shippingFee,
            address: o.shipping_address
              ? {
                  street: o.shipping_address.street,
                  city: o.shipping_address.city,
                  district: o.shipping_address.district,
                  country: o.shipping_address.country,
                }
              : null,
          },
          payment: {
            method: o.payment_method,
            transactionCode: o.transaction_code || "N/A",
            subtotal: productPrice,
            total: o.amount,
            sellersEarning: o.sellers_earning || productPrice,
          },
          // NCM tracking data
          ncm: o.ncm_order_id
            ? {
                orderId: o.ncm_order_id,
                status: o.ncm_status || null,
                deliveryStatus: o.ncm_delivery_status || null,
                paymentStatus: o.ncm_payment_status || null,
                deliveryCharge: o.ncm_delivery_charge || null,
                lastSyncedAt: o.ncm_last_synced_at || null,
              }
            : null,
          sellerId: o.seller_id,
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        });
      } else {
        // Fallback: try loading as product (sold item)
        const { data: product, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (!error && product) {
          const p = product as Product;
          const soldDate = dayjs(p.updated_at || p.created_at);
          const daysSince = dayjs().diff(soldDate, "day");

          setOrder({
            id: p.id,
            type: "product",
            orderCode: `#${p.id.slice(0, 8).toUpperCase()}`,
            status: daysSince > 7 ? "completed" : "pending",
            product: {
              id: p.id,
              title: p.title,
              image: p.cover_image,
              price: p.price,
              category: p.category,
            },
            quantity: 1,
            items: [],
            buyer: {
              name: "Customer",
              email: "Not available",
              phone: "Not available",
            },
            shipping: {
              method: "N/A",
              fee: 0,
              address: null,
            },
            payment: {
              method: "Direct Sale",
              transactionCode: "N/A",
              subtotal: p.price,
              total: p.price,
              sellersEarning: p.price,
            },
            ncm: null, // Direct sales don't go through NCM
            sellerId: p.store_id,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          });
        }
      }
    } catch (err) {
      console.error("Error loading order:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh in child components
    loadOrder();
  }, [loadOrder]);

  // Actions
  const handlePickBillImage = () => {
    Alert.alert("Select Bill Image", "Choose an option", [
      {
        text: "Take Photo",
        onPress: async () => {
          const result = await takePhoto();
          if (result.success && result.uri) {
            setBillImageUri(result.uri);
          }
        },
      },
      {
        text: "Choose from Library",
        onPress: async () => {
          const result = await pickImage();
          if (result.success && result.uri) {
            setBillImageUri(result.uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleConfirmShipping = async () => {
    if (!order) return;

    // Validate inputs
    if (!shippingId.trim()) {
      Alert.alert("Error", "Please enter the Shipping ID from your bill.");
      return;
    }

    if (!billImageUri) {
      Alert.alert("Error", "Please upload a photo of your shipping bill.");
      return;
    }

    setUploadingBill(true);

    try {
      // Upload bill image to "bill" bucket
      const uploadResult = await uploadImageToStorage(
        billImageUri,
        "bill",
        "shipping-bills",
      );

      if (!uploadResult.success) {
        Alert.alert(
          "Error",
          uploadResult.error || "Failed to upload bill image.",
        );
        setUploadingBill(false);
        return;
      }

      // Update order with shipping info and change status to "processing"
      const { error } = await supabase
        .from("orders")
        .update({
          shipping_id: shippingId.trim(),
          shipping_bill_image: uploadResult.url,
          status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (error) {
        console.error("Error updating order:", error);
        Alert.alert("Error", "Failed to update order status.");
        setUploadingBill(false);
        return;
      }

      // Calculate seller's earnings (95% of product price)
      const sellerEarnings = Math.round(order.payment.subtotal * 0.95);

      // Fetch current profile revenue and update pendingAmount
      const { data: profileData, error: profileFetchError } = await supabase
        .from("profiles")
        .select("revenue")
        .eq("id", order.sellerId)
        .single();

      if (!profileFetchError && profileData) {
        const currentRevenue = (profileData.revenue as ProfileRevenue) || {
          pendingAmount: 0,
          confirmedAmount: 0,
          withdrawnAmount: 0,
          withdrawalHistory: [],
        };

        const updatedRevenue: ProfileRevenue = {
          ...currentRevenue,
          pendingAmount: (currentRevenue.pendingAmount || 0) + sellerEarnings,
        };

        // Update profile with new revenue
        const { error: revenueUpdateError } = await supabase
          .from("profiles")
          .update({
            revenue: updatedRevenue,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.sellerId);

        if (revenueUpdateError) {
          console.error("Error updating revenue:", revenueUpdateError);
          // Don't block the flow, just log the error
        } else {
          // Refresh profile in Redux store to reflect changes across the app
          if (user?.id) {
            dispatch(fetchUserProfile(user.id));
          }
        }
      }

      // Success!
      toast.success("Order is now processing!");
      setShowShippingModal(false);
      setShippingId("");
      setBillImageUri(null);
      loadOrder();
    } catch (err) {
      console.error("Error confirming shipping:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setUploadingBill(false);
    }
  };

  const handleCloseShippingModal = () => {
    setShowShippingModal(false);
    setShippingId("");
    setBillImageUri(null);
  };

  const handleNCMOrderSuccess = async (ncmOrderId: number) => {
    if (!order) return;

    try {
      const result = await updateOrderWithNCM(order.id, ncmOrderId);
      if (result.success) {
        toast.success("Order successfully moved to NCM!");
        router.replace("/orders?filter=processing");
      } else {
        Alert.alert(
          "Warning",
          "NCM order created but failed to update local record. Please note the NCM Order ID: " +
            ncmOrderId,
        );
      }
    } catch (error) {
      console.error("Error updating order with NCM:", error);
    }
  };

  // Sync NCM order status
  const handleNCMSync = async () => {
    if (!order || !order.ncm?.orderId) return;

    try {
      const result = await syncNCMOrderStatus(order.id, order.ncm.orderId);
      if (result.success) {
        if (result.data) {
          toast.success("NCM status synced!");
        } else if ((result as any).warning) {
          // API couldn't be reached but that's OK
          toast.info("Check NCM portal for latest status");
        }
        // Reload order to get updated data
        await loadOrder();
      } else {
        toast.error("Failed to sync NCM status");
      }
    } catch (error) {
      console.error("Error syncing NCM status:", error);
      // Don't show error - the tracking section handles this gracefully
    }
  };

  const handleContact = (type: "email" | "phone") => {
    if (!order) return;
    if (type === "email" && order.buyer.email !== "Not available") {
      Linking.openURL(`mailto:${order.buyer.email}`);
    } else if (type === "phone" && order.buyer.phone !== "Not available") {
      // Validate phone number before trying to open
      if (!isValidNepaliPhone(order.buyer.phone)) {
        Alert.alert(
          "Invalid Phone Number",
          "This phone number doesn't appear to be valid. Please edit the order to fix it.",
          [{ text: "OK" }],
        );
        return;
      }
      Linking.openURL(`tel:${order.buyer.phone}`);
    }
  };

  const handleViewProduct = () => {
    if (order?.product?.id) {
      router.push(`/product/${order.product.id}` as any);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#FAFAFA]">
        <Stack.Screen options={{ headerShown: false }} />
        <CustomHeader title="Order Details" showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B2F2F" />
          <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
            Loading...
          </BodyMediumText>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 bg-[#FAFAFA]">
        <Stack.Screen options={{ headerShown: false }} />
        <CustomHeader title="Order Details" showBackButton />
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-[#FEE2E2] items-center justify-center mb-4">
            <IconSymbol
              name="exclamationmark.triangle.fill"
              size={36}
              color="#DC2626"
            />
          </View>
          <HeadingBoldText style={{ marginBottom: 8 }}>
            Order Not Found
          </HeadingBoldText>
          <BodyRegularText style={{ color: "#6B7280", textAlign: "center" }}>
            We could not find the details for this order.
          </BodyRegularText>
        </View>
      </View>
    );
  }

  // NCM delivery status config (maps NCM statuses to colors)
  const NCM_STATUS_DISPLAY: Record<
    string,
    { bg: string; text: string; label: string; icon: string }
  > = {
    "Pickup Order Created": {
      bg: "#FEF3C7",
      text: "#D97706",
      label: "Pickup Created",
      icon: "doc.text.fill",
    },
    "Drop off Order Created": {
      bg: "#FEF3C7",
      text: "#D97706",
      label: "Order Created",
      icon: "doc.text.fill",
    },
    "Sent for Pickup": {
      bg: "#DBEAFE",
      text: "#2563EB",
      label: "Sent for Pickup",
      icon: "shippingbox.fill",
    },
    "Pickup Complete": {
      bg: "#DBEAFE",
      text: "#2563EB",
      label: "Picked Up",
      icon: "checkmark.circle.fill",
    },
    "In Transit": {
      bg: "#E0E7FF",
      text: "#4F46E5",
      label: "In Transit",
      icon: "arrow.right.circle.fill",
    },
    Arrived: {
      bg: "#DBEAFE",
      text: "#2563EB",
      label: "Arrived at Branch",
      icon: "mappin.circle.fill",
    },
    "Sent for Delivery": {
      bg: "#DBEAFE",
      text: "#2563EB",
      label: "Out for Delivery",
      icon: "paperplane.fill",
    },
    Delivered: {
      bg: "#D1FAE5",
      text: "#059669",
      label: "Delivered",
      icon: "checkmark.seal.fill",
    },
    Returned: {
      bg: "#FEE2E2",
      text: "#DC2626",
      label: "Returned",
      icon: "arrow.uturn.backward.circle.fill",
    },
    Cancelled: {
      bg: "#FEE2E2",
      text: "#DC2626",
      label: "Cancelled",
      icon: "xmark.circle.fill",
    },
  };

  // Use NCM status display if order has NCM data, otherwise use order status
  const statusStyle = order.ncm?.deliveryStatus
    ? NCM_STATUS_DISPLAY[order.ncm.deliveryStatus] ||
      STATUS_CONFIG[order.status] ||
      DEFAULT_STATUS
    : STATUS_CONFIG[order.status] || DEFAULT_STATUS;

  const isSeller = user?.id === order.sellerId;
  const canMarkDelivered =
    isSeller && order.status === "pending" && order.type === "order";

  // Order is editable only if it's pending and hasn't been sent to NCM
  const isEditable =
    isSeller &&
    order.status === "pending" &&
    !order.ncm?.orderId &&
    order.type === "order";

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader
        title="Order Details"
        showBackButton
        rightAction={
          isEditable
            ? {
                label: "Edit",
                icon: "pencil",
                onPress: () => setShowEditModal(true),
                color: "#3B82F6",
              }
            : undefined
        }
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: canMarkDelivered
            ? 100 + Math.max(insets.bottom, 16)
            : 40 + insets.bottom,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B2F2F"
          />
        }
      >
        {/* Status Banner */}
        <View
          className="mx-4 mt-4 p-4 rounded-2xl"
          style={{ backgroundColor: statusStyle.bg }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <IconSymbol
                name={statusStyle.icon as any}
                size={22}
                color={statusStyle.text}
              />
              <HeadingBoldText
                style={{ color: statusStyle.text, fontSize: 17, marginLeft: 8 }}
              >
                {statusStyle.label}
              </HeadingBoldText>
            </View>
            <View className="bg-white/40 px-3 py-1 rounded-full">
              <CaptionText
                style={{
                  color: statusStyle.text,
                  fontWeight: "600",
                  fontSize: 11,
                }}
              >
                {order.orderCode}
              </CaptionText>
            </View>
          </View>
          {order.type === "product" && (
            <CaptionText
              style={{ color: statusStyle.text, marginTop: 8, opacity: 0.85 }}
            >
              This is a sold product. Some details are estimated.
            </CaptionText>
          )}
        </View>

        {/* Product Card(s) */}
        {order.items.length > 1 ? (
          /* Multi-product order: show each item */
          <Section title={`Items (${order.items.length})`}>
            {order.items.map((item, idx) => (
              <TouchableOpacity
                key={item.id + idx}
                activeOpacity={0.7}
                onPress={() => router.push(`/product/${item.id}` as any)}
                className={`flex-row p-4 ${
                  idx < order.items.length - 1
                    ? "border-b border-[#F3F4F6]"
                    : ""
                }`}
              >
                {item.image ? (
                  <Image
                    source={{ uri: getProductImageUrl(item.image) }}
                    className="w-16 h-16 rounded-xl"
                    style={{ backgroundColor: "#F3F4F6" }}
                  />
                ) : (
                  <View className="w-16 h-16 rounded-xl bg-[#F3F4F6] items-center justify-center">
                    <IconSymbol name="bag.fill" size={24} color="#D1D5DB" />
                  </View>
                )}
                <View className="flex-1 ml-3 justify-center">
                  <BodySemiboldText style={{ fontSize: 14 }} numberOfLines={2}>
                    {item.title}
                  </BodySemiboldText>
                  <View className="flex-row items-center justify-between mt-2">
                    <BodyBoldText style={{ fontSize: 16, color: "#3B2F2F" }}>
                      {formatPrice(item.price)}
                    </BodyBoldText>
                    <CaptionText style={{ color: "#6B7280" }}>
                      Qty: {item.quantity}
                    </CaptionText>
                  </View>
                </View>
                <IconSymbol
                  name="chevron.right"
                  size={12}
                  color="#D1D5DB"
                  style={{ alignSelf: "center", marginLeft: 8 }}
                />
              </TouchableOpacity>
            ))}
          </Section>
        ) : (
          /* Single product order: keep existing card */
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleViewProduct}
            className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row p-4">
              {order.product.image ? (
                <Image
                  source={{ uri: getProductImageUrl(order.product.image) }}
                  className="w-24 h-24 rounded-xl"
                  style={{ backgroundColor: "#F3F4F6" }}
                />
              ) : (
                <View className="w-24 h-24 rounded-xl bg-[#F3F4F6] items-center justify-center">
                  <IconSymbol name="bag.fill" size={32} color="#D1D5DB" />
                </View>
              )}
              <View className="flex-1 ml-4 justify-center">
                <BodyBoldText style={{ fontSize: 16 }} numberOfLines={2}>
                  {order.product.title}
                </BodyBoldText>
                <View className="flex-row items-center mt-1">
                  <IconSymbol name="tag.fill" size={11} color="#9CA3AF" />
                  <CaptionText style={{ color: "#9CA3AF", marginLeft: 4 }}>
                    {order.product.category}
                  </CaptionText>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                  <HeadingBoldText style={{ fontSize: 20, color: "#3B2F2F" }}>
                    {formatPrice(order.product.price)}
                  </HeadingBoldText>
                  <CaptionText style={{ color: "#6B7280" }}>
                    Qty: {order.quantity}
                  </CaptionText>
                </View>
              </View>
            </View>
            <View className="bg-[#F9FAFB] px-4 py-2.5 flex-row items-center justify-center">
              <CaptionText style={{ color: "#6B7280" }}>
                Tap to view product
              </CaptionText>
              <IconSymbol
                name="chevron.right"
                size={12}
                color="#9CA3AF"
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Order Timeline - Show simple timeline for non-NCM orders, NCM tracking for NCM orders */}
        {order.ncm?.orderId ? (
          <>
            {/* NCM Tracking Section - Primary tracking for NCM orders */}
            <NCMTrackingSection
              ncmOrderId={order.ncm.orderId}
              deliveryStatus={order.ncm.deliveryStatus}
              paymentStatus={order.ncm.paymentStatus}
              deliveryCharge={order.ncm.deliveryCharge}
              lastSyncedAt={order.ncm.lastSyncedAt}
              onSync={handleNCMSync}
              refreshTrigger={refreshTrigger}
            />

            {/* NCM Comments Section */}
            <NCMCommentsSection
              ncmOrderId={order.ncm.orderId}
              refreshTrigger={refreshTrigger}
            />
          </>
        ) : (
          /* Simple timeline for pending orders (before NCM) */
          <Section title="Order Timeline">
            <SimpleTimeline
              status={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
            />
          </Section>
        )}

        {/* Buyer Info */}
        <Section title="Buyer Information">
          <Row label="Name" value={order.buyer.name} icon="person.fill" />
          <Row
            label="Email"
            value={order.buyer.email}
            icon="envelope.fill"
            highlight={order.buyer.email !== "Not available"}
            onPress={
              order.buyer.email !== "Not available"
                ? () => handleContact("email")
                : undefined
            }
          />
          <Row
            label="Phone"
            value={
              order.buyer.phone
                ? isValidNepaliPhone(order.buyer.phone)
                  ? order.buyer.phone
                  : `${order.buyer.phone} (Invalid)`
                : "Not provided"
            }
            icon="phone.fill"
            highlight={
              order.buyer.phone !== "" &&
              order.buyer.phone !== "Not available" &&
              isValidNepaliPhone(order.buyer.phone)
            }
            onPress={
              order.buyer.phone && order.buyer.phone !== "Not available"
                ? () => handleContact("phone")
                : undefined
            }
            last
          />
        </Section>

        {/* Shipping */}
        {order.shipping.address && (
          <Section title="Shipping Address">
            <Row
              label="Method"
              value={order.shipping.method}
              icon="shippingbox.fill"
            />
            <Row label="Street" value={order.shipping.address.street} />
            <Row label="City" value={order.shipping.address.city} />
            <Row label="District" value={order.shipping.address.district} />
            <Row label="Country" value={order.shipping.address.country} last />
          </Section>
        )}

        {/* Payment */}
        <Section title="Payment Summary">
          <Row
            label="Method"
            value={order.payment.method}
            icon="creditcard.fill"
          />
          <Row
            label="Transaction ID"
            value={order.payment.transactionCode}
            icon="number"
          />
          <Row
            label="Order Date"
            value={dayjs(order.createdAt).format("DD MMM, YYYY • h:mm A")}
            icon="calendar"
          />
          {/* Per-item breakdown for multi-product orders */}
          {order.items.length > 1 ? (
            <>
              {order.items.map((item, idx) => (
                <Row
                  key={item.id + idx}
                  label={`${item.title} (x${item.quantity})`}
                  value={formatPrice(item.price)}
                />
              ))}
              <Row
                label="Items Total"
                value={formatPrice(order.payment.subtotal)}
              />
            </>
          ) : (
            <Row
              label="Product Price"
              value={formatPrice(order.payment.subtotal)}
            />
          )}
          {order.shipping.fee > 0 && (
            <Row label="Shipping Fee" value={formatPrice(order.shipping.fee)} />
          )}
          <Row
            label="Service Charge (5%)"
            value={`- ${formatPrice(
              Math.round(order.payment.subtotal * 0.05),
            )}`}
          />
          {/* Earnings Row with green background */}
          <View
            className="flex-row items-center justify-between px-4 py-4"
            style={{ backgroundColor: "#ECFDF5" }}
          >
            <View className="flex-row items-center flex-1 mr-3">
              <IconSymbol
                name="banknote.fill"
                size={16}
                color="#059669"
                style={{ marginRight: 10 }}
              />
              <BodySemiboldText style={{ color: "#059669", fontSize: 14 }}>
                Your Earnings
              </BodySemiboldText>
            </View>
            <HeadingBoldText style={{ fontSize: 18, color: "#059669" }}>
              {formatPrice(Math.round(order.payment.subtotal * 0.95))}
            </HeadingBoldText>
          </View>
        </Section>

        {/* Order Meta */}
        <Section title="Order Information">
          <Row label="Order ID" value={order.id.slice(0, 16) + "..."} />
          <Row label="Order Code" value={order.orderCode} />
          <Row
            label="Last Updated"
            value={dayjs(order.updatedAt).format("DD MMM, YYYY • h:mm A")}
            last
          />
        </Section>
      </ScrollView>

      {/* Action Buttons */}
      {canMarkDelivered && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4"
          style={{
            // Calculate bottom padding based on system navigation bar
            // Use insets.bottom with a minimum padding for aesthetics
            paddingBottom: Math.max(insets.bottom, 16),
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          {/* Move to NCM Button */}
          <TouchableOpacity
            onPress={() => setShowNCMModal(true)}
            disabled={updating}
            className="bg-[#D4A373] rounded-xl py-4 flex-row items-center justify-center"
            style={{ opacity: updating ? 0.7 : 1 }}
            activeOpacity={0.8}
          >
            <IconSymbol name="paperplane.fill" size={20} color="#FFFFFF" />
            <BodyBoldText
              style={{ color: "#FFFFFF", fontSize: 16, marginLeft: 8 }}
            >
              Move to NCM
            </BodyBoldText>
          </TouchableOpacity>
        </View>
      )}

      {/* Shipping Confirmation Modal */}
      <Modal
        visible={showShippingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseShippingModal}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl px-4 pt-6 pb-10">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <HeadingBoldText style={{ fontSize: 20 }}>
                Confirm Shipping
              </HeadingBoldText>
              <TouchableOpacity
                onPress={handleCloseShippingModal}
                className="w-8 h-8 rounded-full bg-[#F3F4F6] items-center justify-center"
              >
                <IconSymbol name="xmark" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View className="bg-[#FEF3C7] rounded-xl p-4 mb-6">
              <BodyMediumText
                style={{ color: "#92400E", fontSize: 13, lineHeight: 20 }}
              >
                Please enter the Shipping ID from your bill and upload a photo
                of the bill as proof of delivery to our shipping office.
              </BodyMediumText>
            </View>

            {/* Shipping ID Input */}
            <View className="mb-4">
              <BodySemiboldText
                style={{ fontSize: 14, marginBottom: 8, color: "#374151" }}
              >
                Shipping ID *
              </BodySemiboldText>
              <TextInput
                value={shippingId}
                onChangeText={setShippingId}
                placeholder="Enter Shipping ID from receipt"
                placeholderTextColor="#9CA3AF"
                className="bg-[#F3F4F6] rounded-xl px-4 py-3.5"
                style={{ fontSize: 15, color: "#1F2937" }}
              />
            </View>

            {/* Bill Image Upload */}
            <View className="mb-6">
              <BodySemiboldText
                style={{ fontSize: 14, marginBottom: 8, color: "#374151" }}
              >
                Bill Image *
              </BodySemiboldText>
              <TouchableOpacity
                onPress={handlePickBillImage}
                activeOpacity={0.7}
                className="bg-[#F3F4F6] rounded-xl overflow-hidden"
                style={{ height: billImageUri ? 200 : 120 }}
              >
                {billImageUri ? (
                  <View className="flex-1">
                    <Image
                      source={{ uri: billImageUri }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-2 right-2 bg-black/60 px-3 py-1.5 rounded-full flex-row items-center">
                      <IconSymbol
                        name="square.and.pencil"
                        size={12}
                        color="#FFFFFF"
                      />
                      <CaptionText
                        style={{
                          color: "#FFFFFF",
                          marginLeft: 4,
                          fontSize: 11,
                        }}
                      >
                        Change
                      </CaptionText>
                    </View>
                  </View>
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <View className="w-12 h-12 rounded-full bg-[#E5E7EB] items-center justify-center mb-2">
                      <IconSymbol
                        name="camera.fill"
                        size={24}
                        color="#9CA3AF"
                      />
                    </View>
                    <BodyMediumText style={{ color: "#6B7280", fontSize: 14 }}>
                      Tap to upload bill photo
                    </BodyMediumText>
                    <CaptionText style={{ color: "#9CA3AF", marginTop: 4 }}>
                      Take photo or choose from library
                    </CaptionText>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={handleConfirmShipping}
              disabled={uploadingBill || !shippingId.trim() || !billImageUri}
              className="bg-[#3B2F2F] rounded-xl py-4 flex-row items-center justify-center"
              style={{
                opacity:
                  uploadingBill || !shippingId.trim() || !billImageUri
                    ? 0.5
                    : 1,
              }}
              activeOpacity={0.8}
            >
              {uploadingBill ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <BodyBoldText
                    style={{ color: "#FFFFFF", fontSize: 16, marginLeft: 8 }}
                  >
                    Uploading...
                  </BodyBoldText>
                </>
              ) : (
                <>
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={20}
                    color="#FFFFFF"
                  />
                  <BodyBoldText
                    style={{ color: "#FFFFFF", fontSize: 16, marginLeft: 8 }}
                  >
                    Confirm Shipment
                  </BodyBoldText>
                </>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={handleCloseShippingModal}
              disabled={uploadingBill}
              className="mt-3 py-3"
              activeOpacity={0.7}
            >
              <BodyMediumText
                style={{ color: "#6B7280", fontSize: 15, textAlign: "center" }}
              >
                Cancel
              </BodyMediumText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NCM Order Modal */}
      {order && (
        <NCMOrderModal
          visible={showNCMModal}
          onClose={() => setShowNCMModal(false)}
          onSuccess={handleNCMOrderSuccess}
          orderData={{
            orderId: order.id,
            orderCode: order.orderCode,
            buyerName: order.buyer.name,
            buyerPhone: order.buyer.phone,
            vref_id: profile?.store_username || "",
            shippingAddress: order.shipping.address
              ? {
                  ...order.shipping.address,
                  phone: order.buyer.phone,
                }
              : {
                  street: "",
                  city: "",
                  district: "",
                  country: "Nepal",
                  phone: order.buyer.phone,
                },
            productTitle:
              order.items.length > 1
                ? `${order.items[0].title} + ${order.items.length - 1} more`
                : order.product.title,
            totalAmount: order.payment.total,
            shippingFee: order.shipping.fee,
            notes: "",
          }}
        />
      )}

      {/* Edit Order Modal */}
      {order && isEditable && (
        <EditOrderModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            toast.success("Order details updated!");
            loadOrder(); // Refresh order data
          }}
          orderData={{
            orderId: order.id,
            buyerName: order.buyer.name,
            buyerEmail: order.buyer.email,
            buyerPhone: order.buyer.phone,
            shippingAddress: order.shipping.address,
            buyerNotes: "",
          }}
        />
      )}
    </View>
  );
}
