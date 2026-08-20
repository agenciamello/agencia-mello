import React from "react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { HOME_PROCESS_STEPS } from "../../data/siteData";

export const ProcessSection: React.FC = () => {
  return (
    <SectionContainer
      id="processo"
      className="atmosphere-process process-section-light"
    >
      <SectionHeader
        eyebrow="Como trabalhamos"
        title="Um processo simples, do início à entrega."
        className="process-section__header"
      />

      <div className="relative mt-12">
        {/* Horizontal connecting line on desktop */}
        <span
          aria-hidden="true"
          className="process-section__line pointer-events-none absolute left-0 top-7 hidden h-px w-full md:block"
        />

        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {HOME_PROCESS_STEPS.map((step, index) => (
            <li key={step.n} className="relative pl-16 md:pl-0">
              {/* Vertical connecting line on mobile */}
              <span
                aria-hidden="true"
                className="process-section__line pointer-events-none absolute left-7 top-14 h-[calc(100%-1rem)] w-px md:hidden"
              />

              <Reveal delay={index * 80} className="relative">
                <span className="process-section__number absolute -left-16 top-0 z-10 grid h-14 w-14 place-items-center rounded-2xl border text-xl font-bold tracking-tight text-accent shadow-sm md:relative md:left-0 md:h-14 md:w-14">
                  {step.n}
                </span>
                <h3 className="process-section__title mt-1 text-lg font-semibold leading-snug md:mt-5 md:text-xl">
                  {step.title}
                </h3>
                <p className="process-section__copy mt-2 text-[15px] leading-relaxed">
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
