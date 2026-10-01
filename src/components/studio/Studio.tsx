import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_INFO, SITE_ESSENCIAL_MESSAGES, WHATSAPP_MESSAGES, getWhatsAppUrl } from '../../data/siteData';
import { SEO_SITE, buildStructuredData, getSeoForPath } from '../../data/seoRoutes.js';
import '../../studio.css';
import '../../experience.css';
import { ContactIntent } from './ContactIntent';
import { ChapterNavigation } from './ChapterNavigation';
import { useStudioMotion } from './StudioMotion';
export function usePageTitle(title: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = getSeoForPath(pathname, title);

    const upsertMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const upsertLink = (selector: string, rel: string, href: string, extras: Record<string,string> = {}) => {
      let element = document.head.querySelector<HTMLLinkElement>(selector);
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
      Object.entries(extras).forEach(([key,value]) => element?.setAttribute(key,value));
    };

    document.title = seo.title;
    document.documentElement.lang = SEO_SITE.language;

    upsertMeta('meta[name="description"]','name','description',seo.description);
    upsertMeta('meta[name="robots"]','name','robots',seo.robots);
    upsertMeta('meta[name="googlebot"]','name','googlebot',seo.robots);
    upsertMeta('meta[property="og:title"]','property','og:title',seo.title);
    upsertMeta('meta[property="og:description"]','property','og:description',seo.description);
    upsertMeta('meta[property="og:type"]','property','og:type',seo.type);
    upsertMeta('meta[property="og:url"]','property','og:url',seo.canonical);
    upsertMeta('meta[property="og:image"]','property','og:image',seo.image);
    upsertMeta('meta[property="og:image:alt"]','property','og:image:alt',seo.imageAlt);
    upsertMeta('meta[name="twitter:title"]','name','twitter:title',seo.title);
    upsertMeta('meta[name="twitter:description"]','name','twitter:description',seo.description);
    upsertMeta('meta[name="twitter:image"]','name','twitter:image',seo.image);
    upsertMeta('meta[name="twitter:image:alt"]','name','twitter:image:alt',seo.imageAlt);

    upsertLink('link[rel="canonical"]','canonical',seo.canonical);
    upsertLink('link[rel="alternate"][hreflang="pt-BR"]','alternate',seo.canonical,{hreflang:'pt-BR'});
    upsertLink('link[rel="alternate"][hreflang="x-default"]','alternate',seo.canonical,{hreflang:'x-default'});

    let jsonLd = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]');
    const structuredData = buildStructuredData(pathname,title);
    if (structuredData && !Array.isArray(structuredData)) {
      if (!jsonLd) {
        jsonLd = document.createElement('script');
        jsonLd.type = 'application/ld+json';
        jsonLd.dataset.seoJsonld = 'true';
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify(structuredData);
    } else {
      jsonLd?.remove();
    }
  }, [title, pathname]);
}
export function SectionLabel({ number, children }: {number: string; children: React.ReactNode}) { return <p className="section-label"><span>{number} /</span>{children}</p>; }
export function ContactLink({children, className = '', messageKey = 'final', label}: {children: React.ReactNode; className?: string; messageKey?: string; label?: string}) {
  const { pathname } = useLocation();
  const pageMessage = pathname === '/site-essencial' ? SITE_ESSENCIAL_MESSAGES[messageKey as keyof typeof SITE_ESSENCIAL_MESSAGES] : undefined;
  return <a href={getWhatsAppUrl(pageMessage || WHATSAPP_MESSAGES[messageKey as keyof typeof WHATSAPP_MESSAGES] || WHATSAPP_MESSAGES.final)} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>{children}</a>;
}

function FloatingWhatsApp({ pathname }: { pathname: string }) {
  const [pastIntro,setPastIntro] = useState(false);
  const [contactInView,setContactInView] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = pathname === '/' ? document.querySelector<HTMLElement>('.experience-hero') : null;
      const threshold = hero ? hero.getBoundingClientRect().bottom + window.scrollY - 24 : 320;
      const contact = document.querySelector<HTMLElement>('.studio-contact');
      const contactRect = contact?.getBoundingClientRect();
      setPastIntro(window.scrollY > threshold);
      setContactInView(Boolean(contactRect && contactRect.top < window.innerHeight * .92 && contactRect.bottom > window.innerHeight * .08));
    };
    update();
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update);
    return () => {
      window.removeEventListener('scroll',update);
      window.removeEventListener('resize',update);
    };
  },[pathname]);

  const visible = pastIntro && !contactInView;
  return <ContactLink
    messageKey="flutuante"
    className={visible ? 'whatsapp-float is-visible' : 'whatsapp-float'}
    label="Falar com a Agência Mello no WhatsApp"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.5 3.5A11.78 11.78 0 0 0 12.1 0C5.55 0 .22 5.25.22 11.7c0 2.06.55 4.08 1.6 5.85L0 24l6.6-1.72a12 12 0 0 0 5.49 1.38h.01c6.55 0 11.88-5.25 11.88-11.7 0-3.13-1.24-6.08-3.48-8.46Zm-8.4 18.18h-.01a9.96 9.96 0 0 1-5.08-1.37l-.36-.21-3.92 1.02 1.05-3.76-.23-.38a9.65 9.65 0 0 1-1.5-5.28c0-5.37 4.5-9.74 10.05-9.74 2.68 0 5.2 1.03 7.1 2.9a9.58 9.58 0 0 1 2.94 6.9c0 5.37-4.5 9.74-10.04 9.74Zm5.5-7.28c-.3-.15-1.79-.87-2.07-.97-.28-.1-.48-.15-.68.15-.2.29-.78.97-.96 1.16-.18.2-.35.22-.65.07-.3-.15-1.28-.46-2.43-1.48-.9-.78-1.5-1.75-1.68-2.04-.18-.3-.02-.45.13-.6.14-.13.3-.34.45-.51.15-.17.2-.3.3-.49.1-.2.05-.37-.03-.52-.07-.14-.68-1.6-.93-2.2-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.07-.8.37-.28.29-1.06 1.02-1.06 2.5 0 1.47 1.1 2.9 1.25 3.1.15.2 2.16 3.24 5.23 4.54.73.31 1.3.5 1.74.64.73.23 1.4.2 1.92.12.59-.09 1.79-.72 2.04-1.41.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.34Z"/>
    </svg>
  </ContactLink>;
}
export function StudioShell({ children, contact = true }: {children: React.ReactNode; contact?: boolean}) {
  const [open,setOpen] = useState(false); const location = useLocation(); const toggle = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useStudioMotion(root, location.pathname);
  useEffect(() => { setOpen(false); },[location.pathname,location.hash]);
  useEffect(() => {const close=(event:KeyboardEvent)=>{if(event.key==='Escape' && open){setOpen(false);toggle.current?.focus();}};window.addEventListener('keydown',close);return ()=>window.removeEventListener('keydown',close);},[open]);
  return <div className="studio" ref={root}><a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
    <header className="studio-header"><div className="reading-progress" aria-hidden="true"/><div className="wrap header-inner"><Link to="/" aria-label="Agência Mello — início" className="studio-wordmark"><img src="/assets/agencia-mello-logo.png" alt="Agência Mello" width="803" height="289"/></Link>
    <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="studio-nav" onClick={()=>setOpen(!open)}>{open?'Fechar −':'Menu +'}</button>
    <nav onClick={(event)=>{if((event.target as HTMLElement).closest('a'))setOpen(false);}} id="studio-nav" className={open?'studio-nav is-open':'studio-nav'} aria-label="Navegação principal"><Link to="/#projetos">Projetos</Link><Link to="/#servicos">O que fazemos</Link><Link to="/site-essencial">Site Essencial</Link><Link to="/#sobre">A Mello</Link><ContactLink messageKey="header" className="nav-contact">Quero meu site pronto <span aria-hidden="true">↗</span></ContactLink></nav></div></header>
    {location.pathname === '/' && <ChapterNavigation/>}<main id="conteudo" tabIndex={-1}>{children}</main>
    {contact && <section id="contato" className="studio-contact"><div className="wrap"><SectionLabel number="05">Bora conversar</SectionLabel><div className="contact-composition"><h2 className="contact-title"><b className="contact-line"><b>Bora ver como</b></b><b className="contact-line"><b>seu site</b></b><b className="contact-line"><b><em>ficaria?</em></b></b></h2><img className="contact-mark" src="/assets/agencia-mello-icone.png" alt="" width="292" height="289" loading="lazy" aria-hidden="true"/></div><ContactIntent/><div className="contact-bottom"><p>Nosso número no WhatsApp</p><ContactLink messageKey="flutuante" className="text-link" label="Abrir conversa com Matheus Mello no WhatsApp">{SITE_INFO.whatsappFormatted}</ContactLink></div></div></section>}
    <FloatingWhatsApp pathname={location.pathname}/>
    <footer className="studio-footer wrap"><div className="footer-signature" aria-hidden="true"><img src="/assets/agencia-mello-logo.png" alt="" width="803" height="289" loading="lazy"/><span>Sua presença online<br/>à altura do seu trabalho.</span></div><div><Link to="/" className="footer-brand"><img src="/assets/agencia-mello-logo.png" alt="Agência Mello — início" width="803" height="289" loading="lazy"/></Link><span>Rio de Janeiro, Brasil.<br/>Online pra todo o Brasil.</span></div><div className="footer-links"><a href={SITE_INFO.instagram.url} target="_blank" rel="noreferrer">Instagram ↗</a><Link to="/site-essencial">Site Essencial</Link><Link to="/politica-de-privacidade">Privacidade</Link><Link to="/termos-de-uso">Termos de uso</Link></div><p>© {new Date().getFullYear()} Agência Mello</p></footer>
  </div>;
}
