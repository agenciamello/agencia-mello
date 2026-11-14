/**
 * Assets editoriais próprios do Blog Mello — Issue #31.
 * As fotografias de entrada são ilustrações fictícias geradas com image_gen.
 * Não faz chamadas de IA nem baixa materiais de terceiros.
 * Ferramentas de rasterização ficam em artifacts e não são dependências do site.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';

const project = process.cwd();
const toolsDir = path.resolve(project, process.env.BLOG_ASSET_TOOLS || 'artifacts/blog-31/tools');
const requireTools = createRequire(path.join(toolsDir, 'package.json'));
const { Resvg } = requireTools('@resvg/resvg-js');
const sharp = requireTools('sharp');
const target = path.join(project, 'public/assets/blog/gta-vi');
const originals = path.join(project, 'artifacts/blog-31/originals');
await fs.mkdir(target, { recursive: true });

const [displayFont, bodyFont, logo] = await Promise.all([
  fs.readFile(path.join(toolsDir, 'SpaceGrotesk-Semibold.ttf')),
  fs.readFile(path.join(toolsDir, 'Inter-Medium.ttf')),
  fs.readFile(path.join(project, 'public/assets/agencia-mello-logo.png')),
]);
const paper = '#eeeae4', ink = '#0c0b0e', magenta = '#ec4899';
const logoUrl = `data:image/png;base64,${logo.toString('base64')}`;
const xml = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (content, x, y, size, fill = paper, family = 'Space Grotesk', extra = '') => `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${family === 'Inter' ? 500 : 600}" ${extra}>${xml(content)}</text>`;
const brand = (x, y, width = 220) => `<image href="${logoUrl}" x="${x}" y="${y}" width="${width}" height="${width * 289 / 803}" preserveAspectRatio="xMidYMid meet"/>`;
const svg = (width, height, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="asset-title asset-description">
<title id="asset-title">${xml(title)}</title>
<desc id="asset-description">Composição editorial autoral da Agência Mello. Texto editável. Não é material oficial da Rockstar Games.</desc>
<metadata>Fontes Space Grotesk e Inter, SIL Open Font License 1.1. Licenças anexas ao conjunto de assets. Logotipo oficial da Agência Mello incorporado sem redesenho.</metadata>
<defs><style>@font-face{font-family:'Space Grotesk';src:url(data:font/ttf;base64,${displayFont.toString('base64')}) format('truetype');font-weight:600}@font-face{font-family:'Inter';src:url(data:font/ttf;base64,${bodyFont.toString('base64')}) format('truetype');font-weight:500}text{font-kerning:normal}</style></defs>
${body}
</svg>`;

const stages = ['Preparar', 'Identificar', 'Mostrar', 'Contextualizar', 'Facilitar'];
const cover = svg(1600, 900, 'GTA VI e marketing — 5 lições para seu lançamento', `
<rect width="1600" height="900" fill="${ink}"/>
<path d="M80 155H1520M80 752H1520" stroke="${paper}" stroke-opacity=".22"/>
${brand(80, 58, 220)}
${text('BLOG DA MELLO / MARKETING NA PRÁTICA', 920, 107, 20, paper, 'Inter')}
${text('GTA VI', 74, 350, 158)}
${text('e marketing', 76, 478, 114, magenta)}
${text('5 lições para', 80, 610, 54)}
${text('seu lançamento', 80, 675, 54)}
${stages.map((stage, i) => {
  const y = 219 + i * 91;
  return `<rect x="1020" y="${y - 42}" width="500" height="76" rx="10" fill="${i === 4 ? magenta : '#17151b'}" stroke="${i === 4 ? magenta : '#38313d'}"/>
  ${text(String(i + 1).padStart(2, '0'), 1043, y + 7, 28, i === 4 ? ink : magenta, 'Inter')}
  ${text(stage, 1110, y + 8, 32, i === 4 ? ink : paper)}`;
}).join('')}
${text('DO PRIMEIRO POST AO PEDIDO.', 80, 815, 23, paper, 'Inter')}
${text('agenciamello.site/blog', 1210, 815, 20, '#b7aebb', 'Inter')}
`);

const quoteOne = 'Seu lançamento começa antes do “já disponível”.';
const quoteTwo = 'Comprar de você precisa ser mais fácil que uma missão do GTA.';
const cardOne = svg(1080, 1350, quoteOne, `
<rect width="1080" height="1350" fill="${paper}"/>
<rect x="0" y="0" width="18" height="1190" fill="${magenta}"/>
${text('PARA SALVAR / 01', 84, 140, 23, ink, 'Inter', 'letter-spacing="2"')}
<path d="M84 190H996" stroke="${ink}" stroke-opacity=".25"/>
${text('Seu lançamento', 78, 420, 100, ink)}
${text('começa antes', 78, 545, 100, ink)}
<rect x="78" y="580" width="600" height="132" rx="4" fill="${magenta}"/>
${text('do “já', 98, 682, 100, ink)}
${text('disponível”.', 78, 824, 100, ink)}
${text('PREPARE O INTERESSE.', 84, 1060, 25, ink, 'Inter')}
${text('DEPOIS, ABRA OS PEDIDOS.', 84, 1101, 25, ink, 'Inter')}
<rect x="0" y="1190" width="1080" height="160" fill="${ink}"/>
${brand(84, 1234, 205)}
${text('agenciamello.site/blog', 595, 1280, 26, paper, 'Inter')}
`);

const cardTwo = svg(1080, 1350, quoteTwo, `
<rect width="1080" height="1350" fill="${ink}"/>
<rect x="0" y="0" width="1080" height="18" fill="${magenta}"/>
${text('MARKETING NA PRÁTICA / 02', 84, 140, 23, paper, 'Inter', 'letter-spacing="1"')}
<path d="M84 190H996" stroke="${paper}" stroke-opacity=".25"/>
${text('Comprar de', 78, 385, 100)}
${text('você precisa ser', 78, 510, 100)}
${text('mais fácil que', 78, 635, 100, magenta)}
${text('uma missão', 78, 760, 100)}
${text('do GTA.', 78, 885, 100)}
<path d="M84 1036H960M928 1004L960 1036L928 1068" fill="none" stroke="${magenta}" stroke-width="5"/>
${text('UM CAMINHO CLARO ATÉ O PEDIDO.', 84, 1130, 23, paper, 'Inter')}
<path d="M84 1190H996" stroke="${paper}" stroke-opacity=".25"/>
${brand(84, 1234, 205)}
${text('agenciamello.site/blog', 595, 1280, 26, paper, 'Inter')}
`);

const graphics = [['capa', cover, 1600, 900], ['card-lancamento', cardOne, 1080, 1350], ['card-missao', cardTwo, 1080, 1350]];
const report = [];
for (const [name, source, width, height] of graphics) {
  await fs.writeFile(path.join(target, `${name}.svg`), source, 'utf8');
  const rendered = new Resvg(source, {
    font: { fontFiles: [path.join(toolsDir, 'SpaceGrotesk-Semibold.ttf'), path.join(toolsDir, 'Inter-Medium.ttf')], loadSystemFonts: false, defaultFontFamily: 'Space Grotesk' },
    fitTo: { mode: 'original' },
  }).render().asPng();
  const destination = path.join(target, name === 'capa' ? `${name}.webp` : `${name}.png`);
  if (name === 'capa') await sharp(rendered).webp({ quality: 90 }).toFile(destination);
  else await sharp(rendered).png({ compressionLevel: 9 }).toFile(destination);
  const metadata = await sharp(destination).metadata();
  assert.equal(metadata.width, width); assert.equal(metadata.height, height);
  report.push({ name: path.basename(destination), width, height, bytes: (await fs.stat(destination)).size, kind: 'composição editorial autoral; SVG editável e logo oficial incorporado' });
}
for (const name of ['pizza-close', 'pizza-mesa']) {
  const source = path.join(originals, `${name}.png`), destination = path.join(target, `${name}.webp`);
  await sharp(source).resize({ width: 1536, height: 1024, fit: 'cover' }).webp({ quality: 84 }).toFile(destination);
  const metadata = await sharp(destination).metadata();
  assert.equal(metadata.width, 1536); assert.equal(metadata.height, 1024);
  report.push({ name: `${name}.webp`, width: metadata.width, height: metadata.height, bytes: (await fs.stat(destination)).size, kind: 'imagem gerada com image_gen; pizzaria fictícia' });
}
await Promise.all([
  fs.copyFile(path.join(toolsDir, 'SpaceGrotesk-OFL.txt'), path.join(target, 'font-license-space-grotesk.txt')),
  fs.copyFile(path.join(toolsDir, 'Inter-OFL.txt'), path.join(target, 'font-license-inter.txt')),
]);
await fs.writeFile(path.join(project, 'artifacts/blog-31/assets-report.json'), JSON.stringify({ quotes: [quoteOne, quoteTwo], files: report }, null, 2));
console.log(JSON.stringify(report, null, 2));
