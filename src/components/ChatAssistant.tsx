import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const EXAMPLE_PROMPTS = [
  "Recommend a honeymoon package",
  "Tell me about Cappadocia packages",
  "What is your cancellation policy?",
  "Calculate the price for 4 travelers",
  "Do you offer airport transfers?",
];

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your HorizonVista travel consultant 🌍 Ask me about packages, prices, policies, or destinations — or pick a prompt below to get started.",
};

function getSessionId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let id = window.localStorage.getItem("hv_session_id");
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem("hv_session_id", id);
  }
  return id;
}

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Listen for "Ask AI" messages from package cards
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (typeof detail === "string" && detail.trim()) {
        sendMessage(detail);
      }
    };
    window.addEventListener("hv:ask-ai", handler as EventListener);
    return () => window.removeEventListener("hv:ask-ai", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: { message, sessionId: getSessionId() },
      });
      if (error) throw error;
      const reply =
        (data as { reply?: string } | null)?.reply ??
        "Sorry, I couldn't reach the travel agent right now.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Connection issue — please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="chat" className="relative py-20 md:py-28">
      <div className="absolute inset-0 gradient-mesh opacity-60 pointer-events-none" />
      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" /> AI Travel Assistant
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Chat with your <span className="text-gradient">virtual consultant</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Powered by a RAG backend with deep knowledge of HorizonVista's packages, policies, and destinations.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-3xl bg-card shadow-elegant border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border/60 bg-card">
            <div className="relative">
              <div className="h-10 w-10 rounded-full gradient-turquoise flex items-center justify-center text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
            </div>
            <div>
              <p className="font-semibold text-sm">HorizonVista Agent</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Online — usually replies instantly
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="h-[420px] overflow-y-auto px-4 md:px-6 py-6 gradient-soft">
            <div className="space-y-4">
              {messages.map((m, i) => (
                <MessageBubble key={i} msg={m} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm pl-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              )}
            </div>
          </div>

          {/* Example prompts */}
          <div className="px-4 md:px-6 py-3 border-t border-border/60 bg-card flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((p) => (
              <Button
                key={p}
                variant="chip"
                size="sm"
                onClick={() => sendMessage(p)}
                disabled={loading}
              >
                {p}
              </Button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 p-4 border-t border-border/60 bg-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your next trip…"
              disabled={loading}
              maxLength={2000}
              className="flex-1 h-12 px-5 rounded-full bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth"
            />
            <Button type="submit" variant="hero" size="icon" className="h-12 w-12" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

const MessageBubble = ({ msg }: { msg: ChatMessage }) => {
  const isUser = msg.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-soft animate-fade-in-up",
          isUser
            ? "gradient-blue text-primary-foreground rounded-br-sm"
            : "bg-card text-card-foreground border border-border/60 rounded-bl-sm"
        )}
      >
        {msg.content}
      </div>
    </div>
  );
};
