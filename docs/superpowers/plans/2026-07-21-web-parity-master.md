# Web Parity — Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement **one branch plan at a time**. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar paridade web/mobile e polish UX em 7 PRs isolados sobre `develop`, conforme spec `docs/superpowers/specs/2026-07-21-web-parity-tours-ux-design.md`.

**Architecture:** Cada branch é um PR independente para `develop`. Ordenação de dados no repositório Firestore; filtros e previews na Presentation; tours via `driver.js` + `tourStorage` + catálogo em `/guides`.

**Tech Stack:** Next.js App Router, TypeScript, Firebase Firestore, Vitest, driver.js, Tailwind + tokens SeniorEase, shadcn Dialog/Button.

## Global Constraints

- Textos da UI sempre em português, simples, sem jargão técnico
- Clean Architecture: Domain não importa Infrastructure/Presentation
- Acessibilidade: área clicável mínima 44×44px; contraste WCAG AA
- Tokens: apenas os de `memory-bank/techContext.md` / CSS variables do projeto
- Modo Básico/Avançado: lógica real que oculta elementos não essenciais
- Base git: `develop` alinhada com `origin/develop` antes de cada branch
- Commits: só quando o utilizador pedir (ou no passo de commit do plano, se autorizado na sessão)
- Não mencionar Cursor em commits/PRs

## Spec

`docs/superpowers/specs/2026-07-21-web-parity-tours-ux-design.md`

## Branch map

| # | Branch | Plano detalhado | Depende de |
|---|--------|-----------------|------------|
| 1 | `fix/web-reminders-sort-filter` | `docs/superpowers/plans/2026-07-21-web-reminders-sort-filter.md` | — |
| 2 | `fix/web-dashboard-previews` | Secção abaixo (executar após merge de 1) | 1 opcional |
| 3 | `feat/web-app-guides` | Secção abaixo | — |
| 4 | `feat/web-tour-infra` | Secção abaixo | 3 recomendado |
| 5 | `feat/web-tours-core-screens` | Secção abaixo | 4 |
| 6 | `feat/web-tours-profile-settings` | Secção abaixo | 4 |
| 7 | `fix/web-ui-shell-polish` | Secção abaixo | — |

Ordem de merge preferida: 1 → 2 → 3 → 4 → 5 → 6 → 7.

---

## Branch 2 — `fix/web-dashboard-previews` (resumo executável)

**Files:**
- Modify: `src/presentation/components/dashboard/dashboardUtils.ts`
- Modify: `src/presentation/components/dashboard/dashboardUtils.test.ts`

**Tasks:**
- [ ] Alterar `getTodayDashboardTasks` para ordenar por `dueDate` **desc** (sem data no fim). Remover prioridade “concluídas primeiro” se conflitar com a regra de data — spec: data desc.
- [ ] Alterar `getUpcomingReminders` sort para **desc** (manter `!isRead && scheduledAt >= now`).
- [ ] Atualizar testes: ordem esperada invertida; cobrir dois futuros com datas diferentes.
- [ ] `npm test -- dashboardUtils`
- [ ] PR para `develop`

---

## Branch 3 — `feat/web-app-guides` (resumo executável)

**Files:**
- Create: `src/app/(app)/guides/page.tsx`
- Create: `src/presentation/components/guides/guidesScreen.tsx`
- Create: `src/presentation/tour/tourCatalog.ts` (lista inicial com tours já existentes: profile, history)
- Create: `src/presentation/tour/pendingTour.ts` (`setPendingTour` / `consumePendingTour` via sessionStorage)
- Modify: `src/presentation/components/dashboard/dashboardScreen.tsx` (Histórico → Ajuda rápida → `/guides`)
- Modify: `src/presentation/components/profile/profileScreen.tsx` (link “Guia do aplicativo”)
- Modify: ícone em `public/icons/quick-actions/` se necessário

**Tasks:**
- [ ] Catálogo mínimo + tela Guia listando títulos/descrições
- [ ] Toque no item: `setPendingTour(id)` + `router.push(route)`
- [ ] Profile/History já existentes: ao montar, `consumePendingTour` e iniciar tour se match
- [ ] Dashboard quick action + link Perfil
- [ ] PR para `develop`

---

## Branch 4 — `feat/web-tour-infra` (resumo executável)

**Files:**
- Create: `src/presentation/tour/startSeniorEaseTour.ts`
- Rename/keep CSS: `src/presentation/tour/seniorEaseTour.css` (ou manter `profileTour.css` e reexport)
- Refactor: `profileTour.ts`, `historyTour.ts` para usarem o helper
- Expand: `tourCatalog.ts` com shape final `{ id, title, description, route }`
- Test: `startSeniorEaseTour` / catalog uniqueness

**Tasks:**
- [ ] Helper único com opções driver.js iguais ao Perfil
- [ ] Migrar Perfil + Histórico sem regressão visual
- [ ] PR para `develop`

---

## Branch 5 — `feat/web-tours-core-screens`

Telas: Dashboard, Lista/Criar/Detalhe Tarefas, Lista/Criar Lembretes, Modo Guiado, Notificações, Acessibilidade (+ Histórico no catálogo se faltar).

Por tela: `*TourSteps.ts`, `use*Tour.ts`, `data-tour` nos alvos, botão `?`, oferta Modo Básico, entrada no catálogo.

---

## Branch 6 — `feat/web-tours-profile-settings`

Telas: Segurança, Sobre, Informações Pessoais, Endereço, Preferências de Notificação (rotas `/profile/*` existentes).

Mesmo padrão da branch 5.

---

## Branch 7 — `fix/web-ui-shell-polish`

**Files:**
- Modify: `src/presentation/components/layout/Navigation.tsx` (overlay fecha menu)
- Modify: `src/presentation/components/tasks/guidedTaskScreen.tsx` (+ grep `Sair do`)
- Modify: `src/app/(app)/reminders/page.tsx` (`max-w-5xl` → `max-w-6xl`)

---

## Memory-bank

Após cada PR mergeado (ou no fim do lote): atualizar `activeContext.md` / `progress.md` no submódulo e bump do pin no web.

## Execution

Começar sempre pelo plano detalhado da **Branch 1**:

→ `docs/superpowers/plans/2026-07-21-web-reminders-sort-filter.md`
