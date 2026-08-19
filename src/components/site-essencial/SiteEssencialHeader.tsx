import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import {
  SITE_ESSENCIAL_NAV_LINKS,
  SITE_ESSENCIAL_MESSAGES,
  getWhatsAppUrl,
} from "../../data/siteData";

export const SiteEssencialHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex min-h-11 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Agência Mello — ir para a página inicial"
        >
          <Logo width={124} />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Navegação da página" className="hidden items-center gap-6 lg:flex">
          {SITE_ESSENCIAL_NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="inline-flex min-h-11 items-center text-[15px] text-muted-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop WhatsApp CTA */}
        <div className="hidden lg:block">
          <Button
            href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.header)}
            size="sm"
            className="px-5 py-2.5"
            ariaLabel="Falar no WhatsApp para pedir uma prévia do Site Essencial"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Pedir prévia</span>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="se-mobile-nav"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          id="se-mobile-nav"
          className="border-t border-white/[0.08] bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Navegação mobile" className="mx-auto max-w-6xl px-5 py-4 sm:px-6">
            <ul className="flex flex-col space-y-1">
              {SITE_ESSENCIAL_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-11 items-center rounded-lg px-3 text-base text-white/90 transition-colors hover:bg-white/5 hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-white/10">
              <Button
                href={getWhatsAppUrl(SITE_ESSENCIAL_MESSAGES.header)}
                className="w-full justify-center"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Pedir prévia</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
