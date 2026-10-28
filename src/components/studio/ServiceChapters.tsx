import { Link } from 'react-router-dom';
import { ContactLink } from './Studio';
import { CASES } from '../../data/cases';

export function SocialServiceDetails() {
  return <section className="social-service-details" aria-labelledby="social-service-heading">
    <div>
      <span className="micro">Também para o dia a dia da sua marca</span>
      <h4 id="social-service-heading">Seu produto, serviço ou oferta<br/>no próximo post.</h4>
      <p>Peças com a identidade da sua marca para divulgar novidades e promoções.</p>
      <dl className="art-prices"><div><dt>Arte avulsa para redes</dt><dd>R$ 35</dd></div><div><dt>Pacote de 10 artes</dt><dd>R$ 250</dd></div></dl>
      <ContactLink messageKey="conteudo" className="text-link">Pedir artes para minhas redes <span aria-hidden="true">↗</span></ContactLink>
    </div>
    <div>
      <div className="service-visual visual-content" aria-hidden="true"><div className="social-sheet sheet-one"><small>MELLO / IDEIAS EM CIRCULAÇÃO</small><strong>CONSISTÊNCIA<br/>GERA<br/><em>CONFIANÇA.</em></strong><span>Design + conteúdo ↗</span></div><div className="social-sheet sheet-two"><span>Marca forte<br/>se constrói<br/>post a post.</span><img src="/assets/agencia-mello-icone.png" alt="" width="292" height="289" loading="lazy"/><small>UM PONTO DE CONTATO POR VEZ.</small></div></div>
      <p className="visual-example-note">Aplicações da identidade Mello para ilustrar a direção visual.</p>
    </div>
  </section>;
}

export function BrandServiceChapter() {
  const project=CASES.find(item=>item.slug==='solace')!;
  return <section id="servico-marca" className="solution-chapter brand-service-chapter" aria-labelledby="brand-chapter-heading" data-service-index="2">
    <div className="solution-chapter-heading"><span className="micro">03 / Logo e identidade visual</span><h3 id="brand-chapter-heading">Uma marca que<br/>seu cliente reconhece.</h3><p>Logo, cores e tipografia para usar no perfil, nas artes e nos materiais do negócio.</p></div>
    <article className="brand-study">
      <Link className="study-image" to={`/projetos/${project.slug}`} aria-label={`Ver o estudo ${project.name}`}><img src={project.image} alt={project.alt} width="1024" height="768" loading="lazy"/></Link>
      <div className="study-copy"><span>Estudo conceitual · Identidade visual</span><h4>{project.name}</h4><p>{project.short}</p><p>Exemplo autoral de logo, paleta e aplicações. Sem vínculo com cliente contratado.</p><Link to={`/projetos/${project.slug}`} className="project-detail-link">Ver estudo <span aria-hidden="true">↗</span></Link></div>
    </article>
    <ContactLink messageKey="identidade" className="text-link brand-service-cta">Pedir orçamento de identidade visual <span aria-hidden="true">↗</span></ContactLink>
  </section>;
}
