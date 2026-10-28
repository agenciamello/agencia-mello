# Agência Mello — sistema da experiência

## Direção atual — revisão de 28/10/2026

Composição editorial, clareza comercial e movimento derivado da identidade oficial. Refinar a experiência existente em React/Vite, preservando os avanços posteriores ao sprint editorial original. Nenhum cliente, prêmio ou resultado inventado. O estado de publicação está nas Issues e PRs, não neste documento.

## Identidade

- Base: #0c0b0e / #101014; hero preto.
- Papel: #eeeae4. Magenta: #ec4899. Texto escuro: #141217.
- Space Grotesk em títulos, Inter em texto; serifada pontual na conclusão.
- Arquivos oficiais `agencia-mello-logo.png` e `agencia-mello-icone.png`; não substituir por wordmark improvisado.
- Retrato colorido e nome completo: Matheus Mello.

## Composição

A headline aprovada “Sites e design para transformar interesse em VENDAS.” conduz o hero, acompanhada de descrição concreta dos serviços, CTA geral para WhatsApp e link para trabalhos. A aprovação de 28/10/2026, Issue #27, substitui o texto e a composição obrigatória em quatro linhas da revisão anterior: adaptar as quebras à leitura em desktop e mobile sem cortar ou abreviar a frase. O símbolo oficial aparece em vídeo silencioso WebM/MP4, com imagem estática para movimento reduzido, erro de mídia ou bloqueio de reprodução automática. Após a aprovação do túnel em 24/10/2026, o usuário pediu explicitamente remover o botão de pausa/reprodução do hero. Esse pedido substitui a exigência anterior de controle manual: não renderizar botão visível nem controle oculto no teclado.

O portfólio usa superfície clara, imagens amplas e assimetria. Animalis Pet lidera; Viana Planejados e Du-Rio são outras prévias comerciais. Bellavista e Solace ficam na camada secundária de estudos autorais. Preservar a explicação factual do status de cada projeto.

No capítulo 02, após as prévias e a oferta de sites, Design para eventos apresenta quatro artes em um bloco escuro com acentos magenta. Após a correção solicitada pelo usuário em 24/10/2026, usar o túnel espacial da referência: composição por ângulo dourado, viagem de -1700px a +500px em Z, opacidade escalonada, título central e paralaxe do ponteiro. O quadro sticky acompanha um trecho de rolagem nativa; não interceptar a roda. Em desktop com mouse, duas passagens das mesmas quatro artes formam o corredor, sem sugerir trabalhos adicionais. Em telas pequenas e dispositivos de toque, uma passagem de quatro artes usa composição e título menores, com percurso de 220svh, sem paralaxe do ponteiro. A galeria completa permanece logo abaixo, com atalho para pular o túnel. Por pedido explícito do usuário após a aprovação dos capítulos, o túnel também funciona no mobile com rolagem nativa por toque. A restrição anterior de não montar o efeito no celular foi substituída. Em movimento reduzido, não montar o túnel nem reservar espaço vazio; preservar a galeria estática. As peças preservam imagem integral e proporção, com ampliação em diálogo nativo, fechamento por Escape e retorno de foco. Originais são preservados e copiados para `public/assets/eventos`.

Serviços são capítulos integrados: sites, artes e identidade, com atalhos no resumo e navegação lateral por capítulo. Não repetir uma segunda seção extensa de serviços. Sobre preserva o retrato colorido; processo aparece em detalhes acessíveis dentro de sites e contato usa título geral e oferece quatro intenções opcionais para WhatsApp: site, identidade, redes e eventos. Sem seleção, a mensagem é neutra. A conclusão é magenta e o footer usa a assinatura oficial. O botão flutuante de WhatsApp aparece após a introdução.

Mobile tem composição e movimento próprios, com leitura em fluxo nativo e sem dependência de hover. O túnel de eventos é a exceção sticky solicitada: acompanha o gesto vertical sem interceptar a rolagem ou impedir pinch-zoom; palco ajustado ao cabeçalho e orientação. Validar 390, 360 e 320px, além de 768, 1024 e 1440px.

## Motion

O resumo concreto de serviços aparece após o hero. Por pedido explícito do usuário, os exemplos Animalis/Viana/Du-Rio continuam antes do preço e do capítulo de artes. Na revisão de 28/10/2026, o Site Essencial fica sozinho em destaque; Site + Divulgação e Site para Campanha aparecem ao abrir “Ver outros pacotes”, fechado por padrão. Preservar leitura imediata sem reveal nos preços, preço anterior do Essencial riscado e identificado, preços vigentes em magenta e condições legíveis. Em desktop, o Essencial usa oferta e preço em duas colunas e os outros pacotes abrem lado a lado; em mobile, todos seguem em uma coluna, sem carrossel. Diferenciar prévia grátis e pagamento após aprovação do Essencial do pagamento 50%/50% dos novos pacotes. O link secundário do hero aponta aos trabalhos; o contato mantém intenção geral coerente com todos os serviços.

Tokens compartilhados em `src/lib/motion-tokens.ts`, consumidos por `StudioMotion.tsx` e pelo text reveal: micro 220ms, reveal 620ms, seção 900ms, stagger 80ms; ease `power3.out`. CSS usa `cubic-bezier(.22,1,.36,1)`. Timelines específicas variam conforme o elemento.

- Hero: entrada tipográfica por máscaras, vídeo da marca e profundidade discreta em desktop.
- Portfólio: tese por palavras, recortes de imagens e profundidade ligada à rolagem.
- Serviços: entradas sequenciais e movimento interno das peças; amplitudes próprias no mobile.
- Sobre: entrada de texto e retrato; processo: etapas estáticas em detalhes acessíveis, sem depender de animação; contato: revelação tipográfica.
- Subpáginas: mesma linguagem de entradas, imagens e grupos de informações.
- Magnetismo sutil nos CTAs principais apenas com mouse em desktop. Sem scroll hijacking ou cursor substituto.
- Vídeo pausa fora da viewport e em aba oculta, retomando automaticamente quando o hero fica visível e a aba volta a ficar ativa.
- Marquee pausa fora da viewport e em aba oculta. Não usar canvas ou WebGL na experiência ativa.

GSAP/ScrollTrigger são importados dinamicamente. Manter cleanup de timelines, observers, listeners e RAF nas trocas de rota, breakpoint e preferência. Não adicionar animação a cada elemento por padrão.

## Acessibilidade e comportamento

Conteúdo disponível sem depender de animação. `prefers-reduced-motion` troca o vídeo pela imagem, desliga timelines, marquee, transições e rolagem animada, inclusive quando muda durante a sessão. Foco visível, skip link, Escape no menu, fechamento ao selecionar a mesma âncora e alvos de toque confortáveis. O vídeo decorativo fica fora da árvore de acessibilidade; seu controle manual foi retirado por pedido explícito do usuário em 24/10/2026.

## Verificação

`npm run lint` e `npm run typecheck` executam TypeScript; não há linter separado. `npm run build` gera o bundle e HTML estático com metadata por rota.

`npm test` cobre responsividade, rotas, navegação, motion e axe. `tests/sprint.cjs` cobre CTA, mensagens, teclado, ausência do botão de vídeo, pausa/retomada automática e movimento reduzido. As suítes de copy, portfólio e SEO complementam esses fluxos; `tests/seo-navigation.cjs` cobre barras finais e metadata durante navegação interna. Sempre definir `SITE_URL` para a instância verificada, com Chrome instalado.

Capturas e resultados em `artifacts` são locais e ignorados pelo Git. Inspecionar screenshots reais; aprovação de build não equivale a aprovação visual ou conformidade WCAG completa.

## Histórico

Os passes de setembro (impacto, Motion V2 e Mobile V3) evoluíram com vídeo no hero, novas prévias comerciais, revisão de copy e motion das subpáginas. Esta especificação substitui as descrições antigas de hero em planos sem vídeo e de mobile sem parallax.

## Revelação editorial — revisão do usuário

O componente enviado pelo usuário foi adaptado em `src/components/ui/text-reveal.tsx`, com demo, estilos próprios e tokens compartilhados. Abertura das soluções, título do capítulo de sites e tese do Animalis revelam palavras com blur leve e deslocamento ao entrar na viewport, uma vez por visita à página. Remover a timeline antiga da tese; os mesmos elementos não podem receber GSAP e Motion simultaneamente. Textos de apoio, linhas de contexto e cards comerciais entram com deslocamento discreto em GSAP, iniciando cedo o suficiente para completar antes da leitura principal. Movimento reduzido entrega os títulos estáticos imediatamente, inclusive quando a preferência muda durante a sessão; segmentos visuais não duplicam a leitura assistiva. Não animar preço, trocar imagens/copy ou modificar o túnel nesta revisão.

## Exceção aprovada — Sprint Vendas, Issue #27

O pedido explícito do usuário de 28/10/2026 autoriza a nova copy comercial, as headlines de artes/eventos e o layout dos três pacotes, substituindo a restrição anterior de não trocar copy nesta revisão. Preservar logo, cores, retrato colorido, rotas, hierarquia factual, animações existentes e túnel de eventos. A mudança é editorial/comercial; não iniciar redesign, criar efeitos adicionais ou instalar rastreadores da agência. Informação técnica das ofertas fica em detalhes acessíveis quando necessária para a decisão, sem alongar a leitura principal.

### Refinamento da prévia — foco no Essencial

O usuário considerou muitos preços simultâneos e substituiu os três cards abertos por um destaque único para o Site Essencial. “Ver outros pacotes” é um botão de expansão nativo (summary/details), fechado por padrão, que revela Divulgação/Campanha. Desktop usa duas colunas no Essencial (oferta e preço/CTA); mobile mantém fluxo em uma coluna. Preservar teclado, foco, âncoras de cada pacote e refresh das animações quando a expansão muda a altura. Links diretos dos pacotes adicionais abrem o painel antes de posicionar o conteúdo.
