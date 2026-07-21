# Web Reminders Sort + Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ordenar lembretes por `scheduledAt` descendente e substituir pills exclusivas por filtro modal combinável (Hoje + categoria), espelhando a lista de Tarefas.

**Architecture:** Ordenação no `FirebaseReminderRepository`. Estado e UI de filtro na Presentation (`reminderFilter.ts` + página). Storybook atualizado para o novo componente de filtro.

**Tech Stack:** Next.js, TypeScript, Firestore `orderBy`, Vitest, Dialog shadcn, Tailwind.

## Global Constraints

- Textos em português simples
- Área clicável mínima 44×44px
- Modo Básico: só categorias `medication` e `appointment` no modal
- Branch: `fix/web-reminders-sort-filter` a partir de `develop`
- Spec: `docs/superpowers/specs/2026-07-21-web-parity-tours-ux-design.md` §4.1
- Master: `docs/superpowers/plans/2026-07-21-web-parity-master.md`

---

## File map

| File | Role |
|------|------|
| `src/infrastructure/firebase/FirebaseReminderRepository.ts` | `orderBy("scheduledAt", "desc")` |
| `src/presentation/components/reminders/reminderFilter.ts` | Tipos + `matchesReminderListFilter` + categorias do Modo Básico |
| `src/presentation/components/reminders/reminderFilter.test.ts` | Testes do match combinável |
| `src/presentation/components/reminders/reminderFilterDialog.tsx` | Dialog + chips helpers usados pela página |
| `src/app/(app)/reminders/page.tsx` | Integrar botão Filtrar, chips, dialog; remover pills |
| `src/presentation/components/reminders/reminderFilterPills.tsx` | Remover usos na página; manter ficheiro só se Storybook ainda precisar — preferir atualizar stories e apagar pills |
| `src/presentation/components/stories/ReminderFilterPills.stories.tsx` | Substituir por stories do novo dialog ou apagar |
| `src/presentation/components/stories/ReminderListIntegration.stories.tsx` | Usar novo filtro |

---

### Task 1: Testes do filtro combinável

**Files:**
- Create: `src/presentation/components/reminders/reminderFilter.ts`
- Create: `src/presentation/components/reminders/reminderFilter.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type ReminderListFilter = {
    today: boolean;
    category: ReminderCategory | null;
  };

  export const EMPTY_REMINDER_LIST_FILTER: ReminderListFilter = {
    today: false,
    category: null,
  };

  export const BASIC_MODE_REMINDER_CATEGORIES: ReminderCategory[] = [
    "medication",
    "appointment",
  ];

  export function isReminderListFilterActive(filter: ReminderListFilter): boolean;

  export function matchesReminderListFilter(
    reminder: { category: ReminderCategory; scheduledAt: Date | string },
    filter: ReminderListFilter,
    isToday: (scheduledAt: Date | string) => boolean,
  ): boolean;
  ```

- [ ] **Step 1: Write the failing test file**

```ts
import { describe, expect, it } from "vitest";
import {
  EMPTY_REMINDER_LIST_FILTER,
  isReminderListFilterActive,
  matchesReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";

describe("matchesReminderListFilter", () => {
  const isToday = (d: Date | string) =>
    new Date(d).toISOString().startsWith("2026-07-21");

  it("sem filtros retorna true", () => {
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        EMPTY_REMINDER_LIST_FILTER,
        isToday,
      ),
    ).toBe(true);
  });

  it("filtra só hoje", () => {
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-21T10:00:00") },
        { today: true, category: null },
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        { today: true, category: null },
        isToday,
      ),
    ).toBe(false);
  });

  it("filtra só categoria", () => {
    expect(
      matchesReminderListFilter(
        { category: "medication", scheduledAt: new Date("2026-07-22T10:00:00") },
        { today: false, category: "medication" },
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-22T10:00:00") },
        { today: false, category: "medication" },
        isToday,
      ),
    ).toBe(false);
  });

  it("combina hoje + categoria (AND)", () => {
    expect(
      matchesReminderListFilter(
        {
          category: "medication",
          scheduledAt: new Date("2026-07-21T10:00:00"),
        },
        { today: true, category: "medication" },
        isToday,
      ),
    ).toBe(true);
    expect(
      matchesReminderListFilter(
        { category: "medication", scheduledAt: new Date("2026-07-22T10:00:00") },
        { today: true, category: "medication" },
        isToday,
      ),
    ).toBe(false);
    expect(
      matchesReminderListFilter(
        { category: "meal", scheduledAt: new Date("2026-07-21T10:00:00") },
        { today: true, category: "medication" },
        isToday,
      ),
    ).toBe(false);
  });
});

describe("isReminderListFilterActive", () => {
  it("detecta filtro ativo", () => {
    expect(isReminderListFilterActive(EMPTY_REMINDER_LIST_FILTER)).toBe(false);
    expect(
      isReminderListFilterActive({ today: true, category: null }),
    ).toBe(true);
    expect(
      isReminderListFilterActive({ today: false, category: "bills" }),
    ).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/presentation/components/reminders/reminderFilter.test.ts`

Expected: FAIL (módulo não encontrado)

- [ ] **Step 3: Implement `reminderFilter.ts`**

```ts
import type { ReminderCategory } from "@/domain/entities/ReminderCategory";

export type ReminderListFilter = {
  today: boolean;
  category: ReminderCategory | null;
};

export const EMPTY_REMINDER_LIST_FILTER: ReminderListFilter = {
  today: false,
  category: null,
};

export const BASIC_MODE_REMINDER_CATEGORIES: ReminderCategory[] = [
  "medication",
  "appointment",
];

export function isReminderListFilterActive(filter: ReminderListFilter): boolean {
  return filter.today || filter.category !== null;
}

export function matchesReminderListFilter(
  reminder: { category: ReminderCategory; scheduledAt: Date | string },
  filter: ReminderListFilter,
  isToday: (scheduledAt: Date | string) => boolean,
): boolean {
  if (filter.today && !isToday(reminder.scheduledAt)) return false;
  if (filter.category !== null && reminder.category !== filter.category) {
    return false;
  }
  return true;
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npm test -- src/presentation/components/reminders/reminderFilter.test.ts`

- [ ] **Step 5: Commit** (se autorizado)

```bash
git add src/presentation/components/reminders/reminderFilter.ts \
  src/presentation/components/reminders/reminderFilter.test.ts
git commit -m "$(cat <<'EOF'
feat(reminders): add combinable list filter helpers

EOF
)"
```

---

### Task 2: Ordenação Firestore descendente

**Files:**
- Modify: `src/infrastructure/firebase/FirebaseReminderRepository.ts`

**Interfaces:**
- Consumes: Firestore `orderBy`
- Produces: lista já ordenada `scheduledAt` desc para `GetRemindersUseCase`

- [ ] **Step 1: Change orderBy to desc**

In `getReminders`, replace:

```ts
orderBy("scheduledAt", "asc"),
```

with:

```ts
orderBy("scheduledAt", "desc"),
```

- [ ] **Step 2: Manual / smoke note**

Se o console Firestore reclamar de índice, confirmar índice composto `userId ASC + scheduledAt DESC` (o índice ASC existente normalmente cobre ambos os sentidos; criar no console só se a query falhar).

- [ ] **Step 3: Commit** (se autorizado)

```bash
git add src/infrastructure/firebase/FirebaseReminderRepository.ts
git commit -m "$(cat <<'EOF'
fix(reminders): order list by scheduledAt descending

EOF
)"
```

---

### Task 3: Dialog de filtro + chips na página

**Files:**
- Create: `src/presentation/components/reminders/reminderFilterDialog.tsx`
- Modify: `src/app/(app)/reminders/page.tsx`
- Delete or stop using: `reminderFilterPills.tsx` (após Task 4)

**Interfaces:**
- Consumes: `ReminderListFilter`, `BASIC_MODE_REMINDER_CATEGORIES`, `REMINDER_CATEGORIES`, `REMINDER_CATEGORY_LABELS`, `isReminderToday`
- Produces: UI modal alinhada a `/tasks` (sem prioridade)

- [ ] **Step 1: Create `reminderFilterDialog.tsx`**

Componente controlado:

```tsx
"use client";

import type { ReminderCategory } from "@/domain/entities/ReminderCategory";
import {
  REMINDER_CATEGORIES,
  REMINDER_CATEGORY_LABELS,
} from "@/domain/entities/ReminderCategory";
import {
  BASIC_MODE_REMINDER_CATEGORIES,
  type ReminderListFilter,
} from "@/presentation/components/reminders/reminderFilter";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: ReminderListFilter;
  onApply: (next: ReminderListFilter) => void;
  isBasicMode?: boolean;
};

export function ReminderFilterDialog({
  open,
  onOpenChange,
  value,
  onApply,
  isBasicMode = false,
}: Props) {
  // Estado temporário espelhando tasks/page.tsx:
  // tempToday, tempCategory; sync ao abrir; Limpar / Cancelar / Aplicar
  // Categorias: isBasicMode ? BASIC_MODE_REMINDER_CATEGORIES : REMINDER_CATEGORIES
  // Labels: REMINDER_CATEGORY_LABELS
  // Checkbox "Lembretes de hoje" (min-h-11)
  // Título do dialog: "Filtrar Lembretes"
}
```

Implementação completa deve copiar a estrutura do modal em `src/app/(app)/tasks/page.tsx` (secções Data + Categoria + footer Limpar/Cancelar/Aplicar), **sem** secção Prioridade. Usar `useEffect` para resetar temp state quando `open` passa a `true` a partir de `value`.

- [ ] **Step 2: Wire `reminders/page.tsx`**

Substituir:

```ts
const { filter, setFilter } = useReminderListFilter({ kind: "all" });
// ReminderFilterPills...
```

por:

```ts
const [filter, setFilter] = useState<ReminderListFilter>(EMPTY_REMINDER_LIST_FILTER);
const [isFilterOpen, setIsFilterOpen] = useState(false);

const filteredReminders = useMemo(
  () =>
    reminders.filter((reminder) =>
      matchesReminderListFilter(reminder, filter, isReminderToday),
    ),
  [reminders, filter],
);

const filterActive = isReminderListFilterActive(filter);
```

No header, ao lado de “Novo Lembrete”, botão:

```tsx
<Button
  type="button"
  variant="outline"
  size="sm"
  className="min-h-11 ..."
  onClick={() => setIsFilterOpen(true)}
  aria-label="Filtrar lembretes"
>
  <Filter className="size-4" aria-hidden />
  Filtrar
  {filterActive ? (
    <span className="ml-1 inline-flex size-5 ...">{/* badge count 1 ou 2 */}</span>
  ) : null}
</Button>
```

Badge count: `(filter.today ? 1 : 0) + (filter.category ? 1 : 0)`.

Chips ativos abaixo do header (quando `filterActive`):

- Se `filter.today`: chip “Hoje” com X → `setFilter(f => ({ ...f, today: false }))`
- Se `filter.category`: chip com label da categoria → limpa category
- Botão texto “Limpar filtros” → `EMPTY_REMINDER_LIST_FILTER`

Renderizar `<ReminderFilterDialog ... />` junto ao dialog de exclusão.

Remover imports de `ReminderFilterPills`, `useReminderListFilter`, `matchesReminderFilter`.

- [ ] **Step 3: Smoke visual**

Run: `npm run dev` → `/reminders`  
Verificar: ordenação desc (se dados existirem), filtro combinável, Modo Básico com 2 categorias.

- [ ] **Step 4: Commit** (se autorizado)

```bash
git add src/presentation/components/reminders/reminderFilterDialog.tsx \
  src/app/(app)/reminders/page.tsx
git commit -m "$(cat <<'EOF'
feat(reminders): replace exclusive pills with combinable filter dialog

EOF
)"
```

---

### Task 4: Limpar pills + Storybook

**Files:**
- Delete: `src/presentation/components/reminders/reminderFilterPills.tsx` (se sem usos)
- Modify/Delete: `src/presentation/components/stories/ReminderFilterPills.stories.tsx`
- Modify: `src/presentation/components/stories/ReminderListIntegration.stories.tsx`

- [ ] **Step 1: Grep residual**

Run: `rg "ReminderFilterPills|matchesReminderFilter|useReminderListFilter" src`

Expected: só stories ou zero hits

- [ ] **Step 2: Atualizar stories**

- Renomear story para `ReminderFilterDialog` **ou** apagar `ReminderFilterPills.stories.tsx` e adicionar story mínima do dialog.
- Em `ReminderListIntegration.stories.tsx`, usar estado `ReminderListFilter` + botão que abre o dialog (ou chips simplificados).

- [ ] **Step 3: Lint + tests**

```bash
npm test -- src/presentation/components/reminders/reminderFilter.test.ts
npx tsc --noEmit
```

Expected: PASS / 0 errors

- [ ] **Step 4: Commit** (se autorizado)

```bash
git add -A src/presentation/components/reminders \
  src/presentation/components/stories \
  src/app/(app)/reminders/page.tsx
git commit -m "$(cat <<'EOF'
chore(reminders): remove exclusive filter pills and update stories

EOF
)"
```

---

### Task 5: Branch + PR

- [ ] **Step 1: Ensure branch**

```bash
git checkout develop
git pull origin develop
git checkout -b fix/web-reminders-sort-filter
```

(Se o trabalho já foi feito em `develop` local, criar a branch antes da Task 1.)

- [ ] **Step 2: Push + PR** (quando o utilizador pedir)

```bash
git push -u origin HEAD
gh pr create --base develop --title "fix(web): ordenação e filtro combinável de lembretes" --body "$(cat <<'EOF'
## Summary
- Ordena lembretes por scheduledAt descendente (mais antigo embaixo)
- Substitui pills exclusivas por modal combinável Hoje + categoria (paridade tarefas/mobile)

## Test plan
- [ ] Abrir /reminders e confirmar ordem por data do lembrete (desc)
- [ ] Filtrar Hoje + uma categoria juntos
- [ ] Modo Básico: só Medicação e Consulta no modal
- [ ] Limpar filtros e chips
- [ ] npm test reminderFilter

EOF
)"
```

---

## Acceptance criteria (Branch 1)

- [ ] Lista ordenada por `scheduledAt` desc
- [ ] Filtro modal combinável Hoje + categoria
- [ ] Chips ativos + limpar
- [ ] Modo Básico com categorias reduzidas
- [ ] Pills exclusivas removidas da UX
- [ ] Testes do helper a passar
