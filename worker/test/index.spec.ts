import { env, SELF } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";

describe("visitor count worker", () => {
	beforeEach(async () => {
		await env.VISITOR_COUNT.delete("count");
		await env.DB.exec("DELETE FROM visitors");
	});

	it("returns 0 when the counter has not been set", async () => {
		const response = await SELF.fetch("https://example.com");
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ count: 0 });
	});

	it("increments the count on POST", async () => {
		const first = await SELF.fetch("https://example.com", { method: "POST" });
		expect(await first.json()).toEqual({ count: 1 });

		const second = await SELF.fetch("https://example.com", { method: "POST" });
		expect(await second.json()).toEqual({ count: 2 });
	});

	it("stores visitor information on POST", async () => {
		const response = await SELF.fetch("https://example.com", {
			method: "POST",
			headers: {
				"CF-Connecting-IP": "192.168.1.1",
				"User-Agent": "Mozilla/5.0 Test Browser",
				"X-Session-ID": "test-session-123",
			},
		});
		expect(response.status).toBe(200);

		const { results } = await env.DB.prepare("SELECT * FROM visitors").all();
		expect(results).toHaveLength(1);
		expect(results[0]).toMatchObject({
			ip_address: "192.168.1.1",
			user_agent: "Mozilla/5.0 Test Browser",
			session_id: "test-session-123",
		});
	});

	it("reads without incrementing on GET", async () => {
		await env.VISITOR_COUNT.put("count", "9");
		const response = await SELF.fetch("https://example.com");
		expect(await response.json()).toEqual({ count: 9 });
		expect(await env.VISITOR_COUNT.get("count")).toBe("9");
	});

	it("responds to CORS preflight", async () => {
		const response = await SELF.fetch("https://example.com", {
			method: "OPTIONS",
			headers: { Origin: "https://resume.gensosekai.com" },
		});
		expect(response.status).toBe(204);
		expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
			"https://resume.gensosekai.com",
		);
	});

	it("returns analytics data", async () => {
		await SELF.fetch("https://example.com", { method: "POST" });
		await SELF.fetch("https://example.com", { method: "POST" });

		const response = await SELF.fetch("https://example.com/analytics");
		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data).toHaveProperty("visitors");
		expect(data).toHaveProperty("stats");
		expect(data.visitors).toHaveLength(2);
		expect(data.stats).toMatchObject({
			total_visits: 2,
		});
	});

	it("supports pagination in analytics", async () => {
		for (let i = 0; i < 5; i++) {
			await SELF.fetch("https://example.com", { method: "POST" });
		}

		const response = await SELF.fetch("https://example.com/analytics?limit=2&offset=1");
		expect(response.status).toBe(200);

		const data = await response.json();
		expect(data.visitors).toHaveLength(2);
	});
});
