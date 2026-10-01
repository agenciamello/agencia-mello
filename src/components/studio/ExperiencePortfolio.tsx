import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ContactLink } from './Studio';
import { CASES } from '../../data/cases';

const VIANA_URL = 'https://vianaplanejados.vercel.app/';

export function ExperiencePortfolio() {
  return <section className="experience-work" id="projetos" data-chapter="Projetos">
    <div className="wrap">
      <p className="section-label"><span>01 /</span> Projetos selecionados</p>
      <div className="work-introduction">
        <h2 className="scroll-story-title" data-scroll-text><span>Presença digital que</span><span>existe fora do feed.</span></h2>
        <div>
          <p>Um site próprio tira o negócio da dependência exclusiva do Instagram e da indicação. Ele organiza o que você faz, facilita o contato e cria uma base para ser encontrado no Google.</p>
          <span className="micro">Trabalhos comerciais · Sites para negócios locais</span>
        </div>
      </div>

      <div className="showcase-list showcase-commercial-list">
        <article className="showcase-project showcase-commercial" data-project-story="0">
          <div className="project-heading">
            <h3><a href={VIANA_URL} target="_blank" rel="noreferrer">Viana Planejados</a></h3>
            <span className="project-status">Projeto comercial · Site<br/><strong>Prévia em negociação</strong></span>
          </div>
          <a className="showcase-image" href={VIANA_URL} target="_blank" rel="noreferrer" aria-label="Ver site Viana Planejados">
            <div className="project-image-mask"><img src="/assets/viana-planejados-site.webp" alt="Prévia do site Viana Planejados, com projeto de móveis planejados em destaque." width="1440" height="1100" loading="lazy"/></div>
            <span className="project-open">Ver site <ArrowUpRight size={20} aria-hidden="true"/></span>
          </a>
          <div className="project-editorial">
            <div className="project-argument">
              <span className="commercial-kicker">Projeto comercial</span>
              <h4 className="project-thesis" aria-label="Um endereço próprio para o negócio não depender só do feed."><span className="project-thesis-visual" aria-hidden="true"><span className="project-thesis-word">Um</span><span className="project-thesis-word">endereço</span><span className="project-thesis-word">próprio</span><span className="project-thesis-word">para</span><span className="project-thesis-word">o</span><span className="project-thesis-word">negócio</span><span className="project-thesis-word">não</span><span className="project-thesis-word">depender</span><span className="project-thesis-end"><span className="project-thesis-word">só</span><span className="project-thesis-word">do</span><span className="project-thesis-word">feed.</span></span></span></h4>
              <p>A proposta para a Viana Planejados organiza serviços, portfólio, localização e contato em uma experiência própria — preparada para representar a empresa também nas buscas.</p>
              <a href={VIANA_URL} target="_blank" rel="noreferrer" className="project-detail-link">Visitar a prévia <ArrowUpRight size={18} aria-hidden="true"/></a>
            </div>
            <dl className="project-context">
              <div><dt>01 / Antes</dt><dd>Presença concentrada no Instagram e na indicação.</dd></div>
              <div><dt>02 / Intervenção</dt><dd>Um endereço próprio para apresentar a empresa, os serviços, o portfólio, a localização e o contato.</dd></div>
              <div><dt>03 / Status</dt><dd>Projeto comercial. Prévia em negociação.</dd></div>
            </dl>
          </div>
        </article>
      </div>

      <div className="study-introduction">
        <span className="micro">Estudos autorais</span>
        <h3>Ideias que mostram nosso repertório.</h3>
        <p>Enquanto o portfólio comercial cresce, estes estudos continuam aqui como apoio — sem se passar por trabalho de cliente.</p>
      </div>
      <div className="study-grid">
        {CASES.map(project => <article className="study-card" key={project.slug}>
          <Link className="study-image" to={`/projetos/${project.slug}`} aria-label={`Ver o estudo ${project.name}`}>
            <img src={project.image} alt={project.alt} width="1024" height="768" loading="lazy"/>
          </Link>
          <div className="study-copy">
            <span>{project.discipline} · Estudo conceitual</span>
            <h4>{project.name}</h4>
            <p>{project.short}</p>
            <Link to={`/projetos/${project.slug}`} className="project-detail-link">Ver estudo <ArrowUpRight size={18} aria-hidden="true"/></Link>
          </div>
        </article>)}
      </div>

      <p className="work-honesty">Viana Planejados é uma prévia comercial em negociação. Bellavista e Solace são estudos autorais. Resultados de busca ou performance só entram aqui quando houver dados reais.</p>
      <div className="copy-bridge">
        <span className="micro">Site Essencial</span>
        <h2>Quer um assim pro seu negócio?</h2>
        <p>Veja seu site pronto antes de pagar. Só contrata se gostar.</p>
        <ContactLink messageKey="projetos" className="text-link">Quero ver meu site pronto <span aria-hidden="true">↗</span></ContactLink>
      </div>
    </div>
  </section>;
}
