"use client";

import { AnimatePresence, motion, type Transition, type Variants } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { TEXT_MOTION } from '../../lib/motion-tokens';
import './text-reveal.css';

export type TextRevealPreset = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';
export type TextRevealPer = 'word' | 'char' | 'line';
export type TextRevealProps = {
  children: string;
  per?: TextRevealPer;
  as?: keyof HTMLElementTagNameMap;
  id?: string;
  variants?: {container?: Variants; item?: Variants};
  className?: string;
  preset?: TextRevealPreset;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  trigger?: boolean;
  startOnView?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
};

const containerVariants: Variants = {
  hidden: {opacity:1},
  visible: {opacity:1},
  exit: {opacity:0},
};
const presetVariants: Record<TextRevealPreset, Variants> = {
  blur: {hidden:{filter:`blur(${TEXT_MOTION.blur}px)`,opacity:0},visible:{filter:'blur(0px)',opacity:1},exit:{filter:`blur(${TEXT_MOTION.blur}px)`,opacity:0}},
  'fade-in-blur': {hidden:{filter:`blur(${TEXT_MOTION.blur}px)`,opacity:0,y:TEXT_MOTION.distance},visible:{filter:'blur(0px)',opacity:1,y:0},exit:{filter:`blur(${TEXT_MOTION.blur}px)`,opacity:0,y:TEXT_MOTION.distance}},
  scale: {hidden:{opacity:0,scale:0},visible:{opacity:1,scale:1},exit:{opacity:0,scale:0}},
  fade: {hidden:{opacity:0},visible:{opacity:1},exit:{opacity:0}},
  slide: {hidden:{opacity:0,y:TEXT_MOTION.distance},visible:{opacity:1,y:0},exit:{opacity:0,y:TEXT_MOTION.distance}},
};
const positive = (value:number) => Number.isFinite(value) && value>0 ? value : 1;

function SegmentItem({segment,per,variants,wrapperClassName}:{segment:string;per:TextRevealPer;variants:Variants;wrapperClassName?:string}) {
  if (per!=='line' && /^\s+$/u.test(segment)) return <span className="text-reveal-whitespace">{segment}</span>;
  const content=per==='char'
    ? <span className="text-reveal-word">{Array.from(segment).map((char,index)=><motion.span key={index} data-text-segment className="text-reveal-segment" variants={variants}>{char}</motion.span>)}</span>
    : <motion.span data-text-segment className={per==='line'?'text-reveal-segment text-reveal-line':'text-reveal-segment text-reveal-word'} variants={variants}>{segment || '\u00a0'}</motion.span>;
  return wrapperClassName ? <span className={[per==='line'?'text-reveal-line':'text-reveal-word',wrapperClassName].join(' ')}>{content}</span> : content;
}

export function TextReveal({children,per='word',as='p',id,variants,className,preset='fade',delay=0,speedReveal=1,speedSegment=1,trigger=true,startOnView=true,onAnimationComplete,onAnimationStart,segmentWrapperClassName,containerTransition,segmentTransition,style}:TextRevealProps) {
  const root=useRef<HTMLElement|null>(null);
  const [mounted,setMounted]=useState(false);
  const [reduced,setReduced]=useState(()=>typeof window!=='undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [entered,setEntered]=useState(!startOnView || reduced);
  const [complete,setComplete]=useState(false);
  const [skipInitial,setSkipInitial]=useState(reduced);

  useEffect(()=>{
    setMounted(true);
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches);
    update();
    media.addEventListener('change',update);
    return ()=>media.removeEventListener('change',update);
  },[]);

  useEffect(()=>{setComplete(false);},[children,per,preset]);
  useEffect(()=>{
    if(reduced){setSkipInitial(true);setComplete(true);}
    else if(!trigger){setSkipInitial(false);setComplete(false);if(startOnView)setEntered(false);}
  },[reduced,trigger,startOnView]);

  useEffect(()=>{
    if (reduced || !startOnView) {setEntered(true);return;}
    if (!mounted || !trigger || entered) return;
    const element=root.current;
    if (!element) return;
    if (typeof IntersectionObserver==='undefined') {setEntered(true);return;}
    const observer=new IntersectionObserver(entries=>{
      if (entries.some(entry=>entry.isIntersecting && entry.intersectionRatio>=TEXT_MOTION.viewportAmount)) {
        setEntered(true);
        observer.disconnect();
      }
    },{threshold:TEXT_MOTION.viewportAmount,rootMargin:TEXT_MOTION.viewportMargin});
    observer.observe(element);
    return ()=>observer.disconnect();
  },[mounted,reduced,startOnView,trigger,entered]);

  const classes=['text-reveal',className].filter(Boolean).join(' ');
  // Static first output is SSR-safe and remains immediately readable with reduced motion.
  if (!mounted || reduced) {
    const StaticTag=as as any;
    return trigger ? <StaticTag id={id} className={classes} style={{whiteSpace:'pre-line',...style}} data-reveal-state="static">{children}</StaticTag> : null;
  }
  const MotionTag=motion[as as keyof typeof motion] as typeof motion.div;
  const base=presetVariants[preset] || presetVariants.fade;
  const stagger=TEXT_MOTION.stagger[per]/positive(speedReveal);
  const containerVars:Variants={...containerVariants,visible:{opacity:1,transition:{delayChildren:Number.isFinite(delay)?Math.max(0,delay):0,staggerChildren:stagger,...containerTransition}},...variants?.container};
  const itemVars:Variants={...base,visible:{...(base.visible as object),transition:{duration:TEXT_MOTION.duration/positive(speedSegment),ease:TEXT_MOTION.ease,...segmentTransition}},...variants?.item};
  const segments=per==='line' ? children.split('\n') : children.split(/(\s+)/u).filter(Boolean);

  return <AnimatePresence mode="popLayout">
    {trigger && <MotionTag key={children} ref={root as any} id={id} className={classes} style={style} initial={skipInitial?false:'hidden'} animate={entered?'visible':'hidden'} exit="exit" variants={containerVars} data-reveal-state={complete?'complete':entered?'revealing':'waiting'}
      onAnimationStart={definition=>{if(definition==='visible') onAnimationStart?.();}}
      onAnimationComplete={definition=>{if(definition==='visible'){setComplete(true);onAnimationComplete?.();}}}>
      <span className="sr-only text-reveal-accessible">{children}</span>
      <span aria-hidden="true" className="text-reveal-visual">{segments.map((segment,index)=><span key={`${per}-${index}-${segment}`} className="text-reveal-part"><SegmentItem segment={segment} per={per} variants={itemVars} wrapperClassName={segmentWrapperClassName}/></span>)}</span>
    </MotionTag>}
  </AnimatePresence>;
}

export default TextReveal;
