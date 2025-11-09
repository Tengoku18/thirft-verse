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
import * as React from 'react';

interface WelcomeEmailProps {
  username?: string;
}

export const WelcomeEmail = ({ username = 'there' }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to ThriftVerse - Your sustainable marketplace</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://www.thriftverse.shop/images/vertical-logo.png"
            alt="ThriftVerse Logo"
            style={logo}
          />
        </Section>
        <Heading style={h1}>Welcome to ThriftVerse!</Heading>
        <Text style={text}>Hi {username},</Text>
        <Text style={text}>
          We're thrilled to have you join our sustainable marketplace community.
          ThriftVerse is your destination for discovering unique pre-loved items
          and giving new life to treasures.
        </Text>
        <Section style={buttonContainer}>
          <Link style={button} href="https://thriftverse.com/explore">
            Start Exploring
          </Link>
        </Section>
        <Text style={text}>
          Here's what you can do on ThriftVerse:
        </Text>
        <Text style={list}>• Browse thousands of unique items</Text>
        <Text style={list}>• List your own items for sale</Text>
        <Text style={list}>• Connect with other thrifters</Text>
        <Text style={list}>• Shop sustainably and save money</Text>
        <Text style={text}>
          Happy thrifting!
          <br />
          The ThriftVerse Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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
};

const list = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 48px',
  margin: '4px 0',
};

const buttonContainer = {
  padding: '27px 48px',
};

const button = {
  backgroundColor: '#4F46E5',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
};
