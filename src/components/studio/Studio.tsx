import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_INFO, SITE_ESSENCIAL_MESSAGES, WHATSAPP_MESSAGES, getWhatsAppUrl } from '../../data/siteData';
import '../../studio.css';
import '../../experience.css';
import { ContactIntent } from './ContactIntent';
import { ChapterNavigation } from './ChapterNavigation';
import { useStudioMotion } from './StudioMotion';
export function usePageTitle(title: string) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = title;
    const description = pathname === '/site-essencial' ? 'Uma página com WhatsApp integrado. Prévia grátis e privada, você só paga se aprovar. R$ 500 em até 3x.' : pathname.startsWith('/projetos/') ? 'Estudo conceitual da Agência Mello. Conheça as escolhas de design do projeto, sem atribuição de resultados comerciais.' : pathname === '/' ? 'Veja seu site pronto antes de pagar no Site Essencial. Sites, identidade visual e conteúdo pra pequenos negócios, direto com quem cria. Rio de Janeiro e todo o Brasil.' : title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `${SITE_INFO.canonicalUrl}${pathname === '/' ? '/' : pathname}`;
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `${SITE_INFO.canonicalUrl}${pathname}`);
  }, [title, pathname]);
}
export function SectionLabel({ number, children }: {number: string; children: React.ReactNode}) { return <p className="section-label"><span>{number} /</span>{children}</p>; }
export function ContactLink({children, className = '', messageKey = 'final', label}: {children: React.ReactNode; className?: string; messageKey?: string; label?: string}) {
  const { pathname } = useLocation();
  const pageMessage = pathname === '/site-essencial' && messageKey === 'header' ? SITE_ESSENCIAL_MESSAGES.header : undefined;
  return <a href={getWhatsAppUrl(pageMessage || WHATSAPP_MESSAGES[messageKey as keyof typeof WHATSAPP_MESSAGES] || WHATSAPP_MESSAGES.final)} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>{children}</a>;
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
    <footer className="studio-footer wrap"><div className="footer-signature" aria-hidden="true"><img src="/assets/agencia-mello-logo.png" alt="" width="803" height="289" loading="lazy"/><span>Sua presença online<br/>à altura do seu trabalho.</span></div><div><Link to="/" className="footer-brand"><img src="/assets/agencia-mello-logo.png" alt="Agência Mello — início" width="803" height="289" loading="lazy"/></Link><span>Rio de Janeiro, Brasil.<br/>Online pra todo o Brasil.</span></div><div className="footer-links"><a href={SITE_INFO.instagram.url} target="_blank" rel="noreferrer">Instagram ↗</a><Link to="/site-essencial">Site Essencial</Link><Link to="/politica-de-privacidade">Privacidade</Link><Link to="/termos-de-uso">Termos de uso</Link></div><p>© {new Date().getFullYear()} Agência Mello</p></footer>
  </div>;
}
