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
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-500/10 rounded-full blur-[180px] pointer-events-none" />

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
