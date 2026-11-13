const { chromium, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const base = (process.env.SITE_URL || 'http://127.0.0.1:4191').replace(/\/$/, '');
const output = process.env.BLOG_ARTIFACTS || 'artifacts/blog-31/qa';

async function noOverflow(page, label) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${label}: no page overflow`);
}

async function initShare(context, mode = 'success') {
  await context.addInitScript(value => {
    window.__blogCopied = [];
    window.__blogShared = [];
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async text => {
        if (value === 'manual') throw new DOMException('Denied', 'NotAllowedError');
        window.__blogCopied.push(text);
      },
    }});
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: data => Boolean(data.files?.length) });
    Object.defineProperty(navigator, 'share', { configurable: true, value: async data => {
      if (value === 'abort') throw new DOMException('Cancelled', 'AbortError');
      if (value === 'manual') throw new DOMException('Unavailable', 'NotAllowedError');
      window.__blogShared.push({ ...data, files: data.files?.map(file => ({ name: file.name, size: file.size, type: file.type })) });
    }});
  }, mode);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const { GTA_MARKETING_POST: post } = await import(pathToFileURL(path.resolve('src/data/blogPosts.js')).href);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const evidence = [], errors = [];
  try {
    for (const width of [1440, 1024, 768, 390, 360, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await initShare(context);
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const response = await page.goto(`${base}/blog`, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('.blog-featured')).toHaveCount(1);
      await expect(page.locator('.whatsapp-float')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.agenciamello.site/blog');
      await noOverflow(page, `Blog ${width}`);
      if ([1440, 390].includes(width)) {
        assert.deepEqual((await new AxeBuilder({ page }).include('main').analyze()).violations.map(v => v.id), [], `Blog axe ${width}`);
        await page.screenshot({ path: `${output}/index-${width}.png` });
      }
      await page.getByRole('link', { name: 'Ler a matéria', exact: true }).click();
      await expect(page.locator('main h1')).toHaveText(post.title);
      await expect(page.locator('.blog-lesson')).toHaveCount(5);
      await expect(page.locator('.blog-quote-card')).toHaveCount(2);
      await expect(page.locator('.blog-game-figure')).toHaveCount(2);
      for (const image of post.inlineImages) {
        const figure = page.locator(`#${image.sectionId} .blog-game-figure`);
        await expect(figure.locator('img')).toHaveAttribute('src', image.src);
        await expect(figure.locator('img')).toHaveAttribute('alt', image.alt);
        await expect(figure.locator('figcaption')).toContainText(image.caption);
        await expect(figure.locator('figcaption')).toContainText(image.credit);
        assert.ok(await figure.evaluate((element, preceding) => element.previousElementSibling?.textContent === preceding, post.sections.find(section => section.id === image.sectionId).paragraphs[image.afterParagraph]), 'Photo interrupts the intended text block');
      }
      await expect(page.locator('.whatsapp-float')).toHaveCount(0);
      for (const section of post.sections) {
        await expect(page.locator(`#${section.id} h2`)).toHaveText(section.title);
        for (const paragraph of section.paragraphs) await expect(page.locator(`#${section.id}`)).toContainText(paragraph);
      }
      await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', post.publishedAt);
      await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute('content', 'image/webp');
      const graph = JSON.parse(await page.locator('script[data-seo-jsonld]').textContent())['@graph'];
      const article = graph.find(node => node['@type'] === 'BlogPosting');
      assert.equal(article.headline, post.title);
      assert.equal(article.author['@id'], 'https://www.agenciamello.site/#organization');
      await page.getByRole('button', { name: 'Copiar link', exact: true }).click();
      assert.equal((await page.evaluate(() => window.__blogCopied)).at(-1), `${base}${post.path}`);
      await page.getByRole('button', { name: 'Compartilhar artigo', exact: true }).click();
      assert.equal((await page.evaluate(() => window.__blogShared)).at(-1).url, `${base}${post.path}`);
      for (const [index, quote] of post.quotes.entries()) {
        await page.getByRole('button', { name: `Compartilhar frase: ${quote.text}`, exact: true }).click();
        await expect.poll(() => page.evaluate(() => window.__blogShared.at(-1)?.text)).toBe(quote.text);
        const shared = (await page.evaluate(() => window.__blogShared)).at(-1);
        assert.equal(shared.text, quote.text);
        assert.equal(shared.url, `${base}${post.path}#${quote.id}`);
        assert.equal(shared.files[0].type, 'image/png');
        assert.ok(shared.files[0].size > 1000);
        const downloaded = page.waitForEvent('download');
        await page.getByRole('link', { name: `Baixar card da frase ${index + 1}`, exact: true }).click();
        const file = await downloaded;
        assert.equal(file.suggestedFilename(), quote.downloadName);
        const bytes = fs.readFileSync(await file.path());
        assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
        assert.equal(bytes.readUInt32BE(16), 1080); assert.equal(bytes.readUInt32BE(20), 1350);
      }
      for (const img of await page.locator('main img').all()) {
        if (!await img.isVisible()) continue;
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate(e => e.complete && e.naturalWidth > 0), { timeout: 15000 }).toBe(true);
      }
      const mobileToc = await page.locator('.blog-mobile-toc').isVisible();
      const toc = mobileToc ? page.locator('.blog-mobile-toc') : page.locator('.blog-toc');
      if (mobileToc) await toc.locator('summary').click();
      await toc.getByRole('link', { name: new RegExp(post.sections[4].title) }).click();
      await expect(page.locator(`#${post.sections[4].id} h2`)).toBeInViewport();
      assert.ok(await page.locator(`#${post.sections[4].id} h2`).evaluate(e => e.getBoundingClientRect().top >= document.querySelector('header.studio-header').getBoundingClientRect().bottom), 'Anchor heading clears sticky header');
      await noOverflow(page, `Article ${width}`);
      if ([1440, 390].includes(width)) {
        const accessibility = await new AxeBuilder({ page }).include('main').analyze();
        fs.writeFileSync(`${output}/axe-article-${width}.json`, JSON.stringify(accessibility.violations, null, 2));
        assert.deepEqual(accessibility.violations.map(v => v.id), [], `Article axe ${width}`);
        await page.locator('.blog-quote-section').screenshot({ path: `${output}/cards-${width}.png` });
        await page.locator('.blog-article-head').scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/article-${width}.png` });
      }
      await page.getByRole('link', { name: 'Voltar ao blog', exact: true }).first().click();
      await expect(page.locator('.blog-index')).toBeVisible();
      await expect(page.locator('meta[property="article:published_time"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
      const menu = page.locator('.menu-toggle');
      if (await menu.isVisible()) {
        await menu.focus(); await menu.press('Enter');
        await expect(menu).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Escape');
        await expect(menu).toBeFocused();
        await menu.press('Enter');
      }
      await page.getByRole('navigation', { name: 'Navegação principal', exact: true }).getByRole('link', { name: 'Blog', exact: true }).click();
      if (await menu.isVisible()) await expect(menu).toHaveAttribute('aria-expanded', 'false');
      await page.goto(`${base}${post.path}/`, { waitUntil: 'networkidle' });
      await expect(page.locator('main h1')).toHaveText(post.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.agenciamello.site${post.path}`);
      await page.goto(`${base}/blog/artigo-inexistente`, { waitUntil: 'networkidle' });
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
      await expect(page.locator('script[data-seo-jsonld]')).toHaveCount(0);
      evidence.push({ width, routes: 'index, article, trailing slash, unknown', content: 'five lessons, two cards', interactions: 'menu/keyboard/toc, copy/share/download', overflow: false });
      await context.close();
    }

    const review = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await initShare(review);
    const reviewPage = await review.newPage();
    await reviewPage.goto(`${base}/?_vercel_share=qa-review`, { waitUntil: 'networkidle' });
    await expect(reviewPage.locator('.whatsapp-float')).toHaveCount(1);
    await reviewPage.getByRole('navigation', { name: 'Navegação principal', exact: true }).getByRole('link', { name: 'Blog', exact: true }).click();
    await expect(reviewPage).toHaveURL(`${base}/blog?_vercel_share=qa-review`);
    await reviewPage.getByRole('link', { name: 'Ler a matéria', exact: true }).click();
    await reviewPage.getByRole('button', { name: 'Copiar link', exact: true }).click();
    assert.equal((await reviewPage.evaluate(() => window.__blogCopied)).at(-1), `${base}${post.path}?_vercel_share=qa-review`);
    await review.close();

    for (const mode of ['manual', 'abort']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await initShare(context, mode);
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}${post.path}`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Compartilhar artigo', exact: true }).click();
      if (mode === 'manual') {
        await expect(page.getByLabel('Link para copiar', { exact: true })).toHaveValue(`${base}${post.path}`);
        await expect(page.getByLabel('Link para copiar', { exact: true })).toBeFocused();
      } else {
        await expect(page.getByLabel('Link para copiar', { exact: true })).toHaveCount(0);
        assert.deepEqual(await page.evaluate(() => window.__blogCopied), []);
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(page.locator('main h1')).toBeVisible();
      assert.ok(await page.locator('.blog-article-intro').evaluate(e => getComputedStyle(e).opacity === '1'));
      await context.close();
    }

    // A slow card image must not delay the native share handoff after a click.
    const slowShare = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await initShare(slowShare);
    let releaseImages;
    const imageGate = new Promise(resolve => { releaseImages = resolve; });
    await slowShare.route('**/card-*.png', async route => { await imageGate; await route.continue().catch(() => {}); });
    const slowPage = await slowShare.newPage();
    await slowPage.goto(`${base}${post.path}`, { waitUntil: 'domcontentloaded' });
    await expect(slowPage.locator('main h1')).toHaveText(post.title);
    await slowPage.getByRole('button', { name: `Compartilhar frase: ${post.quotes[0].text}`, exact: true }).click();
    await expect.poll(() => slowPage.evaluate(() => window.__blogShared.length), { timeout: 1500 }).toBe(1);
    assert.equal((await slowPage.evaluate(() => window.__blogShared[0])).text, post.quotes[0].text);
    releaseImages();
    await slowShare.close();

    const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const staticPage = await noJs.newPage();
    // Vite preview omits Vercel's rewrites. Read the generated files locally;
    // natural deployed URLs are checked again in the remote preview smoke.
    const localPreview = ['127.0.0.1', 'localhost'].includes(new URL(base).hostname);
    await staticPage.goto(`${base}/blog${localPreview ? '/index.html' : ''}`, { waitUntil: 'load' });
    await expect(staticPage.locator('main h1')).toHaveText('Blog da Mello');
    await expect(staticPage.getByRole('link', { name: 'Ler artigo', exact: true })).toHaveAttribute('href', post.path);
    if (localPreview) await staticPage.goto(`${base}${post.path}/index.html`, { waitUntil: 'load' });
    else await staticPage.getByRole('link', { name: 'Ler artigo', exact: true }).click();
    await expect(staticPage.locator('main h1')).toHaveText(post.title);
    await expect(staticPage.getByRole('heading', { name: post.sections[0].title, exact: true })).toHaveCount(1);
    await noOverflow(staticPage, 'No-JS mobile article');
    await noJs.close();
    assert.deepEqual(errors, []);
    fs.writeFileSync(`${output}/report.json`, JSON.stringify({ base, evidence, shareLimits: 'Native share handoff and failures simulated; no messages sent. Chrome responsive emulation, no physical-device/Safari acceptance.', errors }, null, 2));
    console.log('Blog: six widths, real article, routes/SEO, menus/keyboard/anchors, PNG downloads, share/copy/manual/cancel, reduced motion, no-JS content, axe and no overflow/errors passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
