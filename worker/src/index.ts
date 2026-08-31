interface Env {
	VISITOR_COUNT: KVNamespace;
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
		"Access-Control-Allow-Headers": "Content-Type",
		Vary: "Origin",
	};
}

function json(request: Request, body: { count: number }, status = 200): Response {
	return Response.json(body, { status, headers: corsHeaders(request) });
}

export default {
	async fetch(request, env): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response(null, { status: 204, headers: corsHeaders(request) });
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
			return json(request, { count: next });
		}

		return json(request, { count });
	},
} satisfies ExportedHandler<Env>;
