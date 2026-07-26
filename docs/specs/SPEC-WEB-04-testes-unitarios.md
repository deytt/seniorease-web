# SPEC-WEB-04 — Ampliar cobertura de testes unitários

**Prioridade:** 🟡 Médio  
**Estimativa:** 2–3 horas  
**Status:** Pendente  
**Responsável:** _a definir_

---

## Problema

O Mobile tem **300+ testes unitários** cobrindo as 3 camadas da Clean Architecture (Domain, Data, Presentation).
O Web tem **81 testes Vitest**, concentrados em utilitários de Presentation e Domain (apenas perfil e histórico).

Módulos sem nenhuma cobertura de testes:

| Módulo | Camada sem teste |
|--------|-----------------|
| Tarefas (Domain) | `CreateTaskUseCase`, `UpdateTaskUseCase`, `CompleteTaskUseCase` |
| Tarefas (Data) | `FirebaseTaskRepository` |
| Lembretes (Domain) | `CreateReminderUseCase`, `UpdateReminderUseCase` |
| Lembretes (Data) | `FirebaseReminderRepository` |
| Autenticação (Domain) | `SignInUseCase`, `SignUpUseCase`, `SignOutUseCase` |
| Preferências (Domain) | `SavePreferencesUseCase`, `GetPreferencesUseCase` |
| Preferências (Data) | `FirebasePreferencesRepository` |
| Histórico (Domain) | `LogHistoryEventUseCase` (partes não cobertas) |

---

## Estado atual dos testes

**Já cobertos (81 testes):**

| Arquivo de teste | Área |
|-----------------|------|
| `domain/usecases/profile/SaveUserProfileUseCase.test.ts` | Domain — perfil |
| `domain/validation/profileNameValidation.test.ts` | Domain — perfil |
| `domain/history/computeHistoryStats.test.ts` | Domain — histórico |
| `domain/usecases/notifications/CountTodayNotificationsUseCase.test.ts` | Domain — notificações |
| `presentation/components/dashboard/dashboardUtils.test.ts` | Presentation — dashboard |
| `presentation/components/tasks/taskFilter.test.ts` | Presentation — tarefas |
| `presentation/components/tasks/taskListUtils.test.ts` | Presentation — tarefas |
| `presentation/components/tasks/taskNavigationFeedback.test.ts` | Presentation — tarefas |
| `presentation/components/reminders/reminderFilter.test.ts` | Presentation — lembretes |
| `presentation/components/history/historyUtils.test.ts` | Presentation — histórico |
| `presentation/lib/feedbackToast.test.ts` | Presentation — feedback |
| `presentation/tour/*.test.ts` (12 arquivos) | Presentation — tours |

---

## Solução — Novos arquivos de teste a criar

### Prioridade 1 — Domain Use Cases (mais críticos; sem dependência Firebase)

#### `src/domain/usecases/tasks/CreateTaskUseCase.test.ts`

```typescript
// O que testar:
// - cria tarefa com todos os campos obrigatórios
// - título vazio lança ValidationError
// - título > 30 caracteres lança ValidationError
// - descrição > 100 caracteres lança ValidationError
// - passo com texto vazio é ignorado ou lança erro (verificar implementação)
// - chama repository.create() com os dados corretos
// - retorna a tarefa criada pelo repositório
```

#### `src/domain/usecases/tasks/CompleteTaskUseCase.test.ts`

```typescript
// O que testar:
// - chama repository.complete() com o taskId correto
// - propaga erros do repositório
// - tarefa já concluída: comportamento esperado (idempotência ou erro)
```

#### `src/domain/usecases/preferences/SavePreferencesUseCase.test.ts`

```typescript
// O que testar:
// - salva preferências com todos os campos
// - aplica lógica de `maximum` (darkMode=true + contrastMode=high → maximum)
// - chama repository.save() com preferências processadas
// - propaga erros do repositório
```

#### `src/domain/usecases/reminders/CreateReminderUseCase.test.ts`

```typescript
// O que testar:
// - cria lembrete com campos obrigatórios
// - título > 30 caracteres lança erro
// - data no passado lança ValidationError
// - chama repository.create() com os dados corretos
```

### Prioridade 2 — Validation helpers de tarefas

#### `src/domain/validation/taskValidation.test.ts`

```typescript
// (se existir validação centralizada)
// - título mínimo/máximo
// - descrição máximo
// - passo máximo
// - regras combinadas
```

### Prioridade 3 — Data layer (com mock do Firebase)

> Usar `vi.mock('@/infrastructure/firebase/config')` + repositórios com mocks de Firestore.
> Seguir o padrão dos testes existentes em `SaveUserProfileUseCase.test.ts`.

#### `src/infrastructure/firebase/FirebaseTaskRepository.test.ts`

```typescript
// O que testar:
// - getTasks() retorna array de Task mapeado corretamente
// - create() chama addDoc com os campos corretos (incluindo steps como array)
// - complete() atualiza status e completedAt
// - delete() chama deleteDoc com o ID correto
// - getTaskById() retorna null quando documento não existe
```

---

## Abordagem de implementação

1. **Mocks de repositório:** usar `vi.fn()` do Vitest para simular repositórios (sem Firebase real)
2. **Padrão:** seguir os testes existentes em `SaveUserProfileUseCase.test.ts` como template
3. **Executar:** `npm test` após cada arquivo — garantir 0 falhas antes de prosseguir

```bash
# Rodar um arquivo específico
npm test -- src/domain/usecases/tasks/CreateTaskUseCase.test.ts

# Rodar com cobertura
npm test -- --coverage
```

---

## Critérios de Aceitação

- [ ] Pelo menos 4 novos arquivos de teste criados (mínimo: `CreateTaskUseCase`, `CompleteTaskUseCase`, `SavePreferencesUseCase`, `CreateReminderUseCase`)
- [ ] Total de testes Vitest ≥ 100 após as adições
- [ ] `npm test` — 0 falhas
- [ ] ESLint e TypeScript sem erros nos novos arquivos
- [ ] Atualizar `memory-bank/progress.md`: marcar `[ ] Testes unitários — Domain, Data, Presentation` como `[x]` (ou atualizar o percentual)

---

## Referência

- Mobile: `docs/specs/SPEC-04-arquitetura.md` — padrão de testes das 3 camadas
- `memory-bank/progress.md` — `[ ] Testes unitários (Domain, Data, Presentation) — em andamento`
- Hackathon PDF: *"Testes, CI/CD e boas práticas"* como critério de avaliação
