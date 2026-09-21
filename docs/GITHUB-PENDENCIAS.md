# Acompanhamento no GitHub

Repositório confirmado: https://github.com/agenciamello/agencia-mello. Branch padrão observada em 21/09/2026: `main`. O histórico remoto foi clonado sem alterar os arquivos da cópia local de desenvolvimento.

| Tarefa | Issue | Estado |
| --- | --- | --- |
| Padronizar Issues, PRs e deploys | [#1](https://github.com/agenciamello/agencia-mello/issues/1) | Documentação preparada na branch `docs/1-fluxo-issues-prs`; PR em preparação. |
| Integrar o redesign local ao histórico | [#2](https://github.com/agenciamello/agencia-mello/issues/2) | Reconciliação pendente. A main remota ainda contém a versão antiga. |
| Ampliar animações e efeitos | [#3](https://github.com/agenciamello/agencia-mello/issues/3) | Implementação parcial local, dependente de #2; CSS e validações finais pendentes. |

## Regras de continuidade

- Os detalhes e critérios de aceite estão nas Issues. Atualizar esta tabela com o PR ao criá-lo.
- `PRODUCT.md` e `DESIGN.md` registram o contexto e a direção do trabalho local, cuja integração é acompanhada em #2; não são evidência de que a main ou produção já receberam o redesign.
- O checkout conectado nesta máquina está em `.tools/github-work`, dentro da cópia local original. Esse diretório é operacional e não deve ser versionado.
- Não sobrescrever a cópia local para recuperar o Git. Comparar os arquivos com o checkout remoto e incorporar somente alterações pertinentes em branch vinculada à Issue.
- O último build da prévia local pertence ao sprint anterior à ampliação de motion. Não publicar as alterações parciais.
- Confirmar a configuração da integração de deploy, executar as validações e registrar preview antes do merge/publicação autorizado.
