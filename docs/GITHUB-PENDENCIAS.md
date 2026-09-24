# Acompanhamento no GitHub

Repositório confirmado: https://github.com/agenciamello/agencia-mello. Branch padrão observada: `main`. O histórico remoto foi preservado durante a integração da cópia local.

| Tarefa | Issue | PR e estado em 24/09/2026 |
| --- | --- | --- |
| Padronizar Issues, PRs e deploys | [#1](https://github.com/agenciamello/agencia-mello/issues/1) | [PR #4](https://github.com/agenciamello/agencia-mello/pull/4), aberto, com `Closes #1`. |
| Integrar o redesign local ao histórico | [#2](https://github.com/agenciamello/agencia-mello/issues/2) | [PR #5](https://github.com/agenciamello/agencia-mello/pull/5), aberto, com `Closes #2`. |
| Ampliar animações e efeitos | [#3](https://github.com/agenciamello/agencia-mello/issues/3) | [PR #5](https://github.com/agenciamello/agencia-mello/pull/5), aberto, com `Closes #3`. |

## Validação e preview

- Branch visual: `improvement/2-experiencia-mello`, commit `40b4df40ba892555946f251ab460313ee227722d`.
- TypeScript e build aprovados. Sete rotas em quatro larguras sem overflow, imagens quebradas ou erros de página. Axe nas páginas inicial, Site Essencial e Bellavista sem violações detectadas.
- Testes de contato, seleção por teclado, mensagens WhatsApp, mudança de breakpoint e reduced motion aprovados. Revisão visual desktop/mobile concluída localmente.
- [Preview da Vercel](https://agenciamello-77qn9vfm7-matheus-projects-f7e9ddc4.vercel.app) gerado pela integração Git para o commit acima. O PR mostrou dois checks aprovados e nenhuma incompatibilidade com a base.
- A abertura da prévia remota exigiu login Vercel. Não declarar inspeção visual remota concluída; a validação visual registrada é local.
- PRs abertos; nenhum merge ou publicação manual em produção foi realizado. Priorizar a integração de #4 antes de #5 e confirmar a configuração de produção antes de publicar.

## Continuidade local

- O checkout conectado nesta máquina está em `.tools/github-work`, dentro da cópia local original. Esse diretório é operacional e não deve ser versionado.
- A raiz original permanece como cópia de desenvolvimento; confira a branch no checkout antes de trabalhar. Não inicialize outro histórico sobre a cópia original.
- `PRODUCT.md` e `DESIGN.md` registram a direção do redesign; não são evidência de publicação em produção. Issues e PRs são a fonte do estado de entrega.
- Novas tarefas devem seguir `AGENTS.md`, começando por uma Issue real.
