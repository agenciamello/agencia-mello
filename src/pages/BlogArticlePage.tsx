import { Fragment, useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Clock3, Copy, Link2, Play, Share2, X } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { StudioShell, usePageTitle } from '../components/studio/Studio';
import { getBlogPost } from '../data/blogPosts.js';
import { blogHref, blogShareUrl } from '../lib/blogLinks';
import { NotFoundPage } from './NotFoundPage';
import './blog.css';

type BlogPost = NonNullable<ReturnType<typeof getBlogPost>>;
type BlogQuote = BlogPost['quotes'][number];
const preparedShareFiles = new Map<string, File>();

function currentShareUrl(path: string, fragment?: string) {
  const url = new URL(blogShareUrl(path));
  url.hash = fragment || '';
  return url.href;
}

function ShareActions({ post, quote }: { post: BlogPost; quote?: BlogQuote }) {
  const [status, setStatus] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [busy, setBusy] = useState(false);
  const manualInput = useRef<HTMLInputElement>(null);
  const preparedFile = useRef<File | null>(null);
  const articleLocation = useLocation();

  useEffect(() => { setStatus(''); setManualLink(''); }, [articleLocation.pathname]);
  useEffect(() => {
    if (manualLink) {
      manualInput.current?.focus();
      manualInput.current?.select();
    }
  }, [manualLink]);

  useEffect(() => {
    preparedFile.current = null;
    if (!quote || !navigator.share || !navigator.canShare) return;
    const cacheKey = `${quote.image}|${quote.downloadName}`;
    const cached = preparedShareFiles.get(cacheKey);
    if (cached) {
      preparedFile.current = cached;
      return;
    }

    const controller = new AbortController();
    let active = true;
    void fetch(quote.image, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) return;
        const file = new File([await response.blob()], quote.downloadName, { type: 'image/png' });
        if (active) {
          preparedShareFiles.set(cacheKey, file);
          preparedFile.current = file;
        }
      })
      .catch(() => { /* Text and link sharing remain available when a card cannot be prepared. */ });
    return () => {
      active = false;
      controller.abort();
    };
  }, [quote?.image, quote?.downloadName]);

  async function copyLink() {
    const url = currentShareUrl(post.path, quote?.id);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      setManualLink('');
      setStatus('Link copiado. Agora você pode enviar para quem quiser.');
    } catch {
      setManualLink(url);
      setStatus('Selecione e copie o link abaixo para compartilhar.');
    }
  }

  async function share() {
    setStatus('');
    setBusy(true);
    try {
      const url = currentShareUrl(post.path, quote?.id);
      if (!navigator.share) {
        await copyLink();
        return;
      }
      const data: ShareData = { title: post.title, text: quote?.text || post.description, url };
      if (quote && preparedFile.current && navigator.canShare) {
        try {
          if (navigator.canShare({ files: [preparedFile.current] })) data.files = [preparedFile.current];
        } catch { /* The article link remains available if image sharing is unsupported. */ }
      }
      await navigator.share(data);
    } catch (error) {
      if ((error as { name?: string })?.name !== 'AbortError') await copyLink();
    } finally {
      setBusy(false);
    }
  }

  return <div className={`blog-share ${quote ? 'blog-share-quote' : ''}`}>
    <div className="blog-share-buttons">
      <button type="button" className="blog-small-action" onClick={share} disabled={busy} aria-label={quote ? `Compartilhar frase: ${quote.text}` : 'Compartilhar artigo'}><Share2 size={16} aria-hidden="true"/>{busy ? 'Preparando…' : 'Compartilhar'}</button>
      {!quote && <button type="button" className="blog-small-action" onClick={copyLink}><Copy size={16} aria-hidden="true"/>Copiar link</button>}
    </div>
    <p className="blog-share-status" role="status" aria-live="polite">{status}</p>
    {manualLink && <label className="blog-manual-link"><span>Link para copiar</span><input ref={manualInput} readOnly value={manualLink} onFocus={event => event.currentTarget.select()}/></label>}
  </div>;
}

function OfficialTrailer({ trailer }: { trailer: BlogPost['trailer'] }) {
  const [playing, setPlaying] = useState(false);
  const activateButton = useRef<HTMLButtonElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    if (playing) player.current?.focus();
    else if (restoreFocus.current) {
      restoreFocus.current = false;
      activateButton.current?.focus();
    }
  }, [playing]);

  function closeTrailer() {
    restoreFocus.current = true;
    setPlaying(false);
  }

  return <figure className="blog-trailer">
    {playing && <div className="blog-trailer-toolbar"><span>Trailer oficial · Rockstar Games</span><button type="button" className="blog-trailer-close" onClick={closeTrailer}><X size={16} aria-hidden="true"/>Fechar trailer</button></div>}
    <div className="blog-trailer-stage">
      {playing ? <iframe
        ref={player}
        src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.youtubeId)}?autoplay=1&playsinline=1&rel=0`}
        title={trailer.title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={0}
      /> : <button ref={activateButton} type="button" className="blog-trailer-activate" aria-label={trailer.label} onClick={() => setPlaying(true)}>
        <span className="blog-trailer-eyebrow">Vídeo oficial · Rockstar Games</span>
        <span className="blog-trailer-title">{trailer.title}</span>
        <span className="blog-trailer-play"><span className="blog-trailer-play-icon"><Play size={24} aria-hidden="true"/></span><span>{trailer.label}</span></span>
      </button>}
    </div>
    <figcaption><p>{trailer.caption}</p><div className="blog-trailer-links"><a href={trailer.watchUrl} target="_blank" rel="noopener noreferrer">Abrir no YouTube<ArrowUpRight size={14} aria-hidden="true"/><span className="blog-sr-only"> (abre em nova aba)</span></a><a href={trailer.sourceUrl} target="_blank" rel="noopener noreferrer">Fonte: Rockstar Games<ArrowUpRight size={14} aria-hidden="true"/><span className="blog-sr-only"> (abre em nova aba)</span></a></div></figcaption>
  </figure>;
}

function LessonVisual({ kind }: { kind: string }) {
  if (kind === 'timeline') return <figure className="blog-example blog-timeline">
    <div className="blog-figure-label"><span>Um lançamento em três momentos</span><span>Exemplo fictício</span></div>
    <ol className="blog-timeline-grid">
      {[['Segunda', 'Apresente a novidade', 'Um novo sabor vem aí. Sexta no cardápio.'], ['Quarta', 'Mostre o preparo', 'Ingredientes, bastidores e um primeiro olhar.'], ['Sexta', 'Abra os pedidos', 'Oferta completa e caminho para pedir.']].map(([day, title, copy], index) => <li key={day}><span className="blog-timeline-number">0{index + 1}</span><span className="blog-timeline-day">{day}</span><strong>{title}</strong><p>{copy}</p><ArrowRight size={18} aria-hidden="true"/></li>)}
    </ol>
    <figcaption>Uma sequência ilustrativa para apresentar a novidade, acrescentar informação e abrir os pedidos.</figcaption>
  </figure>;

  if (kind === 'brand-kit') return <figure className="blog-example blog-brand-kit">
    <div className="blog-figure-label"><span>Uma identidade em três formatos</span><span>Exemplo fictício</span></div>
    <div className="blog-brand-grid">
      <div className="blog-brand-piece blog-brand-post"><span className="blog-brand-wordmark">FORNO<small>Pizzaria fictícia</small></span><strong>Novo<br/>sabor.</strong><img src="/assets/blog/gta-vi/pizza-close.webp" alt="" width="1536" height="1024" loading="lazy"/><span className="blog-brand-bottom">Sexta no cardápio <ArrowUpRight size={14} aria-hidden="true"/></span></div>
      <div className="blog-brand-piece blog-brand-story"><span className="blog-brand-wordmark">FORNO<small>Pizzaria fictícia</small></span><img src="/assets/blog/gta-vi/pizza-close.webp" alt="" width="1536" height="1024" loading="lazy"/><strong>Sua sexta<br/>tem novidade.</strong><span className="blog-brand-bottom">Conheça e peça <ArrowUpRight size={14} aria-hidden="true"/></span></div>
      <div className="blog-brand-piece blog-brand-menu"><span className="blog-brand-wordmark">FORNO<small>Pizzaria fictícia</small></span><span className="blog-menu-rule"/><strong>Cardápio</strong><span>Novo sabor<br/>Nossos clássicos<br/>Para compartilhar</span><span className="blog-brand-bottom">Faça seu pedido <ArrowUpRight size={14} aria-hidden="true"/></span></div>
    </div>
    <figcaption>Post, Story e cardápio com a mesma paleta, tipografia e identificação. Demonstração criada para este artigo.</figcaption>
  </figure>;

  if (kind === 'product' || kind === 'context') return <figure className={`blog-photo-example blog-photo-${kind}`}>
    <img src={`/assets/blog/gta-vi/${kind === 'product' ? 'pizza-close' : 'pizza-mesa'}.webp`} alt={kind === 'product' ? 'Ilustração de uma pizza em detalhe, usada no exemplo fictício de lançamento.' : 'Ilustração de uma pizza servida à mesa, representando uma ocasião para compartilhar.'} width="1536" height="1024" loading="lazy"/>
    <figcaption><span>{kind === 'product' ? 'O que a pessoa recebe.' : 'Em que momento isso faz sentido.'}</span> Exemplo fictício. Imagem gerada com IA para ilustrar o artigo.</figcaption>
  </figure>;

  return <figure className="blog-example blog-purchase">
    <div className="blog-figure-label"><span>Do interesse ao pedido</span><span>Exemplo fictício</span></div>
    <ol className="blog-purchase-flow">
      <li><span>01</span><strong>Vi a novidade</strong><p>Produto e informações em destaque.</p></li>
      <li><span>02</span><strong>Entendi a oferta</strong><p>Preço, condições e disponibilidade claros.</p></li>
      <li><span>03</span><strong>Sei como pedir</strong><p>Um próximo passo fácil de encontrar.</p><span className="blog-demo-button">Iniciar pedido <ArrowUpRight size={15} aria-hidden="true"/></span></li>
    </ol>
    <figcaption>Este esquema ilustra um caminho de compra. Os elementos acima não são botões de uma loja.</figcaption>
  </figure>;
}

function ArticleContent({ post }: { post: BlogPost }) {
  usePageTitle(`${post.title} | Agência Mello`);
  const [activeSection, setActiveSection] = useState(post.sections[0]?.id || '');

  useEffect(() => {
    const elements = post.sections.map(section => document.getElementById(section.id)).filter((element): element is HTMLElement => Boolean(element));
    const visible = new Set<string>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      const current = elements.find(element => visible.has(element.id));
      if (current) setActiveSection(current.id);
    }, { rootMargin: '-18% 0px -55% 0px', threshold: 0 });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [post]);

  const toc = <ol>{post.sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`} aria-current={activeSection === section.id ? 'location' : undefined}><span aria-hidden="true">0{index + 1}</span><span>{section.title}</span></a></li>)}<li><a href="#para-compartilhar"><span aria-hidden="true">↗</span><span>Para compartilhar</span></a></li></ol>;

  return <StudioShell contact={false}>
    <article className="blog-surface blog-article">
      <header className="blog-article-head wrap">
        <Link to={blogHref('/blog')} className="blog-back-link"><ArrowLeft size={16} aria-hidden="true"/>Voltar ao blog</Link>
        <div className="blog-article-kicker"><span>{post.category}</span><span>Uma leitura da Mello</span></div>
        <h1>{post.title}</h1>
        <p className="blog-article-dek">{post.dek}</p>
        <div className="blog-article-meta-row">
          <div className="blog-article-byline"><img src="/assets/agencia-mello-icone.png" alt="" width="292" height="289"/><div><span>Por {post.author}</span><div><time dateTime={post.publishedAt}>{post.dateLabel}</time><span aria-hidden="true">·</span><span><Clock3 size={13} aria-hidden="true"/>{post.readingMinutes} min de leitura</span></div></div></div>
          <ShareActions post={post}/>
        </div>
      </header>

      <figure className="blog-article-cover wrap"><img src={post.cover} alt={post.coverAlt} width="1600" height="900" fetchPriority="high"/><figcaption>{post.coverCaption}</figcaption></figure>

      <div className="blog-article-layout wrap">
        <aside className="blog-toc" aria-label="Sumário do artigo"><span>Nesta leitura</span><nav aria-label="Lições do artigo">{toc}</nav><Link to={blogHref('/blog')} className="blog-toc-back"><ArrowLeft size={14} aria-hidden="true"/>Blog da Mello</Link></aside>
        <div className="blog-article-body">
          <details className="blog-mobile-toc"><summary>Nesta leitura <ChevronDown size={17} aria-hidden="true"/></summary><nav aria-label="Sumário das lições">{toc}</nav></details>
          <div className="blog-article-intro">{post.intro.map((paragraph, index) => <Fragment key={index}><p>{paragraph}</p>{index === 0 && post.introSource && <p className="blog-inline-source"><a href={post.introSource.url} target="_blank" rel="noopener noreferrer">{post.introSource.label}<ArrowUpRight size={14} aria-hidden="true"/><span className="blog-sr-only"> (abre em nova aba)</span></a></p>}</Fragment>)}</div>
          <p className="blog-context-note">{post.context}</p>

          {post.sections.map((section, index) => <section className="blog-lesson" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
            <div className="blog-lesson-title"><span aria-hidden="true">0{index + 1}</span><h2 id={`${section.id}-title`}>{section.title}</h2></div>
            {section.paragraphs.map((paragraph, paragraphIndex) => <Fragment key={paragraphIndex}>
              <p>{paragraph}</p>
              {post.trailer?.sectionId === section.id && post.trailer.afterParagraph === paragraphIndex && <OfficialTrailer trailer={post.trailer}/>}
              {section.list?.length > 0 && section.listAfterParagraph === paragraphIndex && <ul className="blog-lesson-list">{section.list.map(item => <li key={item}>{item}</li>)}</ul>}
              {post.inlineImages.filter(image => image.sectionId === section.id && image.afterParagraph === paragraphIndex).map(image => <figure className="blog-game-figure" key={image.src}>
                <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async"/>
                <figcaption>{image.caption}<span>{image.credit}</span></figcaption>
              </figure>)}
            </Fragment>)}
            {section.list?.length > 0 && section.listAfterParagraph === undefined && <ul className="blog-lesson-list">{section.list.map(item => <li key={item}>{item}</li>)}</ul>}
            {section.source && <p className="blog-inline-source"><a href={section.source.url} target="_blank" rel="noopener noreferrer">{section.source.label}<ArrowUpRight size={14} aria-hidden="true"/><span className="blog-sr-only"> (abre em nova aba)</span></a></p>}
            <LessonVisual kind={section.visual}/>
          </section>)}

          <section id="para-compartilhar" className="blog-quote-section" aria-labelledby="blog-quote-heading">
            <span className="blog-eyebrow">Leve a ideia com você</span>
            <h2 id="blog-quote-heading">Para salvar<br/>e compartilhar.</h2>
            <p>Duas frases deste artigo para lembrar na próxima campanha.</p>
            <div className="blog-quote-grid">{post.quotes.map((quote, index) => <figure className="blog-quote-card" key={quote.id} id={quote.id}>
              <img src={quote.image} alt={quote.text} width="1080" height="1350" loading="lazy"/>
              <figcaption><a href={quote.image} download={quote.downloadName} className="blog-small-action" aria-label={`Baixar card da frase ${index + 1}`}><ArrowDownToLine size={16} aria-hidden="true"/>Baixar card</a><ShareActions post={post} quote={quote}/></figcaption>
            </figure>)}</div>
            <p className="blog-share-invitation">Salve essas ideias ou envie para quem está preparando uma novidade.</p>
          </section>

          <section className="blog-article-cta" aria-labelledby="blog-cta-heading"><span className="blog-eyebrow">Seu próximo lançamento</span><h2 id="blog-cta-heading">Sua próxima novidade já tem um plano de divulgação?</h2>{post.closing.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<Link to={post.cta.href} className="blog-primary-action">{post.cta.label}<ArrowUpRight size={19} aria-hidden="true"/></Link></section>

          <footer className="blog-article-notes">
            <h2>Fontes e contexto</h2>
            <p>{post.editorialNote}</p>
            <ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer"><Link2 size={14} aria-hidden="true"/>{source.label}<ArrowUpRight size={13} aria-hidden="true"/><span className="blog-sr-only"> (abre em nova aba)</span></a></li>)}</ul>
            <Link to={blogHref('/blog')} className="blog-inline-link"><ArrowLeft size={17} aria-hidden="true"/>Voltar ao blog</Link>
          </footer>
        </div>
      </div>
    </article>
  </StudioShell>;
}

export function BlogArticlePage() {
  const { slug } = useParams();
  const post = getBlogPost(slug || '');
  return post ? <ArticleContent post={post}/> : <NotFoundPage/>;
}
