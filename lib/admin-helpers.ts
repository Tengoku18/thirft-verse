/**
 * Admin helper utilities
 */

/**
 * Get list of admin emails from environment
 */
export const getAdminEmails = (): string[] => {
  const adminEmailsStr = process.env.EXPO_PUBLIC_ADMIN_EMAILS || '';
  return adminEmailsStr
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
};

/**
 * Check if an email belongs to an admin
 */
export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;

  const adminEmails = getAdminEmails();
  const normalizedEmail = email.toLowerCase().trim();

  return adminEmails.some(
    adminEmail => adminEmail.toLowerCase().trim() === normalizedEmail
  );
};

/**
 * Check if current user is an admin
 * Use this with Redux or AuthContext user
 */
export const isCurrentUserAdmin = (userEmail: string | null | undefined): boolean => {
  return isAdminEmail(userEmail);
};
