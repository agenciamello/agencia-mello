import { Link } from 'react-router-dom';
import { StudioShell, SectionLabel, usePageTitle, ContactLink } from '../components/studio/Studio';
import { ExperienceHero } from '../components/studio/ExperienceHero';
import { ExperiencePortfolio } from '../components/studio/ExperiencePortfolio';
import { ExperienceServices } from '../components/studio/ExperienceServices';

const processHeadline = ['Do primeiro papo à entrega,', 'você acompanha cada etapa.'];
const processSteps = [
  ['01','Você manda o básico','Serviços, fotos e Instagram. Tudo pelo WhatsApp.'],
  ['02','A gente monta a prévia','Criamos uma prévia privada, sem custo.'],
  ['03','Você olha com calma','Gostou? Seguimos. Não gostou? Você não paga.'],
  ['04','Aprova, ajusta e publica','Até duas rodadas de ajustes e publicação.'],
];

const serviceOrientation = [
  ['01','Sites e landing pages','web'],
  ['02','Identidade visual','marca'],
  ['03','Design para redes sociais','conteudo'],
];

function ServiceOrientation() {
  return <section className="home-service-orientation" aria-label="Serviços da Agência Mello">
    <div className="wrap">
      <span className="micro">O que fazemos</span>
      <nav className="home-service-links" aria-label="Ir para serviços">
        {serviceOrientation.map(([number,label,id])=><a href={`#servico-${id}`} key={id}><span>{number}</span>{label}</a>)}
      </nav>
    </div>
  </section>;
}

function ProcessHeadline() {
  return <h2 className="process-typewriter" aria-label="Do primeiro papo à entrega, você acompanha cada etapa.">{processHeadline.map((line,lineIndex)=><span className="process-typewriter-line" key={line}>{line.split(' ').map((word,wordIndex)=><span className="process-typewriter-word" aria-hidden="true" key={`${lineIndex}-${wordIndex}`}>{Array.from(word).map((char,charIndex)=><span className="process-typewriter-char" key={`${lineIndex}-${wordIndex}-${charIndex}`}>{char}</span>)}</span>)}{lineIndex===processHeadline.length-1&&<span className="process-typewriter-caret" aria-hidden="true"/>}</span>)}</h2>;
}

export function HomePage() {
  usePageTitle('Agência Mello | Sites, marca e conteúdo pra pequenos negócios');
  return <StudioShell>
    <ExperienceHero/>
    <ServiceOrientation/>
    <ExperiencePortfolio/>
    <div className="capability-ribbon" role="img" aria-label="Site no ar, marca coerente, post com cara de marca e atendimento direto"><div className="ribbon-track" aria-hidden="true">{[0,1].map(i=><span key={i}>SITE NO AR <i>·</i> MARCA COERENTE <i>·</i> POST COM CARA DE MARCA <i>·</i> ATENDIMENTO DIRETO <i>·</i> </span>)}</div></div>
    <ExperienceServices/>
    <section id="sobre" className="about-studio wrap" data-chapter="Agência" data-about-cinematic><div className="about-image" data-about-portrait><div className="portrait-window"><img src="/assets/matheus-mello.webp" alt="Matheus Mello, fundador da Agência Mello" width="800" height="900" loading="lazy"/></div><span className="portrait-caption">Matheus Mello / Designer & desenvolvedor</span><span className="portrait-mark" aria-hidden="true">M.</span></div><div className="about-copy"><SectionLabel number="03">Contato direto com quem cria</SectionLabel><h2 className="about-title" aria-label="Prazer, Matheus Mello."><span className="about-title-line">Prazer,</span><span className="about-title-line">Matheus</span><span className="about-title-line about-title-accent">Mello<span className="about-title-dot" aria-hidden="true">.</span></span></h2><p className="lead" data-about-copy>Atendimento transparente. Sem telefone sem fio.</p><p data-about-copy>Você fala direto comigo, do briefing à entrega.</p><p data-about-copy>Sou Matheus Mello, designer e desenvolvedor da Mello. Crio sites, marcas e conteúdo para pequenos negócios no Rio e em todo o Brasil.</p><ContactLink messageKey="header" className="text-link about-cta">Falar com o Matheus <span aria-hidden="true">↗</span></ContactLink></div></section>
    <section id="processo" className="process-studio wrap"><SectionLabel number="04">Como funciona o Site Essencial</SectionLabel><ProcessHeadline/><div className="process-grid process-timeline" data-process-timeline><span className="process-timeline-track" aria-hidden="true"><i/></span>{processSteps.map(([n,title,copy])=><div className="process-step" data-process-step key={n}><span className="process-step-node" aria-hidden="true"/><span className="micro">{n}</span><h3>{title}</h3><p>{copy}</p></div>)}</div><p className="scope-note">Projetos maiores ou fora desse formato recebem orçamento próprio.</p></section>
    <section className="essential-teaser wrap" data-reveal="stagger"><div><span className="micro">Pra quem quer dar o primeiro passo</span><h2>Seu site pronto<br/>antes de você pagar.</h2><p>Uma página, até seis seções e WhatsApp. Prévia grátis: você só paga se aprovar.</p><p>Mais páginas? Orçamento sob medida.</p></div><div className="teaser-price"><span>R$ 500 <small>em até 3x, só depois de aprovar</small></span><ContactLink messageKey="destaque" className="text-link">Quero ver meu site pronto <span aria-hidden="true">↗</span></ContactLink><Link to="/site-essencial" className="text-link">Conheça o Site Essencial <span aria-hidden="true">↗</span></Link></div></section>
  </StudioShell>;
}
