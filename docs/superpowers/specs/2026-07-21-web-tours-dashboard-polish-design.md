# Design: Polish de Tours, Dashboard, Botões e Toasts (Web)

> Data: 2026-07-21  
> Base: `develop` (seniorease-web)  
> Idioma de UI e docs desta frente: português (Brasil)  
> Entrega: **uma branch única** + **um PR** no fim

---

## 1. Objetivo

Corrigir regressões e inconsistências do lote de paridade (PRs #38–#44): tours desalinhados, botão `?` inconsistente, dashboard sem tarefas de hoje, redirect do modo guiado, botões Voltar/Sair com fundo azul idle, e toasts com botão Close.

---

## 2. Decisões fechadas (brainstorming)

| Tema | Decisão |
|------|---------|
| Sair do modo guiado (sem concluir) | `/tasks` |
| Concluir tarefa no modo guiado | `/dashboard` |
| Filtro “Tarefas de hoje” | Regra **B**: `dueDate` no dia civil de hoje **ou** pendente/`in_progress` sem `dueDate` |
| Tours — cobertura | Padrão **A**: em **todas** as telas com tour → (1) overview do título/header + (2) passo no CTA principal + passos de conteúdo |
| Entrega | Branch única (**B**); um PR no fim |
| Toasts | Sem Close; duração padrão do Sonner (**C**); padronizar `success` / `error` |
| Botão `?` | Estilo do Perfil: `size-11`, `rounded-[14px]`, `variant="outline"` |
| Voltar / Sair do modo guiado | Sem fundo azul idle; fundo só no hover |
| Guia / copy | “Painel” → **“Dashboard”** |
| Ordenação previews | Descendente (mais antigo embaixo), alinhado ao mobile |
| Preview lembretes | Só não concluídos (`!isRead`); futuros (`scheduledAt >= agora`); desc |
| Índice Firestore DESC | Sem acesso ao Console: ordenar lembretes no cliente (ASC + reverse ou sort em memória) até o índice existir |

---

## 3. Causa raiz — “Tarefas de hoje” vazias

O dashboard faz `Promise.all([getTasks, getReminders])`. Se lembretes falham (ex.: índice composto `userId` + `scheduledAt DESC` em falta), **a Promise rejeita**, não há `catch`, e `tasks` permanece `[]`. A secção “Tarefas de hoje” fica vazia mesmo com tarefas válidas.

**Correção:** carregar tarefas e lembretes de forma isolada; falha de um não zera o outro; feedback de erro via toast padronizado quando aplicável.

**Mitigação de índice:** `getReminders` deixa de exigir `orderBy(..., "desc")` no servidor; ordenação desc no cliente.

---

## 4. Escopo por frente

### 4.1 Dashboard — dados e preview

- Isolar fetches de tasks/reminders
- Manter `getTodayDashboardTasks` com regra B; reforçar testes
- Manter `getUpcomingReminders`: `!isRead` + futuro + sort desc
- Validar sort desc nos previews (testes já cobrem; garantir dados a chegar)

### 4.2 Modo guiado — redirect

- “Sair do Modo Guiado” → `/tasks`
- Após celebração de conclusão → `/dashboard`
- Auditar fluxo de conclusão para não redirecionar indevidamente para `/tasks`

### 4.3 Tours e Guia

- **Dashboard:** incluir passo no bloco de status de acessibilidade; corrigir posicionamento do highlight de ações rápidas (`data-tour`, `side`/scroll); copy “Dashboard”
- **Catálogo Guia:** título “Dashboard” (não “Painel”)
- **Minhas tarefas:** passo dedicado no botão Nova Tarefa (`data-tour`)
- **Auditoria global (padrão A):** cada tour com header overview + CTA principal destacado
- **Acessibilidade:** migrar de `TourSpotlight` custom para `usePageTour` + `startSeniorEaseTour` (driver.js), oferta Modo Básico, persistência de conclusão, `TourHelpButton`
- **`TourHelpButton`:** alinhar ao Perfil (`rounded-[14px]`); Perfil/Histórico podem passar a usar o componente partilhado

### 4.4 Botões Voltar / Sair

- Padronizar classe hover-only (transparent idle) em:
  - páginas com `variant="ghost"` azul do DS (tarefas, lembretes, acessibilidade, etc.)
  - `profileFormPageShell`
  - “Sair do Modo Guiado”
- Extrair util/classe partilhada se reduzir duplicação (ex.: `backNavButtonClassName`)

### 4.5 Toasts

- `Toaster`: `closeButton={false}`
- Helper opcional `notifySuccess` / `notifyError` se ajudar consistência
- Garantir fluxos de CRUD principais usam success/error (onde já faz sentido; não inventar toasts em ecrãs que não precisam)

---

## 5. Fora de escopo

- Publicar índice no Firebase Console (sem acesso; mitigação client-side)
- Novos tours em telas que ainda não têm tour
- Redesign visual geral do Dashboard / Figma novo
- Alterar regra de filtro “Hoje” na lista `/tasks` (só dashboard nesta frente)

---

## 6. Entrega e verificação

| Item | Como verificar |
|------|----------------|
| Tarefas de hoje | Com tarefas de hoje (e/ou pendentes sem data), preview preenche mesmo se lembretes falharem |
| Lembretes preview | Só incompletos futuros; ordem desc |
| Tours | `?` igual ao Perfil; Dashboard inclui a11y; Tarefas inclui Nova Tarefa; Acessibilidade = mesmo motor |
| Guia | Entrada “Dashboard” |
| Modo guiado | Sair → Tarefas; concluir → Dashboard |
| Voltar / Sair | Sem pill azul em idle |
| Toasts | Sem Close; success/error coerentes |

Memory-bank: atualizar `activeContext.md` / `progress.md` no fim (e changelog de índices se a mitigação client-side ficar documentada).

---

## 7. Riscos

| Risco | Mitigação |
|-------|-----------|
| Índice DESC ainda em falta | Sort client-side em `FirebaseReminderRepository` |
| Tour Acessibilidade longo na migração | Reutilizar textos dos passos atuais; só mudar motor/UI |
| Ghost do Button DS vs hover-only | Override explícito partilhado; não mudar o token `ghost` global do DS sem acordo (esta frente só nos botões Voltar/Sair) |
