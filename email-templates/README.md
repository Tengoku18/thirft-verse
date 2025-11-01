# ThriftVerse Email Templates

This directory contains email templates for ThriftVerse using [React Email](https://react.email/).

## Getting Started

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development

To preview and develop email templates:

```bash
npm run dev
```

This will start a development server at `http://localhost:3000` where you can preview all your email templates.

### Export

To export email templates to HTML:

```bash
npm run export
```

This will generate static HTML files in the `out` directory.

## Available Templates

### 1. Welcome Email (`welcome.tsx`)

Sent to new users when they sign up.

**Props:**
- `username`: User's display name

**Usage:**
```tsx
import { WelcomeEmail } from './emails/welcome';

<WelcomeEmail username="John Doe" />
```

### 2. Order Confirmation (`order-confirmation.tsx`)

Sent when a customer completes a purchase from a store.

**Props:**
- `customerName`: Customer's name
- `orderId`: Order identifier
- `orderDate`: Date of order
- `storeName`: Name of the store/seller
- `total`: Total order amount

**Usage:**
```tsx
import { OrderConfirmationEmail } from './emails/order-confirmation';

<OrderConfirmationEmail
  customerName="John Doe"
  orderId="#12345"
  orderDate="11/1/2025"
  storeName="Vintage Finds Shop"
  total={45.00}
/>
```

### 3. Password Reset (`password-reset.tsx`)

Sent when a user requests a password reset.

**Props:**
- `username`: User's name
- `resetLink`: Password reset URL
- `expiryTime`: Link expiry duration

**Usage:**
```tsx
import { PasswordResetEmail } from './emails/password-reset';

<PasswordResetEmail
  username="John Doe"
  resetLink="https://thriftverse.com/reset?token=..."
  expiryTime="1 hour"
/>
```

### 4. Item Sold (`item-sold.tsx`)

Sent to sellers when their item is purchased.

**Props:**
- `sellerName`: Seller's name
- `itemName`: Name of sold item
- `itemImage`: Item image URL
- `salePrice`: Sale amount
- `buyerName`: Buyer's name
- `orderId`: Order identifier
- `saleDate`: Date of sale
- `shippingDeadline`: Deadline for shipping

**Usage:**
```tsx
import { ItemSoldEmail } from './emails/item-sold';

<ItemSoldEmail
  sellerName="Jane Doe"
  itemName="Vintage Jacket"
  salePrice={45.00}
  orderId="#12345"
/>
```

## Creating New Templates

1. Create a new `.tsx` file in the `emails/` directory
2. Import necessary components from `@react-email/components`
3. Define your component with TypeScript props interface
4. Export your component as default
5. Run `npm run dev` to preview

## Integration

To use these templates in your application:

1. Import the template component
2. Render it to HTML using React Email's `render` function
3. Send via your email service (SendGrid, AWS SES, etc.)

Example with SendGrid:

```typescript
import { render } from '@react-email/render';
import { WelcomeEmail } from './emails/welcome';

const emailHtml = render(<WelcomeEmail username="John Doe" />);

// Send with your email service
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to ThriftVerse',
  html: emailHtml,
});
```

## Styling

Templates use inline styles for maximum email client compatibility. The color scheme matches ThriftVerse's brand:

- Primary: `#4F46E5` (Indigo)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Text: `#333333`
- Background: `#f6f9fc`

## Resources

- [React Email Documentation](https://react.email/docs/introduction)
- [React Email Components](https://react.email/docs/components/button)
- [Email Client CSS Support](https://www.caniemail.com/)
