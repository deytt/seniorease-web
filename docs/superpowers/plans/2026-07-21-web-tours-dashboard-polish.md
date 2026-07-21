# Polish Tours / Dashboard / Botões / Toasts — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Uma branch única que corrige dashboard (fetch/ordenação), padroniza tours/`?`/Voltar/Sair/toasts e alinha redirects do modo guiado.

**Architecture:** Mitigar índice Firestore no repositório de lembretes; isolar fetches no dashboard; partilhar classes de botão e `TourHelpButton`; migrar Acessibilidade para `usePageTour` + driver.js; auditar passos de tour (header + CTA).

**Tech Stack:** Next.js App Router, Firebase Firestore, driver.js, Sonner, Vitest, tokens do Design System.

## Global Constraints

- UI e copy em português (Brasil), linguagem simples
- Clean Architecture: Domain sem imports de Infrastructure/Presentation
- Área clicável mínima 44×44px; contraste WCAG AA
- Uma branch a partir de `develop`; um PR no fim
- Commits só quando o utilizador pedir explicitamente (não commit automático em cada task)
- Não alterar o variant `ghost` global do `Button` — só overrides nos Voltar/Sair
- Spec: `docs/superpowers/specs/2026-07-21-web-tours-dashboard-polish-design.md`

## Mapa de ficheiros

| Ficheiro | Responsabilidade |
|----------|------------------|
| `src/infrastructure/firebase/FirebaseReminderRepository.ts` | Query ASC + sort desc no cliente |
| `src/app/(app)/dashboard/page.tsx` | Fetches isolados + toast de erro |
| `src/presentation/components/dashboard/dashboardUtils.ts` (+ `.test.ts`) | Filtro B + sorts (já existem; reforçar se preciso) |
| `src/presentation/tour/TourChrome.tsx` | `TourHelpButton` estilo Perfil |
| `src/presentation/lib/backNavButtonClassName.ts` (novo) | Classe partilhada Voltar/Sair hover-only |
| `src/presentation/components/ui/sonner.tsx` | `closeButton={false}` |
| `src/presentation/tour/*TourSteps.ts` (+ testes) | Padrão A + Dashboard/Tarefas |
| `src/presentation/tour/tourCatalog.ts` | “Dashboard” |
| `src/app/(app)/acessibility/page.tsx` | Migrar para usePageTour |
| `src/presentation/components/tasks/guidedTaskScreen.tsx` | Sair → `/tasks` + estilo botão |
| `src/app/(app)/tasks/[id]/guided/page.tsx` | Concluir → `/dashboard` |
| Páginas com Voltar ghost azul | Aplicar classe partilhada |
| `memory-bank/activeContext.md`, `progress.md` | Documentar frente |

---

### Task 1: Lembretes sem índice DESC + dashboard resiliente

**Files:**
- Modify: `src/infrastructure/firebase/FirebaseReminderRepository.ts`
- Modify: `src/app/(app)/dashboard/page.tsx`
- Test: `src/presentation/components/dashboard/dashboardUtils.test.ts` (já cobre sorts; manter verdes)

**Interfaces:**
- Produz: `getReminders` devolve lista ordenada **desc** por `scheduledAt` sem exigir índice DESC
- Produz: dashboard preenche `tasks` mesmo se lembretes falharem

- [ ] **Step 1: Alterar `getReminders` para ASC + reverse no cliente**

```ts
async getReminders(userId: string): Promise<Reminder[]> {
  const q = query(
    collection(db, this.collectionName),
    where("userId", "==", userId),
    orderBy("scheduledAt", "asc"),
  );
  const snapshot = await getDocs(q);
  const reminders = snapshot.docs.map((document) =>
    this.mapDocumentToReminder(document),
  );
  return reminders.reverse();
}
```

- [ ] **Step 2: Isolar fetches no dashboard**

Em `dashboard/page.tsx`, substituir `Promise.all` único por cargas independentes (ex.: `Promise.allSettled` ou dois try/catch). Em falha de lembretes: `setReminders([])` + `toast.error("Não foi possível carregar os lembretes.")`. Em falha de tarefas: `setTasks([])` + toast de erro. Sucesso parcial deve atualizar o estado que funcionou.

- [ ] **Step 3: Verificar testes do dashboard utils**

Run: `npx vitest run src/presentation/components/dashboard/dashboardUtils.test.ts`

Expected: PASS (regra B + desc + lembretes incompletos futuros)

- [ ] **Step 4: Smoke manual**

Abrir `/dashboard` com tarefas de hoje: secção “Tarefas de hoje” deve listar itens mesmo com problemas pontuais em lembretes.

---

### Task 2: Toasts sem Close

**Files:**
- Modify: `src/presentation/components/ui/sonner.tsx`

- [ ] **Step 1: Desativar close button**

```tsx
closeButton={false}
```

- [ ] **Step 2: Confirmar visual**

Disparar `toast.success` / `toast.error` numa ação existente (ex.: criar lembrete) — sem ícone/botão Close.

---

### Task 3: Classe partilhada Voltar / Sair + aplicar

**Files:**
- Create: `src/presentation/lib/backNavButtonClassName.ts`
- Modify: `src/presentation/components/profile/profileFormPageShell.tsx`
- Modify: `src/presentation/components/tasks/guidedTaskScreen.tsx`
- Modify: páginas com `variant="ghost"` de Voltar (pelo menos):
  - `src/app/(app)/tasks/create/page.tsx`
  - `src/app/(app)/tasks/[id]/page.tsx` (se tiver Voltar)
  - `src/app/(app)/reminders/create/page.tsx`
  - `src/app/(app)/reminders/[id]/edit/page.tsx`
  - `src/app/(app)/acessibility/page.tsx`
  - outras ocorrências de “Voltar para …” com ghost azul

**Interfaces:**
- Produz: `export const backNavButtonClassName = "…"` (string constante)

- [ ] **Step 1: Criar constante**

```ts
/** Voltar / Sair: sem fundo idle; fundo só no hover. */
export const backNavButtonClassName =
  "min-h-11 cursor-pointer rounded-[14px] bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground";
```

- [ ] **Step 2: Aplicar em `profileFormPageShell` e “Sair do Modo Guiado”**

Usar `cn(backNavButtonClassName, …)` / `className={backNavButtonClassName}` conforme o botão.

- [ ] **Step 3: Grep e alinhar restantes**

Run: `rg -n 'Voltar para|Sair do Modo Guiado|variant=\"ghost\"' src/app src/presentation --glob '*.tsx'`

Aplicar a mesma classe em todos os Voltar de navegação listados no spec.

- [ ] **Step 4: Validar**

Em idle: sem pill azul. Em hover: fundo muted.

---

### Task 4: `TourHelpButton` estilo Perfil

**Files:**
- Modify: `src/presentation/tour/TourChrome.tsx`
- Modify (opcional): `profileScreen.tsx` / `historyScreen.tsx` para reutilizar `TourHelpButton`

- [ ] **Step 1: Trocar classes do botão**

```tsx
className="size-11 shrink-0 cursor-pointer rounded-[14px]"
```

(remover `rounded-full` / `min-h-11 min-w-11` se `size-11` bastar)

- [ ] **Step 2: Alinhar Perfil/Histórico ao componente partilhado se ainda tiverem Button inline**

Mesmo visual e `aria-label` específico por tela via prop `label`.

---

### Task 5: Guia + Dashboard tour (copy, a11y, ações rápidas, CTA)

**Files:**
- Modify: `src/presentation/tour/tourCatalog.ts`
- Modify: `src/presentation/tour/dashboardTourSteps.ts` (+ `.test.ts`)
- Modify: `src/presentation/components/dashboard/dashboardScreen.tsx` (`data-tour` no status a11y; âncoras de CTA se faltarem)
- Modify: hook/copy do offer do dashboard se disser “painel”

- [ ] **Step 1: Catálogo**

```ts
title: "Dashboard",
description: "Conheça as tarefas de hoje, as ações rápidas, o status de acessibilidade e os lembretes próximos.",
```

- [ ] **Step 2: Atualizar targets e steps**

Ordem sugerida:
1. `dashboard-header` — “Bem-vindo ao seu Dashboard”
2. `dashboard-today-tasks` — conteúdo
3. `dashboard-add-task` (ou CTA “Adicionar tarefa” / equivalente) — passo CTA
4. `dashboard-quick-actions` — `side: "bottom"` ou `"top"` conforme layout para o popover não ficar longe
5. `dashboard-accessibility` — status de acessibilidade (novo `data-tour` no card)
6. `dashboard-reminders`

- [ ] **Step 3: Atualizar teste de selectors**

Em `dashboardTourSteps.test.ts`, esperar a nova lista de `data-tour`.

- [ ] **Step 4: Smoke do tour**

Botão `?` → passos passam pelo header, CTA, ações rápidas alinhadas, status a11y, lembretes.

---

### Task 6: Tour Minhas tarefas — passo Nova Tarefa + padrão A

**Files:**
- Modify: `src/presentation/tour/tasksListTourSteps.ts` (+ `.test.ts`)
- Modify: UI da lista de tarefas (botão Nova Tarefa com `data-tour='tasks-create'`)

- [ ] **Step 1: Inserir passo após header (ou após overview)**

Ordem:
1. `tasks-header`
2. `tasks-create` (CTA)
3. `tasks-search`
4. `tasks-filter`
5. `tasks-list`

- [ ] **Step 2: Atualizar teste**

Selectors na ordem acima.

---

### Task 7: Auditoria global de tours (padrão A)

**Files:**
- Modify conforme gaps: `createTaskTourSteps.ts`, `createReminderTourSteps.ts`, `notificationsTourSteps.ts`, `guidedTaskTourSteps.ts`, `historyTourSteps.ts`, `aboutTourSteps.ts`, `securityTourSteps.ts`, `notificationPrefsTourSteps.ts`, e ecrãs correspondentes com `data-tour` em CTAs em falta

**Regra:** cada ficheiro `*TourSteps.ts` deve ter:
1. Passo no header/título da página
2. Passo no CTA principal (criar/salvar/submit/nova…), quando a página tiver CTA
3. Passos de conteúdo já existentes

- [ ] **Step 1: Inventariar gaps**

Lista mínima conhecida:
- `createTask`: adicionar passo submit se faltar
- `notifications`: se houver ação principal, destacar; senão header + lista basta se não houver CTA
- `guidedTask`: incluir overview do título da página se existir header; não é obrigatório incluir “Sair” como CTA principal (CTA = Continuar/Concluir passo)

- [ ] **Step 2: Implementar `data-tour` + steps + testes existentes atualizados**

- [ ] **Step 3: Correr testes de tour**

Run: `npx vitest run src/presentation/tour`

Expected: PASS

---

### Task 8: Migrar tour de Acessibilidade para o padrão partilhado

**Files:**
- Create: `src/presentation/tour/accessibilityTourSteps.ts` (+ `.test.ts`)
- Create: `src/presentation/hooks/useAccessibilityTour.ts` (ou inline `usePageTour` na page)
- Modify: `src/app/(app)/acessibility/page.tsx` — remover `TourSpotlight` / estado local; usar `TourHelpButton` + `usePageTour` + `data-tour` nas secções
- Verify: `tourCatalog` já tem `accessibility` com route correta

- [ ] **Step 1: Extrair steps atuais (títulos/descrições) para `accessibilityTourSteps.ts` com selectors `data-tour`**

Ex.: `a11y-header` (overview), `a11y-font`, `a11y-mode`, `a11y-spacing`, `a11y-toggles`, e CTA se houver “Guardar”/equivalente.

- [ ] **Step 2: Ligar `usePageTour({ tourId: "accessibility", … })`**

Oferta em Modo Básico + pending do Guia.

- [ ] **Step 3: Remover motor custom (`TourSpotlight`, overlay, refs de tour)**

- [ ] **Step 4: Smoke**

`?` igual às outras telas; tour driver.js; Guia inicia o tour.

---

### Task 9: Redirects do modo guiado

**Files:**
- Modify: `src/presentation/components/tasks/guidedTaskScreen.tsx` (confirmar `href="/tasks"`)
- Modify: `src/app/(app)/tasks/[id]/guided/page.tsx` (confirmar `router.push("/dashboard")` na conclusão)
- Auditar qualquer outro `router.push` / `Link` no fluxo de conclusão

- [ ] **Step 1: Garantir Sair → `/tasks`**

- [ ] **Step 2: Garantir conclusão → `/dashboard`**

Se algum caminho de “marcar concluída” dentro do modo guiado navega para `/tasks`, corrigir para `/dashboard` após celebração (ou manter celebração e depois dashboard).

- [ ] **Step 3: Smoke**

Sair sem concluir → lista de tarefas. Concluir → dashboard.

---

### Task 10: Memory-bank + verificação final

**Files:**
- Modify: `memory-bank/activeContext.md`
- Modify: `memory-bank/progress.md`
- Optional note: `memory-bank/firebaseSchema.md` — lembretes web ordenados no cliente enquanto índice DESC não publicado

- [ ] **Step 1: Atualizar activeContext / progress** com esta frente

- [ ] **Step 2: Suite rápida**

Run:
```bash
npx vitest run src/presentation/tour src/presentation/components/dashboard/dashboardUtils.test.ts
npx tsc --noEmit
```

Expected: PASS / sem erros novos

- [ ] **Step 3: Checklist manual do spec §6**

- [ ] **Step 4: Abrir PR único** (quando o utilizador pedir) a partir da branch

---

## Cobertura do spec

| Requisito do spec | Task |
|-------------------|------|
| Fetch isolado + causa índice | 1 |
| Regra B + sorts preview | 1 (+ utils existentes) |
| Lembretes incompletos futuros | 1 (utils) |
| Sort client-side lembretes | 1 |
| Toasts sem Close | 2 |
| Voltar/Sair hover-only | 3 |
| `?` estilo Perfil | 4 |
| Dashboard tour + Guia “Dashboard” | 5 |
| Tour tarefas + Nova Tarefa | 6 |
| Padrão A global | 7 |
| Acessibilidade no stack partilhado | 8 |
| Redirects modo guiado | 9 |
| Docs memory-bank | 10 |
