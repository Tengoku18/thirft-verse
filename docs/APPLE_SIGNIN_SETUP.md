# Apple Sign-In Implementation Guide for Thriftverse

## Overview

This document outlines the implementation of Apple Sign-In for the Thriftverse Expo React Native app. The implementation supports both iOS (native) and Android (OAuth fallback).

## Implementation Details

### What's Been Implemented

#### 1. AuthContext (`contexts/AuthContext.tsx`)

- Added `signInWithApple()` method that handles:
  - **iOS**: Native Apple Authentication using `expo-apple-authentication`
  - **Android**: OAuth fallback using Supabase OAuth
  - Full name capture (only on first sign-in)
  - User metadata update with given_name, family_name, full_name

#### 2. UI Components

- **AppleSignInButton** (`components/atoms/AppleSignInButton.tsx`)
  - Native Apple Sign-In button that renders on iOS only
  - Uses official Supabase styling
  - Automatically hidden on Android

#### 3. Sign-In Screen Update (`app/(auth)/signin.tsx`)

- Added Apple Sign-In button below Google sign-in
- Added error handling and loading states
- Only shows button on iOS devices

## Configuration Steps

### Step 1: Supabase Dashboard Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Thriftverse project
3. Navigate to **Authentication** → **Providers**
4. Find and enable **Apple** provider
5. You'll see two sections:

#### For Native iOS SignIn (ONLY Needed for Native-Only):

- This section is pre-filled if Apple has been configured
- The native flow doesn't require additional OAuth configuration

#### For OAuth/Web (Web & Android Support):

- **Services ID**: Create in Apple Developer (see Step 2)
- **Team ID**: Your Apple Developer Team ID
- **Key ID**: From the signing key
- **Client Secret**: Generated from the .p8 file
- **Client IDs**: List all bundle IDs that will use Apple Sign-In

### Step 2: Apple Developer Console Setup

#### For iOS App (Native):

1. Go to [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)
2. Click "Identifiers" in the left menu
3. Click the "+" button to create a new identifier
4. Select "App IDs" and click "Continue"
5. Fill in:
   - **Description**: Thriftverse App
   - **Bundle ID**: `com.thriftverse.app` (make sure this matches your app.json)
6. Under **Capabilities**, check "Sign in with Apple"
7. Click "Continue" and "Register"
8. Done! Native iOS sign-in is ready.

#### For OAuth (Android & Web):

1. Create an **App ID** (same as above)
2. Create a **Services ID**:
   - Go to Apple Developer → Identifiers
   - Select "Services IDs" from dropdown
   - Click "+"
   - Description: Thriftverse Services
   - Identifier: `com.thriftverse.web` (or similar)
   - Check "Sign In with Apple"
   - In "Websites" section:
     - **Primary Domain**: `your-supabase-project.supabase.co`
     - **Return URLs**:
       - `https://your-supabase-project.supabase.co/auth/v1/callback?provider=apple`
3. Create a **Signing Key** (.p8 file):
   - Go to Apple Developer → Certificates, Identifies & Profiles → Keys
   - Click "+"
   - Enable "Sign in with Apple"
   - Click "Configure" and select your Services ID
   - Download the .p8 file (save this securely!)
4. Get your **Team ID**:
   - Go to Apple Developer → Account Settings
   - Team ID is shown under your team name

### Step 3: Update Supabase Apple Provider with OAuth Details

1. Return to Supabase Dashboard → Authentication → Providers → Apple
2. Fill in the OAuth section:
   - **Services ID**: The identifier you created (e.g., `com.thriftverse.web`)
   - **Team ID**: From your Apple Developer account
   - **Key ID**: From your .p8 file
   - **Client ID(s)**: Add your bundle IDs:
     - `com.thriftverse.app` (main app)
     - `com.example.app.dev` (if using dev builds)
     - `host.exp.Exponent` (for Expo Go testing)
3. For the **Client Secret**:
   - Open the .p8 file in a text editor
   - Copy the entire content
   - Paste into Supabase
4. Save the provider configuration

### Step 4: Update app.json

Your `app.json` already has the correct bundle ID:

```json
"ios": {
  "bundleIdentifier": "com.thriftverse.app"
}
```

If you're building development variants, add them:

```json
"ios": {
  "bundleIdentifier": "com.thriftverse.app",
  "entitlements": {
    "aps-environment": "production"
  }
}
```

### Step 5: Deep Linking Configuration (Already Done)

For Android OAuth flow, deep linking is needed. In `app.json`:

```json
"scheme": "thriftverse"
```

This allows callbacks like: `thriftverse://auth/callback`

## Testing

### iOS Testing

#### Option 1: Expo Go (Recommended for quick testing)

```bash
expo start
# Press i to open in iOS simulator
```

Apple Sign-In works natively in Expo Go.

#### Option 2: Development Build

```bash
eas build --platform ios --profile preview
# Or build locally with Xcode
```

#### Option 3: Production Build

```bash
eas build --platform ios --profile production
```

### Android Testing

Apple Sign-In uses OAuth fallback on Android:

1. Build the app: `eas build --platform android`
2. When user taps "Continue with Apple", a web browser opens
3. Complete Apple sign-in in the browser
4. Should redirect back to app with auth tokens

## Key Features

✅ **Native iOS Support** - Uses native Apple Authentication dialog
✅ **Android Fallback** - Uses OAuth web flow via browser
✅ **Full Name Capture** - Saves given_name, family_name, full_name on first sign-in
✅ **Error Handling** - Graceful error messages for users
✅ **Loading States** - Shows loading indicators during authentication
✅ **Auto-Profile Creation** - Creates user profile in Supabase on first sign-in

## Important Notes

### ⚠️ Secret Key Rotation Required

If using OAuth (for Android/Web support), Apple requires rotating the signing key every 6 months:

1. Set a calendar reminder for every 6 months
2. Generate a new signing key (.p8 file) in Apple Developer
3. Update the Client Secret in Supabase

### ⚠️ Full Name Only on First Sign-In

Apple only returns the user's full name on the initial sign-in. If a user revokes and re-authorizes your app, you'll get the name again. Subsequent sign-ins won't include the name.

### ⚠️ Email Address

Apple may hide the user's real email address. If email visibility is set to "private," Apple will provide a unique Apple ID email (e.g., `abc123.id.appleid.com`).

## Troubleshooting

### "Apple authentication is not available"

- This typically means you're on Android or a device that doesn't support native Apple auth
- The OAuth fallback should kick in automatically

### "Invalid Client ID"

- Make sure the Bundle ID in app.json matches what's registered in Apple Developer
- Verify all bundle IDs are added to Supabase's Client IDs list

### "Failed to get identity token"

- May indicate an issue with your App ID configuration
- Verify Sign in with Apple capability is enabled in Apple Developer

### "Auth URL callback error"

- Verify deep linking is configured correctly
- Check that callback URL in Apple Developer matches Supabase

## File Changes

### Modified Files:

- `contexts/AuthContext.tsx` - Added signInWithApple function
- `app/(auth)/signin.tsx` - Added Apple Sign-In button and handler

### New Files:

- `components/atoms/AppleSignInButton.tsx` - Apple Sign-In button component

### Already Installed Dependencies:

- `expo-apple-authentication` (~8.0.8) - Already in package.json

## References

- [Supabase Apple Auth Docs](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Expo Apple Authentication Docs](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Apple Developer Portal](https://developer.apple.com)
- [Sign in with Apple REST API](https://developer.apple.com/documentation/signinwithapplerestapi)

## Next Steps

1. ✅ Code implementation complete
2. ⏳ Configure Apple Developer Console (follow Step 2 above)
3. ⏳ Update Supabase with OAuth details (follow Step 3 above)
4. ⏳ Test in Expo Go or development build
5. ⏳ Submit app for review with Apple Sign-In enabled
