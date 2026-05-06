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

interface OtpVerificationEmailProps {
  customerName?: string;
  otpCode?: string;
  expiryMinutes?: number;
}

export const OtpVerificationEmail = ({
  customerName = 'there',
  otpCode = '123456',
  expiryMinutes = 10,
}: OtpVerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Thriftverse verification code is {otpCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="Thriftverse"
            style={logo}
          />
        </Section>

        <Heading style={h1}>Verify your email</Heading>
        <Text style={text}>Hi {customerName},</Text>
        <Text style={text}>
          Use the verification code below to confirm your email address and
          continue setting up your Thriftverse account.
        </Text>

        <Section style={otpContainer}>
          <Text style={otpLabel}>Your verification code</Text>
          <Text style={otpValue}>{otpCode}</Text>
          <Text style={otpExpiry}>Expires in {expiryMinutes} minutes</Text>
        </Section>

        <Text style={text}>
          If you didn't request this code, you can safely ignore this email —
          someone may have entered your address by mistake.
        </Text>

        <Section style={tipContainer}>
          <Text style={tipTitle}>Keep this code private</Text>
          <Text style={tipText}>
            Thriftverse will never ask for your verification code by phone,
            chat, or email. Don't share it with anyone.
          </Text>
        </Section>

        <Text style={footer}>
          Need help? Reach us at{' '}
          <Link href="https://www.thriftverse.shop/contact" style={footerLink}>
            www.thriftverse.shop/contact
          </Link>
          <br />
          <br />
          Happy thrifting!
          <br />
          The Thriftverse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OtpVerificationEmail;

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
