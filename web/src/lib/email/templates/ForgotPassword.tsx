import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ForgotPasswordEmailProps {
  customerName?: string;
  otpCode?: string;
  expiryMinutes?: number;
}

export const ForgotPasswordEmail = ({
  customerName = 'there',
  otpCode = '123456',
  expiryMinutes = 10,
}: ForgotPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Thriftverse password reset code is {otpCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="Thriftverse"
            style={logo}
          />
        </Section>

        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          We received a request to reset the password for your Thriftverse
          account. Use the verification code below to confirm it's really you,
          then choose a new password.
        </Text>

        <Section style={otpContainer}>
          <Text style={otpLabel}>Your reset code</Text>
          <Text style={otpValue}>{otpCode}</Text>
          <Text style={otpExpiry}>Expires in {expiryMinutes} minutes</Text>
        </Section>

        <Text style={text}>
          Enter this code on the password reset screen to continue. After that,
          you'll be able to set a new password for your account.
        </Text>

        <Section style={tipContainer}>
          <Text style={tipTitle}>Didn't request this?</Text>
          <Text style={tipText}>
            You can safely ignore this email — your password won't change
            unless someone uses this code. Never share it with anyone;
            Thriftverse will never ask for your code by phone or email.
          </Text>
        </Section>

        <Text style={footer}>
          Need help? Contact us at{' '}
          <Link href="https://www.thriftverse.shop/contact" style={footerLink}>
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

export default ForgotPasswordEmail;

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

const otpContainer = {
  padding: '28px 24px',
  backgroundColor: '#FAF7F2',
  margin: '24px auto',
  borderRadius: '12px',
  border: '2px solid #D4A373',
  maxWidth: '400px',
  textAlign: 'center' as const,
};

const otpLabel = {
  color: '#6B705C',
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '0 0 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const otpValue = {
  color: '#3B2F2F',
  fontSize: '40px',
  fontWeight: '700' as const,
  letterSpacing: '10px',
  margin: '0 0 8px',
};

const otpExpiry = {
  color: '#6B705C',
  fontSize: '13px',
  margin: '8px 0 0',
};

const tipContainer = {
  backgroundColor: '#FAF7F2',
  borderLeft: '4px solid #D4A373',
  padding: '20px 28px',
  margin: '24px auto',
  borderRadius: '8px',
  maxWidth: '500px',
};

const tipTitle = {
  color: '#3B2F2F',
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0 0 8px',
};

const tipText = {
  color: '#4b3b3b',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
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
