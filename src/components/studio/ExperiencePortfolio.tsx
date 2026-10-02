import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ContactLink } from './Studio';
import { CASES } from '../../data/cases';
import { COMMERCIAL_PROJECTS } from '../../data/commercialProjects';

const [animalis, ...regionalProjects] = COMMERCIAL_PROJECTS;

export function ExperiencePortfolio() {
  return <section className="experience-work" id="projetos" data-chapter="Projetos">
    <div className="wrap">
      <p className="section-label"><span>01 /</span> Portfólio de Projetos</p>
      <div className="work-introduction">
        <h2 className="scroll-story-title" data-scroll-text><span>Negócios diferentes.</span><span>Soluções diferentes.</span></h2>
        <div>
          <p>Sites pensados a partir do que cada negócio precisa comunicar e transformar em contato.</p>
          <span className="micro">Prévias comerciais · Negócios da Baixada Fluminense</span>
        </div>
      </div>

      <div className="showcase-list showcase-commercial-list">
        <article className="showcase-project showcase-commercial" data-project-story="0">
          <div className="project-heading">
            <h3><Link to={`/projetos/${animalis.slug}`}>{animalis.name}</Link></h3>
            <span className="project-status">{animalis.category} · {animalis.location}<br/><strong>Prévia comercial</strong></span>
          </div>
          <Link className="showcase-image" to={`/projetos/${animalis.slug}`} aria-label={`Ver projeto ${animalis.name}`}>
            <div className="project-image-mask"><img src={animalis.image} alt={animalis.alt} width="1440" height="1000" loading="lazy"/></div>
            <span className="project-open">Ver projeto <ArrowUpRight size={20} aria-hidden="true"/></span>
          </Link>
          <div className="project-editorial">
            <div className="project-argument">
              <span className="commercial-kicker">Prévia comercial · Nova Iguaçu</span>
              <h4 className="project-thesis" aria-label="Do Google ao WhatsApp, o caminho precisa ser curto.">
                <span className="project-thesis-visual" aria-hidden="true">
                  <span className="project-thesis-word">Do</span><span className="project-thesis-word">Google</span><span className="project-thesis-word">ao</span><span className="project-thesis-word">WhatsApp,</span><span className="project-thesis-word">o</span><span className="project-thesis-word">caminho</span><span className="project-thesis-word">precisa</span><span className="project-thesis-end"><span className="project-thesis-word">ser</span><span className="project-thesis-word">curto.</span></span>
                </span>
              </h4>
              <p>{animalis.context}</p>
              <Link to={`/projetos/${animalis.slug}`} className="project-detail-link">Conhecer o projeto <ArrowUpRight size={18} aria-hidden="true"/></Link>
            </div>
            <dl className="project-context">
              <div><dt>01 / Objetivo</dt><dd>Apresentar serviços e facilitar o caminho até o atendimento.</dd></div>
              <div><dt>02 / Estrutura</dt><dd>Serviços, planos, localização e WhatsApp em uma experiência própria.</dd></div>
              <div><dt>03 / Status</dt><dd>Prévia comercial · proposta desenvolvida.</dd></div>
            </dl>
          </div>
        </article>
      </div>
      <div className="study-introduction commercial-introduction">
        <span className="micro">Outras prévias comerciais</span>
        <h3>Da marcenaria de bairro a uma presença mais editorial.</h3>
        <p>Propostas desenvolvidas para negócios reais da Baixada, cada uma com direção própria.</p>
      </div>
      <div className="study-grid commercial-project-grid">
        {regionalProjects.map(project => <article className="study-card commercial-card" key={project.slug}>
          <Link className="study-image" to={`/projetos/${project.slug}`} aria-label={`Ver projeto ${project.name}`}>
            <img src={project.image} alt={project.alt} width="1440" height="1000" loading="lazy"/>
          </Link>
          <div className="study-copy">
            <span>{project.category} · {project.location}</span>
            <h4>{project.name}</h4>
            <p>{project.intro}</p>
            <Link to={`/projetos/${project.slug}`} className="project-detail-link">Ver projeto <ArrowUpRight size={18} aria-hidden="true"/></Link>
          </div>
        </article>)}
      </div>

      <div className="study-introduction conceptual-introduction">
        <span className="micro">Estudos autorais</span>
        <h3>Explorações de identidade, direção visual e experiência.</h3>
        <p>Conceitos criados para ampliar repertório, claramente separados dos projetos comerciais.</p>
      </div>
      <div className="study-grid conceptual-project-grid">
        {CASES.map(project => <article className="study-card" key={project.slug}>
          <Link className="study-image" to={`/projetos/${project.slug}`} aria-label={`Ver o estudo ${project.name}`}>
            <img src={project.image} alt={project.alt} width="1024" height="768" loading="lazy"/>
          </Link>
          <div className="study-copy">
            <span>{project.discipline} · Estudo conceitual</span>
            <h4>{project.name}</h4>
            <Link to={`/projetos/${project.slug}`} className="project-detail-link">Ver estudo <ArrowUpRight size={18} aria-hidden="true"/></Link>
          </div>
        </article>)}
      </div>

      <p className="work-honesty">Animalis Pet e Du-Rio são prévias comerciais desenvolvidas para negócios reais. Viana Planejados é uma prévia comercial em negociação. Bellavista e Solace são estudos autorais. Resultados só são apresentados quando existem dados reais.</p>
      <div className="copy-bridge">
        <span className="micro">Depois de ver os projetos</span>
        <h2 className="copy-bridge-reveal" aria-label="Gostou de algum desses projetos?"><span aria-hidden="true"><span className="copy-bridge-word">Gostou</span><span className="copy-bridge-word">de</span><span className="copy-bridge-word">algum</span><span className="copy-bridge-word">desses</span><span className="copy-bridge-word">projetos?</span></span></h2>
        <p>Podemos criar uma direção para o seu negócio também.</p>
        <ContactLink messageKey="projetos" className="text-link">Quero uma prévia <span aria-hidden="true">↗</span></ContactLink>
      </div>
    </div>
  </section>;
}
