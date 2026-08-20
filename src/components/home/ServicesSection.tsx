import React from "react";
import { Globe, Palette, LayoutGrid, Check, ArrowRight } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { SERVICES_DATA, WHATSAPP_MESSAGES, getWhatsAppUrl } from "../../data/siteData";

const iconMap = {
  Globe,
  Palette,
  LayoutGrid,
};

export const ServicesSection: React.FC = () => {
  return (
    <SectionContainer id="servicos">
      <SectionHeader
        eyebrow="O que fazemos"
        title="Soluções visuais e digitais pensadas para o seu momento."
        description="Tudo que seu negócio precisa para se apresentar melhor, transmitir mais valor e vender com mais confiança."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {SERVICES_DATA.map((service, index) => {
          const Icon = iconMap[service.iconName as keyof typeof iconMap] || Globe;
          return (
            <Reveal key={service.title} delay={index * 80} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.08] bg-surface p-7 sm:p-8 transition-colors duration-200 hover:border-white/20">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-[14px] text-white/80"
                      >
                        <Check className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <Button
                    href={getWhatsAppUrl(WHATSAPP_MESSAGES[service.whatsappKey])}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between px-0 text-[14px] font-medium text-white hover:text-accent hover:bg-transparent"
                  >
                    <span>{service.cta}</span>
                    <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionContainer>
  );
};
