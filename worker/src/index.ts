interface Env {
	VISITOR_COUNT: KVNamespace;
	DB: D1Database;
}

interface VisitorRecord {
	ip_address: string | null;
	country: string | null;
	city: string | null;
	region: string | null;
	timezone: string | null;
	latitude: string | null;
	longitude: string | null;
	user_agent: string | null;
	visited_at: number;
	session_id: string | null;
}

const ALLOWED_ORIGINS = new Set([
	"https://resume.gensosekai.com",
	"https://saadimalik211.github.io",
	"http://localhost:4321",
	"http://127.0.0.1:4321",
]);

const COUNT_KEY = "count";

function corsHeaders(request: Request): HeadersInit {
	const origin = request.headers.get("Origin") ?? "";
	const allowOrigin = ALLOWED_ORIGINS.has(origin)
		? origin
		: "https://resume.gensosekai.com";

	return {
		"Access-Control-Allow-Origin": allowOrigin,
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type, X-Session-ID",
		Vary: "Origin",
	};
}

function json(request: Request, body: unknown, status = 200): Response {
	return Response.json(body, { status, headers: corsHeaders(request) });
}

function extractVisitorInfo(request: Request): VisitorRecord {
	const cf = request.cf as IncomingRequestCfProperties | undefined;
	const userAgent = request.headers.get("User-Agent");
	const sessionId = request.headers.get("X-Session-ID");

	return {
		ip_address: request.headers.get("CF-Connecting-IP") || null,
		country: cf?.country || null,
		city: cf?.city || null,
		region: cf?.region || null,
		timezone: cf?.timezone || null,
		latitude: cf?.latitude || null,
		longitude: cf?.longitude || null,
		user_agent: userAgent || null,
		visited_at: Date.now(),
		session_id: sessionId || null,
	};
}

async function storeVisitor(db: D1Database, visitor: VisitorRecord): Promise<void> {
	await db
		.prepare(
			`INSERT INTO visitors 
			(ip_address, country, city, region, timezone, latitude, longitude, user_agent, visited_at, session_id) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		)
		.bind(
			visitor.ip_address,
			visitor.country,
			visitor.city,
			visitor.region,
			visitor.timezone,
			visitor.latitude,
			visitor.longitude,
			visitor.user_agent,
			visitor.visited_at,
			visitor.session_id
		)
		.run();
}

export default {
	async fetch(request, env): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders(request) });
		}

		const url = new URL(request.url);

	if (url.pathname === "/analytics") {
		if (request.method !== "GET") {
			return new Response("Method Not Allowed", {
				status: 405,
				headers: {
					...corsHeaders(request),
					Allow: "GET, OPTIONS",
				},
			});
		}

		try {
			const limit = Number.parseInt(url.searchParams.get("limit") || "100", 10);
			const offset = Number.parseInt(url.searchParams.get("offset") || "0", 10);

			const { results } = await env.DB.prepare(
				`SELECT * FROM visitors ORDER BY visited_at DESC LIMIT ? OFFSET ?`
			)
				.bind(limit, offset)
				.all();

			const { results: stats } = await env.DB.prepare(
				`SELECT 
					COUNT(*) as total_visits,
					COUNT(DISTINCT ip_address) as unique_visitors,
					COUNT(DISTINCT country) as countries
				FROM visitors`
			).all();

			return json(request, {
				visitors: results,
				stats: stats?.[0] || {},
			});
		} catch (error) {
			console.error("Analytics query failed:", error);
			return json(
				request,
				{
					error: "Failed to fetch analytics data",
					message: error instanceof Error ? error.message : "Unknown error",
					visitors: [],
					stats: { total_visits: 0, unique_visitors: 0, countries: 0 },
				},
				500
			);
		}
	}

		if (request.method !== "GET" && request.method !== "POST") {
			return new Response("Method Not Allowed", {
				status: 405,
				headers: {
					...corsHeaders(request),
					Allow: "GET, POST, OPTIONS",
				},
			});
		}

		const current = Number.parseInt((await env.VISITOR_COUNT.get(COUNT_KEY)) ?? "0", 10);
		const count = Number.isFinite(current) ? current : 0;

	if (request.method === "POST") {
		const next = count + 1;
		await env.VISITOR_COUNT.put(COUNT_KEY, String(next));

		try {
			const visitorInfo = extractVisitorInfo(request);
			await storeVisitor(env.DB, visitorInfo);
		} catch (error) {
			console.error("Failed to store visitor data:", error);
		}

		return json(request, { count: next });
	}

		return json(request, { count });
	},
} satisfies ExportedHandler<Env>;
