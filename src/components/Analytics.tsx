import { MessagesSquare, Target, UserCheck, MapPin } from "lucide-react";

const STATS = [
  { icon: MessagesSquare, value: "124", label: "AI conversations", tone: "blue" },
  { icon: Target, value: "37", label: "Booking intents detected", tone: "turquoise" },
  { icon: UserCheck, value: "18", label: "Leads captured", tone: "blue" },
  { icon: MapPin, value: "Istanbul", label: "Top destination", tone: "turquoise" },
];

export const Analytics = () => (
  <section id="analytics" className="py-20 md:py-28">
    <div className="container">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
          Demo analytics
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Real insights from <span className="text-gradient">every conversation</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          The agent tracks engagement, intent, and conversions to help the business grow.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-card border border-border/50 p-6 shadow-soft hover:shadow-card transition-smooth"
          >
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${s.tone === "blue" ? "gradient-blue" : "gradient-turquoise"}`}>
              <s.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-1 leading-none">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
