import { FormButton } from "@/components/atoms/FormButton";
import { FormInput } from "@/components/atoms/FormInput";
import { FormPicker } from "@/components/atoms/FormPicker";
import { FormTextarea } from "@/components/atoms/FormTextarea";
import { CustomHeader } from "@/components/navigation/CustomHeader";
import {
  BodyBoldText,
  BodyMediumText,
  BodyRegularText,
  BodySemiboldText,
  CaptionText,
} from "@/components/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { districtsOfNepal } from "@/lib/constants/districts";
import {
  createManualOrder,
  getAvailableProductsForOrder,
} from "@/lib/database-helpers";
import { getProductImageUrl } from "@/lib/storage-helpers";
import {
  createOrderSchema,
  CreateOrderFormData,
} from "@/lib/validations/create-order";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Product type for order creation (partial product data)
interface OrderProduct {
  id: string;
  title: string;
  price: number;
  availability_count: number;
  cover_image: string;
  category: string;
}

const formatPrice = (amount: number) => {
  return `Rs. ${amount.toLocaleString()}`;
};

const shippingOptionOptions = [
  { label: "Home Delivery", value: "home" },
  { label: "Branch Pickup", value: "branch" },
];

const paymentMethodOptions = [
  { label: "COD (Cash on Delivery)", value: "COD" },
  { label: "Online Payment", value: "Online" },
  { label: "Manual/Cash Received", value: "Manual/Cash Received" },
];

export default function CreateOrderScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const { productId } = useLocalSearchParams<{ productId?: string }>();

  const [products, setProducts] = useState<OrderProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preselectedProduct, setPreselectedProduct] = useState<OrderProduct | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateOrderFormData>({
    resolver: yupResolver(createOrderSchema),
    defaultValues: {
      product_id: productId || "",
      quantity: 1,
      buyer_name: "",
      buyer_email: "",
      buyer_phone: "",
      street: "",
      city: "",
      district: "",
      country: "Nepal",
      shipping_fee: 0,
      payment_method: "COD",
      buyer_notes: "",
    },
  });

  // Watch form values for real-time calculations
  const quantity = watch("quantity") || 0;
  const shippingFee = watch("shipping_fee") || 0;
  const selectedProductId = watch("product_id");

  // Load products if no productId is provided
  useEffect(() => {
    const loadProducts = async () => {
      if (!user) return;

      setLoadingProducts(true);
      try {
        const result = await getAvailableProductsForOrder(user.id);
        if (result.success) {
          setProducts(result.data);

          // If productId was provided, find and set the preselected product
          if (productId) {
            const product = result.data.find((p) => p.id === productId);
            if (product) {
              setPreselectedProduct(product as OrderProduct);
              setValue("product_id", productId);
            }
          }
        } else {
          Alert.alert(
            "Error",
            "Failed to load products. Please try again later."
          );
        }
      } catch (error) {
        console.error("Error loading products:", error);
        Alert.alert("Error", "Failed to load products. Please try again.");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [user, productId]);

  // Get selected product details
  const selectedProduct = preselectedProduct || products.find((p) => p.id === selectedProductId);

  // Calculate order totals
  const productPrice = selectedProduct?.price || 0;
  const productCost = productPrice * quantity;
  const platformFee = Math.round(productCost * 0.05);
  const sellerEarning = productCost - platformFee;
  const totalAmount = productCost + shippingFee;

  const onSubmit = async (data: CreateOrderFormData) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to create an order.");
      return;
    }

    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product.");
      return;
    }

    // Validate quantity doesn't exceed availability
    if (data.quantity > selectedProduct.availability_count) {
      Alert.alert(
        "Insufficient Stock",
        `Only ${selectedProduct.availability_count} items available. Please reduce the quantity.`
      );
      return;
    }

    setSubmitting(true);

    try {
      const result = await createManualOrder({
        seller_id: user.id,
        product_id: data.product_id,
        quantity: data.quantity,
        buyer_name: data.buyer_name,
        buyer_email: data.buyer_email,
        buyer_phone: data.buyer_phone,
        street: data.street,
        city: data.city,
        district: data.district,
        country: data.country,
        shipping_fee: data.shipping_fee,
        shipping_option: data.shipping_option as any,
        payment_method: data.payment_method as any,
        buyer_notes: data.buyer_notes,
        product_price: selectedProduct.price,
      });

      if (result.success && result.data) {
        toast.success("Order created successfully!");
        router.replace(`/order/${result.data.id}`);
      } else {
        const errorMessage = result.error && typeof result.error === 'object' && 'message' in result.error
          ? String(result.error.message)
          : "Failed to create order. Please try again.";
        Alert.alert("Error", errorMessage);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProducts) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
          <CustomHeader title="Create Order" showBackButton />
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B2F2F" />
            <BodyMediumText style={{ color: "#6B7280", marginTop: 12 }}>
              Loading products...
            </BodyMediumText>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (products.length === 0 && !preselectedProduct) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
          <CustomHeader title="Create Order" showBackButton />
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-24 h-24 rounded-full bg-[#F3F4F6] justify-center items-center mb-4">
              <IconSymbol name="bag.fill" size={40} color="#9CA3AF" />
            </View>
            <BodyBoldText className="mb-2 text-center">
              No Products Available
            </BodyBoldText>
            <BodyRegularText
              className="text-center leading-relaxed"
              style={{ color: "#6B7280" }}
            >
              You need to add products to your store before creating orders.
            </BodyRegularText>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
        <CustomHeader title="Create Order" showBackButton />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <View className="px-4 pt-2">
            {/* Product Selection/Display */}
            {preselectedProduct ? (
              <View
                className="bg-[#FAFAFA] rounded-2xl p-4 mb-6"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <BodySemiboldText className="mb-3">Product</BodySemiboldText>
                <View className="flex-row">
                  <Image
                    source={{
                      uri: getProductImageUrl(preselectedProduct.cover_image),
                    }}
                    className="w-16 h-16 rounded-xl"
                    style={{ backgroundColor: "#F3F4F6" }}
                  />
                  <View className="flex-1 ml-3">
                    <BodyBoldText>{preselectedProduct.title}</BodyBoldText>
                    <BodyMediumText
                      style={{ color: "#6B7280", marginTop: 4 }}
                    >
                      {formatPrice(preselectedProduct.price)} •{" "}
                      {preselectedProduct.availability_count} available
                    </BodyMediumText>
                  </View>
                </View>
              </View>
            ) : (
              <View className="mb-6">
                <Controller
                  control={control}
                  name="product_id"
                  render={({ field: { onChange, value } }) => (
                    <FormPicker
                      label="Product"
                      value={value}
                      onChange={onChange}
                      options={products.map((p) => ({
                        label: `${p.title} - ${formatPrice(p.price)} (${
                          p.availability_count
                        } available)`,
                        value: p.id,
                      }))}
                      placeholder="Select a product"
                      required
                      error={errors.product_id?.message}
                    />
                  )}
                />
              </View>
            )}

            {/* Buyer Information Section */}
            <View
              className="bg-[#FAFAFA] rounded-2xl p-4 mb-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <BodySemiboldText className="mb-3">
                Buyer Information
              </BodySemiboldText>

              <Controller
                control={control}
                name="buyer_name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Buyer Name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter buyer's full name"
                    error={errors.buyer_name?.message}
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="buyer_email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Buyer Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="buyer@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.buyer_email?.message}
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="buyer_phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Buyer Phone"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="+977 98XXXXXXXX"
                    keyboardType="phone-pad"
                    error={errors.buyer_phone?.message}
                    required
                  />
                )}
              />
            </View>

            {/* Shipping Address Section */}
            <View
              className="bg-[#FAFAFA] rounded-2xl p-4 mb-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <BodySemiboldText className="mb-3">
                Shipping Address
              </BodySemiboldText>

              <Controller
                control={control}
                name="street"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Street Address"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="House number, street name, area"
                    multiline
                    numberOfLines={2}
                    error={errors.street?.message}
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="City"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter city"
                    error={errors.city?.message}
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="district"
                render={({ field: { onChange, value } }) => (
                  <FormPicker
                    label="District"
                    value={value}
                    onChange={onChange}
                    options={districtsOfNepal.map((d) => ({
                      label: d,
                      value: d,
                    }))}
                    placeholder="Select district"
                    required
                    error={errors.district?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="country"
                render={({ field: { value } }) => (
                  <FormInput
                    label="Country"
                    value={value}
                    editable={false}
                    placeholder="Nepal"
                  />
                )}
              />
            </View>

            {/* Order Details Section */}
            <View
              className="bg-[#FAFAFA] rounded-2xl p-4 mb-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <BodySemiboldText className="mb-3">Order Details</BodySemiboldText>

              <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Quantity"
                    value={value.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text.replace(/[^0-9]/g, "")) || 0;
                      onChange(num);
                    }}
                    onBlur={onBlur}
                    placeholder="1"
                    keyboardType="numeric"
                    error={errors.quantity?.message}
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="shipping_fee"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    label="Shipping Fee"
                    value={value.toString()}
                    onChangeText={(text) => {
                      const num = parseInt(text.replace(/[^0-9]/g, "")) || 0;
                      onChange(num);
                    }}
                    onBlur={onBlur}
                    placeholder="0"
                    keyboardType="numeric"
                    error={errors.shipping_fee?.message}
                    required
                  />
                )}
              />

              <Controller
                control={control}
                name="shipping_option"
                render={({ field: { onChange, value } }) => (
                  <FormPicker
                    label="Shipping Option"
                    value={value}
                    onChange={onChange}
                    options={shippingOptionOptions}
                    placeholder="Select shipping option"
                    required
                    error={errors.shipping_option?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="payment_method"
                render={({ field: { onChange, value } }) => (
                  <FormPicker
                    label="Payment Method"
                    value={value}
                    onChange={onChange}
                    options={paymentMethodOptions}
                    placeholder="Select payment method"
                    required
                    error={errors.payment_method?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="buyer_notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormTextarea
                    label="Buyer Notes (Optional)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Any special instructions or notes..."
                    maxLength={500}
                    error={errors.buyer_notes?.message}
                  />
                )}
              />
            </View>

            {/* Order Summary Card */}
            {selectedProduct && (
              <View
                className="bg-[#3B2F2F] rounded-2xl p-4 mb-6"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <BodySemiboldText style={{ color: "#FFFFFF", marginBottom: 12 }}>
                  Order Summary
                </BodySemiboldText>

                <View className="flex-row justify-between mb-2">
                  <BodyRegularText style={{ color: "#D4A373" }}>
                    Product Cost
                  </BodyRegularText>
                  <BodyMediumText style={{ color: "#FFFFFF" }}>
                    {formatPrice(productCost)}
                  </BodyMediumText>
                </View>

                <View className="flex-row justify-between mb-2">
                  <BodyRegularText style={{ color: "#D4A373" }}>
                    Shipping Fee
                  </BodyRegularText>
                  <BodyMediumText style={{ color: "#FFFFFF" }}>
                    {formatPrice(shippingFee)}
                  </BodyMediumText>
                </View>

                <View
                  className="my-3"
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.2)",
                  }}
                />

                <View className="flex-row justify-between mb-2">
                  <BodyBoldText style={{ color: "#FFFFFF" }}>
                    Total Amount
                  </BodyBoldText>
                  <BodyBoldText style={{ color: "#FFFFFF", fontSize: 18 }}>
                    {formatPrice(totalAmount)}
                  </BodyBoldText>
                </View>

                <View
                  className="my-3"
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.2)",
                  }}
                />

                <View className="flex-row justify-between mb-1">
                  <CaptionText style={{ color: "#D4A373" }}>
                    Platform Fee (5%)
                  </CaptionText>
                  <CaptionText style={{ color: "#D4A373" }}>
                    {formatPrice(platformFee)}
                  </CaptionText>
                </View>

                <View className="flex-row justify-between">
                  <BodySemiboldText style={{ color: "#10B981" }}>
                    Your Earning
                  </BodySemiboldText>
                  <BodySemiboldText style={{ color: "#10B981" }}>
                    {formatPrice(sellerEarning)}
                  </BodySemiboldText>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Fixed Bottom Button */}
        <View
          className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4"
          style={{
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
            paddingBottom: Platform.OS === "ios" ? 34 : 16,
          }}
        >
          <FormButton
            title="Create Order"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            disabled={submitting}
            variant="primary"
          />
        </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
