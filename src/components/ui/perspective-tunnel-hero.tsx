"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import './perspective-tunnel-hero.css';

interface TunnelImage { src: string; title: string; width: number; height: number }
interface TunnelCardProps {
  item: TunnelImage;
  index: number;
  total: number;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  stage: { width: number; height: number };
}

function TunnelCard({ item, index, total, progress, pointer, stage }: TunnelCardProps) {
  // Preserve the reference's golden-angle placement, depth range and stagger.
  const angle = index * 137.5 * Math.PI / 180;
  const start = (index / total) * .45;
  const localProgress = useTransform(progress, [start, start + .55], [0, 1]);
  const z = useTransform(localProgress, [0, 1], [-1700, 500]);
  const opacity = useTransform(localProgress, [0, .18, .82, .98], [0, 1, 1, 0]);
  const width = Math.max(180, Math.min(270, stage.width * .18));
  const baseX = Math.cos(angle) * stage.width * (.28 + (index % 3) * .08);
  const baseY = Math.sin(angle) * stage.height * (.26 + (index % 2) * .09);
  const rotation = (index % 2 === 0 ? 1 : -1) * (3 + (index % 5) * 2);
  const transform = useTransform([z, pointer.x, pointer.y], ([depth, px, py]: number[]) =>
    `translate3d(calc(-50% + ${baseX - px * 45}px), calc(-50% + ${baseY - py * 45}px), ${depth}px) rotateZ(${rotation}deg)`);

  return <motion.div className="tunnel-card" style={{ width, transform, opacity, zIndex: index + 1 }}>
    <img src={item.src} alt="" width={item.width} height={item.height} draggable={false} loading="lazy" decoding="async"/>
    <span>{item.title}</span>
  </motion.div>;
}

export default function PerspectiveTunnelHero({ images }: { images: readonly TunnelImage[] }) {
  const track = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ width: 1440, height: 812 });
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 88px', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: .0001 });
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const pointer = {
    x: useSpring(rawX, { stiffness: 60, damping: 25, mass: .5 }),
    y: useSpring(rawY, { stiffness: 60, damping: 25, mass: .5 }),
  };
  const titleScale = useTransform(progress, [0, .5, 1], [.7, 1, 1.35]);
  const titleOpacity = useTransform(progress, [0, .12, .85, 1], [.25, 1, 1, 0]);
  const promptOpacity = useTransform(progress, [0, .12], [1, 0]);
  // Two passes of the same four supplied works form the corridor, not extra projects.
  const cards = [...images, ...images];

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () => setStage({ width: element.clientWidth, height: element.clientHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    const move = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      rawX.set(((event.clientX - bounds.left) / bounds.width - .5) * 2);
      rawY.set(((event.clientY - bounds.top) / bounds.height - .5) * 2);
    };
    const reset = () => { rawX.set(0); rawY.set(0); };
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', reset);
    return () => {
      observer.disconnect();
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', reset);
    };
  }, [rawX, rawY]);

  return <div className="perspective-tunnel" ref={track}>
    <div className="tunnel-viewport" ref={viewport}>
      <div className="tunnel-scene" aria-hidden="true">
        <div className="tunnel-grid"/>
        <div className="tunnel-ring tunnel-ring-inner"/><div className="tunnel-ring tunnel-ring-outer"/>
        <motion.div className="tunnel-title" style={{ scale: titleScale, opacity: titleOpacity }}>
          <p>Design para eventos</p>
          <div>Sua arte.<br/><span>Em cena.</span></div>
        </motion.div>
        <div className="tunnel-plane">
          {cards.map((item, index) => <div className="tunnel-orbit" key={`${item.src}-${index}`}>
            <TunnelCard item={item} index={index} total={cards.length} progress={progress} pointer={pointer} stage={stage}/>
          </div>)}
        </div>
        <motion.div className="tunnel-prompt" style={{ opacity: promptOpacity }}>Role para explorar <span>↓</span></motion.div>
      </div>
      <a href="#eventos-galeria" className="tunnel-skip">Ver todas as artes <span aria-hidden="true">↘</span></a>
    </div>
  </div>;
}
