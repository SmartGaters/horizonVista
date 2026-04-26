import { MapPin, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import maldives from "@/assets/pkg-maldives.jpg";
import cappadocia from "@/assets/pkg-cappadocia.jpg";
import istanbul from "@/assets/pkg-istanbul.jpg";
import antalya from "@/assets/pkg-antalya.jpg";
import dubai from "@/assets/pkg-dubai.jpg";

interface Package {
  name: string;
  location: string;
  duration?: string;
  category: string;
  price?: string;
  image: string;
  featured?: boolean;
}

const PACKAGES: Package[] = [
  {
    name: "Magical Maldives Escape",
    location: "Maldives",
    duration: "7 days",
    category: "Honeymoon · Romantic",
    price: "from $2,800",
    image: maldives,
    featured: true,
  },
  {
    name: "Cappadocia Cave & Balloon Experience",
    location: "Turkey",
    duration: "4 days",
    category: "Adventure · Culture",
    image: cappadocia,
  },
  {
    name: "Istanbul Heritage Discovery",
    location: "Turkey",
    category: "Cultural Tour",
    image: istanbul,
  },
  {
    name: "Antalya Beach Holiday",
    location: "Turkey",
    category: "Beach Holiday",
    image: antalya,
  },
  {
    name: "Dubai Shopping Experience",
    location: "UAE",
    category: "Shopping · City Break",
    image: dubai,
  },
];

const askAi = (pkgName: string) => {
  window.dispatchEvent(new CustomEvent<string>("hv:ask-ai", { detail: `Tell me more about ${pkgName}.` }));
  document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" });
};

export const Packages = () => {
  return (
    <section id="packages" className="py-20 md:py-28 gradient-soft">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-4 py-1.5 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Curated by travel experts
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Popular <span className="text-gradient">travel packages</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our most-loved itineraries — get instant answers about any of them from the AI assistant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.name} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PackageCard = ({ pkg }: { pkg: Package }) => (
  <article className="group relative rounded-3xl overflow-hidden bg-card shadow-card border border-border/40 transition-bounce hover:-translate-y-1 hover:shadow-elegant">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={pkg.image}
        alt={pkg.name}
        loading="lazy"
        width={800}
        height={600}
        className="w-full h-full object-cover transition-smooth group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {pkg.featured && (
        <span className="absolute top-4 left-4 rounded-full gradient-turquoise text-primary-foreground text-xs font-semibold px-3 py-1 shadow-soft">
          ✨ Featured
        </span>
      )}
      {pkg.price && (
        <span className="absolute bottom-4 right-4 rounded-full bg-card/95 backdrop-blur text-foreground text-sm font-bold px-4 py-1.5 shadow-soft">
          {pkg.price}
        </span>
      )}
    </div>

    <div className="p-6">
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {pkg.location}
        </span>
        {pkg.duration && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {pkg.duration}
          </span>
        )}
      </div>
      <h3 className="text-lg font-bold mb-1.5 leading-snug">{pkg.name}</h3>
      <p className="text-sm text-muted-foreground mb-5">{pkg.category}</p>

      <Button variant="turquoise" size="sm" onClick={() => askAi(pkg.name)} className="w-full">
        <Sparkles /> Ask AI
        <ArrowRight />
      </Button>
    </div>
  </article>
);
