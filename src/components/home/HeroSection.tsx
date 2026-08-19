import React, { useState, useEffect } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "../ui/Button";
import { WHATSAPP_MESSAGES, getWhatsAppUrl } from "../../data/siteData";
import { PrismatrixHero } from "./PrismatrixHero";

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
      className="relative isolate min-h-[100svh] scroll-mt-24 overflow-hidden bg-[#050505]"
    >
      <PrismatrixHero />
      <div
        aria-hidden="true"
        className="atmosphere-hero pointer-events-none absolute inset-0 z-[1]"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] items-start px-5 pb-12 pt-28 sm:px-6 min-[769px]:px-[5vw] min-[769px]:pb-[3.75rem] min-[769px]:pt-[clamp(7rem,13vh,9.375rem)] xl:px-20">
        <div className="w-full max-w-[760px] min-[769px]:w-[53%]" data-hero-copy>
          {/* Rotating Kicker Badge */}
          <div className="inline-flex h-8 items-center overflow-hidden text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9d7aff] min-[769px]:text-[11px] min-[769px]:tracking-[0.18em]">
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

          <h1 className="mt-5 max-w-[760px] text-[clamp(1.75rem,7.8vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white min-[769px]:text-[clamp(2.375rem,4.15vw,4.4375rem)] min-[769px]:leading-[1.08]">
            Seu negócio já é bom.
            <br />
            A gente faz ele parecer
            <br />
            tão <span className="text-accent">profissional</span> quanto
            <br />
            realmente é.
          </h1>
          <p className="mt-6 max-w-[430px] text-[13.5px] leading-[1.5] text-muted-foreground min-[769px]:text-[15px] min-[769px]:leading-[1.6]">
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
      </div>
    </section>
  );
};
