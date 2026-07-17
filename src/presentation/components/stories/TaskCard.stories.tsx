import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React from "react";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/presentation/components/ui/badge";
import type { Task, TaskPriority, TaskCategory } from "@/domain/entities/Task";

/**
 * `TaskCard` é o componente que exibe uma tarefa individual na lista de tarefas (`/tasks`).
 * Mostra status de conclusão, título, prioridade, categoria, data e hora de vencimento.
 *
 * ## Estrutura
 * - **Checkbox** (esquerda): indica se a tarefa está concluída
 * - **Conteúdo** (centro):
 *   - Título em negrito
 *   - Badges: prioridade + categoria
 *   - Data e hora de vencimento
 * - **Ações** (direita): links para detalhes
 *
 * ## Estados
 * - **Pendente** (status="pending"): fundo branco, texto escuro
 * - **Concluído** (status="completed"): fundo cinzento, opacity-70, texto com strikethrough
 *
 * ## Responsividade
 * - Desktop: layout horizontal com ações à direita
 * - Mobile: layout adaptado com wrap conforme necessário
 *
 * ## Caso de Uso
 * Usado em `/tasks` dentro de uma lista renderizada com map().
 * Clicável para navegar para `/tasks/[id]` (detalhes).
 */
const meta = {
  title: "Features/TaskCard",
  component: () => <div>TaskCard Example</div>,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Card de tarefa individual na lista de tarefas com status, prioridade, categoria e data de vencimento.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "700px", padding: "20px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper: getBadgeColors
function getPriorityBadge(priority: TaskPriority) {
  const badges: Record<
    TaskPriority,
    { bg: string; text: string; label: string }
  > = {
    low: { bg: "bg-blue-100", text: "text-blue-800", label: "Baixa" },
    medium: { bg: "bg-amber-100", text: "text-amber-800", label: "Média" },
    high: { bg: "bg-red-100", text: "text-red-800", label: "Alta" },
  };
  return badges[priority];
}

function getCategoryBadge(category: TaskCategory) {
  const badges: Record<
    TaskCategory,
    { bg: string; text: string; label: string }
  > = {
    medication: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      label: "Medicação",
    },
    health: { bg: "bg-green-100", text: "text-green-800", label: "Saúde" },
    exercise: { bg: "bg-blue-100", text: "text-blue-800", label: "Exercício" },
    social: { bg: "bg-pink-100", text: "text-pink-800", label: "Social" },
    personal: { bg: "bg-gray-100", text: "text-gray-800", label: "Pessoal" },
  };
  return badges[category];
}

const TaskCardComponent = ({
  task,
  isCompleted,
}: {
  task: Task;
  isCompleted: boolean;
}) => {
  const priorityBadge = getPriorityBadge(task.priority);
  const categoryBadge = getCategoryBadge(task.category);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex items-center gap-4 bg-card border rounded-xl px-5 py-4 hover:shadow-sm transition-shadow ${
        isCompleted ? "opacity-70" : ""
      }`}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="size-6 text-primary" />
        ) : (
          <div className="size-6 rounded-full border-2 border-muted-foreground/40" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3
          className={`font-bold text-base leading-tight truncate ${
            isCompleted ? "text-muted-foreground line-through" : ""
          }`}
        >
          {task.title}
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            className={`text-xs font-semibold ${priorityBadge.bg} ${priorityBadge.text}`}
          >
            {priorityBadge.label}
          </Badge>
          <Badge
            className={`text-xs font-semibold ${categoryBadge.bg} ${categoryBadge.text}`}
          >
            {categoryBadge.label}
          </Badge>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>
              {formatDate(task.dueDate)} às {formatTime(task.dueDate)}
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 cursor-pointer"
        onClick={() => console.log("Navigate to task details")}
      >
        Ver
      </Button>
    </div>
  );
};

const mockTaskPending: Task = {
  id: "task-1",
  userId: "user-123",
  title: "Fazer compras no mercado",
  description: "Leite, pão, ovos e frutas",
  priority: "medium",
  category: "personal",
  status: "pending",
  dueDate: new Date(Date.now() + 86400000), // amanhã
  steps: [],
  notified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTaskCompleted: Task = {
  ...mockTaskPending,
  id: "task-2",
  status: "completed",
};

const mockTaskHighPriority: Task = {
  ...mockTaskPending,
  id: "task-3",
  title: "Consulta com o cardiologista",
  priority: "high",
  category: "health",
  dueDate: new Date(Date.now() + 3600000), // 1 hora
};

const mockTaskMedication: Task = {
  ...mockTaskPending,
  id: "task-4",
  title: "Tomar medicação - Hipertensão",
  priority: "high",
  category: "medication",
  dueDate: new Date(Date.now() + 1800000), // 30 minutos
};

/**
 * Card padrão: tarefa pendente com prioridade média.
 */
export const Default: Story = {
  render: () => (
    <TaskCardComponent task={mockTaskPending} isCompleted={false} />
  ),
};

/**
 * Tarefa concluída: visual diferente (cinzento, opacity reduzida).
 */
export const Completed: Story = {
  render: () => (
    <TaskCardComponent task={mockTaskCompleted} isCompleted={true} />
  ),
};

/**
 * Prioridade alta (vermelho) com categoria "Saúde".
 * Indica urgência visual.
 */
export const HighPriority: Story = {
  render: () => (
    <TaskCardComponent task={mockTaskHighPriority} isCompleted={false} />
  ),
};

/**
 * Tarefa de medicação com prioridade alta e vencimento próximo (30 minutos).
 * Caso comum para usuários idosos.
 */
export const MedicationReminder: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-2 rounded">
        ⚠️ Vencimento em 30 minutos
      </div>
      <TaskCardComponent task={mockTaskMedication} isCompleted={false} />
    </div>
  ),
};

/**
 * Lista de múltiplos cards para demonstrar layout em série.
 */
export const TaskList: Story = {
  render: () => (
    <div className="space-y-3">
      <h2 className="text-lg font-bold mb-4">Minhas Tarefas</h2>
      <TaskCardComponent task={mockTaskMedication} isCompleted={false} />
      <TaskCardComponent task={mockTaskHighPriority} isCompleted={false} />
      <TaskCardComponent task={mockTaskPending} isCompleted={false} />
      <TaskCardComponent task={mockTaskCompleted} isCompleted={true} />
    </div>
  ),
};
