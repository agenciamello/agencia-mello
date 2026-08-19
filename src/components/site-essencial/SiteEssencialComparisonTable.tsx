import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import {
  SITE_ESSENCIAL_PRICE,
  SITE_ESSENCIAL_INCLUDED_LIST,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

const SOB_MEDIDA_ITEMS = [
  "Múltiplas páginas",
  "Loja virtual / E-commerce",
  "Sistemas ou integrações avançadas",
  "Área de membros ou login",
  "Identidade visual completa",
  "Proposta personalizada",
];

export const SiteEssencialComparisonTable: React.FC = () => {
  return (
    <SectionContainer id="comparativo" compact>
      <SectionHeader
        eyebrow="Comparativo"
        title="Site Essencial vs Projeto Sob Medida"
        description="Escolha o formato ideal para o momento e a complexidade do seu negócio."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Card 1: Site Essencial */}
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-accent/40 bg-surface p-7 sm:p-8 shadow-[0_0_0_1px_rgba(236,72,153,0.1)]">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-white">Site Essencial</h3>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                  Mais procurado
                </span>
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">
                Ideal para negócios locais que buscam uma apresentação
                profissional direta.
              </p>

              <div className="mt-5 flex items-baseline gap-2 border-b border-white/[0.08] pb-5">
                <span className="text-3xl font-bold text-accent sm:text-4xl">
                  {SITE_ESSENCIAL_PRICE}
                </span>
                <span className="text-sm text-muted-foreground">em até 3x</span>
              </div>

              <ul className="mt-6 space-y-3">
                {SITE_ESSENCIAL_INCLUDED_LIST.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[15px] font-medium text-white"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <Button
                href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.comparativo)}
                className="w-full justify-center"
              >
                Quero o Site Essencial
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Card 2: Projeto Sob Medida */}
        <Reveal delay={90}>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-surface p-7 sm:p-8">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-white">Projeto Sob Medida</h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Personalizado
                </span>
              </div>
              <p className="mt-2 text-[15px] text-muted-foreground">
                Ideal para empresas que precisam de sistemas, e-commerce ou
                múltiplas páginas.
              </p>

              <div className="mt-5 flex items-baseline gap-2 border-b border-white/[0.08] pb-5">
                <span className="text-3xl font-bold text-white sm:text-4xl">
                  Sob consulta
                </span>
                <span className="text-sm text-muted-foreground">
                  Orçamento personalizado
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {SOB_MEDIDA_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[15px] text-white/80"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-white/40"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <Button
                href={getWhatsAppUrl("Olá! Gostaria de solicitar um orçamento para um projeto sob medida.")}
                variant="secondary"
                className="w-full justify-center group"
              >
                <span>Solicitar proposta sob medida</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      <p className="mt-7 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
        Os dois formatos seguem o mesmo cuidado de design e execução.
      </p>
    </SectionContainer>
  );
};
