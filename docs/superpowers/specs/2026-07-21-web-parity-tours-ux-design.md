# Design: Paridade Web (Lembretes, Dashboard, Guias, Tours, UX)

> Data: 2026-07-21  
> Base: `develop` (seniorease-web) alinhada com `origin/develop`  
> Memory-bank: submódulo pinado; branches `develop`/`master` locais equalizadas com remotes

---

## 1. Objetivo

Alinhar a web ao mobile e ao feedback de UX em cinco frentes isoladas, entregues em branches/PRs pequenos para `develop`.

## 2. Decisões fechadas (brainstorming)

| Tema | Decisão |
|------|---------|
| Ordenação lista/previews | **Descendente** por data do evento (`scheduledAt` / `dueDate`): quanto mais antigo, mais embaixo |
| Filtro de lembretes | Modal combinável (Hoje + categoria) + chips ativos, espelho da lista de Tarefas / mobile |
| Ajuda rápida | Substitui Histórico no grid do Dashboard; navega para Guia do aplicativo |
| Entrada do Guia | Dashboard **e** Definições/Perfil |
| Histórico após troca | Apenas navegação lateral/menu |
| Tours novos | Igual ao Perfil: botão `?` + oferta 1ª visita só em Modo Básico + listados no Guia |
| Preview lembretes | Só não concluídos **e** futuros (`scheduledAt >= agora`), ordenação desc, limite atual (3) |

## 3. Branches e ordem de merge

Todas partem de `develop` atualizada. Merge sequencial preferível (1→7) para reduzir conflitos em Dashboard/tour.

| # | Branch | Escopo |
|---|--------|--------|
| 1 | `fix/web-reminders-sort-filter` | `orderBy(scheduledAt, desc)`; filtro modal combinável + chips; remover pills exclusivas como UX principal |
| 2 | `fix/web-dashboard-previews` | Previews tarefas/lembretes com sort desc; lembretes incompletos+futuros |
| 3 | `feat/web-app-guides` | Quick action Ajuda rápida; rota `/guides`; link no Perfil; catálogo de tours |
| 4 | `feat/web-tour-infra` | Extrair helper genérico a partir de Perfil/Histórico (`startTour`, catálogo `TourId`, CSS partilhado) |
| 5 | `feat/web-tours-core-screens` | Tours: Dashboard, Tarefas (lista/criar/detalhe), Lembretes (lista/criar), Modo Guiado, Notificações, Acessibilidade; Histórico só se faltar no catálogo |
| 6 | `feat/web-tours-profile-settings` | Tours: Segurança, Sobre, Informações Pessoais, Endereço, Preferências de Notificação (e rotas de edição se forem páginas próprias) |
| 7 | `fix/web-ui-shell-polish` | Clique fora fecha menu mobile; ghost em “Sair do modo guiado” (+ iguais); largura container lembretes = `max-w-6xl` |

Documentação no memory-bank: após cada frente (ou no fim do lote), PR de docs no submódulo + bump do pin no web, como o time já faz.

## 4. Comportamento por frente

### 4.1 Lembretes — sort + filter

**Ordenação**

- `FirebaseReminderRepository.getReminders`: `orderBy("scheduledAt", "desc")`.
- UI não deve reordenar por `createdAt`.

**Filtro**

- Espelhar padrão de `/tasks`: botão Filtro (ícone + badge se ativo) abre `Dialog`.
- Estado combinável: `filterToday: boolean` + `filterCategory: ReminderCategory | null` (sem prioridade — lembretes não têm).
- Chips ativos abaixo do header com remoção individual + “Limpar filtros”.
- Em Modo Básico: categorias reduzidas (como hoje nas pills: medicação + consulta), mantendo o modal.
- Remover `ReminderFilterPills` da página (ou deixar de usar); lógica de match pode migrar para helpers testáveis.

### 4.2 Dashboard — previews

**Arquivo principal:** `dashboardUtils.ts` (+ testes existentes).

- `getTodayDashboardTasks`: após filtros de “hoje”, sort por `dueDate` **desc** (sem `dueDate` → fim da lista). Manter regra de concluídas vs pendentes se ainda fizer sentido com o Figma; se conflitar com “só data desc”, priorizar data desc e validar visualmente.
- `getUpcomingReminders`: manter `!isRead && scheduledAt >= now`; mudar sort para **desc**; `slice(0, limit)`.

### 4.3 Guia do aplicativo + Ajuda rápida

- Dashboard quick action: label “Ajuda rápida”, ícone adequado (paridade mobile), `href="/guides"`.
- Nova rota `src/app/(app)/guides/page.tsx` + screen em `presentation/components/guides/`.
- Lista de tutoriais disponíveis (catálogo estático de `TourId` + título + descrição curta em PT).
- Ao tocar: navegar para a rota da feature **ou** iniciar tour se já estiver na tela; preferir padrão mobile (navegar + sinal para iniciar). Na web, abordagem mínima: navegar para a rota alvo com query `?tour=1` **ou** iniciar imediatamente se a tela atual for a do guia — escolher uma e documentar na branch 3. **Recomendação:** `router.push(route)` + `sessionStorage` flag `seniorease:pendingTour=<tourId>`; a tela alvo lê e dispara o tour (reutilizável na infra).
- Entrada no Perfil/Definições: row/link “Guia do aplicativo” → `/guides`.
- Histórico permanece em `Navigation` (`/history`); some só do grid de ações rápidas.

### 4.4 Infra de tour (branch 4)

Extrair de `profileTour.ts` / `historyTour.ts`:

- `startSeniorEaseTour({ tourId, userId, steps })` — driver.js + CSS `profileTour.css` (renomear para `seniorEaseTour.css` se fizer sentido).
- Catálogo `TOUR_CATALOG`: `{ id, title, description, route, stepsModule }`.
- Hooks finos por tela (`useXxxTour`) só orquestram oferta 1ª visita + botão `?`.
- `tourStorage` permanece; novos IDs por tela.

### 4.5 Tours por tela (branches 5–6)

Para cada tela listada pelo produto:

- Selectors estáveis (`data-tour="..."`) nos alvos.
- Steps em PT, linguagem simples.
- Botão `?` no header (quando houver header próprio).
- `_maybeOfferFirstUse` equivalente: se Modo Básico && !offered → iniciar/oferecer uma vez.
- Entrada no catálogo do Guia.

Telas (checklist):

- Segurança, Sobre, Informações Pessoais, Endereço, Preferências de Notificação  
- Dashboard, Criar Tarefa, Detalhes da Tarefa, Lista de Tarefas  
- Criar Lembrete, Lista de Lembretes  
- Ver Histórico (já existe tour — garantir catálogo + paridade)  
- Ajustar Acessibilidade, Notificações, Tela de Modo Guiado  

### 4.6 UI / shell polish

1. **Menu hamburger:** com `isMobileOpen`, overlay clicável (área fora do `<nav>`) fecha o menu; Escape também fecha (acessibilidade).
2. **Sair do modo guiado:** remover background idle; manter hover/focus-visible. Auditar botões ghost similares (variant `ghost` com `bg-*` desnecessário) e alinhar.
3. **Largura lembretes:** página usa `max-w-5xl` dentro do shell `max-w-6xl` do layout → passar a `max-w-6xl` (ou remover constraint interna) para igualar Perfil (`max-w-6xl`).

## 5. Arquitetura técnica

- **Clean Architecture:** ordenação no repositório (Infrastructure); filtros combináveis na Presentation (como Tasks); Domain só se surgir tipo `ReminderFilter` partilhável — opcional, YAGNI até precisar de testes de domínio.
- **Sem ADR novo** salvo se a flag `pendingTour` / catálogo central mudar o contrato do Tour de forma estrutural; caso mude, ADR curto no memory-bank.
- **Textos:** português simples, sem jargão.
- **A11y:** alvos ≥ 44×44; contraste AA; overlay do menu com `aria-hidden` no conteúdo atrás se necessário.

## 6. Testes

- Atualizar/estender `dashboardUtils.test.ts` para sort desc e filtro de lembretes.
- Testes unitários dos helpers de filtro de lembretes (match combinável).
- Testes leves do catálogo de tours (IDs únicos, rotas presentes) na branch de infra.
- Smoke manual: ordenação, filtro, Guia, 1 tour por PR, menu overlay, largura desktop.

## 7. Fora de escopo

- Biometria web  
- Mudança de schema Firestore / indexes (confirmar se `orderBy desc` exige índice composto novo — se `userId + scheduledAt` já existir para asc, o índice costuma servir nos dois sentidos; validar no console se a query falhar)  
- FCM / VAPID  
- Alterar comportamento do Histórico além de remover o atalho do Dashboard  

## 8. Critérios de aceite (globais)

- [ ] Lista de lembretes: mais recente `scheduledAt` no topo  
- [ ] Filtro lembretes: Hoje + categoria combináveis, UI tipo Tarefas  
- [ ] Dashboard: previews desc; lembretes só incompletos futuros  
- [ ] Ajuda rápida → Guia; link no Perfil; Histórico só no menu  
- [ ] Tours nas telas listadas com padrão Perfil + catálogo  
- [ ] Menu fecha ao clicar fora; botão sair modo guiado sem bg idle; lembretes `max-w-6xl`  

---

## Aprovações

- Branches/ordem: aprovado  
- Comportamento funcional: aprovado  
- Spec escrita: pendente revisão do utilizador  
