'use client';

import CheckoutStepper, { Step } from '@/_components/CheckoutStepper';
import Button from '@/_components/common/Button';
import { FormCombobox, FormInput, FormTextarea } from '@/_components/forms';
import PaymentMethodSelector, {
  PaymentMethod,
} from '@/_components/PaymentMethodSelector';
import ShippingOptionSelector, {
  ShippingOption,
  getShippingFee,
} from '@/_components/ShippingOptionSelector';
import { validateOfferCodeForCheckout } from '@/actions/offer-codes';
import {
  createMultiProductCodOrder,
  initiateMultiProductEsewaPayment,
  initiateMultiProductFonepayPayment,
} from '@/actions/payment';
import { useCart } from '@/contexts/CartContext';
import { districtsOfNepal } from '@/lib/constants/districts';
import { CheckoutFormData, checkoutSchema } from '@/lib/validations/checkout';
import { ShippingAddress } from '@/types/database';
import { AppliedOfferCodeSummary } from '@/types/offer-codes';
import { formatCheckoutPrice } from '@/utils/formatPrice';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const CHECKOUT_STEPS: Step[] = [
  { id: 1, name: 'Delivery Method', shortName: 'Delivery' },
  { id: 2, name: 'Shipping Details', shortName: 'Details' },
  { id: 3, name: 'Payment Method', shortName: 'Payment' },
  { id: 4, name: 'Review & Pay', shortName: 'Review' },
];

interface MultiProductCheckoutProps {
  storeId: string;
}

export default function MultiProductCheckout({
  storeId,
}: MultiProductCheckoutProps) {
  const router = useRouter();
  const { getStoreCart, clearStoreCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa');
  const [shippingOption, setShippingOption] = useState<ShippingOption>(null);
  const [offerCode, setOfferCode] = useState('');
  const [appliedOffer, setAppliedOffer] =
    useState<AppliedOfferCodeSummary | null>(null);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  const cart = getStoreCart(storeId);

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    trigger,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      buyer_name: '',
      buyer_email: '',
      phone: '',
      street: '',
      city: '',
      district: '',
      country: 'Nepal',
      buyer_notes: '',
    },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-primary mb-4 text-2xl font-bold">
            Cart is Empty
          </h1>
          <p className="text-primary/60 mb-6">
            Your cart is empty. Please add items to your cart first.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-surface rounded-2xl px-6 py-3 font-semibold transition-all hover:scale-105"
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  const itemsTotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = getShippingFee(shippingOption);
  const discountedItemsTotal = appliedOffer?.discountedItemsTotal ?? itemsTotal;
  const totalAmount = discountedItemsTotal + shippingFee;
  const currency = cart.currency;

  const isOfferFailure = (message?: string | null) =>
    Boolean(message && /(offer code|invalid offer|expired)/i.test(message));

  const showOfferSubmissionError = (message: string) => {
    setOfferError(message);
    setAppliedOffer(null);
    setIsProcessing(false);
  };

  const handleApplyOfferCode = async () => {
    const normalizedOfferCode = offerCode.trim().toUpperCase();

    if (!normalizedOfferCode) {
      setOfferError('Enter an offer code first.');
      return;
    }

    setOfferError(null);
    setOfferLoading(true);

    try {
      const result = await validateOfferCodeForCheckout({
        sellerId: cart.storeId,
        code: normalizedOfferCode,
        itemsSubtotal: itemsTotal,
      });

      if (!result.success || !result.offer) {
        setOfferError(result.error || 'Invalid offer code');
        setAppliedOffer(null);
        return;
      }

      setAppliedOffer(result.offer);
      setOfferCode(result.offer.code);
      setOfferError(null);
      toast.success(`Offer applied: ${result.offer.discountPercent}% off`);
    } catch (error) {
      console.error('Failed to apply offer code:', error);
      setOfferError('Could not apply offer code right now.');
      setAppliedOffer(null);
    } finally {
      setOfferLoading(false);
    }
  };

  const clearAppliedOffer = () => {
    setAppliedOffer(null);
    setOfferCode('');
    setOfferError(null);
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!shippingOption) {
        toast.error('Please select a delivery method');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await trigger([
        'buyer_name',
        'buyer_email',
        'phone',
        'street',
        'city',
        'district',
      ]);
      if (!isValid) {
        toast.error('Please fill in all required fields');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const handleCheckoutSubmit = async () => {
    const data = getValues();

    if (!shippingOption) {
      toast.error('Please select a delivery method');
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);

    const shippingAddress: ShippingAddress = {
      street: data.street,
      city: data.city,
      district: data.district,
      country: data.country,
      phone: data.phone,
    };

    try {
      if (paymentMethod === 'cod') {
        const result = await createMultiProductCodOrder({
          storeId: cart.storeId,
          items: cart.items,
          shippingFee,
          shippingOption,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: shippingAddress,
          buyer_notes: data.buyer_notes,
          offerCode: appliedOffer?.code,
        });

        if (result.success && result.orderId) {
          clearStoreCart(storeId);
          toast.success('Order placed successfully!');
          router.push(`/order/${result.orderId}?view=buyer`);
        } else {
          if (isOfferFailure(result.error)) {
            showOfferSubmissionError(result.error || 'Invalid offer code');
            return;
          }
          toast.error(result.error || 'Failed to place order');
          setIsProcessing(false);
        }
      } else if (paymentMethod === 'esewa') {
        const result = await initiateMultiProductEsewaPayment({
          storeId: cart.storeId,
          storeName: cart.storeName,
          items: cart.items,
          shippingFee,
          shippingOption,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: shippingAddress,
          buyer_notes: data.buyer_notes,
          offerCode: appliedOffer?.code,
        });

        if (result.success && result.formHtml) {
          // Clear cart before redirecting to payment gateway
          clearStoreCart(storeId);
          const paymentWindow = window.open('', '_self');
          if (paymentWindow) {
            paymentWindow.document.write(result.formHtml);
            paymentWindow.document.close();
          }
        } else {
          if (isOfferFailure(result.error)) {
            showOfferSubmissionError(result.error || 'Invalid offer code');
            return;
          }
          toast.error(
            `Payment initiation failed: ${result.error || 'Unknown error'}`
          );
          setIsProcessing(false);
        }
      } else if (paymentMethod === 'fonepay') {
        const result = await initiateMultiProductFonepayPayment({
          storeId: cart.storeId,
          storeName: cart.storeName,
          items: cart.items,
          shippingFee,
          shippingOption,
          buyer_name: data.buyer_name,
          buyer_email: data.buyer_email,
          shipping_address: shippingAddress,
          buyer_notes: data.buyer_notes,
          offerCode: appliedOffer?.code,
        });

        if (result.success && result.formHtml) {
          // Clear cart before redirecting to payment gateway
          clearStoreCart(storeId);
          const paymentWindow = window.open('', '_self');
          if (paymentWindow) {
            paymentWindow.document.write(result.formHtml);
            paymentWindow.document.close();
          }
        } else {
          if (isOfferFailure(result.error)) {
            showOfferSubmissionError(result.error || 'Invalid offer code');
            return;
          }
          toast.error(
            `Payment initiation failed: ${result.error || 'Unknown error'}`
          );
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order. Please try again.');
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-secondary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Package className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-primary text-xl font-bold">
                  Choose Delivery Method
                </h2>
                <p className="text-primary/60 text-sm">
                  How would you like to receive your order?
                </p>
              </div>
            </div>
            <ShippingOptionSelector
              selectedOption={shippingOption}
              onOptionChange={setShippingOption}
              currency={currency}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-secondary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <MapPin className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-primary text-xl font-bold">
                  Shipping Details
                </h2>
                <p className="text-primary/60 text-sm">
                  Where should we deliver your order?
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-primary mb-4 text-lg font-semibold">
                Contact Information
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput
                  {...register('buyer_name')}
                  label="Full Name"
                  placeholder="John Doe"
                  error={errors.buyer_name?.message}
                  required
                />
                <FormInput
                  {...register('buyer_email')}
                  type="email"
                  label="Email"
                  placeholder="john@example.com"
                  error={errors.buyer_email?.message}
                  required
                />
                <div className="sm:col-span-2">
                  <FormInput
                    {...register('phone')}
                    type="tel"
                    label="Phone Number"
                    placeholder="9876543210"
                    error={errors.phone?.message}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading text-primary mb-4 text-lg font-semibold">
                Shipping Address
              </h3>
              <div className="grid gap-4">
                <FormInput
                  {...register('street')}
                  label="Street Address"
                  placeholder="street | tole | path"
                  error={errors.street?.message}
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormInput
                    {...register('city')}
                    label="City"
                    placeholder="Kathmandu"
                    error={errors.city?.message}
                    required
                  />
                  <FormCombobox
                    label="District"
                    placeholder="Search district..."
                    error={errors.district?.message}
                    required
                    options={[...districtsOfNepal]}
                    value={watch('district')}
                    onChange={(value) => {
                      setValue('district', value, { shouldValidate: true });
                    }}
                  />
                </div>
                <FormInput
                  {...register('country')}
                  label="Country"
                  error={errors.country?.message}
                  required
                  disabled
                  readOnly
                />
              </div>
            </div>

            <div>
              <h3 className="font-heading text-primary mb-4 text-lg font-semibold">
                Additional Notes (Optional)
              </h3>
              <FormTextarea
                {...register('buyer_notes')}
                label="Notes for Shopkeeper"
                placeholder="Any special instructions or requests for the seller..."
                error={errors.buyer_notes?.message}
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-secondary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <CreditCard className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-primary text-xl font-bold">
                  Payment Method
                </h2>
                <p className="text-primary/60 text-sm">
                  How would you like to pay?
                </p>
              </div>
            </div>
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onMethodChange={setPaymentMethod}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-secondary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <ShoppingBag className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-primary text-xl font-bold">
                  Review Your Order
                </h2>
                <p className="text-primary/60 text-sm">
                  Please confirm your order details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Products */}
              <div className="border-border/30 bg-surface/50 rounded-2xl border p-4">
                <h4 className="text-primary/60 mb-3 text-sm font-semibold tracking-wide uppercase">
                  Products ({cart.items.length} items)
                </h4>
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      {item.coverImage && (
                        <div className="border-border/50 relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                          <Image
                            src={item.coverImage}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-primary text-sm font-semibold">
                          {item.productName}
                        </p>
                        <p className="text-primary/60 text-xs">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-secondary mt-1 text-sm font-semibold">
                          {formatCheckoutPrice(
                            item.price * item.quantity,
                            currency
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Details */}
              <div className="border-border/30 bg-surface/50 rounded-2xl border p-4">
                <h4 className="text-primary/60 mb-3 text-sm font-semibold tracking-wide uppercase">
                  Shipping To
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="text-primary font-semibold">
                    {getValues('buyer_name')}
                  </p>
                  <p className="text-primary/70">{getValues('buyer_email')}</p>
                  <p className="text-primary/70">{getValues('phone')}</p>
                  <p className="text-primary/70">
                    {getValues('street')}, {getValues('city')},{' '}
                    {getValues('district')}
                  </p>
                </div>
              </div>

              {/* Delivery & Payment */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border-border/30 bg-surface/50 rounded-2xl border p-4">
                  <h4 className="text-primary/60 mb-2 text-sm font-semibold tracking-wide uppercase">
                    Delivery
                  </h4>
                  <p className="text-primary font-semibold">
                    {shippingOption === 'home'
                      ? 'Home Delivery'
                      : 'Branch Pickup'}
                  </p>
                  <p className="text-sm text-amber-600">
                    +{formatCheckoutPrice(shippingFee, currency)}
                  </p>
                </div>
                <div className="border-border/30 bg-surface/50 rounded-2xl border p-4">
                  <h4 className="text-primary/60 mb-2 text-sm font-semibold tracking-wide uppercase">
                    Payment
                  </h4>
                  <p className="text-primary font-semibold">
                    {paymentMethod === 'esewa'
                      ? 'eSewa'
                      : paymentMethod === 'fonepay'
                        ? 'FonePay'
                        : 'Cash on Delivery'}
                  </p>
                </div>
              </div>

              <div className="border-border/30 bg-surface/50 rounded-2xl border p-4">
                <h4 className="text-primary/60 mb-3 text-sm font-semibold tracking-wide uppercase">
                  Offer Code
                </h4>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="text-primary mb-2 block text-sm font-medium">
                      Offer Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter seller offer code"
                      value={offerCode}
                      onChange={(event) => {
                        const nextCode = event.target.value.toUpperCase();
                        setOfferCode(nextCode);
                        if (offerError) {
                          setOfferError(null);
                        }
                        if (appliedOffer && nextCode !== appliedOffer.code) {
                          setAppliedOffer(null);
                        }
                      }}
                      className={`bg-surface text-primary focus:border-secondary focus:ring-secondary/20 w-full rounded-xl border px-4 py-3 transition-colors focus:ring-2 focus:outline-none ${
                        offerError ? 'border-red-500' : 'border-border'
                      }`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleApplyOfferCode}
                    disabled={offerLoading}
                    className="h-[50px] shrink-0 sm:min-w-[120px]"
                  >
                    {offerLoading ? 'Applying...' : 'Apply'}
                  </Button>
                </div>
                {offerError && (
                  <p className="mt-2 text-sm text-red-500">{offerError}</p>
                )}
                {appliedOffer && (
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-green-50 px-3 py-2 text-sm">
                    <div>
                      <p className="font-semibold text-green-700">
                        {appliedOffer.code} applied
                      </p>
                      <p className="text-green-600">
                        {appliedOffer.discountPercent}% off until{' '}
                        {new Date(appliedOffer.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearAppliedOffer}
                      className="font-medium text-green-700 transition-colors hover:text-green-900"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="bg-primary/5 rounded-2xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60">Subtotal</span>
                    <span className="text-primary font-medium">
                      {formatCheckoutPrice(itemsTotal, currency)}
                    </span>
                  </div>
                  {appliedOffer && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Offer Discount</span>
                      <span className="font-medium text-green-700">
                        -
                        {formatCheckoutPrice(
                          appliedOffer.discountAmount,
                          currency
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/60">Shipping</span>
                    <span className="font-medium text-amber-600">
                      +{formatCheckoutPrice(shippingFee, currency)}
                    </span>
                  </div>
                  <div className="border-primary/10 flex justify-between border-t pt-2">
                    <span className="text-primary font-semibold">Total</span>
                    <span className="font-heading text-secondary text-2xl font-bold">
                      {formatCheckoutPrice(totalAmount, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="from-background to-surface min-h-screen bg-linear-to-b py-6 sm:py-12">
      <div className="mx-auto max-w-3xl px-4">
        {!isProcessing && (
          <button
            onClick={handleBack}
            className="text-primary/60 hover:text-primary mb-6 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">
              {currentStep === 1 ? 'Back to cart' : 'Back'}
            </span>
          </button>
        )}

        {isProcessing ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="bg-background rounded-2xl p-12 text-center shadow-xl">
              <div className="border-primary/20 border-t-primary mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4"></div>
              <p className="font-heading text-primary text-xl font-semibold">
                Processing...
              </p>
              <p className="text-primary/60 mt-2 text-sm">
                Creating your order...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Summary */}
            <div className="bg-background border-border/20 rounded-2xl border p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary font-semibold">{cart.storeName}</p>
                  <p className="text-primary/60 text-sm">
                    {cart.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-secondary text-xl font-bold">
                    {formatCheckoutPrice(totalAmount, currency)}
                  </p>
                  {appliedOffer ? (
                    <p className="text-xs text-green-700">
                      offer applied before shipping
                    </p>
                  ) : shippingFee > 0 ? (
                    <p className="text-primary/50 text-xs">incl. shipping</p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="bg-background border-border/20 rounded-2xl border p-4 shadow-lg sm:p-6">
              <CheckoutStepper
                steps={CHECKOUT_STEPS}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Step Content */}
            <div className="bg-background border-border/20 rounded-2xl border p-4 shadow-lg sm:p-6">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    onClick={handleBack}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="w-full sm:flex-1"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleCheckoutSubmit}
                    className="w-full sm:flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {paymentMethod === 'cod'
                      ? `Place Order - ${formatCheckoutPrice(totalAmount, currency)}`
                      : `Pay ${formatCheckoutPrice(totalAmount, currency)}`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
