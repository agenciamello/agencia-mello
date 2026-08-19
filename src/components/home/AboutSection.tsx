import React from "react";
import { MapPin, Monitor, Instagram } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { SITE_INFO } from "../../data/siteData";

export const AboutSection: React.FC = () => {
  return (
    <SectionContainer id="sobre" className="atmosphere-section atmosphere-about">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
        <Reveal>
          <div>
            <SectionHeader
              eyebrow="Sobre a agência"
              title="Criatividade, estratégia e tecnologia no mesmo lugar"
              description="A Agência Mello é um estúdio criativo do Rio de Janeiro que ajuda pequenos negócios, artistas e empresas locais a construírem uma presença mais profissional."
            />

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
              Unimos design, desenvolvimento e visão de marketing para criar
              soluções bonitas, funcionais e alinhadas aos objetivos de cada
              cliente, sem o processo burocrático de grandes agências.
            </p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>{SITE_INFO.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>Atendimento presencial e online</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <a
                href={SITE_INFO.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-[15px] text-white underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Instagram className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>Instagram {SITE_INFO.instagram.handle}</span>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Founder Portrait Card */}
        <Reveal delay={90}>
          <div className="relative mx-auto max-w-md lg:max-w-none">
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
