import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from "../../data/siteData";

export const CtaSection: React.FC = () => {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 0%, rgba(236,72,153,0.14), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-6 lg:py-28">
        <h2 className="text-[1.75rem] font-bold leading-[1.15] text-white [text-wrap:balance] sm:text-4xl">
          Seu negócio já faz um bom trabalho. Vamos fazer mais pessoas perceberem isso.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
          Conte para a Agência Mello o que você precisa e descubra qual solução
          faz mais sentido para o seu momento.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={getWhatsAppUrl(WHATSAPP_MESSAGES.final)}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Falar sobre meu projeto</span>
          </Button>
          <Button href="#servicos" variant="secondary">
            Conhecer nossos serviços
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Atendimento direto e sem compromisso.
        </p>
      </div>
    </section>
  );
};
