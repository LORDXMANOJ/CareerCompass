import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import {
  MentorPreviewSection,
} from "@/components/landing/mentor-preview-section";
import {
  ReadinessPreviewSection,
} from "@/components/landing/readiness-preview-section";
import {
  TestimonialsSection,
} from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white relative overflow-hidden">
      <LandingNavbar />
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
