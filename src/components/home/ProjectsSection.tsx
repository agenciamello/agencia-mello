import React from "react";
import { SectionContainer } from "../ui/SectionContainer";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { Button } from "../ui/Button";
import { PROJECTS_DATA, WHATSAPP_MESSAGES, getWhatsAppUrl } from "../../data/siteData";

export const ProjectsSection: React.FC = () => {
  return (
    <SectionContainer id="projetos" surface className="atmosphere-projects">
      <SectionHeader
        eyebrow="Projetos"
        title="Design que transforma percepção"
        description="Projetos conceituais criados para mostrar como trabalhamos com diferentes segmentos, paletas e linguagens visuais."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {PROJECTS_DATA.map((project, index) => (
          <Reveal key={project.name} delay={(index % 2) * 90} className="h-full">
            <article className="group h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-background transition-all duration-300 hover:border-white/20">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={`${project.name} — ${project.category}`}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {project.conceptual && (
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/85 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    Projeto conceitual
                  </span>
                )}
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {project.category}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  {project.name}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-10">
        <Button href={getWhatsAppUrl(WHATSAPP_MESSAGES.projetos)}>
          Quero criar algo assim para o meu negócio
        </Button>
      </div>
    </SectionContainer>
  );
};
