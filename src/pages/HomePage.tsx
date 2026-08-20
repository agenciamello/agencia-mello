import React, { useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { FloatingWhatsApp } from "../components/layout/FloatingWhatsApp";
import { HeroSection } from "../components/home/HeroSection";
import { TrustBar } from "../components/home/TrustBar";
import { ServicesSection } from "../components/home/ServicesSection";
import { ProjectsHandoff } from "../components/home/ProjectsHandoff";
import { ProcessSection } from "../components/home/ProcessSection";
import { ComparisonSection } from "../components/home/ComparisonSection";
import { AboutSection } from "../components/home/AboutSection";
import { FaqSection } from "../components/home/FaqSection";
import { CtaSection } from "../components/home/CtaSection";
import { FpsCounter } from "../components/debug/FpsCounter";
import { isMotionDebugForced } from "../utils/motionDebug";

export const HomePage: React.FC = () => {
  const forceMotion = isMotionDebugForced();

  useEffect(() => {
    document.title = "Agência Mello | Sites, Identidade Visual e Conteúdo";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/30 selection:text-white">
      <Header />
      <main className="flex-1">
        <div
          className="hero-focus-handoff"
          data-hero-handoff
          data-force-motion={forceMotion ? "" : undefined}
        >
          <HeroSection />
          <div
            className="hero-focus-handoff__incoming"
            data-hero-incoming
          >
            <TrustBar />
            <ServicesSection />
          </div>
        </div>
        <ProjectsHandoff />
        <ProcessSection />
        <ComparisonSection />
        <AboutSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <FpsCounter />
    </div>
  );
};
