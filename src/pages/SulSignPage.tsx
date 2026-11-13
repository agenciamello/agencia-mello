import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ContactLink, SectionLabel, StudioShell } from '../components/studio/Studio';
import './sulsign.css';

const assets = '/assets/sulsign';

const manualPages = [
  { file: 'paleta.webp', title: 'Paleta de cores', alt: 'Página do manual SulSign com verde, preto, grafite, cinza e branco e suas referências de cor.' },
  { file: 'linguagem.webp', title: 'Linguagem gráfica', alt: 'Página do manual SulSign com linhas de corte, uso do símbolo como padrão e ritmo modular.' },
  { file: 'digital.webp', title: 'Comunicação digital', alt: 'Página do manual SulSign com três exemplos de composição para comunicação digital.' },
];

export function SulSignPage() {
  return <StudioShell>
    <article className="sulsign-project">
      <section className="case-head wrap sulsign-head">
        <Link to="/#servico-marca" className="text-link">← Identidade e projetos</Link>
        <div className="section-top">
          <SectionLabel number="Cliente">Sistema visual e divulgação</SectionLabel>
          <span className="micro">Comunicação visual · SulSign</span>
        </div>
        <div className="sulsign-opening">
          <div className="sulsign-opening-copy">
            <h1>SulSign.</h1>
            <p className="case-intro">Uma linguagem visual.<br/>Do manual à divulgação.</p>
            <p className="sulsign-lead">Cores, tipografia, grafismos e peças comerciais desenvolvidos a partir da marca existente.</p>
            <a href="#sulsign-sistema" className="text-link">Conhecer o trabalho <span aria-hidden="true">↓</span></a>
          </div>
          <figure className="sulsign-lead-figure">
            <img src={`${assets}/impacto-fachada.webp`} alt="Peça SulSign Impacto Desde a Fachada, em preto e verde, com uma simulação de fachada e chamada para orçamento." width="1122" height="1402" fetchPriority="high"/>
            <figcaption>Peça de divulgação · aplicação simulada em fachada.</figcaption>
          </figure>
        </div>
      </section>

      <section className="case-story wrap sulsign-story" aria-labelledby="sulsign-story-title">
        <SectionLabel number="01">O trabalho</SectionLabel>
        <div>
          <h2 id="sulsign-story-title">Uma marca.<br/>A mesma linguagem.</h2>
          <p>Partimos do logotipo da SulSign para desenvolver um sistema visual e suas aplicações na divulgação da empresa de comunicação visual.</p>
          <p>O contraste entre preto, branco e verde conecta o manual às peças. Tipografia, grafismos e hierarquia organizam os serviços e as chamadas para orçamento.</p>
        </div>
      </section>

      <section className="case-details wrap sulsign-deliverables" aria-label="Escopo do trabalho para a SulSign">
        <div><span className="micro">01 / Sistema</span><h3>Direção visual</h3><p>Paleta, tipografia, grafismos e orientações de uso, com preservação do logotipo original.</p></div>
        <div><span className="micro">02 / Manual</span><h3>Aplicações da marca</h3><p>Organização da linguagem visual para materiais institucionais e comunicação digital.</p></div>
        <div><span className="micro">03 / Divulgação</span><h3>Peças comerciais</h3><p>Artes para apresentar serviços e convidar o público a solicitar um orçamento.</p></div>
      </section>

      <section id="sulsign-sistema" className="wrap sulsign-system" aria-labelledby="sulsign-system-title">
        <SectionLabel number="02">O sistema visual</SectionLabel>
        <div className="sulsign-section-heading">
          <h2 id="sulsign-system-title">Da marca às aplicações.</h2>
          <p>Trechos da proposta de manual de identidade visual desenvolvida para a SulSign.</p>
        </div>
        <figure className="sulsign-manual-signature">
          <img src={`${assets}/assinatura.webp`} alt="Página do manual SulSign com as aplicações do logotipo existente em fundo escuro e claro." width="1000" height="563" loading="lazy"/>
          <figcaption>Assinatura existente preservada no sistema visual.</figcaption>
        </figure>
        <details className="sulsign-manual-details">
          <summary>Ver paleta, grafismos e comunicação digital</summary>
          <div className="sulsign-manual-pages">
            {manualPages.map(page => <figure key={page.file}>
              <img src={`${assets}/${page.file}`} alt={page.alt} width="1000" height="563" loading="lazy"/>
              <figcaption>{page.title} · trecho da proposta do manual.</figcaption>
            </figure>)}
          </div>
        </details>
        <a href={`${assets}/manual-identidade-visual.pdf`} target="_blank" rel="noopener noreferrer" className="text-link sulsign-manual-link">Consultar proposta do manual <span className="sulsign-file-type">PDF · abre em nova aba</span><ArrowUpRight size={18} aria-hidden="true"/></a>
      </section>

      <section className="wrap sulsign-applications" aria-labelledby="sulsign-art-title">
        <SectionLabel number="03">Peças de divulgação</SectionLabel>
        <div className="sulsign-section-heading">
          <h2 id="sulsign-art-title">A identidade em circulação.</h2>
          <p>A mesma linguagem em diferentes mensagens e formatos.</p>
        </div>
        <div className="sulsign-art-grid">
          <figure>
            <img src={`${assets}/producao-precisao.webp`} alt="Peça institucional SulSign Sua produção. Nossa precisão., apresentada em uma simulação de cartaz industrial." width="1536" height="1024" loading="lazy"/>
            <figcaption>Peça institucional · aplicação simulada em cartaz.</figcaption>
          </figure>
          <figure>
            <img src={`${assets}/eventos-que-marcam.webp`} alt="Peça SulSign Eventos Que Marcam com simulação de estande em preto e verde, serviços e chamada para orçamento." width="1440" height="1797" loading="lazy"/>
            <figcaption>Divulgação para eventos · aplicação simulada em estande.</figcaption>
          </figure>
        </div>
      </section>

      <div className="case-note wrap sulsign-note">
        <div><span className="micro">Sobre as imagens</span><p>Fachadas, cartaz e estande são simulações de aplicação usadas nas peças de divulgação. O trabalho apresentado é de sistema visual e design das peças; as imagens não representam execução física pela Mello. O manual está identificado como proposta.</p></div>
        <Link to="/#servico-conteudo" className="text-link">Artes para o seu negócio <ArrowUpRight size={18} aria-hidden="true"/></Link>
      </div>

      <section className="copy-bridge wrap sulsign-contact" aria-labelledby="sulsign-contact-title">
        <h2 id="sulsign-contact-title">Sua marca pronta para divulgar.</h2>
        <p>Conte o que sua empresa precisa apresentar. A gente começa por uma conversa.</p>
        <div className="sulsign-contact-actions">
          <ContactLink messageKey="identidade" className="solid-link">Pedir identidade visual <ArrowUpRight size={18} aria-hidden="true"/></ContactLink>
          <ContactLink messageKey="conteudo" className="text-link">Pedir artes para redes <ArrowUpRight size={18} aria-hidden="true"/></ContactLink>
        </div>
      </section>
    </article>
  </StudioShell>;
}
