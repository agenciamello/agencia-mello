import React from "react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { SITE_ESSENCIAL_POST_APPROVAL } from "../../data/siteData";

export const SiteEssencialPostApprovalSection: React.FC = () => {
  return (
    <SectionContainer surface compact>
      <SectionHeader
        eyebrow="Transparência"
        title="E depois da aprovação?"
        description="Explicamos todos os passos com clareza para que sua empresa saiba exatamente como funciona após a entrega."
      />

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SITE_ESSENCIAL_POST_APPROVAL.map((item, index) => (
          <Reveal key={item.title} delay={index * 70} className="h-full">
            <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-background p-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        Tudo é informado antes do início da publicação, sem surpresas.
      </p>
    </SectionContainer>
  );
};
