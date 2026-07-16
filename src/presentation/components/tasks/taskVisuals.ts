import type { TaskCategory, TaskPriority } from "@/domain/entities/Task";

export interface TaskBadgeStyle {
  label: string;
  className: string;
}

const CATEGORY_BADGES: Record<TaskCategory, TaskBadgeStyle> = {
  medication: {
    label: "Medicação",
    className:
      "text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  health: {
    label: "Saúde",
    className:
      "text-blue-600 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  },
  exercise: {
    label: "Exercício",
    className:
      "text-purple-600 bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
  },
  social: {
    label: "Social",
    className:
      "text-pink-600 bg-pink-50 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-400",
  },
  personal: {
    label: "Pessoal",
    className:
      "text-gray-600 bg-gray-50 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400",
  },
};

const PRIORITY_BADGES: Record<TaskPriority, TaskBadgeStyle> = {
  high: {
    label: "Alta",
    className:
      "text-orange-600 bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
  },
  medium: {
    label: "Média",
    className:
      "text-yellow-600 bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  low: {
    label: "Baixa",
    className:
      "text-green-600 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:text-green-400",
  },
};

export function getTaskCategoryBadge(
  category: TaskCategory | undefined,
): TaskBadgeStyle | null {
  if (!category) return null;
  return CATEGORY_BADGES[category];
}

export function getTaskPriorityBadge(
  priority: TaskPriority | undefined,
): TaskBadgeStyle | null {
  if (!priority) return null;
  return PRIORITY_BADGES[priority];
}
