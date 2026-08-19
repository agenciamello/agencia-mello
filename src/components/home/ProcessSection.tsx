import React from "react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { HOME_PROCESS_STEPS } from "../../data/siteData";

export const ProcessSection: React.FC = () => {
  return (
    <SectionContainer id="processo">
      <SectionHeader
        eyebrow="Como trabalhamos"
        title="Um processo simples, do início à entrega"
        description="Sem reuniões intermináveis, etapas confusas ou burocracia desnecessária."
      />

      <div className="relative mt-12">
        {/* Horizontal connecting line on desktop */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-7 hidden h-px w-full bg-gradient-to-r from-white/5 via-white/15 to-white/5 md:block"
        />

        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {HOME_PROCESS_STEPS.map((step, index) => (
            <li key={step.n} className="relative pl-16 md:pl-0">
              {/* Vertical connecting line on mobile */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-7 top-14 h-[calc(100%-1rem)] w-px bg-white/10 md:hidden"
              />

              <Reveal delay={index * 80}>
                <span className="absolute left-0 top-0 z-10 grid h-14 w-14 place-items-center rounded-2xl border border-accent/30 bg-background text-xl font-bold tracking-tight text-accent md:relative md:h-14 md:w-14 shadow-sm">
                  {step.n}
                </span>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-white md:mt-5 md:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {step.text}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </SectionContainer>
  );
};
