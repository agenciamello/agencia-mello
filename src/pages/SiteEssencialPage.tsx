import React, { useEffect } from "react";
import { SiteEssencialHeader } from "../components/site-essencial/SiteEssencialHeader";
import { SiteEssencialHero } from "../components/site-essencial/SiteEssencialHero";
import { SiteEssencialTrustBar } from "../components/site-essencial/SiteEssencialTrustBar";
import { SiteEssencialTargetSection } from "../components/site-essencial/SiteEssencialTargetSection";
import { SiteEssencialComparisonIntro } from "../components/site-essencial/SiteEssencialComparisonIntro";
import { SiteEssencialFeaturesSection } from "../components/site-essencial/SiteEssencialFeaturesSection";
import { SiteEssencialPricingSection } from "../components/site-essencial/SiteEssencialPricingSection";
import { SiteEssencialExamplesSection } from "../components/site-essencial/SiteEssencialExamplesSection";
import { SiteEssencialProcessSection } from "../components/site-essencial/SiteEssencialProcessSection";
import { SiteEssencialComparisonTable } from "../components/site-essencial/SiteEssencialComparisonTable";
import { SiteEssencialPostApprovalSection } from "../components/site-essencial/SiteEssencialPostApprovalSection";
import { SiteEssencialAuthoritySection } from "../components/site-essencial/SiteEssencialAuthoritySection";
import { SiteEssencialFaqSection } from "../components/site-essencial/SiteEssencialFaqSection";
import { SiteEssencialCtaSection } from "../components/site-essencial/SiteEssencialCtaSection";
import { SiteEssencialMobileBar } from "../components/site-essencial/SiteEssencialMobileBar";
import { SiteEssencialFooter } from "../components/site-essencial/SiteEssencialFooter";
import { FloatingWhatsApp } from "../components/layout/FloatingWhatsApp";
import { SITE_ESSENCIAL_MESSAGES } from "../data/siteData";

export const SiteEssencialPage: React.FC = () => {
  useEffect(() => {
    document.title = "Site Essencial — R$ 500 | Agência Mello";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/30 selection:text-white">
      <SiteEssencialHeader />
      <main className="flex-1">
        <SiteEssencialHero />
        <SiteEssencialTrustBar />
        <SiteEssencialTargetSection />
        <SiteEssencialComparisonIntro />
        <SiteEssencialFeaturesSection />
        <SiteEssencialPricingSection />
        <SiteEssencialExamplesSection />
        <SiteEssencialProcessSection />
        <SiteEssencialComparisonTable />
        <SiteEssencialPostApprovalSection />
        <SiteEssencialAuthoritySection />
        <SiteEssencialFaqSection />
        <SiteEssencialCtaSection />
      </main>
      <SiteEssencialFooter />
      <SiteEssencialMobileBar />
      <FloatingWhatsApp customMessage={SITE_ESSENCIAL_MESSAGES.flutuante} />
    </div>
  );
};
