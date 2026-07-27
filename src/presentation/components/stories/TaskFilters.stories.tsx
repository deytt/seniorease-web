import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { Filter } from "lucide-react";

import { TaskActiveFilterBar } from "@/presentation/components/tasks/taskActiveFilterBar";
import {
  DEFAULT_TASK_LIST_FILTER,
  isTaskListFilterEmpty,
  taskListFilterActiveCount,
  type TaskListFilter,
} from "@/presentation/components/tasks/taskFilter";
import { TaskFilterSheet } from "@/presentation/components/tasks/taskFilterSheet";
import { Button } from "@/presentation/components/ui/button";

const meta = {
  title: "Domínio/Tarefas/Filtros",
  component: TaskActiveFilterBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Composição real dos filtros da lista de tarefas: botão disparador, diálogo de seleção e barra de filtros ativos.

### Comportamento
O diálogo mantém um rascunho até **Aplicar filtros**. Hoje, categoria, prioridade e status podem ser combinados; cada chip remove somente seu próprio critério.

### Modo Básico
Prioridade usa a classe \`advanced-only\` e não deve aparecer quando a interface está no modo simplificado.

### Acessibilidade
O contador informa quantos critérios estão ativos. Chips possuem rótulos de remoção específicos e o diálogo gerencia foco e teclado.
        `,
      },
    },
  },
} satisfies Meta<typeof TaskActiveFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function TaskFiltersDemo({ initial }: { initial: TaskListFilter }) {
  const [filter, setFilter] = useState(initial);
  const [open, setOpen] = useState(false);
  const count = taskListFilterActiveCount(filter);

  return (
    <div className="w-full max-w-xl space-y-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <Filter aria-hidden="true" />
        Filtrar
        {count > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {count}
          </span>
        ) : null}
      </Button>

      {!isTaskListFilterEmpty(filter) ? (
        <TaskActiveFilterBar
          filter={filter}
          onRemoveToday={() =>
            setFilter((current) => ({ ...current, isToday: false }))
          }
          onRemoveCategory={() =>
            setFilter((current) => ({ ...current, category: null }))
          }
          onRemovePriority={() =>
            setFilter((current) => ({ ...current, priority: null }))
          }
          onRemoveStatus={() =>
            setFilter((current) => ({ ...current, status: null }))
          }
        />
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum filtro ativo</p>
      )}

      <TaskFilterSheet
        open={open}
        onOpenChange={setOpen}
        initialFilter={filter}
        onApply={setFilter}
      />
    </div>
  );
}

export const SemFiltros: Story = {
  args: {
    filter: DEFAULT_TASK_LIST_FILTER,
    onRemoveToday: () => {},
    onRemoveCategory: () => {},
    onRemovePriority: () => {},
    onRemoveStatus: () => {},
  },
  render: () => <TaskFiltersDemo initial={DEFAULT_TASK_LIST_FILTER} />,
};

export const Combinados: Story = {
  args: {
    filter: {
      isToday: true,
      category: "health",
      priority: "high",
      status: "pending",
    },
    onRemoveToday: () => {},
    onRemoveCategory: () => {},
    onRemovePriority: () => {},
    onRemoveStatus: () => {},
  },
  render: () => (
    <TaskFiltersDemo
      initial={{
        isToday: true,
        category: "health",
        priority: "high",
        status: "pending",
      }}
    />
  ),
};
