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
  Search,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase =
  | "Overview"
  | "Business Understanding"
  | "Data Understanding"
  | "Data Preparation"
  | "Modeling"
  | "Evaluation"
  | "Deployment";

type Visual = {
  src: string;
  alt: string;
  caption: string;
};

type Metric = {
  label: string;
  value: string;
  note: string;
};

type Slide = {
  phase: Phase;
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  theme: "teal" | "coral" | "gold" | "green" | "blue";
  layout: "cover" | "business" | "imageOnly" | "dualImage" | "evidenceGrid" | "architecture" | "metrics";
  bullets?: string[];
  metrics?: Metric[];
  visuals?: Visual[];
};

const asset = (name: string) => `/presentation-assets/${name}`;

const crispPhases: Phase[] = [
  "Business Understanding",
  "Data Understanding",
  "Data Preparation",
  "Modeling",
  "Evaluation",
  "Deployment",
];

const slides: Slide[] = [
  {
    phase: "Overview",
    eyebrow: "CRISP-DM project story",
    title: "HorizonVista: from travel inquiries to measurable AI operations",
    subtitle:
      "A business-focused walkthrough of the website, Telegram channel, n8n workflows, Qdrant retrieval, MongoDB records, Google Sheets pricing, and evaluation loop.",
    icon: Sparkles,
    theme: "teal",
    layout: "cover",
    metrics: [
      { label: "Customer channels", value: "Website + Telegram", note: "One reusable Agent API" },
      { label: "Business coverage", value: "24/7", note: "Planning, pricing, booking, complaints" },
      { label: "Methodology", value: "CRISP-DM", note: "Business-first AI project flow" },
    ],
    visuals: [{ src: asset("website-landing-page.png"), alt: "HorizonVista website landing page", caption: "The website is part of the delivered system" }],
  },
  {
    phase: "Business Understanding",
    eyebrow: "Phase 1 - Business Understanding",
    title: "The business problem is lost demand, not just slow chat replies.",
    subtitle:
      "Tourism customers ask high-intent questions after hours, across languages, and across channels. The project goal was to convert these conversations into revenue and service records.",
    icon: ChartNoAxesCombined,
    theme: "coral",
    layout: "business",
    bullets: [
      "Reduce missed bookings caused by delayed human follow-up.",
      "Support English, Arabic, and Turkish customers from one assistant.",
      "Retrieve live prices instead of giving stale or guessed numbers.",
      "Capture booking leads and complaints in structured operational systems.",
    ],
    metrics: [
      { label: "Response time", value: "Seconds", note: "Instead of hours" },
      { label: "Operating window", value: "24/7", note: "After-hours coverage" },
      { label: "Service scope", value: "Full journey", note: "Planning to support ticket" },
    ],
  },
  {
    phase: "Business Understanding",
    eyebrow: "Phase 1 evidence - Website",
    title: "We built the customer-facing website as the business entry point.",
    subtitle:
      "The site makes HorizonVista look like a real travel company: brand landing page, packages, services, booking form, analytics, contact, and embedded AI chat.",
    icon: Globe2,
    theme: "blue",
    layout: "imageOnly",
    bullets: [
      "Business value: the AI assistant is connected to a real customer-facing sales surface.",
      "The website gives users a place to browse, ask, and convert into leads.",
    ],
    visuals: [{ src: asset("website-landing-page.png"), alt: "HorizonVista website landing page", caption: "Website landing page and travel brand experience" }],
  },
  {
    phase: "Business Understanding",
    eyebrow: "Phase 1 evidence - Customer channel",
    title: "Telegram extends the sales desk into the customer's preferred channel.",
    subtitle:
      "The assistant supports chat-style conversations, multilingual answers, and Telegram voice/text handling through the same backend intelligence.",
    icon: MessageCircle,
    theme: "green",
    layout: "imageOnly",
    bullets: [
      "Business value: HorizonVista can respond where customers already communicate.",
      "The Arabic conversation demonstrates multilingual consultation, not only English chatbot behavior.",
    ],
    visuals: [{ src: asset("telegram-chat.png"), alt: "Telegram conversation with Vista", caption: "Telegram customer conversation" }],
  },
  {
    phase: "Data Understanding",
    eyebrow: "Phase 2 - Data Understanding",
    title: "The data was organized by business purpose.",
    subtitle:
      "CRISP-DM required knowing which data should be static knowledge, which should stay live, and which should become operational records.",
    icon: Database,
    theme: "gold",
    layout: "evidenceGrid",
    bullets: [
      "Knowledge base: packages, FAQs, policies, destinations, company profile, services.",
      "Live business data: prices, routes, service fees, and evaluation logs in Google Sheets.",
      "Operational data: memory, leads, tickets, and knowledge records in MongoDB.",
      "Retrieval data: embedded document payloads in Qdrant.",
    ],
    visuals: [
      { src: asset("mongo-collections.png"), alt: "MongoDB collections screenshot", caption: "MongoDB collections" },
      { src: asset("gsheets-sheets.png"), alt: "Google Sheets pricing workbook screenshot", caption: "Google Sheets pricing workbook" },
      { src: asset("qdrant-sample.png"), alt: "Qdrant sample payload screenshot", caption: "Qdrant document payload" },
    ],
  },
  {
    phase: "Data Understanding",
    eyebrow: "Phase 2 evidence - Live pricing",
    title: "Pricing data stays live because prices are a business control, not model memory.",
    subtitle:
      "Google Sheets lets non-technical staff update package prices, transfer routes, hotel service fees, and evaluation logs without re-ingesting the knowledge base.",
    icon: FileSpreadsheet,
    theme: "gold",
    layout: "imageOnly",
    bullets: [
      "Business value: price changes do not require developer involvement.",
      "Risk reduction: the assistant avoids stale embedded prices.",
    ],
    visuals: [{ src: asset("gsheets-sheets.png"), alt: "Google Sheets tabs for HorizonVista pricing", caption: "Google Sheets price and fee control layer" }],
  },
  {
    phase: "Data Understanding",
    eyebrow: "Phase 2 evidence - Operational records",
    title: "MongoDB is the operational memory of the business process.",
    subtitle:
      "The same database family supports knowledge, conversation memory, booking leads, complaint tickets, and business records.",
    icon: Database,
    theme: "blue",
    layout: "dualImage",
    bullets: [
      "Business value: sales and support outcomes become structured records.",
      "Management can inspect collections instead of relying on scattered chat history.",
    ],
    visuals: [
      { src: asset("mongo-collections.png"), alt: "MongoDB collections screenshot", caption: "Collections for knowledge and operations" },
      { src: asset("mongo-sample.png"), alt: "MongoDB sample document screenshot", caption: "Example stored business record" },
    ],
  },
  {
    phase: "Data Preparation",
    eyebrow: "Phase 3 - Data Preparation",
    title: "n8n prepares the knowledge base for multilingual retrieval.",
    subtitle:
      "Raw MongoDB JSON is transformed into readable text, paired with metadata, embedded using a multilingual model, and stored in Qdrant for semantic search.",
    icon: Workflow,
    theme: "teal",
    layout: "architecture",
    bullets: [
      "Flattening JSON improves retrieval because the model sees readable business content.",
      "Metadata preserves source, category, IDs, and package references.",
      "Prices are excluded from embeddings and fetched live at query time.",
    ],
    visuals: [
      { src: asset("qdrant-graph.png"), alt: "Qdrant graph screenshot", caption: "Vector store after ingestion" },
      { src: asset("qdrant-sample.png"), alt: "Qdrant payload screenshot", caption: "Prepared document payload" },
    ],
  },
  {
    phase: "Data Preparation",
    eyebrow: "Phase 3 evidence - Qdrant",
    title: "Qdrant stores the prepared knowledge as searchable vectors.",
    subtitle:
      "This is the retrieval layer that allows Vista to answer package, policy, destination, and service questions from HorizonVista's own knowledge.",
    icon: Search,
    theme: "teal",
    layout: "imageOnly",
    bullets: [
      "Business value: answers are grounded in company knowledge instead of generic model guesses.",
      "Multilingual embeddings support Arabic, Turkish, and English retrieval through one store.",
    ],
    visuals: [{ src: asset("qdrant-graph.png"), alt: "Qdrant vector graph screenshot", caption: "Qdrant tourism_vdb vector collection" }],
  },
  {
    phase: "Modeling",
    eyebrow: "Phase 4 - Modeling",
    title: "The model is a multi-agent business workflow, not a single prompt.",
    subtitle:
      "Vista is the customer-facing Orchestrator. It decides when to retrieve knowledge, search the web, check weather, calculate prices, create leads, create tickets, and respond.",
    icon: BrainCircuit,
    theme: "blue",
    layout: "imageOnly",
    bullets: [
      "Business value: the customer gets one consultant, while the backend separates specialist responsibilities.",
      "The Orchestrator keeps the final answer natural and channel-appropriate.",
    ],
    visuals: [{ src: asset("n8n-orchestrator.png"), alt: "n8n Orchestrator workflow screenshot", caption: "Vista Orchestrator inside n8n Agent API workflow" }],
  },
  {
    phase: "Modeling",
    eyebrow: "Phase 4 evidence - Tool layer",
    title: "The tool layer turns conversation into business action.",
    subtitle:
      "The agent can use Qdrant, Tavily, OpenWeatherMap, Google Sheets, currency conversion, calculator, MongoDB, email, and memory tools.",
    icon: Layers3,
    theme: "blue",
    layout: "imageOnly",
    bullets: [
      "Business value: pricing, lead capture, and support ticketing are executable workflows.",
      "Tool separation makes the system easier to audit than one large all-purpose prompt.",
    ],
    visuals: [{ src: asset("n8n-tools.png"), alt: "n8n agent tools screenshot", caption: "Agent tools connected in n8n" }],
  },
  {
    phase: "Modeling",
    eyebrow: "Phase 4 evidence - Channel reuse",
    title: "Website chat and Telegram use the same intelligence layer.",
    subtitle:
      "Both channels send messages into the Agent API, so the business does not need separate logic for every customer touchpoint.",
    icon: PanelTop,
    theme: "green",
    layout: "dualImage",
    bullets: [
      "Business value: the website is not isolated from the automation backend.",
      "Future channels such as WhatsApp or Instagram can reuse the same API design.",
    ],
    visuals: [
      { src: asset("website-chat-ui.png"), alt: "Website chat assistant screenshot", caption: "Website chat UI" },
      { src: asset("telegram-chat.png"), alt: "Telegram chat screenshot", caption: "Telegram chat channel" },
    ],
  },
  {
    phase: "Evaluation",
    eyebrow: "Phase 5 - Evaluation",
    title: "Evaluation is automated after every agent response.",
    subtitle:
      "An LLM-as-Judge branch scores relevance, correctness, tone, and completeness, then parses the scores and logs them for review.",
    icon: CheckCircle2,
    theme: "coral",
    layout: "imageOnly",
    bullets: [
      "Business value: service quality becomes measurable instead of anecdotal.",
      "Flagged responses reveal gaps in data coverage, especially pricing edge cases.",
    ],
    visuals: [{ src: asset("n8n-evaluation.png"), alt: "n8n evaluation workflow screenshot", caption: "LLM-as-Judge evaluation branch" }],
  },
  {
    phase: "Evaluation",
    eyebrow: "Phase 5 evidence - Quality dashboard",
    title: "Evaluation logs create a management view of AI service quality.",
    subtitle:
      "Scores and reasoning are stored in Google Sheets so the team can inspect response quality, trends, and flagged cases.",
    icon: Bot,
    theme: "coral",
    layout: "dualImage",
    bullets: [
      "Reported overall average: 4.3 out of 5.",
      "Flagged responses: 2 out of 28, mainly transfer-pricing coverage gaps.",
      "Memory summarization reduced context size by about 81 percent.",
    ],
    metrics: [
      { label: "Overall score", value: "4.3/5", note: "LLM-as-Judge average" },
      { label: "Flagged", value: "2/28", note: "Review queue" },
      { label: "Context saved", value: "81%", note: "Memory summarization" },
    ],
    visuals: [
      { src: asset("gsheets-evaluation-sheet.png"), alt: "Evaluation sheet screenshot", caption: "Evaluation log in Google Sheets" },
      { src: asset("n8n-memory-summarizing.png"), alt: "Memory summarization workflow screenshot", caption: "Memory summarization workflow" },
    ],
  },
  {
    phase: "Deployment",
    eyebrow: "Phase 6 - Deployment",
    title: "Deployment connects the website, Telegram, n8n, MongoDB, Qdrant, and Google Sheets.",
    subtitle:
      "The deployed design is practical: customers see the website and Telegram bot; staff manage prices in Sheets; operations are stored in MongoDB; knowledge retrieval runs through Qdrant.",
    icon: Network,
    theme: "green",
    layout: "architecture",
    bullets: [
      "Website chat and Telegram call the same Agent API webhook.",
      "n8n coordinates orchestration, tools, memory, and evaluation.",
      "MongoDB, Qdrant, and Google Sheets separate data by operational purpose.",
    ],
    visuals: [
      { src: asset("website-book-form.png"), alt: "Website booking form screenshot", caption: "Website booking form" },
      { src: asset("n8n-orchestrator.png"), alt: "n8n Orchestrator screenshot", caption: "Agent API workflow" },
    ],
  },
  {
    phase: "Deployment",
    eyebrow: "Phase 6 - Business impact",
    title: "The final system is a business automation layer for tourism sales and support.",
    subtitle:
      "CRISP-DM ties the project together: business need, data mapping, data preparation, modeling, evaluation, and deployment all support one measurable business goal.",
    icon: MonitorPlay,
    theme: "teal",
    layout: "metrics",
    bullets: [
      "More inquiries can be answered instantly and consistently.",
      "More leads and complaints become structured follow-up records.",
      "Pricing remains editable by business staff.",
      "The website is now part of the deployed customer journey.",
    ],
    metrics: [
      { label: "Business outcome", value: "Faster conversion", note: "Planning to quote in one channel" },
      { label: "Operational outcome", value: "Cleaner follow-up", note: "Leads, tickets, and memory" },
      { label: "Improvement loop", value: "Measured quality", note: "Evaluation logs and flagged cases" },
    ],
    visuals: [{ src: asset("website-landing-page.png"), alt: "HorizonVista website screenshot", caption: "Final deployed customer experience" }],
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
    bg: "from-rose-50 via-white to-orange-50",
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
  { phase: "Business", detail: "Lost leads, multilingual support, 24/7 response", icon: Route },
  { phase: "Data", detail: "Knowledge, live pricing, operations, retrieval", icon: Database },
  { phase: "Prepare", detail: "Flatten JSON, embed, store in Qdrant", icon: Workflow },
  { phase: "Model", detail: "Orchestrator, specialist agents, tools", icon: BrainCircuit },
  { phase: "Evaluate", detail: "LLM judge, test scenarios, flagged cases", icon: CheckCircle2 },
  { phase: "Deploy", detail: "Website, Telegram, n8n, MongoDB, Sheets", icon: Network },
];

const VisualFrame = ({ visual, size = "standard" }: { visual: Visual; size?: "standard" | "large" | "hero" }) => {
  const heightClass = {
    standard: "h-[42vh]",
    large: "h-[58vh]",
    hero: "h-[64vh]",
  }[size];

  return (
    <figure className="overflow-hidden rounded-lg border border-border bg-white shadow-elegant">
      <div className={cn("bg-slate-950/5", heightClass)}>
        <img src={visual.src} alt={visual.alt} className="h-full w-full object-contain" />
      </div>
      <figcaption className="flex items-center justify-between border-t border-border px-4 py-3 text-sm font-bold text-muted-foreground">
        <span>{visual.caption}</span>
        <span className="h-2 w-2 rounded-full bg-primary" />
      </figcaption>
    </figure>
  );
};

const MetricCard = ({ metric, theme }: { metric: Metric; theme: Slide["theme"] }) => {
  const classes = themeClasses[theme];

  return (
    <div className={cn("rounded-lg border bg-white/90 p-5 shadow-card", classes.border)}>
      <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">{metric.label}</p>
      <p className={cn("mt-2 text-3xl font-black tracking-tight md:text-4xl", classes.text)}>{metric.value}</p>
      <p className="mt-2 text-sm font-medium leading-snug text-muted-foreground">{metric.note}</p>
    </div>
  );
};

const BulletList = ({ bullets, theme }: { bullets?: string[]; theme: Slide["theme"] }) => {
  if (!bullets?.length) return null;
  const classes = themeClasses[theme];

  return (
    <div className="space-y-3">
      {bullets.map((bullet) => (
        <div key={bullet} className="flex gap-3 rounded-lg border border-border bg-white/90 p-4 shadow-soft">
          <span className={cn("mt-1.5 h-3 w-3 shrink-0 rounded-full", classes.accent)} />
          <p className="text-base font-medium leading-snug text-slate-700 xl:text-lg">{bullet}</p>
        </div>
      ))}
    </div>
  );
};

const CrispProcess = ({ activePhase, theme }: { activePhase: Phase; theme: Slide["theme"] }) => {
  const classes = themeClasses[theme];

  return (
    <div className="rounded-lg border border-border bg-white/90 p-4 shadow-card">
      <div className="grid gap-3 md:grid-cols-6">
        {processSteps.map((step) => {
          const Icon = step.icon;
          const isActive =
            activePhase === "Overview" ||
            (activePhase === "Business Understanding" && step.phase === "Business") ||
            (activePhase === "Data Understanding" && step.phase === "Data") ||
            (activePhase === "Data Preparation" && step.phase === "Prepare") ||
            (activePhase === "Modeling" && step.phase === "Model") ||
            (activePhase === "Evaluation" && step.phase === "Evaluate") ||
            (activePhase === "Deployment" && step.phase === "Deploy");

          return (
            <div
              key={step.phase}
              className={cn(
                "rounded-lg border p-4 transition-smooth",
                isActive ? cn(classes.border, classes.soft, "shadow-soft") : "border-border bg-white",
              )}
            >
              <Icon className={cn("mb-3 h-7 w-7", isActive ? classes.text : "text-muted-foreground")} />
              <p className="text-sm font-black text-slate-950">{step.phase}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PhaseStrip = ({ activePhase }: { activePhase: Phase }) => (
  <div className="hidden items-center gap-2 xl:flex">
    {crispPhases.map((phase) => {
      const isActive = phase === activePhase;

      return (
        <div
          key={phase}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-black",
            isActive ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-muted-foreground",
          )}
        >
          {phase}
        </div>
      );
    })}
  </div>
);

const SlideBody = ({ slide }: { slide: Slide }) => {
  const visuals = slide.visuals ?? [];

  if (slide.layout === "cover") {
    return (
      <div className="grid min-h-0 gap-5 xl:grid-cols-[0.85fr_1.25fr]">
        <div className="space-y-4">
          <CrispProcess activePhase={slide.phase} theme={slide.theme} />
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {slide.metrics?.map((metric) => <MetricCard key={metric.label} metric={metric} theme={slide.theme} />)}
          </div>
        </div>
        <VisualFrame visual={visuals[0]} size="hero" />
      </div>
    );
  }

  if (slide.layout === "business") {
    return (
      <div className="grid min-h-0 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {slide.metrics?.map((metric) => <MetricCard key={metric.label} metric={metric} theme={slide.theme} />)}
        </div>
        <div className="space-y-5">
          <CrispProcess activePhase={slide.phase} theme={slide.theme} />
          <BulletList bullets={slide.bullets} theme={slide.theme} />
        </div>
      </div>
    );
  }

  if (slide.layout === "imageOnly") {
    return (
      <div className="grid min-h-0 gap-5 xl:grid-cols-[1.2fr_0.55fr]">
        <VisualFrame visual={visuals[0]} size="hero" />
        <div className="space-y-4">
          <CrispProcess activePhase={slide.phase} theme={slide.theme} />
          <BulletList bullets={slide.bullets} theme={slide.theme} />
        </div>
      </div>
    );
  }

  if (slide.layout === "dualImage") {
    return (
      <div className="grid min-h-0 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="grid gap-5 lg:grid-cols-2">
          {visuals.map((visual) => (
            <VisualFrame key={visual.src} visual={visual} size="large" />
          ))}
        </div>
        <div className="space-y-5">
          <CrispProcess activePhase={slide.phase} theme={slide.theme} />
          <BulletList bullets={slide.bullets} theme={slide.theme} />
        </div>
      </div>
    );
  }

  if (slide.layout === "evidenceGrid") {
    return (
      <div className="grid min-h-0 gap-5 xl:grid-cols-[0.58fr_1.42fr]">
        <div className="space-y-5">
          <CrispProcess activePhase={slide.phase} theme={slide.theme} />
          <BulletList bullets={slide.bullets} theme={slide.theme} />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {visuals.map((visual) => (
            <VisualFrame key={visual.src} visual={visual} size="large" />
          ))}
        </div>
      </div>
    );
  }

  if (slide.layout === "architecture") {
    return (
      <div className="grid min-h-0 gap-5 xl:grid-cols-[0.55fr_1.45fr]">
        <div className="space-y-5">
          <CrispProcess activePhase={slide.phase} theme={slide.theme} />
          <BulletList bullets={slide.bullets} theme={slide.theme} />
        </div>
        <div className={cn("grid gap-5", visuals.length > 1 ? "lg:grid-cols-2" : "")}>
          {visuals.map((visual) => (
            <VisualFrame key={visual.src} visual={visual} size="large" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-0 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {slide.metrics?.map((metric) => <MetricCard key={metric.label} metric={metric} theme={slide.theme} />)}
        </div>
        <BulletList bullets={slide.bullets} theme={slide.theme} />
      </div>
      <div className="space-y-5">
        <CrispProcess activePhase={slide.phase} theme={slide.theme} />
        {visuals[0] && <VisualFrame visual={visuals[0]} size="large" />}
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
        <header className="flex items-center justify-between gap-4 rounded-lg border border-white/70 bg-white/90 px-4 py-3 shadow-soft backdrop-blur md:px-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-primary">
            <Home className="h-4 w-4" />
            HorizonVista
          </Link>
          <PhaseStrip activePhase={slide.phase} />
          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
            <MonitorPlay className="hidden h-4 w-4 sm:block" />
            {index + 1} / {slides.length}
          </div>
        </header>

        <section className="grid flex-1 grid-rows-[auto_1fr] gap-4 py-4">
          <div className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-card backdrop-blur md:p-5">
            <div className="mb-3 flex items-center gap-3">
              <div className={cn("grid h-11 w-11 place-items-center rounded-lg text-white shadow-card", classes.accent)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className={cn("text-sm font-black uppercase tracking-wide", classes.text)}>{slide.eyebrow}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">{slide.phase}</p>
              </div>
            </div>
            <h1 className="max-w-6xl text-balance text-3xl font-black leading-[1.03] text-slate-950 md:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-3 max-w-6xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">{slide.subtitle}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className={cn("h-full rounded-full", classes.accent)} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="min-h-0">
            <SlideBody slide={slide} />
          </div>
        </section>

        <footer className="flex items-center justify-between gap-3 rounded-lg border border-white/70 bg-white/90 px-3 py-3 shadow-soft backdrop-blur">
          <Button variant="outline" size="icon" onClick={goPrevious} disabled={index === 0} aria-label="Previous slide">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex max-w-[72vw] flex-wrap items-center justify-center gap-2">
            {slides.map((item, itemIndex) => {
              const ItemIcon = item.icon;
              const isActive = itemIndex === index;

              return (
                <button
                  key={`${item.phase}-${item.title}`}
                  type="button"
                  onClick={() => goTo(itemIndex)}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full border transition-smooth md:h-9 md:w-9",
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
