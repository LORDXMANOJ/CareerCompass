import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MentorPreviewSection } from "@/components/landing/mentor-preview-section";
import { ReadinessPreviewSection } from "@/components/landing/readiness-preview-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-[#EE4C7C] selection:text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-[#5D001E]/25 via-[#9A1750]/20 to-[#EE4C7C]/10 rounded-full blur-[180px] pointer-events-none" />

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <MentorPreviewSection />
      <ReadinessPreviewSection />
      <TestimonialsSection />
      <FAQSection />
      <LandingFooter />
    </main>
  );
}
