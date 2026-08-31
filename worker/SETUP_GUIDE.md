# Visitor Analytics Setup Guide

## Problem Diagnosis

If your visitor count isn't loading or analytics page shows no data, follow these steps:

## Step 1: Get Your Database ID

Run this command to see your D1 databases:

```bash
cd worker
npx wrangler d1 list
```

Look for `visitor_analytics` in the output. Copy the **Database ID** (it looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

## Step 2: Update wrangler.jsonc

Open `worker/wrangler.jsonc` and replace the placeholder database ID:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "visitor_analytics",
    "database_id": "YOUR_ACTUAL_DATABASE_ID_HERE"  // <- Replace this!
  }
]
```

## Step 3: Apply Migrations to Remote Database

Run the migration on your **remote** (production) database:

```bash
cd worker
npx wrangler d1 migrations apply visitor_analytics --remote
```

You should see output confirming the `visitors` table was created.

## Step 4: Verify the Table Exists

Check that the table was created:

```bash
npx wrangler d1 execute visitor_analytics --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

You should see `visitors` in the output.

## Step 5: Deploy the Worker

Deploy your updated worker:

```bash
npx wrangler deploy
```

## Step 6: Test the Worker

### Test the visitor count endpoint:
```bash
curl https://worker.gensosekai.workers.dev
# Should return: {"count": 0} or higher
```

### Test recording a visit:
```bash
curl -X POST https://worker.gensosekai.workers.dev
# Should return: {"count": 1} or higher
```

### Test the analytics endpoint:
```bash
curl https://worker.gensosekai.workers.dev/analytics
# Should return JSON with visitors array and stats
```

## Step 7: Check for Errors

If things still aren't working, check the worker logs:

```bash
npx wrangler tail
```

Then visit your website and watch for error messages in the logs.

## Common Issues

### Issue: "table visitors has no column named..."
**Solution:** The table structure is wrong. Drop and recreate:
```bash
npx wrangler d1 execute visitor_analytics --remote --command "DROP TABLE IF EXISTS visitors;"
npx wrangler d1 migrations apply visitor_analytics --remote
```

### Issue: Visitor count shows but analytics is empty
**Solution:** The database_id might be wrong, or migrations weren't applied to the remote database. Make sure you used `--remote` flag when applying migrations.

### Issue: CORS errors in browser console
**Solution:** Add your local development URL to `ALLOWED_ORIGINS` in `worker/src/index.ts`:
```typescript
const ALLOWED_ORIGINS = new Set([
  "https://resume.gensosekai.com",
  "https://saadimalik211.github.io",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
  "http://localhost:3000", // Add your port if different
]);
```

## Troubleshooting Checklist

- [ ] Database ID in wrangler.jsonc is correct (not "placeholder-create-db-first")
- [ ] Migrations applied to remote database with `--remote` flag
- [ ] Worker deployed with `npx wrangler deploy`
- [ ] Table exists (verified with d1 execute command)
- [ ] No errors in `npx wrangler tail` logs
- [ ] Website URL is in ALLOWED_ORIGINS list
- [ ] Browser console shows no CORS errors
