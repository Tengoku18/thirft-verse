import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { formatCheckoutPrice } from '@/utils/formatPrice';

interface ProductNotReceivedEmailProps {
  sellerName?: string;
  itemName?: string;
  orderCode?: string;
  orderDate?: string;
  buyerName?: string;
  buyerEmail?: string;
  shippingAddress?: string;
  orderAmount?: number;
  currency?: string;
  reportDate?: string;
  orderDetailsUrl?: string;
}

export const ProductNotReceivedEmail = ({
  sellerName = 'Seller',
  itemName = 'Product',
  orderCode = '#TV-000000-000000-XXX',
  orderDate = new Date().toLocaleDateString(),
  buyerName = 'Customer',
  buyerEmail = 'customer@example.com',
  shippingAddress = 'Address not provided',
  orderAmount = 0,
  currency = 'USD',
  reportDate = new Date().toLocaleDateString(),
  orderDetailsUrl = 'https://www.thriftverse.shop',
}: ProductNotReceivedEmailProps) => (
  <Html>
    <Head />
    <Preview>URGENT: Customer reports product not received - Order {orderCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/logo-circle.png"
            alt="ThriftVerse Logo"
            style={logo}
          />
        </Section>

        <Section style={alertBanner}>
          <Text style={alertText}>⚠️ URGENT ALERT</Text>
        </Section>

        <Heading style={h1}>Product Not Received Report</Heading>

        <Text style={text}>
          Dear {sellerName},
        </Text>

        <Text style={text}>
          We have received a report from the buyer that they have not received their order.
          This requires your immediate attention.
        </Text>

        <Section style={warningContainer}>
          <Text style={warningTitle}>🚨 Action Required</Text>
          <Text style={warningText}>
            The buyer has reported that the product has not been delivered after 7 days.
            Please investigate this matter and respond promptly to avoid potential disputes.
          </Text>
        </Section>

        <Heading style={h2}>Order Details</Heading>
        <Section style={infoContainer}>
          <Row>
            <Column>
              <Text style={infoLabel}>Order Code</Text>
              <Text style={infoValue}>{orderCode}</Text>
            </Column>
            <Column>
              <Text style={infoLabel}>Order Date</Text>
              <Text style={infoValue}>{orderDate}</Text>
            </Column>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Column>
              <Text style={infoLabel}>Item</Text>
              <Text style={infoValue}>{itemName}</Text>
            </Column>
            <Column>
              <Text style={infoLabel}>Amount</Text>
              <Text style={infoValue}>{formatCheckoutPrice(orderAmount, currency)}</Text>
            </Column>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Column>
              <Text style={infoLabel}>Report Date</Text>
              <Text style={infoValue}>{reportDate}</Text>
            </Column>
            <Column>
              <Text style={infoLabel}>Days Since Order</Text>
              <Text style={infoValue}>7+ days</Text>
            </Column>
          </Row>
        </Section>

        <Heading style={h2}>Buyer Information</Heading>
        <Section style={buyerInfoContainer}>
          <Text style={infoLabel}>Name</Text>
          <Text style={infoValue}>{buyerName}</Text>
          <Text style={{ ...infoLabel, marginTop: '12px' }}>Email</Text>
          <Text style={infoValue}>{buyerEmail}</Text>
          <Text style={{ ...infoLabel, marginTop: '12px' }}>Shipping Address</Text>
          <Text style={infoValue}>{shippingAddress}</Text>
        </Section>

        <Heading style={h2}>What You Should Do</Heading>
        <Section style={stepsContainer}>
          <Text style={stepText}>
            <strong>1.</strong> Check your shipping records and tracking information
          </Text>
          <Text style={stepText}>
            <strong>2.</strong> Contact the shipping carrier to investigate the delivery status
          </Text>
          <Text style={stepText}>
            <strong>3.</strong> Reach out to the buyer directly to resolve the issue
          </Text>
          <Text style={stepText}>
            <strong>4.</strong> Update the order status or provide a resolution within 48 hours
          </Text>
        </Section>

        <Section style={buttonContainer}>
          <Link style={button} href={orderDetailsUrl}>
            View Order Details
          </Link>
        </Section>

        <Section style={tipContainer}>
          <Text style={tipTitle}>📋 Next Steps</Text>
          <Text style={tipText}>
            Please respond to this issue within 48 hours. If the package is confirmed lost or undelivered,
            you may need to issue a refund or send a replacement. Our support team is here to help
            facilitate a fair resolution for both parties.
          </Text>
        </Section>

        <Text style={footer}>
          This is an automated alert generated by the ThriftVerse platform.
          <br />
          <br />
          If you believe this report was made in error or need assistance, please contact our support team immediately.
          <br />
          <br />
          Thank you for your prompt attention to this matter.
          <br />
          The ThriftVerse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ProductNotReceivedEmail;

const main = {
  backgroundColor: '#f9fafb',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginBottom: '40px',
  maxWidth: '600px',
  borderRadius: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
};

const logoContainer = {
  textAlign: 'center' as const,
  padding: '48px 0 24px',
  backgroundColor: '#ffffff',
};

const logo = {
  width: '100px',
  height: '100px',
  margin: '0 auto',
};

const alertBanner = {
  backgroundColor: '#dc2626',
  padding: '16px',
  textAlign: 'center' as const,
  borderBottom: '4px solid #991b1b',
};

const alertText = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  margin: '0',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
};

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
  padding: '0 48px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '22px',
  fontWeight: '600' as const,
  margin: '32px 0 16px',
  padding: '0 48px',
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
  marginBottom: '16px',
};

const warningContainer = {
  backgroundColor: '#fef2f2',
  borderLeft: '4px solid #dc2626',
  padding: '20px',
  margin: '24px 48px',
  borderRadius: '8px',
  border: '1px solid #fecaca',
};

const warningTitle = {
  color: '#991b1b',
  fontSize: '16px',
  fontWeight: '700' as const,
  margin: '0 0 12px',
};

const warningText = {
  color: '#7f1d1d',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const infoContainer = {
  padding: '24px',
  backgroundColor: '#f3f4f6',
  margin: '24px auto',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  maxWidth: '500px',
};

const buyerInfoContainer = {
  padding: '24px',
  backgroundColor: '#eff6ff',
  margin: '24px auto',
  borderRadius: '12px',
  border: '1px solid #bfdbfe',
  maxWidth: '500px',
};

const infoLabel = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '500' as const,
  margin: '0 0 6px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const infoValue = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '600' as const,
  margin: '0',
  wordBreak: 'break-word' as const,
};

const stepsContainer = {
  padding: '0 48px',
  marginTop: '20px',
  marginBottom: '24px',
};

const stepText = {
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: '28px',
  margin: '10px 0',
};

const buttonContainer = {
  padding: '32px 48px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
};

const tipContainer = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '20px',
  margin: '24px 48px',
  borderRadius: '8px',
};

const tipTitle = {
  color: '#78350f',
  fontSize: '16px',
  fontWeight: '600' as const,
  margin: '0 0 12px',
};

const tipText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '24px 48px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e5e7eb',
  marginTop: '24px',
};
