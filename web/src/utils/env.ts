/**
 * Environment types supported by the application
 */
export type Environment = 'local' | 'dev' | 'alpha' | 'main';

/**
 * Environment configuration mapping
 */
const ENV_CONFIG = {
  local: {
    baseUrl: 'http://localhost:3000',
    domain: 'localhost',
  },
  dev: {
    baseUrl: 'https://dev-thriftverse.vercel.app',
    domain: 'dev-thriftverse.vercel.app',
  },
  alpha: {
    baseUrl: 'https://thrift-verse.vercel.app',
    domain: 'thrift-verse.vercel.app',
  },
  main: {
    baseUrl: 'https://www.thrift-verse.shop',
    domain: 'thriftverse.shop',
  },
} as const;

/**
 * Get the current environment based on environment variables or NODE_ENV
 * Priority:
 * 1. NEXT_PUBLIC_APP_ENV (custom environment variable)
 * 2. NODE_ENV (standard Node.js environment variable)
 * 3. Default to 'local'
 *
 * @returns {Environment} The current environment
 */
export function getEnvironment(): Environment {
  // Check for custom environment variable first
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase().trim();

  // Validate and return custom environment
  if (appEnv && isValidEnvironment(appEnv)) {
    return appEnv as Environment;
  }

  // Fall back to NODE_ENV
  const nodeEnv = process.env.NODE_ENV?.toLowerCase().trim();

  // Map NODE_ENV to our environment types
  switch (nodeEnv) {
    case 'production':
      return 'main';
    case 'development':
      return 'local';
    case 'test':
      return 'local';
    default:
      return 'local';
  }
}

/**
 * Check if a string is a valid environment
 *
 * @param {string} env - The environment string to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEnvironment(env: string): env is Environment {
  return ['local', 'dev', 'alpha', 'main'].includes(env);
}

/**
 * Get the base URL for the current environment
 * This function is safe to use in both server and client contexts
 *
 * @returns {string} The base URL for the current environment
 */
export function getBaseUrl(): string {
  try {
    // If NEXT_PUBLIC_APP_URL is explicitly set, use it (highest priority)
    if (process.env.NEXT_PUBLIC_APP_URL) {
      const url = process.env.NEXT_PUBLIC_APP_URL.trim();
      // Validate URL format
      if (isValidUrl(url)) {
        return url;
      }
    }

    // Get environment and return corresponding base URL
    const env = getEnvironment();
    return ENV_CONFIG[env].baseUrl;
  } catch (error) {
    // Fallback to localhost if anything goes wrong
    console.error('Error getting base URL:', error);
    return 'http://localhost:3000';
  }
}

/**
 * Get the domain for the current environment
 *
 * @returns {string} The domain for the current environment
 */
export function getDomain(): string {
  try {
    // If NEXT_PUBLIC_DOMAINNAME is set, use it
    if (process.env.NEXT_PUBLIC_DOMAINNAME) {
      return process.env.NEXT_PUBLIC_DOMAINNAME.trim();
    }

    // Get environment and return corresponding domain
    const env = getEnvironment();
    return ENV_CONFIG[env].domain;
  } catch (error) {
    // Fallback to localhost if anything goes wrong
    console.error('Error getting domain:', error);
    return 'localhost';
  }
}

/**
 * Validate if a string is a valid URL
 *
 * @param {string} urlString - The URL string to validate
 * @returns {boolean} True if valid URL, false otherwise
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Check if the current environment is production (main)
 *
 * @returns {boolean} True if in production, false otherwise
 */
export function isProduction(): boolean {
  return getEnvironment() === 'main';
}

/**
 * Check if the current environment is development (local)
 *
 * @returns {boolean} True if in development, false otherwise
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'local';
}

/**
 * Get the full URL for a given path
 *
 * @param {string} path - The path to append to the base URL (should start with /)
 * @returns {string} The full URL
 */
export function getFullUrl(path: string = '/'): string {
  try {
    const baseUrl = getBaseUrl();
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    // Remove trailing slash from base URL if present
    const normalizedBaseUrl = baseUrl.endsWith('/')
      ? baseUrl.slice(0, -1)
      : baseUrl;

    return `${normalizedBaseUrl}${normalizedPath}`;
  } catch (error) {
    console.error('Error getting full URL:', error);
    return path;
  }
}

/**
 * Get environment-specific configuration
 *
 * @returns {object} Configuration object for the current environment
 */
export function getEnvConfig() {
  const env = getEnvironment();
  return {
    environment: env,
    baseUrl: getBaseUrl(),
    domain: getDomain(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
  };
}
