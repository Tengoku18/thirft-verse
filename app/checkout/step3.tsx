import {
  CheckoutFooter,
  ProductSummaryCard,
  ReviewStep,
} from "@/components/checkout";
import { ScreenLayout } from "@/components/layouts";
import { Stepper } from "@/components/ui/Stepper/Stepper";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import {
  createBuyerCodOrder,
  validateCheckoutOfferCode,
} from "@/lib/database-helpers";
import {
  CheckoutForm,
  PaymentMethod,
  SHIPPING_FEES,
  ShippingOption,
} from "@/lib/validations/checkout";
import { cleanNepaliPhone } from "@/lib/validations/create-order";
import {
  resetCheckout,
  setAppliedOffer,
  setCheckoutOfferInput,
} from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { ScrollView, View } from "react-native";

export default function CheckoutStep3() {
  const router = useRouter();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { form, product, quantity, checkout } = useCheckoutForm();

  const [submitting, setSubmitting] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [offerLoading, setOfferLoading] = useState(false);

  const shipping = form.watch("shipping") as ShippingOption | undefined;
  const payment = form.watch("payment") as PaymentMethod | undefined;

  if (!product) return null;

  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;
  const appliedOffer = checkout.appliedOffer;
  const discount =
    appliedOffer && appliedOffer.itemsSubtotal === subtotal
      ? appliedOffer.discountAmount
      : 0;
  const shippingFee = shipping ? SHIPPING_FEES[shipping] : 0;
  const total = subtotal - discount + shippingFee;

  const handleApplyOffer = async () => {
    const code = checkout.offerInput.trim();
    if (!code) return;
    setOfferLoading(true);
    setOfferError(null);
    try {
      const result = await validateCheckoutOfferCode({
        sellerId: product.store_id,
        code,
        itemsSubtotal: subtotal,
      });
      if (!result.success || !result.offer) {
        setOfferError(result.error ?? "Invalid offer code.");
        dispatch(setAppliedOffer(null));
        return;
      }
      dispatch(setAppliedOffer(result.offer));
      setOfferError(null);
    } finally {
      setOfferLoading(false);
    }
  };

  const handleRemoveOffer = () => {
    dispatch(setAppliedOffer(null));
    dispatch(setCheckoutOfferInput(""));
    setOfferError(null);
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (!product || !user) return;
    const finalShipping = data.shipping as ShippingOption;
    const finalPayment = (data.payment as PaymentMethod) ?? "cod";

    if (finalPayment === "esewa" || finalPayment === "fonepay") {
      const currency = product.store?.currency ?? "NPR";
      const url =
        `https://thriftverse.shop/checkout` +
        `?productId=${encodeURIComponent(product.id)}` +
        `&productName=${encodeURIComponent(product.title)}` +
        `&price=${product.price}` +
        `&currency=${encodeURIComponent(currency)}` +
        `&quantity=${quantity}`;
      await WebBrowser.openBrowserAsync(url);
      return;
    }

    setSubmitting(true);
    try {
      const result = await createBuyerCodOrder({
        productId: product.id,
        sellerId: product.store_id,
        productName: product.title,
        productPrice: product.price,
        quantity,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: cleanNepaliPhone(data.buyerPhone),
        street: data.street,
        city: data.city,
        district: data.district,
        shippingOption: finalShipping,
        shippingFee: SHIPPING_FEES[finalShipping],
        buyerNotes: data.buyerNotes ?? "",
        offer: discount > 0 ? appliedOffer : null,
      });

      if (!result.success || !result.orderId) {
        toast.error(result.error ?? "Failed to place order");
        return;
      }

      toast.success("Order placed successfully!");
      dispatch(resetCheckout());
      // Order is done — wipe the checkout funnel (step3 → step2 → Details)
      // from history so Back can't re-enter it. dismissTo pops back to the
      // product screen we came from; then show the receipt on top, so Back
      // from the receipt lands on the product, never the checkout steps.
      router.dismissTo(`/product/${product.id}` as any);
      router.push(`/purchase/${result.orderId}` as any);
    } catch (e: any) {
      console.error("🛑 Place order threw", {
        message: e?.message,
        code: e?.code,
        details: e?.details,
        hint: e?.hint,
      });
      toast.error(e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <ScreenLayout
        title="Checkout"
        contentBackgroundColor="#F5F5F5"
        paddingHorizontal={0}
        scrollable={false}
      >
        <FormProvider {...form}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 180 }}
            keyboardShouldPersistTaps="handled"
          >
            <Stepper title="Review" currentStep={3} totalSteps={3} />
            <View className="px-4 pt-2 gap-4">
              <ProductSummaryCard
                coverImage={product.cover_image}
                title={product.title}
                quantity={quantity}
                unitPrice={unitPrice}
              />
              <ReviewStep
                unitPrice={unitPrice}
                quantity={quantity}
                shippingFee={shippingFee}
                total={total}
                offerInput={checkout.offerInput}
                onOfferInputChange={(v) =>
                  dispatch(setCheckoutOfferInput(v))
                }
                appliedOffer={discount > 0 ? appliedOffer : null}
                offerError={offerError}
                offerLoading={offerLoading}
                onApplyOffer={handleApplyOffer}
                onRemoveOffer={handleRemoveOffer}
              />
            </View>
          </ScrollView>
        </FormProvider>
      </ScreenLayout>

      <CheckoutFooter
        step={3}
        isLastStep
        showTotal
        total={total}
        payment={payment}
        submitting={submitting}
        onBack={() => router.back()}
        onNext={() => {}}
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </View>
  );
}
