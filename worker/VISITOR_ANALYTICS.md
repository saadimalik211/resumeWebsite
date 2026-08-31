# Visitor Analytics

This worker now captures detailed visitor information including location, IP address, and user agent data.

## Setup

### 1. Create D1 Database

```bash
cd worker
npx wrangler d1 create visitor_analytics
```

This will output a database ID. Update `wrangler.jsonc` with the actual database ID:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "visitor_analytics",
    "database_id": "YOUR_DATABASE_ID_HERE"
  }
]
```

### 2. Run Migrations

Apply the database schema:

```bash
npx wrangler d1 migrations apply visitor_analytics
```

For local development:

```bash
npx wrangler d1 migrations apply visitor_analytics --local
```

### 3. Deploy

```bash
npx wrangler deploy
```

## API Endpoints

### POST / - Track a Visit

Records a new visitor and increments the count.

**Request:**
```
POST https://worker.gensosekai.workers.dev
Headers:
  X-Session-ID: <unique-session-id>
```

**Response:**
```json
{
  "count": 123
}
```

**Captured Data:**
- IP address (from `CF-Connecting-IP` header)
- Country, city, region
- Timezone
- Latitude, longitude
- User agent
- Timestamp
- Session ID

### GET / - Get Count

Returns the current visitor count without recording a visit.

**Response:**
```json
{
  "count": 123
}
```

### GET /analytics - View Analytics

Retrieve detailed visitor data and statistics.

**Query Parameters:**
- `limit` (default: 100) - Number of records to return
- `offset` (default: 0) - Pagination offset

**Response:**
```json
{
  "visitors": [
    {
      "id": 1,
      "ip_address": "192.168.1.1",
      "country": "US",
      "city": "San Francisco",
      "region": "California",
      "timezone": "America/Los_Angeles",
      "latitude": "37.7749",
      "longitude": "-122.4194",
      "user_agent": "Mozilla/5.0...",
      "visited_at": 1693526400000,
      "session_id": "1693526400000-abc123"
    }
  ],
  "stats": {
    "total_visits": 123,
    "unique_visitors": 45,
    "countries": 12
  }
}
```

## Privacy Considerations

This implementation captures:
- IP addresses (can be used to identify users)
- Precise location data (city-level)

**Recommendations:**
1. Add a privacy policy to your website
2. Consider anonymizing IP addresses (e.g., remove last octet)
3. Implement data retention policies
4. Consider GDPR/CCPA compliance requirements
5. Add user opt-out mechanisms if needed

## Data Captured via Cloudflare

Cloudflare automatically provides geolocation data through the `request.cf` object:
- `country` - Two-letter country code
- `city` - City name
- `region` - State/province
- `timezone` - IANA timezone
- `latitude` / `longitude` - Approximate coordinates

No external APIs are needed; this data is available on every request.

## Local Development

For local testing with D1:

```bash
npx wrangler dev --local --persist
```

The `--persist` flag saves the local database between restarts.

## Querying Data

You can query the database directly using Wrangler:

```bash
# Remote database
npx wrangler d1 execute visitor_analytics --command "SELECT country, COUNT(*) as visits FROM visitors GROUP BY country ORDER BY visits DESC LIMIT 10"

# Local database
npx wrangler d1 execute visitor_analytics --local --command "SELECT * FROM visitors LIMIT 10"
```
