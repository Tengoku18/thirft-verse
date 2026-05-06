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

interface OtpVerificationEmailProps {
  username?: string;
  verificationCode?: string;
  expiryTime?: string;
}

export const OtpVerificationEmail = ({
  username = "there",
  verificationCode = "123456",
  expiryTime = "10 minutes",
}: OtpVerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Thriftverse verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="Thriftverse Logo"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Verify Your Email</Heading>
        <Text style={text}>Hi {username},</Text>
        <Text style={text}>
          Welcome to Thriftverse! Use the verification code below to confirm
          your email address and complete your sign up.
        </Text>
        <Section style={codeContainer}>
          <Text style={codeText}>{verificationCode}</Text>
        </Section>
        <Text style={text}>
          This code will expire in {expiryTime}. If you didn't request this
          code, you can safely ignore this email.
        </Text>
        <Section style={warningContainer}>
          <Text style={warningText}>
            <strong>Security tip:</strong> Never share your verification code
            with anyone. Thriftverse will never ask you for your code via email
            or phone.
          </Text>
        </Section>
        <Text style={footer}>
          Need help? Contact us at{" "}
          <Link href="https://www.thriftverse.shop/contact" style={footerLink}>
            www.thriftverse.shop/contact
          </Link>
          <br />
          <br />
          Happy thrifting,
          <br />
          The Thriftverse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OtpVerificationEmail;

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
