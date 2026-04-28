import { Product } from "@/lib/types/database";
import { OrderDetail, OrderDetailItem } from "@/lib/types/order";
import dayjs from "dayjs";

export function mapOrderResponse(o: any, orderItems: any[]): OrderDetail {
  const shippingFee = o.shipping_fee || 0;
  const productPrice = (o.amount || 0) - shippingFee;
  const itemsSubtotal = o.items_subtotal ?? productPrice;
  const discountedItemsTotal = o.discounted_items_total ?? itemsSubtotal;
  const offerDiscountAmount =
    o.offer_discount_amount ??
    Math.max(0, Math.round((itemsSubtotal - discountedItemsTotal) * 100) / 100);
  const hasOfferMetadata =
    o.offer_code_id != null || o.offer_code_text != null ||
    o.offer_discount_percent != null || offerDiscountAmount > 0;
  const derivedOfferCode = o.offer_code_text || (o.offer_code_id ? "Applied Offer" : null);
  const isMultiProduct = !o.product_id;

  let product: OrderDetail["product"];
  let items: OrderDetailItem[] = [];

  if (isMultiProduct && orderItems.length > 0) {
    const first = orderItems[0];
    product = {
      id: first.product_id,
      title: orderItems.length > 1 ? `${first.product_name} + ${orderItems.length - 1} more` : first.product_name,
      image: first.cover_image || null,
      price: productPrice,
      category: "Product",
    };
    items = orderItems.map((item: any) => ({
      id: item.product_id,
      title: item.product_name,
      image: item.cover_image || null,
      price: item.price * item.quantity,
      quantity: item.quantity,
    }));
  } else if (isMultiProduct) {
    const customTitle = o.shipping_address?.custom_item_title;
    product = { id: "", title: customTitle || `Order with ${o.quantity || 1} items`, image: null, price: productPrice, category: customTitle ? "Custom Order" : "Product" };
  } else {
    const firstName = orderItems[0]?.product_name;
    product = {
      id: o.product_id || "",
      title: orderItems.length > 1
        ? `${firstName} + ${orderItems.length - 1} more`
        : (o.product?.title || firstName || "Order Item"),
      image: o.product?.cover_image || orderItems[0]?.cover_image || null,
      price: productPrice,
      category: o.product?.category || "Product",
    };
    if (orderItems.length > 0) {
      items = orderItems.map((item: any) => ({
        id: item.product_id,
        title: item.product_name,
        image: item.cover_image || null,
        price: item.price * item.quantity,
        quantity: item.quantity,
      }));
    }
  }

  return {
    id: o.id,
    type: "order",
    orderCode: o.order_code || `#${o.id.slice(0, 8).toUpperCase()}`,
    status: o.status,
    product,
    quantity: o.quantity || 1,
    items,
    buyer: { name: o.buyer_name, email: o.buyer_email, phone: o.shipping_address?.phone || o.buyer_phone || "" },
    shipping: {
      method: o.shipping_option || "Standard Delivery",
      fee: shippingFee,
      address: o.shipping_address
        ? { street: o.shipping_address.street, city: o.shipping_address.city, district: o.shipping_address.district, country: o.shipping_address.country }
        : null,
    },
    payment: {
      method: o.payment_method,
      transactionCode: o.transaction_code || null,
      subtotal: itemsSubtotal,
      discountedSubtotal: discountedItemsTotal,
      offerCode: hasOfferMetadata ? derivedOfferCode : null,
      offerDiscountPercent: o.offer_discount_percent || null,
      offerDiscountAmount,
      total: o.amount,
      sellersEarning: o.sellers_earning || productPrice,
    },
    ncm: o.ncm_order_id ? { orderId: o.ncm_order_id, status: o.ncm_status || null, deliveryStatus: o.ncm_delivery_status || null, paymentStatus: o.ncm_payment_status || null, deliveryCharge: o.ncm_delivery_charge || null, lastSyncedAt: o.ncm_last_synced_at || null } : null,
    sellerId: o.seller_id,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
  };
}

export function mapProductFallback(p: Product): OrderDetail {
  const daysSince = dayjs().diff(dayjs(p.updated_at || p.created_at), "day");
  return {
    id: p.id, type: "product", orderCode: `#${p.id.slice(0, 8).toUpperCase()}`,
    status: daysSince > 7 ? "completed" : "pending",
    product: { id: p.id, title: p.title, image: p.cover_image, price: p.price, category: p.category },
    quantity: 1, items: [],
    buyer: { name: "Customer", email: "Not available", phone: "Not available" },
    shipping: { method: "N/A", fee: 0, address: null },
    payment: { method: "Direct Sale", transactionCode: "N/A", subtotal: p.price, discountedSubtotal: p.price, offerCode: null, offerDiscountPercent: null, offerDiscountAmount: 0, total: p.price, sellersEarning: p.price },
    ncm: null, sellerId: p.store_id, createdAt: p.created_at, updatedAt: p.updated_at,
  };
}
