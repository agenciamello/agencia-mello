# Design para eventos — validação da Issue #23

Data: 24/10/2026. Issue: https://github.com/agenciamello/agencia-mello/issues/23.

## Entrega

Bloco no portfólio, entre as prévias comerciais e os estudos autorais, com São Simão Folia, Pagô Pra Ver (agenda), Bloco do Mello e Conexão dos Crias. As quatro cópias WebP têm SHA-256 idêntico aos arquivos fornecidos pelo usuário. Nenhuma arte, rosto, texto ou proporção foi alterado.

A perspectiva acompanha a rolagem nativa apenas no desktop com ponteiro fino. Não há captura da roda, pinning, imagens que dependam do movimento para aparecer ou nova dependência. Mobile e movimento reduzido mantêm galeria estática. Ampliação em diálogo com foco contido, Escape, botão de fechar e retorno ao botão de origem. O WhatsApp usa intenção própria de orçamento para evento, sem enviar mensagem automaticamente.

## Verificações executadas

- `npm run lint`: TypeScript aprovado, saída 0.
- `npm run build`: bundle e HTML estático das 12 rotas mais 404 gerados, saída 0.
- `SITE_URL=http://127.0.0.1:4175 npm test`: 13 rotas em seis larguras; navegação, motion e interações aprovados, sem erros de página. Axe sem violações nas 14 combinações de rota/largura examinadas pela suíte. Saída 0.
- `SITE_URL=http://127.0.0.1:4175 node tests/sprint.cjs`: CTA, destino, três intenções de WhatsApp, teclado, controle do vídeo e movimento reduzido aprovados, saída 0.
- `node tests/event-portfolio.cjs`: aprovado no servidor de desenvolvimento (4175) e na prévia local do build (4176), saída 0. Verifica ordem no portfólio, quatro imagens completas, seis larguras (1440, 1024, 768, 390, 360 e 320px), rolagem nativa, perspectiva, ampliação por teclado/toque, foco, proporção da ampliação, mudança de movimento reduzido em tempo real, limpeza ao trocar de rota e CTA correto. Axe sem violações no bloco nas seis larguras e no diálogo aberto em desktop.
- Falha de rede simulada em uma arte: outras três continuam disponíveis; mensagem de falha aparece, ampliação oferece tentar novamente e a recuperação carrega a arte após restaurar a rede.
- Capturas reais do bloco, ampliação desktop/mobile e movimento reduzido inspecionadas. Evidências locais ignoradas em `artifacts/eventos-23`; contrato e registro JSON conferidos com o checker de evidências da skill de direção de frontend.
- `git diff --check`: aprovado.

## Preview e publicação

Branch: `improvement/23-design-eventos`, criada a partir de `origin/main` atualizado (`063e12e`). Remoto confirmado: `agenciamello/agencia-mello`. Produção atual confirmada na Vercel como `source=git`, branch `main`, commit `063e12eff10e2ce39fa373634bd572b2597d6868`.

O PR e sua preview serão registrados na Issue #23. Esta entrega é para avaliação em preview, sem merge ou publicação em produção.

## Limites

Validação de navegador executada em Chrome nesta máquina, com simulação de toque e larguras de tela; não houve teste em aparelhos físicos ou em Safari/Firefox. Os textos descrevem as peças criadas, sem atribuir contratação direta pelos artistas ou resultados comerciais. A limitação preexistente de HTTP 404 permanece na Issue #21, fora deste escopo.
