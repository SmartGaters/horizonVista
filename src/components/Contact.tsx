import { MapPin, Phone, Mail, Clock, Globe, Send, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, BRANCHES, SOCIAL, LANGUAGES, PAYMENTS, CURRENCIES } from "@/lib/contact";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get in <span className="text-gradient">touch</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Reach our travel consultants on any channel — or chat with our AI agent on Telegram, available 24/7.
          </p>
        </div>

        {/* Channels */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <ChannelCard
            icon={<Send className="h-5 w-5" />}
            title="Telegram"
            subtitle={SOCIAL.telegramHandle}
            href={SOCIAL.telegram}
            highlight
          />
          <ChannelCard
            icon={<MessageCircle className="h-5 w-5" />}
            title="WhatsApp"
            subtitle={SOCIAL.whatsappHandle}
            href={SOCIAL.whatsapp}
          />
          <ChannelCard
            icon={<Instagram className="h-5 w-5" />}
            title="Instagram"
            subtitle={SOCIAL.instagramHandle}
            href={SOCIAL.instagram}
          />
          <ChannelCard
            icon={<Facebook className="h-5 w-5" />}
            title="Facebook"
            subtitle={SOCIAL.facebookHandle}
            href={SOCIAL.facebook}
          />
        </div>

        {/* HQ summary */}
        <div className="rounded-3xl bg-card border border-border/50 shadow-card p-6 md:p-8 mb-10 grid md:grid-cols-3 gap-6">
          <SummaryItem icon={<Phone className="h-4 w-4" />} label="General phone" value={COMPANY.generalPhone} />
          <SummaryItem icon={<Mail className="h-4 w-4" />} label="General email" value={COMPANY.generalEmail} />
          <SummaryItem icon={<Globe className="h-4 w-4" />} label="Website" value={COMPANY.website} />
        </div>

        {/* Branches */}
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">Our offices</h3>
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {BRANCHES.map((b) => (
            <article
              key={b.city}
              className="rounded-3xl bg-card border border-border/50 shadow-card p-6 hover:shadow-elegant transition-smooth"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl gradient-blue flex items-center justify-center shadow-soft">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                </div>
                <h4 className="font-bold text-lg">{b.city}</h4>
              </div>
              <ul className="space-y-2.5 text-sm">
                <Row icon={<MapPin className="h-3.5 w-3.5" />}>{b.address}</Row>
                <Row icon={<Phone className="h-3.5 w-3.5" />}>
                  <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-smooth">
                    {b.phone}
                  </a>
                </Row>
                <Row icon={<Mail className="h-3.5 w-3.5" />}>
                  <a href={`mailto:${b.email}`} className="hover:text-primary transition-smooth break-all">
                    {b.email}
                  </a>
                </Row>
                <Row icon={<Clock className="h-3.5 w-3.5" />}>{b.hours}</Row>
              </ul>
            </article>
          ))}
        </div>

        {/* Meta info */}
        <div className="grid md:grid-cols-3 gap-5">
          <InfoBlock title="Languages supported" items={[...LANGUAGES]} />
          <InfoBlock title="Payment methods" items={[...PAYMENTS]} />
          <InfoBlock title="Currencies accepted" items={[...CURRENCIES]} />
        </div>
      </div>
    </section>
  );
};

const ChannelCard = ({
  icon,
  title,
  subtitle,
  href,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  highlight?: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group rounded-3xl border border-border/50 p-5 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-smooth flex items-center gap-4 ${
      highlight ? "gradient-blue text-primary-foreground" : "bg-card"
    }`}
  >
    <div
      className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
        highlight ? "bg-white/20 text-primary-foreground" : "gradient-turquoise text-primary-foreground"
      }`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className={`text-xs uppercase tracking-wider ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {title}
      </p>
      <p className="font-semibold truncate">{subtitle}</p>
    </div>
  </a>
);

const SummaryItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="h-9 w-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-semibold break-all">{value}</p>
    </div>
  </div>
);

const Row = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <li className="flex items-start gap-2 text-muted-foreground">
    <span className="mt-1 text-primary shrink-0">{icon}</span>
    <span className="text-foreground/90">{children}</span>
  </li>
);

const InfoBlock = ({ title, items }: { title: string; items: string[] }) => (
  <div className="rounded-3xl bg-card border border-border/50 shadow-card p-6">
    <h4 className="font-bold mb-3">{title}</h4>
    <ul className="space-y-1.5 text-sm text-muted-foreground">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span className="text-foreground/90">{it}</span>
        </li>
      ))}
    </ul>
  </div>
);
