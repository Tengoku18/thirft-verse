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
} from "@react-email/components";
import * as React from "react";

interface ForgotPasswordEmailProps {
  username?: string;
  verificationCode?: string;
  expiryTime?: string;
}

export const ForgotPasswordEmail = ({
  username = "there",
  verificationCode = "123456",
  expiryTime = "10 minutes",
}: ForgotPasswordEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Thriftverse password reset code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="Thriftverse Logo"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>Hi {username},</Text>
        <Text style={text}>
          We received a request to reset the password for your Thriftverse
          account. Use the verification code below to confirm this is really
          you, then choose a new password.
        </Text>
        <Section style={codeContainer}>
          <Text style={codeText}>{verificationCode}</Text>
        </Section>
        <Text style={text}>
          This code will expire in {expiryTime}. Enter it on the password reset
          screen to continue, then set a new password for your account.
        </Text>
        <Section style={warningContainer}>
          <Text style={warningText}>
            <strong>Didn't request this?</strong> You can safely ignore this
            email — your password won't change unless someone uses this code.
            Never share it with anyone; Thriftverse will never ask for your
            code by phone or email.
          </Text>
        </Section>
        <Text style={footer}>
          Need help? Contact us at{" "}
          <Link href="https://www.thriftverse.shop/contact" style={footerLink}>
            www.thriftverse.shop/contact
          </Link>
          <br />
          <br />
          Best regards,
          <br />
          The Thriftverse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ForgotPasswordEmail;

const main = {
  backgroundColor: "#FAF7F2",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const logoContainer = {
  textAlign: "center" as const,
  padding: "40px 0 20px",
};

const logo = {
  width: "80px",
  height: "80px",
  margin: "0 auto",
};

const h1 = {
  color: "#3B2F2F",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 48px",
  textAlign: "center" as const,
};

const text = {
  color: "#3B2F2F",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
  marginBottom: "16px",
};

const codeContainer = {
  backgroundColor: "#FAF7F2",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 48px",
  textAlign: "center" as const,
  border: "2px solid #D4A373",
};

const codeText = {
  color: "#3B2F2F",
  fontSize: "36px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
  fontFamily: "monospace",
};

const warningContainer = {
  backgroundColor: "#FAF7F2",
  borderLeft: "4px solid #D4A373",
  padding: "16px 48px",
  margin: "24px 0",
};

const warningText = {
  color: "#3B2F2F",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const footer = {
  color: "#6B705C",
  fontSize: "14px",
  lineHeight: "24px",
  padding: "24px 48px",
};

const footerLink = {
  color: "#CB997E",
  textDecoration: "none",
};
