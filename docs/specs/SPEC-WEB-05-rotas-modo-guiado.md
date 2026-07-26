# SPEC-WEB-05 — Documentar e validar rotas do Modo Guiado

**Prioridade:** 🟢 Baixo (verificação / documentação)  
**Estimativa:** 15 minutos  
**Status:** Pendente — confirmação e documentação  
**Responsável:** _a definir_

---

## Contexto

O projeto web tem duas rotas relacionadas ao Modo Guiado:

| Rota | Arquivo | Propósito |
|------|---------|-----------|
| `/tasks/guided` | `src/app/(app)/tasks/guided/page.tsx` | **Hub**: encontra a próxima tarefa com passos e redireciona para `/tasks/[id]/guided` |
| `/tasks/[id]/guided` | `src/app/(app)/tasks/[id]/guided/page.tsx` | **Tela real**: executa o Modo Guiado passo a passo para uma tarefa específica |

A análise inicial apontou isso como possível "rota duplicada". Após leitura do código, confirmou-se que **não é duplicação** — são duas rotas com propósitos distintos e complementares:

- O **hub** (`/tasks/guided`) é acessado pelos botões do Dashboard e da lista de tarefas quando o utilizador quer iniciar o Modo Guiado sem especificar uma tarefa. Ele busca automaticamente a próxima tarefa elegível e redireciona.
- A **tela real** (`/tasks/[id]/guided`) é a tela de execução, acessada pelo hub ou diretamente pelos cards de tarefa.

---

## Verificações a realizar

### 1. Confirmar que todos os pontos de entrada usam a rota correta

Verificar que os links/botões que apontam para o Modo Guiado usam:
- `/tasks/guided` — quando o utilizador quer iniciar sem escolher tarefa (Dashboard, lista)
- `/tasks/[id]/guided` — quando o utilizador já está nos detalhes de uma tarefa específica

```bash
rg "/tasks/guided" src/ --include="*.tsx" -n
```

### 2. Confirmar o estado vazio do hub

O hub já trata o estado onde não há tarefas com passos — exibe um card informativo com botões "Nova Tarefa" e "Ver Tarefas". Confirmar que este estado é testável e visualmente correto.

### 3. Confirmar que a meta descrição da rota não está errada no `systemPatterns.md`

O `systemPatterns.md` documenta a estrutura de pastas. Se necessário, adicionar uma nota explicativa sobre o hub vs. tela real.

---

## Ação recomendada

Nenhuma alteração de código necessária. Apenas:

- [ ] Executar `rg "/tasks/guided" src/` e confirmar que todos os links usam a rota correta
- [ ] Adicionar um comentário JSDoc no topo de `src/app/(app)/tasks/guided/page.tsx` explicando o propósito do hub:

```tsx
/**
 * Hub do Modo Guiado — encontra a próxima tarefa com passos pendentes
 * e redireciona para /tasks/[id]/guided.
 * Acessado pelo Dashboard e pela lista de tarefas quando o utilizador
 * não especifica uma tarefa.
 */
export default function GuidedTaskHubPage() { ... }
```

- [ ] (Opcional) Adicionar nota no `memory-bank/systemPatterns.md` — seção de estrutura web — explicando o padrão hub + tela

---

## Referência

- `src/app/(app)/tasks/guided/page.tsx` — hub (`GuidedTaskHubPage`)
- `src/app/(app)/tasks/[id]/guided/page.tsx` — tela real (`GuidedTaskPage`)
- `memory-bank/systemPatterns.md` — estrutura de pastas Web
