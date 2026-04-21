export interface OrderDetailItem {
  id: string;
  title: string;
  image: string | null;
  price: number;
  quantity: number;
}

export interface OrderDetail {
  id: string;
  type: "order" | "product";
  orderCode: string;
  status: string;

  product: {
    id: string;
    title: string;
    image: string | null;
    price: number;
    category: string;
  };
  quantity: number;
  items: OrderDetailItem[];

  buyer: {
    name: string;
    email: string;
    phone: string;
  };

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

  payment: {
    method: string;
    transactionCode: string | null;
    subtotal: number;
    discountedSubtotal: number;
    offerCode: string | null;
    offerDiscountPercent: number | null;
    offerDiscountAmount: number;
    total: number;
    sellersEarning: number;
  };

  ncm: {
    orderId: number | null;
    status: string | null;
    deliveryStatus: string | null;
    paymentStatus: string | null;
    deliveryCharge: number | null;
    lastSyncedAt: string | null;
  } | null;

  sellerId: string;
  createdAt: string;
  updatedAt: string;
}
