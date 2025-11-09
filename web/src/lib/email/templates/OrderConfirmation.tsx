import { formatCheckoutPrice } from '@/utils/formatPrice';
import {
  Body,
  Column,
  Container,
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

interface OrderConfirmationEmailProps {
  customerName?: string;
  orderId?: string;
  orderDate?: string;
  storeName?: string;
  total?: number;
  currency?: string;
  orderDetailsUrl?: string;
}

export const OrderConfirmationEmail = ({
  customerName = 'Customer',
  orderId = '#12345',
  orderDate = new Date().toLocaleDateString(),
  storeName = 'ThriftVerse Store',
  total = 45.00,
  currency = 'USD',
  orderDetailsUrl = 'https://www.thriftverse.shop',
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your ThriftVerse order {orderId} has been confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="ThriftVerse Logo"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Order Confirmed!</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          Thank you for your purchase from <strong>{storeName}</strong>! We've received your payment and your order is confirmed.
        </Text>

        <Section style={orderInfoContainer}>
          <Row>
            <Column>
              <Text style={orderInfoLabel}>Order Number</Text>
              <Text style={orderInfoValue}>{orderId}</Text>
            </Column>
            <Column>
              <Text style={orderInfoLabel}>Order Date</Text>
              <Text style={orderInfoValue}>{orderDate}</Text>
            </Column>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Column>
              <Text style={orderInfoLabel}>Store</Text>
              <Text style={orderInfoValue}>{storeName}</Text>
            </Column>
            <Column>
              <Text style={orderInfoLabel}>Total Amount</Text>
              <Text style={orderInfoValue}>{formatCheckoutPrice(total, currency)}</Text>
            </Column>
          </Row>
        </Section>

        <Text style={text}>
          The seller will prepare your items for shipment. You'll receive another email with tracking information once your order has been shipped.
        </Text>

        <Section style={buttonContainer}>
          <Link style={button} href={orderDetailsUrl}>
            View Order Details
          </Link>
        </Section>

        <Text style={footer}>
          You can view your order details and track your shipment anytime by clicking the button above.
          <br />
          <br />
          If you have any questions, please contact the seller directly through ThriftVerse.
          <br />
          <br />
          Happy thrifting!
          <br />
          The ThriftVerse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

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

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
  padding: '0 48px',
  textAlign: 'center' as const,
};

const text = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
  marginBottom: '16px',
};

const orderInfoContainer = {
  padding: '24px',
  backgroundColor: '#f3f4f6',
  margin: '24px auto',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  maxWidth: '500px',
};

const orderInfoLabel = {
  color: '#6b7280',
  fontSize: '13px',
  fontWeight: '500' as const,
  margin: '0 0 6px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const orderInfoValue = {
  color: '#111827',
  fontSize: '16px',
  fontWeight: '600' as const,
  margin: '0',
};

const buttonContainer = {
  padding: '32px 48px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#10b981',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
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
