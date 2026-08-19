import React from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  SITE_ESSENCIAL_PRICE,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const SiteEssencialCtaSection: React.FC = () => {
  return (
    <section className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 0%, rgba(236,72,153,0.16), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-3xl px-5 text-center sm:px-6 lg:px-8">
        <Badge>Sem compromisso</Badge>
        <h2 className="mt-4 text-[1.75rem] font-bold leading-[1.15] text-white [text-wrap:balance] sm:text-4xl">
          Quer ver como o seu negócio pode ficar com um site profissional?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
          Envie as informações da sua empresa pelo WhatsApp e receba uma prévia
          demonstrativa personalizada.
        </p>

        <p className="mt-5 text-sm font-medium text-accent">
          {SITE_ESSENCIAL_PRICE} em até 3x
        </p>

        <div className="mt-7 flex justify-center">
          <Button
            href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.ctaFinal)}
            ariaLabel="Falar no WhatsApp para pedir uma prévia do Site Essencial"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Quero ver a prévia do meu site</span>
          </Button>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Você avalia a demonstração sem custo e só decide depois.
        </p>
      </div>
    </section>
  );
};
