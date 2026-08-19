import React from "react";
import { MessageCircle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import {
  SITE_ESSENCIAL_PRICE,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const SiteEssencialPricingSection: React.FC = () => {
  return (
    <section id="investimento" className="scroll-mt-24 bg-surface py-16 sm:py-20 lg:py-24 border-y border-white/[0.07]">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-background p-7 sm:p-10 lg:p-14 shadow-2xl">
            {/* Background Radial Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 60% at 85% 10%, rgba(236,72,153,0.16), transparent 70%)",
              }}
            />

            <div className="relative max-w-3xl">
              <Badge>Investimento</Badge>
              <h2 className="mt-4 text-3xl font-bold leading-[1.15] text-white sm:text-4xl">
                Uma presença profissional por um valor acessível
              </h2>

              <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-1">
                <span className="text-4xl font-bold text-accent sm:text-5xl">
                  {SITE_ESSENCIAL_PRICE}
                </span>
                <span className="pb-1 text-[15px] text-muted-foreground">
                  Pagamento em até 3 vezes
                </span>
              </div>

              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
                O formato é produtizado e o escopo é definido. Isso reduz
                reuniões e retrabalho, e permite entregar um site profissional
                por um valor mais acessível.
              </p>

              <div className="mt-8">
                <Button
                  href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.preco)}
                  ariaLabel="Falar no WhatsApp sobre o Site Essencial"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Quero conversar sobre meu site</span>
                </Button>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                Você avalia a prévia antes de assumir qualquer compromisso.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
