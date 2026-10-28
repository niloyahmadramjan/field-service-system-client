import HeroSection from "@/components/home/sections/hero";
import StatsSection from "@/components/home/sections/stats";
import ServicesSection from "@/components/home/sections/services";
import HowItWorksSection from "@/components/home/sections/how-it-works";
import RolesSection from "@/components/home/sections/roles";
import FeaturesSection from "@/components/home/sections/features";
import TestimonialsSection from "@/components/home/sections/testimonials";
import FaqSection from "@/components/home/sections/faq";
import CtaSection from "@/components/home/sections/cta";

export default function HomePage() {
  return (
    <>
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <HowItWorksSection />
        <RolesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>

    </>
  );
}
