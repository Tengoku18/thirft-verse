# Supabase Database Setup

This directory contains SQL migrations and setup instructions for your ThriftVerse Supabase database.

## Required Migrations

### For New Database Setup:

Run these migrations in order:

1. **create-profiles-table.sql** - User profiles and authentication (includes address column)
2. **create-products-table.sql** - Product listings and marketplace

### For Existing Database (Migration):

If your database already exists but is missing the address column:

- **add-address-to-profiles.sql** - Adds address column to existing profiles table

## Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `rsaqwegftpoqqtosgrbx`
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run the Profiles Table Migration

1. In the SQL Editor, click "New Query"
2. Copy the entire contents of `create-profiles-table.sql`
3. Paste it into the SQL Editor
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see a success message

### Step 3: Run the Products Table Migration

1. In the SQL Editor, click "New Query"
2. Copy the entire contents of `create-products-table.sql`
3. Paste it into the SQL Editor
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see a success message

### Step 4: Run Address Migration (If Needed)

**Only run this if you have an existing database and getting "address column missing" errors:**

1. In the SQL Editor, click "New Query"
2. Copy the entire contents of `add-address-to-profiles.sql`
3. Paste it into the SQL Editor
4. Click "Run" (or press Cmd/Ctrl + Enter)
5. You should see a success message

### Step 5: Verify the Tables

1. Click on "Table Editor" in the left sidebar
2. You should see two tables: `profiles` and `products`
3. **Profiles table** columns:
   - `id` (uuid, primary key)
   - `name` (text)
   - `store_username` (text, unique)
   - `bio` (text, nullable)
   - `profile_image` (text, nullable)
   - `currency` (text)
   - `address` (text) ← **NEW: Added for user address**
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
4. **Products table** columns:
   - `id` (uuid, primary key)
   - `store_id` (uuid, foreign key to auth.users)
   - `title` (text)
   - `description` (text, nullable)
   - `category` (text)
   - `price` (decimal)
   - `cover_image` (text)
   - `other_images` (text array)
   - `availability_count` (integer)
   - `status` (product_status enum)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## What These Migrations Do

### Profiles Table Migration

#### 1. Creates the Profiles Table

- Stores user profile information
- Linked to Supabase Auth users via `id` foreign key
- Has unique constraints on `email` and `username`

### 2. Creates Indexes

- Fast lookups for email and username (important for uniqueness checks)

### 3. Sets Up Row Level Security (RLS)

- **SELECT**: Everyone can view profiles (for browsing items)
- **INSERT**: Users can only create their own profile
- **UPDATE**: Users can only update their own profile

### 4. Creates Automatic Triggers

- **Auto-update timestamp**: `updated_at` is automatically set when a row is updated
- **Auto-create profile**: When a user signs up via Auth, their profile is automatically created

### 5. Sets Up Permissions

- Anonymous users can read profiles
- Authenticated users can read and modify their own profiles

### Products Table Migration

#### 1. Creates the Products Table

- Stores product listings for the marketplace
- Linked to user profiles via `store_id` foreign key
- Supports multiple images per product

#### 2. Creates Indexes for Performance

- Fast lookups for store products
- Efficient filtering by status and category
- Optimized sorting by creation date

#### 3. Sets Up Row Level Security (RLS)

- **SELECT**: Everyone can view available products
- **INSERT**: Authenticated users can create products
- **UPDATE/DELETE**: Users can only modify their own products

#### 4. Creates Automatic Triggers

- **Auto-update timestamp**: `updated_at` is automatically set when a row is updated
- **Auto-update status**: Product status automatically changes based on `availability_count`

#### 5. Creates ENUM Types

- `product_status`: 'available' | 'out_of_stock'

## Testing the Setup

After running both migrations, test them by:

### Test Profiles Table:

1. Sign up in your app - the uniqueness checks should now work
2. Check the Supabase Table Editor to see the profile created
3. Try signing up with the same email/username - should show error message
4. View your profile in the app - should see your name and store username

### Test Products Table:

1. Navigate to the "Sell" tab in your app
2. Create a product listing with images, title, description, etc.
3. Go to your profile - you should see the product in the Instagram-style grid
4. Check the Supabase Table Editor to see the product in the `products` table
5. The "Listings" count should update automatically

## How Profile Creation Works

The app uses a **triple-safety approach** to ensure profiles are always created:

### 1. Automatic Creation (via Database Trigger)

When a user signs up with `supabase.auth.signUp()`, user metadata is stored:

- name
- username
- address
- profile_image

After OTP verification, the database trigger `handle_new_user_profile` automatically creates the profile.

### 2. Manual Fallback (SignupStep2)

If the trigger doesn't fire or fails, `SignupStep2.tsx` manually creates the profile after OTP verification using `createUserProfile()`.

### 3. Automatic Recovery (createMissingProfile)

If a user somehow ends up without a profile, the system automatically recovers it when they try to create their first product.

## Troubleshooting

### Error: "Could not find the 'address' column"

**Solution:** Run the migration `add-address-to-profiles.sql` in Supabase SQL Editor.

This error means your database was created before the address field was added. The migration will:

- Add the `address` column to existing profiles table
- Update the trigger to handle address field

### Error: "Profile not being created during signup"

**Check 1: Email Confirmation is Enabled**

- Go to Supabase Dashboard → Authentication → Providers → Email
- Ensure "Confirm email" is enabled

**Check 2: Trigger Exists**
Run this SQL to verify:

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

**Check 3: User Metadata**
After signup, verify metadata is stored:

```sql
SELECT id, email, raw_user_meta_data FROM auth.users WHERE email = 'user@example.com';
```

The metadata should contain: `name`, `username`, `address`, `profile_image`

### Error: "Your profile is missing"

The app will automatically recover the profile. Just try creating a product again and the system will:

1. Detect the missing profile
2. Create it from your auth metadata
3. Retry the product creation
4. Show success message

### Error: "relation already exists"

- The table already exists. You can either:
  - Drop the existing table: `DROP TABLE public.profiles CASCADE;`
  - Or skip this migration if the table structure is correct

### Error: "permission denied"

- Make sure you're using the SQL Editor as the project owner
- Check that your Supabase project is active

## Next Steps

After setting up the database:

### Profiles:

1. The app will automatically check for duplicate emails/usernames
2. When users complete signup, their profile will be created automatically
3. You can extend the profiles table with more fields as needed (e.g., phone, address, preferences)

### Products:

1. Complete the product creation flow in [explore.tsx](../app/explore.tsx) (see TODO comments)
2. Implement image upload to Supabase Storage
3. Add product detail screen for viewing individual products
4. Implement product search and filtering
5. Add product editing and deletion features

### Next Features to Build:

- Product detail screen
- Image upload to Supabase Storage
- Search and filter products by category
- Shopping cart functionality
- Order management system
- Reviews and ratings
