# Validação final do sprint editorial — Issue #17

## Continuidade e escopo

[Issue #17](https://github.com/agenciamello/agencia-mello/issues/17), branch `improvement/17-validacao-final`, base `63eddc92ad6a51b9c12894b5351f08c00098ec18`. O refinamento original foi integrado em `6e5ce0f` / merge `6258778`. A retomada de 16/10/2026 preserva os trabalhos posteriores, incluindo vídeo no hero, novas prévias comerciais, copy e páginas locais.

O usuário confirmou Animalis Pet no destaque principal, com Viana Planejados e Du-Rio entre as demais prévias comerciais. Essa decisão substitui o destaque de Viana no pedido inicial. Bellavista e Solace continuam estudos autorais secundários. Copy, oferta, logo, retrato e rotas preservados.

## Auditoria e direção

O diagnóstico inicial da Issue #17 priorizou: símbolo excessivamente ampliado no hero; quebra comprimida do título mobile; narrativa comercial insuficiente no Viana; microtipografia pequena; ritmo desigual entre capítulos; movimento concorrente; foco com contraste insuficiente na seção rosa. O histórico já incorporou o refinamento editorial, então a retomada avalia a experiência atual sem reaplicar a composição anterior.

Direção mantida: headline dominante, espaço negativo, superfície clara no portfólio, três prévias comerciais com status factual e estudos secundários, movimento com amplitude própria por dispositivo e CTAs claros.

Achados finais e correções:

- Cinco erros TS2347 nas animações das páginas locais: tipagem explícita dos elementos dos callbacks, sem alterar a coreografia.
- Vídeo em loop sem pausa: controle acessível por teclado, pausa fora da viewport/aba e preservação da pausa escolhida pelo visitante. Movimento reduzido mantém imagem estática.
- URLs válidas com barra final recebiam `noindex` após hidratação: pathname normalizado para lookup e canonical.
- Navegação SPA deixava `og:image:secure_url` da página anterior: sincronização com `og:image`.
- A verificação ampla do axe na prévia encontrou a seção de contato fora de landmarks nomeados. A seção recebeu nome acessível, sem mudança visual ou de copy.
- PRODUCT/DESIGN descreviam uma versão anterior: documentação alinhada à hierarquia confirmada e ao vídeo atual.
- O teste de densidade esperava 210 palavras nos serviços, mas a produção aprovada com navegação de três cidades tem 212. Limite ajustado para 212 após reprodução na produção; texto público preservado.

## Verificações executadas

Chrome instalado nesta máquina; build servido em `http://127.0.0.1:3018`. Desenvolvimento em `http://127.0.0.1:3017` usado para reproduções e algumas verificações iniciais. `SITE_URL` definido explicitamente em todas as suítes.

- `npm run lint`, `npm run typecheck`, `npm run build`: aprovados. Lint/typecheck executam o mesmo TypeScript. Build gera 12 HTMLs de rotas e 404.
- `npm test`: 13 rotas × 6 larguras (1440, 1024, 768, 390, 360 e 320), navegação, teclado, foco, motion e reduced motion aprovados; nenhum erro de página, overflow ou imagem quebrada. Axe: zero violações detectadas em 14 combinações de página/largura.
- `node tests/sprint.cjs`: CTA e hover, WhatsApp, três intenções, teclado, pausa/retomada do vídeo, pausa fora da viewport e movimento reduzido aprovados.
- `node tests/copy-seo.cjs`, `copy-density.cjs`, `portfolio-real.cjs`, `local-seo.cjs`, `technical-seo.cjs`: aprovados. Densidade: home 749 palavras, serviços 212, Site Essencial 253; nenhuma copy comercial alterada nesta conclusão.
- `node tests/seo-navigation.cjs`: 12 URLs com barra final e cinco transições SPA reais aprovadas, com metadata e JSON-LD coerentes.
- Revisão independente do diff: sem bloqueios materiais. Probe adicional confirmou pausa preservada após alternar reduced motion, vídeo removido pausado na navegação e nenhum erro de página.

## Inspeção visual

Capturas reais da produção nas seis larguras e dos capítulos em `artifacts/current-production`, diretório local ignorado. A revisão confirmou a hierarquia Animalis → outras prévias → estudos, leitura dos títulos e consistência entre superfícies e seções. A produção base não apresentou erros de console/página, imagens quebradas ou overflow nas larguras capturadas.

A primeira versão do controle com texto cobria a base da marca no mobile e cruzava a linha decorativa no desktop. Foi substituída por ícone de 18px em área de 44px, com `aria-label` e `title`, afastado da linha. Capturas finais identificadas pelo sufixo `final`.

## Limites e publicação

Os testes automatizados e a inspeção não representam certificação WCAG completa. O comportamento preexistente de HTTP 200/metadata inicial da home para URLs desconhecidas foi reproduzido e separado na [Issue #21](https://github.com/agenciamello/agencia-mello/issues/21). O conteúdo visual de página inexistente e o `noindex` após hidratação continuam funcionando.

A produção foi confirmada como integração Git da branch `main` na Vercel, projeto `agenciamello`, com domínio `https://www.agenciamello.site`. Preview, revisão, merge e verificação da publicação desta conclusão são registrados no PR vinculado à Issue #17 após sua execução. Não há deploy manual direto ou mudança de integração neste trabalho.
