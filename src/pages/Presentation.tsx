import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BrainCircuit,
  ChartNoAxesCombined,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Globe2,
  Home,
  Layers3,
  MessageCircle,
  MonitorPlay,
  Network,
  PanelTop,
  Route,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Visual = {
  src: string;
  alt: string;
  caption?: string;
  emphasis?: boolean;
};

type Metric = {
  label: string;
  value: string;
  note: string;
};

type Slide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  theme: "teal" | "coral" | "gold" | "green" | "blue";
  bullets?: string[];
  metrics?: Metric[];
  visuals?: Visual[];
  layout?: "hero" | "gallery" | "split" | "flow" | "metrics";
};

const asset = (name: string) => `/presentation-assets/${name}`;

const slides: Slide[] = [
  {
    eyebrow: "HorizonVista project showcase",
    title: "Vista: AI travel consultant, website, and n8n automation platform",
    subtitle:
      "A visual walkthrough of the customer-facing website, Telegram assistant, Qdrant retrieval layer, MongoDB records, Google Sheets pricing, and n8n workflows.",
    icon: Sparkles,
    theme: "teal",
    layout: "hero",
    metrics: [
      { label: "Channels", value: "2 live", note: "Website chat and Telegram" },
      { label: "Languages", value: "3", note: "English, Arabic, Turkish" },
      { label: "Workflows", value: "3", note: "Ingestion, Agent API, Telegram" },
    ],
    visuals: [
      { src: asset("website-landing-page.png"), alt: "HorizonVista website landing page", caption: "Website" },
      { src: asset("telegram-chat.png"), alt: "Telegram conversation with Vista", caption: "Telegram" },
      { src: asset("n8n-orchestrator.png"), alt: "n8n Orchestrator workflow screenshot", caption: "n8n" },
    ],
  },
  {
    eyebrow: "Business value",
    title: "The business problem is not only answering questions. It is capturing demand.",
    subtitle:
      "Tourism leads arrive after hours, across languages, and through chat channels. Vista turns those conversations into prices, leads, tickets, and measurable service quality.",
    icon: ChartNoAxesCombined,
    theme: "coral",
    layout: "metrics",
    bullets: [
      "Instant response reduces lost sales from delayed follow-up.",
      "Live pricing prevents stale package and transfer quotes.",
      "Structured MongoDB leads and tickets make follow-up easier for the team.",
      "Automated evaluation gives management visibility into service quality.",
    ],
    metrics: [
      { label: "Response time", value: "Seconds", note: "Instead of hours" },
      { label: "Coverage", value: "24/7", note: "After-hours inquiries" },
      { label: "Cost", value: "~$0.02", note: "Estimated API cost per interaction" },
    ],
  },
  {
    eyebrow: "Website built",
    title: "We built a full HorizonVista website, not only the AI backend.",
    subtitle:
      "The site presents the travel brand, package catalog, chat assistant, services, booking form, analytics, and contact flow.",
    icon: Globe2,
    theme: "blue",
    layout: "gallery",
    bullets: [
      "Landing page establishes HorizonVista as a premium travel agency.",
      "Chat UI connects website visitors to the same Agent API.",
      "Booking form captures structured lead information from the website.",
    ],
    visuals: [
      { src: asset("website-landing-page.png"), alt: "HorizonVista website landing page", caption: "Landing page", emphasis: true },
      { src: asset("website-chat-ui.png"), alt: "HorizonVista website chat assistant UI", caption: "Chat UI" },
      { src: asset("website-book-form.png"), alt: "HorizonVista website booking form", caption: "Booking form" },
    ],
  },
  {
    eyebrow: "CRISP-DM phase 1",
    title: "Business understanding guided the whole build.",
    subtitle:
      "The system was designed around real tourism operations: customer support, package discovery, live pricing, lead capture, complaints, and multilingual availability.",
    icon: Route,
    theme: "green",
    layout: "split",
    bullets: [
      "Goal: operate as a 24/7 AI travel consultant across customer channels.",
      "Success: answer product and policy questions correctly through RAG.",
      "Success: retrieve live prices rather than hardcoding package costs.",
      "Success: turn bookings and complaints into operational records.",
    ],
    visuals: [
      { src: asset("telegram-chat.png"), alt: "Telegram chat conversation in Arabic", caption: "Real customer-style conversation" },
      { src: asset("website-chat-ui.png"), alt: "Website chat assistant", caption: "Website channel" },
    ],
  },
  {
    eyebrow: "CRISP-DM phase 2",
    title: "Data understanding separated static knowledge from live business data.",
    subtitle:
      "Packages, FAQs, policies, destinations, company data, and services feed retrieval. Prices, route fees, and evaluation logs stay in Google Sheets.",
    icon: Database,
    theme: "gold",
    layout: "gallery",
    bullets: [
      "MongoDB stores the knowledge base, memory, leads, and support tickets.",
      "Google Sheets stores package prices, transfer fees, hotel fees, and evaluation logs.",
      "Qdrant stores embedded knowledge for multilingual semantic retrieval.",
    ],
    visuals: [
      { src: asset("mongo-collections.png"), alt: "MongoDB collections screenshot", caption: "MongoDB collections" },
      { src: asset("gsheets-sheets.png"), alt: "Google Sheets pricing tabs screenshot", caption: "Google Sheets pricing" },
      { src: asset("qdrant-sample.png"), alt: "Qdrant vector sample screenshot", caption: "Qdrant payload" },
    ],
  },
  {
    eyebrow: "CRISP-DM phase 3",
    title: "Data preparation happens through the n8n ingestion workflow.",
    subtitle:
      "The ingestion flow reads MongoDB collections, flattens JSON into readable text, extracts metadata, embeds it with a multilingual model, and stores vectors in Qdrant.",
    icon: Workflow,
    theme: "teal",
    layout: "flow",
    bullets: [
      "MongoDB raw JSON becomes human-readable text for better retrieval.",
      "Metadata is preserved as Qdrant payload for context and filtering.",
      "Pricing is intentionally excluded from embeddings to keep it fresh.",
    ],
    visuals: [
      { src: asset("qdrant-graph.png"), alt: "Qdrant graph view screenshot", caption: "Qdrant graph" },
      { src: asset("qdrant-sample.png"), alt: "Qdrant sample document screenshot", caption: "Embedded document sample" },
    ],
  },
  {
    eyebrow: "CRISP-DM phase 4",
    title: "Modeling uses a multi-agent RAG architecture.",
    subtitle:
      "Vista is the customer-facing Orchestrator. Specialist agents handle pricing and booking so business logic stays clean and auditable.",
    icon: BrainCircuit,
    theme: "blue",
    layout: "gallery",
    bullets: [
      "Orchestrator routes user intent and synthesizes the final customer response.",
      "Knowledge search uses Qdrant with multilingual embeddings.",
      "Tools include web search, weather, pricing, booking, memory, and evaluation.",
    ],
    visuals: [
      { src: asset("n8n-orchestrator.png"), alt: "n8n Orchestrator agent screenshot", caption: "Vista Orchestrator", emphasis: true },
      { src: asset("n8n-tools.png"), alt: "n8n tools attached to agent", caption: "Agent tools" },
    ],
  },
  {
    eyebrow: "n8n Telegram workflow",
    title: "Telegram supports both text and voice messages.",
    subtitle:
      "The Telegram workflow detects message type, transcribes voice notes with Whisper through Groq, calls the Agent API, formats the response, and replies in Telegram.",
    icon: MessageCircle,
    theme: "green",
    layout: "split",
    bullets: [
      "Text messages go directly to the Agent API.",
      "Voice notes are downloaded, normalized, and transcribed before routing.",
      "Responses are formatted for Telegram MarkdownV2 before sending.",
    ],
    visuals: [
      { src: asset("telegram-chat.png"), alt: "Telegram conversation screenshot", caption: "Telegram channel", emphasis: true },
      { src: asset("n8n-tools.png"), alt: "n8n tools workflow screenshot", caption: "Shared agent tools" },
    ],
  },
  {
    eyebrow: "Live pricing and operations",
    title: "Business users can update prices without touching the AI system.",
    subtitle:
      "The Price Agent fetches package prices, transfer fees, hotel service fees, and currency rates only when the customer asks.",
    icon: FileSpreadsheet,
    theme: "gold",
    layout: "gallery",
    bullets: [
      "Google Sheets acts as the live pricing control panel.",
      "The Price Agent applies group discounts, child discounts, supplements, and conversions.",
      "MongoDB stores leads and tickets created by the Booking Agent.",
    ],
    visuals: [
      { src: asset("gsheets-sheets.png"), alt: "Google Sheets pricing workbook screenshot", caption: "Pricing workbook", emphasis: true },
      { src: asset("mongo-sample.png"), alt: "MongoDB sample record screenshot", caption: "Lead or ticket record" },
      { src: asset("mongo-collections.png"), alt: "MongoDB collections screenshot", caption: "Operational collections" },
    ],
  },
  {
    eyebrow: "Memory and quality loop",
    title: "The system remembers conversations and evaluates responses.",
    subtitle:
      "MongoDB memory keeps context across sessions, while an LLM-as-Judge branch scores relevance, correctness, tone, and completeness after each response.",
    icon: Bot,
    theme: "coral",
    layout: "gallery",
    bullets: [
      "Memory is summarized after longer conversations to reduce context size.",
      "Evaluation scores are parsed as JSON and logged to Google Sheets.",
      "Flagged responses reveal improvement opportunities in the service data.",
    ],
    visuals: [
      { src: asset("n8n-memory-summarizing.png"), alt: "n8n memory summarizing workflow screenshot", caption: "Memory summarization" },
      { src: asset("n8n-evaluation.png"), alt: "n8n evaluation workflow screenshot", caption: "LLM-as-Judge" },
      { src: asset("gsheets-evaluation-sheet.png"), alt: "Google Sheets evaluation log screenshot", caption: "Evaluation sheet" },
    ],
  },
  {
    eyebrow: "CRISP-DM phase 6",
    title: "Deployment connects website, Telegram, n8n, MongoDB, Qdrant, and Sheets.",
    subtitle:
      "The architecture is reusable: every customer channel can call the same Agent API and receive the same business-aware intelligence.",
    icon: Network,
    theme: "teal",
    layout: "flow",
    bullets: [
      "Website chat and Telegram call the Agent API webhook.",
      "n8n coordinates the Orchestrator, tools, sub-agents, memory, and evaluation.",
      "MongoDB, Qdrant, and Google Sheets separate operational data by purpose.",
    ],
    visuals: [
      { src: asset("website-chat-ui.png"), alt: "Website chat UI screenshot", caption: "Website chat" },
      { src: asset("n8n-orchestrator.png"), alt: "n8n Orchestrator workflow", caption: "Agent API" },
      { src: asset("qdrant-graph.png"), alt: "Qdrant graph screenshot", caption: "Vector retrieval" },
    ],
  },
  {
    eyebrow: "Evaluation results",
    title: "The project is measurable, not just demonstrable.",
    subtitle:
      "Functional tests covered recommendations, pricing, policies, visa questions, booking, complaints, language switching, and Telegram voice support.",
    icon: CheckCircle2,
    theme: "green",
    layout: "metrics",
    bullets: [
      "Overall LLM-as-Judge average: 4.3 out of 5.",
      "Flagged responses: 2 out of 28, mainly transfer-pricing coverage gaps.",
      "Memory summarization reduced context size by about 81 percent.",
    ],
    metrics: [
      { label: "Overall score", value: "4.3/5", note: "Quality rubric average" },
      { label: "Pass coverage", value: "93%", note: "Functional scenario pass rate" },
      { label: "Context saved", value: "81%", note: "Memory summarization reduction" },
    ],
    visuals: [
      { src: asset("gsheets-evaluation-sheet.png"), alt: "Evaluation sheet screenshot", caption: "Logged evaluations" },
      { src: asset("n8n-evaluation.png"), alt: "Evaluation workflow screenshot", caption: "Evaluation branch" },
    ],
  },
  {
    eyebrow: "Final story",
    title: "HorizonVista is a working AI business system.",
    subtitle:
      "The project combines a customer-facing website, Telegram assistant, n8n automation, RAG retrieval, live pricing, operational records, memory, and evaluation into one coherent travel-consultant platform.",
    icon: MonitorPlay,
    theme: "blue",
    layout: "hero",
    bullets: [
      "Built website and chat experience.",
      "Built n8n workflows for ingestion, Agent API, and Telegram.",
      "Built RAG knowledge retrieval with Qdrant.",
      "Built operational capture through MongoDB and Google Sheets.",
    ],
    visuals: [
      { src: asset("website-landing-page.png"), alt: "Website landing page screenshot", caption: "Website" },
      { src: asset("n8n-orchestrator.png"), alt: "n8n Orchestrator screenshot", caption: "Automation" },
      { src: asset("qdrant-graph.png"), alt: "Qdrant graph screenshot", caption: "Retrieval" },
    ],
  },
];

const themeClasses = {
  teal: {
    bg: "from-cyan-50 via-white to-emerald-50",
    accent: "bg-cyan-600",
    text: "text-cyan-700",
    border: "border-cyan-200",
    soft: "bg-cyan-50",
  },
  coral: {
    bg: "from-rose-50 via-white to-amber-50",
    accent: "bg-rose-500",
    text: "text-rose-700",
    border: "border-rose-200",
    soft: "bg-rose-50",
  },
  gold: {
    bg: "from-amber-50 via-white to-sky-50",
    accent: "bg-amber-500",
    text: "text-amber-700",
    border: "border-amber-200",
    soft: "bg-amber-50",
  },
  green: {
    bg: "from-emerald-50 via-white to-cyan-50",
    accent: "bg-emerald-600",
    text: "text-emerald-700",
    border: "border-emerald-200",
    soft: "bg-emerald-50",
  },
  blue: {
    bg: "from-sky-50 via-white to-indigo-50",
    accent: "bg-sky-600",
    text: "text-sky-700",
    border: "border-sky-200",
    soft: "bg-sky-50",
  },
};

const processSteps = [
  { label: "Customer channel", detail: "Website or Telegram", icon: PanelTop },
  { label: "Agent API", detail: "n8n webhook", icon: Workflow },
  { label: "Orchestrator", detail: "Vista agent", icon: BrainCircuit },
  { label: "Business tools", detail: "RAG, price, booking", icon: Layers3 },
  { label: "Operations", detail: "Memory and evaluation", icon: Database },
];

const VisualFrame = ({ visual, tall = false }: { visual: Visual; tall?: boolean }) => (
  <figure
    className={cn(
      "group overflow-hidden rounded-lg border bg-white shadow-elegant",
      visual.emphasis ? "border-primary/30" : "border-border",
    )}
  >
    <div className={cn("bg-slate-950/5", tall ? "h-[52vh]" : "h-[34vh]")}>
      <img src={visual.src} alt={visual.alt} className="h-full w-full object-contain" />
    </div>
    {visual.caption && (
      <figcaption className="flex items-center justify-between border-t border-border px-4 py-3 text-sm font-semibold text-muted-foreground">
        <span>{visual.caption}</span>
        <span className="h-2 w-2 rounded-full bg-primary" />
      </figcaption>
    )}
  </figure>
);

const MetricCard = ({ metric, theme }: { metric: Metric; theme: Slide["theme"] }) => {
  const classes = themeClasses[theme];

  return (
    <div className={cn("rounded-lg border bg-white/90 p-5 shadow-card", classes.border)}>
      <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{metric.label}</p>
      <p className={cn("mt-2 text-4xl font-black tracking-tight", classes.text)}>{metric.value}</p>
      <p className="mt-2 text-base text-muted-foreground">{metric.note}</p>
    </div>
  );
};

const BulletList = ({ bullets, theme }: { bullets?: string[]; theme: Slide["theme"] }) => {
  if (!bullets?.length) return null;
  const classes = themeClasses[theme];

  return (
    <div className="space-y-3">
      {bullets.map((bullet) => (
        <div key={bullet} className="flex gap-3 rounded-lg border border-border bg-white/85 p-4 shadow-soft">
          <span className={cn("mt-1 h-3 w-3 shrink-0 rounded-full", classes.accent)} />
          <p className="text-lg leading-snug text-slate-700">{bullet}</p>
        </div>
      ))}
    </div>
  );
};

const FlowDiagram = ({ theme }: { theme: Slide["theme"] }) => {
  const classes = themeClasses[theme];

  return (
    <div className="rounded-lg border border-border bg-white/90 p-5 shadow-elegant">
      <div className="grid gap-3 md:grid-cols-5">
        {processSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative">
              <div className={cn("h-full rounded-lg border p-4", classes.border, classes.soft)}>
                <Icon className={cn("mb-4 h-8 w-8", classes.text)} />
                <p className="text-base font-black text-slate-900">{step.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
              </div>
              {index < processSteps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-border bg-white text-muted-foreground md:grid">
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SlideBody = ({ slide }: { slide: Slide }) => {
  const visuals = slide.visuals ?? [];

  if (slide.layout === "gallery") {
    return (
      <div className="grid min-h-0 gap-5 xl:grid-cols-[0.75fr_1.25fr]">
        <BulletList bullets={slide.bullets} theme={slide.theme} />
        <div className={cn("grid gap-4", visuals.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
          {visuals.map((visual) => (
            <VisualFrame key={visual.src} visual={visual} tall={visual.emphasis} />
          ))}
        </div>
      </div>
    );
  }

  if (slide.layout === "split") {
    return (
      <div className="grid min-h-0 gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <BulletList bullets={slide.bullets} theme={slide.theme} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {visuals.map((visual) => (
            <VisualFrame key={visual.src} visual={visual} tall={visual.emphasis} />
          ))}
        </div>
      </div>
    );
  }

  if (slide.layout === "flow") {
    return (
      <div className="grid min-h-0 gap-5">
        <FlowDiagram theme={slide.theme} />
        <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          <BulletList bullets={slide.bullets} theme={slide.theme} />
          <div className={cn("grid gap-4", visuals.length > 2 ? "lg:grid-cols-3" : "lg:grid-cols-2")}>
            {visuals.map((visual) => (
              <VisualFrame key={visual.src} visual={visual} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (slide.layout === "metrics") {
    return (
      <div className="grid min-h-0 gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {slide.metrics?.map((metric) => (
            <MetricCard key={metric.label} metric={metric} theme={slide.theme} />
          ))}
        </div>
        <div className="space-y-4">
          <BulletList bullets={slide.bullets} theme={slide.theme} />
          {visuals.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {visuals.map((visual) => (
                <VisualFrame key={visual.src} visual={visual} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="space-y-5">
        {slide.metrics && (
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {slide.metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} theme={slide.theme} />
            ))}
          </div>
        )}
        <BulletList bullets={slide.bullets} theme={slide.theme} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {visuals.map((visual) => (
          <VisualFrame key={visual.src} visual={visual} tall={visual.emphasis} />
        ))}
      </div>
    </div>
  );
};

const Presentation = () => {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const classes = themeClasses[slide.theme];
  const progress = useMemo(() => ((index + 1) / slides.length) * 100, [index]);
  const Icon = slide.icon;

  const goNext = () => setIndex((current) => Math.min(current + 1, slides.length - 1));
  const goPrevious = () => setIndex((current) => Math.max(current - 1, 0));
  const goTo = (target: number) => setIndex(target);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goPrevious();
      }

      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        goTo(slides.length - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className={cn("min-h-screen overflow-hidden bg-gradient-to-br text-foreground", classes.bg)}>
      <div className="flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-lg border border-white/70 bg-white/80 px-4 py-3 shadow-soft backdrop-blur md:px-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-primary">
            <Home className="h-4 w-4" />
            HorizonVista
          </Link>
          <div className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground md:flex">
            <MonitorPlay className="h-4 w-4" />
            Live presentation route: /presentation
          </div>
          <div className="text-sm font-bold text-muted-foreground">
            {index + 1} / {slides.length}
          </div>
        </header>

        <section className="grid flex-1 grid-rows-[auto_1fr] gap-5 py-5">
          <div className="rounded-lg border border-white/70 bg-white/75 p-5 shadow-card backdrop-blur md:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className={cn("grid h-12 w-12 place-items-center rounded-lg text-white shadow-card", classes.accent)}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className={cn("text-sm font-black uppercase tracking-wide", classes.text)}>{slide.eyebrow}</p>
                <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
                  <div className={cn("h-full rounded-full", classes.accent)} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
            <h1 className="max-w-6xl text-balance text-3xl font-black leading-[1.02] text-slate-950 md:text-5xl xl:text-6xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-5xl text-lg leading-relaxed text-slate-600 md:text-xl">{slide.subtitle}</p>
          </div>

          <div className="min-h-0">
            <SlideBody slide={slide} />
          </div>
        </section>

        <footer className="flex items-center justify-between gap-3 rounded-lg border border-white/70 bg-white/85 px-3 py-3 shadow-soft backdrop-blur">
          <Button variant="outline" size="icon" onClick={goPrevious} disabled={index === 0} aria-label="Previous slide">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex max-w-[72vw] flex-wrap items-center justify-center gap-2">
            {slides.map((item, itemIndex) => {
              const ItemIcon = item.icon;
              const isActive = itemIndex === index;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => goTo(itemIndex)}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border transition-smooth",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-card"
                      : "border-border bg-white text-muted-foreground hover:border-primary/50 hover:text-primary",
                  )}
                  aria-label={`Go to slide ${itemIndex + 1}`}
                >
                  <ItemIcon className="h-4 w-4" />
                </button>
              );
            })}
          </div>

          <Button variant="hero" size="icon" onClick={goNext} disabled={index === slides.length - 1} aria-label="Next slide">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </footer>
      </div>
    </main>
  );
};

export default Presentation;
