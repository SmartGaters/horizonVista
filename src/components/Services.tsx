import {
  Plane,
  Car,
  Hotel,
  ScrollText,
  Compass,
  Tag,
  Languages,
  Target,
} from "lucide-react";

const SERVICES = [
  {
    icon: Plane,
    title: "Tour packages",
    desc: "Curated itineraries across 50+ destinations.",
    prompt: "What tour packages does HorizonVista Travel offer?",
  },
  {
    icon: Car,
    title: "Airport transfers",
    desc: "Private and shared transfers door-to-door.",
    prompt: "Do you offer airport transfers?",
  },
  {
    icon: Hotel,
    title: "Hotel reservation support",
    desc: "From boutique stays to 5-star resorts.",
    prompt: "Can you help with hotel reservations?",
  },
  {
    icon: ScrollText,
    title: "Travel policy assistance",
    desc: "Visa, insurance, and cancellation guidance.",
    prompt: "What travel policies should I know before booking?",
  },
  {
    icon: Compass,
    title: "Destination recommendations",
    desc: "AI-driven matches for your travel style.",
    prompt: "Can you recommend a destination based on my travel needs?",
  },
  {
    icon: Tag,
    title: "Dynamic pricing support",
    desc: "Live quotes pulled from our pricing engine.",
    prompt: "Can you calculate dynamic pricing for a travel package?",
  },
  {
    icon: Languages,
    title: "Multilingual support",
    desc: "Chat in your preferred language, anytime.",
    prompt: "Do you support multiple languages?",
  },
  {
    icon: Target,
    title: "Booking intent detection",
    desc: "Smart hand-off to a human consultant when ready.",
    prompt: "I want to book a trip. What information do you need from me?",
  },
];

const askAI = (prompt: string) => {
  const chat = document.getElementById("chat");
  chat?.scrollIntoView({ behavior: "smooth", block: "start" });
  // Wait briefly so the chat section is in view before sending
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent("hv:ask-ai", { detail: prompt }));
  }, 450);
};

export const Services = () => (
  <section id="services" className="py-20 md:py-28">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Everything you need, <span className="text-gradient">end to end</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          A complete suite of tourism services backed by an AI agent that understands your needs.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES.map((s) => (
          <button
            key={s.title}
            type="button"
            onClick={() => askAI(s.prompt)}
            aria-label={`Ask AI: ${s.prompt}`}
            className="group text-left cursor-pointer rounded-2xl bg-card border border-border/50 p-6 shadow-soft hover:shadow-card transition-bounce hover:-translate-y-1 hover:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div className="h-12 w-12 rounded-xl gradient-turquoise flex items-center justify-center mb-4 transition-bounce group-hover:scale-110">
              <s.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-base mb-1.5">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </button>
        ))}
      </div>
    </div>
  </section>
);
