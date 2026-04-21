#!/bin/bash
# ============================================================
# Supabase Dev → Prod Schema Migration Script (v2 - Clean)
# ============================================================
# This script safely migrates schema differences from dev to prod
# focusing on NEW COLUMNS and POLICIES only
# ============================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Project references
DEV_PROJECT_REF="rsaqwegftpoqqtosgrbx"
PROD_PROJECT_REF="saaifilhhntxnxvudgym"

# Output directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/../supabase/.temp"
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
MIGRATION_FILE="${OUTPUT_DIR}/migration_${TIMESTAMP}.sql"
ERROR_LOG="${OUTPUT_DIR}/migration_errors_${TIMESTAMP}.log"

# Database URLs
DEV_DB_URL='postgresql://postgres.rsaqwegftpoqqtosgrbx:mCbkfA3TFiEposCw@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'
PROD_DB_URL='postgresql://postgres.saaifilhhntxnxvudgym:mCbkfA3TFiEposCw@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres'

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}  Supabase Dev → Prod Schema Migration (v2)${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# Test connections
echo -e "${BLUE}Testing database connections...${NC}"
if ! psql "$DEV_DB_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Could not connect to DEV database${NC}"
    exit 1
fi
if ! psql "$PROD_DB_URL" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${RED}ERROR: Could not connect to PROD database${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Connections OK${NC}"
echo ""

# Generate migration file
echo -e "${BLUE}Generating migration for new columns and policies...${NC}"

cat > "$MIGRATION_FILE" << 'EOF'
-- ============================================================
-- Supabase Dev → Prod Migration (NEW COLUMNS & POLICIES ONLY)
-- ============================================================
BEGIN;

-- ============================================================
-- Step 0: Create any tables that don't exist yet in prod
-- ============================================================

EOF

# Generate CREATE TABLE IF NOT EXISTS for every table in dev (no constraints, columns added in Step 1)
psql "$DEV_DB_URL" -t -A << 'QUERY' >> "$MIGRATION_FILE"
SELECT
    'CREATE TABLE IF NOT EXISTS ' || table_name || ' (' ||
    string_agg(
        column_name || ' ' || udt_name ||
        CASE WHEN is_nullable = 'NO' AND column_default IS NOT NULL THEN ' NOT NULL DEFAULT ' || column_default
             WHEN is_nullable = 'NO' THEN ' NOT NULL'
             ELSE ''
        END,
        ', ' ORDER BY ordinal_position
    ) || ');'
FROM information_schema.columns
WHERE table_schema = 'public'
  AND udt_name NOT IN ('vector')
GROUP BY table_name
ORDER BY table_name;
QUERY

cat >> "$MIGRATION_FILE" << 'EOF'

-- ============================================================
-- Step 1: Add new columns to existing tables
-- ============================================================
-- These ALTER TABLE statements will only add columns that don't already exist

EOF

# Query dev database for all columns in all tables
psql "$DEV_DB_URL" -t -A << 'QUERY' >> "$MIGRATION_FILE"
SELECT
    'ALTER TABLE ' || t.table_name || ' ADD COLUMN IF NOT EXISTS ' ||
    c.column_name || ' ' || c.udt_name ||
    CASE WHEN c.is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
    CASE WHEN c.column_default IS NOT NULL THEN ' DEFAULT ' || c.column_default ELSE '' END || ';'
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  AND c.udt_name NOT IN ('vector')  -- Exclude pgvector and other extension types
ORDER BY t.table_name, c.ordinal_position;
QUERY

cat >> "$MIGRATION_FILE" << 'EOF'

-- ============================================================
-- Step 2: Add new indexes that don't exist
-- ============================================================

EOF

# Get indexes from dev
psql "$DEV_DB_URL" -t -A << 'QUERY' >> "$MIGRATION_FILE"
SELECT 
    pg_get_indexdef(i.indexrelid) || ';'
FROM pg_indexes i
WHERE schemaname = 'public'
  AND indexname NOT LIKE '%_pkey'
ORDER BY indexname;
QUERY

cat >> "$MIGRATION_FILE" << 'EOF'

-- ============================================================
-- Step 3: Add/update RLS policies
-- ============================================================

EOF

# Get policies from dev
psql "$DEV_DB_URL" -t -A << 'QUERY' >> "$MIGRATION_FILE"
SELECT 
    'CREATE POLICY IF NOT EXISTS "' || polname || '" ON ' || 
    schemaname || '.' || tablename || ' AS ' ||
    CASE WHEN polpermissive THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END || ' FOR ' ||
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
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, polname;
QUERY

cat >> "$MIGRATION_FILE" << 'EOF'

-- ============================================================
-- Commit transaction
-- ============================================================
COMMIT;
EOF

echo -e "${GREEN}✓ Migration file created${NC}"
echo ""

# Display file size
LINES=$(wc -l < "$MIGRATION_FILE" | xargs)
echo -e "  Migration file: ${YELLOW}${MIGRATION_FILE}${NC}"
echo -e "  Size: ${LINES} lines"
echo ""

# Show what will be migrated
echo -e "${BLUE}Preview of migration:${NC}"
head -30 "$MIGRATION_FILE"
echo "  ... (see full file above)"
echo ""

# Confirm before applying
echo -e "${YELLOW}============================================================${NC}"
echo -e "${YELLOW}  READY TO APPLY TO PRODUCTION${NC}"
echo -e "${YELLOW}============================================================${NC}"
echo ""
echo -e "${RED}⚠️  This will modify PRODUCTION database${NC}"
echo -e "  Target: ${YELLOW}${PROD_PROJECT_REF}${NC}"
echo ""
read -p "Apply migration to PRODUCTION? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Migration cancelled.${NC}"
    echo -e "Migration file saved at: ${BLUE}${MIGRATION_FILE}${NC}"
    exit 0
fi

# Apply migration
echo ""
echo -e "${BLUE}Applying migration to PRODUCTION...${NC}"
echo ""

if psql "$PROD_DB_URL" -v ON_ERROR_STOP=on < "$MIGRATION_FILE" 2>&1 | tee "$ERROR_LOG"; then
    echo ""
    echo -e "${GREEN}============================================================${NC}"
    echo -e "${GREEN}✓ Migration completed successfully!${NC}"
    echo -e "${GREEN}============================================================${NC}"
    echo ""
    echo -e "  New columns and policies have been added to production."
    echo -e "  Log saved at: ${BLUE}${ERROR_LOG}${NC}"
else
    echo ""
    echo -e "${RED}============================================================${NC}"
    echo -e "${RED}✗ Migration FAILED${NC}"
    echo -e "${RED}============================================================${NC}"
    echo ""
    echo -e "  See error log: ${BLUE}${ERROR_LOG}${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Done!${NC}"
