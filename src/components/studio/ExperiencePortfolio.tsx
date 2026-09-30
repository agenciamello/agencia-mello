import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CASES } from '../../data/cases';

export function ExperiencePortfolio() {
  return <section className="experience-work" id="projetos" data-chapter="Projetos">
    <div className="wrap">
      <div className="work-introduction"><h2 className="scroll-story-title" data-scroll-text><span>Dois estudos pra você</span><span>ver como a gente pensa.</span></h2><div><p>Projetos conceituais, feitos pra mostrar nosso jeito de pensar site e marca. O seu pode ser o próximo.</p><span className="micro">Estudos autorais · Sites & identidade</span></div></div>
      <div className="showcase-list">{CASES.map((project, index) => <article className={`showcase-project showcase-${index}`} data-project-story={index} key={project.slug}>
        <div className="project-heading"><h3><Link to={`/projetos/${project.slug}`}>{project.name}</Link></h3><span>{project.discipline}<br/>Estudo conceitual</span></div>
        <Link className="showcase-image" data-tilt to={`/projetos/${project.slug}`} aria-label={`Ver o estudo ${project.name}`}>
          <div className="project-image-mask"><img src={project.image} alt={project.alt} width="1024" height="768" loading="lazy"/></div>
          <span className="project-open">Ver o estudo <ArrowUpRight size={20} aria-hidden="true"/></span>
        </Link>
        <div className="project-editorial" data-reveal="stagger">
          <div className="project-argument"><h4>{project.intro}</h4><p>{project.context}</p><Link to={`/projetos/${project.slug}`} className="project-detail-link">Ver como pensamos este projeto <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
          <figure className="project-detail-crop"><img src={project.image} alt={index===0?'Detalhe da composição digital do estudo Bellavista':'Detalhe das aplicações do estudo Solace'} width="1024" height="768" loading="lazy"/><figcaption>Um olhar mais perto / {index===0?'Atmosfera & composição':'Identidade & aplicações'}</figcaption></figure>
        </div>
      </article>)}</div>
      <p className="work-honesty">Projetos conceituais da Mello, feitos pra explorar soluções de design. Não são trabalhos de clientes.</p>
    </div>
  </section>;
}
