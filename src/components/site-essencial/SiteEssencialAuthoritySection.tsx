import React from "react";
import { MapPin, Monitor, MessageCircle } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import {
  SITE_INFO,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const SiteEssencialAuthoritySection: React.FC = () => {
  return (
    <SectionContainer compact>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <Reveal>
          <div>
            <SectionHeader
              eyebrow="Quem está por trás"
              title="Design pensado para valorizar o seu trabalho"
              description="O Site Essencial foi criado pelo designer Matheus Mello para oferecer a pequenas empresas e profissionais a mesma qualidade visual de marcas consolidadas."
            />

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              Cada layout é planejado para transmitir credibilidade, organizar
              informações e facilitar o contato pelo WhatsApp.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>{SITE_INFO.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>Atendimento 100% online</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.autoridade)}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Falar com o Matheus no WhatsApp</span>
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Founder Portrait */}
        <Reveal delay={90}>
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-xl">
              <img
                src="/assets/matheus-mello.jpg"
                alt="Matheus Mello — Fundador da Agência Mello"
                width={800}
                height={900}
                loading="lazy"
                className="h-auto w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
              />
              <div className="p-5 border-t border-white/[0.08]">
                <p className="text-base font-semibold text-white">
                  {SITE_INFO.founder}
                </p>
                <p className="text-sm text-muted-foreground">
                  Designer & Desenvolvedor
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
};
