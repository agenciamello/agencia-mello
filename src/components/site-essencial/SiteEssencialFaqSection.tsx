import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { SITE_ESSENCIAL_FAQS } from "../../data/siteData";

export const SiteEssencialFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <SectionContainer id="duvidas" surface compact>
      <SectionHeader
        eyebrow="Dúvidas frequentes"
        title="Perguntas e respostas sobre o Site Essencial"
        align="center"
      />

      <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-background">
        {SITE_ESSENCIAL_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  aria-controls={`se-faq-panel-${index}`}
                  id={`se-faq-button-${index}`}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-medium text-white transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:px-6"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                </button>
              </h3>
              <div
                id={`se-faq-panel-${index}`}
                role="region"
                aria-labelledby={`se-faq-button-${index}`}
                hidden={!isOpen}
                className="px-5 pb-5 text-[15px] leading-relaxed text-muted-foreground sm:px-6"
              >
                {faq.a}
              </div>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
};
