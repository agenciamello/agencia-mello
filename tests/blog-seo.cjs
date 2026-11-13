const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function decodeHtml(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  return String(value).replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
    if (/^#x/i.test(entity)) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith('#')) return String.fromCodePoint(parseInt(entity.slice(1), 10));
    return named[entity.toLowerCase()];
  });
}

function normalize(value) {
  return String(value).replace(/\s+/gu, ' ').trim();
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(match => [match[1].toLowerCase(), decodeHtml(match[3])]));
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
}

function meta(html, key, kind = 'name') {
  const matches = tags(html, 'meta').filter(item => item[kind] === key);
  assert.equal(matches.length, 1, `Exactly one ${kind}=${key} meta tag`);
  return matches[0].content;
}

function link(html, rel, extras = {}) {
  const matches = tags(html, 'link').filter(item => item.rel === rel && Object.entries(extras).every(([key, value]) => item[key] === value));
  assert.equal(matches.length, 1, `Exactly one ${rel} link ${JSON.stringify(extras)}`);
  return matches[0].href;
}

function bodyOf(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  assert.ok(body, 'HTML includes a body');
  return body[1];
}

function textOf(html) {
  return normalize(decodeHtml(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ')));
}

function sectionOf(body, id) {
  const section = body.match(new RegExp(`<section\\b(?=[^>]*\\bid=["']${escapeRegex(id)}["'])[^>]*>([\\s\\S]*?)<\\/section>`, 'i'));
  assert.ok(section, `Visible article section ${id} exists in initial HTML`);
  return section[1];
}

function structuredData(html) {
  const blocks = [...html.matchAll(/<script\b(?=[^>]*\bdata-seo-jsonld)(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)];
  assert.equal(blocks.length, 1, 'Exactly one site JSON-LD block');
  const data = JSON.parse(blocks[0][1]);
  assert.equal(data['@context'], 'https://schema.org');
  assert.ok(Array.isArray(data['@graph']), 'Structured data includes a graph');
  return data['@graph'];
}

function hasType(node, type) {
  return [].concat(node['@type'] || []).includes(type);
}

function graphNode(graph, type) {
  const matches = graph.filter(node => hasType(node, type));
  assert.equal(matches.length, 1, `Exactly one ${type} node`);
  return matches[0];
}

function resolveNode(node, graph) {
  return { ...(graph.find(item => item['@id'] === node?.['@id']) || {}), ...node };
}

function readRoute(route) {
  const file = path.join(dist, ...route.split('/').filter(Boolean), 'index.html');
  assert.ok(fs.existsSync(file), `Built route exists: ${route}`);
  return fs.readFileSync(file, 'utf8');
}

function imageDimensions(file) {
  const buffer = fs.readFileSync(file);
  assert.ok(buffer.length > 32, `Image is not empty: ${file}`);
  if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    assert.equal(buffer.toString('ascii', 12, 16), 'IHDR');
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), type: 'image/png' };
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    for (let offset = 12; offset + 8 <= buffer.length;) {
      const chunk = buffer.toString('ascii', offset, offset + 4);
      const length = buffer.readUInt32LE(offset + 4);
      const start = offset + 8;
      assert.ok(start + length <= buffer.length, `Complete WebP chunk: ${file}`);
      if (chunk === 'VP8X' && length >= 10) return { width: 1 + buffer.readUIntLE(start + 4, 3), height: 1 + buffer.readUIntLE(start + 7, 3), type: 'image/webp' };
      if (chunk === 'VP8 ' && length >= 10) {
        assert.equal(buffer.toString('hex', start + 3, start + 6), '9d012a', `Valid VP8 frame: ${file}`);
        return { width: buffer.readUInt16LE(start + 6) & 0x3fff, height: buffer.readUInt16LE(start + 8) & 0x3fff, type: 'image/webp' };
      }
      if (chunk === 'VP8L' && length >= 5) {
        assert.equal(buffer[start], 0x2f, `Valid VP8L signature: ${file}`);
        const packed = buffer.readUInt32LE(start + 1);
        return { width: 1 + (packed & 0x3fff), height: 1 + ((packed >>> 14) & 0x3fff), type: 'image/webp' };
      }
      offset = start + length + (length % 2);
    }
  }
  throw new Error(`Unsupported or invalid PNG/WebP image: ${file}`);
}

function localImage(src, canonicalBase) {
  const url = new URL(src, canonicalBase);
  assert.equal(url.origin, new URL(canonicalBase).origin, 'Article image is a local project asset');
  const file = path.resolve(dist, `.${decodeURIComponent(url.pathname)}`);
  assert.ok(file.startsWith(`${dist}${path.sep}`), 'Asset resolves inside dist');
  assert.ok(fs.existsSync(file), `Built image exists: ${url.pathname}`);
  return imageDimensions(file);
}

function checkMetadata(html, expected) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  assert.ok(title, 'Static HTML includes a title');
  assert.equal(decodeHtml(title[1]), expected.title);
  assert.equal(meta(html, 'description'), expected.description);
  assert.match(meta(html, 'robots'), /^index,follow/);
  assert.equal(meta(html, 'googlebot'), meta(html, 'robots'));
  assert.equal(link(html, 'canonical'), expected.canonical);
  assert.equal(link(html, 'alternate', { hreflang: 'pt-BR' }), expected.canonical);
  assert.equal(link(html, 'alternate', { hreflang: 'x-default' }), expected.canonical);
  assert.equal(meta(html, 'og:title', 'property'), expected.title);
  assert.equal(meta(html, 'og:description', 'property'), expected.description);
  assert.equal(meta(html, 'og:url', 'property'), expected.canonical);
  assert.equal(meta(html, 'og:type', 'property'), expected.type);
  assert.equal(meta(html, 'og:image', 'property'), expected.image);
  assert.equal(meta(html, 'og:image:secure_url', 'property'), expected.image);
  assert.equal(meta(html, 'og:image:alt', 'property'), expected.imageAlt);
  assert.equal(meta(html, 'og:image:type', 'property'), 'image/webp');
  assert.equal(meta(html, 'og:image:width', 'property'), '1600');
  assert.equal(meta(html, 'og:image:height', 'property'), '900');
  assert.equal(meta(html, 'twitter:card'), 'summary_large_image');
  assert.equal(meta(html, 'twitter:title'), expected.title);
  assert.equal(meta(html, 'twitter:description'), expected.description);
  assert.equal(meta(html, 'twitter:image'), expected.image);
  assert.equal(meta(html, 'twitter:image:alt'), expected.imageAlt);
  assert.equal((bodyOf(html).match(/<h1\b/gi) || []).length, 1, 'Initial body has one h1');
  assert.ok(!html.includes('_vercel_share'), 'No preview credentials in built HTML');
}

(async () => {
  const { BLOG_POSTS } = await import(pathToFileURL(path.join(root, 'src/data/blogPosts.js')).href);
  const { SEO_SITE, SEO_ROUTES } = await import(pathToFileURL(path.join(root, 'src/data/seoRoutes.js')).href);
  assert.ok(BLOG_POSTS.length > 0, 'The blog has an actual article');
  const deployConfig = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  for (const route of ['/blog', ...BLOG_POSTS.map(post => post.path)]) {
    for (const source of [route, `${route}/`]) {
      const rewrite = deployConfig.rewrites.find(item => item.source === source);
      assert.equal(rewrite?.destination, `${route}/index.html`, 'Direct blog URLs serve their actual generated article metadata and body');
      assert.ok(deployConfig.rewrites.indexOf(rewrite) < deployConfig.rewrites.findIndex(item => item.source === '/(.*)'), 'Blog rewrites precede SPA fallback');
    }
  }
  const base = SEO_SITE.url;
  const index = readRoute('/blog');
  const indexBody = bodyOf(index);
  const indexGraph = structuredData(index);
  const blog = graphNode(indexGraph, 'Blog');
  const blogId = `${base}/blog#blog`;
  assert.equal(blog['@id'], blogId);
  assert.equal(blog.url, `${base}/blog`);
  assert.equal(blog.publisher['@id'], `${base}/#organization`);
  assert.deepEqual(blog.blogPost.map(post => post['@id']), BLOG_POSTS.map(post => `${base}${post.path}#article`));
  assert.equal(indexGraph.filter(node => hasType(node, 'BlogPosting')).length, 0, 'Index does not pretend to be an article');
  const indexCrumbs = graphNode(indexGraph, 'BreadcrumbList').itemListElement;
  assert.deepEqual(indexCrumbs.map(item => item.item), [`${base}/`, `${base}/blog`]);
  assert.ok(textOf(indexBody).includes('Blog da Mello'));
  checkMetadata(index, {
    title: SEO_ROUTES['/blog'].title,
    description: SEO_ROUTES['/blog'].description,
    canonical: `${base}/blog`,
    type: 'website',
    image: new URL(BLOG_POSTS[0].cover, base).href,
    imageAlt: SEO_ROUTES['/blog'].projectImageAlt,
  });
  assert.equal(tags(index, 'meta').filter(item => item.property?.startsWith('article:')).length, 0, 'Index has no stale article metadata');

  for (const post of BLOG_POSTS) {
    const html = readRoute(post.path);
    const body = bodyOf(html);
    const visibleText = textOf(body);
    const canonical = `${base}${post.path}`;
    checkMetadata(html, {
      title: `${post.title} | Agência Mello`,
      description: post.description,
      canonical,
      type: 'article',
      image: new URL(post.cover, base).href,
      imageAlt: post.coverAlt,
    });
    assert.equal(meta(html, 'article:published_time', 'property'), post.publishedAt);
    assert.equal(meta(html, 'article:modified_time', 'property'), post.modifiedAt);
    assert.equal(meta(html, 'article:author', 'property'), base);
    assert.equal(meta(html, 'article:section', 'property'), post.category);
    assert.ok(!Number.isNaN(Date.parse(post.publishedAt)) && !Number.isNaN(Date.parse(post.modifiedAt)), 'Article dates are valid ISO date values');
    assert.equal(textOf(body.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)[1]), post.title);
    for (const paragraph of [...post.intro, post.context, ...post.closing, post.editorialNote]) {
      assert.ok(visibleText.includes(normalize(paragraph)), `Initial article body contains approved text: ${paragraph.slice(0, 70)}`);
    }
    for (const section of post.sections) {
      const content = textOf(sectionOf(body, section.id));
      assert.ok(content.includes(normalize(section.title)), `Section heading is present: ${section.id}`);
      for (const paragraph of section.paragraphs) assert.ok(content.includes(normalize(paragraph)), `Complete section text: ${section.id}`);
      let previousPosition = -1;
      for (const item of section.list || []) {
        const position = content.indexOf(normalize(item));
        assert.ok(position > previousPosition, `Approved list order: ${section.id}`);
        previousPosition = position;
      }
      if (section.list?.length) {
        const after = section.listAfterParagraph;
        assert.ok(Number.isInteger(after), `List placement is explicit in editorial data: ${section.id}`);
        assert.ok(content.indexOf(normalize(section.paragraphs[after])) < content.indexOf(normalize(section.list[0])), `List follows its introduction: ${section.id}`);
        if (section.paragraphs[after + 1]) assert.ok(content.indexOf(normalize(section.list.at(-1))) < content.indexOf(normalize(section.paragraphs[after + 1])), `List precedes the following paragraph: ${section.id}`);
      }
      if (section.source) assert.ok(tags(sectionOf(body, section.id), 'a').some(item => item.href === section.source.url), `Source link is present: ${section.id}`);
    }
    assert.equal(post.inlineImages.length, 2, 'The two supplied game photos are included');
    assert.equal(new Set(post.inlineImages.map(image => image.sectionId)).size, 2, 'Game photos are distributed across different lessons');
    for (const image of post.inlineImages) {
      const section = post.sections.find(item => item.id === image.sectionId);
      const sectionHtml = sectionOf(body, image.sectionId);
      const imageTag = tags(sectionHtml, 'img').find(item => item.src === image.src);
      assert.ok(imageTag, `Inline photo is present in initial article HTML: ${image.src}`);
      assert.equal(imageTag.alt, image.alt);
      assert.equal(imageTag.loading, 'lazy');
      assert.equal(Number(imageTag.width), image.width);
      assert.equal(Number(imageTag.height), image.height);
      assert.deepEqual(localImage(image.src, base), { width: image.width, height: image.height, type: 'image/webp' });
      const content = textOf(sectionHtml);
      assert.ok(content.includes(normalize(image.credit)), 'Photo provenance is visible without JavaScript');
      assert.ok(content.indexOf(normalize(section.paragraphs[image.afterParagraph])) < content.indexOf(normalize(image.caption)), 'Photo follows the intended paragraph');
      assert.ok(content.indexOf(normalize(image.caption)) < content.indexOf(normalize(section.paragraphs[image.afterParagraph + 1])), 'Photo breaks the prose before the following paragraph');
    }
    assert.ok(tags(body, 'a').some(item => item.href === post.cta.href), 'Article has its approved contact action');
    assert.ok(tags(indexBody, 'a').some(item => item.href === post.path), 'Index exposes a crawlable article link');
    for (const source of post.sources) assert.ok(tags(body, 'a').some(item => item.href === source.url), `Official source is linked: ${source.url}`);

    const graph = structuredData(html);
    graphNode(graph, 'Blog');
    const article = graphNode(graph, 'BlogPosting');
    const webpage = graphNode(graph, 'WebPage');
    const organization = graphNode(graph, 'Organization');
    assert.equal(article['@id'], `${canonical}#article`);
    assert.equal(article.url, canonical);
    assert.equal(article.headline, post.title);
    assert.equal(article.description, post.description);
    assert.equal(article.datePublished, post.publishedAt);
    assert.equal(article.dateModified, post.modifiedAt);
    assert.equal(article.inLanguage, 'pt-BR');
    assert.equal(article.articleSection, post.category);
    assert.equal(article.isAccessibleForFree, true);
    assert.equal(article.isPartOf['@id'], blogId);
    assert.equal(article.mainEntityOfPage['@id'], webpage['@id']);
    assert.equal(webpage.mainEntity['@id'], article['@id']);
    assert.equal(webpage.url, canonical);
    const author = resolveNode(article.author, graph);
    const publisher = resolveNode(article.publisher, graph);
    assert.ok(hasType(author, 'Organization'));
    assert.equal(author.name, post.author);
    assert.equal(author.url, base);
    assert.equal(publisher['@id'], organization['@id']);
    assert.equal(publisher.name, SEO_SITE.name);
    assert.deepEqual(article.citation, post.sources.map(source => source.url));
    assert.ok(article.articleBody.includes(post.editorialNote), 'Schema preserves the factual editorial note');
    assert.equal(article.wordCount, article.articleBody.trim().split(/\s+/u).length);
    assert.ok(article.wordCount > 500, 'Schema contains the complete article body');
    const crumbs = graphNode(graph, 'BreadcrumbList').itemListElement;
    assert.deepEqual(crumbs.map(item => item.position), [1, 2, 3]);
    assert.deepEqual(crumbs.map(item => item.item), [`${base}/`, `${base}/blog`, canonical]);
    assert.equal(crumbs.at(-1).name, post.title);
    assert.equal(article.image.url, new URL(post.cover, base).href);
    assert.equal(article.image.width, 1600);
    assert.equal(article.image.height, 900);
    assert.deepEqual(localImage(post.cover, base), { width: 1600, height: 900, type: 'image/webp' });
    for (const quote of post.quotes) {
      assert.ok(visibleText.includes(normalize(quote.text)), 'Approved quote is readable without JavaScript');
      assert.ok(tags(body, 'a').some(item => item.href === quote.image && item.download === quote.downloadName), 'Initial HTML exposes the actual quote download');
      assert.deepEqual(localImage(quote.image, base), { width: 1080, height: 1350, type: 'image/png' });
    }
    for (const image of tags(body, 'img')) {
      const dimensions = localImage(image.src, base);
      assert.ok(dimensions.width > 0 && dimensions.height > 0);
      if (image.width && image.height) assert.equal(Number(image.width) / Number(image.height), dimensions.width / dimensions.height, 'Declared image ratio matches the real asset');
    }
  }

  const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
  const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(match => ({
    loc: decodeHtml(match[1].match(/<loc>([\s\S]*?)<\/loc>/)[1]),
    lastmod: match[1].match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1],
  }));
  assert.equal(entries.length, new Set(entries.map(item => item.loc)).size, 'Every sitemap URL is unique');
  const expectedEntries = [
    { loc: `${base}/blog`, lastmod: BLOG_POSTS.map(post => post.modifiedAt).sort().at(-1) },
    ...BLOG_POSTS.map(post => ({ loc: `${base}${post.path}`, lastmod: post.modifiedAt })),
  ];
  for (const expected of expectedEntries) assert.deepEqual(entries.filter(item => item.loc === expected.loc), [expected], 'Each blog sitemap URL has its actual source date');

  for (const file of ['index.html', '404.html']) {
    const html = fs.readFileSync(path.join(dist, file), 'utf8');
    assert.ok(!bodyOf(html).includes('blog-static'), `${file}: blog fallback does not leak into other pages`);
    assert.ok(!html.includes('data-blog-static-style'), `${file}: blog-only styles are absent`);
    assert.equal(tags(html, 'meta').filter(item => item.property?.startsWith('article:')).length, 0, `${file}: no stale article metadata`);
    if (file === '404.html') {
      assert.equal(meta(html, 'robots'), 'noindex,nofollow');
      assert.ok(!html.includes('data-seo-jsonld'), '404 remains without structured data');
    }
  }

  console.log(`Blog SEO: ${BLOG_POSTS.length} article(s), initial visible content and list order, canonical/OG/Twitter, Blog/BlogPosting/breadcrumbs, authors/dates, PNG/WebP assets and source-driven unique sitemap passed. Home and 404 remain isolated.`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
