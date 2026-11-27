import React from "react";
import { ArrowLeft, Coffee, MessageCircle } from "lucide-react";
import { StudioShell, usePageTitle } from "../components/studio/Studio";
import { Button } from "../components/ui/Button";
import { getWhatsAppUrl } from "../data/siteData";

const projectMessage = "Oi, Matheus! Vim pela página 404 da Agência Mello e aproveitei para conversar sobre um projeto. Preciso de";

export const NotFoundPage: React.FC = () => {
  usePageTitle("Página não encontrada | Agência Mello");

  return (
    <StudioShell contact={false}>

      <section className="flex min-h-[70svh] items-center justify-center px-5 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto w-full max-w-2xl text-center">
          <div className="inline-flex items-center gap-4 text-accent" aria-hidden="true">
            <span className="text-8xl font-bold leading-none tracking-[-0.08em] sm:text-[10rem]">404</span>
            <Coffee className="h-12 w-12 rotate-12 sm:h-16 sm:w-16" strokeWidth={1.5} />
          </div>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-accent">Página não encontrada</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl">
            Essa página saiu pra tomar um café.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            O endereço que você abriu não existe ou mudou de lugar.
          </p>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/85 sm:text-base">
            Já que você chegou até aqui, que tal tirar seu próximo site ou design do papel?
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button href={getWhatsAppUrl(projectMessage)} className="!text-[#141217]">
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Bora criar meu projeto</span>
            </Button>
            <Button to="/" variant="ghost">
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Voltar pro início</span>
            </Button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Você fala direto com o Matheus, pelo WhatsApp.</p>
        </div>
      </section>
    </StudioShell>
  );
};
