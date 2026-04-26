import { ArrowRight, Compass, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-travel.jpg";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 gradient-mesh opacity-70 pointer-events-none" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-turquoise animate-pulse" style={{ background: "hsl(var(--turquoise))" }} />
              AI-powered travel agency
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.05] mb-6">
              <span className="text-gradient">HorizonVista</span>
              <br />
              <span className="text-foreground">Travel</span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-foreground/80 mb-4">
              Plan smarter trips with an AI-powered travel consultant.
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Ask questions, compare travel packages, check policies, calculate prices, and request bookings through our intelligent tourism assistant.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button variant="hero" size="lg" onClick={() => scrollTo("chat")}>
                <MessageCircle /> Start Chat
                <ArrowRight />
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollTo("packages")}>
                <Compass /> Explore Packages
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 justify-center lg:justify-start text-sm text-muted-foreground">
              <Stat value="50+" label="Destinations" />
              <Stat value="24/7" label="AI assistance" />
              <Stat value="4.9★" label="Customer rating" />
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative rounded-3xl overflow-hidden shadow-elegant">
              <img
                src={heroImg}
                alt="Aerial view of a tropical island paradise with turquoise water at sunset"
                width={1600}
                height={1024}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-deep/30 via-transparent to-transparent" />
            </div>

            {/* Floating chat preview */}
            <div className="hidden md:block absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-card border border-border/60 p-4 max-w-[260px] animate-float">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full gradient-turquoise flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-primary-foreground" />
                </div>
                <p className="text-xs font-semibold">AI Assistant</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "I found 3 honeymoon packages under $3,000 — want to compare?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-xs uppercase tracking-wider">{label}</div>
  </div>
);
