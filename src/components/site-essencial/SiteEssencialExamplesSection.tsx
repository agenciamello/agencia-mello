import React from "react";
import { MessageCircle } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import {
  SITE_ESSENCIAL_EXAMPLES,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const SiteEssencialExamplesSection: React.FC = () => {
  return (
    <SectionContainer id="exemplos">
      <SectionHeader
        eyebrow="Exemplos de aplicação"
        title="Um formato que se adapta ao seu negócio"
        description="A estrutura é objetiva e a apresentação visual é ajustada ao segmento e à identidade de cada empresa."
      />

      <div className="mt-9 grid gap-5 lg:grid-cols-3">
        {SITE_ESSENCIAL_EXAMPLES.map((example, index) => (
          <Reveal key={example.name} delay={(index % 3) * 80} className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-surface transition-all duration-300 hover:border-white/20">
              <div className="relative aspect-[4/3] overflow-hidden bg-background">
                <img
                  src={example.image}
                  alt={`Exemplo de site para ${example.name}`}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-background/85 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
                  Exemplo demonstrativo
                </span>
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  {example.segment}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  {example.name}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {example.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <Button href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.exemplos)}>
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>Quero ver como ficaria para o meu negócio</span>
        </Button>
      </div>
    </SectionContainer>
  );
};
