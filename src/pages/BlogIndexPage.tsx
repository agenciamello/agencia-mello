import { ArrowDown, ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StudioShell, usePageTitle } from '../components/studio/Studio';
import { BLOG_POSTS } from '../data/blogPosts.js';
import { blogHref } from '../lib/blogLinks';
import './blog.css';

export function BlogIndexPage() {
  usePageTitle('Blog da Mello | Design, divulgação e negócios');

  return <StudioShell contact={false}>
    <div className="blog-surface blog-index">
      <header className="blog-index-hero wrap">
        <div className="blog-eyebrow"><span>Blog da Mello</span><span>Ideias para colocar em prática</span></div>
        <h1>Design, divulgação<br/>e <em>bons próximos passos.</em></h1>
        <div className="blog-index-intro">
          <p>Conteúdo para apresentar melhor seu negócio. Com exemplos, escolhas e caminhos que cabem na sua rotina.</p>
          <a href="#artigos" className="blog-inline-link">Explorar o blog <ArrowDown size={18} aria-hidden="true"/></a>
        </div>
      </header>

      <section id="artigos" className="blog-index-articles wrap" aria-labelledby="blog-articles-heading">
        <div className="blog-section-line"><h2 id="blog-articles-heading">Comece por aqui</h2><span>{String(BLOG_POSTS.length).padStart(2, '0')} {BLOG_POSTS.length === 1 ? 'artigo' : 'artigos'}</span></div>
        {BLOG_POSTS.map(post => <article className="blog-featured" key={post.slug}>
          <Link className="blog-featured-media" to={blogHref(post.path)} aria-label={`Ler artigo: ${post.title}`}>
            <img src={post.cover} alt={post.coverAlt} width="1600" height="900" fetchPriority="high"/>
            <span className="blog-featured-arrow" aria-hidden="true"><ArrowUpRight size={26}/></span>
          </Link>
          <div className="blog-featured-copy">
            <div className="blog-post-category">{post.category}</div>
            <h2><Link to={blogHref(post.path)}>{post.title}</Link></h2>
            <p>{post.description}</p>
            <div className="blog-post-meta"><time dateTime={post.publishedAt}>{post.dateLabel}</time><span><Clock3 size={14} aria-hidden="true"/>{post.readingMinutes} min de leitura</span></div>
            <Link className="blog-inline-link" to={blogHref(post.path)}>Ler a matéria <ArrowRight size={18} aria-hidden="true"/></Link>
          </div>
        </article>)}
      </section>

      <section className="blog-index-services wrap" aria-labelledby="blog-services-heading">
        <div><span className="blog-eyebrow">Do conteúdo à prática</span><h2 id="blog-services-heading">Uma ideia para<br/>o seu negócio?</h2><p>A Mello cria sites, identidade visual e artes para sua próxima divulgação.</p></div>
        <div className="blog-service-links">
          <Link to="/#servico-web"><span><small>01 / Presença digital</small>Sites para negócios</span><ArrowUpRight aria-hidden="true"/></Link>
          <Link to="/#servico-conteudo"><span><small>02 / Divulgação</small>Artes para redes e eventos</span><ArrowUpRight aria-hidden="true"/></Link>
          <Link to="/#servico-marca"><span><small>03 / Sua marca</small>Logo e identidade visual</span><ArrowUpRight aria-hidden="true"/></Link>
        </div>
      </section>
    </div>
  </StudioShell>;
}
