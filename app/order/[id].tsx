import { CustomHeader } from "@/components/navigation/CustomHeader";
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
import { getOrderById, updateOrderStatus } from "@/lib/database-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types/database";
import dayjs from "dayjs";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

// ============================================================================
// TYPES
// ============================================================================

interface OrderDetail {
  // Core
  id: string;
  type: "order" | "product";
  orderCode: string;
  status: "pending" | "completed" | "cancelled" | "refunded";

  // Product
  product: {
    id: string;
    title: string;
    image: string | null;
    price: number;
    category: string;
  };
  quantity: number;

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
      state: string;
      postalCode: string;
      country: string;
    } | null;
  };

  // Payment
  payment: {
    method: string;
    transactionCode: string;
    subtotal: number;
    total: number;
  };

  // Meta
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// HELPERS
// ============================================================================

const formatPrice = (amount: number) => `Rs. ${amount.toLocaleString()}`;

const STATUS_CONFIG = {
  pending: {
    bg: "#FEF3C7",
    text: "#D97706",
    label: "Pending",
    icon: "clock.fill",
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
} as const;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

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

function Timeline({
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

  const steps = [
    {
      id: "placed",
      title: "Order Placed",
      done: true,
      date: orderDate.format("DD MMM • h:mm A"),
    },
    {
      id: "confirmed",
      title: "Confirmed",
      done: true,
      date: orderDate.add(1, "minute").format("DD MMM • h:mm A"),
    },
    {
      id: "processing",
      title: "Processing",
      done: status !== "pending",
      current: status === "pending",
      date:
        status !== "pending"
          ? orderDate.add(1, "hour").format("DD MMM • h:mm A")
          : undefined,
    },
    {
      id: "delivered",
      title: "Delivered",
      done: status === "completed",
      date:
        status === "completed"
          ? updateDate.format("DD MMM • h:mm A")
          : undefined,
    },
  ];

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
              ) : (
                <View className="w-2 h-2 rounded-full bg-white" />
              )}
            </View>
            {idx < steps.length - 1 && (
              <View
                style={{
                  width: 2,
                  height: 28,
                  backgroundColor: step.done ? "#059669" : "#E5E7EB",
                }}
              />
            )}
          </View>
          <View className="ml-3 pb-4 flex-1">
            <BodySemiboldText
              style={{
                fontSize: 13,
                color: step.done || step.current ? "#1F2937" : "#9CA3AF",
              }}
            >
              {step.title}
            </BodySemiboldText>
            {step.date && (
              <CaptionText
                style={{ color: "#9CA3AF", marginTop: 2, fontSize: 11 }}
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SingleOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Load data
  const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
      // Try loading as order first
      const result = await getOrderById(id);

      if (result.success && result.data) {
        const o = result.data as any;
        setOrder({
          id: o.id,
          type: "order",
          orderCode: o.order_code || `#${o.id.slice(0, 8).toUpperCase()}`,
          status: o.status,
          product: {
            id: o.product_id,
            title: o.product?.title || "Order Item",
            image: o.product?.cover_image || null,
            price: o.product?.price || o.amount,
            category: o.product?.category || "Product",
          },
          quantity: o.quantity || 1,
          buyer: {
            name: o.buyer_name,
            email: o.buyer_email,
            phone: o.shipping_address?.phone || o.buyer_phone || "",
          },
          shipping: {
            method: o.shipping_option || "Standard Delivery",
            fee: o.shipping_fee || 0,
            address: o.shipping_address
              ? {
                  street: o.shipping_address.street,
                  city: o.shipping_address.city,
                  state: o.shipping_address.state,
                  postalCode: o.shipping_address.postal_code,
                  country: o.shipping_address.country,
                }
              : null,
          },
          payment: {
            method: o.payment_method,
            transactionCode: o.transaction_code || "N/A",
            subtotal: o.amount - (o.shipping_fee || 0),
            total: o.amount,
          },
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
            },
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
    loadOrder();
  }, [loadOrder]);

  // Actions
  const handleMarkDelivered = () => {
    if (!order || order.type !== "order") {
      Alert.alert(
        "Info",
        "Status can only be updated for orders with full details."
      );
      return;
    }

    Alert.alert(
      "Confirm Delivery",
      "Mark this order as delivered to the delivery store?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            setUpdating(true);
            try {
              const result = await updateOrderStatus(order.id, "completed");
              if (result.success) {
                loadOrder();
                toast.success("Order marked as delivered");
              } else {
                Alert.alert("Error", "Could not update status.");
              }
            } catch {
              Alert.alert("Error", "Something went wrong.");
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  const handleContact = (type: "email" | "phone") => {
    if (!order) return;
    if (type === "email" && order.buyer.email !== "Not available") {
      Linking.openURL(`mailto:${order.buyer.email}`);
    } else if (type === "phone" && order.buyer.phone !== "Not available") {
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

  const statusStyle = STATUS_CONFIG[order.status];
  const isSeller = user?.id === order.sellerId;
  const canMarkDelivered =
    isSeller && order.status === "pending" && order.type === "order";

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader title="Order Details" showBackButton />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: canMarkDelivered ? 140 : 40 }}
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

        {/* Product Card */}
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

        {/* Timeline */}
        <Section title="Order Timeline">
          <Timeline
            status={order.status}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
          />
        </Section>

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
            value={order.buyer.phone || "Not provided"}
            icon="phone.fill"
            highlight={
              order.buyer.phone !== "" && order.buyer.phone !== "Not available"
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
            <Row label="State" value={order.shipping.address.state} />
            <Row
              label="Postal Code"
              value={order.shipping.address.postalCode}
            />
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
          <Row label="Subtotal" value={formatPrice(order.payment.subtotal)} />
          {order.shipping.fee > 0 && (
            <Row label="Shipping" value={formatPrice(order.shipping.fee)} />
          )}
          <View className="px-4 py-4 bg-[#F9FAFB] flex-row items-center justify-between">
            <BodyBoldText style={{ fontSize: 15, color: "#374151" }}>
              Total
            </BodyBoldText>
            <HeadingBoldText style={{ fontSize: 20, color: "#059669" }}>
              {formatPrice(order.payment.total)}
            </HeadingBoldText>
          </View>
        </Section>

        {/* Order Meta */}
        <Section title="Order Information">
          <Row
            label="Order ID"
            value={order.id.slice(0, 16) + "..."}
            icon="doc.text.fill"
          />
          <Row label="Order Code" value={order.orderCode} />
          <Row
            label="Source"
            value={order.type === "order" ? "Order Record" : "Sold Product"}
          />
          <Row
            label="Last Updated"
            value={dayjs(order.updatedAt).format("DD MMM, YYYY • h:mm A")}
            last
          />
        </Section>
      </ScrollView>

      {/* Action Button */}
      {canMarkDelivered && (
        <View
          className="absolute bottom-0 left-0 right-0 bg-white px-4 pt-4 pb-8"
          style={{
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <TouchableOpacity
            onPress={handleMarkDelivered}
            disabled={updating}
            className="bg-[#3B2F2F] rounded-xl py-4 flex-row items-center justify-center"
            style={{ opacity: updating ? 0.7 : 1 }}
            activeOpacity={0.8}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
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
                  Mark as Delivered to Store
                </BodyBoldText>
              </>
            )}
          </TouchableOpacity>
          <CaptionText
            style={{
              color: "#9CA3AF",
              textAlign: "center",
              marginTop: 8,
              fontSize: 12,
            }}
          >
            Confirm when item is handed to delivery partner
          </CaptionText>
        </View>
      )}
    </View>
  );
}
