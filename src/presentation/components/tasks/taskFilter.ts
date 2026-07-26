import type { Task, TaskCategory, TaskPriority } from "@/domain/entities/Task";
import {
  getTaskCategoryBadge,
  getTaskPriorityBadge,
} from "@/presentation/components/tasks/taskVisuals";

/** "pending" = não concluídas; "completed" = concluídas; null = todas. */
export type TaskStatusFilter = "pending" | "completed" | null;

/**
 * Filtro combinável da lista de tarefas — paridade com o mobile
 * (`TaskFilter`: isToday + category + priority opcionais).
 */
export interface TaskListFilter {
  isToday: boolean;
  category: TaskCategory | null;
  priority: TaskPriority | null;
  status: TaskStatusFilter;
}

export const EMPTY_TASK_LIST_FILTER: TaskListFilter = {
  isToday: false,
  category: null,
  priority: null,
  status: null,
};

export const DEFAULT_TASK_LIST_FILTER = EMPTY_TASK_LIST_FILTER;

export const TASK_FILTER_CATEGORIES: TaskCategory[] = [
  "health",
  "medication",
  "social",
  "exercise",
  "personal",
];

export const TASK_FILTER_PRIORITIES: TaskPriority[] = [
  "high",
  "medium",
  "low",
];

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

export function taskCategoryLabel(category: TaskCategory): string {
  return getTaskCategoryBadge(category)?.label ?? category;
}

export function isTaskListFilterEmpty(filter: TaskListFilter): boolean {
  return (
    !filter.isToday &&
    filter.category === null &&
    filter.priority === null &&
    filter.status === null
  );
}

export function taskListFilterActiveCount(filter: TaskListFilter): number {
  return (
    (filter.isToday ? 1 : 0) +
    (filter.category ? 1 : 0) +
    (filter.priority ? 1 : 0) +
    (filter.status !== null ? 1 : 0)
  );
}

function isSameCivilDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function matchesTaskListFilter(
  task: Pick<Task, "dueDate" | "category" | "priority" | "status">,
  filter: TaskListFilter,
  now: Date = new Date(),
): boolean {
  if (filter.isToday) {
    if (!task.dueDate) return false;
    if (!isSameCivilDay(new Date(task.dueDate), now)) return false;
  }
  if (filter.category !== null && task.category !== filter.category) {
    return false;
  }
  if (filter.priority !== null && task.priority !== filter.priority) {
    return false;
  }
  if (filter.status === "completed" && task.status !== "completed") {
    return false;
  }
  if (filter.status === "pending" && task.status === "completed") {
    return false;
  }
  return true;
}

export const TASK_STATUS_LABELS: Record<NonNullable<TaskStatusFilter>, string> =
  {
    pending: "Pendentes",
    completed: "Concluídas",
  };

export function taskFilterChipLabels(filter: TaskListFilter): {
  today?: string;
  category?: string;
  priority?: string;
  status?: string;
} {
  return {
    today: filter.isToday ? "Hoje" : undefined,
    category: filter.category
      ? taskCategoryLabel(filter.category)
      : undefined,
    priority: filter.priority
      ? (getTaskPriorityBadge(filter.priority)?.label ??
        TASK_PRIORITY_LABELS[filter.priority])
      : undefined,
    status: filter.status ? TASK_STATUS_LABELS[filter.status] : undefined,
  };
}
