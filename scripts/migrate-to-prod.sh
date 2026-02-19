#!/bin/bash
# ============================================================
# Supabase Dev → Prod Schema Migration Script
# ============================================================
# Migrates EVERYTHING except table data:
#   - Tables, columns, constraints
#   - Indexes
#   - Enums / custom types
#   - Functions & triggers
#   - RLS policies
#   - Storage buckets (listed for manual creation)
#
# Usage:
#   chmod +x scripts/migrate-to-prod.sh
#   ./scripts/migrate-to-prod.sh
#
# Prerequisites:
#   - pg_dump and psql installed (brew install libpq)
#   - Database passwords for both dev and prod Supabase projects
#     (found in Supabase Dashboard → Settings → Database → Connection string)
# ============================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project references
DEV_PROJECT_REF="rsaqwegftpoqqtosgrbx"
PROD_PROJECT_REF="saaifilhhntxnxvudgym"

# Output directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/../supabase/.temp"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCHEMA_FILE="${OUTPUT_DIR}/dev_schema_${TIMESTAMP}.sql"
STORAGE_FILE="${OUTPUT_DIR}/storage_buckets_${TIMESTAMP}.sql"
FULL_MIGRATION_FILE="${OUTPUT_DIR}/full_migration_${TIMESTAMP}.sql"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  Supabase Dev → Prod Schema Migration${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""
echo -e "  Dev project:  ${YELLOW}${DEV_PROJECT_REF}${NC}"
echo -e "  Prod project: ${YELLOW}${PROD_PROJECT_REF}${NC}"
echo ""

# ============================================================
# Step 1: Get database passwords
# ============================================================
echo -e "${BLUE}Step 1: Database credentials${NC}"
echo -e "Find these in: Supabase Dashboard → Settings → Database → Connection string"
echo ""

read -sp "Enter DEV database password: " DEV_DB_PASSWORD
echo ""
read -sp "Enter PROD database password: " PROD_DB_PASSWORD
echo ""
echo ""

# Build connection strings (direct connection, not pooler)
DEV_DB_URL="postgresql://postgres.${DEV_PROJECT_REF}:${DEV_DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
PROD_DB_URL="postgresql://postgres.${PROD_PROJECT_REF}:${PROD_DB_PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# ============================================================
# Step 2: Test connections
# ============================================================
echo -e "${BLUE}Step 2: Testing database connections...${NC}"

echo -n "  Testing DEV connection... "
if psql "$DEV_DB_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo -e "${RED}Could not connect to DEV database. Check your password and ensure the project is active.${NC}"
    echo -e "${YELLOW}Tip: If region is different, edit DEV_DB_URL in this script (check your Supabase dashboard for the correct host).${NC}"
    exit 1
fi

echo -n "  Testing PROD connection... "
if psql "$PROD_DB_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo -e "${RED}Could not connect to PROD database. Check your password and ensure the project is active.${NC}"
    echo -e "${YELLOW}Tip: If region is different, edit PROD_DB_URL in this script (check your Supabase dashboard for the correct host).${NC}"
    exit 1
fi
echo ""

# ============================================================
# Step 3: Dump DEV schema
# ============================================================
echo -e "${BLUE}Step 3: Dumping DEV schema (no data)...${NC}"

# Dump public schema - tables, functions, triggers, indexes, policies, enums
pg_dump "$DEV_DB_URL" \
    --schema-only \
    --no-owner \
    --no-privileges \
    --schema=public \
    --no-comments \
    --format=plain \
    > "$SCHEMA_FILE" 2>/dev/null

echo -e "  Schema dumped to: ${YELLOW}${SCHEMA_FILE}${NC}"

# ============================================================
# Step 4: Dump storage bucket definitions
# ============================================================
echo -e "${BLUE}Step 4: Extracting storage bucket definitions...${NC}"

psql "$DEV_DB_URL" -t -A -F'|' -c "
    SELECT id, name, public, file_size_limit, allowed_mime_types
    FROM storage.buckets
    ORDER BY name;
" 2>/dev/null | while IFS='|' read -r id name is_public size_limit mime_types; do
    if [ -n "$id" ]; then
        echo "-- Bucket: $name (public: $is_public)"
        echo "INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)"
        echo "VALUES ('$id', '$name', $is_public, ${size_limit:-NULL}, ${mime_types:-NULL})"
        echo "ON CONFLICT (id) DO NOTHING;"
        echo ""
    fi
done > "$STORAGE_FILE"

BUCKET_COUNT=$(grep -c "^-- Bucket:" "$STORAGE_FILE" 2>/dev/null || echo "0")
echo -e "  Found ${GREEN}${BUCKET_COUNT}${NC} storage bucket(s)"

# ============================================================
# Step 5: List what was found in DEV
# ============================================================
echo -e "${BLUE}Step 5: Schema summary from DEV...${NC}"

# Count tables
TABLE_COUNT=$(psql "$DEV_DB_URL" -t -A -c "
    SELECT count(*) FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
" 2>/dev/null)
echo -e "  Tables:    ${GREEN}${TABLE_COUNT}${NC}"

# List table names
echo -e "  Table names:"
psql "$DEV_DB_URL" -t -A -c "
    SELECT '    - ' || table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
" 2>/dev/null

# Count functions
FUNC_COUNT=$(psql "$DEV_DB_URL" -t -A -c "
    SELECT count(*) FROM information_schema.routines
    WHERE routine_schema = 'public';
" 2>/dev/null)
echo -e "  Functions: ${GREEN}${FUNC_COUNT}${NC}"

# Count indexes
INDEX_COUNT=$(psql "$DEV_DB_URL" -t -A -c "
    SELECT count(*) FROM pg_indexes WHERE schemaname = 'public';
" 2>/dev/null)
echo -e "  Indexes:   ${GREEN}${INDEX_COUNT}${NC}"

# Count RLS policies
POLICY_COUNT=$(psql "$DEV_DB_URL" -t -A -c "
    SELECT count(*) FROM pg_policies WHERE schemaname = 'public';
" 2>/dev/null)
echo -e "  Policies:  ${GREEN}${POLICY_COUNT}${NC}"

# Count triggers
TRIGGER_COUNT=$(psql "$DEV_DB_URL" -t -A -c "
    SELECT count(*) FROM information_schema.triggers
    WHERE trigger_schema = 'public';
" 2>/dev/null)
echo -e "  Triggers:  ${GREEN}${TRIGGER_COUNT}${NC}"

# Count enums
ENUM_COUNT=$(psql "$DEV_DB_URL" -t -A -c "
    SELECT count(*) FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public' AND t.typtype = 'e';
" 2>/dev/null)
echo -e "  Enums:     ${GREEN}${ENUM_COUNT}${NC}"

# Storage policies
STORAGE_POLICY_COUNT=$(psql "$DEV_DB_URL" -t -A -c "
    SELECT count(*) FROM pg_policies WHERE schemaname = 'storage';
" 2>/dev/null)
echo -e "  Storage policies: ${GREEN}${STORAGE_POLICY_COUNT}${NC}"
echo ""

# ============================================================
# Step 6: Dump storage policies
# ============================================================
echo -e "${BLUE}Step 6: Extracting storage policies...${NC}"

STORAGE_POLICIES_FILE="${OUTPUT_DIR}/storage_policies_${TIMESTAMP}.sql"
psql "$DEV_DB_URL" -t -A -c "
    SELECT
        'CREATE POLICY \"' || polname || '\" ON storage.objects FOR ' ||
        CASE polcmd
            WHEN 'r' THEN 'SELECT'
            WHEN 'a' THEN 'INSERT'
            WHEN 'w' THEN 'UPDATE'
            WHEN 'd' THEN 'DELETE'
            WHEN '*' THEN 'ALL'
        END ||
        CASE WHEN polroles != '{0}' THEN
            ' TO ' || (SELECT string_agg(rolname, ', ') FROM pg_roles WHERE oid = ANY(polroles))
        ELSE '' END ||
        CASE WHEN polqual IS NOT NULL THEN
            ' USING (' || pg_get_expr(polqual, polrelid) || ')'
        ELSE '' END ||
        CASE WHEN polwithcheck IS NOT NULL THEN
            ' WITH CHECK (' || pg_get_expr(polwithcheck, polrelid) || ')'
        ELSE '' END || ';'
    FROM pg_policy
    JOIN pg_class ON pg_policy.polrelid = pg_class.oid
    JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
    WHERE pg_namespace.nspname = 'storage' AND pg_class.relname = 'objects';
" 2>/dev/null > "$STORAGE_POLICIES_FILE"

echo -e "  Storage policies extracted"

# ============================================================
# Step 7: Build full migration file
# ============================================================
echo -e "${BLUE}Step 7: Building full migration file...${NC}"

cat > "$FULL_MIGRATION_FILE" << 'HEADER'
-- ============================================================
-- ThriftVerse: Dev → Prod Schema Migration
-- Generated automatically - DO NOT EDIT
-- ============================================================
-- This migration includes:
--   - Tables, columns, constraints, defaults
--   - Indexes
--   - Enums / custom types
--   - Functions & triggers
--   - RLS policies (public schema)
--   - Storage buckets & policies
-- ============================================================

-- Start transaction
BEGIN;

HEADER

# Add public schema
echo "-- ============================================================" >> "$FULL_MIGRATION_FILE"
echo "-- PUBLIC SCHEMA (tables, functions, triggers, policies, enums)" >> "$FULL_MIGRATION_FILE"
echo "-- ============================================================" >> "$FULL_MIGRATION_FILE"
echo "" >> "$FULL_MIGRATION_FILE"
cat "$SCHEMA_FILE" >> "$FULL_MIGRATION_FILE"

# Add storage buckets
echo "" >> "$FULL_MIGRATION_FILE"
echo "-- ============================================================" >> "$FULL_MIGRATION_FILE"
echo "-- STORAGE BUCKETS" >> "$FULL_MIGRATION_FILE"
echo "-- ============================================================" >> "$FULL_MIGRATION_FILE"
echo "" >> "$FULL_MIGRATION_FILE"
cat "$STORAGE_FILE" >> "$FULL_MIGRATION_FILE"

# Add storage policies
echo "" >> "$FULL_MIGRATION_FILE"
echo "-- ============================================================" >> "$FULL_MIGRATION_FILE"
echo "-- STORAGE POLICIES" >> "$FULL_MIGRATION_FILE"
echo "-- ============================================================" >> "$FULL_MIGRATION_FILE"
echo "" >> "$FULL_MIGRATION_FILE"
cat "$STORAGE_POLICIES_FILE" >> "$FULL_MIGRATION_FILE"

# End transaction
echo "" >> "$FULL_MIGRATION_FILE"
echo "COMMIT;" >> "$FULL_MIGRATION_FILE"

MIGRATION_SIZE=$(wc -l < "$FULL_MIGRATION_FILE" | xargs)
echo -e "  Full migration: ${YELLOW}${FULL_MIGRATION_FILE}${NC} (${MIGRATION_SIZE} lines)"
echo ""

# ============================================================
# Step 8: Confirm before applying
# ============================================================
echo -e "${YELLOW}============================================================${NC}"
echo -e "${YELLOW}  READY TO APPLY TO PRODUCTION${NC}"
echo -e "${YELLOW}============================================================${NC}"
echo ""
echo -e "  This will apply the schema to: ${RED}PRODUCTION (${PROD_PROJECT_REF})${NC}"
echo -e "  Tables: ${TABLE_COUNT} | Functions: ${FUNC_COUNT} | Policies: ${POLICY_COUNT}"
echo -e "  Buckets: ${BUCKET_COUNT} | Triggers: ${TRIGGER_COUNT} | Enums: ${ENUM_COUNT}"
echo ""
echo -e "${YELLOW}  WARNING: This will create tables/functions in production.${NC}"
echo -e "${YELLOW}  Existing objects with the same names may cause errors.${NC}"
echo ""
read -p "Apply to PRODUCTION? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo ""
    echo -e "${YELLOW}Migration cancelled.${NC}"
    echo -e "The migration file is saved at: ${BLUE}${FULL_MIGRATION_FILE}${NC}"
    echo -e "You can apply it manually later with:"
    echo -e "  psql \"\$PROD_DB_URL\" < ${FULL_MIGRATION_FILE}"
    exit 0
fi

# ============================================================
# Step 9: Apply to PRODUCTION
# ============================================================
echo ""
echo -e "${BLUE}Step 9: Applying migration to PRODUCTION...${NC}"

if psql "$PROD_DB_URL" < "$FULL_MIGRATION_FILE" 2>"${OUTPUT_DIR}/migration_errors_${TIMESTAMP}.log"; then
    echo -e "${GREEN}============================================================${NC}"
    echo -e "${GREEN}  Migration completed successfully!${NC}"
    echo -e "${GREEN}============================================================${NC}"
else
    echo -e "${YELLOW}============================================================${NC}"
    echo -e "${YELLOW}  Migration completed with some warnings/errors${NC}"
    echo -e "${YELLOW}============================================================${NC}"
    echo -e "  Check error log: ${RED}${OUTPUT_DIR}/migration_errors_${TIMESTAMP}.log${NC}"
    echo ""
    echo -e "  Common warnings (safe to ignore):"
    echo -e "    - 'relation already exists' → table already created"
    echo -e "    - 'type already exists' → enum already created"
    echo -e "    - 'policy already exists' → RLS policy already created"
fi

# ============================================================
# Step 10: Verify PRODUCTION schema
# ============================================================
echo ""
echo -e "${BLUE}Step 10: Verifying PRODUCTION schema...${NC}"

PROD_TABLES=$(psql "$PROD_DB_URL" -t -A -c "
    SELECT count(*) FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
" 2>/dev/null)

PROD_POLICIES=$(psql "$PROD_DB_URL" -t -A -c "
    SELECT count(*) FROM pg_policies WHERE schemaname = 'public';
" 2>/dev/null)

PROD_FUNCTIONS=$(psql "$PROD_DB_URL" -t -A -c "
    SELECT count(*) FROM information_schema.routines
    WHERE routine_schema = 'public';
" 2>/dev/null)

PROD_BUCKETS=$(psql "$PROD_DB_URL" -t -A -c "
    SELECT count(*) FROM storage.buckets;
" 2>/dev/null)

echo ""
echo -e "  ${BLUE}Comparison:${NC}"
echo -e "  ┌──────────────┬────────┬────────┐"
echo -e "  │              │  DEV   │  PROD  │"
echo -e "  ├──────────────┼────────┼────────┤"
printf "  │ Tables       │ %6s │ %6s │\n" "$TABLE_COUNT" "$PROD_TABLES"
printf "  │ Policies     │ %6s │ %6s │\n" "$POLICY_COUNT" "$PROD_POLICIES"
printf "  │ Functions    │ %6s │ %6s │\n" "$FUNC_COUNT" "$PROD_FUNCTIONS"
printf "  │ Buckets      │ %6s │ %6s │\n" "$BUCKET_COUNT" "$PROD_BUCKETS"
echo -e "  └──────────────┴────────┴────────┘"

if [ "$TABLE_COUNT" = "$PROD_TABLES" ] && [ "$POLICY_COUNT" = "$PROD_POLICIES" ]; then
    echo ""
    echo -e "  ${GREEN}✓ Schema counts match! Migration looks good.${NC}"
else
    echo ""
    echo -e "  ${YELLOW}⚠ Some counts differ. Check the error log for details.${NC}"
fi

echo ""
echo -e "${BLUE}Migration files saved in: ${OUTPUT_DIR}/${NC}"
echo -e "  - ${SCHEMA_FILE##*/}  (public schema)"
echo -e "  - ${STORAGE_FILE##*/}  (storage buckets)"
echo -e "  - ${FULL_MIGRATION_FILE##*/}  (complete migration)"
echo ""
echo -e "${GREEN}Done!${NC}"
