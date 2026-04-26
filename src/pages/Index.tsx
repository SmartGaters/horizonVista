import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ChatAssistant } from "@/components/ChatAssistant";
import { Packages } from "@/components/Packages";
import { Services } from "@/components/Services";
import { BookingForm } from "@/components/BookingForm";
import { Analytics } from "@/components/Analytics";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ChatAssistant />
      <Packages />
      <Services />
      <BookingForm />
      <Analytics />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
