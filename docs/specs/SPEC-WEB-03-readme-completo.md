# SPEC-WEB-03 — README Web completo para entrega

**Prioridade:** 🟡 Médio  
**Estimativa:** 30 minutos  
**Status:** Pendente  
**Responsável:** _a definir_

---

## Problema

O README atual (`README.md`) é funcional mas incompleto em comparação ao padrão estabelecido pelo Mobile (SPEC-01, 2026-07-25) e pelos critérios de avaliação do Hackathon:

> "Os projetos devem estar no GitHub" + "README contendo tecnologias utilizadas e passo a passo para rodar a aplicação"

**O que falta no README atual:**

| Item ausente | Impacto |
|---|---|
| Proposta / público-alvo | Avaliador não sabe imediatamente o que o projeto faz |
| Lista das 13 telas implementadas | Não evidencia completude do escopo |
| Cobertura de testes (81 testes Vitest) | Não demonstra qualidade de código |
| Menção ao Storybook e número de stories | Perde um diferencial do projeto |
| Links do projeto (Vercel, Figma, repositório Mobile) | Avaliador tem que procurar externamente |
| Seção CI/CD | Não demonstra boas práticas de deploy |
| Estrutura de pastas detalhada | Não evidencia Clean Architecture |

---

## Solução — README.md reescrito

O novo README deve conter **todas** as seções abaixo.

```markdown
# SeniorEase Web

Plataforma web de acessibilidade e organização de atividades para pessoas idosas — 
Hackathon FIAP Inclusive (Pós-Graduação POSTECH FIAP).

Stack: **Next.js 16** (App Router) · TypeScript · Tailwind CSS · Firebase · Zustand · Storybook 10 · Vitest 3.

Arquitetura: **Clean Architecture** em `src/domain`, `src/infrastructure` e `src/presentation`.

---

## Sobre o Projeto

O **SeniorEase** foi desenvolvido para facilitar a vida digital de pessoas idosas, 
promovendo autonomia, confiança e inclusão. A plataforma web oferece:

- **Painel de Acessibilidade** — fonte ajustável (4 níveis), Dark Mode, 3 modos de contraste, 
  espaçamento configurável e Modo Básico / Avançado
- **Organizador de Tarefas** — criação, detalhes, modo guiado passo a passo com celebração Lottie
- **Central de Lembretes** — criação, edição, filtros e notificações push via FCM
- **Histórico** — estatísticas de sequência (streak) e atividade recente
- **Perfil** — foto, dados pessoais, endereço, preferências de notificação, segurança
- **Notificações** — sininho com badge, histórico completo, push via Cloud Functions

---

## Telas implementadas (13/13)

| # | Tela | Rota |
|---|------|------|
| 1 | Login | `/login` |
| 2 | Registro | `/register` |
| 3 | Esqueci a senha | `/forgot-password` |
| 4 | Tela de sucesso | `/success` |
| 5 | Dashboard | `/dashboard` |
| 6 | Central de Acessibilidade | `/accessibility` |
| 7 | Lista de Tarefas | `/tasks` |
| 8 | Detalhes da Tarefa | `/tasks/[id]` |
| 9 | Criar Tarefa | `/tasks/create` |
| 10 | Modo Guiado | `/tasks/[id]/guided` |
| 11 | Central de Lembretes | `/reminders` |
| 12 | Histórico | `/history` |
| 13 | Perfil | `/profile` |

---

## Links do Projeto

| Recurso | Link |
|---------|------|
| Deploy (Vercel) | https://seniorease-web.vercel.app/ |
| Repositório Mobile (Flutter) | https://github.com/deytt/seniorease-mobile |
| Figma Design | https://www.figma.com/design/3avWJD9n4gI9mZHw9dksIy/SeniorEase |
| Protótipo publicado | https://senior-ease.figma.site |
| Kanban do projeto | https://github.com/users/deytt/projects/3 |

---

## Pré-requisitos

- Node.js 20+
- Conta no projeto Firebase `seniorease-backend`

---

## Instalação

```bash
# Clonar com submódulo
git clone --recurse-submodules https://github.com/deytt/seniorease-web.git
cd seniorease-web

# Se já clonou sem submódulo:
git submodule update --init --recursive

# Dependências
npm install

# Variáveis de ambiente
cp .env.example .env.local
# Preencha .env.local com as chaves do Firebase (nunca commitar .env.local)
```

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript (`tsc --noEmit`) |
| `npm test` | Vitest — testes unitários |
| `npm run storybook` | Storybook em http://localhost:6006 |

---

## Variáveis de ambiente

Veja `.env.example`. Todas as chaves públicas do Firebase usam o prefixo `NEXT_PUBLIC_`.

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web SDK |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Projeto |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage (foto de perfil) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App Web |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Push Web (FCM) — obrigatória para notificações |

---

## Cobertura de Testes

- **81 testes Vitest** cobrindo Domain, Presentation e utilitários:
  - Domain: `SaveUserProfileUseCase`, `profileNameValidation`, `computeHistoryStats`, `CountTodayNotificationsUseCase`
  - Presentation: `dashboardUtils`, `taskFilter`, `reminderFilter`, `taskListUtils`, `historyUtils`, `taskNavigationFeedback`, `feedbackToast`
  - Tours: 12 arquivos de tour steps + `tourStorage`, `tourCatalog`, `resolveTourRoute`

```bash
npm test          # rodar todos os testes
npm test -- --coverage  # com relatório de cobertura
```

---

## Design System (Storybook)

19 stories documentando os componentes base e features:

- **UI:** Avatar, Badge, Button, Card, Checkbox, Dialog, DropdownMenu, Input, Label, Separator, Sheet, Switch, Toast, Tooltip, Sooner
- **Features:** ReminderCard, ReminderFilterChips, TaskCard, ReminderListIntegration

```bash
npm run storybook  # abre em http://localhost:6006
```

---

## CI/CD

**GitHub Actions** (`.github/workflows/web.yml`):

- **CI** (push/PR em `develop` e `master`): lint + type-check + build + testes Vitest
- **CD** (push em `master`): deploy automático no Vercel via `--prebuilt`

Secrets necessários: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` + variáveis Firebase.

---

## Estrutura de pastas

```
src/
├── domain/               # Entidades, casos de uso, contratos (sem dependência de framework)
│   ├── entities/         # Task, Reminder, UserPreferences, HistoryEvent…
│   ├── usecases/         # CreateTaskUseCase, SavePreferencesUseCase…
│   └── repositories/     # ITaskRepository, IPreferencesRepository… (interfaces)
├── infrastructure/       # Implementações Firebase, cache
│   └── firebase/         # FirebaseTaskRepository, FirebaseAuthRepository…
├── presentation/         # UI, componentes, providers, hooks, tours
│   ├── components/       # Por domínio: tasks/, reminders/, profile/, dashboard/…
│   ├── providers/        # AuthProvider, PreferencesProvider, FCMProvider
│   └── tour/             # Infra de tour guiado (driver.js)
├── lib/                  # DI, feedback, utils compartilhados
└── app/                  # Rotas Next.js App Router
    ├── (auth)/           # login/, register/, forgot-password/
    └── (app)/            # dashboard/, tasks/, reminders/, profile/, history/…
memory-bank/              # Submódulo: brief, schema Firestore, ADRs, progresso
```

---

## Dados de demonstração

O dashboard não grava exemplos automaticamente.
Com a lista vazia, use o botão **"Carregar exemplos"** para popular dados de demonstração no Firestore.

---

## Memory Bank

Antes de implementar features, leia os arquivos em `memory-bank/`.
Após mudanças de schema/rules, atualize o submódulo:

```bash
git submodule update --remote
```
```

---

## Critérios de Aceitação

- [ ] README contém seção de proposta / público-alvo
- [ ] README lista as 13 telas com rotas
- [ ] README tem tabela de links (Vercel, Mobile, Figma, Protótipo, Kanban)
- [ ] README menciona 81 testes e comando `npm test`
- [ ] README menciona Storybook com 19 stories e comando `npm run storybook`
- [ ] README tem seção CI/CD
- [ ] README tem estrutura de pastas anotada com responsabilidade de cada camada
- [ ] Nenhum dado sensível (token, chave) no README

---

## Referência

- Mobile: `README.md` (SPEC-01, 2026-07-25) — modelo de referência
- Hackathon PDF: *"README contendo tecnologias utilizadas e passo a passo para rodar a aplicação"*
- Fase 1 PDF: *"README do projeto desenvolvido com todas as informações para executá-lo"*
