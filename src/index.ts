export interface Env {
    VISITOR_COUNT: KVNamespace;
  }
  
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://saadimalik211.github.io",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  export default {
    async fetch(request: Request, env: Env): Promise<Response> {
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: CORS_HEADERS });
      }
  
      const current = parseInt((await env.VISITOR_COUNT.get("count")) ?? "0", 10);
  
      if (request.method === "POST") {
        const next = current + 1;
        await env.VISITOR_COUNT.put("count", next.toString());
        return Response.json({ count: next }, { headers: CORS_HEADERS });
      }
  
      // GET just reads the count without incrementing
      return Response.json({ count: current }, { headers: CORS_HEADERS });
    },
  };