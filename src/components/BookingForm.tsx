import { useState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(5, "Phone is too short").max(40),
  destination: z.string().trim().min(2, "Where would you like to go?").max(120),
  travelDates: z.string().trim().min(2, "Please add travel dates").max(80),
  travelers: z.coerce.number().int().min(1).max(50),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().max(1000).optional(),
});

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  destination: string;
  travelDates: string;
  travelers: string;
  budget: string;
  contactTime: string;
  message: string;
};

const empty: FormState = {
  fullName: "",
  email: "",
  phone: "",
  destination: "",
  travelDates: "",
  travelers: "2",
  budget: "",
  contactTime: "",
  message: "",
};

export const BookingForm = () => {
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const first = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      toast.error(first ?? "Please check the form fields.");
      return;
    }
    setLoading(true);
    // Simulate request — replace with edge function or webhook call later.
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSuccess(true);
    toast.success("Booking request received! Our team will be in touch shortly.");
  };

  return (
    <section id="booking" className="py-20 md:py-28 gradient-soft">
      <div className="container max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Request a <span className="text-gradient">custom booking</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Share your travel plans and our team will craft a personalized proposal within 24 hours.
          </p>
        </div>

        <div className="rounded-3xl bg-card border border-border/50 shadow-card p-6 md:p-10">
          {success ? (
            <SuccessState onReset={() => { setForm(empty); setSuccess(false); }} />
          ) : (
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
              <Field label="Full name" required>
                <Input value={form.fullName} onChange={update("fullName")} placeholder="Jane Doe" />
              </Field>
              <Field label="Email" required>
                <Input type="email" value={form.email} onChange={update("email")} placeholder="jane@example.com" />
              </Field>
              <Field label="Phone" required>
                <Input value={form.phone} onChange={update("phone")} placeholder="+1 555 123 4567" />
              </Field>
              <Field label="Destination" required>
                <Input value={form.destination} onChange={update("destination")} placeholder="e.g. Maldives" />
              </Field>
              <Field label="Travel dates" required>
                <Input value={form.travelDates} onChange={update("travelDates")} placeholder="e.g. 12–19 Aug 2026" />
              </Field>
              <Field label="Number of travelers" required>
                <Input type="number" min={1} max={50} value={form.travelers} onChange={update("travelers")} />
              </Field>
              <Field label="Budget (optional)">
                <Input value={form.budget} onChange={update("budget")} placeholder="e.g. $3,000 per person" />
              </Field>
              <Field label="Preferred contact time (optional)">
                <Input
                  type="text"
                  value={form.contactTime}
                  onChange={update("contactTime")}
                  placeholder="e.g. Morning, afternoon, evening"
                />
              </Field>
              <Field label="Message" className="md:col-span-2">
                <textarea
                  value={form.message}
                  onChange={update("message")}
                  rows={4}
                  maxLength={1000}
                  placeholder="Tell us about your dream trip — anything special we should know?"
                  className="w-full rounded-2xl bg-secondary px-5 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth resize-none"
                />
              </Field>

              <div className="md:col-span-2 flex justify-end pt-2">
                <Button type="submit" variant="hero" size="lg" disabled={loading}>
                  {loading ? <><Loader2 className="animate-spin" /> Sending…</> : <><Send /> Send booking request</>}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const Field = ({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-medium text-foreground mb-1.5 inline-block">
      {label}{required && <span className="text-primary"> *</span>}
    </span>
    {children}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full h-12 rounded-2xl bg-secondary px-5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth disabled:opacity-50"
  />
);

const SuccessState = ({ onReset }: { onReset: () => void }) => (
  <div className="text-center py-10 animate-fade-in-up">
    <div className="h-16 w-16 mx-auto rounded-full gradient-turquoise flex items-center justify-center mb-5 shadow-glow">
      <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
    </div>
    <h3 className="text-2xl font-bold mb-2">Request received! 🎉</h3>
    <p className="text-muted-foreground max-w-md mx-auto mb-6">
      Thanks for choosing HorizonVista. A travel consultant will reach out within 24 hours with a tailored proposal.
    </p>
    <Button variant="outline" onClick={onReset}>Submit another request</Button>
  </div>
);
