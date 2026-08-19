import React from "react";
import {
  Scissors,
  Sparkles,
  Utensils,
  User,
  Calendar,
  Wrench,
  Dumbbell,
  Building2,
} from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { SITE_ESSENCIAL_SEGMENTS } from "../../data/siteData";

const iconMap = {
  Scissors,
  Sparkles,
  Utensils,
  User,
  Calendar,
  Wrench,
  Dumbbell,
  Building2,
};

export const SiteEssencialTargetSection: React.FC = () => {
  return (
    <SectionContainer id="para-quem">
      <SectionHeader
        eyebrow="Feito para negócios reais"
        title="Seu negócio já trabalha bem. O site precisa mostrar isso."
        description="O Site Essencial foi criado para empresas que já possuem um bom serviço, mas ainda dependem apenas do Instagram, WhatsApp ou Google para apresentar o negócio."
      />

      <Reveal>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SITE_ESSENCIAL_SEGMENTS.map((segment) => {
            const Icon = iconMap[segment.iconName as keyof typeof iconMap] || Building2;
            return (
              <li
                key={segment.label}
                className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-surface px-4 py-3 text-[15px] leading-snug text-white/85"
              >
                <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{segment.label}</span>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-surface p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white">
            Talvez ainda não seja para você
          </h3>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            O Site Essencial não foi criado para lojas virtuais, plataformas,
            sistemas complexos ou projetos com várias funcionalidades
            personalizadas. Para esses casos, desenvolvemos uma proposta sob
            medida.
          </p>
        </div>
      </Reveal>
    </SectionContainer>
  );
};
