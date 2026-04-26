// HorizonVista AI chat proxy
// Receives { message, sessionId } from frontend, proxies to n8n webhook,
// returns { reply: string }
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

// TODO: Replace with the real n8n webhook URL once available.
const N8N_WEBHOOK_URL =
  Deno.env.get("N8N_CHAT_WEBHOOK_URL") ?? "https://example.com/webhook/travel-agent";

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

    let reply = "";

    try {
      const upstream = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });

      if (upstream.ok) {
        const text = await upstream.text();
        try {
          const data = JSON.parse(text);
          reply = data.reply ?? data.output ?? data.text ?? "";
        } catch {
          reply = text;
        }
      } else {
        console.warn("n8n webhook returned", upstream.status);
      }
    } catch (err) {
      console.warn("n8n webhook unreachable:", err);
    }

    // Fallback demo response so the UI works even before the webhook is wired up.
    if (!reply) {
      reply = buildDemoReply(message);
    }

    return new Response(JSON.stringify({ reply, sessionId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("chat function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildDemoReply(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("honeymoon") || lower.includes("maldives")) {
    return "✨ Our Magical Maldives Escape (7 days, from $2800) is our top honeymoon pick — overwater villas, private dinners, and seaplane transfers included. Want me to draft a quote for two travelers?";
  }
  if (lower.includes("cappadocia")) {
    return "🎈 Cappadocia Cave & Balloon Experience (4 days) features a sunrise balloon ride, cave hotel stay, and Goreme Open-Air Museum. Best months: April–June, Sep–Oct.";
  }
  if (lower.includes("cancellation") || lower.includes("policy")) {
    return "Our standard policy: free cancellation up to 30 days before departure, 50% refund 15–29 days out, non-refundable within 14 days. Premium packages have flexible alternatives.";
  }
  if (lower.includes("price") || lower.includes("calculate") || lower.includes("travelers")) {
    return "For 4 travelers, most packages apply a 10% group discount. Tell me which package and travel month and I'll generate a detailed quote.";
  }
  if (lower.includes("airport") || lower.includes("transfer")) {
    return "Yes — private airport transfers are included on all premium packages and available as a $40/person add-on for standard packages.";
  }
  return "Thanks for your question! Once the n8n RAG backend is connected, I'll answer using HorizonVista's full knowledge base. (This is a demo response.)";
}
