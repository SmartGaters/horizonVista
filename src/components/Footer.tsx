import logo from "@/assets/logo-horizonvista-mark.jpg";

export const Footer = () => (
  <footer className="border-t border-border/60 bg-card">
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="HorizonVista Travel logo"
            className="h-12 w-12 rounded-full object-cover shadow-soft"
          />
          <div>
            <p className="font-display font-bold text-lg leading-tight">HorizonVista Travel</p>
            <p className="text-xs text-muted-foreground">Your Journey, Our Passion</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground justify-center">
          <a href="#chat" className="hover:text-primary transition-smooth">AI Assistant</a>
          <a href="#packages" className="hover:text-primary transition-smooth">Packages</a>
          <a href="#services" className="hover:text-primary transition-smooth">Services</a>
          <a href="#booking" className="hover:text-primary transition-smooth">Booking</a>
          <a href="#contact" className="hover:text-primary transition-smooth">Contact</a>
        </nav>

        <p className="text-xs text-muted-foreground text-center md:text-right">
          © {new Date().getFullYear()} HorizonVista Travel
          <br />
          University Project Demo
        </p>
      </div>
    </div>
  </footer>
);
