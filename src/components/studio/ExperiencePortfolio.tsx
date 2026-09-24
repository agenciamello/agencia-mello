import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CASES } from '../../data/cases';

export function ExperiencePortfolio() {
  return <section className="experience-work" id="projetos" data-chapter="Projetos">
    <div className="wrap">
      <div className="work-introduction"><h2 data-reveal="lines">Cada negócio,<br/>um universo.</h2><div><p>Uma marca precisa ter voz própria.<br/>Aqui, duas maneiras de encontrar a sua.</p><span className="micro">Estudos conceituais · Web & identidade</span></div></div>
      <div className="showcase-list">{CASES.map((project, index) => <article className={`showcase-project showcase-${index}`} key={project.slug}>
        <div className="project-heading"><h3><Link to={`/projetos/${project.slug}`}>{project.name}</Link></h3><span>{project.discipline}<br/>Estudo conceitual</span></div>
        <Link className="showcase-image" data-tilt to={`/projetos/${project.slug}`} aria-label={`Explorar estudo ${project.name}`}>
          <div className="project-image-mask"><img src={project.image} alt={project.alt} width="1024" height="768" loading="lazy"/></div>
          <span className="project-open">Explorar estudo <ArrowUpRight size={20} aria-hidden="true"/></span>
        </Link>
        <div className="project-editorial">
          <div className="project-argument"><h4>{project.intro}</h4><p>{project.decision}</p><Link to={`/projetos/${project.slug}`} className="project-detail-link">Conheça a direção criativa <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
          <figure className="project-detail-crop"><img src={project.image} alt={index===0?'Detalhe da composição digital do estudo Bellavista':'Detalhe das aplicações do estudo Solace'} width="1024" height="768" loading="lazy"/><figcaption>Um olhar mais perto / {index===0?'Atmosfera & composição':'Identidade & aplicações'}</figcaption></figure>
        </div>
      </article>)}</div>
      <p className="work-honesty">Estudos de direção visual. Sem clientes ou resultados comerciais atribuídos.</p>
    </div>
  </section>;
}
