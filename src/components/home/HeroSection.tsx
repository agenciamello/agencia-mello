import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "../ui/Button";
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from "../../data/siteData";
import { MelloTubesHero } from "./MelloTubesHero";
import { useHeroMotion } from "../../motion/useHeroMotion";

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
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const visualLayerRef = useRef<HTMLDivElement>(null);

  useHeroMotion({
    sectionRef,
    copyRef,
    backgroundRef,
    visualLayerRef,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setKickerIndex((prev) => (prev + 1) % KICKER_MESSAGES.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="sticky top-0 isolate h-[100svh] min-h-[100svh] scroll-mt-24 overflow-hidden bg-[#050505]"
      data-hero-root
      data-hero-pin
    >
      <div
        ref={visualLayerRef}
        className="pointer-events-auto absolute inset-0 z-0"
        data-hero-visual-layer
      >
        <MelloTubesHero />
      </div>
      <div
        ref={backgroundRef}
        aria-hidden="true"
        className="atmosphere-hero pointer-events-none absolute inset-0 z-[1]"
        data-hero-background-layer
      />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] items-start px-5 pb-10 pt-28 sm:px-6 min-[769px]:items-center min-[769px]:px-[5vw] min-[769px]:pb-[3.25rem] min-[769px]:pt-[clamp(6.5rem,11vh,8rem)] xl:px-20">
        <div
          ref={copyRef}
          className="w-full max-w-[960px] min-[769px]:w-[76%]"
          data-hero-copy-layer
        >
          {/* Rotating Kicker Badge */}
          <div className="hero-uau-badge inline-flex h-8 items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.035] px-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#d7c8ff] backdrop-blur-xl min-[769px]:text-[10px] min-[769px]:tracking-[0.22em]">
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

          <h1 className="hero-uau-title mt-6 max-w-[960px] text-[clamp(2.15rem,9.6vw,3.25rem)] font-bold leading-[0.98] tracking-[-0.055em] text-white/95 min-[769px]:text-[clamp(3.75rem,5.4vw,5.65rem)] min-[769px]:leading-[0.92]">
            Seu negócio já é bom.
            <br />
            A gente faz ele parecer
            <br />
            tão <span className="hero-uau-accent">profissional</span> quanto
            <br />
            realmente é.
          </h1>
          <p className="mt-6 max-w-[560px] text-[13.5px] leading-[1.55] text-white/55 min-[769px]:text-[17px] min-[769px]:leading-[1.6]">
            Sites, identidades visuais e conteúdo para negócios que querem
            transmitir mais valor.
          </p>

          <div className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href="#servicos" className="hero-uau-primary group rounded-full">
              <span>Conhecer nossos serviços</span>
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
            <Button
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.hero)}
              variant="secondary"
              className="hero-uau-secondary rounded-full"
            >
              <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />
              <span>Falar no WhatsApp</span>
            </Button>
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.08em] text-white/40 min-[769px]:text-[13px]">
            Atendimento no Rio de Janeiro e online para todo o Brasil.
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hero-focus-veil pointer-events-none absolute inset-0 z-20"
        data-hero-focus-veil
      />
    </section>
  );
};
