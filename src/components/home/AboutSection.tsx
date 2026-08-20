import React from "react";
import { MapPin, Instagram } from "lucide-react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { SITE_INFO } from "../../data/siteData";

export const AboutSection: React.FC = () => {
  return (
    <SectionContainer id="sobre" className="atmosphere-section atmosphere-about">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,0.9fr)] lg:items-center lg:gap-16 xl:gap-24">
        <Reveal>
          <div>
            <SectionHeader
              eyebrow="Sobre a agência"
              title="Criatividade, estratégia e tecnologia no mesmo lugar."
              description="A Agência Mello ajuda pequenos negócios, artistas e marcas a construírem uma presença à altura do trabalho que entregam."
              className="about-section__header"
            />

            <p className="about-section__body mt-5 max-w-2xl text-base leading-relaxed sm:text-[17px]">
              Design e desenvolvimento com atendimento direto, ágil e sem
              burocracia.
            </p>

            <ul className="about-section__meta mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>Rio de Janeiro • Atendimento presencial e online</span>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <a
                href={SITE_INFO.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="about-section__instagram inline-flex min-h-11 items-center gap-2 text-[15px] underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Instagram className="h-4 w-4 text-accent" aria-hidden="true" />
                <span>Instagram {SITE_INFO.instagram.handle}</span>
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="about-founder mx-auto w-[min(82vw,22rem)] lg:ml-auto lg:mr-0 lg:w-full lg:max-w-[22rem]">
            <div className="about-founder__portrait relative aspect-[4/5] overflow-hidden">
              <img
                src="/assets/matheus-mello.jpg"
                alt="Matheus Mello — Fundador da Agência Mello"
                width={800}
                height={900}
                loading="lazy"
                className="about-founder__image h-full w-full object-cover"
              />
            </div>

            <div className="mt-5 text-center lg:text-left">
              <p className="about-founder__name text-sm font-semibold">
                {SITE_INFO.founder}
              </p>
              <p className="about-founder__copy mt-1 text-sm">
                Designer, desenvolvedor e fundador da Agência Mello.
              </p>
              <p className="about-founder__copy mt-2 text-sm leading-relaxed">
                Une design e tecnologia para criar marcas, sites e experiências
                digitais.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
};
