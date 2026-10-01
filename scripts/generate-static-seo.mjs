import fs from 'node:fs/promises';
import path from 'node:path';
import { SEO_ROUTES, SEO_SITE, buildStructuredData, getSeoForPath } from '../src/data/seoRoutes.js';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');
const baseHtml = await fs.readFile(indexPath, 'utf8');

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function replaceTag(html, regex, replacement, label) {
  if (!regex.test(html)) throw new Error(`SEO build: tag not found for ${label}`);
  return html.replace(regex, replacement);
}

function renderRoute(pathname, fallbackTitle) {
  const seo = getSeoForPath(pathname, fallbackTitle);
  let html = baseHtml;

  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`, 'title');
  html = replaceTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(seo.description)}" />`, 'description');
  html = replaceTag(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${escapeHtml(seo.robots)}" />`, 'robots');
  html = replaceTag(html, /<meta name="googlebot" content="[^"]*" \/>/, `<meta name="googlebot" content="${escapeHtml(seo.robots)}" />`, 'googlebot');

  html = replaceTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${seo.canonical}" />`, 'canonical');
  html = replaceTag(html, /<link rel="alternate" hreflang="pt-BR" href="[^"]*" \/>/, `<link rel="alternate" hreflang="pt-BR" href="${seo.canonical}" />`, 'hreflang pt-BR');
  html = replaceTag(html, /<link rel="alternate" hreflang="x-default" href="[^"]*" \/>/, `<link rel="alternate" hreflang="x-default" href="${seo.canonical}" />`, 'hreflang x-default');

  html = replaceTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(seo.title)}" />`, 'og:title');
  html = replaceTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(seo.description)}" />`, 'og:description');
  html = replaceTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${seo.type}" />`, 'og:type');
  html = replaceTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${seo.canonical}" />`, 'og:url');
  html = replaceTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${seo.image}" />`, 'og:image');
  html = replaceTag(html, /<meta property="og:image:secure_url" content="[^"]*" \/>/, `<meta property="og:image:secure_url" content="${seo.image}" />`, 'og:image:secure_url');
  html = replaceTag(html, /<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />`, 'og:image:alt');

  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`, 'twitter:title');
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`, 'twitter:description');
  html = replaceTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${seo.image}" />`, 'twitter:image');
  html = replaceTag(html, /<meta name="twitter:image:alt" content="[^"]*" \/>/, `<meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />`, 'twitter:image:alt');

  const structuredData = buildStructuredData(pathname, fallbackTitle);
  html = html.replace(/\s*<script type="application\/ld\+json" data-seo-jsonld>.*?<\/script>/gs, '');
  if (structuredData && !Array.isArray(structuredData)) {
    const json = JSON.stringify(structuredData).replaceAll('</script', '<\\/script');
    html = html.replace('</head>', `    <script type="application/ld+json" data-seo-jsonld>${json}</script>\n  </head>`);
  }

  return html;
}

for (const pathname of Object.keys(SEO_ROUTES)) {
  const html = renderRoute(pathname, SEO_ROUTES[pathname].title);
  if (pathname === '/') {
    await fs.writeFile(indexPath, html, 'utf8');
    continue;
  }

  const routeDir = path.join(distDir, ...pathname.split('/').filter(Boolean));
  await fs.mkdir(routeDir, { recursive: true });
  await fs.writeFile(path.join(routeDir, 'index.html'), html, 'utf8');
}

const notFoundHtml = renderRoute('/pagina-inexistente', 'Página não encontrada | Agência Mello');
await fs.writeFile(path.join(distDir, '404.html'), notFoundHtml, 'utf8');

console.log(`SEO static HTML: ${Object.keys(SEO_ROUTES).length} routes + 404 generated for ${SEO_SITE.url}`);
