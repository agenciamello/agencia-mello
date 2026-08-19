import React, { useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { FloatingWhatsApp } from "../components/layout/FloatingWhatsApp";
import { HeroSection } from "../components/home/HeroSection";
import { TrustBar } from "../components/home/TrustBar";
import { ServicesSection } from "../components/home/ServicesSection";
import { FeaturedOfferSection } from "../components/home/FeaturedOfferSection";
import { ProjectsSection } from "../components/home/ProjectsSection";
import { ProcessSection } from "../components/home/ProcessSection";
import { ComparisonSection } from "../components/home/ComparisonSection";
import { AboutSection } from "../components/home/AboutSection";
import { FaqSection } from "../components/home/FaqSection";
import { CtaSection } from "../components/home/CtaSection";

export const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "Agência Mello | Sites, Identidade Visual e Conteúdo";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/30 selection:text-white">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrustBar />
        <ServicesSection />
        <FeaturedOfferSection />
        <ProjectsSection />
        <ProcessSection />
        <ComparisonSection />
        <AboutSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};
