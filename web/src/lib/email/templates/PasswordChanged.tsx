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

interface PasswordChangedEmailProps {
  customerName?: string;
  changedAt?: string;
  device?: string;
  location?: string;
  supportUrl?: string;
}

export const PasswordChangedEmail = ({
  customerName = 'there',
  changedAt = new Date().toLocaleString(),
  device = 'Unknown device',
  location = 'Unknown location',
  supportUrl = 'https://www.thriftverse.shop/contact',
}: PasswordChangedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Thriftverse password was changed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="Thriftverse"
            style={logo}
          />
        </Section>

        <Heading style={h1}>Password changed</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          This is a confirmation that the password for your Thriftverse account
          was just changed. If this was you, no further action is needed.
        </Text>

        <Section style={infoContainer}>
          <Row>
            <Column>
              <Text style={infoLabel}>Changed at</Text>
              <Text style={infoValue}>{changedAt}</Text>
            </Column>
            <Column>
              <Text style={infoLabel}>Device</Text>
              <Text style={infoValue}>{device}</Text>
            </Column>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Column>
              <Text style={infoLabel}>Location</Text>
              <Text style={infoValue}>{location}</Text>
            </Column>
          </Row>
        </Section>

        <Section style={alertContainer}>
          <Text style={alertTitle}>Wasn't you?</Text>
          <Text style={alertText}>
            If you didn't make this change, your account may be compromised.
            Please contact our support team immediately to secure your account.
          </Text>
        </Section>

        <Section style={buttonContainer}>
          <Link style={button} href={supportUrl}>
            Contact Support
          </Link>
        </Section>

        <Text style={footer}>
          For your security, never share your password with anyone. Thriftverse
          will never ask for your password by email or phone.
          <br />
          <br />
          Questions? Reach us at{' '}
          <Link href={supportUrl} style={footerLink}>
            www.thriftverse.shop/contact
          </Link>
          <br />
          <br />
          The Thriftverse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordChangedEmail;

const main = {
  backgroundColor: '#FAF7F2',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#FFFFFF',
  margin: '0 auto',
  padding: '0',
  marginBottom: '40px',
  maxWidth: '600px',
  borderRadius: '16px',
  boxShadow: '0 4px 6px rgba(59, 47, 47, 0.06)',
  overflow: 'hidden',
};

const logoContainer = {
  textAlign: 'center' as const,
  padding: '48px 0 24px',
  backgroundColor: '#FFFFFF',
};

const logo = {
  width: '100px',
  height: '100px',
  margin: '0 auto',
};

const h1 = {
  color: '#3B2F2F',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '30px 0 20px',
  padding: '0 48px',
  textAlign: 'center' as const,
};

const text = {
  color: '#4b3b3b',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
  marginBottom: '16px',
};

const infoContainer = {
  padding: '24px',
  backgroundColor: '#FAF7F2',
  margin: '24px auto',
  borderRadius: '12px',
  border: '1px solid #C7BFB3',
  maxWidth: '500px',
};

const infoLabel = {
  color: '#6B705C',
  fontSize: '13px',
  fontWeight: '500' as const,
  margin: '0 0 6px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const infoValue = {
  color: '#3B2F2F',
  fontSize: '15px',
  fontWeight: '600' as const,
  margin: '0',
};

const alertContainer = {
  backgroundColor: '#FDF6EC',
  borderLeft: '4px solid #CB997E',
  padding: '20px 28px',
  margin: '24px auto',
  borderRadius: '8px',
  maxWidth: '500px',
};

const alertTitle = {
  color: '#3B2F2F',
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0 0 8px',
};

const alertText = {
  color: '#4b3b3b',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const buttonContainer = {
  padding: '8px 48px 24px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#3B2F2F',
  borderRadius: '10px',
  color: '#FAF7F2',
  fontSize: '16px',
  fontWeight: '600' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 36px',
  boxShadow: '0 2px 8px rgba(59, 47, 47, 0.25)',
};

const footer = {
  color: '#6B705C',
  fontSize: '14px',
  lineHeight: '22px',
  padding: '24px 48px',
  textAlign: 'center' as const,
  borderTop: '1px solid #C7BFB3',
  marginTop: '24px',
};

const footerLink = {
  color: '#CB997E',
  textDecoration: 'none',
};
