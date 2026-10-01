import { Link } from 'react-router-dom';
import { StudioShell, SectionLabel, usePageTitle, ContactLink } from '../components/studio/Studio';
import { ExperienceHero } from '../components/studio/ExperienceHero';
import { ExperiencePortfolio } from '../components/studio/ExperiencePortfolio';
import { ExperienceServices } from '../components/studio/ExperienceServices';

const processHeadline = ['Do primeiro papo à entrega,', 'você acompanha cada etapa.'];
const processSteps = [
  ['01','Você manda o básico','Nome do negócio, serviços, fotos e Instagram. Tudo pelo WhatsApp, sem formulário.'],
  ['02','A gente monta a prévia','Um site de verdade, feito pro seu negócio. Privado e sem custo.'],
  ['03','Você olha com calma','Faz sentido? Seguimos. Não faz? Sem cobrança pela prévia.'],
  ['04','Aprova, ajusta e publica','Até duas rodadas de ajuste e você no ar.'],
];

function ProcessHeadline() {
  return <h2 className="process-typewriter" aria-label="Do primeiro papo à entrega, você acompanha cada etapa.">{processHeadline.map((line,lineIndex)=><span className="process-typewriter-line" key={line}>{line.split(' ').map((word,wordIndex)=><span className="process-typewriter-word" aria-hidden="true" key={`${lineIndex}-${wordIndex}`}>{Array.from(word).map((char,charIndex)=><span className="process-typewriter-char" key={`${lineIndex}-${wordIndex}-${charIndex}`}>{char}</span>)}</span>)}{lineIndex===processHeadline.length-1&&<span className="process-typewriter-caret" aria-hidden="true"/>}</span>)}</h2>;
}

export function HomePage() {
  usePageTitle('Agência Mello | Sites, marca e conteúdo pra pequenos negócios');
  return <StudioShell>
    <ExperienceHero/>
    <ExperiencePortfolio/>
    <div className="capability-ribbon" role="img" aria-label="Site no ar, marca coerente, post com cara de marca e atendimento direto"><div className="ribbon-track" aria-hidden="true">{[0,1].map(i=><span key={i}>SITE NO AR <i>·</i> MARCA COERENTE <i>·</i> POST COM CARA DE MARCA <i>·</i> ATENDIMENTO DIRETO <i>·</i> </span>)}</div></div>
    <ExperienceServices/>
    <section id="sobre" className="about-studio wrap" data-chapter="Agência"><div className="about-image"><div className="portrait-window"><img data-reveal="image" src="/assets/matheus-mello.webp" alt="Matheus Mello, fundador da Agência Mello" width="800" height="900" loading="lazy"/></div><span className="portrait-caption">Matheus Mello / Designer & desenvolvedor</span><span className="portrait-mark" aria-hidden="true">M.</span></div><div className="about-copy"><SectionLabel number="03">Contato direto com quem cria</SectionLabel><h2 data-reveal="lines">Prazer,<br/>Matheus<br/><span>Mello.</span></h2><p className="lead">Atendimento transparente. Sem telefone sem fio.</p><p>Você conversa diretamente com quem pensa e executa o projeto.</p><p>Sou Matheus Mello, designer, desenvolvedor e fundador da Mello. Crio sites, identidades e conteúdo visual para pequenos negócios, profissionais autônomos e marcas.</p><p>Sem intermediário e sem recado atravessado. Você fala comigo pra entender o projeto, combinar o que está incluso e acompanhar cada etapa. Atendimento no Rio de Janeiro e online para todo o Brasil.</p><ContactLink messageKey="header" className="text-link">Falar com o Matheus <span aria-hidden="true">↗</span></ContactLink></div></section>
    <section id="processo" className="process-studio wrap"><SectionLabel number="04">Como funciona o Site Essencial</SectionLabel><ProcessHeadline/><div className="process-grid process-timeline" data-process-timeline><span className="process-timeline-track" aria-hidden="true"><i/></span>{processSteps.map(([n,title,copy])=><div className="process-step" data-process-step key={n}><span className="process-step-node" aria-hidden="true"/><span className="micro">{n}</span><h3>{title}</h3><p>{copy}</p></div>)}</div><p className="scope-note">Projeto maior que um site de uma página ou outro serviço? O que está incluso, o processo e o valor são combinados antes de começar.</p></section>
    <section className="essential-teaser wrap" data-reveal="stagger"><div><span className="micro">Pra quem quer dar o primeiro passo</span><h2>Seu site pronto<br/>antes de você pagar.</h2><p>Site Essencial: uma página, até seis seções e WhatsApp integrado. A prévia é grátis e privada. Você só paga se aprovar.</p><p>Precisa de mais páginas ou funcionalidades? Projeto sob medida, com orçamento próprio.</p></div><div className="teaser-price"><span>R$ 500 <small>em até 3x, só depois de aprovar</small></span><ContactLink messageKey="destaque" className="text-link">Quero ver meu site pronto <span aria-hidden="true">↗</span></ContactLink><Link to="/site-essencial" className="text-link">Conheça o Site Essencial <span aria-hidden="true">↗</span></Link></div></section>
  </StudioShell>;
}
