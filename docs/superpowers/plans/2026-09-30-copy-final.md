# Sprint de copy final — Issue #13

Base: ad9b762. Branch: improvement/13-copy-final.
Spec: docs/copy-final-reference.md, fornecida pelo usuário.

## Plano e progresso
1. Aplicar copy editorial, navegação, mensagens, cases e SEO sem alterar hooks de motion.
2. Preservar condições comerciais atuais nos pontos bloqueados; nenhuma cifra ou prazo inventado.
3. Validar TypeScript, build, rotas, acessibilidade, teclado, motion e desktop/mobile.
4. Abrir Draft PR, anexar preview e pendências comerciais; não publicar até resolver a seção 15 da spec.

## Decisões
- Ruling: manter a promessa comercial atual e não ampliá-la antes da confirmação #1. Hero/teaser, processo geral, pontes de prévia e mensagens dependentes ficam pendentes; custo: preview ainda não representa todos os textos finais.
- Ruling: manter o processo geral para serviços sob medida. Não prometer prévia grátis para todo serviço; a regra comercial vigente limita a oferta ao Site Essencial.
- Ruling: preservar descrição genérica de público e negociação de quantidades. Não inventar segmentos atendidos, prova social, pacotes ou preços.
- Ruling: ponte Solace pode entrar: promete conversa, não prévia gratuita de identidade.
- Ruling: alteração editorial usa testes existentes; teste novo cobre o defeito de canonical/metadados por rota, observado falhando com domínio antigo.

## Bloqueios antes da publicação
Confirmar prévia sempre gratuita no Site Essencial; preço anual de domínio; hospedagem/mensalidade; prazo de prévia e entrega; formato e quantidade do serviço social; segmentos atendidos; prova real opcional.
Termos e FAQ de custos serão alinhados juntos após as respostas.

## Verificação
TypeScript e build aprovados. tests/copy-seo.cjs, tests/sprint.cjs e tests/experience.cjs aprovados: 7 rotas, 4 larguras (1440/768/390/320), navegação, teclado, motion e reduced motion; zero pageerrors e zero violações axe nas 3 páginas avaliadas.
Revisão visual: hero desktop/mobile, social, contato e Bellavista. Skip link validado: oculto sem foco, visível por Tab, Enter leva foco ao main.
Mockup Bellavista substituído por versão em português, preservando composição conceitual 4:3 (75 KB).
Revisão independente: corrigido Important de metadados das páginas legais. Teste reproduziu canonical errado após navegar do Essencial para Privacidade; passou após migrar Privacidade/Termos ao hook compartilhado, sem alterar copy legal. Corrigidos também contato genérico do Sobre/telefone e vocabulário escopo no FAQ.
Limitação: aplicativo SPA atualiza metadados por JavaScript. Não foi adicionada renderização no servidor ou prerender para robôs que não executam JS.
Nenhum merge ou deploy de produção neste sprint. Draft aguarda decisões comerciais da seção 15.
