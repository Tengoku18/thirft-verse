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
} from "@react-email/components";
import * as React from "react";

interface PasswordChangedEmailProps {
  username?: string;
  changedAt?: string;
  device?: string;
  location?: string;
  supportUrl?: string;
}

export const PasswordChangedEmail = ({
  username = "there",
  changedAt = new Date().toLocaleString(),
  device = "Unknown device",
  location = "Unknown location",
  supportUrl = "https://www.thriftverse.shop/contact",
}: PasswordChangedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Thriftverse password was changed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="Thriftverse Logo"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Password Changed</Heading>
        <Text style={text}>Hi {username},</Text>
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
          <Row style={{ marginTop: "16px" }}>
            <Column>
              <Text style={infoLabel}>Location</Text>
              <Text style={infoValue}>{location}</Text>
            </Column>
          </Row>
        </Section>
        <Section style={warningContainer}>
          <Text style={warningText}>
            <strong>Wasn't you?</strong> If you didn't make this change, your
            account may be compromised. Please contact our support team
            immediately to secure your account.
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
          Best regards,
          <br />
          The Thriftverse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordChangedEmail;

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

const infoContainer = {
  padding: "24px",
  backgroundColor: "#FAF7F2",
  margin: "24px 48px",
  borderRadius: "12px",
  border: "1px solid #C7BFB3",
};

const infoLabel = {
  color: "#6B705C",
  fontSize: "13px",
  fontWeight: "500" as const,
  margin: "0 0 6px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const infoValue = {
  color: "#3B2F2F",
  fontSize: "15px",
  fontWeight: "600" as const,
  margin: "0",
};

const warningContainer = {
  backgroundColor: "#FDF6EC",
  borderLeft: "4px solid #CB997E",
  padding: "16px 48px",
  margin: "24px 0",
};

const warningText = {
  color: "#3B2F2F",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
};

const buttonContainer = {
  padding: "8px 48px 24px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#3B2F2F",
  borderRadius: "10px",
  color: "#FAF7F2",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 36px",
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
