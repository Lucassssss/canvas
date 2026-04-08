export interface Env {
  OPENROUTER_API_KEY: string;
}

const OPENROUTER_API = "https://openrouter.ai/api/v1";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, HTTP-Referer, X-Title",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const url = new URL(request.url);
    const targetUrl = OPENROUTER_API + url.pathname + url.search;

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${env.OPENROUTER_API_KEY}`);

    const referer = request.headers.get("HTTP-Referer") || request.headers.get("Referer");
    if (referer) {
      headers.set("HTTP-Referer", referer);
    }

    const title = request.headers.get("X-Title");
    if (title) {
    //   headers.set("X-Title", title);
      headers.set("X-Title", 'CanvasProxy');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: request.body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseHeaders = new Headers(response.headers);
      responseHeaders.set("Access-Control-Allow-Origin", "*");
      responseHeaders.set("Cache-Control", "no-cache");

      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      const errorMessage = error.name === "AbortError" 
        ? "Request timeout after 120 seconds" 
        : error.message;
      
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
