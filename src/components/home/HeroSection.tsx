import React, { useState, useEffect } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "../ui/Button";
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from "../../data/siteData";

const KICKER_MESSAGES = [
  "DESIGN E TECNOLOGIA PARA NEGÓCIOS REAIS",
  "PRESENÇA DIGITAL QUE TRANSMITE MAIS VALOR",
  "SUA EMPRESA BOA. SUA IMAGEM À ALTURA.",
  "SITES • BRANDING • CONTEÚDO",
];

const ROTATION_INTERVAL_MS = 3500;
const TRANSITION_DURATION_S = 0.4;
const EASING = [0.16, 1, 0.3, 1] as const;

export const HeroSection: React.FC = () => {
  const [kickerIndex, setKickerIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setKickerIndex((prev) => (prev + 1) % KICKER_MESSAGES.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="inicio"
      className="relative isolate scroll-mt-24 overflow-hidden bg-background"
    >
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 75% 25%, rgba(236,72,153,0.16), transparent 70%), radial-gradient(50% 45% at 10% 10%, rgba(124,58,237,0.12), transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-28 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:pb-24 lg:pt-36">
        <div>
          {/* Rotating Kicker Badge */}
          <div className="inline-flex h-8 items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-[10.5px] font-medium uppercase tracking-[0.11em] text-accent backdrop-blur-sm sm:h-8 sm:px-4 sm:text-xs sm:tracking-[0.14em]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={kickerIndex}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 6, filter: "blur(2px)" }
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: -6, filter: "blur(2px)" }
                }
                transition={{
                  duration: TRANSITION_DURATION_S,
                  ease: EASING,
                }}
                className="inline-block whitespace-nowrap"
              >
                {KICKER_MESSAGES[kickerIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          <h1 className="mt-5 text-[1.75rem] font-bold leading-[1.15] text-white [text-wrap:balance] sm:text-[2.75rem] sm:leading-[1.1] lg:text-[3.25rem]">
            Seu negócio já é bom. A gente faz ele parecer tão{" "}
            <span className="text-accent">profissional</span> quanto realmente é.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            Criamos sites, identidades visuais e conteúdos estratégicos para
            pequenos negócios, artistas e empresas locais que querem crescer com
            uma presença mais forte.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href="#servicos" className="group">
              <span>Conhecer nossos serviços</span>
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
            <Button
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.hero)}
              variant="secondary"
            >
              <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />
              <span>Falar no WhatsApp</span>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Atendimento no Rio de Janeiro e online para todo o Brasil.
          </p>
        </div>

        {/* Hero Image Showcase */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl">
            <img
              src="/assets/hero-composition.webp"
              alt="Composição com site em desktop, versão mobile, paleta de identidade visual e post para redes sociais criados pela Agência Mello"
              width={1280}
              height={1024}
              loading="eager"
              decoding="async"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
