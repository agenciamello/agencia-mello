import React from "react";
import { X, Check } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import {
  SITE_ESSENCIAL_NO_SITE,
  SITE_ESSENCIAL_WITH_SITE,
} from "../../data/siteData";

export const SiteEssencialComparisonIntro: React.FC = () => {
  return (
    <SectionContainer surface>
      <SectionHeader
        eyebrow="Mais do que um perfil"
        title="Seu cliente precisa encontrar todas as informações sem procurar demais."
        description="Redes sociais ajudam na divulgação, mas não substituem uma apresentação organizada e profissional do seu negócio."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl border border-white/[0.08] bg-background p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-white/80">
              Quando existe apenas Instagram ou WhatsApp
            </h3>
            <ul className="mt-5 space-y-3">
              {SITE_ESSENCIAL_NO_SITE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] text-muted-foreground"
                >
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="h-full rounded-2xl border border-accent/25 bg-background p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-white">
              Com um site profissional
            </h3>
            <ul className="mt-5 space-y-3">
              {SITE_ESSENCIAL_WITH_SITE.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] text-white/85"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        O site não substitui suas redes sociais. Ele organiza e fortalece sua
        presença digital.
      </p>
    </SectionContainer>
  );
};
