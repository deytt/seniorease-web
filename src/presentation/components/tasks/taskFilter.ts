import type { Task, TaskCategory, TaskPriority } from "@/domain/entities/Task";
import {
  getTaskCategoryBadge,
  getTaskPriorityBadge,
} from "@/presentation/components/tasks/taskVisuals";

/**
 * Filtro combinável da lista de tarefas — paridade com o mobile
 * (`TaskFilter`: isToday + category + priority opcionais).
 */
export interface TaskListFilter {
  isToday: boolean;
  category: TaskCategory | null;
  priority: TaskPriority | null;
}

export const EMPTY_TASK_LIST_FILTER: TaskListFilter = {
  isToday: false,
  category: null,
  priority: null,
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
    !filter.isToday && filter.category === null && filter.priority === null
  );
}

export function taskListFilterActiveCount(filter: TaskListFilter): number {
  return (
    (filter.isToday ? 1 : 0) +
    (filter.category ? 1 : 0) +
    (filter.priority ? 1 : 0)
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
  task: Pick<Task, "dueDate" | "category" | "priority">,
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
  return true;
}

export function taskFilterChipLabels(filter: TaskListFilter): {
  today?: string;
  category?: string;
  priority?: string;
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
  };
}
