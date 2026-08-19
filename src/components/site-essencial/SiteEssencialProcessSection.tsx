import React from "react";
import { MessageCircle } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import {
  SITE_ESSENCIAL_PROCESS_STEPS,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const SiteEssencialProcessSection: React.FC = () => {
  return (
    <SectionContainer id="como-funciona" surface compact>
      <SectionHeader
        eyebrow="Sem salto no escuro"
        title="Você vê primeiro. Só paga se aprovar."
        description="Nosso processo reduz o risco para sua empresa e evita que você invista sem saber o resultado que vai receber."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SITE_ESSENCIAL_PROCESS_STEPS.map((step, index) => (
          <Reveal key={step.n} delay={index * 70} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-background p-6">
              <span className="text-2xl font-bold tracking-tight text-accent">
                {step.n}
              </span>
              <h3 className="mt-4 text-[17px] font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {step.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <Button href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.processo)}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>Quero pedir uma prévia do meu site</span>
        </Button>
      </div>
    </SectionContainer>
  );
};
