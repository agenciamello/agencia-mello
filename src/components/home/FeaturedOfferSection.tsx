import React from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import {
  HOME_SITE_ESSENCIAL_BENEFITS,
  HOME_SITE_ESSENCIAL_INSTALLMENTS,
  SITE_ESSENCIAL_PRICE,
  WHATSAPP_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const FeaturedOfferSection: React.FC = () => {
  return (
    <section className="atmosphere-featured relative isolate overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface p-7 sm:p-10 lg:p-14 shadow-2xl">
            {/* Low-intensity color response inside the offer surface */}
            <div
              aria-hidden="true"
              className="atmosphere-featured-card pointer-events-none absolute inset-0 -z-10"
            />

            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
              <div>
                <Badge>Destaque</Badge>
                <h2 className="mt-4 text-2xl font-bold leading-[1.2] text-white sm:text-3xl lg:text-4xl">
                  Veja o site da sua empresa antes de pagar por ele.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
                  Uma presença profissional não precisa começar com um projeto
                  caro ou complicado.
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span className="text-4xl font-bold text-accent sm:text-5xl">
                    {SITE_ESSENCIAL_PRICE}
                  </span>
                  <span className="pb-1 text-[15px] text-muted-foreground">
                    {HOME_SITE_ESSENCIAL_INSTALLMENTS}
                  </span>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    href={getWhatsAppUrl(WHATSAPP_MESSAGES.destaque)}
                    className="group"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Quero ver uma prévia</span>
                  </Button>
                  <Button to="/site-essencial" variant="secondary">
                    Como funciona?
                  </Button>
                </div>

                <ul className="mt-5 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                  {HOME_SITE_ESSENCIAL_BENEFITS.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </div>

              {/* Demo preview image */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background">
                <img
                  src="/assets/site-essencial-preview.jpg"
                  alt="Exemplo demonstrativo de site de uma página para um negócio local, exibido em notebook e celular"
                  width={1280}
                  height={1024}
                  loading="lazy"
                  className="h-auto w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/85 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  Exemplo demonstrativo
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
