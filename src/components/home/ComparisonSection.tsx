import React from "react";
import { Check } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { COMPARISON_YOU_GET } from "../../data/siteData";

export const ComparisonSection: React.FC = () => {
  return (
    <SectionContainer surface className="atmosphere-comparison">
      <SectionHeader
        eyebrow="Sem complicação"
        title="Design profissional sem burocracia."
        description="Ter uma presença profissional não precisa significar processos lentos, confusos ou complicados."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Reveal>
          <div className="flex h-full items-center rounded-2xl border border-white/[0.06] bg-background/40 p-7 sm:p-8">
            <h3 className="text-xl font-semibold leading-relaxed text-white sm:text-2xl">
              Seu cliente não precisa entender de design.
              <br />
              Ele precisa sentir confiança.
            </h3>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="h-full rounded-2xl border border-accent/30 bg-background p-7 shadow-[0_0_0_1px_rgba(236,72,153,0.06)] sm:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Com a Mello, você tem:
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
