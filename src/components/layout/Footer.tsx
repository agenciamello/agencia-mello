import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Instagram, MapPin } from "lucide-react";
import { Logo } from "../ui/Logo";
import {
  SITE_INFO,
  MAIN_NAV_LINKS,
  FOOTER_SERVICES_LINKS,
  WHATSAPP_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.07] bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            <Logo width={150} />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              Design e tecnologia para negócios que querem transmitir mais valor.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              <span>{SITE_INFO.location}</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <nav aria-label="Navegação do rodapé">
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Navegação
            </h2>
            <ul className="mt-4 space-y-2">
              {MAIN_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="inline-flex min-h-9 items-center text-[15px] text-muted-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="inline-flex min-h-9 items-center text-[15px] text-muted-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3: Services */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Serviços
            </h2>
            <ul className="mt-4 space-y-2">
              {FOOTER_SERVICES_LINKS.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="inline-flex min-h-9 items-center text-[15px] text-muted-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-9 items-center text-[15px] text-muted-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Contato
            </h2>
            <ul className="mt-4 space-y-3 text-[15px] text-muted-foreground">
              <li>
                <a
                  href={getWhatsAppUrl(WHATSAPP_MESSAGES.final)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
                  className="inline-flex min-h-9 items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Instagram className="h-4 w-4 text-accent" aria-hidden="true" />
                  <span>{SITE_INFO.instagram.handle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Subfooter */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} {SITE_INFO.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
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
