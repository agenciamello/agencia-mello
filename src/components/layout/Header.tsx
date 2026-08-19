import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Button } from "../ui/Button";
import { MAIN_NAV_LINKS, WHATSAPP_MESSAGES, getWhatsAppUrl } from "../../data/siteData";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled || mobileMenuOpen
          ? "border-b border-white/[0.07] bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex min-h-11 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Agência Mello — ir para o início"
        >
          <Logo width={132} />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Navegação principal" className="hidden items-center gap-7 lg:flex">
          {MAIN_NAV_LINKS.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className="rounded text-sm text-muted-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="rounded text-sm text-muted-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button
            href={getWhatsAppUrl(WHATSAPP_MESSAGES.header)}
            size="sm"
            className="px-5 py-2.5 text-sm"
          >
            Falar com a Agência
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-controls="menu-mobile"
          aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          id="menu-mobile"
          className="border-t border-white/[0.07] bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Navegação mobile" className="mx-auto max-w-6xl px-5 py-4 sm:px-6">
            <ul className="flex flex-col space-y-1">
              {MAIN_NAV_LINKS.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-11 items-center rounded-lg px-3 text-base text-white/90 transition-colors hover:bg-white/5 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex min-h-11 items-center rounded-lg px-3 text-base text-white/90 transition-colors hover:bg-white/5 hover:text-accent"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-white/10">
              <Button
                href={getWhatsAppUrl(WHATSAPP_MESSAGES.header)}
                className="w-full justify-center text-sm"
              >
                Falar com a Agência
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
