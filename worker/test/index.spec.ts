import { env, SELF } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";

describe("visitor count worker", () => {
	beforeEach(async () => {
		await env.VISITOR_COUNT.delete("count");
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
});
