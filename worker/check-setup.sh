#!/bin/bash
set -e

echo "🔍 Visitor Analytics Setup Checker"
echo "=================================="
echo ""

# Check if wrangler.jsonc has placeholder
echo "1️⃣  Checking database_id in wrangler.jsonc..."
if grep -q "placeholder-create-db-first" wrangler.jsonc; then
    echo "❌ ISSUE FOUND: database_id is still set to placeholder!"
    echo "   Run: npx wrangler d1 list"
    echo "   Then update wrangler.jsonc with the real database ID"
    echo ""
else
    echo "✅ Database ID looks configured"
    echo ""
fi

# Check if tables exist locally
echo "2️⃣  Checking local database..."
LOCAL_TABLES=$(npx wrangler d1 execute visitor_analytics --command "SELECT name FROM sqlite_master WHERE type='table';" --json 2>/dev/null | grep -c "visitors" || echo "0")
if [ "$LOCAL_TABLES" -eq "0" ]; then
    echo "ℹ️  Local database has no tables (this is OK for production)"
    echo "   Local DB is only used for 'wrangler dev'"
    echo ""
else
    echo "✅ Local database has visitors table"
    echo ""
fi

echo "3️⃣  To check remote database, run:"
echo "   npx wrangler d1 execute visitor_analytics --remote --command \"SELECT name FROM sqlite_master WHERE type='table';\""
echo ""

echo "4️⃣  To apply migrations to remote database, run:"
echo "   npx wrangler d1 migrations apply visitor_analytics --remote"
echo ""

echo "5️⃣  After fixing config, deploy with:"
echo "   npx wrangler deploy"
echo ""

echo "📚 See SETUP_GUIDE.md for detailed instructions"
