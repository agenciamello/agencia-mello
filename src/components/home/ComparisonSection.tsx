import React from "react";
import { X, Check } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { COMPARISON_NO_NEED, COMPARISON_YOU_GET } from "../../data/siteData";

export const ComparisonSection: React.FC = () => {
  return (
    <SectionContainer surface>
      <SectionHeader
        eyebrow="Sem complicação"
        title="Design profissional sem processo burocrático"
        description="Você não precisa de uma estrutura de agência grande para apresentar seu negócio com qualidade."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {/* Left Column: What you don't need */}
        <Reveal>
          <div className="h-full rounded-2xl border border-white/[0.06] bg-background/40 p-7 sm:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Você não precisa de
            </h3>
            <ul className="mt-6 space-y-4">
              {COMPARISON_NO_NEED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/10"
                  >
                    <X className="h-3 w-3 text-white/40" />
                  </span>
                  <span className="line-through decoration-white/20">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Right Column: What you receive */}
        <Reveal delay={90}>
          <div className="h-full rounded-2xl border border-accent/30 bg-background p-7 shadow-[0_0_0_1px_rgba(236,72,153,0.06)] sm:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Você recebe
            </h3>
            <ul className="mt-6 space-y-4">
              {COMPARISON_YOU_GET.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] font-medium text-white"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10"
                  >
                    <Check className="h-3 w-3 text-accent" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
};
