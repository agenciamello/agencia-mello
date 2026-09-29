# Instruções para agentes — Agência Mello

Estas regras se aplicam a todo o projeto e a qualquer agente, ferramenta ou modelo que trabalhe nele. Leia este arquivo antes de planejar ou alterar código. Pedido explícito do usuário em conflito com este arquivo tem precedência; registre a exceção.

## Repositório

- Destino confirmado: https://github.com/agenciamello/agencia-mello.
- Branch padrão observada: `main`. Confirmar a configuração de produção antes de publicar.
- Checkout conectado nesta máquina: `.tools/github-work`; a raiz original conserva o trabalho local até reconciliação. Não confundir esse caminho local com uma pasta versionada.

## Contexto

- Leia `PRODUCT.md` para conteúdo factual, oferta, público e limites comerciais.
- Leia `DESIGN.md` para identidade, composição, motion e acessibilidade.
- Preserve o logo oficial, o nome Matheus Mello, o retrato colorido, os links e as rotas existentes.
- Não invente clientes, métricas, prêmios ou depoimentos; identifique estudos conceituais.

## Regra obrigatória: tarefa → Issue → branch → PR → deploy

1. Toda tarefa de **Correção**, **Melhoria** ou **Nova função**, inclusive documentação, configuração e manutenção, deve ter uma Issue no GitHub antes de iniciar a implementação.
2. Verifique primeiro as Issues existentes. Reutilize a Issue adequada e evite duplicações. Uma Issue deve representar uma entrega verificável; subtarefas da mesma entrega podem ser checklist.
3. Registre tipo, problema ou objetivo, escopo e critérios de aceite. Inclua reprodução e comportamento esperado quando for correção. Use os modelos em `.github/ISSUE_TEMPLATE/`.
4. Confirme o repositório remoto e a branch de destino. Não inicialize nem substitua o histórico de uma cópia existente sem identificar sua origem. Preserve alterações locais de outros trabalhos.
5. Trabalhe em uma branch vinculada à Issue: `fix/<numero>-<resumo>`, `improvement/<numero>-<resumo>`, `feat/<numero>-<resumo>` ou `docs/<numero>-<resumo>`. Não faça commits ou pushes diretamente na branch de produção.
6. Abra PR para integrar a entrega. **Mencione obrigatoriamente a Issue na descrição do PR**, com seu número e link. Use `Closes #numero` somente quando o PR concluir a Issue; para trabalho parcial, use `Refs #numero` e descreva o que falta. Para outro repositório, use referência qualificada ou URL completa.
7. Mantenha o PR focado. Documente problema, mudança, validações efetivamente executadas, limitações e preview. PR incompleto permanece como Draft; não declare testes não executados como aprovados.
8. Atualize a Issue com o PR, progresso e impedimentos relevantes. Não encerre uma Issue apenas porque existe um PR; conclua os critérios de aceite e registre o estado do deploy quando fizer parte da entrega.

## Deploys gerenciados por PR

- O caminho padrão é branch → PR → preview → validações/revisão → merge → deploy da branch de produção configurada no provedor.
- Use a integração Git do provedor quando disponível. Não faça deploy manual direto em produção para contornar o PR.
- Confirme qual branch gera produção; não assuma que se chama `main`. Não configure ou altere essa integração silenciosamente.
- Verifique se a autorização da conversa já cobre merge e publicação. Criar uma Issue ou PR, por si só, não autoriza publicar. Não peça de novo uma autorização já concedida.
- Registre no PR o link da prévia e, quando houver publicação, o deployment/commit e o resultado da verificação do site publicado.
- Em uma falha, registre diagnóstico e recuperação na Issue/PR; prefira correção ou reversão rastreável. Não use force-push ou reescreva histórico para esconder o problema.

## Validação proporcional à alteração

- Confira os scripts do package.json da branch: a main atual tem `npm run lint` (TypeScript) e `npm run build`. A versão local em reconciliação também tem `npm run typecheck`; não há linter separado. Execute as validações disponíveis para alterações na aplicação.
- Quando presente na branch, `npm test` verifica rotas, responsividade, navegação, motion e acessibilidade. Requer Chrome e servidor local; `SITE_URL` informa a URL e o padrão é `http://127.0.0.1:3000`.
- Quando presente na branch, `node tests/sprint.cjs` verifica o fluxo de intenção de contato. Defina `SITE_URL` explicitamente para testar a versão correta.
- Para mudanças visuais, inspecione desktop e mobile, teclado, foco, movimento reduzido, console, links e overflow. Build aprovado sozinho não conclui uma alteração visual.
- Documentação isolada exige revisão de conteúdo, links e modelos; não repita testes da aplicação sem necessidade.
- Nunca versione credenciais, `.env`, dependências, builds ou artefatos locais de teste.

## Ausência de GitHub, acesso ou repositório

- Informe precisamente o impedimento e peça apenas o dado ou acesso necessário. Nunca invente números, URLs de Issues, PRs, commits ou deploys.
- Prepare escopo e textos localmente; isso não equivale a criar uma Issue ou PR no GitHub. Use `docs/GITHUB-PENDENCIAS.md` para manter a fila de registro enquanto a conexão não estiver disponível.
- Trabalho iniciado antes desta regra deve receber a Issue antes de continuar ou ser publicado. Preserve as alterações existentes e descreva seu estado real.
- Não trate falta de acesso como permissão para ignorar este fluxo. Prossiga apenas com trabalho independente do impedimento.

## Comunicação

Ao concluir, informe resultado, Issue, PR, validação e estado do deploy. Se algum deles não existir, diga claramente o que está pendente. Responda ao usuário em português, com linguagem direta.
