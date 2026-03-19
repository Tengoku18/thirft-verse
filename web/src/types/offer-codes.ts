export interface AppliedOfferCodeSummary {
  offerCodeId: string;
  code: string;
  discountPercent: number;
  itemsSubtotal: number;
  discountAmount: number;
  discountedItemsTotal: number;
  expiresAt: string;
}
