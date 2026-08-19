import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Instagram, MapPin } from "lucide-react";
import { Logo } from "../ui/Logo";
import {
  SITE_INFO,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

const NAV_LINKS = [
  { label: "Início", to: "/" },
  { label: "O que inclui", href: "#incluso" },
  { label: "Exemplos", href: "#exemplos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Investimento", href: "#investimento" },
  { label: "Dúvidas", href: "#duvidas" },
];

export const SiteEssencialFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-surface pb-24 lg:pb-12">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Col 1 */}
          <div>
            <Logo width={128} />
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted-foreground">
              Produto desenvolvido pela Agência Mello.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span>{SITE_INFO.location}</span>
            </div>
          </div>

          {/* Col 2 */}
          <nav aria-label="Links rápidos do Site Essencial">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Navegação
            </h2>
            <ul className="mt-3 space-y-2 text-[14px] text-muted-foreground">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="inline-flex min-h-8 items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="inline-flex min-h-8 items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3 */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white">
              Contato
            </h2>
            <ul className="mt-3 space-y-3 text-[14px] text-muted-foreground">
              <li>
                <a
                  href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.ctaFinal)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-8 items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />
                  <span>WhatsApp {SITE_INFO.whatsappFormatted}</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE_INFO.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-8 items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Instagram className="h-4 w-4 text-accent" aria-hidden="true" />
                  <span>{SITE_INFO.instagram.handle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Subfooter */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.08] pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} {SITE_INFO.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <Link
              to="/politica-de-privacidade"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Política de Privacidade
            </Link>
            <Link
              to="/termos-de-uso"
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
