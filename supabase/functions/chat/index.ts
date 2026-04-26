// HorizonVista AI chat proxy
// Receives { message, sessionId } from frontend, proxies to the n8n webhook,
// and returns the AI answer.
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const N8N_WEBHOOK_URL =
  "https://n8n.hamzasallam.online/webhook/horizonvista/api/send-message";

const N8N_AUTH_HEADER =
  "Basic YWNjZXNzX3Rva2VuOmNtcGU0MTJob3Jpem9uVmlzdGE=";

interface ChatRequestBody {
  message?: unknown;
  sessionId?: unknown;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as ChatRequestBody;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const sessionId =
      typeof body.sessionId === "string" && body.sessionId.length > 0
        ? body.sessionId
        : crypto.randomUUID();

    if (!message || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "message must be a non-empty string (max 2000 chars)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const upstream = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        Authorization: N8N_AUTH_HEADER,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sessionId }),
    });

    const rawText = await upstream.text();

    if (!upstream.ok) {
      console.error("n8n webhook failed", upstream.status, rawText);
      return new Response(
        JSON.stringify({
          error: `n8n webhook returned ${upstream.status}`,
          details: rawText.slice(0, 500),
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // n8n typically returns JSON; fall back to raw text if not.
    let parsed: Record<string, unknown> | null = null;
    try {
      parsed = rawText ? (JSON.parse(rawText) as Record<string, unknown>) : null;
    } catch {
      parsed = null;
    }

    const pickString = (v: unknown): string | null =>
      typeof v === "string" && v.trim().length > 0 ? v : null;

    const output =
      pickString(parsed?.output) ??
      pickString(parsed?.reply) ??
      pickString(parsed?.answer) ??
      pickString(parsed?.response) ??
      pickString(parsed?.message) ??
      pickString(rawText) ??
      "No response received.";

    return new Response(JSON.stringify({ output, sessionId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chat function error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
