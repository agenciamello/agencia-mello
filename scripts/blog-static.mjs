import { BLOG_POSTS } from '../src/data/blogPosts.js';

export function escapeBlogHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

const paragraph = text => `<p>${escapeBlogHtml(text)}</p>`;
const anchor = (href, text) => `<a href="${escapeBlogHtml(href)}">${escapeBlogHtml(text)}</a>`;

const navigation = `<a class="blog-static-skip" href="#conteudo">Pular para o conteúdo</a><header class="blog-static-header"><a href="/" aria-label="Agência Mello — início"><img src="/assets/agencia-mello-logo.png" width="803" height="289" alt="Agência Mello" /></a><nav aria-label="Navegação principal">${anchor('/#projetos', 'Projetos')}${anchor('/#servicos', 'O que fazemos')}${anchor('/blog', 'Blog')}${anchor('/#contato', 'Contato')}</nav></header>`;
const footer = `<footer class="blog-static-footer">${anchor('/blog', 'Blog da Mello')}${anchor('/site-essencial', 'Site Essencial')}${anchor('/#contato', 'Falar sobre meu projeto')}${anchor('/politica-de-privacidade', 'Privacidade')}</footer>`;

// Only the build-time fallback uses these styles; createRoot replaces its markup.
export const BLOG_STATIC_STYLE = `<style data-blog-static-style>
.blog-static{min-height:100vh;background:#eeeae4;color:#141217;font-family:Inter,Arial,sans-serif;line-height:1.75}.blog-static a{text-decoration:underline;text-underline-offset:.18em;color:inherit}.blog-static :focus-visible{outline:3px solid #a02064;outline-offset:5px}.blog-static-header{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:24px max(24px,5vw);background:#0c0b0e;color:#eeeae4}.blog-static-header img{width:145px;height:auto}.blog-static-header nav,.blog-static-footer{display:flex;flex-wrap:wrap;gap:20px}.blog-static-main{width:min(760px,calc(100% - 40px));margin:auto;padding:64px 0}.blog-static-main h1{font:500 clamp(2.1rem,6vw,4rem)/1.08 'Space Grotesk',Inter,Arial,sans-serif;letter-spacing:-.045em;margin:28px 0}.blog-static-main h2{font:500 clamp(1.5rem,4vw,2rem)/1.25 'Space Grotesk',Inter,Arial,sans-serif;margin:56px 0 18px}.blog-static-main p,.blog-static-main li{font-size:1.08rem}.blog-static-main img{display:block;max-width:100%;height:auto}.blog-static-main figure{margin:28px 0}.blog-static-main figcaption,.blog-static-meta{font-size:.85rem;color:#57525a}.blog-static-main blockquote{border-left:3px solid #ec4899;margin:30px 0;padding:8px 24px;font-size:1.5rem}.blog-static-footer{padding:30px max(24px,5vw);border-top:1px solid #bdb8b5}.blog-static-skip{position:absolute;left:20px;top:8px;transform:translateY(-160%);padding:12px;background:#eeeae4;z-index:999}.blog-static-skip:focus{transform:none}.blog-static-card{margin-top:40px;border-top:1px solid #bdb8b5;padding-top:28px}.blog-static-dek{font-size:1.3rem}.blog-static-cta{padding:30px;background:#0c0b0e;color:#eeeae4;margin-top:44px}.blog-static-cta a{display:inline-block;margin-top:14px;background:#ec4899;color:#141217;padding:12px 18px}.blog-static-toc a{display:block;margin:8px 0}.blog-static-caption{font-size:.85rem}@media(max-width:520px){.blog-static-header{align-items:flex-start;flex-direction:column}.blog-static-header nav{font-size:.9rem;gap:14px}.blog-static-main{padding-top:32px}}
</style>`;

function renderBlogIndex() {
  const entries = BLOG_POSTS.map(post => `<article class="blog-static-card"><p class="blog-static-meta">${escapeBlogHtml(post.category)} · <time datetime="${escapeBlogHtml(post.publishedAt)}">${escapeBlogHtml(post.dateLabel)}</time> · ${escapeBlogHtml(post.readingMinutes)} min de leitura</p><a href="${escapeBlogHtml(post.path)}"><img src="${escapeBlogHtml(post.cover)}" alt="${escapeBlogHtml(post.coverAlt)}" width="1600" height="900" /><h2>${escapeBlogHtml(post.title)}</h2></a>${paragraph(post.description)}${anchor(post.path, 'Ler artigo')}</article>`).join('');
  return `<div class="blog-static">${navigation}<main id="conteudo" tabindex="-1" class="blog-static-main"><nav aria-label="Caminho da página">${anchor('/', 'Agência Mello')} / Blog</nav><p>Ideias para colocar em prática.</p><h1>Blog da Mello</h1><p class="blog-static-dek">Marketing, design e presença digital para apresentar seu negócio e organizar sua divulgação.</p>${entries}</main>${footer}</div>`;
}

function renderBlogArticle(post) {
  const contents = post.sections.map(section => anchor(`#${section.id}`, section.title)).join('');
  const sections = post.sections.map(section => {
    const list = section.list?.length ? `<ul>${section.list.map(item => `<li>${escapeBlogHtml(item)}</li>`).join('')}</ul>` : '';
    const after = Number.isInteger(section.listAfterParagraph) ? section.listAfterParagraph : section.paragraphs.length - 1;
    const text = section.paragraphs.map((item, index) => {
      const images = post.inlineImages.filter(image => image.sectionId === section.id && image.afterParagraph === index).map(image => `<figure><img src="${escapeBlogHtml(image.src)}" alt="${escapeBlogHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" /><figcaption>${escapeBlogHtml(image.caption)} ${escapeBlogHtml(image.credit)}</figcaption></figure>`).join('');
      const trailer = post.trailer.sectionId === section.id && post.trailer.afterParagraph === index ? `<figure class="blog-static-trailer"><p><strong>${escapeBlogHtml(post.trailer.title)}</strong></p><p><a href="${escapeBlogHtml(post.trailer.watchUrl)}" target="_blank" rel="noopener noreferrer">Assistir ao trailer oficial no YouTube (abre em nova aba)</a></p><figcaption>${escapeBlogHtml(post.trailer.caption)} ${anchor(post.trailer.sourceUrl, 'Fonte: Rockstar Games')}</figcaption></figure>` : '';
      return paragraph(item) + (index === after ? list : '') + images + trailer;
    }).join('');
    return `<section id="${escapeBlogHtml(section.id)}"><h2>${escapeBlogHtml(section.title)}</h2>${text}${section.source ? `<p class="blog-static-caption">${anchor(section.source.url, section.source.label)}</p>` : ''}</section>`;
  }).join('');
  const quotes = post.quotes.map(quote => `<figure><blockquote>${escapeBlogHtml(quote.text)}</blockquote><a href="${escapeBlogHtml(quote.image)}" download="${escapeBlogHtml(quote.downloadName)}">Baixar card: ${escapeBlogHtml(quote.text)}</a></figure>`).join('');
  const sources = post.sources.map(source => `<li>${anchor(source.url, source.label)}</li>`).join('');
  const intro = post.intro.map((item, index) => paragraph(item) + (index === 0 ? `<p class="blog-static-caption">${anchor(post.introSource.url, post.introSource.label)}</p>` : '')).join('');

  return `<div class="blog-static">${navigation}<main id="conteudo" tabindex="-1" class="blog-static-main"><nav aria-label="Caminho da página">${anchor('/', 'Agência Mello')} / ${anchor('/blog', 'Blog')} / ${escapeBlogHtml(post.category)}</nav><article><header><p>${escapeBlogHtml(post.category)}</p><h1>${escapeBlogHtml(post.title)}</h1><p class="blog-static-dek">${escapeBlogHtml(post.dek)}</p><p class="blog-static-meta">Por ${escapeBlogHtml(post.author)} · <time datetime="${escapeBlogHtml(post.publishedAt)}">${escapeBlogHtml(post.dateLabel)}</time> · ${escapeBlogHtml(post.readingMinutes)} min de leitura</p><figure><img src="${escapeBlogHtml(post.cover)}" alt="${escapeBlogHtml(post.coverAlt)}" width="1600" height="900" /><figcaption>${escapeBlogHtml(post.coverCaption)}</figcaption></figure></header><nav class="blog-static-toc" aria-label="Neste artigo">${contents}</nav>${intro}${paragraph(post.context)}${sections}<section id="para-compartilhar"><h2>Para salvar e compartilhar</h2>${quotes}</section><section id="proxima-novidade"><h2>Sua próxima novidade já tem um plano de divulgação?</h2>${post.closing.map(paragraph).join('')}<p class="blog-static-cta">${anchor(post.cta.href, post.cta.label)}</p></section><section id="fontes"><h2>Fontes e contexto editorial</h2><ul>${sources}</ul>${paragraph(post.editorialNote)}</section></article></main>${footer}</div>`;
}

export function renderBlogStatic(pathname) {
  const route = pathname.replace(/\/+$/, '') || '/';
  if (route === '/blog') return renderBlogIndex();
  const post = BLOG_POSTS.find(item => item.path === route);
  return post ? renderBlogArticle(post) : null;
}

export function blogSitemapEntries(canonicalBase) {
  const modified = BLOG_POSTS.map(post => post.modifiedAt).sort().at(-1);
  return [
    { loc: `${canonicalBase}/blog`, lastmod: modified },
    ...BLOG_POSTS.map(post => ({ loc: `${canonicalBase}${post.path}`, lastmod: post.modifiedAt })),
  ];
}
