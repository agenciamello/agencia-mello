import React from "react";
import { MessageCircle, Sparkles, Utensils, Calendar, Wrench } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  SITE_ESSENCIAL_PRICE,
  SITE_ESSENCIAL_INSTALLMENTS,
  SITE_ESSENCIAL_TAGS,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

const iconMap = {
  Sparkles,
  Utensils,
  Calendar,
  Wrench,
};

export const SiteEssencialHero: React.FC = () => {
  return (
    <section
      id="inicio"
      className="relative isolate scroll-mt-24 overflow-hidden bg-background"
    >
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 78% 22%, rgba(236,72,153,0.16), transparent 70%), radial-gradient(45% 40% at 8% 8%, rgba(124,58,237,0.10), transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-28 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-36">
        <div>
          <Badge>Site Essencial para negócios locais</Badge>
          <h1 className="mt-5 text-[1.75rem] font-bold leading-[1.15] text-white [text-wrap:balance] sm:text-[2.6rem] sm:leading-[1.1] lg:text-[3.1rem]">
            Veja o site da sua empresa{" "}
            <span className="text-accent">antes de pagar</span> por ele.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            Criamos uma prévia personalizada e privada para o seu negócio. Você
            avalia primeiro e só paga se decidir publicar.
          </p>

          <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-4xl font-bold text-accent sm:text-5xl">
              {SITE_ESSENCIAL_PRICE}
            </span>
            <span className="pb-1 text-[15px] text-muted-foreground">
              {SITE_ESSENCIAL_INSTALLMENTS}
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.hero)}
              ariaLabel="Falar no WhatsApp para ver uma prévia do Site Essencial"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Quero ver uma prévia</span>
            </Button>
            <Button href="#incluso" variant="secondary">
              Ver o que está incluso
            </Button>
          </div>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            A prévia é gratuita e privada. Se você aprovar, confirmamos a
            contratação, realizamos os ajustes previstos e publicamos o site.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted-foreground">
            Produto com formato e escopo definidos.
          </p>
        </div>

        {/* Hero Visual Mockup */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl">
            <img
              src="/assets/demo-hero-local.jpg"
              alt="Prévia demonstrativa de um site de uma página para um negócio local de serviços, exibido em monitor e celular, com botão de WhatsApp, serviços e informações de contato"
              width={1280}
              height={1024}
              loading="eager"
              decoding="async"
              className="h-auto w-full object-cover"
            />
            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/85 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              Projeto demonstrativo
            </span>
          </div>

          {/* Segment Tags */}
          <ul className="mt-4 flex flex-wrap gap-2">
            {SITE_ESSENCIAL_TAGS.map((tag) => {
              const Icon = iconMap[tag.iconName as keyof typeof iconMap] || Sparkles;
              return (
                <li
                  key={tag.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-3 py-1.5 text-[13px] text-white/80"
                >
                  <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <span>{tag.label}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            O mesmo formato é adaptado a diferentes segmentos.
          </p>
        </div>
      </div>
    </section>
  );
};
