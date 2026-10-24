# Capítulos de clareza — Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task in the existing Issue #25 branch. Native execution continues the user's approved revision; no new worktree, dependencies or publication.

**Goal:** Reunir serviços, trabalhos e contratação em capítulos, com preço depois das três prévias comerciais.

**Architecture:** ExperiencePortfolio organiza os capítulos. HomePage mantém hero, resumo, Matheus e contato; a oferta/processo de sites e os capítulos de artes/identidade são componentes focados. Preservar IDs públicos e o túnel.

**Tech Stack:** React 19, TypeScript, Vite, CSS existente, GSAP/ScrollTrigger e Playwright/Chrome.

**Spec:** `docs/superpowers/specs/2026-10-24-capitulos-clareza-design.md`.

## Global Constraints
- Ordem aprovada: hero/resumo → abertura → sites/prévias/preço → artes → identidade → Matheus/contato.
- R$ 297,00; anterior R$ 500,00 identificado; até 3x de R$ 99,00; prévia gratuita só do Site Essencial.
- Preservar projetos e IDs, logo, retrato, vídeo, túnel, Behance, foco e reduced motion; sem novas dependências.

## Review Focus
- Âncoras antigas devem chegar ao capítulo correto, inclusive após mudança de rota.
- Preço vem depois de Viana/Du-Rio e antes do túnel em desktop/mobile/reduced motion.
- Detalhes fechados não devem esconder permanentemente conteúdo ao abrir ou deixar foco preso.
- CTA de redes/eventos/identidade deve iniciar mensagem coerente.
- Os estudos continuam conceituais e os exemplos comerciais não sugerem serem sites entregues pelo preço do Essencial.

## Task 1 — Contrato e composição
**Files:** `tests/clarity.cjs`, `src/pages/HomePage.tsx`, `src/components/studio/ExperiencePortfolio.tsx`, `SiteEssentialOffer.tsx`, `ServiceChapters.tsx` (substitui `ExperienceServices.tsx`), `ChapterNavigation.tsx`, `src/experience.css`.
**Interfaces:** manter `ExperiencePortfolio()`; exportar `SiteEssentialOffer()`, `SocialServiceDetails()` e `BrandServiceChapter()`. Preservar `#servicos`, `#solucoes`, `#projetos`, `#servico-web`, `#servico-conteudo`, `#servico-marca`, `#processo`, `#eventos`, `#eventos-galeria`, `#oferta-site-essencial`.
- [x] Atualizar teste para exigir ordem das três prévias → oferta → artes → identidade e ausência da seção duplicada; executar contra build anterior e observar falha.
- [x] Integrar capítulos, oferta e detalhes acessíveis; reutilizar componentes/assets existentes sem duplicação.
- [x] Adaptar navegação lateral, estilos e documentação de produto/design ao contrato novo.
- [x] Executar lint/build e teste de clareza em seis larguras; verificar capturas reais.

## Task 2 — Motion, regressão e preview
**Files:** `StudioMotion.tsx`, `EventPortfolio.tsx` se a hierarquia exigir, `tests/experience.cjs`, `tests/portfolio-real.cjs`, PR #26/Issue #25.
**Interfaces:** vídeo, projeto, túnel, sobre e contato preservam comportamentos existentes. A seção de serviços/processo removida deixa de exigir suas animações; detalhes recebem testes de teclado/leitura.
- [x] Remover somente testes/motion que pertencem à composição retirada; substituir por navegação dos capítulos e abertura dos detalhes.
- [x] Executar npm test, sprint, clareza, portfólio, SEO e suítes de eventos com SITE_URL explícita; inspecionar resultados, erros e axe.
- [ ] Commit/push no PR #26 e validar a prévia do novo commit; revisão independente já realizada antes da entrega.
- [ ] Atualizar Issue/PR com evidências atuais e link revisável; produção permanece inalterada.

## Evidência de execução

Contrato novo falhou contra a primeira build por ainda existir a seção duplicada e passou após os capítulos. Revisão independente identificou perda de tipografia da tese do Animalis e posições de motion desatualizadas ao abrir detalhes; ambos reproduzidos por testes que falharam antes da correção e passaram depois. `tests/chapter-motion.cjs` verifica abertura/fechamento e cleanup/recriação em reduced motion. Capturas de capítulos, oferta e contato em desktop/mobile foram inspecionadas. Estado final da prévia e da publicação é registrado na Issue #25 e no PR #26.
