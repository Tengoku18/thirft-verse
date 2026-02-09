import { getBuyerOrderUrl, getSellerOrderUrl } from '@/utils/orderHelpers';
import { render } from '@react-email/render';
import { FROM_EMAIL, resend } from './client';
import { ItemSoldEmail } from './templates/ItemSold';
import OrderConfirmationEmail from './templates/OrderConfirmation';
import { ProductNotReceivedEmail } from './templates/ProductNotReceived';

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number; // price per unit
}

export interface OrderConfirmationEmailData {
  to: string;
  customerName: string;
  orderId: string;
  orderDate: string;
  storeName: string;
  total: number;
  currency?: string;
  orderDetailsUrl: string;
  orderItems?: OrderItem[]; // For multi-product orders
  shippingFee?: number;
}

export interface ItemSoldEmailData {
  to: string;
  sellerName: string;
  itemName: string;
  salePrice: number;
  currency?: string;
  buyerName: string;
  orderId: string;
  saleDate: string;
  shippingDeadline: string;
  orderDetailsUrl: string;
  orderItems?: OrderItem[]; // For multi-product orders
  shippingFee?: number;
}

/**
 * Send order confirmation email to the buyer
 */
export async function sendOrderConfirmationEmail(
  data: OrderConfirmationEmailData
) {
  try {
    const emailHtml = await render(
      <OrderConfirmationEmail
        customerName={data.customerName}
        orderId={data.orderId}
        orderDate={data.orderDate}
        storeName={data.storeName}
        total={data.total}
        currency={data.currency}
        orderDetailsUrl={data.orderDetailsUrl}
      />
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Order Confirmed - ${data.orderId} | ThriftVerse`,
      html: emailHtml,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

/**
 * Send item sold notification email to the seller
 */
export async function sendItemSoldEmail(data: ItemSoldEmailData) {
  try {
    const emailHtml = await render(
      <ItemSoldEmail
        sellerName={data.sellerName}
        itemName={data.itemName}
        salePrice={data.salePrice}
        currency={data.currency}
        buyerName={data.buyerName}
        orderId={data.orderId}
        saleDate={data.saleDate}
        shippingDeadline={data.shippingDeadline}
        orderDetailsUrl={data.orderDetailsUrl}
      />
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `🎉 Your item has been sold - ${data.orderId} | ThriftVerse`,
      html: emailHtml,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending item sold email:', error);
    return { success: false, error };
  }
}

/**
 * Send both order confirmation and item sold emails after successful payment
 */
export async function sendOrderEmails(params: {
  buyer: {
    email: string;
    name: string;
  };
  seller: {
    email: string;
    name: string;
  };
  order: {
    id: string;
    orderCode: string;
    date: string;
    total: number;
    itemName: string;
    storeName: string;
    currency?: string;
    shippingFee?: number;
    orderItems?: OrderItem[]; // For multi-product orders
  };
}) {
  const { buyer, seller, order } = params;

  // Generate order detail URLs with appropriate view params
  const buyerOrderUrl = getBuyerOrderUrl(order.id);
  const sellerOrderUrl = getSellerOrderUrl(order.id);

  // Calculate shipping deadline (e.g., 3 days from now)
  const shippingDeadline = new Date();
  shippingDeadline.setDate(shippingDeadline.getDate() + 3);

  // Calculate product price without shipping for seller email
  const shippingFee = order.shippingFee || 0;
  const productPrice = order.total - shippingFee;

  // Send emails in parallel
  const [buyerEmailResult, sellerEmailResult] = await Promise.allSettled([
    sendOrderConfirmationEmail({
      to: buyer.email,
      customerName: buyer.name,
      orderId: order.orderCode,
      orderDate: order.date,
      storeName: order.storeName,
      total: order.total,
      currency: order.currency,
      orderDetailsUrl: buyerOrderUrl,
      orderItems: order.orderItems, // Pass order items for multi-product orders
      shippingFee: shippingFee,
    }),
    sendItemSoldEmail({
      to: seller.email,
      sellerName: seller.name,
      itemName: order.itemName,
      salePrice: productPrice,
      currency: order.currency,
      buyerName: buyer.name,
      orderId: order.orderCode,
      saleDate: order.date,
      shippingDeadline: shippingDeadline.toLocaleDateString(),
      orderDetailsUrl: sellerOrderUrl,
      orderItems: order.orderItems, // Pass order items for multi-product orders
      shippingFee: shippingFee,
    }),
  ]);

  return {
    buyerEmail:
      buyerEmailResult.status === 'fulfilled'
        ? buyerEmailResult.value
        : { success: false },
    sellerEmail:
      sellerEmailResult.status === 'fulfilled'
        ? sellerEmailResult.value
        : { success: false },
  };
}

export interface ProductNotReceivedEmailData {
  to: string;
  sellerName: string;
  orderCode: string;
  orderDate: string;
  orderDetailsUrl: string;
}

/**
 * Send product not received alert email to the seller
 */
export async function sendProductNotReceivedEmail(
  data: ProductNotReceivedEmailData
) {
  try {
    const emailHtml = await render(
      <ProductNotReceivedEmail
        sellerName={data.sellerName}
        orderCode={data.orderCode}
        orderDate={data.orderDate}
        orderDetailsUrl={data.orderDetailsUrl}
      />
    );

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `⚠️ URGENT: Product Not Received Report - ${data.orderCode} | ThriftVerse`,
      html: emailHtml,
    });

    console.log('Product not received alert email sent:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending product not received alert email:', error);
    return { success: false, error };
  }
}
