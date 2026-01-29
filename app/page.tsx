import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TechMarquee from "@/components/TechMarquee";
import VisionSection from "@/components/VisionSection";
import DiveSection from "@/components/DiveSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <TechMarquee />
      <VisionSection />
      <Services />
      <DiveSection />
      <ContactForm />
      <Footer />
    </main>
  );
}
