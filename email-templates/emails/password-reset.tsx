import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  username?: string;
  verificationCode?: string;
  expiryTime?: string;
}

export const PasswordResetEmail = ({
  username = 'there',
  verificationCode = '123456',
  expiryTime = '10 minutes',
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Your ThriftVerse password reset code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="ThriftVerse Logo"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Password Reset Request</Heading>
        <Text style={text}>Hi {username},</Text>
        <Text style={text}>
          We received a request to reset your password for your ThriftVerse
          account. If you didn't make this request, you can safely ignore this
          email.
        </Text>
        <Text style={text}>
          To reset your password, enter this verification code in the app:
        </Text>
        <Section style={codeContainer}>
          <Text style={codeText}>{verificationCode}</Text>
        </Section>
        <Text style={text}>
          This code will expire in {expiryTime}. After that, you'll need to
          request a new password reset.
        </Text>
        <Section style={warningContainer}>
          <Text style={warningText}>
            <strong>Security tip:</strong> Never share your verification code
            with anyone. ThriftVerse will never ask you for your code via email
            or phone.
          </Text>
        </Section>
        <Text style={footer}>
          If you need help, contact our support team.
          <br />
          <br />
          Best regards,
          <br />
          The ThriftVerse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoContainer = {
  textAlign: 'center' as const,
  padding: '40px 0 20px',
};

const logo = {
  width: '80px',
  height: '80px',
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
  marginBottom: '16px',
};

const codeContainer = {
  backgroundColor: '#F3F4F6',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 48px',
  textAlign: 'center' as const,
  border: '2px dashed #D1D5DB',
};

const codeText = {
  color: '#3B2F2F',
  fontSize: '36px',
  fontWeight: 'bold',
  letterSpacing: '8px',
  margin: '0',
  fontFamily: 'monospace',
};

const warningContainer = {
  backgroundColor: '#fef3c7',
  borderLeft: '4px solid #f59e0b',
  padding: '16px 48px',
  margin: '24px 0',
};

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '24px 48px',
};
