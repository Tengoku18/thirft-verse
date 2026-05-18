import { useAuth } from "@/contexts/AuthContext";
import { CheckoutForm, checkoutSchema } from "@/lib/validations/checkout";
import { useAppSelector } from "@/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

/**
 * One react-hook-form instance per checkout step screen, hydrated from the
 * checkout Redux slice. Slice values win; empty fields fall back to the
 * user's profile/account so step 1 is pre-filled on a fresh checkout. Later
 * steps get fully populated defaults because earlier steps persist into the
 * slice before navigating.
 */
export function useCheckoutForm() {
  const { user } = useAuth();
  const profile = useAppSelector((s) => s.profile.profile);
  // Defensive: if the store singleton predates the checkout reducer (e.g.
  // during a Fast Refresh before a full reload), s.checkout is undefined.
  // Fall back to empty defaults so the screen still renders/works.
  const checkout = useAppSelector((s) => s.checkout) ?? {
    formData: {} as Record<string, string>,
    quantity: 1,
    offerInput: "",
    appliedOffer: null,
  };
  const product = useAppSelector((s) => s.products.selectedProduct);

  const f = checkout.formData ?? ({} as Record<string, string>);
  const form = useForm<CheckoutForm>({
    resolver: yupResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      buyerName: f.buyerName || profile?.name || "",
      buyerEmail: f.buyerEmail || user?.email || "",
      buyerPhone: f.buyerPhone || "",
      street: f.street || profile?.address || "",
      city: f.city || "",
      district: f.district || profile?.seller_data?.district || "",
      shipping: (f.shipping || undefined) as CheckoutForm["shipping"],
      payment: (f.payment || undefined) as CheckoutForm["payment"],
      buyerNotes: f.buyerNotes || "",
    },
  });

  return { form, product, quantity: checkout.quantity, checkout };
}
