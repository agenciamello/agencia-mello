import React from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import {
  SITE_ESSENCIAL_PRICE,
  SITE_ESSENCIAL_INSTALLMENTS,
  WHATSAPP_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const FeaturedOfferSection: React.FC = () => {
  return (
    <section className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-surface p-7 sm:p-10 lg:p-14 shadow-2xl">
            {/* Background Accent Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(55% 55% at 85% 15%, rgba(236,72,153,0.18), transparent 70%)",
              }}
            />

            <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
              <div>
                <Badge>Destaque</Badge>
                <h2 className="mt-4 text-2xl font-bold leading-[1.2] text-white sm:text-3xl lg:text-4xl">
                  Site Essencial — seu negócio no ar com presença profissional
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
                  Desenvolvemos um site profissional de uma página para a sua
                  empresa por um valor fechado e acessível. Você vê uma prévia
                  antes de pagar.
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-1">
                  <span className="text-4xl font-bold text-accent sm:text-5xl">
                    {SITE_ESSENCIAL_PRICE}
                  </span>
                  <span className="pb-1 text-[15px] text-muted-foreground">
                    {SITE_ESSENCIAL_INSTALLMENTS}
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

                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Produto com escopo definido. Sem pagamento antecipado e sem
                  contrato longo.
                </p>
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
