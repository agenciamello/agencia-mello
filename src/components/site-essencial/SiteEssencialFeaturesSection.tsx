import React from "react";
import {
  Layers,
  Smartphone,
  MessageCircle,
  Sliders,
  Rocket,
  Search,
} from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import {
  SITE_ESSENCIAL_FEATURES,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

const iconMap = {
  Layers,
  Smartphone,
  MessageCircle,
  Sliders,
  Rocket,
  Search,
};

export const SiteEssencialFeaturesSection: React.FC = () => {
  return (
    <SectionContainer id="incluso">
      <SectionHeader
        eyebrow="Estrutura completa"
        title="O que está incluso no Site Essencial"
        description="Um formato objetivo e profissional para apresentar sua empresa com clareza."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SITE_ESSENCIAL_FEATURES.map((feature, index) => {
          const Icon = iconMap[feature.iconName as keyof typeof iconMap] || Layers;
          return (
            <Reveal key={feature.title} delay={(index % 3) * 70} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-surface p-6 sm:p-7 transition-colors hover:border-white/20">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {feature.text}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-10">
        <Button href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.recursos)}>
          Quero entender o que faz sentido para minha empresa
        </Button>
      </div>
    </SectionContainer>
  );
};
