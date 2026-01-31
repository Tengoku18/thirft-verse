# Environment Utility Documentation

This utility provides a robust, error-free way to handle environment-based URLs and configurations across your application.

## Supported Environments

- **local**: Local development (localhost)
- **dev**: Development environment
- **alpha**: Alpha/Staging environment
- **main**: Production environment

## Environment Configuration

### Method 1: Using Custom Environment Variable (Recommended)

Set the `NEXT_PUBLIC_APP_ENV` variable in your `.env` file:

```bash
# .env.local
NEXT_PUBLIC_APP_ENV=local

# .env.development
NEXT_PUBLIC_APP_ENV=dev

# .env.alpha
NEXT_PUBLIC_APP_ENV=alpha

# .env.production
NEXT_PUBLIC_APP_ENV=main
```

### Method 2: Using Explicit URL Override

Set the `NEXT_PUBLIC_APP_URL` variable to use a specific URL:

```bash
# This takes highest priority
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Method 3: Automatic Detection from NODE_ENV

If no custom variables are set, the utility automatically maps `NODE_ENV`:
- `development` → `local`
- `production` → `main`
- `test` → `local`

## Default URLs by Environment

| Environment | Base URL | Domain |
|------------|----------|---------|
| local | http://localhost:3000 | localhost |
| dev | https://dev.thriftverse.shop | dev.thriftverse.shop |
| alpha | https://alpha.thriftverse.shop | alpha.thriftverse.shop |
| main | https://www.thriftverse.shop | thriftverse.shop |

## Usage Examples

### Basic Usage

```typescript
import { getBaseUrl, getFullUrl, getEnvironment } from '@/utils/env';

// Get base URL for current environment
const baseUrl = getBaseUrl();
// Returns: 'http://localhost:3000' (in local)
//          'https://www.thriftverse.shop' (in main)

// Get full URL with path
const exploreUrl = getFullUrl('/explore');
// Returns: 'http://localhost:3000/explore' (in local)
//          'https://www.thriftverse.shop/explore' (in main)

// Get current environment
const env = getEnvironment();
// Returns: 'local' | 'dev' | 'alpha' | 'main'
```

### In Components

```typescript
import { getFullUrl } from '@/utils/env';
import Link from 'next/link';

export default function MyComponent() {
  return (
    <Link href={getFullUrl('/contact')}>
      Contact Us
    </Link>
  );
}
```

### Environment Checks

```typescript
import { isProduction, isDevelopment, getEnvConfig } from '@/utils/env';

// Check if in production
if (isProduction()) {
  // Enable analytics
}

// Check if in development
if (isDevelopment()) {
  // Enable debug mode
}

// Get all environment config
const config = getEnvConfig();
console.log(config);
// {
//   environment: 'local',
//   baseUrl: 'http://localhost:3000',
//   domain: 'localhost',
//   isProduction: false,
//   isDevelopment: true
// }
```

### In API Routes

```typescript
import { getBaseUrl } from '@/utils/env';

export async function POST(request: Request) {
  const callbackUrl = `${getBaseUrl()}/api/payment/callback`;

  // Use callbackUrl in your payment gateway
}
```

## Available Functions

### `getEnvironment(): Environment`
Returns the current environment ('local', 'dev', 'alpha', or 'main')

### `getBaseUrl(): string`
Returns the base URL for the current environment

### `getDomain(): string`
Returns the domain for the current environment

### `getFullUrl(path?: string): string`
Returns the full URL by combining base URL with the provided path

### `isProduction(): boolean`
Returns true if the current environment is 'main'

### `isDevelopment(): boolean`
Returns true if the current environment is 'local'

### `getEnvConfig(): object`
Returns a complete configuration object with all environment details

## Error Handling

All functions include comprehensive error handling:

- **Invalid URLs**: Falls back to localhost
- **Missing environment variables**: Uses NODE_ENV mapping
- **Invalid environment values**: Defaults to 'local'
- **Malformed paths**: Returns sanitized version

The utility will never throw errors - it always provides a safe fallback.

## Testing Different Environments

### Local Development
```bash
# Default - no configuration needed
npm run dev
```

### Development Environment
```bash
# Set in .env.development
NEXT_PUBLIC_APP_ENV=dev
npm run dev
```

### Alpha Environment
```bash
# Set in .env.alpha
NEXT_PUBLIC_APP_ENV=alpha
npm run build && npm start
```

### Production Environment
```bash
# Set in .env.production
NEXT_PUBLIC_APP_ENV=main
npm run build && npm start
```

## Best Practices

1. **Always use `getFullUrl()` for absolute URLs** - This ensures environment-aware URLs
2. **Use relative paths for internal navigation** - Next.js Link handles these automatically
3. **Use `getBaseUrl()` for external integrations** - Payment gateways, email callbacks, etc.
4. **Don't hardcode URLs** - Always use these utility functions
5. **Set `NEXT_PUBLIC_APP_ENV` explicitly** - Don't rely on NODE_ENV mapping in production

## Migration Guide

Replace hardcoded URLs with utility functions:

```typescript
// ❌ Before
const url = 'https://www.thriftverse.shop/explore';

// ✅ After
import { getFullUrl } from '@/utils/env';
const url = getFullUrl('/explore');
```

```typescript
// ❌ Before
<Link href="https://www.thriftverse.shop">Home</Link>

// ✅ After
import { getFullUrl } from '@/utils/env';
<Link href={getFullUrl('/')}>Home</Link>
```
