# Agência Mello — sistema da experiência

## Direção atual — 16/10/2026

Composição editorial, clareza comercial e movimento derivado da identidade oficial. Refinar a experiência existente em React/Vite, preservando os avanços posteriores ao sprint editorial original. Nenhum cliente, prêmio ou resultado inventado. O estado de publicação está nas Issues e PRs, não neste documento.

## Identidade

- Base: #0c0b0e / #101014; hero preto.
- Papel: #eeeae4. Magenta: #ec4899. Texto escuro: #141217.
- Space Grotesk em títulos, Inter em texto; serifada pontual na conclusão.
- Arquivos oficiais `agencia-mello-logo.png` e `agencia-mello-icone.png`; não substituir por wordmark improvisado.
- Retrato colorido e nome completo: Matheus Mello.

## Composição

O título em quatro linhas conduz o hero, acompanhado de CTA para WhatsApp e link para o processo. O símbolo oficial aparece em vídeo silencioso WebM/MP4, com imagem estática para movimento reduzido ou erro de mídia. Um controle discreto permite pausar e reproduzir a animação por clique ou teclado.

O portfólio usa superfície clara, imagens amplas e assimetria. Animalis Pet lidera; Viana Planejados e Du-Rio são outras prévias comerciais. Bellavista e Solace ficam na camada secundária de estudos autorais. Preservar a explicação factual do status de cada projeto.

Entre as prévias comerciais e os estudos autorais, Design para eventos apresenta quatro artes em um bloco escuro com acentos magenta. A perspectiva no desktop adapta a referência de túnel à rolagem nativa, sem pinning, captura da roda ou imagens ocultas. No mobile e em movimento reduzido, usar galeria estática. As peças preservam imagem integral e proporção, com ampliação em diálogo nativo, fechamento por Escape e retorno de foco. Originais são preservados e copiados para `public/assets/eventos`.

Serviços usam índice sticky em desktop e capítulos próprios. Sobre preserva o retrato colorido; processo apresenta etapas e contato oferece três intenções opcionais para WhatsApp. A conclusão é magenta e o footer usa a assinatura oficial. O botão flutuante de WhatsApp aparece após a introdução.

Mobile tem composição e movimento próprios, com leitura em fluxo nativo, sem pinning ou dependência de hover. Validar 390, 360 e 320px, além de 768, 1024 e 1440px.

## Motion

Tokens atuais em `StudioMotion.tsx`: micro 220ms, reveal 620ms, seção 900ms, stagger 80ms; ease `power3.out`. CSS usa `cubic-bezier(.22,1,.36,1)`. Timelines específicas variam conforme o elemento.

- Hero: entrada tipográfica por máscaras, vídeo da marca e profundidade discreta em desktop.
- Portfólio: tese por palavras, recortes de imagens e profundidade ligada à rolagem.
- Serviços: entradas sequenciais e movimento interno das peças; amplitudes próprias no mobile.
- Sobre: entrada de texto e retrato; processo: título e progressão das etapas; contato: revelação tipográfica.
- Subpáginas: mesma linguagem de entradas, imagens e grupos de informações.
- Magnetismo sutil nos CTAs principais apenas com mouse em desktop. Sem scroll hijacking ou cursor substituto.
- Vídeo pausa fora da viewport e em aba oculta; voltar ao hero não desfaz uma pausa escolhida pelo visitante.
- Marquee pausa fora da viewport e em aba oculta. Não usar canvas ou WebGL na experiência ativa.

GSAP/ScrollTrigger são importados dinamicamente. Manter cleanup de timelines, observers, listeners e RAF nas trocas de rota, breakpoint e preferência. Não adicionar animação a cada elemento por padrão.

## Acessibilidade e comportamento

Conteúdo disponível sem depender de animação. `prefers-reduced-motion` troca o vídeo pela imagem, desliga timelines, marquee, transições e rolagem animada, inclusive quando muda durante a sessão. Foco visível, skip link, Escape no menu, fechamento ao selecionar a mesma âncora e alvos de toque confortáveis. O controle do vídeo deve permanecer acessível, fora de qualquer ancestral `aria-hidden`.

## Verificação

`npm run lint` e `npm run typecheck` executam TypeScript; não há linter separado. `npm run build` gera o bundle e HTML estático com metadata por rota.

`npm test` cobre responsividade, rotas, navegação, motion e axe. `tests/sprint.cjs` cobre CTA, mensagens, teclado, pausa do vídeo e movimento reduzido. As suítes de copy, portfólio e SEO complementam esses fluxos; `tests/seo-navigation.cjs` cobre barras finais e metadata durante navegação interna. Sempre definir `SITE_URL` para a instância verificada, com Chrome instalado.

Capturas e resultados em `artifacts` são locais e ignorados pelo Git. Inspecionar screenshots reais; aprovação de build não equivale a aprovação visual ou conformidade WCAG completa.

## Histórico

Os passes de setembro (impacto, Motion V2 e Mobile V3) evoluíram com vídeo no hero, novas prévias comerciais, revisão de copy e motion das subpáginas. Esta especificação substitui as descrições antigas de hero em planos sem vídeo e de mobile sem parallax.
