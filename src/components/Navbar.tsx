import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-horizonvista-mark.jpg";

const LINKS = [
  { href: "#chat", label: "AI Assistant" },
  { href: "#packages", label: "Packages" },
  { href: "#services", label: "Services" },
  { href: "#analytics", label: "Insights" },
  { href: "#contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="HorizonVista Travel logo"
            className="h-10 w-10 rounded-full object-cover shadow-soft"
          />
          <span className="font-display font-bold text-lg hidden sm:inline">HorizonVista</span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/80 hover:text-primary transition-smooth">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="hero" size="sm" className="hidden sm:inline-flex">
            <a href="#booking">Book Now</a>
          </Button>
          <button
            className="md:hidden h-10 w-10 rounded-full inline-flex items-center justify-center hover:bg-secondary transition-smooth"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container py-4 flex flex-col gap-3">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-foreground/80 hover:text-primary py-1.5"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
