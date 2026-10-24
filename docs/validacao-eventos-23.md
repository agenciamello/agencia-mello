# Design para eventos — validação da Issue #23

Data: 24/10/2026. Issue: https://github.com/agenciamello/agencia-mello/issues/23.

## Entrega

Bloco no portfólio, entre as prévias comerciais e os estudos autorais, com São Simão Folia, Pagô Pra Ver (agenda), Bloco do Mello e Conexão dos Crias. As quatro cópias WebP têm SHA-256 idêntico aos arquivos fornecidos pelo usuário. Nenhuma arte, rosto, texto ou proporção foi alterado.

Na revisão solicitada em 24/10/2026, a grade inclinada da primeira prévia foi substituída pelo túnel espacial do componente anexado. O componente em `src/components/ui/perspective-tunnel-hero.tsx` preserva ângulo dourado de 137,5°, profundidade de -1700px a +500px, distribuição escalonada das opacidades, título central com escala e paralaxe do ponteiro. As mesmas quatro peças aparecem em duas passagens; isso não representa oito trabalhos distintos.

O quadro sticky usa a rolagem nativa, sem capturar a roda. A galeria integral permanece abaixo, com atalho para pular a passagem e ampliar cada peça. No mobile e em movimento reduzido o túnel não é montado. Motion/React reutiliza o pacote `motion` já existente, sem instalação de dependência, e carrega em um bloco separado apenas quando habilitado. Após o ajuste final no hero, a entrada principal ficou em 383,45kB, e o bloco do túnel em 137,05kB (45,34kB gzip).

O efeito também está disponível em janelas de computador mais estreitas, a partir de 701px com mouse/ponteiro fino; telas de toque e movimento reduzido mantêm a galeria. O quadro foi conferido especificamente em 768px, sem overflow.

Ampliação em diálogo com foco contido, Escape, botão de fechar e retorno ao botão de origem. O WhatsApp usa intenção própria de orçamento para evento, sem enviar mensagem automaticamente. A mudança de altura ao ativar/desativar o túnel atualiza as posições das animações dos capítulos seguintes.

## Verificações executadas

- `npm run lint`: TypeScript aprovado, saída 0.
- `npm run build`: bundle e HTML estático das 12 rotas mais 404 gerados, saída 0.
- `SITE_URL=http://127.0.0.1:4176 npm test`: 13 rotas em seis larguras; navegação, motion e interações aprovados, sem erros de página. Axe sem violações nas 14 combinações de rota/largura examinadas pela suíte. Saída 0, na versão de publicação da revisão.
- `SITE_URL=http://127.0.0.1:4176 node tests/sprint.cjs`: CTA, destino, três intenções de WhatsApp, teclado, ausência do botão de vídeo, pausa/retomada automática e movimento reduzido aprovados, saída 0.
- `SITE_URL=http://127.0.0.1:4176 node tests/event-portfolio.cjs`: saída 0. Ordem no portfólio, quatro imagens completas, seis larguras (1440, 1024, 768, 390, 360 e 320px), galeria estática, ampliação por teclado/toque, foco, proporção da ampliação, mudança de movimento reduzido em tempo real, limpeza ao trocar de rota e CTA correto. Axe sem violações no bloco nas seis larguras e no diálogo aberto em desktop.
- `SITE_URL=http://127.0.0.1:4176 node tests/event-tunnel.cjs`: saída 0. Regressão reproduzida antes da correção (a grade antiga não continha o túnel). A revisão verifica deslocamento em Z superior a 900px, ampliação visual superior a 1,8 vez, passagem diante da câmera com fade, viewport sticky, paralaxe, roda nativa, atalho por teclado e remoção do túnel ao ativar movimento reduzido ou redimensionar para celular. Amostra real do primeiro card: -1125,83px no início, +264,65px no meio e +500px com opacidade zero no fim.
- Falha de rede simulada em uma arte: outras três continuam disponíveis; mensagem de falha aparece, ampliação oferece tentar novamente e a recuperação carrega a arte após restaurar a rede.
- Capturas reais em seis larguras, ampliação desktop/mobile, movimento reduzido e três fases do túnel inspecionadas. Demonstração WebM de 1440×900 gravada sobre o build local e decodificada integralmente com FFmpeg, saída 0. Evidências locais ignoradas em `artifacts/eventos-23`; contrato e registro JSON conferidos com o checker de evidências da skill de direção de frontend.
- `git diff --check`: aprovado.

## Preview e publicação

Branch: `improvement/23-design-eventos`, criada a partir de `origin/main` atualizado (`063e12e`). Remoto confirmado: `agenciamello/agencia-mello`. Produção atual confirmada na Vercel como `source=git`, branch `main`, commit `063e12eff10e2ce39fa373634bd572b2597d6868`.

PR: https://github.com/agenciamello/agencia-mello/pull/24. A preview atualizada e o commit desta revisão serão registrados no PR e na Issue #23. Esta entrega é para avaliação em preview, sem merge ou publicação em produção.

## Diagnóstico e recuperação durante a revisão

A primeira tentativa de `npm test` nesta revisão falhou na checagem de imagens da home: o servidor de desenvolvimento foi encerrado por `EBUSY` ao monitorar a gravação WebM em escrita. Não foram alteradas as expectativas da suíte geral para ocultar essa falha. A recuperação foi executar o build e servir `dist` com `vite preview` na porta 4176, sem monitoramento de arquivos; a suíte geral, o sprint e as duas suítes de eventos passaram nessa instância estável.

## Limites

Validação de navegador executada em Chrome nesta máquina, com simulação de toque e larguras de tela; não houve teste em aparelhos físicos ou em Safari/Firefox. Os textos descrevem as peças criadas, sem atribuir contratação direta pelos artistas ou resultados comerciais. A limitação preexistente de HTTP 404 permanece na Issue #21, fora deste escopo.

## Ajuste final após aprovação do túnel — 24/10/2026

O usuário aprovou o efeito e pediu retirar o botão de pausa/reprodução do vídeo do hero. Esse pedido explícito substitui a exigência anterior de controle manual no DESIGN.md. Foram removidos o botão, ícones, estado de pausa manual e CSS específico. O vídeo continua silencioso em loop, pausa fora da viewport/aba oculta e retoma ao voltar. Movimento reduzido, falha de mídia ou bloqueio de autoplay mostram o ícone estático.

O teste de sprint foi atualizado antes da implementação e falhou como esperado ao encontrar o botão antigo; passou após a remoção. A revisão visual em 1440px e 390px confirmou o hero sem botão e com composição preservada; o modo de movimento reduzido foi conferido. Capturas e verificação de console local em `artifacts/eventos-23/hero-sem-botao`. A aprovação do túnel foi registrada na Issue #23; esta rodada atualiza o mesmo PR #24, sem publicar em produção.
