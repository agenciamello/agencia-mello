import React from "react";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from "../../data/siteData";

interface FloatingWhatsAppProps {
  customMessage?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ customMessage }) => {
  const message = customMessage || WHATSAPP_MESSAGES.flutuante;

  return (
    <a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a Agência Mello no WhatsApp"
      className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] transition-all duration-200 hover:bg-accent/85 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <MessageCircle className="h-6 w-6" aria-hidden="true" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-white/10 bg-surface px-3 py-1.5 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
        Falar no WhatsApp
      </span>
    </a>
  );
};
